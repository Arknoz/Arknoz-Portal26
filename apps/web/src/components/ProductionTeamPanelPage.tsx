import Link from "next/link";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";
import ProductionTeamPanelWorkspace from "@/components/ProductionTeamPanelWorkspace";

import type {
  TeamPanel,
  TeamPanelGroup,
  TeamRoleDashboardDefinition,
} from "@/lib/workspaces/team-role-dashboards";


export default function ProductionTeamPanelPage({
  dashboard,
  group,
  panel,
  assignmentId,
  userId,
  panelKey,
  accessGrant,
  scopeLabel,
  scopeValue,
}: {
  dashboard:
    TeamRoleDashboardDefinition;

  group:
    TeamPanelGroup;

  panel:
    TeamPanel;

  assignmentId:
    string;

  userId:
    string;

  panelKey:
    string;

  accessGrant:
    string;

  scopeLabel:
    string | null;

  scopeValue:
    string | null;
}) {

  return (
    <>
      <GlobalHeader />


      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-5 px-5 py-2.5 sm:px-8 lg:px-10">

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                TEAM ROLE
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {dashboard.teamRoleLabel ??
                  dashboard.title}
              </p>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                TEAM GRANT
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {accessGrant}
              </p>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {scopeLabel ??
                  "SCOPE / REGION"}
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {scopeValue ??
                  "Not specified"}
              </p>

            </div>

          </div>


          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-[#17315c]"
          >
            Account
          </Link>

        </div>

      </div>


      <main className="bg-[#f7f8fa]">

        <section className="mx-auto max-w-[1280px] px-5 py-5 sm:px-8 lg:px-10">

          <Link
            href="/team"
            className="text-[10px] font-bold text-blue-700"
          >
            Back to Team dashboard
          </Link>


          <div className="mt-4 border-b border-slate-200 pb-4">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
              {group.eyebrow}
            </p>

            <h1 className="mt-1 text-[26px] font-bold tracking-[-0.03em] text-[#17315c]">
              {panel.title}
            </h1>

            <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-500">
              {panel.description}
            </p>

          </div>


          <div className="mt-4">

            <ProductionTeamPanelWorkspace
              assignmentId={
                assignmentId
              }
              userId={
                userId
              }
              panelKey={
                panelKey
              }
              panelTitle={
                panel.title
              }
            />

          </div>

        </section>

      </main>


      <GlobalFooter />
    </>
  );
}