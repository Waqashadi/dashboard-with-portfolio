import PageHeader from "@/components/common/PageHeader";
import SkillsOverview from "@/components/skills/SkillsOverview";

export default function PublicSkillsPage() {
  return (
    <div className="space-y-8">
        <PageHeader title="Skills" description="Languages and skills calculated from the repository data in the portfolio." />
        <SkillsOverview />
    </div>
  );
}
