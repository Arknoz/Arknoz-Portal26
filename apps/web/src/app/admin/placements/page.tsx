import type { Metadata } from "next";

import { requirePlatformPlacementManager } from "@/lib/admin/access";
import { createClient } from "@/lib/supabase/server";
import PlacementAdminOperations from "@/components/PlacementAdminOperations";

import {
  createPlacementCampaign,
  materializePlacementSlot,
} from "./actions";

export const metadata: Metadata = {
  title: "Placements & Ads | Arknoz Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type SummaryRow = {
  registered_templates: number | string | null;
  materialized_instances: number | string | null;
  paid_eligible_instances: number | string | null;
  available_instances: number | string | null;
  reserved_instances: number | string | null;
  occupied_instances: number | string | null;
  live_assignments: number | string | null;
  active_campaigns: number | string | null;
};

type TemplateRow = {
  slot_id: string;
  surface_id: string;
  component_name: string;
  slot_role: string;
  position: number;
  scope_mode: string;
  context_type: string | null;
  route_pattern: string | null;
  status: string;
  materialized_count: number | string | null;
};

type InstanceRow = {
  id: string;
  instance_key: string;
  slot_id: string;
  context_key: string;
  surface_id: string | null;
  context_type: string | null;
  page_path: string | null;
  paid_eligible: boolean;
  inventory_status: string;
  current_assignment_id: string | null;
  current_placement_type: string | null;
  current_assignment_status: string | null;
  current_campaign_id: string | null;
  current_campaign_name: string | null;
};

type CampaignRow = {
  id: string;
  name: string;
  campaign_type: string;
  advertiser_name: string | null;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  currency_code: string | null;
  budget_minor: number | string | null;
  assignment_count: number | string | null;
  live_assignment_count: number | string | null;
};

function displayCount(
  value: number | string | null | undefined
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "0";
  }

  const numeric = Number(value);

  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat("en").format(
      numeric
    );
  }

  return String(value);
}

function displayValue(
  value: string | null | undefined
) {
  return value?.trim() || "—";
}

export default async function AdminPlacementsPage() {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const supabase =
    await createClient();

  const [
    summaryResult,
    templateResult,
    instanceResult,
    campaignResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_placement_summary"
    ),

    supabase.rpc(
      "get_platform_placement_templates",
      {
        result_limit: 100,
        result_offset: 0,
      }
    ),

    supabase.rpc(
      "get_platform_placement_instances",
      {
        result_limit: 100,
        result_offset: 0,
      }
    ),

    supabase.rpc(
      "get_platform_placement_campaigns",
      {
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

  const templates =
    (
      templateResult.data as
        | TemplateRow[]
        | null
    ) ?? [];

  const instances =
    (
      instanceResult.data as
        | InstanceRow[]
        | null
    ) ?? [];

  const campaigns =
    (
      campaignResult.data as
        | CampaignRow[]
        | null
    ) ?? [];

  const loadErrors = [
    summaryResult.error
      ? "Inventory summary"
      : null,

    templateResult.error
      ? "Slot templates"
      : null,

    instanceResult.error
      ? "Exact instances"
      : null,

    campaignResult.error
      ? "Campaigns"
      : null,
  ].filter(Boolean) as string[];

  const metrics = [
    [
      "Registered templates",
      displayCount(
        summary?.registered_templates
      ),
    ],
    [
      "Materialized instances",
      displayCount(
        summary?.materialized_instances
      ),
    ],
    [
      "Paid eligible",
      displayCount(
        summary?.paid_eligible_instances
      ),
    ],
    [
      "Available",
      displayCount(
        summary?.available_instances
      ),
    ],
    [
      "Reserved",
      displayCount(
        summary?.reserved_instances
      ),
    ],
    [
      "Occupied",
      displayCount(
        summary?.occupied_instances
      ),
    ],
    [
      "Live assignments",
      displayCount(
        summary?.live_assignments
      ),
    ],
    [
      "Active campaigns",
      displayCount(
        summary?.active_campaigns
      ),
    ],
  ] as const;

  return (
    <div>
      <div className="max-w-4xl">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
          Commercial Inventory
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Placements & Ads
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-400">
          Manage permanent Arknoz placement templates,
          individually addressable page positions,
          assignments and campaigns without pre-creating
          the full global inventory.
        </p>
      </div>

      {loadErrors.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          Database controls are not available yet for:{" "}
          {loadErrors.join(", ")}. The local migrations
          have not been applied to the remote database.
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
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
        ))}
      </div>


      <section className="mt-10">
        <div className="grid gap-6 xl:grid-cols-2">
          <form
            action={materializePlacementSlot}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Individual Inventory
            </div>

            <h2 className="mt-2 text-xl font-semibold">
              Create Exact Slot
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Materialize one exact page position only when
              it needs operational or commercial control.
            </p>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">
                  Slot template
                </span>

                <select
                  name="slot_id"
                  required
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    Select slot template
                  </option>

                  {templates.map((template) => (
                    <option
                      key={template.slot_id}
                      value={template.slot_id}
                    >
                      {template.slot_id} ·{" "}
                      {template.surface_id} ·{" "}
                      {template.slot_role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">
                  Context key
                </span>

                <input
                  name="context_key"
                  required
                  placeholder="mumbai"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">
                  Exact page path
                </span>

                <input
                  name="page_path"
                  placeholder="/global/mumbai"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  name="paid_eligible"
                  className="h-4 w-4"
                />

                Enable this exact position for paid placement
              </label>
            </div>

            <button
              type="submit"
              disabled={templates.length === 0}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create Exact Slot
            </button>
          </form>

          <form
            action={createPlacementCampaign}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Commercial Control
            </div>

            <h2 className="mt-2 text-xl font-semibold">
              Create Campaign
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Campaigns remain draft until explicitly
              scheduled or activated.
            </p>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">
                  Campaign name
                </span>

                <input
                  name="name"
                  required
                  placeholder="Mumbai Projects Q4"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">
                  Type
                </span>

                <select
                  name="campaign_type"
                  required
                  defaultValue="sponsored"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="sponsored">
                    Sponsored
                  </option>
                  <option value="partner">
                    Partner
                  </option>
                  <option value="featured">
                    Featured
                  </option>
                  <option value="editorial">
                    Editorial
                  </option>
                  <option value="house">
                    Arknoz House
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">
                  Advertiser
                </span>

                <input
                  name="advertiser_name"
                  placeholder="Organisation name"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-300">
                    Currency
                  </span>

                  <input
                    name="currency_code"
                    placeholder="INR"
                    maxLength={3}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm uppercase text-white outline-none placeholder:text-slate-600"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-300">
                    Budget minor units
                  </span>

                  <input
                    name="budget_minor"
                    inputMode="numeric"
                    placeholder="500000"
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Create Campaign
            </button>
          </form>
        </div>
      </section>
      <section className="mt-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Structure
            </div>

            <h2 className="mt-2 text-2xl font-semibold">
              Slot Templates
            </h2>
          </div>

          <div className="text-sm text-slate-500">
            {templates.length} loaded
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Slot
                  </th>
                  <th className="px-5 py-4">
                    Surface
                  </th>
                  <th className="px-5 py-4">
                    Component
                  </th>
                  <th className="px-5 py-4">
                    Role
                  </th>
                  <th className="px-5 py-4">
                    Context
                  </th>
                  <th className="px-5 py-4 text-right">
                    Instances
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <tr
                      key={template.slot_id}
                      className="bg-white/[0.015]"
                    >
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-white">
                        {template.slot_id}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {template.surface_id}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {template.component_name}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {template.slot_role}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {displayValue(
                          template.context_type
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-medium text-slate-300">
                        {displayCount(
                          template.materialized_count
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No templates available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Individual Inventory
            </div>

            <h2 className="mt-2 text-2xl font-semibold">
              Exact Slot Instances
            </h2>
          </div>

          <div className="text-sm text-slate-500">
            {instances.length} loaded
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Instance
                  </th>
                  <th className="px-5 py-4">
                    Surface
                  </th>
                  <th className="px-5 py-4">
                    Context
                  </th>
                  <th className="px-5 py-4">
                    Inventory
                  </th>
                  <th className="px-5 py-4">
                    Paid
                  </th>
                  <th className="px-5 py-4">
                    Assignment
                  </th>
                  <th className="px-5 py-4">
                    Campaign
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {instances.length > 0 ? (
                  instances.map((instance) => (
                    <tr
                      key={instance.id}
                      className="bg-white/[0.015]"
                    >
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-white">
                        {instance.instance_key}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {displayValue(
                          instance.surface_id
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {instance.context_key}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {instance.inventory_status}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {instance.paid_eligible
                          ? "Yes"
                          : "No"}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {displayValue(
                          instance.current_placement_type
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {displayValue(
                          instance.current_campaign_name
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No exact slot instances have been
                      materialized yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Commercial Control
            </div>

            <h2 className="mt-2 text-2xl font-semibold">
              Campaigns
            </h2>
          </div>

          <div className="text-sm text-slate-500">
            {campaigns.length} loaded
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {campaign.name}
                    </h3>

                    <div className="mt-1 text-sm text-slate-500">
                      {displayValue(
                        campaign.advertiser_name
                      )}
                    </div>
                  </div>

                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {campaign.status}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                      Type
                    </div>

                    <div className="mt-2 text-slate-300">
                      {campaign.campaign_type}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                      Assignments
                    </div>

                    <div className="mt-2 text-slate-300">
                      {displayCount(
                        campaign.assignment_count
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                      Live
                    </div>

                    <div className="mt-2 text-slate-300">
                      {displayCount(
                        campaign.live_assignment_count
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-500 lg:col-span-2">
              No campaigns have been created yet.
            </div>
          )}
        </div>
      </section>

      <PlacementAdminOperations
        campaigns={campaigns}
        instances={instances}
      />    </div>
  );
}
