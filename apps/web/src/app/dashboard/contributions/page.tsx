import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import MemberContributionHistory from "@/components/MemberContributionHistory";

import {
  requireProUser,
} from "@/lib/dashboard/access";

export default async function ContributionsPage() {
  await requireProUser(
    "/dashboard/contributions"
  );

  return (
    <DashboardModuleFrame
      eyebrow="ARKNOZ PRO"
      title="Contributions"
      description="Contribute genuine Built World records and evidence, then follow their Arknoz review status."
    >
      <MemberContributionHistory />
    </DashboardModuleFrame>
  );
}