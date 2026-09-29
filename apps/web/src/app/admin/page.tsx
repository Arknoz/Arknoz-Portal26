import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  requirePlatformConsoleUser,
} from "@/lib/admin/access";

import {
  createClient,
} from "@/lib/supabase/server";


export const metadata: Metadata = {
  title:
    "Admin Control Centre",

  robots: {
    index: false,
    follow: false,
  },
};


type Phase1Overview = {
  totalMembers: number;
  newMembers7d: number;
  newMembers30d: number;
  activeMembers30d: number;
  suspendedMembers: number;
  publicProfiles: number;

  totalContent: number;
  publishedContent: number;
  reviewContent: number;
  draftContent: number;

  projects: number;
  products: number;
  knowledge: number;
  people: number;
  organisations: number;
  universities: number;
  opportunities: number;
  places: number;

  connectionsTotal: number;
  connectionsPending: number;
  connectionsAccepted: number;
  connectionRequests7d: number;
};


export default async function AdminPage() {
  const authority =
    await requirePlatformConsoleUser(
      "/admin"
    );

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_platform_phase1_overview"
  );

  const overview =
    error
      ? null
      : (
          data as
            | Phase1Overview
            | null
        );

  const metrics = [
    [
      "Members",
      overview?.totalMembers ?? 0,
    ],
    [
      "New · 7 days",
      overview?.newMembers7d ?? 0,
    ],
    [
      "Active · 30 days",
      overview?.activeMembers30d ?? 0,
    ],
    [
      "Suspended",
      overview?.suspendedMembers ?? 0,
    ],
    [
      "All Content",
      overview?.totalContent ?? 0,
    ],
    [
      "Published",
      overview?.publishedContent ?? 0,
    ],
    [
      "In Review",
      overview?.reviewContent ?? 0,
    ],
    [
      "Pending Connections",
      overview?.connectionsPending ?? 0,
    ],
  ] as const;

  const contentTypes = [
    [
      "Projects",
      overview?.projects ?? 0,
    ],
    [
      "Products",
      overview?.products ?? 0,
    ],
    [
      "Knowledge",
      overview?.knowledge ?? 0,
    ],
    [
      "People",
      overview?.people ?? 0,
    ],
    [
      "Organisations",
      overview?.organisations ?? 0,
    ],
    [
      "Universities",
      overview?.universities ?? 0,
    ],
    [
      "Opportunities",
      overview?.opportunities ?? 0,
    ],
    [
      "Places",
      overview?.places ?? 0,
    ],
  ] as const;

  const modules = [
    {
      title:
        "Members",
      href:
        "/admin/members",
      description:
        "Arknoz IDs, profile records, verification and suspension controls.",
    },
    {
      title:
        "Content",
      href:
        "/admin/content",
      description:
        "Create, edit, review, publish, archive and feature canonical content.",
    },
    {
      title:
        "Community",
      href:
        "/admin/community",
      description:
        "Inspect connection, collaboration and service requests.",
    },
    {
      title:
        "Placements",
      href:
        "/admin/placements",
      description:
        "Editorial and future placement inventory controls.",
    },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
            Phase 1 Operations
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Arknoz Control Centre
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-400">
            Operational control for
            members, canonical content,
            publishing, community and
            platform inventory.
          </p>
        </div>

        <div className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
          {authority.role}
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          Phase 1 overview database
          functions are not available
          remotely yet.
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(
          ([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {label}
              </div>

              <div className="mt-3 text-3xl font-semibold">
                {value}
              </div>
            </div>
          )
        )}
      </div>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Operations
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map(
            (module) => (
              <Link
                key={module.title}
                href={module.href}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.06]"
              >
                <div className="text-lg font-semibold">
                  {module.title}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {module.description}
                </p>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Canonical Content
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          Content Inventory
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contentTypes.map(
            ([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 p-4"
              >
                <div className="text-xs uppercase tracking-[0.1em] text-slate-500">
                  {label}
                </div>

                <div className="mt-2 text-2xl font-semibold">
                  {value}
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs uppercase tracking-[0.1em] text-slate-500">
            Public Profiles
          </div>

          <div className="mt-3 text-3xl font-semibold">
            {overview?.publicProfiles ??
              0}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs uppercase tracking-[0.1em] text-slate-500">
            Accepted Connections
          </div>

          <div className="mt-3 text-3xl font-semibold">
            {overview?.connectionsAccepted ??
              0}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs uppercase tracking-[0.1em] text-slate-500">
            Requests · 7 days
          </div>

          <div className="mt-3 text-3xl font-semibold">
            {overview?.connectionRequests7d ??
              0}
          </div>
        </div>
      </section>

      <div className="mt-8 text-xs text-slate-600">
        Pricing, subscriptions, revenue
        and advanced commercial analytics
        are intentionally deferred beyond
        Phase 1.
      </div>
    </div>
  );
}
