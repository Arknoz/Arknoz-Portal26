import {
  createPlacementAssignment,
  createPlacementCreative,
  setPlacementAssignmentStatus,
  setPlacementCampaignStatus,
  setPlacementCreativeStatus,
} from "@/app/admin/placements/actions";

import { createClient } from "@/lib/supabase/server";

type CampaignOption = {
  id: string;
  name: string;
  status: string;
};

type InstanceOption = {
  id: string;
  instance_key: string;
  paid_eligible: boolean;
  inventory_status: string;
};

type CreativeRow = {
  id: string;
  campaign_id: string;
  campaign_name: string;
  name: string;
  headline: string | null;
  status: string;
};

type AssignmentRow = {
  id: string;
  slot_instance_id: string;
  instance_key: string;
  placement_type: string;
  status: string;
  campaign_id: string | null;
  campaign_name: string | null;
  creative_id: string | null;
  creative_name: string | null;
  canonical_entity_type: string | null;
  canonical_entity_slug: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

export default async function PlacementAdminOperations({
  campaigns,
  instances,
}: {
  campaigns: CampaignOption[];
  instances: InstanceOption[];
}) {
  const supabase =
    await createClient();

  const [
    creativeResult,
    assignmentResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_placement_creatives",
      {
        result_limit: 100,
        result_offset: 0,
      }
    ),

    supabase.rpc(
      "get_platform_placement_assignments",
      {
        result_limit: 100,
        result_offset: 0,
      }
    ),
  ]);

  const creatives =
    (
      creativeResult.data as
        | CreativeRow[]
        | null
    ) ?? [];

  const assignments =
    (
      assignmentResult.data as
        | AssignmentRow[]
        | null
    ) ?? [];

  const readUnavailable =
    Boolean(
      creativeResult.error ||
      assignmentResult.error
    );

  return (
    <div className="mt-10 space-y-10">
      {readUnavailable ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          Creative and assignment controls will become
          available after the local placement migrations
          are applied to the database.
        </div>
      ) : null}

      <section>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Campaign Content
          </div>

          <h2 className="mt-2 text-2xl font-semibold">
            Creatives
          </h2>
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <form
            action={createPlacementCreative}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3 className="text-lg font-semibold">
              Create Creative
            </h3>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Campaign
                </span>

                <select
                  name="campaign_id"
                  required
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select campaign
                  </option>

                  {campaigns.map((campaign) => (
                    <option
                      key={campaign.id}
                      value={campaign.id}
                    >
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Creative name
                </span>

                <input
                  name="creative_name"
                  required
                  placeholder="Mumbai hero creative"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Headline
                </span>

                <input
                  name="headline"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Body
                </span>

                <textarea
                  name="body_text"
                  rows={3}
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Image URL
                </span>

                <input
                  name="image_url"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Destination URL
                </span>

                <input
                  name="destination_url"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  CTA
                </span>

                <input
                  name="cta_label"
                  placeholder="Explore"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={campaigns.length === 0}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40"
            >
              Create Creative
            </button>
          </form>

          <div className="space-y-3">
            {creatives.length > 0 ? (
              creatives.map((creative) => (
                <article
                  key={creative.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">
                        {creative.name}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {creative.campaign_name}
                      </div>
                    </div>

                    <form
                      action={setPlacementCreativeStatus}
                      className="flex gap-2"
                    >
                      <input
                        type="hidden"
                        name="creative_id"
                        value={creative.id}
                      />

                      <select
                        name="status"
                        defaultValue={creative.status}
                        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                      >
                        <option value="draft">
                          Draft
                        </option>
                        <option value="approved">
                          Approved
                        </option>
                        <option value="paused">
                          Paused
                        </option>
                        <option value="retired">
                          Retired
                        </option>
                      </select>

                      <button
                        type="submit"
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 p-8 text-sm text-slate-500">
                No creatives yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Exact Position Control
          </div>

          <h2 className="mt-2 text-2xl font-semibold">
            Create Assignment
          </h2>
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-2">
          <form
            action={createPlacementAssignment}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <input
              type="hidden"
              name="target_mode"
              value="creative"
            />

            <h3 className="text-lg font-semibold">
              Campaign Creative Assignment
            </h3>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Exact slot
                </span>

                <select
                  name="slot_instance_id"
                  required
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select exact slot
                  </option>

                  {instances.map((instance) => (
                    <option
                      key={instance.id}
                      value={instance.id}
                    >
                      {instance.instance_key}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Placement type
                </span>

                <select
                  name="placement_type"
                  defaultValue="sponsored"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
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
                  <option value="house">
                    Arknoz House
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Campaign
                </span>

                <select
                  name="assignment_campaign_id"
                  required
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select campaign
                  </option>

                  {campaigns.map((campaign) => (
                    <option
                      key={campaign.id}
                      value={campaign.id}
                    >
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Creative
                </span>

                <select
                  name="creative_id"
                  required
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select creative
                  </option>

                  {creatives.map((creative) => (
                    <option
                      key={creative.id}
                      value={creative.id}
                    >
                      {creative.name} · {creative.campaign_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Start — ISO timestamp with timezone
                </span>

                <input
                  name="starts_at"
                  placeholder="2026-10-01T09:00:00+05:30"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  End — ISO timestamp with timezone
                </span>

                <input
                  name="ends_at"
                  placeholder="2026-10-31T23:59:00+05:30"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  name="paid_lock"
                />
                Lock as paid placement
              </label>
            </div>

            <button
              type="submit"
              disabled={
                instances.length === 0 ||
                campaigns.length === 0 ||
                creatives.length === 0
              }
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40"
            >
              Create Draft Assignment
            </button>
          </form>

          <form
            action={createPlacementAssignment}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <input
              type="hidden"
              name="target_mode"
              value="entity"
            />

            <h3 className="text-lg font-semibold">
              Canonical Entity Assignment
            </h3>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Exact slot
                </span>

                <select
                  name="slot_instance_id"
                  required
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select exact slot
                  </option>

                  {instances.map((instance) => (
                    <option
                      key={instance.id}
                      value={instance.id}
                    >
                      {instance.instance_key}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Placement type
                </span>

                <select
                  name="placement_type"
                  defaultValue="editorial"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option value="editorial">
                    Editorial
                  </option>
                  <option value="featured">
                    Featured
                  </option>
                  <option value="house">
                    Arknoz House
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Campaign — optional for editorial
                </span>

                <select
                  name="assignment_campaign_id"
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                >
                  <option value="">
                    No campaign
                  </option>

                  {campaigns.map((campaign) => (
                    <option
                      key={campaign.id}
                      value={campaign.id}
                    >
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Entity type
                </span>

                <input
                  name="canonical_entity_type"
                  required
                  placeholder="project"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Entity slug
                </span>

                <input
                  name="canonical_entity_slug"
                  required
                  placeholder="sydney-opera-house"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Start — ISO timestamp with timezone
                </span>

                <input
                  name="starts_at"
                  placeholder="2026-10-01T09:00:00+05:30"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  End — ISO timestamp with timezone
                </span>

                <input
                  name="ends_at"
                  placeholder="2026-10-31T23:59:00+05:30"
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={instances.length === 0}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40"
            >
              Create Draft Assignment
            </button>
          </form>
        </div>
      </section>

      <section>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Lifecycle
          </div>

          <h2 className="mt-2 text-2xl font-semibold">
            Status Control
          </h2>
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold">
              Campaigns
            </h3>

            <div className="mt-4 space-y-3">
              {campaigns.map((campaign) => (
                <form
                  key={campaign.id}
                  action={setPlacementCampaignStatus}
                  className="rounded-xl border border-white/10 p-3"
                >
                  <input
                    type="hidden"
                    name="campaign_id"
                    value={campaign.id}
                  />

                  <div className="text-sm font-medium">
                    {campaign.name}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <select
                      name="status"
                      defaultValue={campaign.status}
                      className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                    >
                      <option value="draft">
                        Draft
                      </option>
                      <option value="scheduled">
                        Scheduled
                      </option>
                      <option value="live">
                        Live
                      </option>
                      <option value="paused">
                        Paused
                      </option>
                      <option value="completed">
                        Completed
                      </option>
                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold"
                    >
                      Set
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold">
              Creatives
            </h3>

            <div className="mt-4 space-y-3">
              {creatives.map((creative) => (
                <form
                  key={creative.id}
                  action={setPlacementCreativeStatus}
                  className="rounded-xl border border-white/10 p-3"
                >
                  <input
                    type="hidden"
                    name="creative_id"
                    value={creative.id}
                  />

                  <div className="text-sm font-medium">
                    {creative.name}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <select
                      name="status"
                      defaultValue={creative.status}
                      className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                    >
                      <option value="draft">
                        Draft
                      </option>
                      <option value="approved">
                        Approved
                      </option>
                      <option value="paused">
                        Paused
                      </option>
                      <option value="retired">
                        Retired
                      </option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold"
                    >
                      Set
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold">
              Assignments
            </h3>

            <div className="mt-4 space-y-3">
              {assignments.map((assignment) => (
                <form
                  key={assignment.id}
                  action={setPlacementAssignmentStatus}
                  className="rounded-xl border border-white/10 p-3"
                >
                  <input
                    type="hidden"
                    name="assignment_id"
                    value={assignment.id}
                  />

                  <div className="font-mono text-xs font-semibold">
                    {assignment.instance_key}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {assignment.creative_name ??
                      assignment.canonical_entity_slug ??
                      assignment.placement_type}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <select
                      name="status"
                      defaultValue={assignment.status}
                      className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs"
                    >
                      <option value="draft">
                        Draft
                      </option>
                      <option value="scheduled">
                        Scheduled
                      </option>
                      <option value="live">
                        Live
                      </option>
                      <option value="paused">
                        Paused
                      </option>
                      <option value="expired">
                        Expired
                      </option>
                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold"
                    >
                      Set
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
