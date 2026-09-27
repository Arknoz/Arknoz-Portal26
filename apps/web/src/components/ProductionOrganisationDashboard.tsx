import Link from "next/link";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";
import OrganisationAccountMenu from "@/components/OrganisationAccountMenu";

import type {
  OrganisationDashboardDefinition,
} from "@/lib/workspaces/organisation-dashboard-v3";


function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="11"
      height="11"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4.5"
        y="8"
        width="11"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M7 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="13"
      height="13"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function ProductionOrganisationDashboard({
  dashboard,
  workspaceId,
  displayName,
  roleLabel,
  oneUnlocked,
}: {
  dashboard:
    OrganisationDashboardDefinition;

  workspaceId:
    string;

  displayName:
    string;

  roleLabel:
    string;

  oneUnlocked:
    boolean;
}) {
  const baseHref =
    `/workspace/${workspaceId}`;

  const planLabel =
    oneUnlocked
      ? "Arknoz ONE"
      : dashboard.freePlanLabel;

  const profileModuleId =
    dashboard.groups[0]
      ?.services[0]
      ?.id ?? "";


  return (
    <>
      <GlobalHeader />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-5 px-5 py-3 sm:px-8 lg:px-10">

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {dashboard.workspaceIdLabel}
              </p>

              <p className="mt-0.5 text-xs font-bold text-[#17315c]">
                {workspaceId
                  .slice(0, 8)
                  .toUpperCase()}
              </p>
            </div>


            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                PLAN
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {planLabel}
              </p>

              <p className="mt-0.5 text-[9px] text-slate-400">
                {oneUnlocked
                  ? "ONE workspace plan"
                  : "Free workspace plan"}
              </p>
            </div>


            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                ROLE
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {roleLabel}
              </p>
            </div>

          </div>


          <OrganisationAccountMenu
            baseHref={baseHref}
            profileModuleId={profileModuleId}
            oneUnlocked={false}
          />

        </div>
      </div>


      <main className="bg-[#f7f8fa] text-slate-950">

        <section className="mx-auto max-w-[1512px] px-5 py-5 sm:px-8 lg:px-10">

          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-700">
                {dashboard.workspaceType.toUpperCase()} WORKSPACE
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#17315c]">
                {displayName}
              </h1>

              <p className="mt-1 max-w-3xl text-sm text-slate-500">
                {dashboard.subtitle}
              </p>

            </div>


            <div className="flex gap-2">

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold uppercase text-slate-500">
                6 Free
              </span>

              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[9px] font-bold uppercase text-blue-700">
                6 ONE
              </span>

            </div>

          </div>


          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">

            {dashboard.groups.map(
              (group) => {

                const oneGroup =
                  group.accessLabel ===
                    "ONE";

                const groupLocked =
                  oneGroup &&
                  !oneUnlocked;


                return (
                  <section
                    key={group.id}
                    className="overflow-hidden rounded-[18px] border border-slate-200 bg-white"
                  >

                    <div className="flex min-h-[64px] items-center justify-between gap-3 px-4 py-3">

                      <div>

                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                            oneGroup
                              ? "text-blue-700"
                              : "text-slate-400"
                          }`}
                        >
                          {group.accessLabel}
                        </p>

                        <h2 className="mt-1 text-[15px] font-bold text-[#17315c]">
                          {group.title}
                        </h2>

                      </div>


                      {groupLocked ? (
                        <span className="flex items-center gap-1 text-[8px] font-bold uppercase text-slate-400">
                          <LockIcon />
                          ONE
                        </span>
                      ) : null}

                    </div>


                    <div className="border-t border-slate-100">

                      {group.services.map(
                        (
                          service,
                          index
                        ) => {

                          const locked =
                            service.access ===
                              "ONE" &&
                            !oneUnlocked;


                          const rowClass =
                            `${
                              index > 0
                                ? "border-t border-slate-100"
                                : ""
                            } block min-h-[72px] px-4 py-3`;


                          if (locked) {
                            return (
                              <div
                                key={service.id}
                                className={`${rowClass} bg-slate-50/55`}
                                aria-disabled="true"
                              >

                                <div className="flex items-start justify-between gap-3">

                                  <p className="text-[13px] font-bold text-slate-500">
                                    {service.title}
                                  </p>

                                  <span className="mt-1 text-slate-300">
                                    <LockIcon />
                                  </span>

                                </div>


                                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                                  {service.description}
                                </p>

                              </div>
                            );
                          }


                          return (
                            <Link
                              key={service.id}
                              href={`${baseHref}/${service.id}`}
                              className={`${rowClass} group transition hover:bg-slate-50`}
                            >

                              <div className="flex items-start justify-between gap-3">

                                <p className="text-[13px] font-bold text-[#17315c]">
                                  {service.title}
                                </p>

                                <span className="mt-0.5 text-slate-300 group-hover:text-slate-500">
                                  <ArrowIcon />
                                </span>

                              </div>


                              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                {service.description}
                              </p>

                            </Link>
                          );
                        }
                      )}

                    </div>

                  </section>
                );
              }
            )}

          </div>

        </section>

      </main>


      <GlobalFooter />
    </>
  );
}