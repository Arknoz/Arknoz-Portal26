import Link from "next/link";
import { redirect } from "next/navigation";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";
import MemberDashboardAccountMenu from "@/components/MemberDashboardAccountMenu";

import { hasPersonalArknozPro } from "@/lib/entitlements/arknoz-pro";
import { createClient } from "@/lib/supabase/server";


export const metadata = {
  title: "My Arknoz | Arknoz",

  description:
    "Your personal Arknoz workspace for identity, activity, opportunities and professional access.",
};


const GROUPS = [
  {
    id: "identity",
    title: "Identity",
    accessLabel: "FREE",

    services: [
      {
        id: "profile",
        title: "Profile",
        description:
          "Professional identity and public member profile.",
        href: "/dashboard/profile",
        access: "FREE",
      },

      {
        id: "experience-credentials",
        title: "Experience & Credentials",
        description:
          "Experience, qualifications and credentials.",
        href: "/dashboard/experience-credentials",
        access: "FREE",
      },

      {
        id: "arknoz-points",
        title: "Arknoz Points",
        description:
          "Trusted participation and contribution points.",
        href: "/dashboard/arknoz-points",
        access: "FREE",
      },
    ],
  },

  {
    id: "my-world",
    title: "My World",
    accessLabel: "FREE",

    services: [
      {
        id: "saved",
        title: "Saved",
        description:
          "Projects, products and knowledge saved for later.",
        href: "/dashboard/saved",
        access: "FREE",
      },

      {
        id: "activity",
        title: "Activity",
        description:
          "Your recent Arknoz activity and continuity.",
        href: "/dashboard/activity",
        access: "FREE",
      },

      {
        id: "connections",
        title: "Connections",
        description:
          "Connection, collaboration and service requests.",
        href: "/dashboard/connections",
        access: "FREE",
      },

      {
        id: "opportunities",
        title: "Opportunities",
        description:
          "Jobs, competitions, calls and opportunities.",
        href: "/dashboard/opportunities",
        access: "FREE",
      },
    ],
  },

  {
    id: "professional",
    title: "Professional",
    accessLabel: "PRO",

    services: [
      {
        id: "messages",
        title: "Messages",
        description:
          "Professional member-to-member communication.",
        href: "/dashboard/messages",
        access: "PRO",
      },

      {
        id: "arknoz-cv",
        title: "Arknoz CV",
        description:
          "Your structured professional Arknoz record.",
        href: "/dashboard/arknoz-cv",
        access: "PRO",
      },

      {
        id: "services",
        title: "Services",
        description:
          "Publish and manage professional services.",
        href: "/dashboard/services",
        access: "PRO",
      },
    ],
  },

  {
    id: "intelligence-work",
    title: "Intelligence & Work",
    accessLabel: "PRO",

    services: [
      {
        id: "contributions",
        title: "Contributions",
        description:
          "Contribute structured Built World records and evidence.",
        href: "/dashboard/contributions",
        access: "PRO",
      },

      {
        id: "advanced-analytics",
        title: "Advanced Analytics",
        description:
          "Deeper analysis across your Arknoz world.",
        href: "/dashboard/advanced-analytics",
        access: "PRO",
      },

      {
        id: "professional-tools",
        title: "Professional Tools",
        description:
          "Higher-value professional workspace capabilities.",
        href: "/dashboard/professional-tools",
        access: "PRO",
      },
    ],
  },
] as const;


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


export default async function DashboardPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/sign-in?returnTo=%2Fdashboard"
    );
  }

  const appMetadata =
    user.app_metadata ?? {};


  const isPro = hasPersonalArknozPro(
    appMetadata.membership
  );

  const {
    data: memberProfile,
  } =
    await supabase
      .from("member_profiles")
      .select("arknoz_id,full_name,headline,location,about,disciplines")
      .eq("user_id", user.id)
      .maybeSingle();

  const arknozId =
    typeof memberProfile?.arknoz_id ===
      "string" &&
    memberProfile.arknoz_id.trim()
      .length > 0
      ? memberProfile.arknoz_id.trim()
      : "Arknoz ID pending";

  const profileSetupItems = [
    typeof memberProfile?.full_name === "string" &&
      memberProfile.full_name.trim().length > 0,
    typeof memberProfile?.headline === "string" &&
      memberProfile.headline.trim().length > 0,
    typeof memberProfile?.location === "string" &&
      memberProfile.location.trim().length > 0,
    typeof memberProfile?.about === "string" &&
      memberProfile.about.trim().length > 0,
    Array.isArray(memberProfile?.disciplines) &&
      memberProfile.disciplines.length > 0,
  ];

  const completedProfileSetupItems =
    profileSetupItems.filter(Boolean).length;

  const profileSetupPercent =
    Math.round(
      (completedProfileSetupItems /
        profileSetupItems.length) *
        100
    );

  const [
    savedCountResult,
    savedOpportunityCountResult,
    connectionActivityResult,
    actionCountResult,
    experienceCountResult,
    credentialCountResult,
  ] = await Promise.all([
    supabase
      .from("member_actions")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("action_type", "save"),

    supabase
      .from("member_actions")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("action_type", "save")
      .like("target_path", "/opportunities/%"),

    supabase.rpc(
      "get_my_member_connections"
    ),

    supabase
      .from("member_actions")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id),

    supabase
      .from("member_experiences")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id),

    supabase
      .from("member_credentials")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id),
  ]);

  const savedCount =
    savedCountResult.count ?? 0;

  const savedOpportunityCount =
    savedOpportunityCountResult.count ?? 0;

  const connectionActivityCount =
    Array.isArray(connectionActivityResult.data)
      ? connectionActivityResult.data.length
      : 0;

  const activityCount =
    (actionCountResult.count ?? 0) +
    (experienceCountResult.count ?? 0) +
    (credentialCountResult.count ?? 0) +
    (memberProfile ? 1 : 0);

  const rawPoints =
    appMetadata.arknoz_points;

  const points =
    typeof rawPoints === "number" &&
    Number.isFinite(rawPoints)
      ? rawPoints
      : 0;

  const rawMembershipId =
    appMetadata.membership_id;

  const membershipId =
    typeof rawMembershipId === "string" &&
    rawMembershipId.trim().length > 0
      ? rawMembershipId.trim()
      : "ID pending";

  const rawMembershipExpiry =
    appMetadata.membership_expires_at;

  const expiryDate =
    typeof rawMembershipExpiry === "string" &&
    rawMembershipExpiry.trim().length > 0
      ? new Date(rawMembershipExpiry)
      : null;

  const membershipExpiryLabel =
    expiryDate &&
    !Number.isNaN(expiryDate.getTime())
      ? new Intl.DateTimeFormat(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }
        ).format(expiryDate)
      : isPro
        ? "Expiry pending"
        : "No expiry";

  return (
    <>
      <GlobalHeader />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-5 px-5 py-3 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                ARKNOZ ID
              </p>

              <p className="mt-0.5 text-xs font-bold text-[#17315c]">
                {arknozId}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                MEMBERSHIP
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {isPro
                  ? "Arknoz Pro"
                  : "Free Member"}
              </p>

              <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                {membershipId} · {membershipExpiryLabel}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                ARKNOZ POINTS
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {points}
              </p>
            </div>
          </div>

          <MemberDashboardAccountMenu
            email={user.email ?? ""}
          />
        </div>
      </div>

      <main className="bg-[#f7f8fa] text-slate-950">
        <section className="mx-auto max-w-[1512px] px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-700">
                PERSONAL WORKSPACE
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#17315c]">
                My Arknoz
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Your professional identity and personal Built World workspace.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                7 Free
              </span>

              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-700">
                6 Pro
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/dashboard/saved"
              className="rounded-[18px] border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                SAVED
              </p>
              <p className="mt-2 text-2xl font-bold text-[#17315c]">
                {savedCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Records saved to your account
              </p>
            </Link>

            <Link
              href="/dashboard/connections"
              className="rounded-[18px] border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                CONNECTION ACTIVITY
              </p>
              <p className="mt-2 text-2xl font-bold text-[#17315c]">
                {connectionActivityCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Connections, collaboration and service requests
              </p>
            </Link>

            <Link
              href="/dashboard/activity"
              className="rounded-[18px] border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                ACTIVITY
              </p>
              <p className="mt-2 text-2xl font-bold text-[#17315c]">
                {activityCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Genuine account and professional activity records
              </p>
            </Link>

            <Link
              href="/dashboard/opportunities"
              className="rounded-[18px] border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                SAVED OPPORTUNITIES
              </p>
              <p className="mt-2 text-2xl font-bold text-[#17315c]">
                {savedOpportunityCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Opportunity records saved privately
              </p>
            </Link>
          </div>

          <section className="mt-4 rounded-[18px] border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  PROFILE SETUP
                </p>

                <p className="mt-1 text-lg font-bold text-[#17315c]">
                  {profileSetupPercent}% complete
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Complete your name, headline, location, professional overview
                  and disciplines to strengthen your Arknoz identity.
                </p>
              </div>

              <Link
                href="/dashboard/profile"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#17315c] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#10284c]"
              >
                Complete Profile &rarr;
              </Link>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-700 transition-all"
                style={{ width: `${profileSetupPercent}%` }}
              />
            </div>
          </section>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {GROUPS.map(
              (group) => {
                const proGroup =
                  group.accessLabel ===
                  "PRO";

                const groupLocked =
                  proGroup &&
                  !isPro;

                return (
                  <section
                    key={group.id}
                    className="min-w-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white"
                  >
                    <div className="flex min-h-[64px] items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                            proGroup
                              ? "text-blue-700"
                              : "text-slate-400"
                          }`}
                        >
                          {
                            group.accessLabel
                          }
                        </p>

                        <h2 className="mt-1 text-[15px] font-bold leading-5 text-[#17315c]">
                          {
                            group.title
                          }
                        </h2>
                      </div>

                      {groupLocked ? (
                        <span className="flex shrink-0 items-center gap-1 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          <LockIcon />
                          Pro
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
                              "PRO" &&
                            !isPro;

                          const rowClass =
                            `${
                              index > 0
                                ? "border-t border-slate-100"
                                : ""
                            } block min-h-[72px] px-4 py-3`;

                          if (locked) {
                            return (
                              <div
                                key={
                                  service.id
                                }
                                className={`${rowClass} bg-slate-50/55`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-[13px] font-bold leading-5 text-slate-500">
                                    {
                                      service.title
                                    }
                                  </p>

                                  <span className="mt-1 shrink-0 text-slate-300">
                                    <LockIcon />
                                  </span>
                                </div>

                                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                                  {
                                    service.description
                                  }
                                </p>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={
                                service.id
                              }
                              href={
                                service.href
                              }
                              className={`${rowClass} group transition hover:bg-slate-50`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-[13px] font-bold leading-5 text-[#17315c]">
                                  {
                                    service.title
                                  }
                                </p>

                                <span className="mt-0.5 shrink-0 text-xs text-slate-300 transition group-hover:text-slate-500">&rarr;</span>
                              </div>

                              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                {
                                  service.description
                                }
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

          {!isPro ? (
            <div className="mt-3 flex justify-end">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2">
                <p className="text-[10px] font-bold text-blue-700">
                  Unlock 6 professional services with Arknoz Pro &rarr;</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex justify-end">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2">
                <p className="text-[10px] font-bold text-blue-700">
                  Arknoz Pro active
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}
