"use client";

import { ShieldAlert } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ActivityOverview from "@/components/activity/ActivityOverview";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";

export default function ActivityPage() {
  const dashboard = useDashboard();

  if (dashboard.isPending) return <LoadingState message="Loading activity…" />;
  if (dashboard.isError) {
    return (
      <div className="space-y-7">
        <PageHeader title="Activity" description="Review the GitHub events included in your dashboard response." />
        <EmptyState title="Activity is unavailable" description={dashboard.error instanceof Error ? dashboard.error.message : "Please try again."} icon={<ShieldAlert className="size-5" />} action={<Button variant="outline" onClick={() => void dashboard.refetch()}>Try again</Button>} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Activity" description="Review the GitHub events included in your dashboard response." />
      <ActivityOverview />
    </div>
  );
}
