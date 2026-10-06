"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LanguageChart() {
  const { data: response, isPending, isError, error } = useDashboard();
  const skills = response?.data.skills ?? [];
  const totalBytes = skills.reduce((total, skill) => total + skill.totalBytes, 0);

  if (isPending) {
    return <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading language data…</section>;
  }

  if (isError) {
    return <section role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">{error.message}</section>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No language skill data is available.</p>
        ) : (
          skills.map((skill) => {
            const percentage = totalBytes > 0 ? (skill.totalBytes / totalBytes) * 100 : 0;

            return (
              <div key={skill.id} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate font-medium">{skill.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${skill.name} share of language bytes`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number(percentage.toFixed(1))}
                  className="h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
