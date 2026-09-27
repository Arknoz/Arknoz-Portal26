import ProductionOrganisationDashboard from "@/components/ProductionOrganisationDashboard";
import { hasOrganisationArknozPro } from "@/lib/entitlements/arknoz-pro";

import {
  COMPANY_V3,
  INSTITUTION_V3,
  UNIVERSITY_V3,
} from "@/lib/workspaces/organisation-dashboard-v3";

import {
  requireProductionOrganisationWorkspace,
} from "@/lib/workspaces/production-organisation-access";


const DASHBOARDS = {
  company: COMPANY_V3,
  university: UNIVERSITY_V3,
  institution: INSTITUTION_V3,
} as const;


function formatRole(
  value: string
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}


export default async function ProductionWorkspacePage({
  params,
}: {
  params: Promise<{
    workspaceId: string;
  }>;
}) {

  const {
    workspaceId,
  } =
    await params;


  const workspace =
    await requireProductionOrganisationWorkspace(
      workspaceId,
      `/workspace/${workspaceId}`
    );


  const dashboard =
    DASHBOARDS[
      workspace.workspaceType
    ];


  return (
    <ProductionOrganisationDashboard
      dashboard={dashboard}
      workspaceId={workspace.id}
      displayName={
        workspace.displayName
      }
      roleLabel={
        formatRole(
          workspace.role
        )
      }
      oneUnlocked={
        hasOrganisationArknozPro(workspace.plan)
      }
    />
  );
}
