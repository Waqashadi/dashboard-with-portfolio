"use client";

import { GitFork, GitPullRequest, Star, Code2 } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards() {
  const { data: response, isPending, isError, error } = useDashboard();
  const stats = response?.data.stats;

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading dashboard statistics…</p>;
  }

  if (isError) {
    return <p role="alert" className="text-sm text-destructive">{error.message}</p>;
  }

  if (!stats) {
    return <p className="text-sm text-muted-foreground">Dashboard statistics are unavailable.</p>;
  }

  const cards = [
    { label: "Repositories", value: stats.repositories, icon: GitPullRequest },
    { label: "Stars", value: stats.stars, icon: Star },
    { label: "Forks", value: stats.forks, icon: GitFork },
    { label: "Languages", value: stats.languages, icon: Code2 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">{value.toLocaleString()}</p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon aria-hidden="true" className="size-5" />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
