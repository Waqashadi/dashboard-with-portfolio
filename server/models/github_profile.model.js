import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const GithubProfile = sequelize.define(
  "GithubProfile",
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

    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "avatar_url",
    },

    profileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "profile_url",
    },

    company: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },

    publicRepositories: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: "public_repositories",
    },

    followers: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    following: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    publicGists: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: "public_gists",
    },
  },
  {
    tableName: "github_profiles",
    timestamps: true,
    underscored: true,
  }
);

export default GithubProfile;