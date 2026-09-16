import { fn, col } from "sequelize";

import {
  GithubProfile,
  Repository,
  RepositoryLanguage,
  Skill,
  Activity,
} from "../models/index.js";

export const getDashboard = async (req, res) => {
  try {
    // -----------------------------------
    // GitHub profile
    // -----------------------------------

    const profile = await GithubProfile.findOne({
      order: [["id", "ASC"]],
    });

    // -----------------------------------
    // Repository statistics
    // -----------------------------------

    const repositoryStats = await Repository.findOne({
      attributes: [
        [fn("COUNT", col("id")), "repositories"],
        [fn("COALESCE", fn("SUM", col("stars")), 0), "stars"],
        [fn("COALESCE", fn("SUM", col("forks")), 0), "forks"],
      ],
      raw: true,
    });

    // -----------------------------------
    // Total unique languages
    // -----------------------------------

    const languageStats = await RepositoryLanguage.findOne({
      attributes: [
        [
          fn(
            "COUNT",
            fn("DISTINCT", col("language"))
          ),
          "languages",
        ],
      ],
      raw: true,
    });

    // -----------------------------------
    // Top skills
    // -----------------------------------

    const skills = await Skill.findAll({
      order: [["score", "DESC"]],
      limit: 6,
    });

    // -----------------------------------
    // Recent activities
    // -----------------------------------

    const activities = await Activity.findAll({
      order: [["occurredAt", "DESC"]],
      limit: 5,

      include: [
        {
          model: Repository,
          as: "repository",
          attributes: ["name", "htmlUrl"],
        },
      ],
    });

    // -----------------------------------
    // Top repositories
    // -----------------------------------

    const topRepositories = await Repository.findAll({
      attributes: [
        "id",
        "name",
        "fullName",
        "description",
        "htmlUrl",
        "stars",
        "forks",
        "primaryLanguage",
        "updatedAt",
      ],

      order: [
        ["stars", "DESC"],
        ["forks", "DESC"],
      ],

      limit: 5,

      raw: true,
    });

    // -----------------------------------
    // Response
    // -----------------------------------

    return res.status(200).json({
      success: true,

      data: {
        profile,

        stats: {
          repositories: Number(
            repositoryStats?.repositories || 0
          ),

          stars: Number(
            repositoryStats?.stars || 0
          ),

          forks: Number(
            repositoryStats?.forks || 0
          ),

          languages: Number(
            languageStats?.languages || 0
          ),
        },

        skills,

        activities,

        repositories: topRepositories,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};