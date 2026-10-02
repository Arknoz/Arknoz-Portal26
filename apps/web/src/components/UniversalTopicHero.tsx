"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArknozVisualTheme } from "@/lib/arknoz-visual-theme";
import { resolvePortalImage } from "@/lib/portal-image";

type Feature = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};

type PopularItem =
  | string
  | {
      label: string;
      href: string;
    };

type TickerItem = {
  text: string;
  href: string;
};

type ContextNavItem = {
  label: string;
  href: string;
  locked?: boolean;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  popular: PopularItem[];
  featured: Feature[];
  ticker: TickerItem[];
  searchGeo?: string;
  featuredHref?: string;
  featuredPlacementIds?: string[];
  contextNav?: ContextNavItem[];
  breadcrumb?: BreadcrumbItem[];
  compact?: boolean;
    hideTicker?: boolean;
theme?: ArknozVisualTheme;
};

function ContextLockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="6" y="10" width="12" height="9" rx="2" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function UniversalTopicHero({
  eyebrow,
  title,
  description,
  searchPlaceholder,
  popular,
  featured,
  ticker,
  searchGeo,
  featuredHref,
  featuredPlacementIds,
  contextNav,
  breadcrumb = [],
  compact = false,
    hideTicker = false,
theme,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Explore keeps its own content and behaviour,
  // but follows the same visual language as Home.
  const homeVisual =
    eyebrow === "EXPLORE";


  // Exactly three visible card positions.
  //
  // Genuine cards are deduplicated first.
  // Missing cards remain explicit neutral empty slots.
  // No fake entity/content is created.
  const uniqueFeatured =
    featured
      .filter(
        (item, index, items) =>
          items.findIndex(
            (candidate) =>
              candidate.href === item.href
          ) === index
      )
      .slice(0, 3);

  const displayFeatured =
    [0, 1, 2].map(
      (index) =>
        uniqueFeatured[index] ?? null
    );

  const lead = displayFeatured[0];
  const secondary =
    displayFeatured.slice(1, 3);

  function getSearchHref(value: string) {
    const queryPart =
      `q=${encodeURIComponent(value)}`;

    return searchGeo
      ? `/search?${queryPart}&geo=${encodeURIComponent(searchGeo)}`
      : `/search?${queryPart}`;
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(getSearchHref(value));
  }

  function searchPopular(item: PopularItem) {
    if (typeof item !== "string") {
      router.push(item.href);
      return;
    }

    setQuery(item);
    router.push(getSearchHref(item));
  }

  if (homeVisual) {
    const exploreMiniCards = [
      {
        label: "Products",
        title: "Materials and systems",
        href: "/products",
        image: "/visuals/portal/product.png",
      },
      {
        label: "People",
        title: "People shaping the Built World",
        href: "/people",
        image: "/visuals/portal/people.png",
      },
      {
        label: "Opportunities",
        title: "Find what comes next",
        href: "/opportunities",
        image: "/visuals/portal/opportunity.png",
      },
    ];

    return (
      <section
        data-explore-first-screen="true"
        className="border-b border-slate-200 bg-[#f7f8fa] text-[#10253b]"
      >
        <div className="mx-auto grid max-w-[1720px] lg:min-h-[calc(100svh-168px)] lg:grid-cols-[.88fr_1.32fr]">

          {/* LEFT — EXPLORE INTRODUCTION */}
          <div className="flex flex-col border-slate-200 px-6 py-8 lg:border-r lg:px-8 lg:py-10">

            <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
              <h1 className="text-[54px] font-semibold leading-none tracking-[-0.06em] text-[#172b4d] sm:text-[64px]">
                Explore
              </h1>

              <div className="mb-1 hidden h-12 w-px bg-slate-300 sm:block" />

              <p className="mb-1 text-lg text-slate-500">
                The Built World. Opened.
              </p>
            </div>

            <div className="mt-5 h-px w-36 bg-gradient-to-r from-[#a61f46] via-[#a61f46]/35 to-transparent" />

            <p className="mt-7 max-w-[640px] text-[17px] leading-8 text-slate-700">
              {description}
            </p>

            <p className="mt-2 max-w-[610px] text-sm leading-6 text-slate-500">
              Search directly, enter a Built World section, or follow a place,
              topic or opportunity.
            </p>

            <form
              onSubmit={submitSearch}
              className="mt-7 flex max-w-[650px] border border-slate-300 bg-white shadow-[0_8px_28px_rgba(15,35,55,.05)] focus-within:border-[#a61f46]"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="m-1 bg-[#081f2d] px-7 text-xs font-semibold text-white transition hover:bg-[#102f42]"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs font-semibold">
              <Link
                href="#arknoz-worlds"
                className="transition hover:text-[#a61f46]"
              >
                Browse Worlds →
              </Link>

              <Link
                href="/global"
                className="text-slate-500 transition hover:text-[#a61f46]"
              >
                Explore by Place →
              </Link>
            </div>

            {/* DISCOVER / UNDERSTAND / CONNECT */}
            <div className="mt-7 grid max-w-[650px] grid-cols-3 border-y border-slate-200 py-5">
              <div className="pr-5">
                <p className="text-[10px] font-bold tracking-[0.08em] text-slate-400">
                  DISCOVER
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Projects, products and places.
                </p>
              </div>

              <div className="border-l border-slate-200 px-5">
                <p className="text-[10px] font-bold tracking-[0.08em] text-slate-400">
                  UNDERSTAND
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Knowledge, learning and research.
                </p>
              </div>

              <div className="border-l border-slate-200 pl-5">
                <p className="text-[10px] font-bold tracking-[0.08em] text-slate-400">
                  CONNECT
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  People, organisations and opportunities.
                </p>
              </div>
            </div>

            {/* SMALL VISUAL GATEWAYS */}
            <div className="mt-auto grid max-w-[650px] grid-cols-3 gap-2 pt-4">
              {exploreMiniCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative min-h-[140px] overflow-hidden bg-slate-900"
                >
                  <img
                    src={resolvePortalImage({
                      src: card.image,
                      kind: card.label,
                    })}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[9px] font-bold tracking-[0.08em] text-white/65">
                      {card.label}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-5">
                      {card.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — EXPLORE GATEWAYS */}
          <div className="px-6 py-8 lg:px-8 lg:py-10">

            <div className="mb-4 flex items-end justify-between gap-6">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[#a61f46]">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  EXPLORE GATEWAYS
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#10253b]">
                  Choose where to enter.
                </h2>
              </div>

              <Link
                href="/global"
                className="text-xs font-semibold text-slate-500 transition hover:text-[#a61f46]"
              >
                Explore places →
              </Link>
            </div>

            <div className="grid gap-3 md:h-[560px] md:grid-cols-[1.55fr_.85fr]">

              {lead ? (
                <Link
                  href={lead.href}
                  className="group relative min-h-[360px] overflow-hidden bg-slate-900 md:min-h-0"
                >
                  <img
                    src={resolvePortalImage({
                      src: lead.image,
                      kind: lead.type,
                    })}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061923]/95 via-black/12 to-transparent" />

                  <div className="absolute left-5 top-5">
                    <span className="bg-white/90 px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] text-[#10253b]">
                      START HERE
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] font-bold tracking-[0.1em] text-white/60">
                      {lead.type}
                    </p>

                    <h3 className="mt-2 max-w-xl text-[34px] font-semibold leading-[1.02] tracking-[-0.045em]">
                      {lead.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/70">
                      {lead.meta}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                      Open gateway
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              ) : null}

              <div className="grid gap-3 md:grid-rows-2">
                {secondary.map((item, index) =>
                  item ? (
                    <Link
                      key={`${item.href}-${index}`}
                      href={item.href}
                      className="group relative min-h-[220px] overflow-hidden bg-slate-900 md:min-h-0"
                    >
                      <img
                        src={resolvePortalImage({
                          src: item.image,
                          kind: item.type,
                        })}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <p className="text-[9px] font-bold tracking-[0.1em] text-white/55">
                          {item.type}
                        </p>

                        <h3 className="mt-1 text-xl font-semibold leading-tight tracking-[-0.025em]">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-[11px] text-white/65">
                          {item.meta}
                        </p>

                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold">
                          Explore
                          <ArrowRight />
                        </span>
                      </div>
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundColor: "#081b27",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${resolvePortalImage({
              src: "/visuals/arknoz-built-world-watermark.jpg",
              kind: eyebrow,
            })})`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(3,18,28,0.98) 0%,rgba(4,25,36,0.93) 46%,rgba(5,29,41,0.72) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06182d]/90 via-transparent to-transparent" />

        {contextNav && contextNav.length > 0 ? (
          <nav
            aria-label="Context navigation"
            className="absolute inset-x-0 top-0 z-20 border-b border-white/10 backdrop-blur-md"
            style={{
              backgroundColor: "#081b27",
            }}
          >
            <div className="mx-auto flex h-11 max-w-[1720px] items-center gap-4 overflow-x-auto px-6 text-[11px] font-semibold text-slate-200 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
              {contextNav.map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  title={item.locked ? `${item.label} · Arknoz Pro` : item.label}
                  className={`flex shrink-0 items-center gap-1.5 transition ${
                    item.locked
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-200 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.locked ? <ContextLockIcon /> : null}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        <div
          className={`relative mx-auto grid max-w-[1720px] items-start px-6 lg:grid-cols-[1.16fr_.94fr] lg:px-10 ${
            compact
              ? contextNav?.length
                ? "gap-6 pt-16 pb-5 lg:min-h-[420px]"
                : "gap-6 py-5 lg:min-h-[420px]"
              : contextNav?.length
                ? "gap-10 pt-10 pb-8 lg:min-h-[calc(100svh-132px)]"
                : "gap-10 pt-8 pb-8 lg:min-h-[calc(100svh-132px)]"
          }`}
        >
          <div
            className={
              contextNav?.length
                ? "max-w-[830px] lg:pt-6"
                : "max-w-[830px] lg:pt-4"
            }
          >
            {breadcrumb.length > 0 ? (
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.08em] text-blue-200"
              >
                {breadcrumb.map((item, index) => (
                  <span
                    key={`${item.label}-${index}`}
                    className="inline-flex items-center gap-2"
                  >
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className="text-white/35"
                      >
                        /
                      </span>
                    ) : null}

                    {item.href ? (
                      <Link
                        href={item.href}
                        className="transition hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white/70">
                        {item.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            ) : (
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
                {eyebrow}
              </p>
            )}

            <h1
              className={
                homeVisual
                  ? "mt-3 max-w-[620px] text-[44px] font-semibold leading-[0.96] tracking-[-0.05em] sm:text-[50px] md:text-[56px] xl:text-[62px]"
                  : "mt-4 text-5xl font-bold leading-[0.96] tracking-[-0.05em] md:text-7xl xl:text-[74px]"
              }
            >
              {title}
            </h1>

            <p
              className={
                homeVisual
                  ? "mt-6 max-w-[690px] text-lg leading-8 text-slate-100 md:text-[19px]"
                  : "mt-5 max-w-3xl text-lg leading-7 text-slate-100 md:text-xl"
              }
            >
              {description}
            </p>

            <form
              onSubmit={submitSearch}
              className={
                homeVisual
                  ? "mt-7 flex max-w-[720px] items-center rounded-full bg-white p-1.5 shadow-[0_24px_70px_rgba(0,0,0,.24)] transition focus-within:ring-4 focus-within:ring-blue-300/25"
                  : "mt-7 flex max-w-4xl items-center rounded-full bg-white p-1.5 shadow-[0_24px_70px_rgba(0,0,0,.24)] transition focus-within:ring-4 focus-within:ring-blue-300/25"
              }
            >
              <span className="pl-5 text-slate-500">
                <SearchIcon />
              </span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-slate-900 outline-none"
              />

              <button
                type="submit"
                className="rounded-full px-8 py-3 font-semibold text-white transition hover:brightness-110"
                style={{
                  backgroundColor:
                    homeVisual
                      ? "#0b4661"
                      : theme?.mid ?? "#0f55c8",
                }}
              >
                Search
              </button>
            </form>

            <div
              className={
                homeVisual
                  ? "mt-3.5 flex max-w-[720px] flex-wrap items-center gap-2 text-sm"
                  : "mt-3.5 flex max-w-4xl flex-wrap items-center gap-2 text-sm"
              }
            >
              <span className="mr-1 text-slate-300">{homeVisual ? "QUICK STARTS" : "Popular"}</span>
              {popular.map((item, index) => (
                <button
                  key={`${typeof item === "string" ? item : item.href}-${index}`}
                  type="button"
                  onClick={() => searchPopular(item)}
                  className="rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-slate-50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/14"
                >
                  {typeof item === "string" ? item : item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  {homeVisual
                    ? "EXPLORE ARKNOZ"
                    : "ARKNOZ FEATURED NOW"}
                </p>
                {!homeVisual && (
                  <p className="mt-1 text-sm text-slate-300">
                    Selected records connected to this topic.
                  </p>
                )}
              </div>

              <Link
                href={featuredHref ?? (searchGeo ? `/featured?geo=${encodeURIComponent(searchGeo)}` : "/featured")}
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white"
              >
                View all
                <ArrowRight />
              </Link>
            </div>

            <div className="grid gap-3 md:h-[508px] md:grid-cols-[1.35fr_.85fr]">
              {lead ? (
                <Link
                  href={lead.href}
                  data-featured-slot="01"
                  data-featured-placement-id={featuredPlacementIds?.[0]}
                  className="group relative min-h-[330px] overflow-hidden rounded-[26px] border border-white/15 bg-slate-900 shadow-2xl md:h-full md:min-h-0"
                >
                  <img
                    src={resolvePortalImage({
                      src: lead.image,
                      kind: lead.type,
                    })}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      {lead.type}
                    </p>

                    <h2 className="mt-1.5 text-2xl font-bold leading-tight">
                      {lead.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-200">
                      {lead.meta}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                      Explore record
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              ) : (
                <div
                  aria-hidden="true"
                  data-featured-slot="01"
                  className="relative min-h-[330px] overflow-hidden rounded-[26px] border border-white/15 md:h-full md:min-h-0"
                >
                  <img
                    src={resolvePortalImage({ src: "/visuals/arknoz-built-world-watermark.jpg", kind: eyebrow })}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>
              )}

              <div className="grid gap-3 md:min-h-0 md:grid-rows-2">
                {secondary.map((item, index) =>
                  item ? (

                    <Link
                      key={`${item.href}-${index}`}
                      href={item.href}
                      data-featured-slot={index === 0 ? "02" : "03"}
                      data-featured-placement-id={featuredPlacementIds?.[index + 1]}
                      className={
                        homeVisual
                          ? "group relative min-h-0 overflow-hidden rounded-[22px] border border-white/15 bg-slate-900 text-white shadow-xl"
                          : "group min-h-0 overflow-hidden rounded-[22px] border border-white/15 bg-white text-slate-950 shadow-xl transition hover:-translate-y-1"
                      }
                    >
                      {homeVisual ? (
                        <>
                          <img
                            src={resolvePortalImage({
                              src: item.image,
                              kind: item.type,
                            })}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/18 to-transparent" />

                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                              {item.type}
                            </p>

                            <h3 className="mt-1 text-xl font-bold leading-tight text-white">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-200">
                              {item.meta}
                            </p>

                            <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                              Explore
                              <ArrowRight />
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={
                              compact
                                ? "h-[115px] overflow-hidden bg-slate-100"
                                : "aspect-[1.75/1] overflow-hidden bg-slate-100"
                            }
                          >
                            <img
                              src={resolvePortalImage({
                              src: item.image,
                              kind: item.type,
                            })}
                              alt=""
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                            />
                          </div>

                          <div className="p-3.5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                              {item.type}
                            </p>

                            <h3 className="mt-1 line-clamp-3 font-bold leading-snug">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.meta}
                            </p>
                          </div>
                        </>
                      )}
                    </Link>
                  ) : (
                    <div
                      key={`featured-empty-${index + 2}`}
                      aria-hidden="true"
                      data-featured-slot={index === 0 ? "02" : "03"}
                      className="relative min-h-[170px] overflow-hidden rounded-[22px] border border-white/15 md:min-h-0"
                    >
                      <img
                        src={resolvePortalImage({ src: "/visuals/arknoz-built-world-watermark.jpg", kind: eyebrow })}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {!hideTicker && ticker.length > 0 ? (
        <div
          data-arknoz-optional-ticker
          className="overflow-hidden border-y border-white/10 text-white"
          style={{
            backgroundColor: "#081b27",
          }}
        >
          <div className="arknoz-topic-ticker flex min-w-max items-center whitespace-nowrap py-3">
            {[...ticker, ...ticker].map((item, index) => (
              <Link
                key={`${item.text}-${index}`}
                href={item.href}
                className="group mx-8 inline-flex items-center gap-2 text-sm text-slate-100"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>{item.text}</span>
                <span className="text-blue-200">
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes arknozTopicTicker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .arknoz-topic-ticker {
          animation: arknozTopicTicker 34s linear infinite;
          width: max-content;
        }

        .arknoz-topic-ticker:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .arknoz-topic-ticker {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
