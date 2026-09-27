"use client";

import HomePlatformOverview from "@/components/HomePlatformOverview";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";


export type HomeEditorialRecord = {
  title: string;
  subtitle?: string;
  summary?: string;
  geography?: string;
  href: string;
  image?: string;
  type: string;
};


type HeroFeature = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};


type Props = {
  records: HomeEditorialRecord[];
  featured: HeroFeature[];
};


const hasImage = (
  src?: string
) =>
  Boolean(
    src &&
    src !==
      "/visuals/arknoz-neutral.svg"
  );


function labelFor(
  value: string
) {
  return value
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="
        inline-block
        transition-transform
        duration-200
        group-hover:translate-x-1
      "
    >
      â†’
    </span>
  );
}


function GraphicFallback({
  label,
  light = false,
}: {
  label: string;
  light?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        absolute
        inset-0
        overflow-hidden
        ${
          light
            ? "bg-[#e9eeec]"
            : "bg-[#17384a]"
        }
      `}
    >
      <div
        className="
          absolute
          inset-0
          opacity-[0.12]
          [background-image:linear-gradient(rgba(70,110,120,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(70,110,120,.45)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      <div
        className={`
          absolute
          -right-[7%]
          top-[15%]
          h-[68%]
          w-[61%]
          border
          ${
            light
              ? "border-slate-500/20"
              : "border-white/15"
          }
        `}
      />

      <div
        className={`
          absolute
          right-[9%]
          top-[29%]
          h-[39%]
          w-[37%]
          border
          ${
            light
              ? "border-slate-500/20"
              : "border-white/15"
          }
        `}
      />

      <span
        className={`
          absolute
          bottom-5
          left-6
          text-[8px]
          font-bold
          uppercase
          tracking-[0.18em]
          ${
            light
              ? "text-slate-500"
              : "text-white/35"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}


function Media({
  record,
  label,
  light = false,
  overlay = true,
}: {
  record?: HomeEditorialRecord;
  label: string;
  light?: boolean;
  overlay?: boolean;
}) {
  const [
    failed,
    setFailed,
  ] =
    useState(false);

  if (
    !record ||
    !hasImage(
      record.image
    ) ||
    failed
  ) {
    return (
      <GraphicFallback
        label={label}
        light={light}
      />
    );
  }

  return (
    <>
      <img
        src={record.image}
        alt=""
        onError={() =>
          setFailed(true)
        }
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {overlay ? (
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/10
            to-transparent
          "
        />
      ) : null}
    </>
  );
}


function StoryCard({
  record,
  fallbackHref,
  label,
  fallbackTitle,
}: {
  record?: HomeEditorialRecord;
  fallbackHref: string;
  label: string;
  fallbackTitle: string;
}) {
  return (
    <Link
      href={
        record?.href ??
        fallbackHref
      }
      className="
        group
        relative
        block
        min-h-[340px]
        overflow-hidden
        rounded-[24px]
        bg-[#17384a]
      "
    >
      <Media
        record={record}
        label={label}
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-10
          p-6
          text-white
        "
      >
        <p
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-white/55
          "
        >
          {label}
        </p>

        <h3
          className="
            mt-3
            max-w-[16ch]
            text-2xl
            font-semibold
            leading-[1.05]
            tracking-[-0.035em]
          "
        >
          {
            record?.title ??
            fallbackTitle
          }
        </h3>

        <span
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            text-xs
            font-semibold
          "
        >
          Explore
          <Arrow />
        </span>
      </div>
    </Link>
  );
}


const actions = [
  {
    title: "Explore",
    description:
      "Browse projects, products, places and what is happening across the Built World.",
    href: "/explore",
  },
  {
    title: "Understand",
    description:
      "Move from individual records into research, cases, standards and context.",
    href: "/knowledge",
  },
  {
    title: "Learn",
    description:
      "Discover courses, programmes, methods, skills and professional development.",
    href: "/learning",
  },
  {
    title: "Connect",
    description:
      "Find the people, practices, companies and institutions behind the work.",
    href: "/people",
  },
  {
    title: "Find opportunities",
    description:
      "Jobs, competitions, tenders, grants, fellowships, events and open calls.",
    href: "/opportunities",
  },
  {
    title: "Participate",
    description:
      "Join the community, contribute knowledge and collaborate around the Built World.",
    href: "/community",
  },
] as const;


export default function HomeContinuousExperience({
  records,
  featured,
}: Props) {
  const router =
    useRouter();

  const [
    query,
    setQuery,
  ] =
    useState("");

  const featuredItems =
    useMemo(
      () =>
        featured
          .filter(
            (item) =>
              Boolean(
                item?.title
              )
          )
          .slice(
            0,
            9
          ),
      [featured]
    );


  const [
    featuredSelection,
    setFeaturedSelection,
  ] =
    useState<number[]>([
      0,
      1,
      2,
    ]);


  const chooseNextFeaturedForSlot = useCallback((
    slotIndex: number
  ) => {
    if (
      featuredItems.length <= 1
    ) {
      return;
    }

    setFeaturedSelection(
      (current) => {
        const next =
          [...current];

        const currentlyUsed =
          new Set(
            current.filter(
              (
                _,
                index
              ) =>
                index !==
                slotIndex
            )
          );

        const candidates =
          featuredItems
            .map(
              (
                _,
                index
              ) => index
            )
            .filter(
              (index) =>
                index !==
                  current[
                    slotIndex
                  ] &&
                !currentlyUsed.has(
                  index
                )
            );

        const usable =
          candidates.length > 0
            ? candidates
            : featuredItems
                .map(
                  (
                    _,
                    index
                  ) => index
                )
                .filter(
                  (index) =>
                    index !==
                    current[
                      slotIndex
                    ]
                );

        if (
          usable.length === 0
        ) {
          return current;
        }

        const choice =
          usable[
            Math.floor(
              Math.random() *
              usable.length
            )
          ];

        next[
          slotIndex
        ] =
          choice;

        return next;
      }
    );
  }, [featuredItems]);


  useEffect(
    () => {
      if (
        featuredItems.length <= 1
      ) {
        return;
      }

      /*
       * Each Featured panel has its own clock.
       *
       * Panel 1 begins after 5 minutes.
       * Panel 2 begins after 6 minutes 40 seconds.
       * Panel 3 begins after 8 minutes 20 seconds.
       *
       * After its first change, each individual
       * panel continues on its own 5-minute cycle.
       */
      const firstDelay = [
        300000,
        400000,
        500000,
      ];

      const timeoutIds:
        number[] = [];

      const intervalIds:
        number[] = [];

      [0, 1, 2].forEach(
        (slotIndex) => {
          const timeout =
            window.setTimeout(
              () => {
                chooseNextFeaturedForSlot(
                  slotIndex
                );

                const interval =
                  window.setInterval(
                    () => {
                      chooseNextFeaturedForSlot(
                        slotIndex
                      );
                    },
                    300000
                  );

                intervalIds.push(
                  interval
                );
              },
              firstDelay[
                slotIndex
              ]
            );

          timeoutIds.push(
            timeout
          );
        }
      );

      return () => {
        timeoutIds.forEach(
          (id) =>
            window.clearTimeout(
              id
            )
        );

        intervalIds.forEach(
          (id) =>
            window.clearInterval(
              id
            )
        );
      };
    },
    [
      featuredItems.length,
      chooseNextFeaturedForSlot,
    ]
  );

  const featuredCards =
    featuredSelection
      .map(
        (index) =>
          featuredItems[
            index
          ]
      )
      .filter(
        (
          item
        ): item is HeroFeature =>
          Boolean(item)
      );

  const recordsOf =
    (
      type: string
    ) =>
      records.filter(
        (record) =>
          record.type === type
      );


  const projects =
    recordsOf("project");

  const products =
    recordsOf("product");

  const knowledge =
    recordsOf("knowledge");

  const people =
    recordsOf("person");

  const organisations =
    recordsOf(
      "organisation"
    );

  const universities =
    recordsOf("university");

  const places =
    recordsOf("place");

  const opportunities =
    recordsOf(
      "opportunity"
    );


  const recordsWithImages =
    useMemo(
      () =>
        records.filter(
          (record) =>
            hasImage(
              record.image
            )
        ),
      [records]
    );


  const heroRecord =
    projects.find(
      (record) =>
        hasImage(
          record.image
        )
    ) ??
    recordsWithImages[0] ??
    projects[0] ??
    records[0];


  const liveRecords =
    records
      .filter(Boolean)
      .slice(
        0,
        6
      );


  const nowItems:
    HomeEditorialRecord[] =
    liveRecords.length > 0
      ? liveRecords
      : [
          {
            title:
              "Discover what is being built",
            summary:
              "Explore architecture, infrastructure and development across the Built World.",
            geography:
              "Built World",
            href:
              "/projects",
            type:
              "project",
          },
          {
            title:
              "Understand the ideas behind it",
            summary:
              "Research, case studies, standards, methods and Built World knowledge.",
            geography:
              "Knowledge",
            href:
              "/knowledge",
            type:
              "knowledge",
          },
          {
            title:
              "Explore materials and systems",
            summary:
              "Discover products, materials, components, equipment and technology.",
            geography:
              "Products",
            href:
              "/products",
            type:
              "product",
          },
          {
            title:
              "Find what comes next",
            summary:
              "Jobs, competitions, grants, tenders, events and open calls.",
            geography:
              "Opportunities",
            href:
              "/opportunities",
            type:
              "opportunity",
          },
        ];




  const nowStandardItems:
    HomeEditorialRecord[] = [
      {
        title:
          "Explore Projects",
        summary:
          "Architecture, infrastructure, interiors, landscape and development.",
        geography:
          "Built World",
        href:
          "/projects",
        type:
          "project",
      },
      {
        title:
          "Explore Products",
        summary:
          "Materials, components, building systems, equipment and technology.",
        geography:
          "Materials Â· Systems",
        href:
          "/products",
        type:
          "product",
      },
      {
        title:
          "Explore Knowledge",
        summary:
          "Research, case studies, standards, references, methods and ideas.",
        geography:
          "Knowledge",
        href:
          "/knowledge",
        type:
          "knowledge",
      },
      {
        title:
          "Explore Education",
        summary:
          "Courses, programmes, professional development, skills and learning.",
        geography:
          "Learning",
        href:
          "/learning",
        type:
          "university",
      },
      {
        title:
          "Discover People",
        summary:
          "Professionals and contributors shaping the Built World.",
        geography:
          "People",
        href:
          "/people",
        type:
          "person",
      },
      {
        title:
          "Discover Organisations",
        summary:
          "Practices, companies and institutions working across the Built World.",
        geography:
          "Organisations",
        href:
          "/organisations",
        type:
          "organisation",
      },
      {
        title:
          "Explore Places",
        summary:
          "Discover the Built World through cities, countries and regions.",
        geography:
          "Global",
        href:
          "/global",
        type:
          "place",
      },
      {
        title:
          "Find Opportunities",
        summary:
          "Jobs, competitions, tenders, grants, events and open calls.",
        geography:
          "Opportunities",
        href:
          "/opportunities",
        type:
          "opportunity",
      },
    ];


  const nowRailItems =
    [
      ...nowItems,
      ...nowStandardItems,
    ]
      .filter(
        (
          item,
          index,
          array
        ) =>
          array.findIndex(
            (candidate) =>
              candidate.href ===
              item.href
          ) === index
      )
      .slice(
        0,
        8
      );

  function submitSearch(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const value =
      query.trim();

    router.push(
      value
        ? `/search?q=${encodeURIComponent(
            value
          )}`
        : "/search"
    );
  }


  return (
    <div
      data-arknoz-home-v4-1="true"
      className="
        relative
        isolate
        overflow-hidden
        bg-[#f5f6f3]
        text-slate-950
      "
    >

      {/* ARKNOZ BUILT WORLD WATERMARK
          Source: Celine Lityo / Unsplash
          Photo ID: 1610956667016-15debe929a3f
          Free to use under the Unsplash License.
      */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-[url('/visuals/arknoz-built-world-watermark.jpg')]
            bg-cover
            bg-center
            bg-no-repeat
            opacity-[0.065]
            grayscale
            contrast-75
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-white/50
          "
        />
      </div>

      {/* ==============================================
          HERO â€” WHAT IS ARKNOZ
         ============================================== */}

      <section
        className="
          relative
          isolate
          overflow-hidden
          bg-[#081b27]
          text-white
        "
      >

        {/* FULL-BLEED BUILT WORLD ATMOSPHERE */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-[url('/visuals/arknoz-built-world-watermark.jpg')]
              bg-cover
              bg-center
              bg-no-repeat
              opacity-[0.32]
              grayscale-[20%]
              saturate-[0.75]
              contrast-90
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#061722]
              via-[#071925]/88
              to-[#071925]/28
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#071925]/55
              via-transparent
              to-[#071925]/15
            "
          />
        </div>
        <div
          className="
            hidden
          "
        >
          <Media
            record={heroRecord}
            label="THE BUILT WORLD"
            overlay={false}
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#081b27]
              via-[#081b27]/45
              to-transparent
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#081b27]/55
              via-transparent
              to-[#081b27]/10
            "
          />
        </div>


        {featuredCards.length > 0 ? (
          <aside
            aria-label="Featured on Arknoz"
            className="
              absolute
              right-[2.2%]
              top-1/2
              z-20
              hidden
              w-[650px]
              -translate-y-1/2
              xl:block
              2xl:w-[720px]
            "
          >
            <h2
              className="
                mb-4
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-white/90
              "
            >
              FEATURED ON ARKNOZ
            </h2>


            <div
              className="
                grid
                h-[455px]
                grid-cols-[1.36fr_.64fr]
                grid-rows-2
                gap-3
                2xl:h-[500px]
              "
            >
              {featuredCards.map(
                (
                  item,
                  index
                ) => {
                  const linkedRecord =
                    records.find(
                      (record) =>
                        record.href ===
                        item.href
                    );

                  const imageSrc =
                    hasImage(
                      item.image
                    )
                      ? item.image
                      : "/visuals/arknoz-built-world-watermark.jpg";

                  const panelClass =
                    index === 0
                      ? `
                          group
                          relative
                          row-span-2
                          overflow-hidden
                          rounded-[26px]
                          border
                          border-white/20
                          bg-[#102f3f]
                          shadow-xl
                        `
                      : `
                          group
                          relative
                          overflow-hidden
                          rounded-[22px]
                          border
                          border-white/20
                          bg-[#102f3f]
                          shadow-xl
                        `;

                  return (
                    <div
                      key={
                        `${item.href}-${index}`
                      }
                      className={
                        panelClass
                      }
                    >
                      <Link
                        href={
                          item.href
                        }
                        className="
                          absolute
                          inset-0
                          z-10
                          block
                        "
                      >
                        <img
                          src={imageSrc}
                          alt=""
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-[1.025]
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#04131d]/95
                            via-[#061722]/22
                            to-black/10
                          "
                        />


                        <div
                          className="
                            absolute
                            left-5
                            top-5
                            z-10
                          "
                        >
                          <p
                            className="
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.18em]
                              text-cyan-100/90
                            "
                          >
                            {item.type}
                          </p>
                        </div>


                        <div
                          className={
                            index === 0
                              ? `
                                  absolute
                                  inset-x-0
                                  bottom-0
                                  z-10
                                  p-7
                                  pr-20
                                  2xl:p-8
                                  2xl:pr-24
                                `
                              : `
                                  absolute
                                  inset-x-0
                                  bottom-0
                                  z-10
                                  p-5
                                  pr-14
                                `
                          }
                        >
                          {item.meta ? (
                            <p
                              className="
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-white/65
                              "
                            >
                              {item.meta}
                            </p>
                          ) : null}

                          <h3
                            className={
                              index === 0
                                ? `
                                    mt-2
                                    max-w-[14ch]
                                    text-3xl
                                    font-semibold
                                    leading-[1]
                                    tracking-[-0.045em]
                                    text-white
                                    2xl:text-4xl
                                  `
                                : `
                                    mt-2
                                    line-clamp-3
                                    text-xl
                                    font-semibold
                                    leading-[1.05]
                                    tracking-[-0.035em]
                                    text-white
                                  `
                            }
                          >
                            {item.title}
                          </h3>

                          {index === 0 &&
                          linkedRecord?.summary ? (
                            <p
                              className="
                                mt-4
                                line-clamp-2
                                max-w-[42ch]
                                text-[11px]
                                leading-5
                                text-white/65
                              "
                            >
                              {
                                linkedRecord.summary
                              }
                            </p>
                          ) : null}
                        </div>
                      </Link>


                      <button
                        type="button"
                        onClick={() =>
                          chooseNextFeaturedForSlot(
                            index
                          )
                        }
                        aria-label={`Show next featured item for panel ${index + 1}`}
                        className="
                          absolute
                          bottom-5
                          right-5
                          z-30
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/30
                          bg-black/30
                          text-sm
                          font-semibold
                          text-white
                          backdrop-blur-md
                          transition
                          hover:scale-105
                          hover:bg-white
                          hover:text-slate-950
                        "
                      >
                        â†’
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </aside>
        ) : null}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[calc(100svh-80px)]
            lg:min-h-[calc(88svh-80px)]
            max-w-[1720px]
            items-center
            px-5
            pt-5 pb-16
            sm:px-8
            lg:px-12
          "
        >
          <div
            className="
              max-w-[760px]
              lg:w-[52%]
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.23em]
                text-cyan-200/70
              "
            >
              ARKNOZ Â· BUILT WORLD PLATFORM
            </p>

            <h1
              className="
                mt-7
                max-w-[9ch]
                text-[54px]
                font-semibold
                leading-[0.9]
                tracking-[-0.065em]
                sm:text-[70px]
                xl:text-[86px]
              "
            >
              The Built World. Connected.
            </h1>

            <p
              className="
                mt-7
                max-w-[680px]
                text-[17px]
                leading-8
                text-white/72
              "
            >
              Arknoz connects the projects,
              products, knowledge,
              education, people,
              organisations, places and
              opportunities that shape the
              Built World.
            </p>

            <p
              className="
                mt-3
                max-w-[660px]
                text-[13px]
                leading-6
                text-white/45
              "
            >
              Discover what is being built,
              understand how it connects,
              learn from it and find where
              you can participate next.
            </p>


            <form
              onSubmit={
                submitSearch
              }
              className="
                mt-9
                flex
                max-w-[660px]
                items-center
                rounded-[15px]
                bg-white
                p-1.5
                shadow-2xl
              "
            >
              <input
                value={query}
                onChange={
                  (event) =>
                    setQuery(
                      event.target.value
                    )
                }
                placeholder="Search project, product, architect, city, topic..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  py-3.5
                  text-sm
                  text-slate-950
                  outline-none
                  placeholder:text-slate-400
                "
              />

              <button
                type="submit"
                className="
                  rounded-[11px]
                  bg-[#153e57]
                  px-6
                  py-3.5
                  text-xs
                  font-semibold
                  text-white
                "
              >
                Search
              </button>
            </form>


            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >
              <a
                href="#how-arknoz-works"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-[11px]
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-950
                "
              >
                See how it works
                <Arrow />
              </a>

              <Link
                href="/explore"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-[11px]
                  border
                  border-white/25
                  px-5
                  py-3
                  text-sm
                  font-semibold
                "
              >
                Open Explore
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>


            {/* ARKNOZ_NOW_RENDER_V1 */}

      <section
        className="
          relative
          z-20
          mt-2
          px-3
          sm:px-5
          lg:-mt-8
          lg:px-7
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
            max-w-[1780px]
            overflow-hidden
            rounded-[30px]
            border
            border-slate-200
            bg-white
            shadow-[0_22px_70px_rgba(15,23,42,0.15)]
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
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-teal-700
                "
              >
                ARKNOZ NOW
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
                Moving through the Built World.
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
              Projects, products, knowledge, people, places and opportunities.
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
              {[
                ...nowRailItems,
                ...nowRailItems,
              ].map(
                (
                  item,
                  index
                ) => {
                  const duplicate =
                    index >=
                    nowRailItems.length;

                  return (
                    <Link
                      key={
                        `${item.href}-rail-${index}`
                      }
                      href="/explore"
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
                      aria-label="Explore Arknoz"
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
                        src={
                          hasImage(
                            item.image
                          )
                            ? item.image
                            : "/visuals/arknoz-built-world-watermark.jpg"
                        }
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
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-cyan-100/85
                          "
                        >
                          {
                            labelFor(
                              item.type
                            )
                          }
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
                          {
                            item.title
                          }
                        </h3>

                        {item.geography ? (
                          <p
                            className="
                              mt-3
                              line-clamp-1
                              text-[9px]
                              font-medium
                              text-white/65
                            "
                          >
                            {
                              item.geography
                            }
                          </p>
                        ) : null}
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
              min-h-[70px]
              items-center
              justify-end
              px-7
              sm:px-9
              lg:px-10
            "
          >
            <Link
              href="/explore"
              className="
                text-sm
                font-semibold
                text-teal-800
              "
            >
              Explore more â†’
            </Link>
          </div>
        </div>
      </section>




      {/* ======================================================
          HOME Â· THE BUILT WORLD ON ARKNOZ
         ====================================================== */}

      <HomePlatformOverview />
<section hidden aria-hidden="true"
        data-home-why-arknoz="true"
        className="
          relative
          overflow-hidden
          bg-[#f3f6f8]
          px-5
          py-20
          sm:px-8
          lg:px-12
          lg:py-24
          xl:py-28
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            opacity-[0.22]
            [background-image:linear-gradient(rgba(15,58,70,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,58,70,.08)_1px,transparent_1px)]
            [background-size:56px_56px]
          "
        />

        <div
          className="
            relative
            mx-auto
            grid
            max-w-[1640px]
            gap-14
            lg:grid-cols-[0.88fr_1.12fr]
            lg:items-stretch
            lg:gap-16
          "
        >

          {/* =====================================================
              LEFT â€” THE PROBLEM / POSITION
             ===================================================== */}

          <div
            className="
              flex
              flex-col
              justify-between
              py-2
            "
          >
            <div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-teal-200
                  bg-white/85
                  px-5
                  py-3
                  shadow-sm
                  backdrop-blur
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-teal-600
                  "
                />

                <span
                  className="
                    text-[13px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-teal-800
                  "
                >
                  WHY ARKNOZ
                </span>
              </div>


              <h2
                className="
                  mt-8
                  max-w-[10ch]
                  text-[46px]
                  font-semibold
                  leading-[0.94]
                  tracking-[-0.055em]
                  text-slate-950
                  sm:text-[58px]
                  lg:text-[66px]
                  2xl:text-[74px]
                "
              >
                The Built World is connected.

                <span
                  className="
                    mt-2
                    block
                    text-slate-400
                  "
                >
                  Its information isn&apos;t.
                </span>
              </h2>


              <p
                className="
                  mt-8
                  max-w-[39ch]
                  text-lg
                  leading-8
                  text-slate-600
                  lg:text-xl
                "
              >
                Projects, products, knowledge, people, places and
                opportunities live across disconnected sources.
              </p>
            </div>


            <div
              className="
                mt-12
                max-w-xl
                border-t
                border-slate-300
                pt-7
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-teal-700
                "
              >
                THE ARKNOZ DIFFERENCE
              </p>

              <p
                className="
                  mt-3
                  max-w-[38ch]
                  text-xl
                  font-medium
                  leading-8
                  tracking-[-0.025em]
                  text-slate-800
                "
              >
                One subject can lead to its projects, products,
                people, places, knowledge and opportunities.
              </p>
            </div>
          </div>


          {/* =====================================================
              RIGHT â€” THE ARKNOZ PROPOSITION
             ===================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[34px]
              border
              border-white/10
              bg-[#082534]
              p-7
              text-white
              shadow-[0_30px_90px_rgba(7,31,43,0.20)]
              sm:p-9
              lg:p-10
              xl:p-12
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -right-20
                -top-20
                h-72
                w-72
                rounded-full
                border
                border-cyan-200/10
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                -right-6
                top-10
                h-52
                w-52
                rounded-full
                border
                border-cyan-200/10
              "
            />


            <div
              className="
                relative
                z-10
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-cyan-200/75
                "
              >
                CONNECTED BUILT WORLD INTELLIGENCE
              </p>


              <h3
                className="
                  mt-5
                  max-w-[16ch]
                  text-3xl
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.045em]
                  sm:text-4xl
                  xl:text-[46px]
                "
              >
                More than search.
                <br />
                More than listings.
              </h3>


              <p
                className="
                  mt-7
                  max-w-[58ch]
                  text-[16px]
                  leading-8
                  text-white/72
                "
              >
                <strong
                  className="
                    font-semibold
                    text-white
                  "
                >
                  Arknoz is not a directory or marketplace.
                </strong>

                {" "}

                It is a connected Built World journey and intelligence
                platform â€” bringing records, data, context and relationships
                together so users can discover, analyse, understand and act.
              </p>


              {/* =================================================
                  THE JOURNEY
                 ================================================= */}

              <div
                className="
                  mt-9
                  rounded-[26px]
                  border
                  border-white/10
                  bg-white/[0.055]
                  p-5
                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-white/55
                    "
                  >
                    THE JOURNEY
                  </p>

                  <p
                    className="
                      hidden
                      text-[9px]
                      uppercase
                      tracking-[0.16em]
                      text-cyan-200/45
                      sm:block
                    "
                  >
                    FROM DISCOVERY TO ACTION
                  </p>
                </div>


                <div
                  className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-2.5
                    sm:grid-cols-5
                  "
                >
                  {[
                    {
                      step: "01",
                      label: "Discover",
                    },
                    {
                      step: "02",
                      label: "Connect",
                    },
                    {
                      step: "03",
                      label: "Analyse",
                    },
                    {
                      step: "04",
                      label: "Understand",
                    },
                    {
                      step: "05",
                      label: "Act",
                    },
                  ].map(
                    (
                      item
                    ) => (
                      <div
                        key={
                          item.label
                        }
                        className="
                          group
                          rounded-[18px]
                          border
                          border-white/10
                          bg-white/[0.045]
                          px-4
                          py-4
                          transition
                          duration-300
                          hover:-translate-y-1
                          hover:border-cyan-200/35
                          hover:bg-white/[0.08]
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            font-bold
                            text-cyan-200/50
                          "
                        >
                          {
                            item.step
                          }
                        </p>

                        <p
                          className="
                            mt-4
                            text-[12px]
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-white
                          "
                        >
                          {
                            item.label
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>


              {/* =================================================
                  CLOSING POSITION
                 ================================================= */}

              <div
                className="
                  mt-8
                  grid
                  gap-6
                  border-t
                  border-white/10
                  pt-7
                  sm:grid-cols-[1fr_auto]
                  sm:items-end
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-cyan-200/55
                    "
                  >
                    FROM INFORMATION TO INTELLIGENCE
                  </p>

                  <p
                    className="
                      mt-2
                      max-w-[42ch]
                      text-lg
                      font-medium
                      leading-7
                      tracking-[-0.02em]
                      text-white
                    "
                  >
                    From isolated data to connected Built World intelligence.
                  </p>
                </div>


                <Link
                  href="/explore"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-white
                    hover:text-slate-950
                  "
                >
                  Explore Arknoz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          04 â€” ARKNOZ VALUE LAYERS
          HOME IS THE EXPERIENCE â€” EXPLORE IS THE MAIN GATEWAY
          ========================================================= */}

      <section hidden aria-hidden="true"
        data-home-master="three-layers"
        className="border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-[1640px]">

          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
                ONE PLATFORM
              </p>

              <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-5xl xl:text-[60px]">
                Enter once. Go as deep as you need.
              </h2>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Home introduces Arknoz. Explore opens the global Built World.
              Connect organises what matters around your purpose.
              Intelligence helps you understand what the connected evidence means.
            </p>
          </div>


          <div className="mt-12 grid gap-4 lg:grid-cols-[1.55fr_1fr_1fr]">

            <Link
              href="/explore"
              className="group relative min-h-[330px] overflow-hidden rounded-[30px] bg-[#092b3b] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-9"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:54px_54px]"
              />

              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/75">
                  PRIMARY GATEWAY
                </p>

                <h3 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">
                  Explore
                </h3>

                <p className="mt-4 max-w-md text-lg leading-8 text-white/70">
                  Search and move through genuine Built World content
                  across worlds, intent, place and connections.
                </p>

                <div className="mt-9 flex flex-wrap gap-2">
                  {[
                    "Worlds",
                    "Intent",
                    "Place",
                    "Connections",
                    "Search",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mt-auto pt-10 text-sm font-semibold">
                  Enter Explore â†’
                </p>
              </div>
            </Link>


            <Link
              href="/community"
              className="group min-h-[330px] rounded-[30px] border border-slate-200 bg-[#f4f7f8] p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
                NEXT LAYER
              </p>

              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                Community
              </h3>

              <p className="mt-4 max-w-sm text-[15px] leading-7 text-slate-600">
                Let Arknoz organise related knowledge, people,
                projects, products and opportunities around a purpose.
              </p>

              <p className="mt-14 text-sm font-semibold text-teal-800">
                Explore Community â†’
              </p>
            </Link>


            <Link
              href="/intelligence"
              className="group min-h-[330px] rounded-[30px] border border-slate-200 bg-[#f4f7f8] p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
                DEEPER LAYER
              </p>

              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                Intelligence
              </h3>

              <p className="mt-4 max-w-sm text-[15px] leading-7 text-slate-600">
                Move from information to comparison, evidence,
                patterns, benchmarks, change and signals.
              </p>

              <p className="mt-14 text-sm font-semibold text-teal-800">
                Open Intelligence â†’
              </p>
            </Link>

          </div>
        </div>
      </section>

<section
        data-home-master="arknoz-curated"
        className="
          relative
          z-20
          mt-2
          px-3
          sm:px-5
          lg:-mt-8
          lg:px-7
        "
      >
        <style>{`
          @keyframes arknozCuratedLeftToRight {
            from {
              transform: translateX(-50%);
            }

            to {
              transform: translateX(0%);
            }
          }

          .arknoz-curated-track {
            animation:
              arknozCuratedLeftToRight
              46s
              linear
              infinite;
          }

          .arknoz-curated-track:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .arknoz-curated-track {
              animation: none;
            }
          }
        `}</style>

        <div
          className="
            mx-auto
            max-w-[1780px]
            overflow-hidden
            rounded-[30px]
            border
            border-slate-200
            bg-white
            shadow-[0_22px_70px_rgba(15,23,42,0.15)]
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
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-teal-700
                "
              >
                ARKNOZ CURATED
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
                Editor&apos;s Choice. Across the Built World.
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
              Selected projects, products, knowledge, organisations, people, places and opportunities.
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
                arknoz-curated-track
                flex
                w-max
                gap-4
              "
            >
              {[
                ...nowRailItems.map(
                  (item) => ({
                    ...item,
                    type:
                      "EDITOR'S CHOICE Â· " +
                      item.type,
                  })
                ),

                ...featuredItems.map(
                  (item) => ({
                    title:
                      item.title,
                    subtitle:
                      item.type,
                    summary:
                      "",
                    geography:
                      item.meta,
                    href:
                      item.href,
                    image:
                      item.image,
                    type:
                      "FEATURED Â· " +
                      item.type,
                  })
                ),

                ...nowRailItems.map(
                  (item) => ({
                    ...item,
                    type:
                      "EDITOR'S CHOICE Â· " +
                      item.type,
                  })
                ),

                ...featuredItems.map(
                  (item) => ({
                    title:
                      item.title,
                    subtitle:
                      item.type,
                    summary:
                      "",
                    geography:
                      item.meta,
                    href:
                      item.href,
                    image:
                      item.image,
                    type:
                      "FEATURED Â· " +
                      item.type,
                  })
                ),
              ].map(
                (
                  item,
                  index
                ) => {
                  const duplicate =
                    index >=
                    (
                      nowRailItems.length +
                      featuredItems.length
                    );

                  return (
                    <Link
                      key={
                        `${item.href}-rail-${index}`
                      }
                      href="/explore"
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
                      aria-label="Explore Arknoz"
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
                        src={
                          hasImage(
                            item.image
                          )
                            ? item.image
                            : "/visuals/arknoz-built-world-watermark.jpg"
                        }
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
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-cyan-100/85
                          "
                        >
                          {
                            labelFor(
                              item.type
                            )
                          }
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
                          {
                            item.title
                          }
                        </h3>

                        {item.geography ? (
                          <p
                            className="
                              mt-3
                              line-clamp-1
                              text-[9px]
                              font-medium
                              text-white/65
                            "
                          >
                            {
                              item.geography
                            }
                          </p>
                        ) : null}
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
              min-h-[70px]
              items-center
              justify-end
              px-7
              sm:px-9
              lg:px-10
            "
          >
            <Link
              href="/explore"
              className="
                text-sm
                font-semibold
                text-teal-800
              "
            >
              Explore more â†’
            </Link>
          </div>
        </div>
      </section>





      {/* =========================================================
          05 â€” EXPLORE
          ========================================================= */}









      {/* =========================================================
          06 â€” GLOBAL
          ========================================================= */}




      {/* =========================================================
          MEMBERS CHOICE
          Genuine member signals only
          ========================================================= */}







      {/* =========================================================
          07 â€” CONNECT
          ========================================================= */}





      {/* =========================================================
          08 â€” INTELLIGENCE
          ========================================================= */}





      {/* =========================================================
          09 â€” ONE SUBJECT / MANY PATHS
          ========================================================= */}













      {/* =========================================================
          10 â€” LEARN / COLLABORATE / ACT
          ========================================================= */}




      {/* =========================================================
          ARKNOZ PARTNERS
          3 moving rows â€¢ all links route to /explore
          ========================================================= */}

      <section
        data-home-master="arknoz-partners"
        className="
          bg-white
          px-5
          py-8
          sm:px-8
          lg:px-12
          lg:py-10
        "
      >
        <style>{`
          @keyframes arknozPartnerLeft {
            from {
              transform: translateX(0%);
            }

            to {
              transform: translateX(-50%);
            }
          }

          @keyframes arknozPartnerRight {
            from {
              transform: translateX(-50%);
            }

            to {
              transform: translateX(0%);
            }
          }

          .arknoz-partner-track-left {
            animation:
              arknozPartnerLeft
              34s
              linear
              infinite;
          }

          .arknoz-partner-track-right {
            animation:
              arknozPartnerRight
              36s
              linear
              infinite;
          }

          .arknoz-partner-track-left:hover,
          .arknoz-partner-track-right:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .arknoz-partner-track-left,
            .arknoz-partner-track-right {
              animation: none;
            }
          }
        `}</style>

        <div
          className="
            mx-auto
            max-w-[1780px]
            overflow-hidden
            rounded-[34px]
            border
            border-slate-200
            bg-[#0b3446]
            shadow-[0_24px_70px_rgba(15,23,42,0.16)]
          "
        >
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
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-cyan-200/80
                "
              >
                ARKNOZ PARTNERS
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                  text-white
                  sm:text-3xl
                "
              >
                Partner ecosystem across the Built World.
              </h2>
            </div>

            <p
              className="
                hidden
                max-w-md
                text-right
                text-xs
                leading-5
                text-white/55
                md:block
              "
            >
              Partner categories shown here.
              Verified partner identities will appear when approved.
            </p>
          </div>

          <div
            className="
              border-y
              border-white/10
              py-5
            "
          >
            {[
              [
                "Knowledge Partner",
                "Learning Partner",
                "Studio Partner",
                "Organisation Partner",
                "Research Partner",
                "City Partner",
              ],
              [
                "Innovation Partner",
                "Product Partner",
                "Project Partner",
                "Network Partner",
                "Community Partner",
                "Technology Partner",
              ],
              [
                "Regional Partner",
                "University Partner",
                "Institutional Partner",
                "Industry Partner",
                "Opportunity Partner",
                "Media Partner",
              ],
            ].map((row, rowIndex) => (
              <div
                key={`arknoz-partner-row-${rowIndex}`}
                className="
                  relative
                  overflow-hidden
                  py-2
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    z-10
                    w-16
                    bg-gradient-to-r
                    from-[#0b3446]
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
                    z-10
                    w-16
                    bg-gradient-to-l
                    from-[#0b3446]
                    to-transparent
                    sm:w-24
                  "
                />

                <div
                  className={
                    rowIndex % 2 === 0
                      ? "arknoz-partner-track-left flex w-max gap-3"
                      : "arknoz-partner-track-right flex w-max gap-3"
                  }
                >
                  {[...row, ...row].map((label, index) => (
                    <div
                      key={`arknoz-partner-${rowIndex}-${index}-${label}`}

                      aria-label="Arknoz partner category"
                      className="
                        group
                        inline-flex cursor-default
                        h-14
                        min-w-[188px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/14
                        bg-white/[0.06]
                        px-6
                        text-center
                        transition
                        duration-300








                      "
                    >
                      <span
                        className="
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-white/88
                        "
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className="
              flex
              min-h-[76px]
              items-center
              justify-end
              px-7
              sm:px-9
              lg:px-10
            "
          >
            <div

              className="
                group
                inline-flex cursor-default
                items-center
                gap-3
                text-sm
                font-semibold
                text-cyan-100
              "
            >
              Partner profiles will be added later

            </div>
          </div>
        </div>
      </section>


<section
        data-home-master="outcomes"
        className="bg-[#eef3f6] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-[1640px]">

          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
            WHAT NEXT?
          </p>

          <h2 className="mt-5 max-w-[13ch] text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Learn. Collaborate. Act.
          </h2>


          <div className="mt-12 grid gap-4 lg:grid-cols-3">

            <div className="rounded-[30px] border border-slate-200 bg-white p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
                LEARN
              </p>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                Build understanding.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Research, publications, standards, case studies,
                methods, courses and professional development.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/knowledge"
                  className="text-sm font-semibold text-teal-800"
                >
                  Knowledge â†’
                </Link>

                <Link
                  href="/learning"
                  className="text-sm font-semibold text-teal-800"
                >
                  Learning â†’
                </Link>
              </div>
            </div>


            <div className="rounded-[30px] border border-slate-200 bg-white p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
                COLLABORATE
              </p>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                Work through connections.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Find relevant members, organisations,
                contributors and professional collaboration pathways.
              </p>

              <Link
                href="/community"
                className="mt-8 inline-flex text-sm font-semibold text-teal-800"
              >
                Explore Community →
              </Link>
            </div>


            <div className="rounded-[30px] border border-slate-200 bg-white p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
                ACT
              </p>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                Find what comes next.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Jobs, competitions, tenders, funding,
                events, participation and other opportunities.
              </p>

              <Link
                href="/opportunities"
                className="mt-8 inline-flex text-sm font-semibold text-teal-800"
              >
                Find Opportunities â†’
              </Link>
            </div>

          </div>
        </div>
      </section>



      {/* =========================================================
          11 â€” YOUR ARKNOZ
          ========================================================= */}

      <section
        data-home-master="your-arknoz"
        className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1640px] gap-10 overflow-hidden rounded-[34px] bg-[#0a3041] p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/65">
              YOUR ARKNOZ
            </p>

            <h2 className="mt-5 max-w-[18ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
              Discover freely. Continue when it matters to you.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
              Save what matters, return to useful subjects,
              participate in the network and continue your
              Built World journey.
            </p>
          </div>


          <div className="flex flex-wrap gap-3 lg:justify-end">

            <Link
              href="/join"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              Create Arknoz ID
            </Link>

            <Link
              href="/explore"
              className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white"
            >
              Keep Exploring
            </Link>

          </div>
        </div>
      </section>



    </div>
  );
}
