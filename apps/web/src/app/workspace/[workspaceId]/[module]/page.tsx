import {
  notFound,
  redirect,
} from "next/navigation";

import ProductionOrganisationModuleV3 from "@/components/ProductionOrganisationModuleV3";
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
  company:
    COMPANY_V3,

  university:
    UNIVERSITY_V3,

  institution:
    INSTITUTION_V3,
} as const;


const UTILITIES =
  new Set([
    "settings",
    "notifications",
    "security",
  ]);


function formatRole(
  value: string
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}


export default async function ProductionWorkspaceModulePage({
  params,
}: {
  params: Promise<{
    workspaceId:
      string;

    module:
      string;
  }>;
}) {

  const {
    workspaceId,
    module,
  } =
    await params;


  const workspace =
    await requireProductionOrganisationWorkspace(
      workspaceId,
      `/workspace/${workspaceId}/${module}`
    );


  const dashboard =
    DASHBOARDS[
      workspace.workspaceType
    ];


  const service =
    dashboard.groups
      .flatMap(
        (group) =>
          group.services
      )
      .find(
        (item) =>
          item.id ===
            module
      );


  if (
    !service &&
    !UTILITIES.has(
      module
    )
  ) {
    notFound();
  }


  if (
    service?.access ===
      "ONE" &&
    !hasOrganisationArknozPro(workspace.plan)
  ) {
    redirect(
      `/workspace/${workspaceId}`
    );
  }


  return (
    <ProductionOrganisationModuleV3
      dashboard={
        dashboard
      }
      moduleId={
        module
      }
      workspaceId={
        workspace.id
      }
      userId={
        workspace.userId
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
