import { FolderGit2 } from "lucide-react";
import type { Skill } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkillLevelBadge from "./SkillLevelBadge";

interface SkillCardProps {
  skill: Skill;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

export function SkillCard({ skill }: SkillCardProps) {
  const parsedScore = Number(skill.score);
  const score = Number.isFinite(parsedScore) ? parsedScore : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle className="truncate">{skill.name}</CardTitle>
          {skill.category && <p className="mt-1 text-xs text-muted-foreground">{skill.category}</p>}
        </div>
        <SkillLevelBadge level={skill.level} />
      </CardHeader>
      <CardContent>
        {score !== null && (
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Score</span><span>{score.toLocaleString()}</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${skill.name} score`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.max(0, Math.min(100, score))}
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><FolderGit2 className="size-3.5" />{skill.repositoriesCount} {skill.repositoriesCount === 1 ? "repository" : "repositories"}</span>
          <span>{formatBytes(skill.totalBytes)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default SkillCard;
