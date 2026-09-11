"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Feature = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};

type TickerItem = {
  text: string;
  href: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  popular: string[];
  featured: Feature[];
  ticker: TickerItem[];
};

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
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const lead = featured[0];
  const secondary = featured.slice(1, 3);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function searchPopular(value: string) {
    setQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#071b31] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=2200&q=82)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,37,.97)_0%,rgba(7,27,49,.92)_45%,rgba(7,27,49,.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06182d]/90 via-transparent to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-132px)] max-w-[1600px] items-center gap-10 px-6 py-8 lg:grid-cols-[1.16fr_.94fr] lg:px-10">
          <div className="max-w-[830px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-[0.96] tracking-[-0.05em] md:text-7xl xl:text-[74px]">
              {title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-7 text-slate-100 md:text-xl">
              {description}
            </p>

            <form
              onSubmit={submitSearch}
              className="mt-7 flex max-w-4xl items-center rounded-full bg-white p-1.5 shadow-[0_24px_70px_rgba(0,0,0,.24)] transition focus-within:ring-4 focus-within:ring-blue-300/25"
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
                className="rounded-full bg-[#0f55c8] px-8 py-3 font-semibold text-white transition hover:bg-[#0b46a8]"
              >
                Search
              </button>
            </form>

            <div className="mt-3.5 flex max-w-4xl flex-wrap items-center gap-2 text-sm">
              <span className="mr-1 text-slate-300">Popular</span>
              {popular.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => searchPopular(item)}
                  className="rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-slate-50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/14"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  ARKNOZ FEATURED NOW
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Selected records connected to this topic.
                </p>
              </div>

              <Link
                href="/featured"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white"
              >
                View all
                <ArrowRight />
              </Link>
            </div>

            {lead ? (
              <div className="grid gap-3 md:grid-cols-[1.35fr_.85fr]">
                <Link
                  href={lead.href}
                  className="group relative min-h-[330px] overflow-hidden rounded-[26px] border border-white/15 bg-slate-900 shadow-2xl"
                >
                  <img
                    src={lead.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      {lead.type}
                    </p>
                    <h2 className="mt-1.5 text-2xl font-bold leading-tight">{lead.title}</h2>
                    <p className="mt-1 text-sm text-slate-200">{lead.meta}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                      Explore record
                      <ArrowRight />
                    </span>
                  </div>
                </Link>

                <div className="grid gap-3">
                  {secondary.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group overflow-hidden rounded-[22px] border border-white/15 bg-white text-slate-950 shadow-xl transition hover:-translate-y-1"
                    >
                      <div className="aspect-[1.75/1] overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="p-3.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                          {item.type}
                        </p>
                        <h3 className="mt-1 font-bold leading-snug">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[26px] border border-white/15 bg-white/5 p-8">
                <p className="text-slate-300">
                  Featured records will appear here as genuine content becomes available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 bg-[#071b31] text-white">
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
