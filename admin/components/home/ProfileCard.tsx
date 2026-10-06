"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileCard() {
  const { data: response, isPending, isError, error } = useDashboard();
  const profile = response?.data.profile;

  if (isPending) {
    return <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading GitHub profile…</section>;
  }

  if (isError) {
    return <section role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">{error.message}</section>;
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader><CardTitle>GitHub profile</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No GitHub profile has been synced yet.</p>
        </CardContent>
      </Card>
    );
  }

  const displayName = profile.name ?? profile.username;
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar className="size-16">
            <AvatarImage src={profile.avatarUrl ?? undefined} alt={`${displayName} avatar`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{displayName}</h2>
            <a
              className="text-sm text-muted-foreground hover:text-foreground"
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              @{profile.username}
            </a>
            {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div><dt className="text-muted-foreground">Followers</dt><dd className="font-medium">{profile.followers.toLocaleString()}</dd></div>
              <div><dt className="text-muted-foreground">Following</dt><dd className="font-medium">{profile.following.toLocaleString()}</dd></div>
              <div><dt className="text-muted-foreground">Public repositories</dt><dd className="font-medium">{profile.publicRepositories.toLocaleString()}</dd></div>
              <div><dt className="text-muted-foreground">Public gists</dt><dd className="font-medium">{profile.publicGists.toLocaleString()}</dd></div>
              {profile.location && <div className="col-span-2"><dt className="text-muted-foreground">Location</dt><dd className="font-medium">{profile.location}</dd></div>}
              {profile.company && <div className="col-span-2"><dt className="text-muted-foreground">Company</dt><dd className="font-medium">{profile.company}</dd></div>}
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
