import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Beginner",
    },

    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },

    repositoriesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: "repositories_count",
    },

    totalBytes: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: "total_bytes",
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "skills",
    timestamps: true,
    underscored: true,
  }
);

export default Skill;