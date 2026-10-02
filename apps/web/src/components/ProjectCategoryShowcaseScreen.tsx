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
      "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
    description:
      "Buildings and architectural works across scales, programmes, contexts and design approaches.",
  },

  "interiors-renovation-adaptive-reuse": {
    background:
      "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
    description:
      "Interiors, renovation, conservation and adaptive reuse projects transforming existing spaces and buildings.",
  },

  "landscape-public-realm": {
    background:
      "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
    description:
      "Landscape, open space and public-realm projects shaping environmental and civic experience.",
  },

  "urbanism-planning-development": {
    background:
      "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
    description:
      "Urban planning, development and city-scale projects connecting buildings, infrastructure and place.",
  },

  "infrastructure-mobility": {
    background:
      "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
    description:
      "Infrastructure and mobility projects supporting movement, connectivity and the operation of cities and regions.",
  },

  "industrial-energy-utilities": {
    background:
      "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
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
  categoryLabel,
  categoryHref,
}: {
  entity?: EntityRecord;
  index: number;
  categoryLabel: string;
  categoryHref: string;
}) {

  const number =
    String(index + 1).padStart(2, "0");

  if (!entity) {
    return (
      <Link
        href={categoryHref}
        className="
          group
          relative
          flex
          min-h-0
          flex-col
          overflow-hidden
          rounded-[8px]
          border
          border-slate-200
          bg-[#0a2230]
          transition
          duration-300
          hover:-translate-y-0.5
          hover:border-slate-300
          hover:shadow-sm
        "
      >
        <img
          src="/visuals/portal/project.png"
          alt=""
          className={`
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-[1.025]
            ${
              [
                "object-left",
                "object-center",
                "object-right",
                "object-[35%_center]",
                "object-[65%_center]",
                "object-[50%_65%]",
              ][index] ?? "object-center"
            }
          `}
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#03121c]/95
            via-[#03121c]/35
            to-[#03121c]/10
          "
        />

        <div
          className="
            relative
            z-10
            flex
            h-full
            min-h-[190px]
            flex-col
            justify-between
            p-5
            text-white
          "
        >
          <div className="flex items-start justify-between">
            <span
              className="
                text-[10px]
                font-semibold
                text-red-200
              "
            >
              {number}
            </span>

            <span className="text-white/55">
              →
            </span>
          </div>

          <div>
            <p
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white/60
              "
            >
              Projects
            </p>

            <h3
              className="
                mt-2
                text-[17px]
                font-semibold
                leading-[1.08]
                tracking-[-0.025em]
              "
            >
              {categoryLabel}
            </h3>

            <p
              className="
                mt-2
                text-[9px]
                leading-4
                text-white/55
              "
            >
              More verified projects will appear here as they are published.
            </p>
          </div>
        </div>
      </Link>
    );
  }

  const image =
    getProjectImage(entity) ??
    "/visuals/portal/project.png";


  return (
    <Link
      href={getEntityHref(entity)}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
    >

      <div className="relative h-[48%] min-h-[120px] overflow-hidden bg-[#edf1f4]">

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

          <span className="text-[10px] font-semibold text-red-500">
            {number}
          </span>

          <span className="text-red-500">
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


        <p className="mt-auto border-t border-slate-100 pt-4 text-[9px] font-semibold text-red-500">
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
        "linear-gradient(135deg,#0a2230 0%,#153e57 100%)",
      description:
        `Explore ${category.label.toLowerCase()} projects across Arknoz.`,
    };


  const featuredImage =
    getProjectImage(
      featuredProject
    ) ??
    "/visuals/portal/project.png";


  return (
    <section
      id={`project-category-${category.slug}`}
      data-project-category-screen={category.slug}
      className="border-t border-slate-200 bg-[#f5f7fb] px-5 py-5 sm:px-6 lg:px-8"
    >

      <div className="mx-auto grid max-w-[1720px] overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:min-h-[calc(100svh-168px)] lg:grid-cols-[0.72fr_1.28fr]">


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
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
              backgroundSize:
                "54px 54px",
            }}
          />


          <div className="relative">

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-200">
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

            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-red-200">
              Featured Project
            </p>


            {featuredProject ? (
              <>

                <h3 className="mt-4 max-w-xl text-[34px] font-semibold leading-[1] tracking-[-0.045em] lg:text-[40px]">
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

                <h3 className="mt-4 max-w-lg text-[28px] font-semibold leading-[1.02] tracking-[-0.035em] text-white/90">
                  Explore this project world
                </h3>


                <p className="mt-4 max-w-md text-[12px] leading-6 text-white/55">
                  Browse published work and new project records as they enter this Arknoz project world.
                </p>

              </>
            )}


            <div className="mt-7 flex items-end justify-between border-t border-white/20 pt-5">

              <div>

                {totalCount > 0 ? (
                  <>
                    <p className="text-[30px] font-semibold leading-none">
                      {String(totalCount).padStart(2, "0")}
                    </p>

                    <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      Published projects
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
                      Awaiting published projects
                    </p>

                    <p className="mt-2 max-w-[220px] text-[9px] leading-4 text-white/45">
                      Verified project records will appear here as they are published.
                    </p>
                  </>
                )}

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

        <div className="flex min-h-0 flex-col bg-[#f5f7fb] p-5 lg:p-8 xl:p-10">

          <div className="mb-6 flex shrink-0 items-end justify-between gap-8">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-red-500">
                Projects
              </p>


              <h3 className="mt-2 max-w-3xl text-[27px] font-semibold tracking-[-0.035em] text-[#0a2230]">
                {category.label}
              </h3>

            </div>


            <Link
              href={categoryHref}
              className="hidden shrink-0 text-[10px] font-semibold text-red-500 lg:block"
            >
              View all category →
            </Link>

          </div>


          <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">
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
                  categoryLabel={category.label}
                  categoryHref={categoryHref}
                />
              )
            )}
          </div>

        </div>

      </div>

    </section>
  );
}