import type {
  Metadata,
} from "next";

import {
  requirePlatformConsoleUser,
} from "@/lib/admin/access";

import {
  createClient,
} from "@/lib/supabase/server";


export const metadata: Metadata = {
  title:
    "System | Arknoz Admin",

  robots: {
    index: false,
    follow: false,
  },
};


type SystemHealth = {
  databaseNow: string;
  databaseName: string;
  currentRole: string;

  adminsTotal: number;
  adminsActive: number;
  ownersActive: number;
  adminsSuspended: number;

  membersSuspended: number;

  entitiesTotal: number;
  entitiesPublished: number;
  entitiesReview: number;

  connectionsTotal: number;
  connectionsPending: number;

  adminAuditEvents: number;
  contentAuditEvents: number;
  communityAuditEvents: number;
};


export default async function AdminSystemPage() {
  const authority =
    await requirePlatformConsoleUser(
      "/admin/system"
    );

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_platform_system_health"
  );

  const health =
    error
      ? null
      : data as
          | SystemHealth
          | null;

  const cards = [
    [
      "Active Admins",
      health?.adminsActive ?? 0,
    ],
    [
      "Active Owners",
      health?.ownersActive ?? 0,
    ],
    [
      "Suspended Admins",
      health?.adminsSuspended ?? 0,
    ],
    [
      "Suspended Members",
      health?.membersSuspended ?? 0,
    ],
    [
      "Canonical Content",
      health?.entitiesTotal ?? 0,
    ],
    [
      "Published Content",
      health?.entitiesPublished ?? 0,
    ],
    [
      "In Review",
      health?.entitiesReview ?? 0,
    ],
    [
      "Pending Connections",
      health?.connectionsPending ?? 0,
    ],
  ] as const;

  const audits = [
    [
      "Admin authority events",
      health?.adminAuditEvents ?? 0,
    ],
    [
      "Content events",
      health?.contentAuditEvents ?? 0,
    ],
    [
      "Community moderation events",
      health?.communityAuditEvents ?? 0,
    ],
  ] as const;

  return (
    <div>
      <div className="max-w-4xl">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
          System
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Platform Health
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Phase 1 operational health
          for Arknoz database records,
          administration authority,
          content and community.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          System health functions are
          not available remotely yet.
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
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

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Runtime
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs text-slate-500">
              Database
            </div>

            <div className="mt-2 font-mono text-sm">
              {health?.databaseName ??
                "Unavailable"}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Admin Role
            </div>

            <div className="mt-2 font-mono text-sm">
              {health?.currentRole ??
                authority.role}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Database Time
            </div>

            <div className="mt-2 font-mono text-sm">
              {health?.databaseNow ??
                "Unavailable"}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Audit Coverage
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {audits.map(
            ([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 p-4"
              >
                <div className="text-xs text-slate-500">
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

      <div className="mt-8 text-xs leading-5 text-slate-600">
        This is basic Phase 1
        application/database health.
        External infrastructure
        monitoring and advanced
        observability are deferred.
      </div>
    </div>
  );
}
