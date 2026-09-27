import Link from "next/link";

import { getEntityHref } from "@/components/EntityCard";

import type { EntityRecord } from "@/lib/entities";


type ProjectCategory = {
  slug: string;
  label: string;
};


const categoryPresentation:
  Record<
    string,
    {
      background: string;
      description: string;
    }
  > = {

  "buildings-architecture": {
    background:
      "linear-gradient(135deg,#071b31 0%,#123d68 100%)",
    description:
      "Buildings and architectural works across scales, programmes, contexts and design approaches.",
  },

  "interiors-renovation-adaptive-reuse": {
    background:
      "linear-gradient(135deg,#182a38 0%,#345066 100%)",
    description:
      "Interiors, renovation, conservation and adaptive reuse projects transforming existing spaces and buildings.",
  },

  "landscape-public-realm": {
    background:
      "linear-gradient(135deg,#173632 0%,#315a50 100%)",
    description:
      "Landscape, open space and public-realm projects shaping environmental and civic experience.",
  },

  "urbanism-planning-development": {
    background:
      "linear-gradient(135deg,#343022 0%,#625942 100%)",
    description:
      "Urban planning, development and city-scale projects connecting buildings, infrastructure and place.",
  },

  "infrastructure-mobility": {
    background:
      "linear-gradient(135deg,#172936 0%,#3e5667 100%)",
    description:
      "Infrastructure and mobility projects supporting movement, connectivity and the operation of cities and regions.",
  },

  "industrial-energy-utilities": {
    background:
      "linear-gradient(135deg,#282630 0%,#4b4654 100%)",
    description:
      "Industrial, energy and utility projects supporting production, resources and essential Built World systems.",
  },

};


function getProjectImage(
  entity?: EntityRecord
) {

  if (
    entity?.type === "project" &&
    entity.project?.media?.[0]?.src
  ) {
    return entity.project.media[0].src;
  }

  return undefined;
}


function MoreProjectCard({
  entity,
  index,
}: {
  entity?: EntityRecord;
  index: number;
}) {

  const number =
    String(index + 1).padStart(2, "0");

  if (!entity) {

    return (
      <article className="relative flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5">

        <div className="flex items-start justify-between">

          <span className="text-[10px] font-semibold text-blue-700">
            {number}
          </span>

          <span className="text-slate-300">
            →
          </span>

        </div>


        <div className="my-auto">

          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Project
          </p>


          <p className="mt-3 max-w-[250px] text-[12px] leading-5 text-slate-400">
            No additional published project available in this category yet.
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
    getProjectImage(entity);


  return (
    <Link
      href={getEntityHref(entity)}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
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
            className="absolute inset-0 opacity-[0.32]"
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

          <span className="text-[10px] font-semibold text-blue-700">
            {number}
          </span>

          <span className="text-blue-700">
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


        <p className="mt-auto border-t border-slate-100 pt-4 text-[9px] font-semibold text-blue-700">
          Open project →
        </p>

      </div>

    </Link>
  );
}


export default function ProjectCategoryShowcaseScreen({
  screenNumber,
  category,
  categoryHref,
  featuredProject,
  projects,
  totalCount,
}: {
  screenNumber: number;
  category: ProjectCategory;
  categoryHref: string;
  featuredProject?: EntityRecord;
  projects: EntityRecord[];
  totalCount: number;
}) {

  const presentation =
    categoryPresentation[
      category.slug
    ] ?? {
      background:
        "linear-gradient(135deg,#071b31 0%,#123d68 100%)",
      description:
        `Explore ${category.label.toLowerCase()} projects across Arknoz.`,
    };


  const featuredImage =
    getProjectImage(
      featuredProject
    );


  return (
    <section
      id={`project-category-${category.slug}`}
      data-project-category-screen={category.slug}
      className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)] lg:min-h-0"
    >

      <div className="grid min-h-[calc(100svh-88px)] lg:h-full lg:min-h-0 lg:grid-cols-[0.72fr_1.28fr]">


        {/* ==================================================
            LEFT — FEATURED PROJECT
        ================================================== */}

        <article
          className="relative flex min-h-[540px] flex-col overflow-hidden p-7 text-white lg:min-h-0 lg:p-10 xl:p-12"
          style={{
            background:
              presentation.background,
          }}
        >

          {featuredImage ? (
            <img
              src={featuredImage}
              alt={featuredProject?.title ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}


          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/85" />


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

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">
              {String(screenNumber).padStart(2, "0")} / Projects
            </p>


            <h2 className="mt-5 max-w-xl text-[29px] font-semibold leading-[1.02] tracking-[-0.035em] lg:text-[34px]">
              {category.label}
            </h2>


            <p className="mt-4 max-w-md text-[12px] leading-6 text-white/65">
              {presentation.description}
            </p>

          </div>


          <div className="relative mt-auto">

            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-100">
              Featured Project
            </p>


            {featuredProject ? (
              <>

                <h3 className="mt-4 max-w-xl text-[38px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[46px]">
                  {featuredProject.title}
                </h3>


                {featuredProject.geography ? (
                  <p className="mt-4 text-[12px] text-white/65">
                    {featuredProject.geography}
                  </p>
                ) : null}


                {featuredProject.summary ? (
                  <p className="mt-4 max-w-lg text-[12px] leading-6 text-white/65">
                    {featuredProject.summary}
                  </p>
                ) : null}


                <Link
                  href={getEntityHref(featuredProject)}
                  className="mt-6 inline-flex items-center gap-3 border-b border-white/60 pb-2 text-[11px] font-semibold text-white"
                >
                  Open featured project
                  <span aria-hidden="true">
                    →
                  </span>
                </Link>

              </>
            ) : (
              <>

                <h3 className="mt-4 max-w-lg text-[32px] font-semibold leading-[1.02] tracking-[-0.035em] text-white/90">
                  Featured project slot
                </h3>


                <p className="mt-4 max-w-md text-[12px] leading-6 text-white/55">
                  No eligible featured project has been assigned to this category yet.
                </p>

              </>
            )}


            <div className="mt-7 flex items-end justify-between border-t border-white/20 pt-5">

              <div>

                <p className="text-[30px] font-semibold leading-none">
                  {String(totalCount).padStart(2, "0")}
                </p>

                <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Published projects
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


        {/* ==================================================
            RIGHT — 6 MORE PROJECTS FROM SAME CATEGORY
        ================================================== */}

        <div className="flex min-h-0 flex-col bg-[#f4f7fa] p-5 lg:p-8 xl:p-10">

          <div className="mb-6 flex shrink-0 items-end justify-between gap-8">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                Projects
              </p>


              <h3 className="mt-2 max-w-3xl text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
                {category.label}
              </h3>

            </div>


            <Link
              href={categoryHref}
              className="hidden shrink-0 text-[10px] font-semibold text-blue-700 lg:block"
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
                <MoreProjectCard
                  key={
                    projects[index]
                      ? `${category.slug}-${projects[index].slug}`
                      : `${category.slug}-empty-${index}`
                  }
                  entity={projects[index]}
                  index={index}
                />
              )
            )}

          </div>

        </div>

      </div>

    </section>
  );
}