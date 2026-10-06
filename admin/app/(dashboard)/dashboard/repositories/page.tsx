import PageHeader from "@/components/common/PageHeader";
import RepositoryOverview from "@/components/repositories/RepositoryOverview";

export default function RepositoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Repositories" description="Browse the repository summary and statistics returned by your dashboard." />
      <RepositoryOverview />
    </div>
  );
}
