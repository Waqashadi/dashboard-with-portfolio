import PageHeader from "@/components/common/PageHeader";
import PublicActivityOverview from "@/components/activity/PublicActivityOverview";

export default function PublicActivityPage() {
  return (
    <div className="space-y-8">
        <PageHeader title="Activity" description="Recent GitHub activity available in the portfolio dashboard." />
        <PublicActivityOverview />
    </div>
  );
}
