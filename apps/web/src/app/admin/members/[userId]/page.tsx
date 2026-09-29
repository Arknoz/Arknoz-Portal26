import type { Metadata } from "next";
import Link from "next/link";

import { requirePlatformMemberManager } from "@/lib/admin/access";
import { createClient } from "@/lib/supabase/server";

import { setMemberAccess } from "./actions";

export const metadata: Metadata = {
  title: "Member Detail | Arknoz Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type MemberAccessAdmin = {
  status: "active" | "suspended";
  reason: string | null;
  changedAt: string | null;
  changedByUserId: string | null;
  changedByArknozId: string | null;

  recentAudit: Array<{
    id: string;
    actorUserId: string | null;
    actorArknozId: string | null;
    oldStatus: string | null;
    newStatus: string;
    oldReason: string | null;
    newReason: string | null;
    createdAt: string;
  }>;
};

type MemberDetail = {
  account: {
    userId: string;
    email: string | null;
    emailVerified: boolean;
    createdAt: string;
    lastSignInAt: string | null;
  };

  profile: {
    arknozId: string | null;
    fullName: string;
    stage: string;
    headline: string;
    organisation: string | null;
    location: string;
    about: string;
    disciplines: string[];
    sectors: string[];
    skills: string[];
    languages: string[];
    countries: string[];
    yearsExperience: number | null;
    website: string | null;
    portfolioUrl: string | null;
    linkedinUrl: string | null;
    updatedAt: string | null;
    completeness: number;
  };

  membership: {
    plan: string;
    membershipId: string | null;
    expiresAt: string | null;
    arknozPoints: number | string;
  };

  publicProfile: {
    linked: boolean;
    entityId: string | null;
    slug: string | null;
    canonicalPath: string | null;
    contentStatus: string | null;
    verificationStatus: string | null;
    lastVerifiedAt: string | null;
    publishedAt: string | null;
  };

  counts: {
    saved: number;
    following: number;
    experiences: number;
    credentials: number;
    services: number;
    publishedServices: number;
    connections: number;
    pendingIncomingConnections: number;
    pendingOutgoingConnections: number;
    pendingCollaborationRequests: number;
    pendingServiceRequests: number;
  };

  experiences: Array<{
    id: string;
    type: string;
    role: string;
    organisation: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    current: boolean;
    verification: string;
  }>;

  credentials: Array<{
    id: string;
    type: string;
    title: string;
    issuer: string;
    credentialId: string | null;
    issueDate: string | null;
    expiryDate: string | null;
    url: string | null;
    verification: string;
  }>;

  services: Array<{
    id: string;
    type: string;
    title: string;
    summary: string;
    availability: string;
    status: string;
  }>;

  recentActions: Array<{
    type: string;
    targetPath: string;
    createdAt: string;
  }>;

  recentRequests: Array<{
    id: string;
    direction: string;
    counterpartyUserId: string;
    requestType: string;
    contextPath: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    respondedAt: string | null;
  }>;
};

function dateValue(
  value: string | null | undefined
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(date);
}

function textValue(
  value: string | null | undefined
) {
  return value?.trim() || "—";
}

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const {
    userId,
  } = await params;

  await requirePlatformMemberManager(
    `/admin/members/${userId}`
  );

  const supabase =
    await createClient();

  const [
    detailResult,
    accessResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_member_detail",
      {
        target_user_id:
          userId,
      }
    ),

    supabase.rpc(
      "get_platform_member_access_admin",
      {
        target_user_id:
          userId,
      }
    ),
  ]);

  const member =
    detailResult.error
      ? null
      : detailResult.data as MemberDetail | null;

  const memberAccess =
    accessResult.error
      ? null
      : accessResult.data as
          | MemberAccessAdmin
          | null;

  if (!member) {
    return (
      <div>
        <Link
          href="/admin/members"
          className="text-sm font-semibold text-slate-400 hover:text-white"
        >
          ← Members
        </Link>

        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm text-amber-200">
          Member detail is not available yet. The local
          Admin member migrations have not been applied
          to the remote database, or this member no longer
          exists.
        </div>
      </div>
    );
  }

  const metrics = [
    ["Saved", member.counts.saved],
    ["Following", member.counts.following],
    ["Connections", member.counts.connections],
    ["Experience", member.counts.experiences],
    ["Credentials", member.counts.credentials],
    ["Services", member.counts.services],
    [
      "Incoming requests",
      member.counts.pendingIncomingConnections,
    ],
    [
      "Collaboration requests",
      member.counts.pendingCollaborationRequests,
    ],
  ] as const;

  return (
    <div>
      <Link
        href="/admin/members"
        className="text-sm font-semibold text-slate-400 hover:text-white"
      >
        ← Members
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
            Member Record
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            {member.profile.fullName ||
              "Unnamed member"}
          </h1>

          <div className="mt-3 font-mono text-sm text-slate-400">
            {member.profile.arknozId ??
              "Arknoz ID pending"}
          </div>
        </div>

        <div className="flex gap-2">
          <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold">
            {member.membership.plan}
          </span>

          <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold">
            {member.profile.completeness}% complete
          </span>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Platform Access
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="text-2xl font-semibold">
                {memberAccess?.status ===
                "suspended"
                  ? "Suspended"
                  : "Active"}
              </div>

              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                {memberAccess?.status ??
                  "Unavailable"}
              </span>
            </div>
          </div>

          {memberAccess?.changedAt ? (
            <div className="text-right text-xs text-slate-500">
              <div>
                Last changed{" "}
                {dateValue(
                  memberAccess.changedAt
                )}
              </div>

              <div className="mt-1 font-mono">
                {memberAccess.changedByArknozId ??
                  memberAccess.changedByUserId ??
                  "System"}
              </div>
            </div>
          ) : null}
        </div>

        {!memberAccess ? (
          <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
            Access controls are unavailable until
            the local member access migrations are
            applied to the remote database.
          </div>
        ) : memberAccess.status ===
          "suspended" ? (
          <div className="mt-5">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
                Suspension reason
              </div>

              <div className="mt-2 text-sm leading-6 text-slate-300">
                {memberAccess.reason ??
                  "No reason recorded"}
              </div>
            </div>

            <form
              action={setMemberAccess}
              className="mt-4"
            >
              <input
                type="hidden"
                name="user_id"
                value={member.account.userId}
              />

              <input
                type="hidden"
                name="status"
                value="active"
              />

              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Restore Member Access
              </button>
            </form>
          </div>
        ) : (
          <form
            action={setMemberAccess}
            className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]"
          >
            <input
              type="hidden"
              name="user_id"
              value={member.account.userId}
            />

            <input
              type="hidden"
              name="status"
              value="suspended"
            />

            <textarea
              name="reason"
              required
              maxLength={1000}
              rows={3}
              placeholder="Reason for suspension"
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
            />

            <button
              type="submit"
              className="self-end rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200"
            >
              Suspend Member
            </button>
          </form>
        )}

        {memberAccess &&
        memberAccess.recentAudit.length > 0 ? (
          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Access History
            </div>

            <div className="mt-4 space-y-3">
              {memberAccess.recentAudit.map(
                (entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-3 text-sm">
                      <div>
                        <span className="font-semibold">
                          {entry.oldStatus ??
                            "active"}
                        </span>

                        <span className="mx-2 text-slate-600">
                          →
                        </span>

                        <span className="font-semibold">
                          {entry.newStatus}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        {dateValue(
                          entry.createdAt
                        )}
                      </div>
                    </div>

                    {entry.newReason ? (
                      <div className="mt-2 text-sm text-slate-400">
                        {entry.newReason}
                      </div>
                    ) : null}

                    <div className="mt-2 font-mono text-xs text-slate-600">
                      {entry.actorArknozId ??
                        entry.actorUserId ??
                        "System"}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : null}
      </section>
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

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Account
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">
                Email
              </dt>
              <dd className="mt-1 text-slate-200">
                {textValue(
                  member.account.email
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Email verification
              </dt>
              <dd className="mt-1 text-slate-200">
                {member.account.emailVerified
                  ? "Verified"
                  : "Unverified"}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Joined
              </dt>
              <dd className="mt-1 text-slate-200">
                {dateValue(
                  member.account.createdAt
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Last sign-in
              </dt>
              <dd className="mt-1 text-slate-200">
                {dateValue(
                  member.account.lastSignInAt
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Internal User ID
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-slate-400">
                {member.account.userId}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Membership
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">
                Plan
              </dt>
              <dd className="mt-1 text-slate-200">
                {member.membership.plan}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Membership ID
              </dt>
              <dd className="mt-1 text-slate-200">
                {textValue(
                  member.membership.membershipId
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Expiry
              </dt>
              <dd className="mt-1 text-slate-200">
                {dateValue(
                  member.membership.expiresAt
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Arknoz Points
              </dt>
              <dd className="mt-1 text-slate-200">
                {String(
                  member.membership.arknozPoints
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Public Person Profile
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">
                Linked
              </dt>
              <dd className="mt-1 text-slate-200">
                {member.publicProfile.linked
                  ? "Yes"
                  : "No"}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Publication
              </dt>
              <dd className="mt-1 text-slate-200">
                {textValue(
                  member.publicProfile.contentStatus
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Verification
              </dt>
              <dd className="mt-1 text-slate-200">
                {textValue(
                  member.publicProfile.verificationStatus
                )}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Public path
              </dt>
              <dd className="mt-1 text-slate-200">
                {member.publicProfile.canonicalPath ? (
                  <Link
                    href={
                      member.publicProfile.canonicalPath
                    }
                    className="hover:text-white"
                  >
                    {
                      member.publicProfile
                        .canonicalPath
                    }
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Profile
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          Professional Identity
        </h2>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                Stage
              </div>
              <div className="mt-2 text-sm">
                {member.profile.stage}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                Organisation
              </div>
              <div className="mt-2 text-sm">
                {textValue(
                  member.profile.organisation
                )}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                Location
              </div>
              <div className="mt-2 text-sm">
                {textValue(
                  member.profile.location
                )}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                Experience
              </div>
              <div className="mt-2 text-sm">
                {member.profile.yearsExperience ??
                  "—"}{" "}
                years
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
              Headline
            </div>

            <div className="mt-2 text-sm text-slate-300">
              {textValue(
                member.profile.headline
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
              About
            </div>

            <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
              {textValue(
                member.profile.about
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Experience
        </h2>

        <div className="mt-4 space-y-3">
          {member.experiences.length > 0 ? (
            member.experiences.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <div className="font-semibold">
                        {item.role}
                      </div>

                      <div className="mt-1 text-sm text-slate-400">
                        {item.organisation}
                        {item.location
                          ? ` · ${item.location}`
                          : ""}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      {item.verification}
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-sm text-slate-500">
              No experience records.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Credentials
        </h2>

        <div className="mt-4 space-y-3">
          {member.credentials.length > 0 ? (
            member.credentials.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="font-semibold">
                    {item.title}
                  </div>

                  <div className="mt-1 text-sm text-slate-400">
                    {item.issuer} ·{" "}
                    {item.verification}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-sm text-slate-500">
              No credential records.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Services
        </h2>

        <div className="mt-4 space-y-3">
          {member.services.length > 0 ? (
            member.services.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">
                        {item.title}
                      </div>

                      <div className="mt-1 text-sm text-slate-400">
                        {item.type}
                      </div>
                    </div>

                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                      {item.status}
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-sm text-slate-500">
              No services.
            </div>
          )}
        </div>
      </section>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold">
            Recent Actions
          </h2>

          <div className="mt-4 space-y-3">
            {member.recentActions.length > 0 ? (
              member.recentActions.map(
                (item, index) => (
                  <div
                    key={`${item.type}-${item.targetPath}-${index}`}
                    className="rounded-xl border border-white/10 p-4 text-sm"
                  >
                    <span className="font-semibold">
                      {item.type}
                    </span>

                    <span className="ml-3 text-slate-500">
                      {item.targetPath}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="text-sm text-slate-500">
                No recent actions.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">
            Recent Requests
          </h2>

          <div className="mt-4 space-y-3">
            {member.recentRequests.length > 0 ? (
              member.recentRequests.map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-semibold">
                        {item.requestType}
                      </span>

                      <span className="text-slate-500">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {item.direction} ·{" "}
                      {item.counterpartyUserId}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-sm text-slate-500">
                No recent requests.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
