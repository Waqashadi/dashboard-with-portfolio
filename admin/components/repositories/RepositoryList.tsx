"use client";

import { FolderGit2 } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { usePublicRepositories } from "@/hooks/usePublicRepositories";
import RepositoryCard from "./RepositoryCard";

interface RepositoryListProps {
  activeFilter: string;
}

export default function RepositoryList({ activeFilter }: RepositoryListProps) {
  const dashboard = usePublicRepositories();

  if (dashboard.isPending) return <LoadingState message="Loading repositories..." />;

  if (dashboard.isError) {
    return (
      <EmptyState
        title="Could not load repositories"
        description={dashboard.error instanceof Error ? dashboard.error.message : "Please try again."}
        icon={<FolderGit2 className="size-5" />}
        action={<button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => void dashboard.refetch()}>Try again</button>}
      />
    );
  }

  const repositories = dashboard.data.data.repositories;
  const filteredRepositories = activeFilter === "All"
    ? repositories
    : repositories.filter((repository) => repository.primaryLanguage === activeFilter);

  if (repositories.length === 0) {
    return (
      <EmptyState
        title="No repositories found"
        description="No public repositories are currently available."
        icon={<FolderGit2 className="size-5" />}
      />
    );
  }

  if (filteredRepositories.length === 0) {
    return (
      <EmptyState
        title={`No ${activeFilter} repositories`}
        description="Choose another language filter to see repositories in the dashboard response."
        icon={<FolderGit2 className="size-5" />}
      />
    );
  }

  return (
    <section aria-label="Top repositories">
      <p className="mb-4 text-sm text-muted-foreground">Showing public repositories, with language details from the portfolio dataset.</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRepositories.map((repository) => (
          <RepositoryCard key={repository.id} repository={repository} />
        ))}
      </div>
    </section>
  );
}
