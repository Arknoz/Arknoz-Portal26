import { notFound } from "next/navigation";

import {
  requireDashboardUser,
} from "@/lib/dashboard/access";

import {
  createClient,
} from "@/lib/supabase/server";


export type ProductionWorkspaceType =
  | "company"
  | "university"
  | "institution";

export type ProductionWorkspacePlan =
  | "FREE"
  | "ONE";

export type ProductionWorkspaceRole =
  | "owner"
  | "manager"
  | "editor"
  | "member";


export type ProductionOrganisationWorkspace = {
  id: string;

  workspaceType:
    ProductionWorkspaceType;

  plan:
    ProductionWorkspacePlan;

  displayName: string;

  role:
    ProductionWorkspaceRole;

  userId: string;
};


function isWorkspaceType(
  value: unknown
): value is ProductionWorkspaceType {
  return (
    value === "company" ||
    value === "university" ||
    value === "institution"
  );
}


function isWorkspacePlan(
  value: unknown
): value is ProductionWorkspacePlan {
  return (
    value === "FREE" ||
    value === "ONE"
  );
}


function isWorkspaceRole(
  value: unknown
): value is ProductionWorkspaceRole {
  return (
    value === "owner" ||
    value === "manager" ||
    value === "editor" ||
    value === "member"
  );
}


export async function requireProductionOrganisationWorkspace(
  workspaceId: string,
  returnTo: string
): Promise<ProductionOrganisationWorkspace> {

  const user =
    await requireDashboardUser(
      returnTo
    );

  const supabase =
    await createClient();


  const {
    data: workspace,
    error: workspaceError,
  } =
    await supabase
      .from(
        "organisation_workspaces"
      )
      .select(
        "id, workspace_type, plan, display_name, lifecycle_status"
      )
      .eq(
        "id",
        workspaceId
      )
      .eq(
        "lifecycle_status",
        "active"
      )
      .maybeSingle();


  if (
    workspaceError ||
    !workspace
  ) {
    notFound();
  }


  if (
    !isWorkspaceType(
      workspace.workspace_type
    ) ||
    !isWorkspacePlan(
      workspace.plan
    )
  ) {
    notFound();
  }


  const {
    data: membership,
    error: membershipError,
  } =
    await supabase
      .from(
        "organisation_workspace_members"
      )
      .select(
        "workspace_role, member_status"
      )
      .eq(
        "workspace_id",
        workspace.id
      )
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "member_status",
        "active"
      )
      .maybeSingle();


  if (
    membershipError ||
    !membership ||
    !isWorkspaceRole(
      membership.workspace_role
    )
  ) {
    notFound();
  }


  return {
    id:
      workspace.id,

    workspaceType:
      workspace.workspace_type,

    plan:
      workspace.plan,

    displayName:
      workspace.display_name,

    role:
      membership.workspace_role,

    userId:
      user.id,
  };
}