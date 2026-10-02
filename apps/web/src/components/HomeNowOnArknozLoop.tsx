"use client";

import { resolvePortalImage } from "@/lib/portal-image";
import Link from "next/link";

export type HomeNowOnArknozItem = {
  eyebrow: string;
  title: string;
  summary: string;
  href: string;
  meta?: string;
  image?: string;
};

type HomeNowOnArknozLoopProps = {
  items?: HomeNowOnArknozItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const fallbackItems: HomeNowOnArknozItem[] = [
  {
    eyebrow: "University",
    title: "Explore Education",
    summary: "Learning across the Built World.",
    href: "/learning",
    meta: "Learning",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Person",
    title: "Discover People",
    summary: "People shaping the Built World.",
    href: "/people",
    meta: "People",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Organisation",
    title: "Discover Organisations",
    summary: "Organisations across the Built World.",
    href: "/organisations",
    meta: "Organisations",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Place",
    title: "Explore Places",
    summary: "Move through the Built World by place.",
    href: "/places",
    meta: "Global",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Project",
    title: "Discover what is being built",
    summary: "Projects across the Built World.",
    href: "/projects",
    meta: "Built World",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Knowledge",
    title: "Understand what sits behind it",
    summary: "Research, cases and references.",
    href: "/knowledge",
    meta: "Knowledge",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Products",
    title: "See products, materials and systems",
    summary: "Materials, components and systems.",
    href: "/products",
    meta: "Products",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
  {
    eyebrow: "Opportunity",
    title: "Find ways to participate",
    summary: "Opportunities across the Built World.",
    href: "/opportunities",
    meta: "Opportunities",
    image: "/visuals/arknoz-built-world-watermark.jpg",
  },
];

export default function HomeNowOnArknozLoop({
  items = [],
  eyebrow = "Arknoz Now",
  title = "Moving through the Built World.",
  description = "Projects, products, knowledge, people, places and opportunities.",
  ctaLabel = "Explore more",
  ctaHref = "/explore",
}: HomeNowOnArknozLoopProps) {
  const railItems =
    items.length > 0
      ? items.slice(0, 10)
      : fallbackItems;

  return (
    <section
      className="
        relative
        z-20
        mt-0
        px-0
        sm:px-0
        lg:-mt-12
      "
    >
      <style>{`
        @keyframes arknozNowLeftToRight {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0%);
          }
        }

        .arknoz-now-track {
          animation:
            arknozNowLeftToRight
            46s
            linear
            infinite;
        }

        .arknoz-now-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .arknoz-now-track {
            animation: none;
          }
        }
      `}</style>

      <div
        className="
          mx-auto
          min-h-[36svh]
          w-full
          max-w-none
          overflow-hidden
          rounded-[30px]
          border
          border-slate-200
          bg-white
          shadow-[0_22px_70px_rgba(15,23,42,0.15)]
          lg:min-h-[38svh]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-8
            px-7
            pb-5
            pt-7
            sm:px-9
            lg:px-10
          "
        >
          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.24em]
                text-teal-700
              "
            >
              {eyebrow}
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-slate-950
                sm:text-3xl
              "
            >
              {title}
            </h2>
          </div>

          <p
            className="
              hidden
              max-w-sm
              text-right
              text-xs
              leading-5
              text-slate-400
              md:block
            "
          >
            {description}
          </p>
        </div>


        {/* RUNNING FULL-IMAGE PANELS */}

        <div
          className="
            relative
            overflow-hidden
            border-y
            border-slate-200
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
              arknoz-now-track
              flex
              w-max
              gap-4
            "
          >
            {[...railItems, ...railItems].map(
              (item, index) => {
                const duplicate =
                  index >= railItems.length;

                return (
                  <Link
                    key={`${item.href}-rail-${index}`}
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
                      h-[245px]
                      w-[250px]
                      shrink-0
                      overflow-hidden
                      rounded-[22px]
                      border
                      border-white/20
                      bg-[#17384a]
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      sm:w-[265px]
                      2xl:h-[265px]
                      2xl:w-[285px]
                    "
                  >
                    <img
                      src={resolvePortalImage({
                        src: item.image,
                        kind: item.eyebrow,
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
                          text-cyan-100/85
                        "
                      >
                        {item.eyebrow}
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

                      {item.meta ? (
                        <p
                          className="
                            mt-3
                            line-clamp-1
                            text-[11px]
                            font-medium
                            text-white/65
                          "
                        >
                          {item.meta}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>


        {/* EXPLORE */}

        <div
          className="
            flex
            min-h-[70px]
            items-center
            justify-end
            px-7
            sm:px-9
            lg:px-10
          "
        >
          <Link
            href={ctaHref}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-teal-800
            "
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}