import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import MemberContributionHistory from "@/components/MemberContributionHistory";

import {
  requireDashboardUser,
} from "@/lib/dashboard/access";

export default async function ContributionsPage() {
  await requireDashboardUser(
    "/dashboard/contributions"
  );

  return (
    <DashboardModuleFrame
      eyebrow="ARKNOZ ID"
      title="Contributions"
      description="Contribute genuine Built World records and evidence, then follow their Arknoz review status."
    >
      <MemberContributionHistory />
    </DashboardModuleFrame>
  );
}