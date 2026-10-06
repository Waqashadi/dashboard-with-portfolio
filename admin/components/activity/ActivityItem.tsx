import { ExternalLink, GitBranch, GitCommitHorizontal, GitFork, GitPullRequest, Star } from "lucide-react";
import type { Activity } from "@/types/github";

interface ActivityItemProps {
  activity: Activity;
}

const eventLabels: Record<string, string> = {
  CreateEvent: "Created",
  DeleteEvent: "Deleted",
  ForkEvent: "Forked",
  IssuesEvent: "Updated an issue in",
  IssueCommentEvent: "Commented on an issue in",
  PullRequestEvent: "Updated a pull request in",
  PullRequestReviewEvent: "Reviewed a pull request in",
  PushEvent: "Pushed changes to",
  ReleaseEvent: "Published a release in",
  WatchEvent: "Starred",
};

const eventIcons: Record<string, typeof GitBranch> = {
  ForkEvent: GitFork,
  PullRequestEvent: GitPullRequest,
  PullRequestReviewEvent: GitPullRequest,
  PushEvent: GitCommitHorizontal,
  WatchEvent: Star,
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const repositoryName = activity.repository?.name;
  const title = activity.title || eventLabels[activity.type] || activity.type.replace(/Event$/, " event");
  const Icon = eventIcons[activity.type] ?? GitBranch;
  const href = activity.url || activity.repository?.htmlUrl || undefined;

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      <div className="relative flex w-8 shrink-0 justify-center">
        <span className="absolute top-8 bottom-0 w-px bg-border last:hidden" aria-hidden="true" />
        <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-medium">{title}</p>
          {repositoryName && <span className="text-sm text-muted-foreground">{repositoryName}</span>}
          {href && (
            <a className="inline-flex items-center text-muted-foreground hover:text-foreground" href={href} target="_blank" rel="noreferrer" aria-label="Open activity on GitHub">
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
        {activity.description && <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>}
        <time className="mt-1 block text-xs text-muted-foreground" dateTime={activity.occurredAt}>
          {formatDate(activity.occurredAt)}
        </time>
      </div>
    </li>
  );
}

export default ActivityItem;
