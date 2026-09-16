import { Op } from "sequelize";

import {
  Repository,
  RepositoryLanguage,
} from "../models/index.js";

const GITHUB_API = "https://api.github.com";

const GITHUB_USERNAME =
  process.env.GITHUB_USERNAME;

const GITHUB_TOKEN =
  process.env.GITHUB_TOKEN;

/**
 * GitHub API headers
 */
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (GITHUB_TOKEN) {
  githubHeaders.Authorization =
    `Bearer ${GITHUB_TOKEN}`;
}

/**
 * GitHub API request
 */
const githubRequest = async (endpoint) => {
  const response = await fetch(
    `${GITHUB_API}${endpoint}`,
    {
      headers: githubHeaders,
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `GitHub API error ${response.status}: ${errorText}`
    );
  }

  return response.json();
};

/**
 * Get repositories
 *
 * Supports:
 * - pagination
 * - search
 * - language filter
 * - sorting
 */
export const getRepositories = async ({
  page = 1,
  limit = 12,
  search = "",
  language = "",
  sort = "updated",
}) => {
  const offset = (page - 1) * limit;

  const where = {};

  /**
   * Search
   */
  if (search) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        fullName: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        description: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  /**
   * Language filter
   */
  if (language) {
    where.primaryLanguage = language;
  }

  /**
   * Sorting
   */
  let order = [
    ["updatedAt", "DESC"],
  ];

  switch (sort) {
    case "stars":
      order = [
        ["stars", "DESC"],
        ["forks", "DESC"],
      ];
      break;

    case "forks":
      order = [
        ["forks", "DESC"],
        ["stars", "DESC"],
      ];
      break;

    case "name":
      order = [
        ["name", "ASC"],
      ];
      break;

    case "oldest":
      order = [
        ["githubCreatedAt", "ASC"],
      ];
      break;

    case "updated":
    default:
      order = [
        ["updatedAt", "DESC"],
      ];
      break;
  }

  const {
    rows,
    count,
  } = await Repository.findAndCountAll({
    where,

    order,

    limit,

    offset,

    distinct: true,
  });

  return {
    repositories: rows,

    pagination: {
      page,
      limit,
      total: count,

      totalPages: Math.ceil(
        count / limit
      ),

      hasNextPage:
        page < Math.ceil(count / limit),

      hasPreviousPage:
        page > 1,
    },
  };
};

/**
 * Get repository by database ID
 */
export const getRepositoryById = async (
  id
) => {
  return Repository.findByPk(id, {
    include: [
      {
        model: RepositoryLanguage,
        as: "languages",
        attributes: [
          "id",
          "language",
          "bytes",
        ],
        order: [["bytes", "DESC"]],
      },
    ],
  });
};

/**
 * Get repository by GitHub repository name
 */
export const getRepositoryByName = async (
  name
) => {
  return Repository.findOne({
    where: {
      name,
    },

    include: [
      {
        model: RepositoryLanguage,
        as: "languages",
        attributes: [
          "id",
          "language",
          "bytes",
        ],
      },
    ],
  });
};

/**
 * Get repository languages
 */
export const getRepositoryLanguages =
  async (repositoryId) => {
    return RepositoryLanguage.findAll({
      where: {
        repositoryId,
      },

      order: [
        ["bytes", "DESC"],
      ],
    });
  };

/**
 * Sync repositories from GitHub
 */
export const syncRepositories =
  async () => {
    if (!GITHUB_USERNAME) {
      throw new Error(
        "GITHUB_USERNAME is not configured"
      );
    }

    let page = 1;

    const perPage = 100;

    let totalSynced = 0;

    let totalLanguages = 0;

    while (true) {
      const repositories =
        await githubRequest(
          `/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&sort=updated`
        );

      if (!repositories.length) {
        break;
      }

      for (const repo of repositories) {
        /**
         * Skip private repositories
         */
        if (repo.private) {
          continue;
        }

        /**
         * Save repository
         */
        const [repository] =
          await Repository.upsert(
            {
              githubId: repo.id,

              name: repo.name,

              fullName:
                repo.full_name,

              description:
                repo.description,

              htmlUrl:
                repo.html_url,

              homepage:
                repo.homepage ||
                null,

              stars:
                repo.stargazers_count ||
                0,

              forks:
                repo.forks_count ||
                0,

              watchers:
                repo.watchers_count ||
                0,

              openIssues:
                repo.open_issues_count ||
                0,

              primaryLanguage:
                repo.language ||
                null,

              isFork:
                repo.fork || false,

              isPrivate:
                repo.private || false,

              githubCreatedAt:
                repo.created_at ||
                null,

              githubUpdatedAt:
                repo.updated_at ||
                null,

              githubPushedAt:
                repo.pushed_at ||
                null,
            },
            {
              returning: true,
            }
          );

        totalSynced++;

        /**
         * Sync repository languages
         */
        try {
          const languages =
            await githubRequest(
              `/repos/${GITHUB_USERNAME}/${repo.name}/languages`
            );

          /**
           * Delete old language records
           *
           * This prevents duplicate
           * language rows after syncing.
           */
          await RepositoryLanguage.destroy(
            {
              where: {
                repositoryId:
                  repository.id,
              },
            }
          );

          /**
           * Insert current languages
           */
          const languageRecords =
            Object.entries(
              languages
            ).map(
              ([language, bytes]) => ({
                repositoryId:
                  repository.id,

                language,

                bytes,
              })
            );

          if (
            languageRecords.length
          ) {
            await RepositoryLanguage.bulkCreate(
              languageRecords
            );

            totalLanguages +=
              languageRecords.length;
          }
        } catch (languageError) {
          console.error(
            `Language sync failed for ${repo.name}:`,
            languageError.message
          );
        }
      }

      /**
       * Stop when there are no
       * more pages.
       */
      if (
        repositories.length <
        perPage
      ) {
        break;
      }

      page++;
    }

    return {
      repositoriesSynced:
        totalSynced,

      languagesSynced:
        totalLanguages,
    };
  };