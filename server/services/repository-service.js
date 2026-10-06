import { Op } from "sequelize";
import {
  Repository,
  RepositoryLanguage,
  sequelize,
} from "../models/index.js";
import {
  getGithubUsername,
  githubRequest,
} from "./github-api.js";
import { recalculateSkillsFromRepositories } from "./skill-service.js";

export const getRepositories = async ({
  page = 1,
  limit = 12,
  search = "",
  language = "",
  sort = "updated",
}) => {
  const offset = (page - 1) * limit;
  const where = { isPrivate: false };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { fullName: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }
  if (language) where.primaryLanguage = language;

  const orderBySort = {
    stars: [["stars", "DESC"], ["forks", "DESC"]],
    forks: [["forks", "DESC"], ["stars", "DESC"]],
    name: [["name", "ASC"]],
    oldest: [["githubCreatedAt", "ASC"]],
    updated: [["updatedAt", "DESC"]],
  };
  const { rows, count } = await Repository.findAndCountAll({
    where,
    order: orderBySort[sort] || orderBySort.updated,
    limit,
    offset,
    distinct: true,
  });
  const totalPages = Math.ceil(count / limit);

  return {
    repositories: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getRepositoryById = (id) =>
  Repository.findOne({
    where: { id, isPrivate: false },
    include: [
      {
        model: RepositoryLanguage,
        as: "languages",
        attributes: ["id", "language", "bytes"],
        separate: true,
        order: [["bytes", "DESC"]],
      },
    ],
  });

export const getRepositoryByName = (name) =>
  Repository.findOne({
    where: { name, isPrivate: false },
    include: [
      {
        model: RepositoryLanguage,
        as: "languages",
        attributes: ["id", "language", "bytes"],
        separate: true,
        order: [["bytes", "DESC"]],
      },
    ],
  });

export const getRepositoryLanguages = (repositoryId) =>
  RepositoryLanguage.findAll({
    where: { repositoryId },
    order: [["bytes", "DESC"]],
  });

const mapRepository = (repo) => ({
  githubId: repo.id,
  name: repo.name,
  fullName: repo.full_name,
  description: repo.description,
  htmlUrl: repo.html_url,
  homepage: repo.homepage || null,
  stars: repo.stargazers_count || 0,
  forks: repo.forks_count || 0,
  watchers: repo.watchers_count || 0,
  openIssues: repo.open_issues_count || 0,
  primaryLanguage: repo.language || null,
  isFork: Boolean(repo.fork),
  isPrivate: Boolean(repo.private),
  githubCreatedAt: repo.created_at || null,
  githubUpdatedAt: repo.updated_at || null,
  githubPushedAt: repo.pushed_at || null,
});

const fetchRepositories = async (username) => {
  const repositories = [];
  let page = 1;

  while (true) {
    const result = await githubRequest(
      `/users/${encodeURIComponent(username)}/repos?type=owner&per_page=100&page=${page}&sort=updated`
    );
    if (!Array.isArray(result)) {
      throw new Error("GitHub returned an invalid repository list");
    }
    repositories.push(...result.filter((repo) => !repo.private));
    if (result.length < 100) return repositories;
    page += 1;
  }
};

const fetchRepositoryLanguages = async (repositories) => {
  const languages = [];
  for (const repo of repositories) {
    const [owner, name] = repo.full_name.split("/");
    const result = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/languages`
    );
    if (!result || Array.isArray(result) || typeof result !== "object") {
      throw new Error(`GitHub returned invalid language data for ${repo.full_name}`);
    }
    languages.push({ githubId: repo.id, languages: result });
  }
  return languages;
};

export const syncRepositories = async () => {
  const username = getGithubUsername();
  const githubRepositories = await fetchRepositories(username);
  const repositoryLanguages =
    await fetchRepositoryLanguages(githubRepositories);
  const repositoryRows = githubRepositories.map(mapRepository);
  const languagesByGithubId = new Map(
    repositoryLanguages.map(({ githubId, languages }) => [
      String(githubId),
      languages,
    ])
  );

  const result = await sequelize.transaction(async (transaction) => {
    if (repositoryRows.length) {
      await Repository.bulkCreate(repositoryRows, {
        updateOnDuplicate: [
          "name",
          "fullName",
          "description",
          "htmlUrl",
          "homepage",
          "stars",
          "forks",
          "watchers",
          "openIssues",
          "primaryLanguage",
          "isFork",
          "isPrivate",
          "githubCreatedAt",
          "githubUpdatedAt",
          "githubPushedAt",
        ],
        transaction,
      });
    }

    const savedRepositories = repositoryRows.length
      ? await Repository.findAll({
          where: {
            githubId: {
              [Op.in]: repositoryRows.map((repo) => repo.githubId),
            },
          },
          attributes: ["id", "githubId"],
          transaction,
        })
      : [];
    const repositoryIds = savedRepositories.map((repository) => repository.id);
    const repositoryIdByGithubId = new Map(
      savedRepositories.map((repository) => [
        String(repository.githubId),
        repository.id,
      ])
    );

    if (repositoryIds.length) {
      await RepositoryLanguage.destroy({
        where: { repositoryId: { [Op.in]: repositoryIds } },
        transaction,
      });
    }

    const languageRows = [];
    for (const [githubId, languages] of languagesByGithubId) {
      const repositoryId = repositoryIdByGithubId.get(githubId);
      if (!repositoryId) {
        throw new Error("Synced repository could not be loaded from the database");
      }
      for (const [language, bytes] of Object.entries(languages)) {
        languageRows.push({ repositoryId, language, bytes });
      }
    }

    if (languageRows.length) {
      await RepositoryLanguage.bulkCreate(languageRows, { transaction });
    }

    const skills = await recalculateSkillsFromRepositories(transaction);
    return {
      repositoriesSynced: repositoryRows.length,
      languagesSynced: languageRows.length,
      skillsUpdated: skills.totalSkillsUpdated,
      staleRepositoriesRetained: true,
    };
  });

  return result;
};
