"use client";

import Link from "next/link";
import { ExternalLink, GitFork, Star } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import PageHeader from "@/components/common/PageHeader";
import RepositoryLanguage from "@/components/repositories/RepositoryLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicRepositories } from "@/hooks/usePublicRepositories";

export default function PublicRepositoriesPage() {
  const repositories = usePublicRepositories();
  const items = repositories.data?.data.repositories ?? [];

  return (
    <div className="space-y-8">
        <PageHeader title="Repositories" description="Explore the public repository summaries available in this portfolio." />
        {repositories.isPending ? <LoadingState message="Loading repositories..." /> : null}
        {repositories.isError ? (
          <EmptyState
            title="Could not load repositories"
            description={repositories.error instanceof Error ? repositories.error.message : "Please try again."}
            action={<button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => void repositories.refetch()}>Try again</button>}
          />
        ) : null}
        {repositories.isSuccess && items.length === 0 ? (
          <EmptyState title="No repositories available" description="No public repositories are available in the portfolio yet." />
        ) : null}
        {repositories.isSuccess && items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((repository) => (
              <Card key={repository.id} className="h-full">
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <CardTitle className="min-w-0 break-words text-base">
                    <Link className="hover:text-primary hover:underline" href={`/repositories/${encodeURIComponent(repository.name)}`}>
                      {repository.fullName}
                    </Link>
                  </CardTitle>
                  <a className="shrink-0 text-muted-foreground hover:text-foreground" href={repository.htmlUrl} target="_blank" rel="noreferrer" aria-label={`Open ${repository.name} on GitHub`}>
                    <ExternalLink className="size-4" />
                  </a>
                </CardHeader>
                <CardContent className="flex h-full flex-col gap-4">
                  <p className="line-clamp-3 min-h-10 text-sm text-muted-foreground">{repository.description || "No description provided."}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <RepositoryLanguage language={repository.primaryLanguage} />
                    <span className="inline-flex items-center gap-1"><Star className="size-4" />{repository.stars.toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1"><GitFork className="size-4" />{repository.forks.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">Repository details and language metrics are read from the public portfolio dataset.</p>
    </div>
  );
}
