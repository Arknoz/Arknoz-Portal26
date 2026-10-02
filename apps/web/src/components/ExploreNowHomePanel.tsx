"use client";

import Link from "next/link";

import { resolvePortalImage } from "@/lib/portal-image";

const exploreItems = [
  {
    type: "Project",
    title: "Explore Projects",
    geography: "Projects",
    href: "/projects",
    image: "/visuals/portal/project.png",
  },
  {
    type: "Product",
    title: "Explore Products",
    geography: "Products",
    href: "/products",
    image: "/visuals/portal/product.png",
  },
  {
    type: "Knowledge",
    title: "Explore Knowledge",
    geography: "Knowledge",
    href: "/knowledge",
    image: "/visuals/portal/knowledge.png",
  },
  {
    type: "Learning",
    title: "Explore Learning",
    geography: "Learning",
    href: "/learning",
    image: "/visuals/portal/education.png",
  },
  {
    type: "Person",
    title: "Explore People",
    geography: "People",
    href: "/people",
    image: "/visuals/portal/people.png",
  },
  {
    type: "Organisation",
    title: "Explore Organisations",
    geography: "Organisations",
    href: "/organisations",
    image: "/visuals/portal/organisation.png",
  },
  {
    type: "Place",
    title: "Explore Places",
    geography: "Places",
    href: "/places",
    image: "/visuals/portal/place.png",
  },
  {
    type: "Opportunity",
    title: "Explore Opportunities",
    geography: "Opportunities",
    href: "/opportunities",
    image: "/visuals/portal/opportunity.png",
  },
];

export default function ExploreNowHomePanel() {
  return (
    <section
      data-explore-screen="arknoz-now"
      className="bg-[#f5f7fb] px-5 py-5 sm:px-6 lg:px-8"
    >
      <style>{`
        @keyframes exploreNowLeftToRight {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0%);
          }
        }

        .explore-now-track {
          animation:
            exploreNowLeftToRight
            46s
            linear
            infinite;
        }

        .explore-now-track:hover {
          animation-play-state: paused;
        }

        .explore-now-track a {
          transition:
            transform 400ms ease,
            box-shadow 400ms ease;
        }

        .explore-now-track img {
          transition:
            transform 800ms ease,
            filter 500ms ease;
        }

        .explore-now-track a:hover {
          transform: translateY(-3px);
        }

        .explore-now-track a:hover img {
          transform: scale(1.035);
          filter:
            saturate(1.08)
            contrast(1.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .explore-now-track {
            animation: none;
          }
        }
      `}</style>

      <div
        className="
          mx-auto
          max-w-[1720px]
          overflow-hidden
          rounded-[10px]
          border
          border-slate-200
          bg-white
          shadow-[0_18px_50px_rgba(15,23,42,0.06)]
        "
      >
        {/* HEADER */}
        <div
          className="
            border-b
            border-slate-200
            px-7
            pb-4
            pt-5
            sm:px-9
            lg:px-10
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-bold tracking-[0.08em] text-red-500">
                Explore Now
              </p>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Live
              </span>
            </div>

            <h2 className="mt-2 text-[29px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#0a2230] sm:text-[34px]">
              Move through the Built World.
            </h2>

            <p className="mt-2 text-[13px] leading-5 text-slate-500">
              Projects, products, knowledge, learning, people,
              organisations, places and opportunities across Arknoz.
            </p>
          </div>
        </div>

        {/* RUNNING FULL-IMAGE PANELS */}
        <div
          className="
            relative
            overflow-hidden
            border-y
            border-slate-200
            bg-[#fbfcfe]
            py-5
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-20
              bg-gradient-to-r
              from-white
              to-transparent
              sm:w-28
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
              w-20
              bg-gradient-to-l
              from-white
              to-transparent
              sm:w-28
            "
          />

          <div
            className="
              explore-now-track
              flex
              w-max
              gap-4
            "
          >
            {[...exploreItems, ...exploreItems].map(
              (item, index) => {
                const duplicate =
                  index >= exploreItems.length;

                return (
                  <Link
                    key={`${item.href}-explore-now-${index}`}
                    href={item.href}
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
                    aria-label={`Open ${item.title}`}
                    className="
                      group
                      relative
                      h-[220px]
                      w-[260px]
                      shrink-0
                      overflow-hidden
                      border
                      border-slate-200
                      bg-[#0a2230]
                      transition
                      duration-300
                      sm:w-[280px]
                      2xl:h-[230px]
                      2xl:w-[300px]
                    "
                  >
                    <img
                      src={resolvePortalImage({
                        src: item.image,
                        kind: item.type,
                      })}
                      alt=""
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.04]
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#03121c]/95
                        via-[#03121c]/20
                        to-transparent
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        z-10
                        p-5
                        text-white
                      "
                    >
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-white/75
                        "
                      >
                        {item.type}
                      </p>

                      <h3
                        className="
                          mt-2
                          line-clamp-3
                          text-xl
                          font-semibold
                          leading-[1.05]
                          tracking-[-0.035em]
                        "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          line-clamp-1
                          text-[11px]
                          font-medium
                          text-white/65
                        "
                      >
                        {item.geography}
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* EXPLORE MORE */}
        <div
          className="
            flex
            min-h-[58px]
            items-center
            justify-end
            px-7
            sm:px-9
            lg:px-10
          "
        >
          <Link
            href="#arknoz-worlds"
            className="
              text-[12px]
              font-bold
              text-[#0a2230]
              transition
              hover:text-[#a61f46]
            "
          >
            Explore all →
          </Link>
        </div>
      </div>
    </section>
  );
}