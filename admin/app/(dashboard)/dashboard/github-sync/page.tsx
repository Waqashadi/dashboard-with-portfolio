"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSyncGithubProfile } from "@/hooks/useGithubProfile";

export default function GithubSyncPage() {
  const syncProfile = useSyncGithubProfile();

  return (
    <div className="space-y-6">
      <PageHeader title="GitHub sync" description="Sync the GitHub profile and associated data using the existing server sync operation." />
      <Card>
        <CardHeader>
          <CardTitle>Sync GitHub profile</CardTitle>
          <CardDescription>This runs the existing profile sync operation and refreshes cached profile and dashboard data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {syncProfile.isError && (
            <p role="alert" className="text-sm text-destructive">
              {syncProfile.error instanceof Error ? syncProfile.error.message : "Unable to sync the GitHub profile."}
            </p>
          )}
          {syncProfile.isSuccess && (
            <p role="status" className="text-sm text-green-700 dark:text-green-400">
              GitHub profile synced for @{syncProfile.data.data.username}.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => syncProfile.mutate()} disabled={syncProfile.isPending}>
              <RefreshCw className={syncProfile.isPending ? "animate-spin" : undefined} />
              {syncProfile.isPending ? "Syncing..." : "Sync now"}
            </Button>
            <Button variant="outline" render={<Link href="/dashboard/profile" />}>View profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
