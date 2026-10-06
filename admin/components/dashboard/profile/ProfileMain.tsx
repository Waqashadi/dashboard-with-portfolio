"use client";

import { RefreshCw, UserRound } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useGithubProfile, useSyncGithubProfile } from "@/hooks/useGithubProfile";
import ProfileCard from "@/components/dashboard/profile/ProfileCard";
import ProfileFormModal from "@/components/dashboard/profile/ProfileFormModal";
import ProfileTable from "@/components/dashboard/profile/ProfileTable";

export function ProfileMain() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const profileQuery = useGithubProfile();
  const syncProfile = useSyncGithubProfile();
  const profile = profileQuery.data?.data;

  if (profileQuery.isPending) {
    return <LoadingState message="Loading GitHub profile..." />;
  }

  if (profileQuery.isError) {
    return (
      <div className="space-y-5">
        <PageHeader title="GitHub profile" description="Manage the profile displayed on your dashboard." />
        <EmptyState
          title="Could not load your profile"
          description={profileQuery.error instanceof Error ? profileQuery.error.message : "Please try again."}
          icon={<UserRound className="size-5" />}
          action={<Button type="button" variant="outline" onClick={() => void profileQuery.refetch()}>Try again</Button>}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-5">
        <PageHeader title="GitHub profile" description="Sync your GitHub profile to manage the details displayed on your dashboard." />
        <EmptyState
          title="No GitHub profile found"
          description={syncProfile.isError && syncProfile.error instanceof Error ? syncProfile.error.message : "Sync your GitHub profile to load its details."}
          icon={<UserRound className="size-5" />}
          action={(
            <Button type="button" onClick={() => syncProfile.mutate()} disabled={syncProfile.isPending}>
              <RefreshCw className={syncProfile.isPending ? "animate-spin" : undefined} />
              {syncProfile.isPending ? "Syncing..." : "Sync GitHub profile"}
            </Button>
          )}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="GitHub profile" description="Review and update the profile information used by your portfolio." />
      {syncProfile.isError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {syncProfile.error instanceof Error ? syncProfile.error.message : "Unable to sync the GitHub profile."}
        </p>
      )}
      <ProfileCard
        profile={profile}
        onEdit={() => setIsEditOpen(true)}
        onSync={() => syncProfile.mutate()}
        syncing={syncProfile.isPending}
      />
      <ProfileTable profile={profile} />
      {isEditOpen && (
        <ProfileFormModal profile={profile} open onOpenChange={setIsEditOpen} />
      )}
    </div>
  );
}

export default ProfileMain;
