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
  }
);

export default RepositoryLanguage;