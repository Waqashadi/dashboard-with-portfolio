import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GithubProfile } from "@/types/github";

interface ProfileTableProps {
  profile: GithubProfile;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

export function ProfileTable({ profile }: ProfileTableProps) {
  const details = [
    ["GitHub ID", profile.githubId],
    ["Company", profile.company],
    ["Location", profile.location],
    ["Email", profile.email],
    ["Profile URL", profile.profileUrl],
    ["Public gists", profile.publicGists],
    ["Profile created", formatDate(profile.createdAt)],
    ["Last updated", formatDate(profile.updatedAt)],
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y">
          {details.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[minmax(10rem,1fr)_2fr] sm:gap-4">
              <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
              <dd className="min-w-0 break-words text-sm">{value ?? "Not provided"}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export default ProfileTable;
