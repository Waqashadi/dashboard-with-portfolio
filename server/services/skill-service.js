import { Op } from "sequelize";
import { sequelize, Skill, RepositoryLanguage } from "../models/index.js";

// Helper function to map language types to developer categories
const mapCategory = (languageName) => {
  const lang = languageName.toLowerCase();
  if (["javascript", "typescript", "html", "css", "vue", "react", "svelte"].includes(lang)) {
    return "Frontend";
  }
  if (["python", "node", "java", "php", "ruby", "go", "c#", "rust"].includes(lang)) {
    return "Backend";
  }
  if (["swift", "kotlin", "flutter", "dart", "react native"].includes(lang)) {
    return "Mobile";
  }
  if (["sql", "postgresql", "mysql", "mongodb"].includes(lang)) {
    return "Database";
  }
  if (["docker", "shell", "makefile", "hcl"].includes(lang)) {
    return "DevOps";
  }
  return "General";
};

// Helper function to calculate level based on byte count and repo count
const calculateSkillMetrics = (totalBytes, repoCount) => {
  let level = "Beginner";
  let score = 0;

  if (totalBytes > 1000000 || repoCount >= 10) {
    level = "Expert";
    score = Math.min(100, 85 + repoCount * 0.5);
  } else if (totalBytes > 250000 || repoCount >= 5) {
    level = "Intermediate";
    score = Math.min(84, 60 + repoCount * 2);
  } else {
    score = Math.min(59, 20 + repoCount * 5);
  }

  return { level, score: parseFloat(score.toFixed(2)) };
};

const updateSkills = async (transaction) => {
  const aggregatedData = await RepositoryLanguage.findAll({
    attributes: [
      "language",
      [sequelize.fn("SUM", sequelize.col("bytes")), "totalBytes"],
      [
        sequelize.fn(
          "COUNT",
          sequelize.fn("DISTINCT", sequelize.col("repository_id"))
        ),
        "repositoriesCount",
      ],
    ],
    group: ["language"],
    raw: true,
    transaction,
  });

  for (const item of aggregatedData) {
    const languageName = item.language;
    const totalBytes = Number(item.totalBytes) || 0;
    const repositoriesCount = Number(item.repositoriesCount) || 0;
    const { level, score } = calculateSkillMetrics(
      totalBytes,
      repositoriesCount
    );
    const category = mapCategory(languageName);

    const [skill] = await Skill.findOrCreate({
      where: { name: languageName },
      defaults: {
        level,
        score,
        repositoriesCount,
        totalBytes,
        category,
      },
      transaction,
    });

    await skill.update(
      {
        level,
        score,
        repositoriesCount,
        totalBytes,
        category,
      },
      { transaction }
    );
  }

  const languageNames = aggregatedData.map((item) => item.language);
  await Skill.update(
    {
      level: "Beginner",
      score: 0,
      repositoriesCount: 0,
      totalBytes: 0,
    },
    {
      where: {
        ...(languageNames.length
          ? { name: { [Op.notIn]: languageNames } }
          : {}),
        repositoriesCount: { [Op.gt]: 0 },
      },
      transaction,
    }
  );

  return {
    success: true,
    totalSkillsUpdated: aggregatedData.length,
  };
};

export const recalculateSkillsFromRepositories = async (transaction) => {
  if (transaction) {
    return updateSkills(transaction);
  }
  return sequelize.transaction(updateSkills);
};