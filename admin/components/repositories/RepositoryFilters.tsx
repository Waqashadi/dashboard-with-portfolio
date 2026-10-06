"use client";

import type { DashboardRepository } from "@/types/github";

interface RepositoryFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  repositories?: DashboardRepository[];
}

export default function RepositoryFilters({
  activeFilter,
  onFilterChange,
  repositories = [],
}: RepositoryFiltersProps) {
  const languages = Array.from(new Set(
    repositories
      .map((repository) => repository.primaryLanguage)
      .filter((language): language is string => Boolean(language)),
  )).sort((a, b) => a.localeCompare(b));
  const filters = ["All", ...languages];

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filter repositories by primary language">
      {filters.map((filter) => {
        const selected = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            aria-pressed={selected}
            onClick={() => onFilterChange(filter)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
