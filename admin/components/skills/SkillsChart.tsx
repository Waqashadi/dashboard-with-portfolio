import type { Skill } from "@/types/github";

interface SkillsChartProps {
  skills: Skill[];
}

export function SkillsChart({ skills }: SkillsChartProps) {
  const rows = [...skills].sort((a, b) => b.totalBytes - a.totalBytes);
  const maxBytes = Math.max(0, ...rows.map((skill) => skill.totalBytes));

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No skill data to chart.</p>;
  }

  return (
    <div className="space-y-4" role="list" aria-label="Skills ranked by repository bytes">
      {rows.map((skill) => {
        const percentage = maxBytes > 0 ? Math.max(0, Math.min(100, (skill.totalBytes / maxBytes) * 100)) : 0;
        return (
          <div key={skill.id} role="listitem" className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium">{skill.name}</span>
              <span className="shrink-0 text-muted-foreground">{skill.totalBytes.toLocaleString()} bytes</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SkillsChart;
