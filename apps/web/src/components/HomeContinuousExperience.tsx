"use client";

import {
  isGenericPortalImage,
  resolvePortalImage,
} from "@/lib/portal-image";
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
  images?: string[];
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
    !isGenericPortalImage(src)
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
      →
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

  const [
    quickViewItem,
    setQuickViewItem,
  ] =
    useState<HeroFeature | null>(
      null
    );

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

  // ARKNOZ MAIN FEATURE AUTO ROTATION
  useEffect(() => {
    if (featuredItems.length <= 1) {
      return;
    }

    const timer = window.setInterval(
      () => {
        chooseNextFeaturedForSlot(0);
      },
      15000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    chooseNextFeaturedForSlot,
    featuredItems.length,
  ]);

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

  const quickViewRecord =
    quickViewItem
      ? records.find(
          (record) =>
            record.href ===
            quickViewItem.href
        )
      : undefined;


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
          "Materials · Systems",
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

      {/* ==============================================
          HOME HERO — PULSE FAMILY
         ============================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f8f8] text-slate-950">
        <style>{`
          @keyframes arknozHeroAccent {
            0%, 100% {
              transform: scaleX(0.28);
              opacity: 0.45;
            }

            50% {
              transform: scaleX(1);
              opacity: 1;
            }
          }

          @keyframes arknozHeroFloat {
            0%, 100% {
              transform: translate3d(0, 0, 0);
            }

            50% {
              transform: translate3d(0, -12px, 0);
            }
          }

          .arknoz-hero-accent {
            animation:
              arknozHeroAccent
              5s
              ease-in-out
              infinite;
          }

          .arknoz-hero-orb {
            animation:
              arknozHeroFloat
              8s
              ease-in-out
              infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .arknoz-hero-accent,
            .arknoz-hero-orb {
              animation: none;
            }
          }
        `}</style>

        <div
          aria-hidden="true"
          className="arknoz-hero-orb pointer-events-none absolute -left-24 top-10 h-[320px] w-[320px] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(166,31,70,0.11) 0%, rgba(166,31,70,0) 68%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[18%] top-[-120px] h-[420px] w-[420px] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(23,43,77,0.10) 0%, rgba(23,43,77,0) 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1720px] px-5 sm:px-8 lg:px-8">

          <div className="grid gap-8 pb-0 pt-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10 lg:pb-0 lg:pt-5 xl:min-h-[620px]">
            {/* LEFT — ARKNOZ INTRODUCTION */}
            <div className="relative flex flex-col lg:py-4">

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-5 -top-5 bottom-0 opacity-80"
                style={{
                  background:
                    "radial-gradient(circle at 8% 14%, rgba(166,31,70,0.07), transparent 34%), radial-gradient(circle at 74% 42%, rgba(23,43,77,0.06), transparent 40%)",
                }}
              />

              <div className="relative z-10">
                <div className="group">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    <h1 className="text-[52px] font-black leading-none tracking-[-0.055em] transition-transform duration-500 group-hover:-translate-y-[2px] sm:text-[60px] xl:text-[68px]">
                      <span className="text-[#172b4d]">Ark</span><span className="text-[#a61f46]">noz</span>
                    </h1>

                    <div className="hidden h-12 w-px bg-slate-300 sm:block" />

                    <p className="text-[17px] font-normal leading-tight text-slate-500 transition-colors duration-300 group-hover:text-slate-700 sm:text-[19px]">
                      The Built World. Connected.
                    </p>
                  </div>

                  <div className="mt-3 h-[2px] w-32 overflow-hidden bg-slate-200">
                    <div className="arknoz-hero-accent h-full origin-left bg-gradient-to-r from-[#172b4d] via-[#a61f46] to-red-400" />
                  </div>
                </div>

                <p className="mt-5 max-w-[570px] text-[15px] leading-7 text-slate-700">
                  Arknoz connects projects, products, knowledge, education,
                  people, organisations, places and opportunities across the
                  Built World.
                </p>

                <p className="mt-2 max-w-[550px] text-[12px] leading-5 text-slate-500">
                  Discover what is being built, understand how it connects,
                  learn from it and find where you can participate next.
                </p>

                <form
                  onSubmit={submitSearch}
                  className="arknoz-search-live group mt-6 flex max-w-[620px] items-center border border-slate-300 bg-white p-1 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-slate-400 hover:shadow-[0_14px_38px_rgba(15,23,42,0.09)] focus-within:-translate-y-[1px] focus-within:border-[#a61f46]/50 focus-within:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
                >
                  <input
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                    placeholder="Search project, product, architect, city, topic..."
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[13px] text-slate-950 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    className="bg-[#0a2230] px-6 py-3 text-[11px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#153e57] hover:shadow-[0_7px_18px_rgba(10,34,48,0.22)] active:translate-y-0"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <a
                    href="#how-arknoz-works"
                    className="group inline-flex items-center gap-2 text-[12px] font-semibold text-slate-950"
                  >
                    See how it works
                    <Arrow />
                  </a>

                  <Link
                    href="/explore"
                    className="group inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 transition hover:text-slate-950"
                  >
                    Open Explore
                    <Arrow />
                  </Link>
                </div>
              </div>

              <div className="mt-6 hidden border-t border-slate-200 pt-4 lg:block">
                <div className="grid grid-cols-3 gap-2">

                  <Link
                    href="/explore"
                    className="group border-l-2 border-transparent px-3 py-2 transition-all duration-300 hover:-translate-y-[2px] hover:border-[#a61f46] hover:bg-white hover:shadow-[0_8px_22px_rgba(15,23,42,0.07)]"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 transition group-hover:text-[#a61f46]">
                      Discover
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-slate-600 transition group-hover:text-slate-950">
                      Projects, products and places.
                    </p>
                  </Link>

                  <Link
                    href="/knowledge"
                    className="group border-l-2 border-transparent px-3 py-2 transition-all duration-300 hover:-translate-y-[2px] hover:border-[#172b4d] hover:bg-white hover:shadow-[0_8px_22px_rgba(15,23,42,0.07)]"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 transition group-hover:text-[#172b4d]">
                      Understand
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-slate-600 transition group-hover:text-slate-950">
                      Knowledge and learning.
                    </p>
                  </Link>

                  <Link
                    href="/opportunities"
                    className="group border-l-2 border-transparent px-3 py-2 transition-all duration-300 hover:-translate-y-[2px] hover:border-red-500 hover:bg-white hover:shadow-[0_8px_22px_rgba(15,23,42,0.07)]"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 transition group-hover:text-red-500">
                      Participate
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-slate-600 transition group-hover:text-slate-950">
                      People and opportunities.
                    </p>
                  </Link>

                </div>
              </div>

              {/* ARKNOZ MEDIA CAROUSEL — 3 VISIBLE */}
              <div className="arknoz-media-window relative mt-6 overflow-hidden border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.07)] transition-shadow duration-500 hover:shadow-[0_18px_42px_rgba(15,23,42,0.11)]">

                <style>{`
                  @keyframes arknozMediaRailLeft {
                    from {
                      transform: translateX(0);
                    }

                    to {
                      transform: translateX(-100%);
                    }
                  }

                  .arknoz-media-rail-track {
                    display: flex;
                    width: 100%;
                    animation:
                      arknozMediaRailLeft
                      20s
                      linear
                      infinite;
                  }

                  .arknoz-media-rail-track:hover {
                    animation-play-state: paused;
                  }
                  .arknoz-search-live {
                    position: relative;
                    overflow: hidden;
                  }

                  .arknoz-search-live::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 2px;
                    background:
                      linear-gradient(
                        90deg,
                        #172b4d 0%,
                        #a61f46 55%,
                        #ef4444 100%
                      );
                    transform: scaleX(0);
                    transform-origin: left center;
                    transition:
                      transform 380ms ease;
                  }

                  .arknoz-search-live:hover::after {
                    transform: scaleX(0.25);
                  }

                  .arknoz-search-live:focus-within::after {
                    transform: scaleX(1);
                  }

                  .arknoz-media-window::before,
                  .arknoz-media-window::after {
                    content: "";
                    position: absolute;
                    z-index: 20;
                    top: 0;
                    bottom: 0;
                    width: 42px;
                    pointer-events: none;
                  }

                  .arknoz-media-window::before {
                    left: 0;
                    background:
                      linear-gradient(
                        90deg,
                        rgba(247,248,248,0.96),
                        rgba(247,248,248,0)
                      );
                  }

                  .arknoz-media-window::after {
                    right: 0;
                    background:
                      linear-gradient(
                        270deg,
                        rgba(247,248,248,0.96),
                        rgba(247,248,248,0)
                      );
                  }

                  .arknoz-media-rail-track img {
                    transition:
                      transform 700ms ease,
                      filter 500ms ease;
                  }

                  .arknoz-media-rail-track article:hover img,
                  .arknoz-media-rail-track a:hover img {
                    transform: scale(1.045);
                    filter:
                      saturate(1.08)
                      contrast(1.03);
                  }

                  @media (prefers-reduced-motion: reduce) {
                    .arknoz-media-rail-track {
                      animation: none;
                    }
                  }
                `}</style>

                <div className="arknoz-media-rail-track">

                  {[0, 1].map((copyIndex) => (

                    <div
                      key={`arknoz-media-group-${copyIndex}`}
                      className="grid w-full shrink-0 grid-cols-3 gap-2 p-2"
                      aria-hidden={
                        copyIndex === 1
                          ? true
                          : undefined
                      }
                    >

                      {[
                        {
                          label: "PULSE",
                          sublabel: "LATEST MAGAZINE",
                          image: "/visuals/latest/magazine.png",
                          href: "/pulse?section=magazine",
                        },
                        {
                          label: "BOOKS",
                          sublabel: "ARKNOZ BOOKS",
                          image: "/visuals/latest/books.png",
                          href: "/pulse?section=books",
                        },
                        {
                          label: "VIDEO",
                          sublabel: "WATCH",
                          image: "/visuals/latest/video.png",
                          href: "/pulse?section=video",
                        },
                        {
                          label: "RESEARCH",
                          sublabel: "PUBLICATIONS",
                          image: "/visuals/latest/research.png",
                          href: "/pulse?section=research",
                        },
                        {
                          label: "LEARNING",
                          sublabel: "EDUCATION",
                          image: "/visuals/latest/education.png",
                          href: "/pulse?section=education",
                        },
                        {
                          label: "WORLD",
                          sublabel: "WORLD PULSE",
                          image: "/visuals/latest/world.png",
                          href: "/pulse?section=world",
                        },
                      ].map((mediaItem, index) => (

                        <Link
                          key={`${copyIndex}-${index}-${mediaItem.label}`}
                          href={mediaItem.href}
                          tabIndex={
                            copyIndex === 1
                              ? -1
                              : undefined
                          }
                          className="group relative h-[175px] min-w-0 overflow-hidden bg-[#071a2d]"
                        >

                          <img
                            src={mediaItem.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#04131d]/90 via-[#04131d]/10 to-transparent" />

                          <div className="absolute inset-x-0 bottom-0 p-3 text-white">

                            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/60">
                              {mediaItem.sublabel}
                            </p>

                            <p className="mt-1 text-[15px] font-black leading-none tracking-[-0.035em]">
                              {mediaItem.label}
                            </p>

                          </div>

                        </Link>

                      ))}

                    </div>

                  ))}

                </div>
              </div>
            </div>

            {/* RIGHT — FEATURED ON ARKNOZ */}
            <div className="min-w-0 border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

              <style>{`
                @keyframes arknozFeaturedSmallUp {
                  from {
                    transform: translateY(0);
                  }

                  to {
                    transform: translateY(-50%);
                  }
                }

                @keyframes arknozFeaturedGalleryFade {
                  0% {
                    opacity: 0;
                  }

                  4% {
                    opacity: 1;
                  }

                  28% {
                    opacity: 1;
                  }

                  32% {
                    opacity: 0;
                  }

                  100% {
                    opacity: 0;
                  }
                }

                .arknoz-featured-small-track {
                  animation:
                    arknozFeaturedSmallUp
                    18s
                    linear
                    infinite;
                }

                .arknoz-featured-small-track:hover {
                  animation-play-state: paused;
                }

                @media (prefers-reduced-motion: reduce) {
                  .arknoz-featured-small-track {
                    animation: none;
                  }
                }
              `}</style>

              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-500">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-red-400 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>

                    Featured
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#0a2230]">
                    On Arknoz
                  </h2>
                </div>

                <Link
                  href="/explore"
                  className="text-[11px] font-semibold text-slate-500 transition hover:text-slate-950"
                >
                  Explore all →
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-[1.3fr_0.7fr] md:h-[570px] xl:h-[590px]">

                {/* BIG PROJECT — SINGLE PANEL WITH AUTO-LOOPING PROJECT MEDIA */}
                {featuredCards[0] ? (() => {
                  const item = featuredCards[0];

                  const linkedRecord =
                    records.find(
                      (record) =>
                        record.href === item.href
                    );

                  const fallbackImageSrc =
                    resolvePortalImage({
                      src: hasImage(item.image)
                        ? item.image
                        : heroRecord?.image,
                      kind: item.type,
                    });

                  const galleryImages =
                    (item.images ?? [])
                      .filter(
                        (src) =>
                          hasImage(src)
                      )
                      .slice(0, 6);

                  if (galleryImages.length === 0) {
                    galleryImages.push(
                      fallbackImageSrc
                    );
                  }

                  const loopImageCount =
                    galleryImages.length;

                  const loopDurationSeconds =
                    Math.max(
                      loopImageCount * 3.6,
                      3.6
                    );

                  return (
                    <article className="group relative min-h-[390px] overflow-hidden bg-[#0a2230] shadow-[0_18px_50px_rgba(7,27,49,0.16)] ring-1 ring-slate-900/5 transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_26px_60px_rgba(7,27,49,0.22)] md:h-full md:min-h-0">

                      <Link
                        href={item.href}
                        className="absolute inset-0 z-10 block"
                      >

                        {galleryImages.map(
                          (
                            src,
                            index
                          ) => (
                            <img
                              key={`${item.href}-loop-${index}`}
                              src={src}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                              style={
                                loopImageCount > 1
                                  ? {
                                      opacity: 0,
                                      animationName:
                                        "arknozFeaturedGalleryFade",
                                      animationDuration: `${loopDurationSeconds}s`,
                                      animationTimingFunction: "linear",
                                      animationIterationCount: "infinite",
                                      animationDelay: `${index * 3.6}s`,
                                    }
                                  : {
                                      opacity: 1,
                                    }
                              }
                            />
                          )
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#04131d]/95 via-[#061722]/20 to-black/5" />

                        <div className="absolute left-5 top-5 z-10">
                          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/85">
                            {item.type}
                          </p>
                        </div>

                        <div className="absolute right-5 top-5 z-20 flex flex-col items-end gap-2">
                          <div className="rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[8px] font-semibold tracking-[0.12em] text-white/80 backdrop-blur-md">
                            {String(
                              featuredSelection[0] + 1
                            ).padStart(2, "0")}
                            {" / "}
                            {String(
                              featuredItems.length
                            ).padStart(2, "0")}
                          </div>

                          {loopImageCount > 1 ? (
                            <div className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-white/70 backdrop-blur-md">
                              Auto Loop · {loopImageCount} Media
                            </div>
                          ) : null}
                        </div>

                        <div className="absolute inset-x-0 bottom-12 z-10 p-6 pr-16 xl:p-7 xl:pr-20">

                          {item.meta ? (
                            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/60">
                              {item.meta}
                            </p>
                          ) : null}

                          <h3 className="mt-2 max-w-[16ch] text-3xl font-semibold leading-[1] tracking-[-0.045em] text-white xl:text-4xl">
                            {item.title}
                          </h3>

                          {linkedRecord?.summary ? (
                            <p className="mt-4 line-clamp-2 max-w-[46ch] text-[11px] leading-5 text-white/65">
                              {linkedRecord.summary}
                            </p>
                          ) : null}

                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setQuickViewItem(item)
                        }
                        className="absolute right-5 top-20 z-30 translate-y-1 border border-white/30 bg-black/40 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white opacity-0 backdrop-blur-md transition duration-200 hover:bg-white hover:text-slate-950 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        Quick view
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          chooseNextFeaturedForSlot(0)
                        }
                        aria-label="Show next featured project"
                        className="absolute bottom-10 right-5 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-950"
                      >
                        →
                      </button>

                    </article>
                  );
                })() : null}


{/* RIGHT — P02 / P03 / P04 MOVE BOTTOM TO TOP */}
                <div className="relative min-h-[570px] overflow-hidden md:min-h-0">

                  <div className="arknoz-featured-small-track">

                    {[0, 1].map((copyIndex) => (
                      <div
                        key={`small-featured-copy-${copyIndex}`}
                        className="flex h-[570px] flex-col gap-3 xl:h-[590px]"
                        aria-hidden={
                          copyIndex === 1
                            ? true
                            : undefined
                        }
                      >

                        {featuredItems
                          .slice(1, 4)
                          .map((item, index) => {

                            const imageSrc =
                              resolvePortalImage({
                                src: item.image,
                                kind: item.type,
                              });

                            return (
                              <article
                                key={`${copyIndex}-${item.href}-${index}`}
                                className="group relative min-h-0 flex-1 overflow-hidden bg-[#0a2230] shadow-[0_8px_24px_rgba(7,27,49,0.10)] transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_14px_32px_rgba(7,27,49,0.18)]"
                              >
                                <Link
                                  href={item.href}
                                  tabIndex={
                                    copyIndex === 1
                                      ? -1
                                      : undefined
                                  }
                                  className="absolute inset-0 block"
                                >
                                  <img
                                    src={imageSrc}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                  />

                                  <div className="absolute inset-0 bg-gradient-to-t from-[#04131d]/95 via-[#061722]/15 to-black/5" />

                                  <div className="absolute left-4 top-4">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-white/85">
                                      {item.type}
                                    </p>
                                  </div>

                                  <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/30 px-2 py-1 text-[8px] font-semibold tracking-[0.1em] text-white/80 backdrop-blur-md">
                                    {String(
                                      index + 2
                                    ).padStart(2, "0")}
                                    {" / 04"}
                                  </div>

                                  <div className="absolute inset-x-0 bottom-0 p-4 pr-12">

                                    {item.meta ? (
                                      <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-white/60">
                                        {item.meta}
                                      </p>
                                    ) : null}

                                    <h3 className="mt-1.5 line-clamp-2 text-[18px] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
                                      {item.title}
                                    </h3>

                                  </div>

                                  <span className="absolute bottom-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/30 text-sm text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-[#0a2230]">
                                    →
                                  </span>

                                </Link>
                              </article>
                            );
                          })}

                      </div>
                    ))}

                  </div>
                </div>

              </div>
              {/* ARKNOZ BRANDING PANEL */}
              <div
                className="
                  group
                  relative
                  mt-6
                  h-[220px]
                  w-full
                  overflow-hidden
                  border
                  border-slate-200
                  bg-[#071a2d]
                  shadow-[0_18px_45px_rgba(15,23,42,0.10)]
                  xl:h-[240px]
                "
              >
                <img
                  src="/visuals/latest/world.png"
                  alt=""
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-[1600ms]
                    ease-out
                    group-hover:scale-[1.035]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#061827]/90
                    via-[#071a2d]/50
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-24
                    bg-gradient-to-t
                    from-black/45
                    to-transparent
                  "
                />

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-full
                    items-end
                    justify-between
                    p-7
                    sm:p-8
                  "
                >
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.24em]
                        text-white/65
                      "
                    >
                      Arknoz
                    </p>

                    <h3
                      className="
                        mt-2
                        max-w-[500px]
                        text-[28px]
                        font-semibold
                        leading-none
                        tracking-[-0.045em]
                        text-white
                        sm:text-[32px]
                      "
                    >
                      The Digital Built World
                    </h3>
                  </div>

                  <span
                    className="
                      hidden
                      border-l
                      border-white/30
                      pl-5
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-white/55
                      md:block
                    "
                  >
                    Arknoz
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {quickViewItem ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[90] bg-slate-950/35 backdrop-blur-[2px]"
          onClick={() =>
            setQuickViewItem(null)
          }
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Featured item quick view"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.20)]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">
                  Quick View
                </p>

                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {quickViewItem.type}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setQuickViewItem(
                    null
                  )
                }
                aria-label="Close quick view"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
              >
                ×
              </button>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={resolvePortalImage({
                  src: quickViewItem.image,
                  kind: quickViewItem.type,
                })}
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col px-7 py-7">
              {quickViewItem.meta ? (
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {quickViewItem.meta}
                </p>
              ) : null}

              <h2 className="mt-3 text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#0a2230]">
                {quickViewItem.title}
              </h2>

              {quickViewRecord?.geography ? (
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-500">
                  {
                    quickViewRecord.geography
                  }
                </p>
              ) : null}

              {quickViewRecord?.summary ? (
                <p className="mt-5 text-[14px] leading-7 text-slate-600">
                  {
                    quickViewRecord.summary
                  }
                </p>
              ) : (
                <p className="mt-5 text-[14px] leading-7 text-slate-500">
                  Explore this record and its
                  connections across Arknoz.
                </p>
              )}

              <div className="mt-auto border-t border-slate-200 pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={
                      quickViewItem.href
                    }
                    className="inline-flex items-center gap-3 bg-[#0a2230] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#153e57]"
                  >
                    Open full page
                    <span aria-hidden="true">
                      →
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setQuickViewItem(
                        null
                      )
                    }
                    className="px-4 py-3 text-[12px] font-semibold text-slate-500 transition hover:text-slate-950"
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

            {/* ARKNOZ_NOW_RENDER_V1 */}

      <section
        className="
          border-b
          border-slate-200
          bg-[#f5f7fb]
          px-5
          py-4
          sm:px-8
          lg:px-8
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
          .arknoz-now-track article,
          .arknoz-now-track a {
            transition:
              transform 400ms ease,
              box-shadow 400ms ease;
          }

          .arknoz-now-track img {
            transition:
              transform 800ms ease,
              filter 500ms ease;
          }

          .arknoz-now-track article:hover,
          .arknoz-now-track a:hover {
            transform: translateY(-3px);
          }

          .arknoz-now-track article:hover img,
          .arknoz-now-track a:hover img {
            transform: scale(1.035);
            filter:
              saturate(1.08)
              contrast(1.04);
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
                <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
                  Arknoz Now
                </p>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Live
                </span>
              </div>

              <h2 className="mt-2 text-[29px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#0a2230] sm:text-[34px]">
                Moving through the Built World.
              </h2>

              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                Projects, products, knowledge, learning, people and opportunities across Arknoz.
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
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-white/75
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
              min-h-[58px]
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
                text-[11px]
                font-bold
                text-[#0a2230]
                transition
                hover:text-[#a61f46]
              "
            >
              Explore more  →
            </Link>
          </div>
        </div>
      </section>




      {/* ======================================================
          HOME · THE BUILT WORLD ON ARKNOZ
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
            max-w-[1720px]
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
        <div className="mx-auto max-w-[1720px]">

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
              className="group relative min-h-[330px] overflow-hidden rounded-[10px] bg-[#092b3b] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-9"
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
                  Enter Explore →
                </p>
              </div>
            </Link>


            <Link
              href="/community"
              className="group min-h-[330px] rounded-[10px] border border-slate-200 bg-[#f4f7f8] p-8 transition hover:-translate-y-1 hover:shadow-xl"
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
                Explore Community →
              </p>
            </Link>


            <Link
              href="/intelligence"
              className="group min-h-[330px] rounded-[10px] border border-slate-200 bg-[#f4f7f8] p-8 transition hover:-translate-y-1 hover:shadow-xl"
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
                Open Intelligence →
              </p>
            </Link>

          </div>
        </div>
      </section>

<section
        data-home-master="arknoz-curated"
        className="
          relative
          z-30
          border-b
          border-slate-200
          bg-[#f5f7fb]
          px-5
          py-4
          sm:px-8
          lg:px-8
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
                <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
                  Arknoz Curated
                </p>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span className="text-[10px] font-semibold text-slate-500">
                  Selected
                </span>
              </div>

              <h2 className="mt-2 text-[29px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#0a2230] sm:text-[34px]">
                Editor&apos;s Choice. Across the Built World.
              </h2>

              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                Selected projects, products, knowledge, people, organisations, places and opportunities.
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
                      "EDITOR'S CHOICE · " +
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
                      "FEATURED · " +
                      item.type,
                  })
                ),

                ...nowRailItems.map(
                  (item) => ({
                    ...item,
                    type:
                      "EDITOR'S CHOICE · " +
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
                      "FEATURED · " +
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
                        w-[285px]
                        shrink-0
                        overflow-hidden
                        rounded-[4px]
                        border
                        border-slate-200
                        bg-[#17384a]
                        shadow-[0_8px_24px_rgba(15,23,42,0.08)]
                        transition
                        duration-500
                        hover:-translate-y-[3px]
                        hover:shadow-[0_16px_34px_rgba(15,23,42,0.14)]
                        sm:w-[300px]
                        2xl:h-[265px]
                        2xl:w-[320px]
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
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-white/70
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
              Explore more  →
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
        data-home-master="outcomes"
        className="
          border-b
          border-slate-200
          bg-[#f5f7fb]
          px-5
          py-8
          sm:px-8
          lg:px-8
          lg:py-10
        "
      >
        <div className="mx-auto max-w-[1720px]">

          {/* HEADER */}
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
                  What next?
                </p>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <p className="text-[10px] font-semibold text-slate-400">
                  Learn · Collaborate · Act
                </p>
              </div>

              <h2 className="mt-2 text-[30px] font-semibold leading-[1] tracking-[-0.045em] text-[#0a2230] sm:text-[36px]">
                Move through the Built World.
              </h2>
            </div>

            <p className="max-w-[560px] text-[12px] leading-5 text-slate-500 lg:text-right">
              Build knowledge, connect with people and organisations, and find
              opportunities to participate.
            </p>
          </div>


          {/* THREE VISUAL PATHWAYS */}
          <div className="mt-5 grid gap-3 lg:grid-cols-3">

            {/* LEARN */}
            <article className="group relative min-h-[270px] overflow-hidden rounded-[8px] border border-slate-200 bg-[#081f2d] shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]">

              <img
                src="/visuals/portal/knowledge.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#03131d]/95 via-[#061722]/42 to-black/10" />

              <div className="relative z-10 flex min-h-[270px] flex-col justify-between p-6">

                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-white/75">
                    Learn
                  </p>

                  <span className="text-[9px] font-semibold text-white/40">
                    01
                  </span>
                </div>

                <div>
                  <h3 className="text-[26px] font-semibold leading-[1] tracking-[-0.04em] text-white">
                    Build understanding.
                  </h3>

                  <p className="mt-2 max-w-[42ch] text-[11px] leading-5 text-white/60">
                    Research, cases, references, learning and professional development.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/knowledge"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Knowledge →
                    </Link>

                    <Link
                      href="/learning"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Learning →
                    </Link>
                  </div>
                </div>

              </div>
            </article>


            {/* COLLABORATE */}
            <article className="group relative min-h-[270px] overflow-hidden rounded-[8px] border border-slate-200 bg-[#081f2d] shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]">

              <img
                src="/visuals/portal/people.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#03131d]/95 via-[#061722]/42 to-black/10" />

              <div className="relative z-10 flex min-h-[270px] flex-col justify-between p-6">

                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-white/75">
                    Collaborate
                  </p>

                  <span className="text-[9px] font-semibold text-white/40">
                    02
                  </span>
                </div>

                <div>
                  <h3 className="text-[26px] font-semibold leading-[1] tracking-[-0.04em] text-white">
                    Work through connections.
                  </h3>

                  <p className="mt-2 max-w-[42ch] text-[11px] leading-5 text-white/60">
                    Find members, professionals, organisations and collaboration pathways.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/community"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Community →
                    </Link>

                    <Link
                      href="/people"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      People →
                    </Link>

                    <Link
                      href="/organisations"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Organisations →
                    </Link>
                  </div>
                </div>

              </div>
            </article>


            {/* ACT */}
            <article className="group relative min-h-[270px] overflow-hidden rounded-[8px] border border-slate-200 bg-[#081f2d] shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]">

              <img
                src="/visuals/portal/opportunity.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#03131d]/95 via-[#061722]/42 to-black/10" />

              <div className="relative z-10 flex min-h-[270px] flex-col justify-between p-6">

                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-white/75">
                    Act
                  </p>

                  <span className="text-[9px] font-semibold text-white/40">
                    03
                  </span>
                </div>

                <div>
                  <h3 className="text-[26px] font-semibold leading-[1] tracking-[-0.04em] text-white">
                    Find what comes next.
                  </h3>

                  <p className="mt-2 max-w-[42ch] text-[11px] leading-5 text-white/60">
                    Jobs, competitions, funding, events and other opportunities.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/opportunities"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Opportunities →
                    </Link>

                    <Link
                      href="/opportunities?type=jobs-careers"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Jobs →
                    </Link>

                    <Link
                      href="/opportunities?type=competitions-awards"
                      className="border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white hover:text-[#0a2230]"
                    >
                      Competitions →
                    </Link>
                  </div>
                </div>

              </div>
            </article>

          </div>
        </div>
      </section>



      {/* =========================================================
          11 â€” YOUR ARKNOZ
          ========================================================= */}
</div>
  );
}
