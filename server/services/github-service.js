import {
  GithubProfile,
  Repository,
  RepositoryLanguage,
  Activity,
} from "../models/index.js";

const GITHUB_API = "https://api.github.com";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * GitHub API headers
 */
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (GITHUB_TOKEN) {
  githubHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

/**
 * Generic GitHub API request
 */
const githubRequest = async (endpoint) => {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    method: "GET",
    headers: githubHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${errorText}`);
  }

  return response.json();
};

/**
 * Helper: Fetch raw GitHub profile from API
 */
const fetchGithubProfile = async () => {
  if (!GITHUB_USERNAME) {
    throw new Error("GITHUB_USERNAME is not configured");
  }
  return await githubRequest(`/users/${GITHUB_USERNAME}`);
};

/**
 * Helper: Map raw GitHub API response to database attributes
 */
const mapGithubProfile = (githubProfile) => {
  return {
    githubId: githubProfile.id,
    username: githubProfile.login,
    name: githubProfile.name,
    bio: githubProfile.bio,
    avatarUrl: githubProfile.avatar_url,
    profileUrl: githubProfile.html_url,
    company: githubProfile.company,
    location: githubProfile.location,
    email: githubProfile.email,
    publicRepositories: githubProfile.public_repos,
    followers: githubProfile.followers,
    following: githubProfile.following,
    publicGists: githubProfile.public_gists,
  };
};

/**
 * Get GitHub profile from DB (or sync if none exists)
 */
export const getGithubProfile = async () => {
  let profile = await GithubProfile.findOne();

  if (!profile) {
    profile = await syncGithubProfile();
  }

  return profile;
};

/**
 * Sync GitHub profile directly from API to DB
 */
export const syncGithubProfile = async () => {
  const githubProfile = await fetchGithubProfile();
  const profileData = mapGithubProfile(githubProfile);

  let profile = await GithubProfile.findOne({
    where: {
      githubId: profileData.githubId,
    },
  });

  if (profile) {
    await profile.update(profileData);
  } else {
    profile = await GithubProfile.create(profileData);
  }

  return profile;
};

/**
 * Update profile manually
 */
export const updateGithubProfile = async (id, data) => {
  const profile = await GithubProfile.findByPk(id);

  if (!profile) {
    return null;
  }

  await profile.update({
    username: data.username,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    profileUrl: data.profileUrl,
    company: data.company,
    location: data.location,
    email: data.email,
    publicRepositories: data.publicRepositories,
    followers: data.followers,
    following: data.following,
    publicGists: data.publicGists,
  });

  return profile;
};

/**
 * Delete profile by ID
 */
export const deleteGithubProfile = async (id) => {
  const profile = await GithubProfile.findByPk(id);

  if (!profile) {
    return null;
  }

  await profile.destroy();
  return true;
};

/**
 * Sync GitHub repositories
 */
export const syncGithubRepositories = async () => {
  if (!GITHUB_USERNAME) {
    throw new Error("GITHUB_USERNAME is not configured");
  }

  let page = 1;
  const perPage = 100;
  let totalSynced = 0;

  while (true) {
    const repositories = await githubRequest(
      `/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );

    if (!repositories.length) {
      break;
    }

    for (const repo of repositories) {
      if (repo.private) {
        continue;
      }

      await Repository.upsert({
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage || null,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        watchers: repo.watchers_count || 0,
        openIssues: repo.open_issues_count || 0,
        primaryLanguage: repo.language || null,
        isFork: repo.fork || false,
        isPrivate: repo.private || false,
        githubCreatedAt: repo.created_at || null,
        githubUpdatedAt: repo.updated_at || null,
        githubPushedAt: repo.pushed_at || null,
      });

      totalSynced++;
    }

    if (repositories.length < perPage) {
      break;
    }

    page++;
  }

  return { synced: totalSynced };
};

/**
 * Sync GitHub activity
 */
export const syncGithubActivity = async () => {
  if (!GITHUB_USERNAME) {
    throw new Error("GITHUB_USERNAME is not configured");
  }

  const events = await githubRequest(
    `/users/${GITHUB_USERNAME}/events/public?per_page=100`
  );

  let totalSynced = 0;

  for (const event of events) {
    let repositoryId = null;

    if (event.repo?.name) {
      const repoName = event.repo.name.split("/")[1];

      const repository = await Repository.findOne({
        where: { name: repoName },
      });

      if (repository) {
        repositoryId = repository.id;
      }
    }

    const activityData = {
      githubId: event.id,
      type: event.type,
      repositoryId,
      title: getActivityTitle(event),
      description: getActivityDescription(event),
      url: getActivityUrl(event),
      occurredAt: event.created_at,
    };

    await Activity.upsert(activityData);
    totalSynced++;
  }

  return { synced: totalSynced };
};

/**
 * Generate activity title
 */
const getActivityTitle = (event) => {
  switch (event.type) {
    case "PushEvent":
      return "Pushed code";
    case "PullRequestEvent":
      return "Pull request activity";
    case "IssuesEvent":
      return "Issue activity";
    case "IssueCommentEvent":
      return "Commented on an issue";
    case "CreateEvent":
      return "Created repository content";
    case "DeleteEvent":
      return "Deleted repository content";
    case "ForkEvent":
      return "Forked repository";
    case "WatchEvent":
      return "Starred repository";
    case "ReleaseEvent":
      return "Created a release";
    default:
      return event.type;
  }
};

/**
 * Generate activity description
 */
const getActivityDescription = (event) => {
  const repository = event.repo?.name || "GitHub";

  switch (event.type) {
    case "PushEvent":
      return `Pushed ${event.payload?.commits?.length || 0} commit(s) to ${repository}`;
    case "PullRequestEvent":
      return `${event.payload?.action || "Updated"} a pull request in ${repository}`;
    case "IssuesEvent":
      return `${event.payload?.action || "Updated"} an issue in ${repository}`;
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

/**
 * Generate activity URL
 */
const getActivityUrl = (event) => {
  if (!event.repo?.name) {
    return null;
  }
  return `https://github.com/${event.repo.name}`;
};