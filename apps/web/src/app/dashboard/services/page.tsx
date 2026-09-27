import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import MemberServicesManager from "@/components/MemberServicesManager";
import { requireProUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Services | My Arknoz",
};

export default async function ServicesPage() {
  await requireProUser(
    "/dashboard/services"
  );

  return (
    <DashboardModuleFrame
      eyebrow="ARKNOZ PRO"
      title="Services"
      description="Prepare and manage your professional services within Arknoz Pro."
    >
      <MemberServicesManager />
    </DashboardModuleFrame>
  );
}
