"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, GitFork, Star } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import PageHeader from "@/components/common/PageHeader";
import RepositoryLanguage from "@/components/repositories/RepositoryLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import type { Repository } from "@/types/github";

interface RepositoryResponse {
  success: boolean;
  data: Repository;
}

export default function RepositoryDetailsPage() {
  const { name } = useParams<{ name: string }>();
  const repositoryQuery = useQuery<RepositoryResponse>({
    queryKey: ["public-repository", name],
    queryFn: async () => {
      const response = await api.get<RepositoryResponse>(
        `/repositories/name/${encodeURIComponent(name)}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const repository = repositoryQuery.data?.data;

  if (repositoryQuery.isPending) return <LoadingState message="Loading repository details..." />;

  if (repositoryQuery.isError) {
    return (
      <EmptyState
        title="Could not load repository details"
        description={repositoryQuery.error instanceof Error ? repositoryQuery.error.message : "Please try again."}
        action={<Button variant="outline" onClick={() => void repositoryQuery.refetch()}>Try again</Button>}
      />
    );
  }

  if (!repository) {
    return (
      <EmptyState
        title="Repository not found"
        description="This repository is not available in the public portfolio data."
        action={<Button render={<Link href="/dashboard/repositories" />}>Back to repositories</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={repository.name}
        description={repository.description || repository.fullName}
        action={(
          <Button render={<a href={repository.htmlUrl} target="_blank" rel="noreferrer" />}>
            <ExternalLink />Open on GitHub
          </Button>
        )}
      />
      <Card>
        <CardHeader><CardTitle>{repository.fullName}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">{repository.description || "No description provided."}</p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <RepositoryLanguage language={repository.primaryLanguage} />
            <span className="inline-flex items-center gap-1.5"><Star className="size-4" />{repository.stars.toLocaleString()} stars</span>
            <span className="inline-flex items-center gap-1.5"><GitFork className="size-4" />{repository.forks.toLocaleString()} forks</span>
          </div>
            {repository.languages && repository.languages.length > 0 && (
              <div className="border-t border-border pt-5">
                <h2 className="mb-3 text-sm font-semibold">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {repository.languages.map(({ id, language, bytes }) => (
                    <span key={id} className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
                      {language} · {bytes.toLocaleString()} bytes
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Button variant="outline" render={<Link href="/dashboard/repositories" />}>Back to repositories</Button>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Repository metadata and language details come from the public portfolio dataset.</p>
    </div>
  );
}
