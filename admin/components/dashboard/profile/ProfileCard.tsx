"use client";

import { Building2, ExternalLink, GitFork, MapPin, Pencil, RefreshCw, Users } from "lucide-react";
import type { GithubProfile } from "@/types/github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileCardProps {
  profile: GithubProfile;
  onEdit: () => void;
  onSync: () => void;
  syncing?: boolean;
}

export function ProfileCard({ profile, onEdit, onSync, syncing = false }: ProfileCardProps) {
  const displayName = profile.name || profile.username;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar size="lg" className="size-16">
            {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={`${displayName}'s avatar`} />}
            <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate text-xl">{displayName}</CardTitle>
            <a className="text-sm text-muted-foreground hover:text-foreground" href={profile.profileUrl} target="_blank" rel="noreferrer">
              @{profile.username}
            </a>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onSync} disabled={syncing}>
            <RefreshCw className={syncing ? "animate-spin" : undefined} />
            Sync
          </Button>
          <Button type="button" size="sm" onClick={onEdit}>
            <Pencil />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground">{profile.bio || "No bio provided."}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {profile.company && <span className="inline-flex items-center gap-1.5"><Building2 className="size-4" />{profile.company}</span>}
          {profile.location && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{profile.location}</span>}
          {profile.email && <a className="hover:text-foreground" href={`mailto:${profile.email}`}>{profile.email}</a>}
          <a className="inline-flex items-center gap-1.5 hover:text-foreground" href={profile.profileUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />GitHub profile
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">
          <ProfileMetric label="Repositories" value={profile.publicRepositories} />
          <ProfileMetric label="Followers" value={profile.followers} icon={<Users className="size-4" />} />
          <ProfileMetric label="Following" value={profile.following} icon={<Users className="size-4" />} />
          <ProfileMetric label="Public gists" value={profile.publicGists} icon={<GitFork className="size-4" />} />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileMetric({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <p className="mt-1 text-lg font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}

export default ProfileCard;
