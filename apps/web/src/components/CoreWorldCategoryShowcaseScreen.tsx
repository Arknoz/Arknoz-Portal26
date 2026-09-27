import Link from "next/link";

import { getEntityHref } from "@/components/EntityCard";

import type { EntityRecord } from "@/lib/entities";
import type { ArknozSectionKey } from "@/lib/arknoz-sections";


type SupportedWorld =
  | "products"
  | "knowledge"
  | "learning"
  | "opportunities"
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
    accent: "#a64c32",
    rightBackground: "#f8f4f1",
    gradients: [
      "linear-gradient(135deg,#43261f 0%,#774332 100%)",
      "linear-gradient(135deg,#4c2920 0%,#89503a 100%)",
      "linear-gradient(135deg,#3f2925 0%,#765047 100%)",
      "linear-gradient(135deg,#493129 0%,#805a46 100%)",
      "linear-gradient(135deg,#3f3027 0%,#756047 100%)",
      "linear-gradient(135deg,#3c2825 0%,#70443b 100%)",
    ],
  },

  knowledge: {
    title: "Knowledge",
    recordLabel: "Knowledge",
    recordPlural: "knowledge records",
    accent: "#5355a4",
    rightBackground: "#f4f5fb",
    gradients: [
      "linear-gradient(135deg,#1f274b 0%,#404c86 100%)",
      "linear-gradient(135deg,#25264d 0%,#56538f 100%)",
      "linear-gradient(135deg,#202d50 0%,#415e8a 100%)",
      "linear-gradient(135deg,#27284c 0%,#545482 100%)",
      "linear-gradient(135deg,#202a45 0%,#445478 100%)",
      "linear-gradient(135deg,#25233e 0%,#554f78 100%)",
    ],
  },

  learning: {
    title: "Education",
    recordLabel: "Learning",
    recordPlural: "learning records",
    accent: "#247f7a",
    rightBackground: "#f2f8f7",
    gradients: [
      "linear-gradient(135deg,#163c40 0%,#28716f 100%)",
      "linear-gradient(135deg,#183d3b 0%,#32766f 100%)",
      "linear-gradient(135deg,#17363c 0%,#316a73 100%)",
      "linear-gradient(135deg,#1b403e 0%,#437b70 100%)",
      "linear-gradient(135deg,#163a36 0%,#397168 100%)",
      "linear-gradient(135deg,#17353a 0%,#376970 100%)",
    ],
  },

  opportunities: {
    title: "Opportunities",
    recordLabel: "Opportunity",
    recordPlural: "opportunities",
    accent: "#a66a32",
    rightBackground: "#faf6ef",
    gradients: [
      "linear-gradient(135deg,#49331f 0%,#7c5a36 100%)",
      "linear-gradient(135deg,#4d3522 0%,#8a6239 100%)",
      "linear-gradient(135deg,#423426 0%,#755d43 100%)",
      "linear-gradient(135deg,#493827 0%,#816344 100%)",
      "linear-gradient(135deg,#413222 0%,#77603e 100%)",
      "linear-gradient(135deg,#473226 0%,#7d5641 100%)",
    ],
  },

  community: {
    title: "Community",
    recordLabel: "Community",
    recordPlural: "community records",
    accent: "#7556a5",
    rightBackground: "#f7f4fb",
    gradients: [
      "linear-gradient(135deg,#312347 0%,#5c4380 100%)",
      "linear-gradient(135deg,#38264d 0%,#67458a 100%)",
      "linear-gradient(135deg,#30284d 0%,#594d82 100%)",
      "linear-gradient(135deg,#36254a 0%,#684780 100%)",
      "linear-gradient(135deg,#2f2947 0%,#5a5077 100%)",
      "linear-gradient(135deg,#352447 0%,#634278 100%)",
    ],
  },

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

    return (
      <article className="flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5">

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

          <span className="text-slate-300">
            →
          </span>

        </div>


        <div className="my-auto">

          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {theme.recordLabel}
          </p>


          <p className="mt-3 max-w-[250px] text-[12px] leading-5 text-slate-400">
            No additional eligible published record is available in this category yet.
          </p>

        </div>


        <div className="border-t border-slate-100 pt-4">

          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-300">
            Awaiting genuine record
          </p>

        </div>

      </article>
    );
  }


  const image =
    getEntityImage(
      entity
    );


  return (
    <Link
      href={getEntityHref(entity)}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
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
    );


  return (
    <section
      id={`${world}-category-${category.slug}`}
      data-core-category-screen={`${world}:${category.slug}`}
      className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)] lg:min-h-0"
    >

      <div className="grid min-h-[calc(100svh-88px)] lg:h-full lg:min-h-0 lg:grid-cols-[0.72fr_1.28fr]">


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
                  Featured {theme.recordLabel.toLowerCase()} slot
                </h3>


                <p className="mt-4 max-w-md text-[12px] leading-6 text-white/55">
                  No eligible featured record has been assigned to this category yet.
                </p>

              </>
            )}


            <div className="mt-7 flex items-end justify-between border-t border-white/20 pt-5">

              <div>

                <p className="text-[30px] font-semibold leading-none">
                  {String(totalCount).padStart(2, "0")}
                </p>

                <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Published records
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