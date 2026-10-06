"use client";

import { ShieldAlert } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import ProfileCard from "@/components/home/ProfileCard";
import StatsCards from "@/components/home/StatsCards";
import SkillsChart from "@/components/home/SkillsChart";
import RecentActivity from "@/components/home/RecentActivity";
import TopRepositories from "@/components/home/TopRepositories";
import LanguageChart from "@/components/home/LanguageChart";
import ContributionChart from "@/components/home/ContributionChart";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const dashboard = useDashboard();

  if (dashboard.isPending) return <LoadingState message="Loading dashboard overview…" />;
  if (dashboard.isError) {
    return (
      <div className="space-y-7">
        <PageHeader title="Dashboard" description="A summary of your GitHub profile, repositories, skills, and recent activity." />
        <EmptyState
          title="Dashboard data is unavailable"
          description={dashboard.error instanceof Error ? dashboard.error.message : "Please try again."}
          icon={<ShieldAlert className="size-5" />}
          action={<Button variant="outline" onClick={() => void dashboard.refetch()}>Try again</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader title="Dashboard" description="A summary of your GitHub profile, repositories, skills, and recent activity." />
      <ProfileCard />
      <StatsCards />
      <div className="grid gap-5 lg:grid-cols-2">
        <SkillsChart />
        <LanguageChart />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentActivity />
        <ContributionChart />
      </div>
      <TopRepositories />
    </div>
  );
}
