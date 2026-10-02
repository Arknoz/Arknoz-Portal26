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
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  knowledge: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  learning: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  opportunities: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  people: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  organisations: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  universities: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

  places: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },
  community: {
    accent: "#a61f46",
    soft: "#f5f7fb",
  },

};


const fallbackImageBySection:
  Partial<
    Record<ArknozSectionKey, string>
  > = {
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
  sectionKey,
}: {
  entity: EntityRecord;
  accent: string;
  sectionKey: ArknozSectionKey;
}) {

  const image =
    getEntityImage(
      entity
    ) ??
    fallbackImageBySection[
      sectionKey
    ];


  return (
    <Link
      href={getEntityHref(entity)}
      className={`group flex min-h-[330px] flex-col overflow-hidden border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md ${
        sectionKey === "projects"
          ? "rounded-[20px]"
          : "rounded-[8px]"
      }`}
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
  paginationEnabled = false,
  totalRecords,
  currentPage = 1,
  totalPages = 1,
  sort = "az",
  categorySlug,
  geoSlug,
}: {
  sectionKey: ArknozSectionKey;
  sectionTitle: string;
  sectionHref: string;
  categoryLabel: string;
  description: string;
  records: EntityRecord[];
  siblingCategories: CategoryLink[];
  locationLabel?: string;
  paginationEnabled?: boolean;
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  sort?: "az" | "za";
  categorySlug?: string;
  geoSlug?: string;
}) {

  const presentation =
    sectionPresentation[
      sectionKey
    ] ?? {
      accent: "#2563a8",
      soft: "#f4f7fa",
    };


  const publishedCount =
    totalRecords ?? records.length;

  const resolvedSort =
    sort === "za"
      ? "za"
      : "az";

  const buildResultsHref = (
    nextPage: number,
    nextSort: "az" | "za" =
      resolvedSort
  ) => {
    const params =
      new URLSearchParams();

    if (categorySlug) {
      params.set(
        "type",
        categorySlug
      );
    }

    if (geoSlug) {
      params.set(
        "geo",
        geoSlug
      );
    }

    params.set(
      "sort",
      nextSort
    );

    if (nextPage > 1) {
      params.set(
        "page",
        String(nextPage)
      );
    }

    const query =
      params.toString();

    return `${sectionHref}${
      query
        ? `?${query}`
        : ""
    }#category-records`;
  };

  const paginationPages =
    Array.from(
      new Set(
        [
          1,
          2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          totalPages - 1,
          totalPages,
        ].filter(
          (value) =>
            value >= 1 &&
            value <= totalPages
        )
      )
    ).sort(
      (a, b) => a - b
    );

  const paginationTokens:
    Array<number | string> = [];

  paginationPages.forEach(
    (pageNumber, index) => {
      const previous =
        paginationPages[
          index - 1
        ];

      if (
        index > 0 &&
        pageNumber - previous > 1
      ) {
        paginationTokens.push(
          `ellipsis-${pageNumber}`
        );
      }

      paginationTokens.push(
        pageNumber
      );
    }
  );

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
              {publishedCount}
            </p>

            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Published records
            </p>

          </div>

        </div>


        {records.length > 0 ? (

          <>
            {paginationEnabled ? (
              <div className="mt-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">
                  {publishedCount} projects · Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <span className="mr-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Sort
                  </span>

                  <Link
                    href={buildResultsHref(1, "az")}
                    className={`border px-3 py-2 text-[10px] font-semibold transition ${
                      resolvedSort === "az"
                        ? "border-[#0a2230] bg-[#0a2230] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    A–Z
                  </Link>

                  <Link
                    href={buildResultsHref(1, "za")}
                    className={`border px-3 py-2 text-[10px] font-semibold transition ${
                      resolvedSort === "za"
                        ? "border-[#0a2230] bg-[#0a2230] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    Z–A
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

            {records.map(
              (entity) => (
                <RecordCard
                  key={`${entity.type}:${entity.slug}`}
                  entity={entity}
                  sectionKey={sectionKey}
                  accent={
                    presentation.accent
                  }
                />
              )
            )}

            </div>

            {paginationEnabled &&
            totalPages > 1 ? (
              <nav
                aria-label={`${sectionTitle} pagination`}
                className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-6"
              >
                {currentPage > 1 ? (
                  <Link
                    href={buildResultsHref(
                      currentPage - 1
                    )}
                    className="border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="border border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] font-semibold text-slate-300">
                    ← Previous
                  </span>
                )}

                {paginationTokens.map(
                  (token) =>
                    typeof token ===
                    "number" ? (
                      token ===
                      currentPage ? (
                        <span
                          key={token}
                          aria-current="page"
                          className="flex min-h-9 min-w-9 items-center justify-center bg-[#0a2230] px-3 text-[10px] font-semibold text-white"
                        >
                          {token}
                        </span>
                      ) : (
                        <Link
                          key={token}
                          href={buildResultsHref(
                            token
                          )}
                          className="flex min-h-9 min-w-9 items-center justify-center border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
                        >
                          {token}
                        </Link>
                      )
                    ) : (
                      <span
                        key={token}
                        className="flex min-h-9 min-w-7 items-center justify-center text-[11px] text-slate-400"
                      >
                        …
                      </span>
                    )
                )}

                {currentPage <
                totalPages ? (
                  <Link
                    href={buildResultsHref(
                      currentPage + 1
                    )}
                    className="border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="border border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] font-semibold text-slate-300">
                    Next →
                  </span>
                )}
              </nav>
            ) : null}
          </>

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
