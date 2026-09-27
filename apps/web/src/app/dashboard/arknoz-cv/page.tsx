import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import { MemberArknozCV } from "@/components/MemberDashboardDataViews";
import { requireProUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Arknoz CV | My Arknoz",
};

export default async function ArknozCVPage() {
  await requireProUser(
    "/dashboard/arknoz-cv"
  );

  return (
    <DashboardModuleFrame
      eyebrow="ARKNOZ PRO"
      title="Arknoz CV"
      description="A live structured professional record built from your Arknoz identity, experience and credentials."
    >
      <MemberArknozCV />
    </DashboardModuleFrame>
  );
}