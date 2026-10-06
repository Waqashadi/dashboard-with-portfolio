import { ExternalLink, GitFork, Star } from "lucide-react";
import type { DashboardRepository } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RepositoryLanguage from "./RepositoryLanguage";

interface RepositoryCardProps {
  repository: DashboardRepository;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="min-w-0 break-words text-base">
          <a className="hover:text-primary hover:underline" href={repository.htmlUrl} target="_blank" rel="noreferrer">
            {repository.fullName}
          </a>
        </CardTitle>
        <a className="shrink-0 text-muted-foreground hover:text-foreground" href={repository.htmlUrl} target="_blank" rel="noreferrer" aria-label={`Open ${repository.name} on GitHub`}>
          <ExternalLink className="size-4" />
        </a>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 min-h-10 text-sm text-muted-foreground">
          {repository.description || "No description provided."}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <RepositoryLanguage language={repository.primaryLanguage} />
          <span className="inline-flex items-center gap-1"><Star className="size-4" />{repository.stars.toLocaleString()}</span>
          <span className="inline-flex items-center gap-1"><GitFork className="size-4" />{repository.forks.toLocaleString()}</span>
          <span className="ml-auto text-xs">Updated {formatDate(repository.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default RepositoryCard;
