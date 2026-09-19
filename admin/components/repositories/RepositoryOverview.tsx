"use client";

import { useState } from "react";
import RepositoryStats from "./RepositoryStats";
import RepositoryFilters from "./RepositoryFilters";
import RepositoryList from "./RepositoryList";

export default function RepositoryOverview() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-6">
      <RepositoryStats />
      <RepositoryFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <RepositoryList activeFilter={activeFilter} />
    </div>
  );
}