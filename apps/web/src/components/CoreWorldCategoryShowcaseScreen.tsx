import Link from "next/link";

import { getEntityHref } from "@/components/EntityCard";

import type { EntityRecord } from "@/lib/entities";
import type { ArknozSectionKey } from "@/lib/arknoz-sections";


type SupportedWorld =
  | "products"
  | "knowledge"
  | "learning"
  | "opportunities"
  | "people"
  | "organisations"
  | "universities"
  | "places"
  | "community";


type Category = {
  slug: string;
  label: string;
};


type MediaItem = {
  src?: string;
  alt?: string;
};


const themes:
  Record<
    SupportedWorld,
    {
      title: string;
      recordLabel: string;
      recordPlural: string;
      accent: string;
      rightBackground: string;
      gradients: string[];
    }
  > = {

  products: {
    title: "Products",
    recordLabel: "Product",
    recordPlural: "products",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  knowledge: {
    title: "Knowledge",
    recordLabel: "Knowledge",
    recordPlural: "knowledge records",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  learning: {
    title: "Education",
    recordLabel: "Learning",
    recordPlural: "learning records",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  opportunities: {
    title: "Opportunities",
    recordLabel: "Opportunity",
    recordPlural: "opportunities",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  people: {
    title: "People",
    recordLabel: "Person",
    recordPlural: "people",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  organisations: {
    title: "Organisations",
    recordLabel: "Organisation",
    recordPlural: "organisations",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  universities: {
    title: "Universities",
    recordLabel: "University",
    recordPlural: "universities",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

  places: {
    title: "Places",
    recordLabel: "Place",
    recordPlural: "places",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },
  community: {
    title: "Community",
    recordLabel: "Community",
    recordPlural: "community records",
    accent: "#a61f46",
    rightBackground: "#f5f7fb",
    gradients: [
      "linear-gradient(135deg,#071d2a 0%,#153e57 100%)",
      "linear-gradient(135deg,#0a2230 0%,#19465f 100%)",
      "linear-gradient(135deg,#081f2e 0%,#123b53 100%)",
      "linear-gradient(135deg,#0a2230 0%,#173f56 100%)",
      "linear-gradient(135deg,#071d2a 0%,#16445d 100%)",
      "linear-gradient(135deg,#0a2230 0%,#13384d 100%)",
    ],
  },

};


const fallbackImageByWorld:
  Record<SupportedWorld, string> = {
    products: "/visuals/portal/product.png",
    knowledge: "/visuals/portal/knowledge.png",
    learning: "/visuals/portal/education.png",
    opportunities: "/visuals/portal/opportunity.png",
    people: "/visuals/portal/people.png",
    organisations: "/visuals/portal/organisation.png",
    universities: "/visuals/portal/education.png",
    places: "/visuals/portal/place.png",    community: "/visuals/portal/people.png",
  };


function getEntityImage(
  entity?: EntityRecord
) {

  if (!entity) {
    return undefined;
  }


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
  index,
  world,
}: {
  entity?: EntityRecord;
  index: number;
  world: SupportedWorld;
}) {

  const theme =
    themes[world];

  const number =
    String(index + 1).padStart(
      2,
      "0"
    );


  if (!entity) {

    const fallbackImage =
      fallbackImageByWorld[world];

    return (
      <article className="group flex min-h-0 flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white">

        <div className="relative h-[43%] min-h-[105px] overflow-hidden bg-[#0a2230]">

          <img
            src={fallbackImage}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover opacity-90 ${
              index % 3 === 0
                ? "object-center"
                : index % 3 === 1
                  ? "object-left"
                  : "object-right"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#03121c]/65 via-transparent to-transparent" />

          <span className="absolute left-4 top-4 text-[10px] font-semibold text-white">
            {number}
          </span>

          <span className="absolute right-4 top-4 text-white/70">
            →
          </span>

        </div>


        <div className="flex min-h-0 flex-1 flex-col p-5">

          <p
            className="text-[9px] font-semibold uppercase tracking-[0.12em]"
            style={{
              color:
                theme.accent,
            }}
          >
            {theme.recordLabel}
          </p>

          <h3 className="mt-3 text-[16px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#0a2230]">
            Explore {theme.title.toLowerCase()}
          </h3>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Published records will appear here as they are added to this category.
          </p>

          <p className="mt-auto border-t border-slate-100 pt-4 text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Awaiting published record
          </p>

        </div>

      </article>
    );
  }

  const image =
    getEntityImage(
      entity
    ) ??
    fallbackImageByWorld[world];


  return (
    <Link
      href={getEntityHref(entity)}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >

      <div className="relative h-[43%] min-h-[105px] overflow-hidden bg-[#edf1f4]">

        {image ? (
          <img
            src={image}
            alt={entity.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "linear-gradient(#cbd5df 1px,transparent 1px),linear-gradient(90deg,#cbd5df 1px,transparent 1px)",
              backgroundSize:
                "36px 36px",
            }}
          />
        )}

      </div>


      <div className="flex min-h-0 flex-1 flex-col p-5">

        <div className="flex items-start justify-between">

          <span
            className="text-[10px] font-semibold"
            style={{
              color:
                theme.accent,
            }}
          >
            {number}
          </span>

          <span
            style={{
              color:
                theme.accent,
            }}
          >
            →
          </span>

        </div>


        <h3 className="mt-4 text-[16px] font-semibold leading-[1.18] tracking-[-0.02em] text-slate-950">
          {entity.title}
        </h3>


        {entity.geography ? (
          <p className="mt-2 text-[9px] leading-4 text-slate-500">
            {entity.geography}
          </p>
        ) : null}


        <p
          className="mt-auto border-t border-slate-100 pt-4 text-[9px] font-semibold"
          style={{
            color:
              theme.accent,
          }}
        >
          Open record →
        </p>

      </div>

    </Link>
  );
}


export default function CoreWorldCategoryShowcaseScreen({
  world,
  screenNumber,
  category,
  categoryHref,
  featuredRecord,
  records,
  totalCount,
}: {
  world: SupportedWorld;
  screenNumber: number;
  category: Category;
  categoryHref: string;
  featuredRecord?: EntityRecord;
  records: EntityRecord[];
  totalCount: number;
}) {

  const theme =
    themes[world];

  const gradient =
    theme.gradients[
      Math.max(
        0,
        screenNumber - 2
      ) %
        theme.gradients.length
    ];


  const featuredImage =
    getEntityImage(
      featuredRecord
    ) ??
    fallbackImageByWorld[world];


  return (
    <section
      id={`${world}-category-${category.slug}`}
      data-core-category-screen={`${world}:${category.slug}`}
      className="border-t border-slate-200 bg-[#f5f7fb] px-5 py-5 sm:px-6 lg:h-[calc(100svh-88px)] lg:min-h-0 lg:px-8"
    >

      <div
        className="mx-auto grid min-h-[calc(100svh-128px)] max-w-[1720px] overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:h-full lg:min-h-0 lg:grid-cols-[0.72fr_1.28fr]"
      >


        {/* LEFT — FEATURED RECORD */}

        <article
          className="relative flex min-h-[540px] flex-col overflow-hidden p-7 text-white lg:min-h-0 lg:p-10 xl:p-12"
          style={{
            background:
              gradient,
          }}
        >

          {featuredImage ? (
            <img
              src={featuredImage}
              alt={featuredRecord?.title ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}


          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/85" />


          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
              backgroundSize:
                "54px 54px",
            }}
          />


          <div className="relative">

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {String(screenNumber).padStart(2, "0")} / {theme.title}
            </p>


            <h2 className="mt-5 max-w-xl text-[29px] font-semibold leading-[1.02] tracking-[-0.035em] lg:text-[34px]">
              {category.label}
            </h2>


            <p className="mt-4 max-w-md text-[12px] leading-6 text-white/65">
              Explore genuine {theme.recordPlural} within {category.label}.
            </p>

          </div>


          <div className="relative mt-auto">

            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/70">
              Featured {theme.recordLabel}
            </p>


            {featuredRecord ? (
              <>

                <h3 className="mt-4 max-w-xl text-[38px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[46px]">
                  {featuredRecord.title}
                </h3>


                {featuredRecord.geography ? (
                  <p className="mt-4 text-[12px] text-white/65">
                    {featuredRecord.geography}
                  </p>
                ) : null}


                {featuredRecord.summary ? (
                  <p className="mt-4 max-w-lg text-[12px] leading-6 text-white/65">
                    {featuredRecord.summary}
                  </p>
                ) : null}


                <Link
                  href={getEntityHref(featuredRecord)}
                  className="mt-6 inline-flex items-center gap-3 border-b border-white/60 pb-2 text-[11px] font-semibold text-white"
                >
                  Open featured record
                  <span aria-hidden="true">
                    →
                  </span>
                </Link>

              </>
            ) : (
              <>

                <h3 className="mt-4 max-w-lg text-[32px] font-semibold leading-[1.02] tracking-[-0.035em] text-white/90">
                  Explore this {theme.title.toLowerCase()} world
                </h3>


                <p className="mt-4 max-w-md text-[12px] leading-6 text-white/55">
                  Browse this category as genuine records are published on Arknoz.
                </p>

              </>
            )}


            <div className="mt-7 flex items-end justify-between border-t border-white/20 pt-5">

              <div>

                <p className="text-[30px] font-semibold leading-none">
                  {totalCount > 0
                    ? String(totalCount).padStart(2, "0")
                    : "—"}
                </p>

                <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {totalCount === 0
                    ? `Awaiting published ${theme.recordPlural}`
                    : "Published records"}
                </p>

              </div>


              <Link
                href={categoryHref}
                className="text-[10px] font-semibold text-white/70 hover:text-white"
              >
                View all →
              </Link>

            </div>

          </div>

        </article>


        {/* RIGHT — SIX MORE RECORDS */}

        <div
          className="flex min-h-0 flex-col p-5 lg:p-8 xl:p-10"
          style={{
            background:
              theme.rightBackground,
          }}
        >

          <div className="mb-6 flex shrink-0 items-end justify-between gap-8">

            <div>

              <p
                className="text-[10px] font-semibold uppercase tracking-[0.13em]"
                style={{
                  color:
                    theme.accent,
                }}
              >
                {theme.title}
              </p>


              <h3 className="mt-2 max-w-3xl text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
                {category.label}
              </h3>

            </div>


            <Link
              href={categoryHref}
              className="hidden shrink-0 text-[10px] font-semibold lg:block"
              style={{
                color:
                  theme.accent,
              }}
            >
              View all category →
            </Link>

          </div>


          <div className="grid min-h-0 flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">

            {Array.from(
              {
                length: 6,
              },
              (_, index) => (
                <RecordCard
                  key={
                    records[index]
                      ? `${world}-${category.slug}-${records[index].slug}`
                      : `${world}-${category.slug}-empty-${index}`
                  }
                  entity={
                    records[index]
                  }
                  index={
                    index
                  }
                  world={
                    world
                  }
                />
              )
            )}

          </div>

        </div>

      </div>

    </section>
  );
}