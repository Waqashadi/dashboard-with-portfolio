"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentActivity() {
  const { data: response, isPending, isError, error } = useDashboard();
  const activities = response?.data.activities ?? [];

  if (isPending) {
    return <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading recent activity…</section>;
  }

  if (isError) {
    return <section role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">{error.message}</section>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent GitHub activity is available.</p>
        ) : (
          <ol className="space-y-5">
            {activities.map((activity) => (
              <li key={activity.id} className="relative border-l pl-4 last:border-transparent">
                <span className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-primary bg-background" />
                <p className="font-medium">{activity.title ?? activity.type}</p>
                {activity.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <time dateTime={activity.occurredAt}>
                    {new Date(activity.occurredAt).toLocaleString()}
                  </time>
                  {activity.repository && (
                    <a
                      href={activity.repository.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-foreground"
                    >
                      {activity.repository.name}
                    </a>
                  )}
                  {!activity.repository && activity.url && (
                    <a href={activity.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
                      View on GitHub
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
