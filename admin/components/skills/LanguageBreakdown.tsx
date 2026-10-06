import type { Skill } from "@/types/github";

interface LanguageBreakdownProps {
  skills: Skill[];
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = -1;
  do {
    value /= 1024;
    index += 1;
  } while (value >= 1024 && index < units.length - 1);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

export function LanguageBreakdown({ skills }: LanguageBreakdownProps) {
  const rankedSkills = [...skills].sort((a, b) => b.totalBytes - a.totalBytes);
  const totalBytes = rankedSkills.reduce((total, skill) => total + skill.totalBytes, 0);

  if (rankedSkills.length === 0) {
    return <p className="text-sm text-muted-foreground">No language data is available.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Language byte distribution">
        {rankedSkills.map((skill) => (
          <span
            key={skill.id}
            className="h-full bg-primary even:bg-primary/70 odd:bg-primary"
            style={{ width: `${totalBytes > 0 ? (skill.totalBytes / totalBytes) * 100 : 0}%` }}
            title={`${skill.name}: ${formatBytes(skill.totalBytes)}`}
          />
        ))}
      </div>
      <ul className="space-y-2">
        {rankedSkills.map((skill) => {
          const percentage = totalBytes > 0 ? (skill.totalBytes / totalBytes) * 100 : 0;
          return (
            <li key={skill.id} className="flex items-center justify-between gap-4 text-sm">
              <span className="min-w-0 truncate font-medium">{skill.name}</span>
              <span className="shrink-0 text-muted-foreground">
                {formatBytes(skill.totalBytes)} <span className="ml-1">({percentage.toFixed(1)}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">Based on the language/skill records included in the dashboard response.</p>
    </div>
  );
}

export default LanguageBreakdown;
