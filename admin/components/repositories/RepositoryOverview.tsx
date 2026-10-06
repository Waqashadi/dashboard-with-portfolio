"use client";

import { useState } from "react";
import RepositoryStats from "./RepositoryStats";
import RepositoryFilters from "./RepositoryFilters";
import RepositoryList from "./RepositoryList";
import { usePublicRepositories } from "@/hooks/usePublicRepositories";

export default function RepositoryOverview() {
  const [activeFilter, setActiveFilter] = useState("All");
  const repositoriesQuery = usePublicRepositories();
  const repositories = repositoriesQuery.data?.data.repositories ?? [];

  return (
    <div className="space-y-6">
      <RepositoryStats />
      <RepositoryFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        repositories={repositories}
      />
      <RepositoryList activeFilter={activeFilter} />
    </div>
  );
}