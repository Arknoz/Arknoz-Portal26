"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

type SearchResult = {
  kind: "entity";
  title: string;
  subtitle: string;
  description: string;
  href: string;
  geography: string;
};

type ApiSearchRecord = {
  slug: string;
  type: string;
  title: string;
  subtitle?: string;
  summary?: string;
  geography?: string;
};

type ApiSearchResponse = {
  results?: ApiSearchRecord[];
  error?: string;
};
type Turn = {
  id: number;
  role: "user" | "arknoz";
  text: string;
  query?: string;
  results?: SearchResult[];
  loading?: boolean;
};

type TypeFilter = {
  terms: string[];
  world: string;
};

const quickPrompts = [
  "India",
  "Urban Biodiversity",
  "Sydney",
  "sustainable design",
] as const;

const stopWords = new Set<string>([
  "a",
  "an",
  "and",
  "about",
  "arknoz",
  "at",
  "find",
  "for",
  "from",
  "give",
  "in",
  "is",
  "looking",
  "me",
  "of",
  "on",
  "only",
  "please",
  "search",
  "show",
  "tell",
  "the",
  "to",
  "want",
  "what",
  "where",
  "which",
  "who",
  "with",
]);

const typeFilters: TypeFilter[] = [
  {
    terms: ["project", "projects"],
    world: "project",
  },
  {
    terms: ["product", "products"],
    world: "product",
  },
  {
    terms: ["knowledge"],
    world: "knowledge",
  },
  {
    terms: ["person", "people"],
    world: "person",
  },
  {
    terms: [
      "organisation",
      "organisations",
      "organization",
      "organizations",
    ],
    world: "organisation",
  },
  {
    terms: [
      "university",
      "universities",
    ],
    world: "university",
  },
  {
    terms: [
      "opportunity",
      "opportunities",
    ],
    world: "opportunity",
  },
  {
    terms: ["place", "places"],
    world: "place",
  },
];

const typeTerms =
  new Set<string>(
    typeFilters.flatMap(
      (filter) => filter.terms
    )
  );

const routeByType:
  Record<string, string> = {
    project: "projects",
    product: "products",
    knowledge: "knowledge",
    person: "people",
    organisation: "organisations",
    university: "universities",
    opportunity: "opportunities",
    place: "places",
  };

function normalize(
  value: string
) {
  return value
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}\s-]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function findTypeWorld(
  terms: string[]
) {
  return (
    typeFilters.find(
      (filter) =>
        filter.terms.some(
          (term) =>
            terms.includes(term)
        )
    )?.world ?? null
  );
}

function buildSearchRequest(
  value: string
) {
  const normalized =
    normalize(value);

  const rawTerms =
    normalized
      .split(" ")
      .filter(Boolean);

  const meaningfulTerms =
    rawTerms.filter(
      (term) =>
        !stopWords.has(term)
    );

  const world =
    findTypeWorld(
      meaningfulTerms
    );

  const contentTerms =
    meaningfulTerms.filter(
      (term) =>
        !typeTerms.has(term)
    );

  const query =
    contentTerms.length > 0
      ? contentTerms.join(" ")
      : meaningfulTerms.join(" ");

  return {
    query:
      query || normalized,
    world,
  };
}
async function conversationalSearch(
  value: string
): Promise<SearchResult[]> {

  const request =
    buildSearchRequest(
      value
    );

  if (!request.query) {
    return [];
  }

  const params =
    new URLSearchParams();

  params.set(
    "q",
    request.query
  );

  if (request.world) {
    params.set(
      "world",
      request.world
    );
  }

  const response =
    await fetch(
      `/api/search?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

  const payload =
    await response.json() as ApiSearchResponse;

  if (!response.ok) {
    throw new Error(
      payload.error ??
      "Search is temporarily unavailable."
    );
  }

  return (
    payload.results ?? []
  )
    .map(
      (
        record
      ): SearchResult | null => {

        const route =
          routeByType[
            record.type
          ];

        if (!route) {
          return null;
        }

        return {
          kind: "entity",
          title:
            record.title,
          subtitle:
            record.subtitle ??
            record.type,
          description:
            record.summary ??
            "",
          geography:
            record.geography ??
            "Global",
          href:
            `/${route}/${record.slug}`,
        };
      }
    )
    .filter(
      (
        result
      ): result is SearchResult =>
        result !== null
    )
    .slice(
      0,
      6
    );
}
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function AskArknozPanel() {

  const [input, setInput] =
    useState("");

  const nextTurnId =
    useRef(2);

  const [turns, setTurns] =
    useState<Turn[]>([
      {
        id: 1,
        role: "arknoz",
        text:
          "Ask me to find something already connected in Arknoz - a project, product, organisation, person, knowledge record, university, opportunity or place.",
      },
    ]);

  async function runQuestion(
    rawValue: string
  ) {

    const value =
      rawValue.trim();

    if (!value) return;

    const baseId =
      nextTurnId.current++;

    const searchId =
      nextTurnId.current++;

    setTurns(
      (current) => [
        ...current,
        {
          id: baseId,
          role: "user",
          text: value,
        },
        {
          id: searchId,
          role: "arknoz",
          text:
            "Searching Arknoz...",
          query: value,
          loading: true,
        },
      ]
    );

    setInput("");

    try {

      const results =
        await conversationalSearch(
          value
        );

      const response =
        results.length > 0
          ? `I found ${results.length} matching Arknoz ${results.length === 1 ? "record" : "records"}.`
          : "I could not find a matching Arknoz record for that request. Try a specific name, place or topic.";

      setTurns(
        (current) =>
          current.map(
            (turn) =>
              turn.id ===
              searchId
                ? {
                    ...turn,
                    text:
                      response,
                    results,
                    loading:
                      false,
                  }
                : turn
          )
      );

    }
    catch {

      setTurns(
        (current) =>
          current.map(
            (turn) =>
              turn.id ===
              searchId
                ? {
                    ...turn,
                    text:
                      "Arknoz search is temporarily unavailable.",
                    results: [],
                    loading:
                      false,
                  }
                : turn
          )
      );
    }
  }
  function submit(
    event: FormEvent
  ) {
    event.preventDefault();
    runQuestion(input);
  }

  return (
    <section
      id="ask-arknoz"
      className="overflow-hidden rounded-[24px] border border-slate-200 bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-[#f8fafc] px-4 py-3">

        <div>
          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-blue-600" />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              ASK ARKNOZ
            </p>

          </div>

          <h2 className="mt-1 text-base font-bold tracking-tight text-slate-950">
            Search Arknoz like a conversation.
          </h2>
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500">
          Arknoz Search
        </span>

      </div>

      <div className="max-h-[190px] space-y-2 overflow-y-auto bg-white p-3">

        {turns.map(
          (turn) => (

            <div
              key={turn.id}
              className={
                turn.role ===
                "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >

              <div
                className={
                  turn.role ===
                  "user"
                    ? "max-w-[82%] rounded-[22px] rounded-br-md bg-[#0b2949] px-5 py-3 text-sm leading-6 text-white"
                    : "max-w-[92%] rounded-[22px] rounded-bl-md border border-slate-200 bg-[#f8fafc] px-5 py-4 text-sm leading-6 text-slate-700"
                }
              >

                <p>
                  {turn.text}
                </p>

                {turn.loading && (
                  <div className="mt-3 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  </div>
                )}

                {turn.results &&
                  turn.results.length >
                    0 && (

                    <div className="mt-4 space-y-2">

                      {turn.results.map(
                        (result) => (

                          <Link
                            key={`${result.kind}-${result.href}`}
                            href={
                              result.href
                            }
                            className="group block rounded-[16px] border border-slate-200 bg-white p-4 transition hover:border-blue-300"
                          >

                            <div className="flex items-start justify-between gap-4">

                              <div>

                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                                  {result.subtitle}
                                </p>

                                <h3 className="mt-1 font-bold text-slate-950">
                                  {result.title}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                  {result.geography}
                                </p>

                              </div>

                              <span className="mt-1 text-blue-700">
                                <ArrowIcon />
                              </span>

                            </div>

                          </Link>
                        )
                      )}

                      {turn.query && (

                        <Link
                          href={`/search?q=${encodeURIComponent(
                            turn.query
                          )}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700"
                        >
                          Open full search
                          <ArrowIcon />
                        </Link>

                      )}

                    </div>
                  )}

              </div>
            </div>
          )
        )}

      </div>

      <div className="border-t border-slate-200 bg-[#f8fafc] p-3">

        <div className="mb-2 flex flex-wrap gap-2">

          {quickPrompts.map(
            (prompt) => (

              <button
                key={prompt}
                type="button"
                onClick={() =>
                  runQuestion(
                    prompt
                  )
                }
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {prompt}
              </button>

            )
          )}

        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white p-1.5 shadow-sm focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100"
        >

          <input
            value={input}
            onChange={
              (event) =>
                setInput(
                  event.target.value
                )
            }
            placeholder="Ask Arknoz..."
            aria-label="Ask Arknoz"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#0f55c8] px-4 py-2 text-xs font-semibold text-white"
          >
            Ask
          </button>

        </form>

        <p className="mt-2 px-2 text-[9px] leading-4 text-slate-500">
          Ask Arknoz searches records currently available in Arknoz.
          If the current record set has no supported match, it says so.
        </p>

      </div>

    </section>
  );
}
