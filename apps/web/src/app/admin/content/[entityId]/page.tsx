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
  setContentEntityState,
  updateContentEntity,
} from "../actions";


export const metadata: Metadata = {
  title:
    "Content Record | Arknoz Admin",

  robots: {
    index: false,
    follow: false,
  },
};


type ContentDetail = {
  id: string;
  entityType: string;
  slug: string;
  canonicalPath: string;
  title: string;
  subtitle: string | null;
  summary: string;
  geographyLabel: string | null;
  geographySlug: string | null;
  trustLabel: string | null;
  officialUrl: string | null;
  contentStatus: string;
  verificationStatus: string;
  featured: boolean;
  sortRank: number;
  sourceCount: number | string;
  mediaCount: number | string;
  lastVerifiedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
      timeZone: "UTC",
    }
  ).format(date);
}


export default async function AdminContentDetailPage({
  params,
}: {
  params: Promise<{
    entityId: string;
  }>;
}) {
  const {
    entityId,
  } = await params;

  await requirePlatformContentManager(
    `/admin/content/${entityId}`
  );

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_platform_content_entity",
    {
      target_entity_id:
        entityId,
    }
  );

  const entity =
    error
      ? null
      : data as
          | ContentDetail
          | null;

  if (!entity) {
    return (
      <div>
        <Link
          href="/admin/content"
          className="text-sm font-semibold text-slate-400 hover:text-white"
        >
          ← Content
        </Link>

        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm text-amber-200">
          Content record is unavailable.
          The local Content Admin migration
          may not yet be applied remotely,
          or the entity does not exist.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/content"
        className="text-sm font-semibold text-slate-400 hover:text-white"
      >
        ← Content
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
            {entity.entityType}
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            {entity.title}
          </h1>

          <div className="mt-3 font-mono text-sm text-slate-500">
            {entity.canonicalPath}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase">
            {entity.contentStatus}
          </span>

          <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase">
            {entity.verificationStatus}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Sources",
            entity.sourceCount,
          ],
          [
            "Media",
            entity.mediaCount,
          ],
          [
            "Featured",
            entity.featured
              ? "Yes"
              : "No",
          ],
          [
            "Sort Rank",
            entity.sortRank,
          ],
        ].map(
          ([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {label}
              </div>

              <div className="mt-3 text-2xl font-semibold">
                {String(value)}
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Created {dateValue(
          entity.createdAt
        )} · Updated {dateValue(
          entity.updatedAt
        )} · Published {dateValue(
          entity.publishedAt
        )} · Verified {dateValue(
          entity.lastVerifiedAt
        )}
      </div>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Editorial
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          Core Content
        </h2>

        <form
          action={updateContentEntity}
          className="mt-6 grid gap-4 lg:grid-cols-2"
        >
          <input
            type="hidden"
            name="entity_id"
            value={entity.id}
          />

          <input
            name="title"
            required
            defaultValue={entity.title}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm lg:col-span-2"
          />

          <input
            name="subtitle"
            defaultValue={
              entity.subtitle ?? ""
            }
            placeholder="Subtitle"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm lg:col-span-2"
          />

          <textarea
            name="summary"
            rows={7}
            defaultValue={entity.summary}
            placeholder="Summary"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm lg:col-span-2"
          />

          <input
            name="geography_label"
            defaultValue={
              entity.geographyLabel ??
              ""
            }
            placeholder="Geography label"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="geography_slug"
            defaultValue={
              entity.geographySlug ??
              ""
            }
            placeholder="geography-slug"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="trust_label"
            defaultValue={
              entity.trustLabel ??
              ""
            }
            placeholder="Trust label"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <input
            name="official_url"
            type="url"
            defaultValue={
              entity.officialUrl ??
              ""
            }
            placeholder="Official URL"
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"
          />

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 lg:col-span-2"
          >
            Save Content
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Publishing
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          State & Verification
        </h2>

        <form
          action={setContentEntityState}
          className="mt-6 grid gap-4 lg:grid-cols-2"
        >
          <input
            type="hidden"
            name="entity_id"
            value={entity.id}
          />

          <label className="text-sm">
            <span className="mb-2 block text-slate-400">
              Content state
            </span>

            <select
              name="content_status"
              defaultValue={
                entity.contentStatus
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
            >
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
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-400">
              Verification
            </span>

            <select
              name="verification_status"
              defaultValue={
                entity.verificationStatus
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
            >
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
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={
                entity.featured
              }
            />

            Featured
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-400">
              Sort rank
            </span>

            <input
              type="number"
              name="sort_rank"
              defaultValue={
                entity.sortRank
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
            />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 lg:col-span-2"
          >
            Save Publishing State
          </button>
        </form>

        {entity.contentStatus ===
        "published" ? (
          <div className="mt-5">
            <Link
              href={entity.canonicalPath}
              className="text-sm font-semibold text-slate-300 hover:text-white"
            >
              Open public page →
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
