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

  createdAt?: string;
  updatedAt?: string;
}

export interface GithubProfileResponse {
  success: boolean;
  data: GithubProfile | null;
  message?: string;
}

export interface SyncGithubProfileResponse {
  success: boolean;
  message: string;
  data: GithubProfile;
}

export interface GithubProfileFormData {
  githubId?: number;
  username: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  profileUrl?: string;
  company?: string;
  location?: string;
  email?: string;
  publicRepositories?: number;
  followers?: number;
  following?: number;
  publicGists?: number;
}

export interface UpdateGithubProfilePayload {
  username?: string;
  name?: string | null;
  bio?: string | null;

  avatarUrl?: string | null;
  profileUrl?: string;

  company?: string | null;
  location?: string | null;
  email?: string | null;

  publicRepositories?: number;
  followers?: number;
  following?: number;
  publicGists?: number;
}