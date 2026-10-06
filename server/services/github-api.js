const GITHUB_API = "https://api.github.com";

export class GithubApiError extends Error {
  constructor(message, { status = 502, retryAfter = null, rateLimited = false } = {}) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
    this.retryAfter = retryAfter;
    this.rateLimited = rateLimited;
  }
}

export const getGithubUsername = () => {
  const username = process.env.GITHUB_USERNAME?.trim();
  if (!username) {
    throw new Error("GITHUB_USERNAME is not configured");
  }
  return username;
};

const getRetryAfter = (response) => {
  const retryAfter = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.ceil(retryAfter);
  }

  const resetAt = Number(response.headers.get("x-ratelimit-reset"));
  if (Number.isFinite(resetAt) && resetAt > 0) {
    return Math.max(1, Math.ceil(resetAt - Date.now() / 1000));
  }

  return null;
};

export const githubRequest = async (endpoint) => {
  const token =
    process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response;
  try {
    response = await fetch(`${GITHUB_API}${endpoint}`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new GithubApiError("GitHub API request timed out");
    }
    throw new GithubApiError("GitHub API request failed");
  }

  if (!response.ok) {
    const rateLimited =
      response.status === 429 ||
      (response.status === 403 &&
        response.headers.get("x-ratelimit-remaining") === "0");
    throw new GithubApiError(
      rateLimited ? "GitHub API rate limit exceeded" : "GitHub API request failed",
      {
        status: response.status,
        rateLimited,
        retryAfter: rateLimited ? getRetryAfter(response) : null,
      }
    );
  }

  try {
    return await response.json();
  } catch {
    throw new GithubApiError("GitHub API returned an invalid response");
  }
};

export const respondToGithubError = (res, error, fallbackMessage) => {
  if (error instanceof GithubApiError) {
    if (error.retryAfter) {
      res.set("Retry-After", String(error.retryAfter));
    }
    return res.status(error.rateLimited ? 429 : 502).json({
      success: false,
      message: error.message,
    });
  }

  console.error(`${fallbackMessage}:`, error instanceof Error ? error.message : error);
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};
