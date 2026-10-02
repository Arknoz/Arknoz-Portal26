"use client";

import Link from "next/link";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  arknozExploreSections,
  buildArknozSectionHref,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";

import {
  getArknozVisualTheme,
} from "@/lib/arknoz-visual-theme";


type ExploreMode =
  | "worlds"
  | "intent"
  | "place"
  | "connections";


function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="
        transition-transform
        duration-200
        group-hover:translate-x-1
      "
    >
      →
    </span>
  );
}


const worlds =
  arknozExploreSections.map(
    (section) => {

      const theme =
        getArknozVisualTheme(
          section.key
        );

      return {
        key:
          section.key,

        title:
          section.title,

        short:
          section.short,

        description:
          section.description,

        href:
          section.href,

        paid:
          isPaidArknozSection(
            section.key
          ),

        gradient:
          theme.heroGradient,

        accent:
          theme.textAccent,

        subsections:
          section.subsections.map(
            (subsection) => ({
              label:
                subsection.label,

              href:
                buildArknozSectionHref(
                  section.key,
                  {
                    subsection:
                      subsection.slug,
                  }
                ),
            })
          ),
      };
    }
  );


const intents = [
  {
    label:
      "Discover projects",
    title:
      "See what is being built.",
    description:
      "Buildings, interiors, landscapes, planning, infrastructure and development.",
    href:
      "/projects",
  },
  {
    label:
      "Find products",
    title:
      "Find materials, systems and equipment.",
    description:
      "Move through products, components, building systems and technology.",
    href:
      "/products",
  },
  {
    label:
      "Understand",
    title:
      "Move from information to knowledge.",
    description:
      "Research, publications, cases, standards, methods and ideas.",
    href:
      "/knowledge",
  },
  {
    label:
      "Learn",
    title:
      "Build capability.",
    description:
      "Courses, programmes, professional development and technical training.",
    href:
      "/learning",
  },
  {
    label:
      "Find opportunities",
    title:
      "Find your next opportunity.",
    description:
      "Jobs, competitions, tenders, grants, events and open calls.",
    href:
      "/opportunities",
  },
  {
    label:
      "Participate",
    title:
      "Become part of Arknoz.",
    description:
      "Community, collaboration, contribution, discussions and chapters.",
    href:
      "/community",
  },
] as const;


const geographyLevels = [
  {
    label:
      "Global",
    description:
      "The complete Arknoz Built World.",
  },
  {
    label:
      "Continent",
    description:
      "Explore large geographic contexts.",
  },
  {
    label:
      "Country",
    description:
      "Move into national relevance.",
  },
  {
    label:
      "Region",
    description:
      "Explore regional context.",
  },
  {
    label:
      "City",
    description:
      "Discover the local Built World.",
  },
] as const;


const places = [
  ["India", "/global/india"],
  ["Kenya", "/global/kenya"],
  ["Singapore", "/global/singapore"],
  ["UAE", "/global/uae"],
  ["Japan", "/global/japan"],
  ["Mumbai", "/global/mumbai"],
  ["Nairobi", "/global/nairobi"],
] as const;


const connections = [
  {
    label:
      "Projects",
    description:
      "Built work and project context.",
    href:
      "/projects",
  },
  {
    label:
      "Products",
    description:
      "Materials, systems and equipment.",
    href:
      "/products",
  },
  {
    label:
      "Knowledge",
    description:
      "Research, evidence and methods.",
    href:
      "/knowledge",
  },
  {
    label:
      "People",
    description:
      "People behind the Built World.",
    href:
      "/people",
  },
  {
    label:
      "Organisations",
    description:
      "Practices, companies and institutions.",
    href:
      "/organisations",
  },
  {
    label:
      "Places",
    description:
      "Geographic and local context.",
    href:
      "/places",
  },
  {
    label:
      "Opportunities",
    description:
      "Ways to work and participate.",
    href:
      "/opportunities",
  },
] as const;


const modes: {
  key: ExploreMode;
  number: string;
  label: string;
  description: string;
}[] = [
  {
    key:
      "worlds",
    number:
      "01",
    label:
      "Worlds",
    description:
      "Navigate Arknoz structure.",
  },
  {
    key:
      "intent",
    number:
      "02",
    label:
      "Intent",
    description:
      "Start with what you want.",
  },
  {
    key:
      "place",
    number:
      "03",
    label:
      "Place",
    description:
      "Explore geographically.",
  },
  {
    key:
      "connections",
    number:
      "04",
    label:
      "Connections",
    description:
      "Follow related dimensions.",
  },
];


export default function ExploreInteractiveJourney() {

  const router =
    useRouter();

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    mode,
    setMode,
  ] =
    useState<ExploreMode>(
      "worlds"
    );

  const [
    worldIndex,
    setWorldIndex,
  ] =
    useState(0);

  const [
    intentIndex,
    setIntentIndex,
  ] =
    useState(0);

  const [
    geographyIndex,
    setGeographyIndex,
  ] =
    useState(0);

  const [
    connectionIndex,
    setConnectionIndex,
  ] =
    useState(0);


  const activeWorld =
    worlds[
      worldIndex
    ] ??
    worlds[0];

  const activeIntent =
    intents[
      intentIndex
    ];

  const activeGeography =
    geographyLevels[
      geographyIndex
    ];

  const activeConnection =
    connections[
      connectionIndex
    ];


  const context =
    useMemo(
      () => {

        if (
          mode === "intent"
        ) {
          return {
            eyebrow:
              "INTENT",
            title:
              activeIntent.title,
            description:
              activeIntent.description,
            href:
              activeIntent.href,
            cta:
              "Start here",
          };
        }

        if (
          mode === "place"
        ) {
          return {
            eyebrow:
              "GEOGRAPHY",
            title:
              activeGeography.label,
            description:
              activeGeography.description,
            href:
              "/global",
            cta:
              "Open Global",
          };
        }

        if (
          mode ===
          "connections"
        ) {
          return {
            eyebrow:
              "CONNECTION",
            title:
              activeConnection.label,
            description:
              activeConnection.description,
            href:
              activeConnection.href,
            cta:
              "Open connection",
          };
        }

        return {
          eyebrow:
            activeWorld.paid
              ? "ARKNOZ WORLD · PRO"
              : "ARKNOZ WORLD",

          title:
            activeWorld.title,

          description:
            activeWorld.description,

          href:
            activeWorld.href,

          cta:
            `Enter ${activeWorld.title}`,
        };
      },
      [
        mode,
        activeIntent,
        activeGeography,
        activeConnection,
        activeWorld,
      ]
    );


  function submitSearch(
    event: FormEvent
  ) {

    event.preventDefault();

    const value =
      query.trim();

    if (!value) {
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        value
      )}`
    );
  }


  return (
    <section
      id="arknoz-worlds"
      data-explore-workbench="true"
      className="
        border-t
        border-slate-200
        bg-[#f5f7fb]
        text-slate-950
      "
    >

      <div
        className="
          mx-auto
          max-w-[1720px]
          px-4
          py-5
          sm:px-6
          lg:px-8
          lg:py-7
        "
      >

        {/* ==================================================
            WORKBENCH HEADER
           ================================================== */}

        <div
          className="
            mb-5
            grid
            gap-4
            lg:grid-cols-[1fr_1.25fr]
            lg:items-end
          "
        >

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-red-500
              "
            >
              Arknoz Explore
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-semibold
                tracking-[-0.04em]
                sm:text-4xl
              "
            >
              Navigate the Built World.
            </h2>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Use Arknoz as a discovery workspace:
              search, change lens, inspect context and
              move directly into a world or subsection.
            </p>

          </div>


          <form
            onSubmit={
              submitSearch
            }
            className="
              flex
              items-center
              overflow-hidden
              rounded-[8px]
              border
              border-slate-200
              bg-white
              p-1.5
              shadow-sm
            "
          >

            <span
              aria-hidden="true"
              className="
                ml-3
                text-slate-400
              "
            >
              ⌕
            </span>

            <input
              value={query}
              onChange={
                (event) =>
                  setQuery(
                    event.target.value
                  )
              }
              placeholder="Search projects, products, knowledge, people, places..."
              className="
                min-w-0
                flex-1
                bg-transparent
                px-3
                py-3
                text-sm
                outline-none
                placeholder:text-slate-400
              "
            />

            <button
              type="submit"
              className="
                rounded-[6px]
                bg-[#081f2d]
                px-5
                py-3
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#102f42]
              "
            >
              Search
            </button>

          </form>

        </div>


        {/* ==================================================
            MAIN WORKBENCH
           ================================================== */}

        <div
          className="
            grid
            gap-4
            lg:min-h-[680px]
            lg:grid-cols-[220px_minmax(0,1fr)_310px]
          "
        >

          {/* LEFT MODE RAIL */}

          <aside
            className="
              rounded-[8px]
              border
              border-slate-200
              bg-[#081f2d]
              p-3
              text-white
              shadow-sm
            "
          >

            <p
              className="
                px-3
                pt-2
                text-[9px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-red-300
              "
            >
              Discovery lens
            </p>


            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2
                lg:grid-cols-1
              "
            >

              {modes.map(
                (item) => (

                  <button
                    key={
                      item.key
                    }
                    type="button"
                    onClick={() =>
                      setMode(
                        item.key
                      )
                    }
                    className={`
                      rounded-[6px]
                      border
                      p-4
                      text-left
                      transition
                      ${
                        mode ===
                        item.key
                          ? "border-white bg-white text-slate-950"
                          : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.09] hover:text-white"
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        {item.label}
                      </span>

                      <span
                        className="
                          text-[9px]
                          font-bold
                          tracking-[0.15em]
                          opacity-40
                        "
                      >
                        {item.number}
                      </span>
                    </div>

                    <p
                      className="
                        mt-2
                        text-[10px]
                        leading-4
                        opacity-50
                      "
                    >
                      {item.description}
                    </p>

                  </button>

                )
              )}

            </div>


            <div
              className="
                mt-5
                border-t
                border-white/10
                pt-4
              "
            >

              {[
                [
                  "Featured",
                  "/featured",
                ],
                [
                  "Global",
                  "/global",
                ],
                [
                  "Search",
                  "/search",
                ],
              ].map(
                (
                  [
                    label,
                    href,
                  ]
                ) => (

                  <Link
                    key={href}
                    href={href}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      rounded-[4px]
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-white/55
                      transition
                      hover:bg-white/[0.06]
                      hover:text-white
                    "
                  >
                    {label}
                    <Arrow />
                  </Link>

                )
              )}

            </div>

          </aside>


          {/* ==================================================
              CENTRAL CANVAS
             ================================================== */}

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-[8px]
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            {/* ----------------------------------------------
                WORLDS
               ---------------------------------------------- */}

            {mode ===
            "worlds" ? (

              <div
                className="
                  flex
                  min-h-full
                  flex-col
                "
              >

                <div
                  className="
                    border-b
                    border-slate-200
                    p-5
                    sm:p-6
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-end
                      sm:justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.17em]
                          text-slate-400
                        "
                      >
                        ALL ARKNOZ WORLDS
                      </p>

                      <h3
                        className="
                          mt-2
                          text-2xl
                          font-semibold
                          tracking-[-0.035em]
                        "
                      >
                        Select a world
                      </h3>

                    </div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      {worlds.length} discovery environments
                    </p>

                  </div>


                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-2
                      md:grid-cols-3
                      xl:grid-cols-4
                    "
                  >

                    {worlds.map(
                      (
                        world,
                        index
                      ) => (

                        <button
                          key={
                            world.key
                          }
                          type="button"
                          onClick={() =>
                            setWorldIndex(
                              index
                            )
                          }
                          className={`
                            min-h-[78px]
                            rounded-[8px]
                            border
                            px-4
                            py-3
                            text-left
                            transition
                            ${
                              worldIndex ===
                              index
                                ? "border-[#0a2230] bg-[#0a2230] text-white"
                                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >

                            <span
                              className="
                                text-xs
                                font-semibold
                              "
                            >
                              {world.title}
                            </span>

                            {world.paid ? (
                              <span
                                className="
                                  text-[7px]
                                  font-bold
                                  tracking-[0.14em]
                                  opacity-50
                                "
                              >
                                PRO
                              </span>
                            ) : null}

                          </div>

                          <p
                            className="
                              mt-2
                              line-clamp-2
                              text-[9px]
                              leading-4
                              opacity-50
                            "
                          >
                            {world.short}
                          </p>

                        </button>

                      )
                    )}

                  </div>

                </div>


                <div
                  className="
                    grid
                    flex-1
                    lg:grid-cols-[1fr_.82fr]
                  "
                >

                  <div
                    className="
                      relative
                      min-h-[360px]
                      overflow-hidden
                      p-6
                      text-white
                      sm:p-8
                    "
                    style={{ backgroundColor: "#0a2230" }}
                  >

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-[0.06]
                        [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)]
                        [background-size:46px_46px]
                      "
                    />

                    <div
                      className="
                        relative
                        flex
                        h-full
                        flex-col
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-red-300
                          "
                        >
                          ACTIVE WORLD
                        </p>

                        <h4
                          className="
                            mt-5
                            max-w-[11ch]
                            text-[34px]
                            font-semibold
                            tracking-[-0.05em]
                            sm:text-[40px]
                          "
                        >
                          {activeWorld.title}
                        </h4>

                        <p
                          className="
                            mt-5
                            max-w-xl
                            text-sm
                            leading-7
                            text-white/68
                          "
                        >
                          {activeWorld.description}
                        </p>

                      </div>


                      <Link
                        href={
                          activeWorld.href
                        }
                        className="
                          group
                          mt-8
                          inline-flex
                          w-fit
                          items-center
                          gap-2
                          rounded-[8px]
                          bg-white
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-slate-950
                        "
                      >
                        Enter world
                        <Arrow />
                      </Link>

                    </div>

                  </div>


                  <div
                    className="
                      border-t
                      border-slate-200
                      bg-[#f5f7fb]
                      p-5
                      lg:border-l
                      lg:border-t-0
                      sm:p-6
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.17em]
                        text-slate-400
                      "
                    >
                      SUBSECTIONS
                    </p>

                    <div
                      className="
                        mt-4
                        grid
                        gap-2
                      "
                    >

                      {activeWorld
                        .subsections
                        .map(
                          (
                            subsection,
                            index
                          ) => (

                            <Link
                              key={
                                subsection.href
                              }
                              href={
                                subsection.href
                              }
                              className="
                                group
                                flex
                                min-h-[52px]
                                items-center
                                justify-between
                                rounded-[8px]
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-xs
                                font-semibold
                                text-slate-700
                                transition
                                hover:border-slate-300
                                hover:shadow-sm
                              "
                            >
                              <span>
                                <span
                                  className="
                                    mr-3
                                    text-[8px]
                                    text-slate-400
                                  "
                                >
                                  {String(
                                    index + 1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>

                                {subsection.label}
                              </span>

                              <Arrow />
                            </Link>

                          )
                        )}

                    </div>

                  </div>

                </div>

              </div>

            ) : null}


            {/* ----------------------------------------------
                INTENT
               ---------------------------------------------- */}

            {mode ===
            "intent" ? (

              <div
                className="
                  grid
                  min-h-[520px]
                  lg:grid-cols-[250px_1fr]
                "
              >

                <div
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    p-4
                    lg:border-b-0
                    lg:border-r
                  "
                >

                  <p
                    className="
                      px-2
                      pt-2
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.17em]
                      text-slate-400
                    "
                  >
                    START WITH PURPOSE
                  </p>


                  <div
                    className="
                      mt-4
                      grid
                      gap-2
                    "
                  >

                    {intents.map(
                      (
                        item,
                        index
                      ) => (

                        <button
                          key={
                            item.label
                          }
                          type="button"
                          onClick={() =>
                            setIntentIndex(
                              index
                            )
                          }
                          className={`
                            rounded-[8px]
                            border
                            p-4
                            text-left
                            transition
                            ${
                              intentIndex ===
                              index
                                ? "border-[#0a2230] bg-[#0a2230] text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }
                          `}
                        >
                          <p
                            className="
                              text-[8px]
                              font-bold
                              tracking-[0.15em]
                              opacity-40
                            "
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </p>

                          <p
                            className="
                              mt-2
                              text-sm
                              font-semibold
                            "
                          >
                            {item.label}
                          </p>
                        </button>

                      )
                    )}

                  </div>

                </div>


                <div
                  className="
                    relative
                    flex
                    min-h-[520px]
                    flex-col
                    justify-center gap-8
                    overflow-hidden
                    p-6
                    sm:p-8
                  "
                >

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -right-28
                      -top-28
                      hidden h-96
                      w-96
                      rounded-[8px]
                      border
                      border-slate-200
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      right-10
                      top-10
                      hidden h-56
                      w-56
                      rotate-45
                      border
                      border-slate-100
                    "
                  />


                  <div
                    className="relative"
                  >

                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-red-500
                      "
                    >
                      YOUR INTENT
                    </p>

                    <h3
                      className="
                        mt-4
                        max-w-[11ch]
                        text-[34px]
                        font-semibold
                        tracking-[-0.05em]
                        sm:text-[40px]
                        lg:text-[40px]
                      "
                    >
                      {activeIntent.title}
                    </h3>

                    <p
                      className="
                        mt-4
                        max-w-xl
                        text-sm
                        leading-6
                        text-slate-500
                      "
                    >
                      {activeIntent.description}
                    </p>

                  </div>


                  <div
                    className="
                      relative
                      flex
                      flex-wrap
                      gap-3
                    "
                  >

                    <Link
                      href={
                        activeIntent.href
                      }
                      className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        rounded-[8px]
                        bg-[#0a2230]
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      Start here
                      <Arrow />
                    </Link>

                    <Link
                      href="/search"
                      className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        rounded-[8px]
                        border
                        border-slate-200
                        bg-white
                        px-6
                        py-3
                        text-sm
                        font-semibold
                      "
                    >
                      Search instead
                      <Arrow />
                    </Link>

                  </div>

                </div>

              </div>

            ) : null}


            {/* ----------------------------------------------
                PLACE
               ---------------------------------------------- */}

            {mode ===
            "place" ? (

              <div
                className="
                  grid
                  min-h-[500px]
                  lg:grid-cols-[1fr_250px]
                "
              >

                <div
                  className="
                    relative
                    flex
                    min-h-[460px]
                    items-center
                    justify-start
                    overflow-hidden
                    bg-[#f5f7fb]
                  "
                >

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      hidden h-[470px]
                      w-[470px]
                      rounded-full
                      border
                      border-slate-200
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      hidden h-[360px]
                      w-[360px]
                      rotate-[25deg]
                      rounded-[50%]
                      border
                      border-slate-200
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      hidden h-[360px]
                      w-[360px]
                      -rotate-[25deg]
                      rounded-[50%]
                      border
                      border-slate-200
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      hidden h-px
                      w-[470px]
                      bg-slate-100
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      hidden h-[470px]
                      w-px
                      bg-slate-100
                    "
                  />


                  <div
                    className="
                      relative
                      z-10
                      max-w-xl
                      p-8
                      text-left
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-red-500
                      "
                    >
                      GEOGRAPHY LEVEL
                    </p>

                    <h3
                      className="
                        mt-3
                        text-[40px]
                        font-semibold
                        tracking-[-0.05em]
                      "
                    >
                      {activeGeography.label}
                    </h3>

                    <p
                      className="
                        mt-4
                        text-sm
                        leading-6
                        text-slate-500
                      "
                    >
                      {activeGeography.description}
                    </p>

                    <Link
                      href="/global"
                      className="
                        group
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-[8px]
                        bg-[#0a2230]
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      Open Global
                      <Arrow />
                    </Link>

                  </div>

                </div>


                <div
                  className="
                    border-t
                    border-slate-200
                    bg-white
                    p-5
                    lg:border-l
                    lg:border-t-0
                  "
                >

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.17em]
                      text-slate-400
                    "
                  >
                    CHANGE SCALE
                  </p>


                  <div
                    className="
                      mt-4
                      grid
                      gap-2
                    "
                  >

                    {geographyLevels.map(
                      (
                        level,
                        index
                      ) => (

                        <button
                          key={
                            level.label
                          }
                          type="button"
                          onClick={() =>
                            setGeographyIndex(
                              index
                            )
                          }
                          className={`
                            rounded-[8px]
                            border
                            px-4
                            py-3
                            text-left
                            text-xs
                            font-semibold
                            transition
                            ${
                              geographyIndex ===
                              index
                                ? "border-[#0a2230] bg-[#0a2230] text-white"
                                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                            }
                          `}
                        >
                          {level.label}
                        </button>

                      )
                    )}

                  </div>


                  <p
                    className="
                      mt-7
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.17em]
                      text-slate-400
                    "
                  >
                    STARTING PLACES
                  </p>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {places.map(
                      (
                        [
                          label,
                          href,
                        ]
                      ) => (

                        <Link
                          key={label}
                          href={href}
                          className="
                            rounded-[6px]
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2
                            text-[10px]
                            font-semibold
                            text-slate-600
                            transition
                            hover:border-red-300
                            hover:text-red-500
                          "
                        >
                          {label}
                        </Link>

                      )
                    )}

                  </div>

                </div>

              </div>

            ) : null}


            {/* ----------------------------------------------
                CONNECTIONS
               ---------------------------------------------- */}

            {mode ===
            "connections" ? (

              <div
                className="
                  relative
                  min-h-[500px]
                  overflow-hidden
                  bg-[#f5f7fb]
                  p-5
                  sm:p-7
                "
              >

                <div
                  className="
                    mx-auto
                    grid
                    min-h-[460px]
                    max-w-none
                    grid-cols-3
                    grid-rows-3
                    gap-2
                  "
                >

                  {connections.map(
                    (
                      item,
                      index
                    ) => {

                      const positions = [
                        "col-start-2 row-start-1",
                        "col-start-3 row-start-1",
                        "col-start-3 row-start-2",
                        "col-start-3 row-start-3",
                        "col-start-2 row-start-3",
                        "col-start-1 row-start-3",
                        "col-start-1 row-start-2",
                      ];

                      return (
                        <button
                          key={
                            item.label
                          }
                          type="button"
                          onClick={() =>
                            setConnectionIndex(
                              index
                            )
                          }
                          className={`
                            ${positions[index]}
                            flex
                            min-h-[120px]
                            flex-col
                            justify-between
                            rounded-[8px]
                            border
                            p-4
                            text-left
                            transition
                            ${
                              connectionIndex ===
                              index
                                ? "border-[#0a2230] bg-[#0a2230] text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm"
                            }
                          `}
                        >
                          <span
                            className="
                              text-[8px]
                              font-bold
                              tracking-[0.15em]
                              opacity-40
                            "
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span
                            className="
                              text-sm
                              font-semibold
                            "
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    }
                  )}


                  <div
                    className="
                      col-start-2
                      row-start-2
                      flex
                      min-h-[120px]
                      flex-col
                      items-center
                      justify-center
                      rounded-[8px]
                      border
                      border-slate-200
                      bg-white
                      p-5
                      text-center
                      
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-red-500
                      "
                    >
                      ARKNOZ
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        font-semibold
                      "
                    >
                      Connected record
                    </p>
                  </div>

                </div>

              </div>

            ) : null}

          </div>


          {/* ==================================================
              CONTEXT DRAWER
             ================================================== */}

          <aside
            className="
              flex
              flex-col
              rounded-[10px]
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-red-500
              "
            >
              {context.eyebrow}
            </p>

            <h3
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.035em]
              "
            >
              {context.title}
            </h3>

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-slate-500
              "
            >
              {context.description}
            </p>


            <Link
              href={
                context.href
              }
              className="
                group
                mt-6
                inline-flex
                items-center
                justify-between
                rounded-[8px]
                bg-[#0a2230]
                px-4
                py-3
                text-xs
                font-semibold
                text-white
              "
            >
              {context.cta}
              <Arrow />
            </Link>


            <div
              className="
                mt-auto
                border-t
                border-slate-100
                pt-5
              "
            >

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-400
                "
              >
                QUICK ACCESS
              </p>


              <div
                className="
                  mt-3
                  grid
                  gap-2
                "
              >

                {[
                  [
                    "Search all Arknoz",
                    "/search",
                  ],
                  [
                    "Explore Featured",
                    "/featured",
                  ],
                  [
                    "Explore Global",
                    "/global",
                  ],
                ].map(
                  (
                    [
                      label,
                      href,
                    ]
                  ) => (

                    <Link
                      key={href}
                      href={href}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        rounded-[6px]
                        border
                        border-slate-200
                        bg-slate-50
                        px-3
                        py-3
                        text-[11px]
                        font-semibold
                        text-slate-600
                        transition
                        hover:bg-white
                      "
                    >
                      {label}
                      <Arrow />
                    </Link>

                  )
                )}

              </div>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}