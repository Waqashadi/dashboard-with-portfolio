import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Repository = sequelize.define(
  "Repository",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    githubId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      field: "github_id",
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "full_name",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    htmlUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "html_url",
    },

    homepage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    stars: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    forks: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    watchers: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    openIssues: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: "open_issues",
    },

    primaryLanguage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "primary_language",
    },

    isFork: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_fork",
    },

    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_private",
    },

    githubCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "github_created_at",
    },

    githubUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "github_updated_at",
    },

    githubPushedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "github_pushed_at",
    },
  },
  {
    tableName: "repositories",

    timestamps: true,

    underscored: true,
  }
);

export default Repository;