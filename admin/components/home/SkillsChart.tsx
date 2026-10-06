"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SkillsChart() {
  const { data: response, isPending, isError, error } = useDashboard();
  const skills = response?.data.skills ?? [];

  if (isPending) {
    return <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading skills…</section>;
  }

  if (isError) {
    return <section role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">{error.message}</section>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top skills</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills are available yet.</p>
        ) : (
          <ul className="space-y-4">
            {skills.map((skill) => {
              const score = Math.min(Math.max(Number(skill.score) || 0, 0), 100);

              return (
                <li key={skill.id}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {skill.level} · {score.toFixed(0)}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${skill.name} skill score`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={score}
                    className="h-2 overflow-hidden rounded-full bg-muted"
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
