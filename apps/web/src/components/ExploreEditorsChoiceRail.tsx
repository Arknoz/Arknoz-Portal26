import Link from "next/link";

import { getEntityHref } from "@/components/EntityCard";
import { entities, type EntityRecord } from "@/lib/entities";


const editorChoiceSlugs = [
  "urban-biodiversity",
  "bosco-verticale",
  "politecnico-di-milano",
  "milan",
  "white-arkitekter",
  "mass-timber-system",
] as const;


function getEditorImage(
  entity: EntityRecord
) {
  if (
    entity.type === "project" &&
    entity.project?.media?.[0]?.src
  ) {
    return entity.project.media[0].src;
  }

  return "/visuals/arknoz-built-world-watermark.jpg";
}


export default function ExploreEditorsChoiceRail() {

  const editorItems =
    editorChoiceSlugs.flatMap(
      (slug) => {

        const entity =
          entities.find(
            (candidate) =>
              candidate.slug === slug
          );

        return entity
          ? [entity]
          : [];
      }
    );


  if (editorItems.length === 0) {
    return null;
  }


  const runningItems = [
    ...editorItems,
    ...editorItems,
  ];


  return (
    <section
      data-explore-panel="editors-choice"
      className="
        bg-[#eef3f5]
        px-3
        py-10
        sm:px-6
        lg:px-8
        lg:py-12
      "
    >
      <style>{`
        @keyframes exploreEditorsChoiceMove {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0%);
          }
        }

        .explore-editors-choice-track {
          animation:
            exploreEditorsChoiceMove
            58s
            linear
            infinite;
        }

        .explore-editors-choice-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .explore-editors-choice-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>


      <div
        className="
          mx-auto
          max-w-[1800px]
          overflow-hidden
          rounded-[30px]
          border
          border-slate-200
          bg-white
          shadow-[0_18px_60px_rgba(15,23,42,0.10)]
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-slate-200
            px-6
            py-6
            md:flex-row
            md:items-end
            md:justify-between
            lg:px-9
          "
        >
          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-teal-700
              "
            >
              Arknoz Editor&apos;s Choice
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-semibold
                tracking-[-0.04em]
                text-slate-950
                sm:text-4xl
              "
            >
              Selected across the Built World.
            </h2>

          </div>


          <p
            className="
              max-w-md
              text-sm
              leading-6
              text-slate-400
              md:text-right
            "
          >
            Records selected by Arknoz for their relevance,
            ideas and connection to the Built World.
          </p>

        </div>


        {/* RUNNING CARDS */}

        <div className="relative overflow-hidden py-5">

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-16
              bg-gradient-to-r
              from-white
              to-transparent
              sm:w-24
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-16
              bg-gradient-to-l
              from-white
              to-transparent
              sm:w-24
            "
          />


          <div
            className="
              explore-editors-choice-track
              flex
              w-max
              gap-4
              px-4
            "
          >
            {runningItems.map(
              (entity, index) => {

                const image =
                  getEditorImage(entity);

                const duplicate =
                  index >=
                  editorItems.length;

                return (
                  <Link
                    key={`${entity.type}-${entity.slug}-${index}`}
                    href={getEntityHref(entity)}
                    aria-hidden={
                      duplicate
                        ? true
                        : undefined
                    }
                    tabIndex={
                      duplicate
                        ? -1
                        : undefined
                    }
                    className="
                      group
                      relative
                      block
                      h-[270px]
                      min-w-[285px]
                      overflow-hidden
                      rounded-[24px]
                      bg-[#0b2949]
                      shadow-sm
                      ring-1
                      ring-slate-200
                      sm:h-[290px]
                      sm:min-w-[325px]
                    "
                  >

                    <img
                      src={image}
                      alt=""
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-[1.035]
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/25
                        to-black/5
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        p-5
                        text-white
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-cyan-100
                        "
                      >
                        {entity.type}
                      </p>

                      <h3
                        className="
                          mt-2
                          text-2xl
                          font-semibold
                          leading-[1.02]
                          tracking-[-0.035em]
                        "
                      >
                        {entity.title}
                      </h3>

                      <p
                        className="
                          mt-2
                          line-clamp-1
                          text-xs
                          text-white/65
                        "
                      >
                        {entity.subtitle ||
                          entity.geography}
                      </p>

                      <p
                        className="
                          mt-4
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Explore →
                      </p>

                    </div>

                  </Link>
                );
              }
            )}
          </div>
        </div>


        {/* BOTTOM STRIP */}

        <div
          className="
            border-t
            border-slate-200
            px-6
            py-4
            text-right
            lg:px-9
          "
        >
          <span
            className="
              text-xs
              font-semibold
              text-teal-700
            "
          >
            Editor-selected discovery across Arknoz
          </span>
        </div>

      </div>
    </section>
  );
}