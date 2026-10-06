"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContributionChart() {
  const { data: response, isPending, isError, error } = useDashboard();
  const activities = response?.data.activities ?? [];

  if (isPending) {
    return <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading recent activity…</section>;
  }

  if (isError) {
    return <section role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">{error.message}</section>;
  }

  const countsByDay = new Map<string, number>();
  for (const activity of activities) {
    const day = new Date(activity.occurredAt).toLocaleDateString();
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
  }

  const days = [...countsByDay.entries()].slice(0, 5).reverse();
  const maxCount = Math.max(...days.map(([, count]) => count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent contribution activity</CardTitle>
      </CardHeader>
      <CardContent>
        {days.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity is available.</p>
        ) : (
          <div
            aria-label="Recent GitHub activity count by date"
            className="flex h-36 items-end justify-around gap-3"
          >
            {days.map(([day, count]) => (
              <div key={day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium">{count}</span>
                <div
                  className="w-full max-w-12 rounded-t-md bg-primary/80"
                  style={{ height: `${Math.max((count / maxCount) * 100, 8)}%` }}
                  title={`${count} event${count === 1 ? "" : "s"} on ${day}`}
                />
                <span className="truncate text-xs text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Based on the recent events included in the dashboard response.
        </p>
      </CardContent>
    </Card>
  );
}
