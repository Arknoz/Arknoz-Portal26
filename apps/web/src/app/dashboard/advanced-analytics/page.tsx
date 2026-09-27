import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import { MemberAdvancedAnalytics } from "@/components/MemberDashboardDataViews";
import { requireProUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Advanced Analytics | My Arknoz",
};

export default async function AdvancedAnalyticsPage() {
  await requireProUser(
    "/dashboard/advanced-analytics"
  );

  return (
    <DashboardModuleFrame
      eyebrow="ARKNOZ PRO"
      title="Advanced Analytics"
      description="Understand your own Arknoz professional and participation data without popularity scoring."
    >
      <MemberAdvancedAnalytics />
    </DashboardModuleFrame>
  );
}