export interface GithubProfile {
  id: number;
  githubId: number;
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  profileUrl: string;
  company: string | null;
  location: string | null;
  email: string | null;
  publicRepositories: number;
  followers: number;
  following: number;
  publicGists: number;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryLanguage {
  id: number;
  repositoryId: number;
  language: string;
  bytes: number;
  createdAt: string;
  updatedAt: string;
}

export type RepositoryLanguageSummary = Pick<
  RepositoryLanguage,
  "id" | "language" | "bytes"
>;

export interface Repository {
  id: number;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  primaryLanguage: string | null;
  isFork: boolean;
  isPrivate: boolean;
  githubCreatedAt: string | null;
  githubUpdatedAt: string | null;
  githubPushedAt: string | null;
  createdAt: string;
  updatedAt: string;
  languages?: RepositoryLanguageSummary[];
}

export type DashboardRepository = Pick<
  Repository,
  | "id"
  | "name"
  | "fullName"
  | "description"
  | "htmlUrl"
  | "stars"
  | "forks"
  | "primaryLanguage"
  | "updatedAt"
>;

export interface Activity {
  id: number;
  githubId: string;
  type: string;
  repositoryId: number | null;
  title: string | null;
  description: string | null;
  url: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  repository?: Pick<Repository, "name" | "htmlUrl"> | null;
}

export interface Skill {
  id: number;
  name: string;
  level: string;
  score: string;
  repositoriesCount: number;
  totalBytes: number;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GithubProfileResponse {
  success: boolean;
  data: GithubProfile;
  message?: string;
}

export type SyncGithubProfileResponse = GithubProfileResponse & {
  message: string;
};

export type GithubProfileFormData = Pick<
  GithubProfile,
  "username"
> &
  Partial<
    Omit<GithubProfile, "id" | "username" | "createdAt" | "updatedAt">
  >;

export type UpdateGithubProfilePayload = Partial<
  Omit<GithubProfile, "id" | "githubId" | "createdAt" | "updatedAt">
>;

export interface RepositoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RepositoryListResponse {
  success: boolean;
  data: {
    repositories: Repository[];
    pagination: RepositoryPagination;
  };
}
