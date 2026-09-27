import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import HomeNowOnArknozLoop from "@/components/HomeNowOnArknozLoop";

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
}: Props) {

  return (
    <>

      {/* ======================================================
          01 — UNIVERSAL OPENING
          SAME DESIGN · DESTINATION-SPECIFIC CONTENT
         ====================================================== */}

      <GlobalHeader />

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


      {/* ======================================================
          02 — ARKNOZ NOW · IDENTICAL ACROSS PUBLIC DESTINATIONS
         ====================================================== */}

      <div data-universal-public-screen="arknoz-now">
        <HomeNowOnArknozLoop />
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