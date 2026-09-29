import type { Metadata } from "next";
import Link from "next/link";

import { requirePlatformMemberManager } from "@/lib/admin/access";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Members | Arknoz Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type SummaryRow = {
  total_members: number | string | null;
  pro_members: number | string | null;
  public_profiles: number | string | null;
  verified_public_profiles: number | string | null;
  new_members_7d: number | string | null;
  new_members_30d: number | string | null;
  active_members_30d: number | string | null;
};

type MemberRow = {
  user_id: string;
  arknoz_id: string | null;
  email: string | null;

  full_name: string;
  stage: string;
  headline: string;
  organisation: string | null;
  location: string;

  membership: string;
  membership_id: string | null;
  membership_expires_at: string | null;
  arknoz_points: number | string | null;

  email_verified: boolean;

  public_profile_status: string;
  person_slug: string | null;
  person_path: string | null;
  verification_status: string | null;

  profile_completeness: number;

  created_at: string;
  last_sign_in_at: string | null;
};

function countValue(
  value: number | string | null | undefined
) {
  const numeric =
    Number(value ?? 0);

  return Number.isFinite(numeric)
    ? new Intl.NumberFormat("en").format(
        numeric
      )
    : "0";
}

function dateValue(
  value: string | null
) {
  if (!value) {
    return "Never";
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
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
  ).format(parsed);
}

type AdminMembersPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    membership?: string | string[];
    public?: string | string[];
    verification?: string | string[];
  }>;
};

function firstParam(
  value: string | string[] | undefined
) {
  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
}

export default async function AdminMembersPage({
  searchParams,
}: AdminMembersPageProps) {
  await requirePlatformMemberManager(
    "/admin/members"
  );

  const params =
    await searchParams;

  const search =
    firstParam(params.q).trim();

  const membership =
    firstParam(
      params.membership
    ).trim();

  const publicStatus =
    firstParam(
      params.public
    ).trim();

  const verification =
    firstParam(
      params.verification
    ).trim();

  const supabase =
    await createClient();

  const [
    summaryResult,
    membersResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_member_summary"
    ),

    supabase.rpc(
      "get_platform_members",
      {
        filter_membership:
          membership || null,

        filter_public_status:
          publicStatus || null,

        filter_verification_status:
          verification || null,

        search_text:
          search || null,

        result_limit: 100,
        result_offset: 0,
      }
    ),
  ]);

  const summary =
    (
      summaryResult.data as
        | SummaryRow[]
        | null
    )?.[0] ?? null;

  const members =
    (
      membersResult.data as
        | MemberRow[]
        | null
    ) ?? [];

  const unavailable =
    Boolean(
      summaryResult.error ||
      membersResult.error
    );

  const metrics = [
    [
      "Total members",
      countValue(
        summary?.total_members
      ),
    ],
    [
      "Arknoz Pro",
      countValue(
        summary?.pro_members
      ),
    ],
    [
      "Public profiles",
      countValue(
        summary?.public_profiles
      ),
    ],
    [
      "Verified profiles",
      countValue(
        summary?.verified_public_profiles
      ),
    ],
    [
      "New · 7 days",
      countValue(
        summary?.new_members_7d
      ),
    ],
    [
      "New · 30 days",
      countValue(
        summary?.new_members_30d
      ),
    ],
    [
      "Active · 30 days",
      countValue(
        summary?.active_members_30d
      ),
    ],
  ] as const;

  return (
    <div>
      <div className="max-w-4xl">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
          Identity & Growth
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Members
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-400">
          Review Arknoz IDs, account activity,
          membership, profile publication and
          linked Person verification.
        </p>
      </div>

      {unavailable ? (
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          Member administration data is not available
          yet because the local Admin migrations have
          not been applied to the remote database.
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(
          ([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
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
        <div className="flex items-end justify-between gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Member Directory
            </div>

            <h2 className="mt-2 text-2xl font-semibold">
              Accounts
            </h2>
          </div>

          <div className="text-sm text-slate-500">
            {members.length} loaded
          </div>
        </div>


        <form
          method="get"
          className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 lg:grid-cols-[minmax(240px,1fr)_180px_180px_180px_auto_auto]"
        >
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search Arknoz ID, name, email or slug"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <select
            name="membership"
            defaultValue={membership}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
          >
            <option value="">
              All memberships
            </option>

            <option value="FREE">
              FREE
            </option>

            <option value="PRO">
              PRO
            </option>
          </select>

          <select
            name="public"
            defaultValue={publicStatus}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
          >
            <option value="">
              All profile states
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="review">
              Review
            </option>

            <option value="archived">
              Archived
            </option>

            <option value="not_linked">
              Not linked
            </option>

            <option value="invalid_link">
              Invalid link
            </option>
          </select>

          <select
            name="verification"
            defaultValue={verification}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
          >
            <option value="">
              All verification
            </option>

            <option value="verified">
              Verified
            </option>

            <option value="source_backed">
              Source backed
            </option>

            <option value="unverified">
              Unverified
            </option>

            <option value="none">
              No Person record
            </option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Apply
          </button>

          <Link
            href="/admin/members"
            className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold text-slate-300"
          >
            Clear
          </Link>
        </form>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Member
                  </th>

                  <th className="px-5 py-4">
                    Arknoz ID
                  </th>

                  <th className="px-5 py-4">
                    Membership
                  </th>

                  <th className="px-5 py-4">
                    Email
                  </th>

                  <th className="px-5 py-4">
                    Public Profile
                  </th>

                  <th className="px-5 py-4">
                    Verification
                  </th>

                  <th className="px-5 py-4">
                    Complete
                  </th>

                  <th className="px-5 py-4">
                    Joined
                  </th>

                  <th className="px-5 py-4">
                    Last Sign-in
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {members.length > 0 ? (
                  members.map(
                    (member) => (
                      <tr
                        key={member.user_id}
                        className="bg-white/[0.015]"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/members/${member.user_id}`}
                            className="font-semibold text-white hover:underline"
                          >
                            {member.full_name ||
                              "Unnamed member"}
                          </Link>

                          <div className="mt-1 text-xs text-slate-500">
                            {member.stage}
                            {member.location
                              ? ` · ${member.location}`
                              : ""}
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-slate-300">
                          {member.arknoz_id ??
                            "Pending"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold">
                            {member.membership}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-slate-300">
                            {member.email ??
                              "—"}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {member.email_verified
                              ? "Verified"
                              : "Unverified"}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {member.public_profile_status}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {member.verification_status ??
                            "None"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="w-28">
                            <div className="text-xs font-semibold">
                              {member.profile_completeness}%
                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full bg-white"
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(
                                      member.profile_completeness,
                                      100
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {dateValue(
                            member.created_at
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {dateValue(
                            member.last_sign_in_at
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No members available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
