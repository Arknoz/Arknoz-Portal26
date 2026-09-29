import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  requirePlatformContentManager,
} from "@/lib/admin/access";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createContentDraft,
} from "./actions";


export const metadata: Metadata = {
  title:
    "Content | Arknoz Admin",

  robots: {
    index: false,
    follow: false,
  },
};


type ContentSummary = {
  total: number;
  draft: number;
  review: number;
  published: number;
  archived: number;
  verified: number;
  sourceBacked: number;
  unverified: number;
  featured: number;
  byType: Record<
    string,
    number
  >;
};


type ContentEntity = {
  id: string;
  entity_type: string;
  slug: string;
  canonical_path: string;
  title: string;
  subtitle: string | null;
  summary: string;
  geography_label: string | null;
  geography_slug: string | null;
  trust_label: string | null;
  official_url: string | null;
  content_status: string;
  verification_status: string;
  is_featured: boolean;
  sort_rank: number;
  source_count: number | string;
  media_count: number | string;
  last_verified_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
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


export default async function AdminContentPage({
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
  await requirePlatformContentManager(
    "/admin/content"
  );

  const params =
    await searchParams;

  const q =
    firstParam(
      params.q
    ).trim();

  const type =
    firstParam(
      params.type
    ).trim();

  const status =
    firstParam(
      params.status
    ).trim();

  const verification =
    firstParam(
      params.verification
    ).trim();

  const supabase =
    await createClient();

  const [
    summaryResult,
    entitiesResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_platform_content_summary"
    ),

    supabase.rpc(
      "get_platform_content_entities",
      {
        search_text:
          q || null,

        filter_entity_type:
          type || null,

        filter_content_status:
          status || null,

        filter_verification_status:
          verification || null,

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
      : summaryResult.data as
          | ContentSummary
          | null;

  const entities =
    entitiesResult.error
      ? []
      : (
          entitiesResult.data ??
          []
        ) as ContentEntity[];

  const unavailable =
    Boolean(
      summaryResult.error ||
      entitiesResult.error
    );

  const metrics = [
    [
      "Total",
      summary?.total ?? 0,
    ],
    [
      "Published",
      summary?.published ?? 0,
    ],
    [
      "Review",
      summary?.review ?? 0,
    ],
    [
      "Draft",
      summary?.draft ?? 0,
    ],
    [
      "Archived",
      summary?.archived ?? 0,
    ],
    [
      "Verified",
      summary?.verified ?? 0,
    ],
    [
      "Source backed",
      summary?.sourceBacked ?? 0,
    ],
    [
      "Featured",
      summary?.featured ?? 0,
    ],
  ] as const;

  return (
    <div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
          Content
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Content Control
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Manage Arknoz Projects,
          Products, Knowledge, People,
          Organisations, Universities,
          Opportunities and Places.
        </p>
      </div>

      {unavailable ? (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          Content Admin database
          functions are not available
          remotely yet. Local migration
          202609290001 has not been
          applied.
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

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Create
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          New Content Draft
        </h2>

        <form
          action={createContentDraft}
          className="mt-6 grid gap-4 lg:grid-cols-2"
        >
          <select
            name="entity_type"
            required
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          >
            <option value="">
              Select type
            </option>

            <option value="project">
              Project
            </option>

            <option value="product">
              Product
            </option>

            <option value="knowledge">
              Knowledge
            </option>

            <option value="person">
              Person
            </option>

            <option value="organisation">
              Organisation
            </option>

            <option value="university">
              University
            </option>

            <option value="opportunity">
              Opportunity
            </option>

            <option value="place">
              Place
            </option>
          </select>

          <input
            name="slug"
            required
            placeholder="slug-like-this"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="title"
            required
            placeholder="Title"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm lg:col-span-2"
          />

          <input
            name="subtitle"
            placeholder="Subtitle"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm lg:col-span-2"
          />

          <textarea
            name="summary"
            rows={4}
            placeholder="Summary"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm lg:col-span-2"
          />

          <input
            name="geography_label"
            placeholder="Geography label"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="geography_slug"
            placeholder="geography-slug"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="trust_label"
            placeholder="Trust label"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="official_url"
            type="url"
            placeholder="Official URL"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 lg:col-span-2"
          >
            Create Draft
          </button>
        </form>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Directory
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          All Content
        </h2>

        <form
          method="get"
          className="mt-5 grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto_auto]"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title, slug, geography or path"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <select
            name="type"
            defaultValue={type}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          >
            <option value="">
              All types
            </option>
            <option value="project">
              Projects
            </option>
            <option value="product">
              Products
            </option>
            <option value="knowledge">
              Knowledge
            </option>
            <option value="person">
              People
            </option>
            <option value="organisation">
              Organisations
            </option>
            <option value="university">
              Universities
            </option>
            <option value="opportunity">
              Opportunities
            </option>
            <option value="place">
              Places
            </option>
          </select>

          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          >
            <option value="">
              All states
            </option>
            <option value="draft">
              Draft
            </option>
            <option value="review">
              Review
            </option>
            <option value="published">
              Published
            </option>
            <option value="archived">
              Archived
            </option>
          </select>

          <select
            name="verification"
            defaultValue={verification}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          >
            <option value="">
              All verification
            </option>
            <option value="unverified">
              Unverified
            </option>
            <option value="source_backed">
              Source backed
            </option>
            <option value="verified">
              Verified
            </option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Apply
          </button>

          <Link
            href="/admin/content"
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
                  Content
                </th>

                <th className="px-5 py-4">
                  Type
                </th>

                <th className="px-5 py-4">
                  State
                </th>

                <th className="px-5 py-4">
                  Verification
                </th>

                <th className="px-5 py-4">
                  Sources
                </th>

                <th className="px-5 py-4">
                  Media
                </th>

                <th className="px-5 py-4">
                  Featured
                </th>
              </tr>
            </thead>

            <tbody>
              {entities.length > 0 ? (
                entities.map(
                  (entity) => (
                    <tr
                      key={entity.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/content/${entity.id}`}
                          className="font-semibold text-white hover:underline"
                        >
                          {entity.title}
                        </Link>

                        <div className="mt-1 font-mono text-xs text-slate-500">
                          {entity.slug}
                        </div>

                        {entity.geography_label ? (
                          <div className="mt-1 text-xs text-slate-500">
                            {entity.geography_label}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {entity.entity_type}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {entity.content_status}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {entity.verification_status}
                      </td>

                      <td className="px-5 py-4">
                        {String(
                          entity.source_count
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {String(
                          entity.media_count
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {entity.is_featured
                          ? "Yes"
                          : "No"}
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
                    No content records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {entities.length >= 100 ? (
          <div className="mt-3 text-xs text-slate-500">
            Showing the first 100 matching
            records in Admin V1.
          </div>
        ) : null}
      </section>
    </div>
  );
}
