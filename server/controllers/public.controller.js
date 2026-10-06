import { col, fn, Op } from "sequelize";
import {
  Activity,
  GithubProfile,
  Repository,
  RepositoryLanguage,
  Skill,
} from "../models/index.js";

export const getPublicPortfolio = async (req, res) => {
  try {
    const [profile, repositoryStats, languageStats, repositories, skills, activities] =
      await Promise.all([
        GithubProfile.findOne({
          attributes: [
            "id",
            "githubId",
            "username",
            "name",
            "bio",
            "avatarUrl",
            "profileUrl",
            "company",
            "location",
            "publicRepositories",
            "followers",
            "following",
            "publicGists",
          ],
          order: [["id", "ASC"]],
        }),
        Repository.findOne({
          attributes: [
            [fn("COUNT", col("id")), "repositories"],
            [fn("COALESCE", fn("SUM", col("stars")), 0), "stars"],
            [fn("COALESCE", fn("SUM", col("forks")), 0), "forks"],
          ],
          where: { isPrivate: false },
          raw: true,
        }),
        RepositoryLanguage.findOne({
          attributes: [[fn("COUNT", fn("DISTINCT", col("language"))), "languages"]],
          include: [
            {
              model: Repository,
              as: "repository",
              attributes: [],
              where: { isPrivate: false },
              required: true,
            },
          ],
          raw: true,
        }),
        Repository.findAll({
          where: { isPrivate: false },
          attributes: [
            "id",
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
            "githubCreatedAt",
            "githubUpdatedAt",
            "githubPushedAt",
            "updatedAt",
          ],
          include: [
            {
              model: RepositoryLanguage,
              as: "languages",
              attributes: ["id", "language", "bytes"],
              separate: true,
              order: [["bytes", "DESC"]],
            },
          ],
          order: [["stars", "DESC"], ["forks", "DESC"]],
          limit: 6,
        }),
        Skill.findAll({
          where: { repositoriesCount: { [Op.gt]: 0 } },
          order: [["score", "DESC"]],
        }),
        Activity.findAll({
          attributes: [
            "id",
            "githubId",
            "type",
            "repositoryId",
            "title",
            "description",
            "url",
            "occurredAt",
          ],
          order: [["occurredAt", "DESC"]],
          limit: 8,
          include: [
            {
              model: Repository,
              as: "repository",
              attributes: ["name", "htmlUrl"],
              required: false,
            },
          ],
        }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        profile,
        stats: {
          repositories: Number(repositoryStats?.repositories || 0),
          stars: Number(repositoryStats?.stars || 0),
          forks: Number(repositoryStats?.forks || 0),
          languages: Number(languageStats?.languages || 0),
        },
        repositories,
        skills,
        activities,
      },
    });
  } catch (error) {
    console.error(
      "Public portfolio request failed:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({
      success: false,
      message: "Unable to load portfolio data",
    });
  }
};
