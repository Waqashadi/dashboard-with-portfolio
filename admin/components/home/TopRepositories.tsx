"use client";

import { Star } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopRepositories() {
  const { data: response, isPending, isError, error } = useDashboard();
  const repositories = response?.data.repositories ?? [];

  if (isPending) {
    return <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading top repositories…</section>;
  }

  if (isError) {
    return <section role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">{error.message}</section>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top repositories</CardTitle>
      </CardHeader>
      <CardContent>
        {repositories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No repositories are available yet.</p>
        ) : (
          <ul className="divide-y">
            {repositories.map((repository) => (
              <li key={repository.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <a
                      href={repository.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline"
                    >
                      {repository.name}
                    </a>
                    {repository.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {repository.description}
                      </p>
                    )}
                    {repository.primaryLanguage && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {repository.primaryLanguage}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                    <Star aria-hidden="true" className="size-4" />
                    {repository.stars.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
