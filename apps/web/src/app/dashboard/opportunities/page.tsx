import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import { MemberOpportunities } from "@/components/MemberDashboardDataViews";
import { requireDashboardUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Opportunities | My Arknoz",
};

export default async function OpportunitiesPage() {
  await requireDashboardUser(
    "/dashboard/opportunities"
  );

  return (
    <DashboardModuleFrame
      eyebrow="DISCOVERY"
      title="Opportunities"
      description="Discover Built World opportunities and return to opportunity records you have saved."
    >
      <MemberOpportunities />
    </DashboardModuleFrame>
  );
}