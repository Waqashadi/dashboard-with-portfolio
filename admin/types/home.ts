import type {
  Activity,
  DashboardRepository,
  GithubProfile,
  Skill,
} from "./github";

export interface DashboardStatistics {
  repositories: number;
  stars: number;
  forks: number;
  languages: number;
}

export interface HomeData {
  profile: GithubProfile | null;
  stats: DashboardStatistics;
  skills: Skill[];
  activities: Activity[];
  repositories: DashboardRepository[];
}

export interface DashboardResponse {
  success: boolean;
  data: HomeData;
}
