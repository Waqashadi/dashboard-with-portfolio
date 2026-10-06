"use client";

import { GitBranch, Layers3, ListChecks, Radio } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import StatCard from "@/components/common/StatCard";
import { useDashboard } from "@/hooks/useDashboard";

const formatDate = (value: string | undefined) => {
  if (!value) return "?";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "?"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

export default function ActivityStats() {
  const dashboard = useDashboard();

  if (dashboard.isPending) return <LoadingState message="Loading activity statistics..." />;
  if (dashboard.isError) {
    return (
      <EmptyState
        title="Activity statistics unavailable"
        description={dashboard.error instanceof Error ? dashboard.error.message : "Unable to load recent activity."}
        icon={<Radio className="size-5" />}
        action={<button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => void dashboard.refetch()}>Try again</button>}
      />
    );
  }

  const activities = dashboard.data.data.activities;
  const repositoryCount = new Set(activities.map((activity) => activity.repositoryId).filter((id) => id !== null)).size;
  const eventTypeCount = new Set(activities.map((activity) => activity.type)).size;
  const latestActivity = activities.reduce<string | undefined>((latest, activity) => {
    if (!latest || new Date(activity.occurredAt).getTime() > new Date(latest).getTime()) {
      return activity.occurredAt;
    }
    return latest;
  }, undefined);

  return (
    <section aria-label="Activity statistics" className="space-y-3">
      <p className="text-sm text-muted-foreground">Summary of the recent activity returned by the dashboard.</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Recent events" value={activities.length} description="Events in the dashboard sample" icon={<Radio className="size-5" />} />
        <StatCard title="Repositories" value={repositoryCount} description="Repositories represented" icon={<GitBranch className="size-5" />} />
        <StatCard title="Event types" value={eventTypeCount} description="Distinct event types" icon={<Layers3 className="size-5" />} />
        <StatCard title="Latest event" value={formatDate(latestActivity)} description="Most recent event in this sample" icon={<ListChecks className="size-5" />} />
      </div>
    </section>
  );
}
