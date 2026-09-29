import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  requirePlatformCommunityModerator,
} from "@/lib/admin/access";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  cancelPendingConnectionAdmin,
} from "./actions";


export const metadata: Metadata = {
  title:
    "Community | Arknoz Admin",

  robots: {
    index: false,
    follow: false,
  },
};


type CommunitySummary = {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
  cancelled: number;
  new7d: number;
  connect: number;
  collaborate: number;
  service: number;
};


type ConnectionRow = {
  request_id: string;
  request_type: string;
  status: string;
  context_path: string | null;
  note: string | null;

  requester_arknoz_id: string | null;
  requester_name: string;

  recipient_arknoz_id: string | null;
  recipient_name: string;

  created_at: string;
  updated_at: string;
  responded_at: string | null;
};


function firstParam(
  value:
    | string
    | string[]
    | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}


function displayDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
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
  ).format(date);
}


export default async function AdminCommunityPage({
  searchParams,
}: {
  searchParams: Promise<
    Record<
      string,
      string |
      string[] |
      undefined
    >
  >;
}) {
  await requirePlatformCommunityModerator(
    "/admin/community"
  );

  const params =
    await searchParams;

  const q =
    firstParam(
      params.q
    ).trim();

  const status =
    firstParam(
      params.status
    ).trim();

  const type =
    firstParam(
      params.type
    ).trim();

  const supabase =
    await createClient();

  const [
    summaryResult,
    connectionsResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_community_summary"
    ),

    supabase.rpc(
      "get_platform_community_connections",
      {
        search_text:
          q || null,

        filter_status:
          status || null,

        filter_request_type:
          type || null,

        result_limit:
          100,

        result_offset:
          0,
      }
    ),
  ]);

  const summary =
    summaryResult.error
      ? null
      : (
          summaryResult.data as
            | CommunitySummary
            | null
        );

  const connections =
    connectionsResult.error
      ? []
      : (
          connectionsResult.data ??
          []
        ) as ConnectionRow[];

  const unavailable =
    Boolean(
      summaryResult.error ||
      connectionsResult.error
    );

  const metrics = [
    [
      "Total",
      summary?.total ?? 0,
    ],
    [
      "Pending",
      summary?.pending ?? 0,
    ],
    [
      "Accepted",
      summary?.accepted ?? 0,
    ],
    [
      "New 7 days",
      summary?.new7d ?? 0,
    ],
    [
      "Connect",
      summary?.connect ?? 0,
    ],
    [
      "Collaborate",
      summary?.collaborate ?? 0,
    ],
    [
      "Service",
      summary?.service ?? 0,
    ],
    [
      "Cancelled",
      summary?.cancelled ?? 0,
    ],
  ] as const;

  return (
    <div>
      <div className="max-w-4xl">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
          Community
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Community Moderation
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Inspect Arknoz connection,
          collaboration and service
          requests. Phase 1 moderation
          can cancel pending requests.
          Member suspension is handled
          separately in Members.
        </p>
      </div>

      {unavailable ? (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          Community Admin database
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

      <form
        method="get"
        className="mt-10 grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto_auto]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search Arknoz ID, member, context"
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
        />

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
        >
          <option value="">
            All states
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="accepted">
            Accepted
          </option>

          <option value="declined">
            Declined
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>

        <select
          name="type"
          defaultValue={type}
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
        >
          <option value="">
            All types
          </option>

          <option value="connect">
            Connect
          </option>

          <option value="collaborate">
            Collaborate
          </option>

          <option value="service">
            Service
          </option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Apply
        </button>

        <Link
          href="/admin/community"
          className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold text-slate-300"
        >
          Clear
        </Link>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.1em] text-slate-500">
            <tr>
              <th className="px-5 py-4">
                Requester
              </th>

              <th className="px-5 py-4">
                Recipient
              </th>

              <th className="px-5 py-4">
                Type
              </th>

              <th className="px-5 py-4">
                State
              </th>

              <th className="px-5 py-4">
                Context
              </th>

              <th className="px-5 py-4">
                Date
              </th>

              <th className="px-5 py-4">
                Moderation
              </th>
            </tr>
          </thead>

          <tbody>
            {connections.length > 0 ? (
              connections.map(
                (row) => (
                  <tr
                    key={row.request_id}
                    className="border-b border-white/5 align-top last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold">
                        {row.requester_name ||
                          "Unnamed member"}
                      </div>

                      <div className="mt-1 font-mono text-xs text-slate-500">
                        {row.requester_arknoz_id ??
                          "No Arknoz ID"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold">
                        {row.recipient_name ||
                          "Unnamed member"}
                      </div>

                      <div className="mt-1 font-mono text-xs text-slate-500">
                        {row.recipient_arknoz_id ??
                          "No Arknoz ID"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {row.request_type}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {row.status}
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <div className="break-words text-xs text-slate-400">
                        {row.context_path ??
                          "—"}
                      </div>

                      {row.note ? (
                        <div className="mt-2 max-w-xs break-words text-xs text-slate-500">
                          {row.note}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-400">
                      {displayDate(
                        row.created_at
                      )}
                    </td>

                    <td className="min-w-64 px-5 py-4">
                      {row.status ===
                      "pending" ? (
                        <form
                          action={
                            cancelPendingConnectionAdmin
                          }
                          className="space-y-2"
                        >
                          <input
                            type="hidden"
                            name="request_id"
                            value={
                              row.request_id
                            }
                          />

                          <input
                            required
                            maxLength={1000}
                            name="moderation_note"
                            placeholder="Reason for cancellation"
                            className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                          />

                          <button
                            type="submit"
                            className="w-full rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300"
                          >
                            Cancel Pending
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-slate-600">
                          No Phase 1 action
                        </span>
                      )}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No community requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {connections.length >= 100 ? (
        <div className="mt-3 text-xs text-slate-500">
          Showing the first 100
          matching requests.
        </div>
      ) : null}
    </div>
  );
}
