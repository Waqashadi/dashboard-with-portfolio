import { cn } from "@/lib/utils";

interface SkillLevelBadgeProps {
  level: string;
}

export default function SkillLevelBadge({
  level,
}: SkillLevelBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        level === "Advanced" &&
          "bg-primary/10 text-primary",
        level === "Intermediate" &&
          "bg-blue-500/10 text-blue-600",
        level === "Beginner" &&
          "bg-muted text-muted-foreground"
      )}
    >
      {level}
    </span>
  );
}