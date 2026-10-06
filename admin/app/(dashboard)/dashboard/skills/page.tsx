import PageHeader from "@/components/common/PageHeader";
import SkillsOverview from "@/components/skills/SkillsOverview";

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Skills" description="Review language and skill metrics derived from repository data." />
      <SkillsOverview />
    </div>
  );
}
