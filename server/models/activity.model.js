import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    githubId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "github_id",
    },

    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    repositoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "repository_id",
      references: {
        model: "repositories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    occurredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "occurred_at",
    },
  },
  {
    tableName: "activities",
    timestamps: true,
    underscored: true,
  }
);

export default Activity;