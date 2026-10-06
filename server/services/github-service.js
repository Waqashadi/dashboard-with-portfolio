import { Op } from "sequelize";
import {
  Activity,
  GithubProfile,
  Repository,
  sequelize,
} from "../models/index.js";
import {
  getGithubUsername,
  githubRequest,
} from "./github-api.js";
import { syncRepositories } from "./repository-service.js";

const mapGithubProfile = (profile) => ({
  githubId: profile.id,
  username: profile.login,
  name: profile.name,
  bio: profile.bio,
  avatarUrl: profile.avatar_url,
  profileUrl: profile.html_url,
  company: profile.company,
  location: profile.location,
  email: profile.email,
  publicRepositories: profile.public_repos,
  followers: profile.followers,
  following: profile.following,
  publicGists: profile.public_gists,
});

export const getGithubProfile = async () => {
  const profile = await GithubProfile.findOne({
    order: [["id", "ASC"]],
  });

  return profile || syncGithubProfile();
};

export const syncGithubProfile = async () => {
  const username = getGithubUsername();
  const profileData = mapGithubProfile(
    await githubRequest(`/users/${encodeURIComponent(username)}`)
  );

  const existing = await GithubProfile.findOne({
    where: { githubId: profileData.githubId },
  });

  if (existing) {
    await existing.update(profileData);
    return existing;
  }

  return GithubProfile.create(profileData);
};

export const updateGithubProfile = async (id, data) => {
  const profile = await GithubProfile.findByPk(id);
  if (!profile) return null;

  const allowedFields = [
    "username",
    "name",
    "bio",
    "avatarUrl",
    "profileUrl",
    "company",
    "location",
    "email",
    "publicRepositories",
    "followers",
    "following",
    "publicGists",
  ];
  const updates = Object.fromEntries(
    allowedFields
      .filter((field) => Object.hasOwn(data, field))
      .map((field) => [field, data[field]])
  );

  if (!Object.keys(updates).length) {
    return profile;
  }

  await profile.update(updates);
  return profile;
};

export const deleteGithubProfile = async (id) => {
  const profile = await GithubProfile.findByPk(id);
  if (!profile) return false;

  await profile.destroy();
  return true;
};

export const syncGithubRepositories = async () => {
  const result = await syncRepositories();
  return {
    ...result,
    skillsUpdated: result.skillsUpdated,
  };
};

const activityTitle = (event) => {
  const titles = {
    PushEvent: "Pushed code",
    PullRequestEvent: "Pull request activity",
    IssuesEvent: "Issue activity",
    IssueCommentEvent: "Commented on an issue",
    CreateEvent: "Created repository content",
    DeleteEvent: "Deleted repository content",
    ForkEvent: "Forked repository",
    WatchEvent: "Starred repository",
    ReleaseEvent: "Created a release",
  };
  return titles[event.type] || event.type;
};

const activityDescription = (event) => {
  const repository = event.repo?.name || "GitHub";

  switch (event.type) {
    case "PushEvent":
      return `Pushed ${event.payload?.commits?.length || 0} commit(s) to ${repository}`;
    case "PullRequestEvent":
    case "IssuesEvent":
      return `${event.payload?.action || "Updated"} ${event.type === "IssuesEvent" ? "an issue" : "a pull request"} in ${repository}`;
    case "ForkEvent":
      return `Forked ${repository}`;
    case "WatchEvent":
      return `Starred ${repository}`;
    case "CreateEvent":
      return `Created ${event.payload?.ref_type || "content"} in ${repository}`;
    default:
      return `Activity on ${repository}`;
  }
};

export const syncGithubActivity = async () => {
  const username = getGithubUsername();
  const events = await githubRequest(
    `/users/${encodeURIComponent(username)}/events/public?per_page=100`
  );

  if (!Array.isArray(events)) {
    throw new Error("GitHub returned an invalid activity list");
  }

  const repoNames = [
    ...new Set(
      events
        .map((event) => event.repo?.name)
        .filter((name) => typeof name === "string")
    ),
  ];
  const repositories = repoNames.length
    ? await Repository.findAll({
        where: { fullName: { [Op.in]: repoNames } },
        attributes: ["id", "fullName"],
      })
    : [];
  const repositoriesByName = new Map(
    repositories.map((repository) => [repository.fullName, repository.id])
  );
  const activityRows = events
    .filter(
      (event) =>
        typeof event.id === "string" &&
        typeof event.type === "string" &&
        event.created_at
    )
    .map((event) => ({
      githubId: event.id,
      type: event.type,
      repositoryId: repositoriesByName.get(event.repo?.name) ?? null,
      title: activityTitle(event),
      description: activityDescription(event),
      url: event.repo?.name
        ? `https://github.com/${event.repo.name}`
        : null,
      occurredAt: event.created_at,
    }));

  if (activityRows.length) {
    await sequelize.transaction(async (transaction) => {
      await Activity.bulkCreate(activityRows, {
        updateOnDuplicate: [
          "type",
          "repositoryId",
          "title",
          "description",
          "url",
          "occurredAt",
        ],
        transaction,
      });
    });
  }

  return {
    activitiesSynced: activityRows.length,
    activitiesSkipped: events.length - activityRows.length,
  };
};
