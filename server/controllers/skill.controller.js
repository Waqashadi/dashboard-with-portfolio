import { Op } from "sequelize";
import { Skill } from "../models/index.js";

export const getPublicSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      where: { repositoriesCount: { [Op.gt]: 0 } },
      order: [["score", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error(
      "Get skills failed:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({
      success: false,
      message: "Unable to fetch skills",
    });
  }
};
