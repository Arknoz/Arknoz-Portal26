import { notFound } from "next/navigation";

import {
  requireDashboardUser,
} from "@/lib/dashboard/access";

import {
  createClient,
} from "@/lib/supabase/server";


export type ProductionTeamRole =
  | "adviser"
  | "editor"
  | "knowledge_contributor"
  | "regional_partner"
  | "operations"
  | "leadership";


export type ProductionLeadershipPortfolio =
  | "knowledge_intelligence"
  | "education_institutions"
  | "community_network"
  | "growth_partnerships"
  | "product_platform"
  | "operations_trust";


export type ProductionTeamAssignment = {
  id: string;

  userId: string;

  teamRole:
    ProductionTeamRole;

  leadershipPortfolio:
    ProductionLeadershipPortfolio |
    null;

  scopeLabel:
    string |
    null;

  scopeValue:
    string |
    null;

  accessGrant:
    string;
};


function isTeamRole(
  value: unknown
): value is ProductionTeamRole {

  return (
    value === "adviser" ||
    value === "editor" ||
    value === "knowledge_contributor" ||
    value === "regional_partner" ||
    value === "operations" ||
    value === "leadership"
  );
}


function isLeadershipPortfolio(
  value: unknown
): value is ProductionLeadershipPortfolio {

  return (
    value === "knowledge_intelligence" ||
    value === "education_institutions" ||
    value === "community_network" ||
    value === "growth_partnerships" ||
    value === "product_platform" ||
    value === "operations_trust"
  );
}


export async function requireProductionTeamAssignment(
  returnTo: string
): Promise<ProductionTeamAssignment> {

  const user =
    await requireDashboardUser(
      returnTo
    );


  const supabase =
    await createClient();


  const {
    data:
      assignment,

    error,
  } =
    await supabase
      .from(
        "team_assignments"
      )
      .select(
        "id, user_id, team_role, leadership_portfolio, scope_label, scope_value, access_grant, is_active"
      )
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "is_active",
        true
      )
      .maybeSingle();


  if (
    error ||
    !assignment ||
    !isTeamRole(
      assignment.team_role
    )
  ) {
    notFound();
  }


  const portfolio =
    assignment
      .leadership_portfolio;


  if (
    assignment.team_role ===
      "leadership" &&
    !isLeadershipPortfolio(
      portfolio
    )
  ) {
    notFound();
  }


  if (
    assignment.team_role !==
      "leadership" &&
    portfolio !== null &&
    !isLeadershipPortfolio(
      portfolio
    )
  ) {
    notFound();
  }


  return {
    id:
      assignment.id,

    userId:
      user.id,

    teamRole:
      assignment.team_role,

    leadershipPortfolio:
      portfolio,

    scopeLabel:
      assignment.scope_label,

    scopeValue:
      assignment.scope_value,

    accessGrant:
      assignment.access_grant,
  };
}