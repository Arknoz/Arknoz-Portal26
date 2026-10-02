import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import HomeNowOnArknozLoop from "@/components/HomeNowOnArknozLoop";
import ProjectsNowHomePanel from "@/components/ProjectsNowHomePanel";
import ProductsPublicHero from "@/components/ProductsPublicHero";
import ProductsNowHomePanel from "@/components/ProductsNowHomePanel";
import ArknozWorldPublicHero, {
  type ArknozWorldPublicKey,
} from "@/components/ArknozWorldPublicHero";
import ArknozWorldNowPanel from "@/components/ArknozWorldNowPanel";

import type { ArknozVisualTheme } from "@/lib/arknoz-visual-theme";
import type { FeaturedPlacementContext } from "@/lib/featured-slots";


export type UniversalPublicFeature = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};


export type UniversalPublicPopular =
  | string
  | {
      label: string;
      href: string;
    };


export type UniversalPublicTicker = {
  text: string;
  href: string;
};


export type UniversalPublicContextNav = {
  label: string;
  href: string;
  locked?: boolean;
};

export type UniversalPublicBreadcrumb = {
  label: string;
  href?: string;
};


type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  popular?: UniversalPublicPopular[];
  featured?: UniversalPublicFeature[];
  ticker?: UniversalPublicTicker[];
  searchGeo?: string;
  featuredHref?: string;
  contextNav?: UniversalPublicContextNav[];
  breadcrumb?: UniversalPublicBreadcrumb[];
  placementContext?: FeaturedPlacementContext;
  compact?: boolean;
  theme?: ArknozVisualTheme;
  variant?: "default" | "projects" | "products" | "arknoz-world";
  projectsSubsectionLabel?: string;
  productsSubsectionLabel?: string;
  worldKey?: ArknozWorldPublicKey;
  worldSubsectionLabel?: string;
};


const defaultPopular: UniversalPublicPopular[] = [
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Knowledge",
    href: "/knowledge",
  },
  {
    label: "Education",
    href: "/learning",
  },
  {
    label: "Opportunities",
    href: "/opportunities",
  },
  {
    label: "Community",
    href: "/community",
  },
];


const defaultTicker: UniversalPublicTicker[] = [
  {
    text: "Explore the Built World by place",
    href: "/global",
  },
  {
    text: "Discover projects connected across Arknoz",
    href: "/projects",
  },
  {
    text: "Research, cases and practical knowledge",
    href: "/knowledge",
  },
  {
    text: "Products, materials, systems and equipment",
    href: "/products",
  },
];


export default function UniversalPublicFirstScreen({
  eyebrow = "ARKNOZ",
  title = "One connected Built World.",
  description =
    "Explore projects, products, knowledge, education, opportunities and the Arknoz member community through one connected global system.",
  searchPlaceholder = "Search the Built World...",
  popular = defaultPopular,
  featured = [],
  ticker = defaultTicker,
  searchGeo,
  featuredHref,
  contextNav = [],
  breadcrumb = [],
  compact = false,
  theme,
  variant = "default",
  projectsSubsectionLabel,
  productsSubsectionLabel,
  worldKey,
  worldSubsectionLabel,
}: Props) {

  return (
    <>

      {/* ======================================================
          01 — UNIVERSAL OPENING
          SAME DESIGN · DESTINATION-SPECIFIC CONTENT
         ====================================================== */}

      <GlobalHeader />
      {variant === "projects" ? (
        <section
          data-projects-public-hero="true"
          className="
            bg-[#f5f7fb]
            px-5
            py-5
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-[1600px]
              overflow-hidden
              rounded-[10px]
              border
              border-slate-200
              bg-white
              shadow-[0_18px_50px_rgba(15,23,42,0.06)]
              lg:min-h-[calc(100svh-168px)]
              lg:grid-cols-[.86fr_1.14fr]
            "
          >
            {/* LEFT · PROJECTS */}
            <div
              className="
                flex
                flex-col
                justify-between
                p-7
                sm:p-9
                lg:p-10
                xl:p-12
              "
            >
              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-6
                    gap-y-3
                  "
                >
                  <h1
                    className="
                      text-[54px]
                      font-semibold
                      leading-none
                      tracking-[-0.06em]
                      text-[#172b4d]
                      sm:text-[64px]
                    "
                  >
                    Projects
                  </h1>

                  <div
                    className="
                      hidden
                      h-14
                      w-px
                      bg-slate-300
                      sm:block
                    "
                  />

                  <p
                    className="
                      max-w-[280px]
                      text-[18px]
                      leading-tight
                      text-slate-500
                      sm:text-[20px]
                    "
                  >
                    The Built World. Built.
                  </p>
                </div>

                <div className="mt-5 flex items-center">
                  <span className="h-px w-10 bg-[#a61f46]" />
                  <span className="h-px w-28 bg-slate-200" />
                </div>

                {projectsSubsectionLabel ? (
                  <div className="mt-7">
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-red-500
                      "
                    >
                      Project World
                    </p>

                    <h2
                      className="
                        mt-2
                        max-w-[650px]
                        text-[27px]
                        font-semibold
                        leading-[1.05]
                        tracking-[-0.04em]
                        text-[#0a2230]
                        sm:text-[31px]
                      "
                    >
                      {projectsSubsectionLabel}
                    </h2>
                  </div>
                ) : null}

                <p
                  className="
                    mt-6
                    max-w-[670px]
                    text-[14px]
                    leading-7
                    text-slate-600
                  "
                >
                  {description}
                </p>

                <p
                  className="
                    mt-2
                    max-w-[650px]
                    text-[12px]
                    leading-5
                    text-slate-500
                  "
                >
                  Search directly, enter a project category, or explore projects by place.
                </p>

                {/* SEARCH */}
                <form
                  action="/search"
                  className="
                    mt-7
                    flex
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                  "
                >
                  <input
                    type="hidden"
                    name="section"
                    value="projects"
                  />

                  <input
                    name="q"
                    aria-label="Search projects"
                    placeholder={searchPlaceholder}
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-4
                      py-3.5
                      text-[13px]
                      text-[#0a2230]
                      outline-none
                      placeholder:text-slate-400
                    "
                  />

                  <button
                    type="submit"
                    className="
                      m-1.5
                      rounded-[6px]
                      bg-[#0a2230]
                      px-5
                      text-[11px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#153e57]
                    "
                  >
                    Search
                  </button>
                </form>

                {/* PROJECT CATEGORIES */}
                <div
                  className="
                    mt-7
                    border-t
                    border-slate-200
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
                    Explore project worlds
                  </p>

                  <div
                    className="
                      mt-3
                      grid
                      gap-x-5
                      gap-y-1
                      sm:grid-cols-2
                    "
                  >
                    {popular
                      .slice(0, 6)
                      .map((item) => {
                        const label =
                          typeof item === "string"
                            ? item
                            : item.label;

                        const href =
                          typeof item === "string"
                            ? `/search?q=${encodeURIComponent(item)}`
                            : item.href;

                        return (
                          <Link
                            key={`${label}-${href}`}
                            href={href}
                            className="
                              group
                              flex
                              items-center
                              justify-between
                              border-b
                              border-slate-100
                              py-2.5
                              text-[11px]
                              font-semibold
                              text-slate-600
                              transition
                              hover:text-[#a61f46]
                            "
                          >
                            <span>
                              {label}
                            </span>

                            <span
                              aria-hidden="true"
                              className="
                                text-slate-300
                                transition
                                group-hover:translate-x-0.5
                                group-hover:text-[#a61f46]
                              "
                            >
                              →
                            </span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div
                className="
                  mt-8
                  flex
                  items-center
                  justify-between
                  border-t
                  border-slate-200
                  pt-5
                "
              >
                <p
                  className="
                    max-w-sm
                    text-[10px]
                    leading-5
                    text-slate-400
                  "
                >
                  Buildings, interiors, landscapes, urban development,
                  infrastructure and industrial projects connected
                  through Arknoz.
                </p>

                <Link
                  href="/global"
                  className="
                    shrink-0
                    text-[10px]
                    font-bold
                    text-[#0a2230]
                    transition
                    hover:text-[#a61f46]
                  "
                >
                  Explore by place →
                </Link>
              </div>
            </div>


            {/* RIGHT · FEATURED PROJECTS */}
            <div
              className="
                border-t
                border-slate-200
                bg-[#eef2f5]
                p-4
                lg:border-l
                lg:border-t-0
                lg:p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  pb-4
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.17em]
                      text-red-500
                    "
                  >
                    {projectsSubsectionLabel
                      ? `Featured · ${projectsSubsectionLabel}`
                      : "Featured Projects"}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-slate-500
                    "
                  >
                    Selected project records across the Built World.
                  </p>
                </div>

                {featuredHref ? (
                  <Link
                    href={featuredHref}
                    className="
                      text-[10px]
                      font-semibold
                      text-[#0a2230]
                      transition
                      hover:text-[#a61f46]
                    "
                  >
                    View featured →
                  </Link>
                ) : null}
              </div>

              <div
                className="
                  grid
                  min-h-[560px]
                  gap-3
                  md:grid-cols-[1.35fr_.65fr]
                  lg:h-[calc(100%-58px)]
                  lg:min-h-0
                "
              >
                {/* LEAD PROJECT */}
                <Link
                  href={featured[0]?.href ?? "/projects"}
                  className="
                    group
                    relative
                    min-h-[390px]
                    overflow-hidden
                    rounded-[8px]
                    bg-[#0a2230]
                    md:min-h-0
                  "
                >
                  <img
                    src={
                      featured[0]?.image ??
                      "/visuals/portal/project.png"
                    }
                    alt=""
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-700
                      group-hover:scale-[1.025]
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#03121c]/95
                      via-[#03121c]/12
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      p-6
                      text-white
                      lg:p-7
                    "
                  >
                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-white/65
                      "
                    >
                      {featured[0]?.type ?? "Project"}
                    </p>

                    <h2
                      className="
                        mt-2
                        max-w-xl
                        text-[28px]
                        font-semibold
                        leading-[1.02]
                        tracking-[-0.045em]
                        sm:text-[32px]
                      "
                    >
                      {featured[0]?.title ??
                        "Explore projects across the Built World"}
                    </h2>

                    <p
                      className="
                        mt-3
                        text-[10px]
                        font-medium
                        text-white/60
                      "
                    >
                      {featured[0]?.meta ?? "Arknoz Projects"}
                    </p>
                  </div>
                </Link>


                {/* SECONDARY PROJECTS */}
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                  {[1, 2].map((index) => {
                    const item =
                      featured[index];

                    return (
                      <Link
                        key={`project-feature-${index}`}
                        href={
                          item?.href ??
                          "/projects"
                        }
                        className="
                          group
                          relative
                          min-h-[220px]
                          overflow-hidden
                          rounded-[8px]
                          bg-[#0a2230]
                          md:min-h-0
                        "
                      >
                        <img
                          src={
                            item?.image ??
                            "/visuals/portal/project.png"
                          }
                          alt=""
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-700
                            group-hover:scale-[1.03]
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#03121c]/95
                            via-[#03121c]/15
                            to-transparent
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
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-[0.17em]
                              text-white/60
                            "
                          >
                            {item?.type ??
                              "Project"}
                          </p>

                          <h3
                            className="
                              mt-2
                              line-clamp-3
                              text-[18px]
                              font-semibold
                              leading-[1.05]
                              tracking-[-0.035em]
                            "
                          >
                            {item?.title ??
                              "Discover project"}
                          </h3>

                          <p
                            className="
                              mt-2
                              text-[9px]
                              text-white/55
                            "
                          >
                            {item?.meta ??
                              "Arknoz Projects"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : variant === "products" ? (
        <ProductsPublicHero
          description={description}
          searchPlaceholder={searchPlaceholder}
          popular={popular}
          featured={featured}
          featuredHref={featuredHref}
          subsectionLabel={productsSubsectionLabel}
        />
      ) : variant === "arknoz-world" && worldKey ? (
        <ArknozWorldPublicHero
          worldKey={worldKey}
          description={description}
          searchPlaceholder={searchPlaceholder}
          popular={popular}
          featured={featured}
          featuredHref={featuredHref}
          subsectionLabel={worldSubsectionLabel}
        />
      ) : (
        <UniversalTopicHero
          eyebrow={eyebrow}
          title={title}
          description={description}
          searchPlaceholder={searchPlaceholder}
          popular={popular}
          featured={featured}
          ticker={ticker}
          searchGeo={searchGeo}
          featuredHref={featuredHref}
          breadcrumb={breadcrumb}
          compact={compact}
          theme={theme}
          hideTicker
        />
      )}


      {/* ======================================================
          02 — ARKNOZ NOW · IDENTICAL ACROSS PUBLIC DESTINATIONS
         ====================================================== */}

      <div data-universal-public-screen="arknoz-now">
        {variant === "projects" ? (
          <ProjectsNowHomePanel />
        ) : variant === "products" ? (
          <ProductsNowHomePanel />
        ) : variant === "arknoz-world" && worldKey ? (
          <ArknozWorldNowPanel
            worldKey={worldKey}
            popular={popular}
          />
        ) : (
          <HomeNowOnArknozLoop />
        )}
      </div>


      {/* ======================================================
          PAGE-SPECIFIC NAVIGATION STARTS AFTER SCREEN 02
         ====================================================== */}

      {contextNav.length > 0 ? (
        <nav
          aria-label="Page navigation"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto flex max-w-[1720px] gap-2 overflow-x-auto px-5 py-3 lg:px-8">

            {contextNav.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}

          </div>
        </nav>
      ) : null}

    </>
  );
}