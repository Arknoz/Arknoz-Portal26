import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import MemberConnectionsInbox from "@/components/MemberConnectionsInbox";
import { requireDashboardUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Connections | My Arknoz",
};

export default async function ConnectionsPage() {
  await requireDashboardUser(
    "/dashboard/connections"
  );

  return (
    <DashboardModuleFrame
      eyebrow="YOUR ARKNOZ NETWORK"
      title="Connections"
      description="Manage connection, collaboration and service requests from your Arknoz network."
    >
      <MemberConnectionsInbox />
    </DashboardModuleFrame>
  );
}
