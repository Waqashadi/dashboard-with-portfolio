import ActivityStats from "./ActivityStats";
import ActivityTimeline from "./ActivityTimeline";

export default function ActivityOverview() {
  return (
    <div className="space-y-6">
      <ActivityStats />

      <ActivityTimeline />
    </div>
  );
}