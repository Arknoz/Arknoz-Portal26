import Link from "next/link";

import { getEntityHref } from "@/components/EntityCard";

import type {
  EntityRecord,
} from "@/lib/entities";

import type {
  ArknozSectionKey,
} from "@/lib/arknoz-sections";


type CategoryLink = {
  label: string;
  href: string;
};


type MediaItem = {
  src?: string;
};


const sectionPresentation:
  Partial<
    Record<
      ArknozSectionKey,
      {
        accent: string;
        soft: string;
      }
    >
  > = {

  projects: {
    accent: "#2563a8",
    soft: "#f4f7fa",
  },

  products: {
    accent: "#a64c32",
    soft: "#f8f4f1",
  },

  knowledge: {
    accent: "#5355a4",
    soft: "#f4f5fb",
  },

  learning: {
    accent: "#247f7a",
    soft: "#f2f8f7",
  },

  opportunities: {
    accent: "#a66a32",
    soft: "#faf6ef",
  },

  community: {
    accent: "#7556a5",
    soft: "#f7f4fb",
  },

};


function getEntityImage(
  entity: EntityRecord
) {

  const mediaEntity =
    entity as unknown as {

      media?: MediaItem[];

      project?: {
        media?: MediaItem[];
      };

      product?: {
        media?: MediaItem[];
      };

      knowledge?: {
        media?: MediaItem[];
      };

      learning?: {
        media?: MediaItem[];
      };

      opportunity?: {
        media?: MediaItem[];
      };

    };


  return (
    mediaEntity.media?.[0]?.src ??
    mediaEntity.project?.media?.[0]?.src ??
    mediaEntity.product?.media?.[0]?.src ??
    mediaEntity.knowledge?.media?.[0]?.src ??
    mediaEntity.learning?.media?.[0]?.src ??
    mediaEntity.opportunity?.media?.[0]?.src
  );
}


function RecordCard({
  entity,
  accent,
}: {
  entity: EntityRecord;
  accent: string;
}) {

  const image =
    getEntityImage(
      entity
    );


  return (
    <Link
      href={getEntityHref(entity)}
      className="group flex min-h-[330px] flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >

      <div className="relative aspect-[1.6/1] overflow-hidden bg-slate-100">

        {image ? (
          <img
            src={image}
            alt={entity.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage:
                "linear-gradient(#cbd5df 1px,transparent 1px),linear-gradient(90deg,#cbd5df 1px,transparent 1px)",
              backgroundSize:
                "38px 38px",
            }}
          />
        )}

      </div>


      <div className="flex flex-1 flex-col p-5">

        {entity.subtitle ? (
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {entity.subtitle}
          </p>
        ) : null}


        <h3 className="mt-2 text-[18px] font-semibold leading-[1.16] tracking-[-0.02em] text-slate-950">
          {entity.title}
        </h3>


        {entity.geography ? (
          <p className="mt-3 text-[10px] leading-5 text-slate-500">
            {entity.geography}
          </p>
        ) : null}


        {entity.summary ? (
          <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-slate-500">
            {entity.summary}
          </p>
        ) : null}


        <p
          className="mt-auto border-t border-slate-100 pt-4 text-[10px] font-semibold"
          style={{
            color:
              accent,
          }}
        >
          Open record →
        </p>

      </div>

    </Link>
  );
}


export default function CoreWorldCategoryIndexBody({
  sectionKey,
  sectionTitle,
  sectionHref,
  categoryLabel,
  description,
  records,
  siblingCategories,
  locationLabel,
}: {
  sectionKey: ArknozSectionKey;
  sectionTitle: string;
  sectionHref: string;
  categoryLabel: string;
  description: string;
  records: EntityRecord[];
  siblingCategories: CategoryLink[];
  locationLabel?: string;
}) {

  const presentation =
    sectionPresentation[
      sectionKey
    ] ?? {
      accent: "#2563a8",
      soft: "#f4f7fa",
    };


  return (
    <main
      id="category-records"
      data-category-index={`${sectionKey}:${categoryLabel}`}
      style={{
        background:
          presentation.soft,
      }}
      className="border-t border-slate-200"
    >




      {/* CATEGORY RECORD INDEX */}

      <section className="mx-auto max-w-[1720px] px-5 py-10 lg:px-8 lg:py-14">

        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                color:
                  presentation.accent,
              }}
            >
              {sectionTitle} / Category
            </p>


            <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.04em] text-slate-950 lg:text-[42px]">
              {categoryLabel}
            </h2>


            <p className="mt-3 max-w-3xl text-[13px] leading-6 text-slate-600">
              {description}
            </p>


            {locationLabel ? (
              <p className="mt-3 text-[10px] font-medium text-slate-400">
                Geography: {locationLabel}
              </p>
            ) : null}

          </div>


          <div className="shrink-0 lg:text-right">

            <p className="text-[42px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
              {records.length}
            </p>

            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Published records
            </p>

          </div>

        </div>


        {records.length > 0 ? (

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

            {records.map(
              (entity) => (
                <RecordCard
                  key={`${entity.type}:${entity.slug}`}
                  entity={entity}
                  accent={
                    presentation.accent
                  }
                />
              )
            )}

          </div>

        ) : (

          <div className="mt-8 rounded-[20px] border border-slate-200 bg-white px-6 py-14">

            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
              No published records
            </p>


            <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-slate-950">
              Nothing genuine is published in this category yet.
            </h3>


            <p className="mt-3 max-w-2xl text-[12px] leading-6 text-slate-500">
              Arknoz keeps the category available without creating placeholder records.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}
