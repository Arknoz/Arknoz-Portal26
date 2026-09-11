"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalHeader from "@/components/GlobalHeader";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import GlobalFooter from "@/components/GlobalFooter";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const worlds = [
  ["All", "all"],
  ["Projects", "project"],
  ["Products", "product"],
  ["Knowledge", "knowledge"],
  ["Learning", "learning"],
  ["Opportunities", "opportunity"],
  ["People", "person"],
  ["Organisations", "organisation"],
  ["Universities", "university"],
  ["Places", "place"],
] as const;

const discoveryPrompts = [
  ["Sustainable buildings in India", "sustainable buildings India"],
  ["Mass timber systems", "mass timber"],
  ["Urban biodiversity", "urban biodiversity"],
  ["Built World universities", "universities"],
  ["Research opportunities", "research fellowship"],
  ["People working in sustainable design", "sustainable design"],
] as const;

const featured = [
  {
    type: "PROJECT",
    title: "Bosco Verticale",
    meta: "Milan, Italy",
    href: "/projects/bosco-verticale",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=82",
  },
  {
    type: "KNOWLEDGE",
    title: "Urban Biodiversity",
    meta: "Global",
    href: "/knowledge/urban-biodiversity",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=82",
  },
  {
    type: "ORGANISATION",
    title: "White Arkitekter",
    meta: "Sweden",
    href: "/organisations/white-arkitekter",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82",
  },
] as const;

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

function SearchBody() {
  const params = useSearchParams();
  const router = useRouter();

  const urlQuery = (params.get("q") ?? "").trim();
  const [query, setQuery] = useState(urlQuery);
  const [world, setWorld] = useState("all");

  const results = useMemo(() => {
    if (!urlQuery) return [];

    const terms = urlQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return entities.filter((entity) => {
      const haystack = [
        entity.title,
        entity.subtitle,
        entity.geography,
        entity.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesText = terms.every((term) => haystack.includes(term));
      const matchesWorld = world === "all" || entity.type === world;

      return matchesText && matchesWorld;
    });
  }, [urlQuery, world]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function runPrompt(value: string) {
    setQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <section className="bg-[#f6f8fb] py-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 md:p-8">
            <form
              onSubmit={submit}
              className="flex items-center rounded-full border border-slate-200 bg-white p-1.5 shadow-sm focus-within:ring-4 focus-within:ring-blue-100"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the Built World..."
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-base text-slate-900 outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#0f55c8] px-7 py-3 font-semibold text-white"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {worlds.map(([label, value]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWorld(value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    world === value
                      ? "border-[#0b2949] bg-[#0b2949] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {urlQuery ? (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  SEARCH RESULTS
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Results for “{urlQuery}”
                </h2>
              </div>

              <Link
                href="/explore"
                className="group inline-flex items-center gap-1.5 font-semibold text-blue-700"
              >
                Explore all worlds
                <ArrowRight />
              </Link>
            </div>

            {results.length > 0 ? (
              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map((entity) => (
                  <Link
                    key={`${entity.type}-${entity.slug}`}
                    href={getEntityHref(entity)}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      {entity.subtitle || entity.type}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950">
                      {entity.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between gap-4 text-sm text-slate-500">
                      <span>{entity.geography}</span>
                      <span className="text-blue-700">
                        <ArrowRight />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-[28px] border border-slate-200 bg-[#f8fafc] p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  NO EXACT MATCH
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  Try a broader Built World search.
                </h3>
                <p className="mt-2 max-w-3xl text-slate-600">
                  Search by project, product, topic, organisation, university, person or place. Arknoz does not invent results when the current record set has no match.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {discoveryPrompts.map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => runPrompt(value)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                START DISCOVERING
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Search by intent, not only by keyword.
              </h2>
              <p className="mt-2 max-w-3xl text-slate-600">
                Start with a useful question or topic and let Arknoz lead you across connected worlds.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {discoveryPrompts.map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => runPrompt(value)}
                  className="group flex min-h-[120px] items-end justify-between gap-5 rounded-[24px] border border-slate-200 bg-[#f8fafc] p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="text-lg font-bold text-slate-950">{label}</span>
                  <span className="shrink-0 text-blue-700">
                    <ArrowRight />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f6f8fb] py-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-[30px] bg-[#0b2949] p-7 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                SEARCH ACROSS WORLDS
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                One search. Nine connected worlds.
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-300">
                Search should surface the right record first, then expose related projects, products, people, knowledge, institutions and places.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {worlds.slice(1).map(([label]) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-slate-200"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                SEARCH PRINCIPLES
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Relevant first", "Organic relevance stays separate from future commercial visibility."],
                  ["Recover gracefully", "Typos, broad searches and zero-result cases should help users continue."],
                  ["Respect geography", "Location changes relevance and context without duplicating canonical truth."],
                  ["No fake results", "If Arknoz does not have a record, it should say so clearly."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-[20px] border border-slate-200 bg-[#f8fafc] p-4"
                  >
                    <h3 className="font-bold text-slate-950">{title}</h3>
                    <p className="mt-1.5 text-sm leading-5 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <UniversalTopicHero
        eyebrow="SEARCH & DISCOVERY"
        title="Find what matters in the Built World."
        description="Search across projects, products, knowledge, people, organisations, universities, opportunities and places."
        searchPlaceholder="Search the Built World..."
        popular={[
          "sustainable buildings",
          "mass timber",
          "urban biodiversity",
          "universities",
          "research fellowship",
          "Milan",
        ]}
        featured={[...featured]}
        ticker={[
          { text: "Search across nine connected Arknoz worlds", href: "/explore" },
          { text: "Try project, product, topic, person or place", href: "/search" },
          { text: "Zero-result recovery never invents records", href: "/search" },
          { text: "Explore geography from world to city", href: "/global" },
        ]}
      />

      <SearchBody />

      <UniversalFooterStrip />
      <GlobalFooter />
    </main>
  );
}

