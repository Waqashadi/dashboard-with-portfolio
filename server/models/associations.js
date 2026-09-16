import Repository from "./repository.model.js";
import RepositoryLanguage from "./repository_language.model.js";
import Activity from "./activity.model.js";

// Repository → Languages
Repository.hasMany(RepositoryLanguage, {
  foreignKey: "repositoryId",
  as: "languages",
});

RepositoryLanguage.belongsTo(Repository, {
  foreignKey: "repositoryId",
  as: "repository",
});

// Repository → Activities
Repository.hasMany(Activity, {
  foreignKey: "repositoryId",
  as: "activities",
});

Activity.belongsTo(Repository, {
  foreignKey: "repositoryId",
  as: "repository",
});