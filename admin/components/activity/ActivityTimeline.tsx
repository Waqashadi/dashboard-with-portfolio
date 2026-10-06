"use client";

import { Activity as ActivityIcon } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import ActivityItem from "./ActivityItem";

export default function ActivityTimeline() {
  const dashboard = useDashboard();

  if (dashboard.isPending) return <LoadingState message="Loading recent activity..." />;

  if (dashboard.isError) {
    return (
      <EmptyState
        title="Could not load recent activity"
        description={dashboard.error instanceof Error ? dashboard.error.message : "Please try again."}
        icon={<ActivityIcon className="size-5" />}
        action={<button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => void dashboard.refetch()}>Try again</button>}
      />
    );
  }

  const activities = dashboard.data.data.activities;

  if (activities.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        description="There are no GitHub activities in the dashboard response yet."
        icon={<ActivityIcon className="size-5" />}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <p className="text-sm text-muted-foreground">The latest events included in the dashboard response.</p>
      </CardHeader>
      <CardContent>
        <ol aria-label="Recent GitHub activity">
          {activities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
        </ol>
      </CardContent>
    </Card>
  );
}
