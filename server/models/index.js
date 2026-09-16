import GithubProfile from "./github_profile.model.js";
import Repository from "./repository.model.js";
import RepositoryLanguage from "./repository_language.model.js";
import Activity from "./activity.model.js";
import Skill from "./skill.model.js";

import sequelize from "../config/db.js";

export {
  sequelize,
  Skill,
  Repository,
  RepositoryLanguage,
  Activity,
  GithubProfile,
};