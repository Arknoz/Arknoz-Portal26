import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  robots: {
    index: false,
    follow: false,
  },
};
import ProductionTeamRoleDashboard from "@/components/ProductionTeamRoleDashboard";

import {
  requireProductionTeamAssignment,
} from "@/lib/workspaces/production-team-access";

import {
  getProductionTeamDashboard,
} from "@/lib/workspaces/production-team-dashboard";


export default async function ProductionTeamPage() {

  const assignment =
    await requireProductionTeamAssignment(
      "/team"
    );


  const dashboard =
    getProductionTeamDashboard(
      assignment
    );


  return (
    <ProductionTeamRoleDashboard
      dashboard={
        dashboard
      }
      accessGrant={
        assignment.accessGrant
      }
      scopeLabel={
        assignment.scopeLabel
      }
      scopeValue={
        assignment.scopeValue
      }
    />
  );
}