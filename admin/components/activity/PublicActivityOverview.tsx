"use client";

import { Activity as ActivityIcon } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio";
import ActivityItem from "./ActivityItem";

export default function PublicActivityOverview() {
  const portfolio = usePublicPortfolio();

  if (portfolio.isPending) return <LoadingState message="Loading GitHub activity…" />;
  if (portfolio.isError) {
    return (
      <EmptyState
        title="Could not load activity"
        description={portfolio.error instanceof Error ? portfolio.error.message : "Please try again."}
        icon={<ActivityIcon className="size-5" />}
        action={<button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => void portfolio.refetch()}>Try again</button>}
      />
    );
  }

  const activities = portfolio.data.data.activities;
  if (activities.length === 0) {
    return <EmptyState title="No recent activity" description="No public GitHub events are available in the portfolio yet." icon={<ActivityIcon className="size-5" />} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent public activity</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">A snapshot of recent events from the connected GitHub account.</p>
      </CardHeader>
      <CardContent>
        <ol aria-label="Recent GitHub activity">
          {activities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
        </ol>
      </CardContent>
    </Card>
  );
}
