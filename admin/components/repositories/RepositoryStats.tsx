"use client";

import { GitFork, GitPullRequest, Star } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import StatCard from "@/components/common/StatCard";
import { useDashboard } from "@/hooks/useDashboard";

export default function RepositoryStats() {
  const dashboard = useDashboard();

  if (dashboard.isPending) return <LoadingState message="Loading repository statistics..." />;

  if (dashboard.isError) {
    return (
      <EmptyState
        title="Repository statistics unavailable"
        description={dashboard.error instanceof Error ? dashboard.error.message : "Unable to load repository statistics."}
        icon={<GitPullRequest className="size-5" />}
        action={<button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => void dashboard.refetch()}>Try again</button>}
      />
    );
  }

  const { stats } = dashboard.data.data;

  return (
    <section aria-label="Repository statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Repositories" value={stats.repositories} description="Public repositories synced" icon={<GitPullRequest className="size-5" />} />
      <StatCard title="Stars" value={stats.stars} description="Stars across repositories" icon={<Star className="size-5" />} />
      <StatCard title="Forks" value={stats.forks} description="Forks across repositories" icon={<GitFork className="size-5" />} />
      <StatCard title="Languages" value={stats.languages} description="Languages detected" icon={<span className="text-base font-semibold">{stats.languages}</span>} />
    </section>
  );
}
