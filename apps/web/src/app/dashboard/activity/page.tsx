import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import { MemberActivity } from "@/components/MemberDashboardDataViews";
import { requireDashboardUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Activity | My Arknoz",
};

export default async function ActivityPage() {
  await requireDashboardUser(
    "/dashboard/activity"
  );

  return (
    <DashboardModuleFrame
      eyebrow="PRIVATE ACCOUNT HISTORY"
      title="Activity"
      description="Follow your genuine Arknoz activity and participation from one private workspace."
    >
      <MemberActivity />
    </DashboardModuleFrame>
  );
}