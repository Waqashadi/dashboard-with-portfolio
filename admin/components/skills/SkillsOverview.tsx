"use client";

import { Code2 } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio";
import LanguageBreakdown from "./LanguageBreakdown";
import SkillCard from "./SkillCard";
import SkillsChart from "./SkillsChart";

export default function SkillsOverview() {
  const dashboard = usePublicPortfolio();

  if (dashboard.isPending) return <LoadingState message="Loading skills..." />;

  if (dashboard.isError) {
    return (
      <EmptyState
        title="Could not load skills"
        description={dashboard.error instanceof Error ? dashboard.error.message : "Please try again."}
        icon={<Code2 className="size-5" />}
        action={<button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => void dashboard.refetch()}>Try again</button>}
      />
    );
  }

  const skills = dashboard.data.data.skills;

  if (skills.length === 0) {
    return (
      <EmptyState
        title="No skills found"
        description="Skill and language data is not included in the dashboard response yet."
        icon={<Code2 className="size-5" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section aria-label="Skills by repository bytes" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Repository bytes for the skills returned by the dashboard.</p>
          </CardHeader>
          <CardContent><SkillsChart skills={skills} /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Language breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Share of recorded bytes by returned skill.</p>
          </CardHeader>
          <CardContent><LanguageBreakdown skills={skills} /></CardContent>
        </Card>
      </section>
      <section aria-label="Skills overview">
        <h2 className="mb-4 text-lg font-semibold">Skills</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      </section>
    </div>
  );
}
