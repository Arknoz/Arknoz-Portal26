import type {
  Metadata,
} from "next";

import {
  requirePlatformOwner,
} from "@/lib/admin/access";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  removePlatformAdminAction,
  setPlatformAdminByEmail,
} from "./actions";


export const metadata: Metadata = {
  title:
    "Settings | Arknoz Admin",

  robots: {
    index: false,
    follow: false,
  },
};


type AdminRow = {
  user_id: string;
  email: string | null;
  arknoz_id: string | null;
  full_name: string;
  platform_role: string;
  status: string;
  granted_at: string;
  updated_at: string;
  granted_by_user_id: string | null;
};


type AdminAuditRow = {
  audit_id: number | string;
  action: string;

  actor_user_id: string | null;
  actor_email: string | null;

  target_user_id: string | null;
  target_email: string | null;

  old_role: string | null;
  new_role: string | null;

  old_status: string | null;
  new_status: string | null;

  created_at: string;
};


type OperationsAuditRow = {
  event_type: string;
  action: string;

  actor_user_id: string | null;
  actor_email: string | null;

  target_label: string;
  detail: string;

  created_at: string;
};


function dateValue(
  value:
    | string
    | null
    | undefined
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
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }
  ).format(date);
}


export default async function AdminSettingsPage() {
  const authority =
    await requirePlatformOwner(
      "/admin/settings"
    );

  const supabase =
    await createClient();

  const [
    rosterResult,
    adminAuditResult,
    operationsAuditResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_admin_roster"
    ),

    supabase.rpc(
      "get_platform_admin_audit_recent",
      {
        result_limit:
          50,
      }
    ),

    supabase.rpc(
      "get_platform_operations_audit_recent",
      {
        result_limit:
          50,
      }
    ),
  ]);

  const roster =
    rosterResult.error
      ? []
      : (
          rosterResult.data ??
          []
        ) as AdminRow[];

  const adminAudit =
    adminAuditResult.error
      ? []
      : (
          adminAuditResult.data ??
          []
        ) as AdminAuditRow[];

  const operationsAudit =
    operationsAuditResult.error
      ? []
      : (
          operationsAuditResult.data ??
          []
        ) as OperationsAuditRow[];

  const unavailable =
    Boolean(
      rosterResult.error ||
      adminAuditResult.error ||
      operationsAuditResult.error
    );

  return (
    <div>
      <div className="max-w-4xl">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
          Settings
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Platform Administration
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Owner-only control of Arknoz
          platform administration
          authority and audit history.
        </p>

        <div className="mt-3 text-xs font-mono text-slate-600">
          Signed in as {authority.user.email}
        </div>
      </div>

      {unavailable ? (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          System Settings database
          functions are not available
          remotely yet.
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Authority
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          Add or Update Admin
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          The user must already have an
          Arknoz authentication account.
        </p>

        <form
          action={setPlatformAdminByEmail}
          className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="Arknoz account email"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <select
            name="role"
            required
            defaultValue="ADMIN"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          >
            <option value="OWNER">
              Owner
            </option>

            <option value="ADMIN">
              Admin
            </option>

            <option value="EDITOR">
              Editor
            </option>

            <option value="MODERATOR">
              Moderator
            </option>
          </select>

          <select
            name="status"
            required
            defaultValue="active"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          >
            <option value="active">
              Active
            </option>

            <option value="suspended">
              Suspended
            </option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Save
          </button>
        </form>
      </section>

      <section className="mt-8">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Admin Roster
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.1em] text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  Admin
                </th>

                <th className="px-5 py-4">
                  Role
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Updated
                </th>

                <th className="px-5 py-4">
                  Control
                </th>
              </tr>
            </thead>

            <tbody>
              {roster.length > 0 ? (
                roster.map(
                  (admin) => (
                    <tr
                      key={admin.user_id}
                      className="border-b border-white/5 align-top last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold">
                          {admin.full_name ||
                            admin.email ||
                            "Admin"}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {admin.email ??
                            "No email"}
                        </div>

                        <div className="mt-1 font-mono text-xs text-slate-600">
                          {admin.arknoz_id ??
                            admin.user_id}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {admin.platform_role}
                      </td>

                      <td className="px-5 py-4">
                        {admin.status}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {dateValue(
                          admin.updated_at
                        )}
                      </td>

                      <td className="min-w-72 px-5 py-4">
                        <form
                          action={
                            setPlatformAdminByEmail
                          }
                          className="grid gap-2"
                        >
                          <input
                            type="hidden"
                            name="email"
                            value={
                              admin.email ??
                              ""
                            }
                          />

                          <select
                            name="role"
                            defaultValue={
                              admin.platform_role
                            }
                            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                          >
                            <option value="OWNER">
                              Owner
                            </option>

                            <option value="ADMIN">
                              Admin
                            </option>

                            <option value="EDITOR">
                              Editor
                            </option>

                            <option value="MODERATOR">
                              Moderator
                            </option>
                          </select>

                          <select
                            name="status"
                            defaultValue={
                              admin.status
                            }
                            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                          >
                            <option value="active">
                              Active
                            </option>

                            <option value="suspended">
                              Suspended
                            </option>
                          </select>

                          <button
                            type="submit"
                            disabled={!admin.email}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold disabled:opacity-40"
                          >
                            Update
                          </button>
                        </form>

                        <form
                          action={
                            removePlatformAdminAction
                          }
                          className="mt-2"
                        >
                          <input
                            type="hidden"
                            name="user_id"
                            value={
                              admin.user_id
                            }
                          />

                          <button
                            type="submit"
                            className="w-full rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300"
                          >
                            Remove Authority
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Admin roster unavailable.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          Arknoz prevents deletion,
          demotion or suspension of the
          final active Owner.
        </p>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Authority Audit
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  Time
                </th>

                <th className="px-4 py-3">
                  Action
                </th>

                <th className="px-4 py-3">
                  Actor
                </th>

                <th className="px-4 py-3">
                  Target
                </th>

                <th className="px-4 py-3">
                  Change
                </th>
              </tr>
            </thead>

            <tbody>
              {adminAudit.map(
                (row) => (
                  <tr
                    key={String(
                      row.audit_id
                    )}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-4 py-3 text-slate-500">
                      {dateValue(
                        row.created_at
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {row.action}
                    </td>

                    <td className="px-4 py-3">
                      {row.actor_email ??
                        "System"}
                    </td>

                    <td className="px-4 py-3">
                      {row.target_email ??
                        row.target_user_id ??
                        "—"}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {row.old_role ??
                        "—"}
                      {" → "}
                      {row.new_role ??
                        "—"}
                      {" · "}
                      {row.old_status ??
                        "—"}
                      {" → "}
                      {row.new_status ??
                        "—"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Operations Audit
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  Time
                </th>

                <th className="px-4 py-3">
                  Area
                </th>

                <th className="px-4 py-3">
                  Action
                </th>

                <th className="px-4 py-3">
                  Actor
                </th>

                <th className="px-4 py-3">
                  Target
                </th>
              </tr>
            </thead>

            <tbody>
              {operationsAudit.map(
                (row, index) => (
                  <tr
                    key={`${row.event_type}-${row.created_at}-${index}`}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-4 py-3 text-slate-500">
                      {dateValue(
                        row.created_at
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {row.event_type}
                    </td>

                    <td className="px-4 py-3">
                      {row.action}
                    </td>

                    <td className="px-4 py-3">
                      {row.actor_email ??
                        "System"}
                    </td>

                    <td className="max-w-lg px-4 py-3">
                      <div>
                        {row.target_label}
                      </div>

                      <div className="mt-1 truncate text-slate-600">
                        {row.detail}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
