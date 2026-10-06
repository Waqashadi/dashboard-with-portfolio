import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RepositoryLanguage = sequelize.define(
  "RepositoryLanguage",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    repositoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: "repository_id",
      references: {
        model: "repositories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    language: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    bytes: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "repository_languages",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["repository_id"],
        name: "idx_repository_languages_repository_id",
      },
      {
        fields: ["language"],
        name: "idx_repository_languages_language",
      },
      {
        fields: ["repository_id", "language"],
        unique: true,
        name: "unique_repository_language",
      },
    ],
  }
);

export default RepositoryLanguage;