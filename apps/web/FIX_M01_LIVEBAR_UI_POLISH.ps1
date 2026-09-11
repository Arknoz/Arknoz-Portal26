$ErrorActionPreference = "Stop"

$target = (Get-Location).Path
if (-not (Test-Path (Join-Path $target "src\app"))) {
    Write-Host "STOP: Run this from C:\Arknoz\apps\web" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "ARKNOZ M01 LIVE BAR + UI POLISH" -ForegroundColor Cyan
Write-Host ""
$file1 = @'
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LanguageControl from "@/components/LanguageControl";

const nav = [
  ["Home", "/"],
  ["Explore", "/explore"],
  ["Connect", "/connect"],
  ["Intelligence", "/intelligence"],
  ["Global", "/global"],
] as const;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6.5" y="10" width="11" height="9" rx="2" />
      <path d="M9 10V7.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

export default function GlobalHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/brand/arknoz-logo.png"
            alt="Arknoz - The Digital Built World"
            width={230}
            height={58}
            priority
            className="h-[54px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="flex items-center gap-1.5 hover:text-[#17315c]">
              {label}
              {(label === "Connect" || label === "Intelligence") && <LockIcon />}
              {label === "Global" && <ChevronDown />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 text-sm text-slate-700 md:flex">
          <Link href="/search" aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100">
            <SearchIcon />
          </Link>

          <LanguageControl compact />

          <Link href="/sign-in" className="px-2 hover:text-[#17315c]">
            Sign in
          </Link>

          <Link
            href="/join"
            className="rounded-md bg-[#17315c] px-4 py-2.5 font-semibold text-white hover:bg-[#102541]"
          >
            Join Arknoz
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Open Arknoz menu"
          aria-expanded={open}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="px-5 py-5">
            <nav className="flex flex-col">
              {nav.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 border-b border-slate-100 py-4 font-semibold text-slate-800"
                >
                  {label}
                  {(label === "Connect" || label === "Intelligence") && <LockIcon />}
                </Link>
              ))}
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link href="/search" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold">
                Search
              </Link>

              <div className="flex items-center justify-center rounded-lg border border-slate-300">
                <LanguageControl />
              </div>

              <Link href="/sign-in" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold">
                Sign in
              </Link>

              <Link href="/join" onClick={() => setOpen(false)} className="rounded-lg bg-[#17315c] px-4 py-3 text-center font-semibold text-white">
                Join Arknoz
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'@
$dest1 = Join-Path $target "src\components\GlobalHeader.tsx"
[System.IO.File]::WriteAllText(
    $dest1,
    $file1,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Updated: src\components\GlobalHeader.tsx" -ForegroundColor Green

$file2 = @'
"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const popular = [
  "sustainable buildings",
  "mass timber",
  "BIM",
  "climate resilient cities",
  "universities",
  "jobs",
  "India",
  "green infrastructure",
];

const imageBySlug: Record<string, string> = {
  "bosco-verticale":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
  "urban-biodiversity":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=80",
  "politecnico-di-milano":
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=80",
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
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function GlobalHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const featured = useMemo(
    () =>
      ["bosco-verticale", "urban-biodiversity", "politecnico-di-milano"]
        .map((slug) => entities.find((entity) => entity.slug === slug))
        .filter(Boolean),
    []
  );

  function runSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function searchFor(value: string) {
    setQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  const heroWords = ["PEOPLE", "PLACES", "IDEAS", "SOLUTIONS"];

  return (
    <section id="search" className="relative overflow-hidden bg-[#08203d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=2200&q=82)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#081c34]/95 via-[#0b2d50]/82 to-[#0b2a48]/76" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06182d]/80 via-transparent to-transparent" />

      <div className="relative mx-auto grid min-h-[620px] max-w-[1600px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.45fr_.95fr] lg:px-10">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.24em] text-blue-100">
            {heroWords.map((word, index) => (
              <span key={word} className="flex items-center gap-2">
                <span>{word}</span>
                {index < heroWords.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-blue-100/80" />
                )}
              </span>
            ))}
          </div>

          <h1 className="mt-6 max-w-[820px] text-5xl font-bold leading-[0.94] tracking-[-0.045em] md:text-7xl xl:text-[86px]">
            One Built World.
            <br />
            Connected.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-7 text-slate-100 md:text-xl">
            Discover projects, products, knowledge, learning, opportunities,
            people, organisations, universities and places across the Built World.
          </p>

          <form
            onSubmit={runSearch}
            className="mt-9 flex max-w-4xl items-center rounded-full bg-white p-1.5 shadow-2xl"
          >
            <span className="pl-5 text-slate-500">
              <SearchIcon />
            </span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Built World..."
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-slate-900 outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-[#0f55c8] px-8 py-3.5 font-semibold text-white transition hover:bg-[#0b46a8]"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex max-w-5xl flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 text-slate-200">Popular:</span>
            {popular.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => searchFor(item)}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-slate-50 backdrop-blur-sm transition hover:bg-white/20"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="self-center">
          <div className="mb-3 flex items-center justify-between gap-5">
            <p className="text-sm font-bold uppercase tracking-[0.13em] text-blue-100">
              ARKNOZ FEATURED NOW
            </p>

            <a
              href="#featured"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              View all
              <ArrowRight />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {featured.map((entity) => {
              if (!entity) return null;

              return (
                <Link
                  key={`${entity.type}-${entity.slug}`}
                  href={getEntityHref(entity)}
                  className="group overflow-hidden rounded-2xl border border-white/20 bg-white text-slate-950 shadow-2xl transition hover:-translate-y-1"
                >
                  <div className="aspect-[1.35/1] overflow-hidden bg-slate-100">
                    <img
                      src={imageBySlug[entity.slug]}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {entity.subtitle}
                    </p>
                    <h2 className="mt-1 text-lg font-bold leading-tight">
                      {entity.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {entity.geography}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-5 text-right text-xs uppercase tracking-[0.22em] text-slate-200">
            A MORE CONNECTED AND SUSTAINABLE BUILT ENVIRONMENT FOR A BETTER TOMORROW.
          </p>
        </div>
      </div>
    </section>
  );
}

'@
$dest2 = Join-Path $target "src\components\GlobalHero.tsx"
[System.IO.File]::WriteAllText(
    $dest2,
    $file2,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Updated: src\components\GlobalHero.tsx" -ForegroundColor Green

$file3 = @'
"use client";

import Link from "next/link";

const messages = [
  "Projects, knowledge and opportunities connected across one Built World.",
  "Explore by country, city, topic, organisation or university.",
  "Arknoz Phase 1: Explore is available now.",
];

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

function MessageGroup() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {messages.map((item) => (
        <span key={item} className="flex items-center gap-3 whitespace-nowrap">
          <span className="h-1 w-1 rounded-full bg-blue-300" />
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
}

export default function LiveTicker() {
  return (
    <div className="border-y border-white/10 bg-[#06192e] text-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-5 px-6 py-3 lg:px-10">
        <div className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">
          <span>LIVE NOW</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="arknoz-ticker-track flex w-max items-center text-sm text-slate-200">
            <MessageGroup />
            <MessageGroup />
          </div>
        </div>

        <Link href="/explore" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
          What's new
          <ArrowRight />
        </Link>
      </div>

      <style jsx>{`
        .arknoz-ticker-track {
          animation: arknozTicker 28s linear infinite;
          will-change: transform;
        }

        .arknoz-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes arknozTicker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .arknoz-ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

'@
$dest3 = Join-Path $target "src\components\LiveTicker.tsx"
[System.IO.File]::WriteAllText(
    $dest3,
    $file3,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Updated: src\components\LiveTicker.tsx" -ForegroundColor Green

$file4 = @'
"use client";

import Link from "next/link";
import { useRef } from "react";

const worlds = [
  ["Projects", "Buildings, infrastructure and built-environment projects.", "/projects", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"],
  ["Products", "Materials, components, systems and technologies.", "/products", "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80"],
  ["Knowledge", "Research, standards, publications and evidence.", "/knowledge", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80"],
  ["Learning & Education", "Courses, programmes, skills and professional learning.", "/learning", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"],
  ["Opportunities", "Jobs, internships, competitions, grants and more.", "/opportunities", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"],
  ["People", "Professionals, experts, researchers and educators.", "/people", "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"],
  ["Organisations", "Practices, manufacturers, institutions and bodies.", "/organisations", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"],
  ["Universities", "Higher education, research and programmes.", "/universities", "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80"],
  ["Places", "Countries, regions, cities and local context.", "/places", "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80"],
] as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 5-5 5 5 5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m8 5 5 5-5 5" />
    </svg>
  );
}

export default function ExploreWorlds() {
  const rail = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    rail.current?.scrollBy({
      left: direction * 760,
      behavior: "smooth",
    });
  }

  return (
    <section id="explore" className="scroll-mt-24 bg-white pt-9 pb-5">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Explore the Built World
            </h2>
            <p className="mt-2 text-slate-600">
              Nine ways to discover, learn and take action.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/explore" className="hidden items-center gap-1.5 font-semibold text-blue-700 sm:inline-flex">
              View all
              <ArrowRight />
            </Link>

            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-blue-300"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-blue-300"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={rail}
          className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {worlds.map(([title, description, href, image]) => (
            <Link
              key={href}
              href={href}
              className="group min-w-[220px] max-w-[220px] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg md:min-w-[235px] md:max-w-[235px]"
            >
              <div className="aspect-[1.55/1] overflow-hidden bg-slate-100">
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex min-h-[142px] flex-col p-4">
                <h3 className="font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-semibold text-blue-700">
                  Open
                  <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'@
$dest4 = Join-Path $target "src\components\ExploreWorlds.tsx"
[System.IO.File]::WriteAllText(
    $dest4,
    $file4,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Updated: src\components\ExploreWorlds.tsx" -ForegroundColor Green

$file5 = @'
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const featuredSlugs = [
  "bosco-verticale",
  "urban-biodiversity",
  "politecnico-di-milano",
  "white-arkitekter",
];

const geoLinks = [
  ["Africa", "/global/africa"],
  ["Asia", "/global/asia"],
  ["Europe", "/global/europe"],
  ["North America", "/global/north-america"],
  ["South America", "/global/south-america"],
  ["Oceania", "/global/oceania"],
] as const;

const quickLinks = [
  ["India", "/global/india"],
  ["Kenya", "/global/kenya"],
  ["Singapore", "/global/singapore"],
  ["UAE", "/global/uae"],
  ["Japan", "/global/japan"],
  ["Mumbai", "/global/mumbai"],
  ["Nairobi", "/global/nairobi"],
] as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function M01WorldFeatureSplit() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const featured = featuredSlugs
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  function go() {
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <section id="featured" className="scroll-mt-24 bg-white py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Explore the World
              </h2>
              <p className="mt-2 text-slate-600">
                One global Arknoz. Local relevance where it matters.
              </p>
            </div>

            <Link href="/global" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700">
              View world
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-5 flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Search a country, city or region..."
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 outline-none"
            />

            <button
              type="button"
              onClick={go}
              className="rounded-full bg-[#0d2a4a] px-6 py-2.5 font-semibold text-white"
            >
              Go
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            <Link href="/global" className="col-span-2 rounded-2xl bg-[#0d2a4a] p-5 text-white md:col-span-1">
              <p className="text-xs uppercase tracking-[0.16em] text-blue-200">
                GLOBAL
              </p>
              <h3 className="mt-3 text-xl font-bold">One Built World</h3>
            </Link>

            {geoLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-blue-300"
              >
                <span>{label}</span>
                <span className="text-blue-700">
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="font-bold text-slate-950">One global format. Local truth.</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Geography changes relevance and context - not canonical truth.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Quick places
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-blue-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Featured Across the Built World
              </h2>
              <p className="mt-2 text-slate-600">
                Genuine records from different parts of Arknoz.
              </p>
            </div>

            <Link href="/explore" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700">
              View all
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {featured.map((entity) =>
              entity ? (
                <Link
                  key={`${entity.type}-${entity.slug}`}
                  href={getEntityHref(entity)}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    {entity.subtitle}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">
                    {entity.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {entity.geography}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blue-700">
                    Open
                    <ArrowRight />
                  </span>
                </Link>
              ) : null
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700">
              More projects
              <ArrowRight />
            </Link>
            <Link href="/knowledge" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700">
              More knowledge
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'@
$dest5 = Join-Path $target "src\components\M01WorldFeatureSplit.tsx"
[System.IO.File]::WriteAllText(
    $dest5,
    $file5,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Updated: src\components\M01WorldFeatureSplit.tsx" -ForegroundColor Green


$next = Join-Path $target ".next"
if (Test-Path $next) {
    Remove-Item -Recurse -Force $next
    Write-Host "Cleared: .next cache" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "DONE." -ForegroundColor Green
Write-Host "Live bar now scrolls continuously." -ForegroundColor Green
Write-Host "ASCII text arrows have been replaced with SVG icons." -ForegroundColor Green
Write-Host "Header Global dropdown now uses a clean chevron." -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm.cmd run dev" -ForegroundColor Cyan
