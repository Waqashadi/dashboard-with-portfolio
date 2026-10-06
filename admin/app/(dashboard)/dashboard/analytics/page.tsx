"use client";

import { ShieldAlert } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ContributionChart from "@/components/home/ContributionChart";
import LanguageChart from "@/components/home/LanguageChart";
import SkillsChart from "@/components/home/SkillsChart";
import StatsCards from "@/components/home/StatsCards";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";

export default function AnalyticsPage() {
  const dashboard = useDashboard();

  if (dashboard.isPending) return <LoadingState message="Loading analytics…" />;
  if (dashboard.isError) {
    return (
      <div className="space-y-7">
        <PageHeader title="Analytics" description="Explore repository statistics and the skill and activity data available in the dashboard response." />
        <EmptyState title="Analytics are unavailable" description={dashboard.error instanceof Error ? dashboard.error.message : "Please try again."} icon={<ShieldAlert className="size-5" />} action={<Button variant="outline" onClick={() => void dashboard.refetch()}>Try again</Button>} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Explore repository statistics and the skill and activity data available in the dashboard response." />
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <SkillsChart />
        <LanguageChart />
      </div>
      <ContributionChart />
    </div>
  );
}
