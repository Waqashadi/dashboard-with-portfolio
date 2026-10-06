import Repository from "./repository.model.js";
import RepositoryLanguage from "./repository_language.model.js";
import Activity from "./activity.model.js";

// Repository → Languages
Repository.hasMany(RepositoryLanguage, {
  foreignKey: "repositoryId",
  as: "languages",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

RepositoryLanguage.belongsTo(Repository, {
  foreignKey: "repositoryId",
  as: "repository",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Repository → Activities
Repository.hasMany(Activity, {
  foreignKey: "repositoryId",
  as: "activities",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Activity.belongsTo(Repository, {
  foreignKey: "repositoryId",
  as: "repository",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});