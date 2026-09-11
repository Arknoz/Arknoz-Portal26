$ErrorActionPreference = "Stop"

$target = (Get-Location).Path

if (-not (Test-Path (Join-Path $target "src\app"))) {
    Write-Host "STOP: Run this from C:\Arknoz\apps\web" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "ARKNOZ ASCII-SAFE DISPLAY REPAIR" -ForegroundColor Cyan
Write-Host "Target: $target"
Write-Host ""
$file1 = @'
import Link from "next/link";
import {entities} from "@/lib/entities";
import {getEntityHref} from "@/components/EntityCard";

const pulseSlugs = [
  "bosco-verticale",
  "urban-biodiversity",
  "research-fellowship",
  "milan",
];

export default function BuiltWorldPulse() {
  const items = pulseSlugs
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-white pt-4">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-t-3xl bg-gradient-to-r from-[#0d2a4a] via-[#0a2440] to-[#06192e] text-white">
          <div className="grid gap-6 px-7 py-7 lg:grid-cols-[1.05fr_1.95fr] lg:px-9">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                  ARKNOZ PULSE
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  What is moving across the Built World.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  A compact cross-world view of projects, knowledge, opportunities and places worth following now.
                </p>
              </div>

              <Link href="/explore" className="mt-5 inline-flex w-fit items-center gap-8 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0d2a4a]">
                Explore the pulse <span>-></span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((entity) => {
                if (!entity) return null;
                return (
                  <Link
                    key={entity.slug}
                    href={getEntityHref(entity)}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200">
                      {entity.subtitle}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-snug text-white">
                      {entity.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300">{entity.geography}</p>
                    <div className="mt-5 text-sm font-semibold text-blue-100">Open -></div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 px-7 py-3 text-xs text-slate-300 lg:px-9">
            One platform. Multiple worlds. Connected through genuine relationships and evidence.
          </div>
        </div>
      </div>
    </section>
  );
}

'@
$dest1 = Join-Path $target "src\components\BuiltWorldPulse.tsx"
[System.IO.File]::WriteAllText(
    $dest1,
    $file1,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\BuiltWorldPulse.tsx" -ForegroundColor Green

$file2 = @'
import Link from "next/link";
import {entities} from "@/lib/entities";
import {getEntityHref} from "@/components/EntityCard";

const imageBySlug: Record<string, string> = {
  "urban-biodiversity":"https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
  "bosco-verticale":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "politecnico-di-milano":"https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",
  milan:"https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=80",
  "white-arkitekter":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  "research-fellowship":"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
};

export default function EditorsChoice() {
  const items = [
    "urban-biodiversity",
    "bosco-verticale",
    "politecnico-di-milano",
    "milan",
    "white-arkitekter",
    "research-fellowship",
  ]
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-white pt-5 pb-4">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              CURATED BY ARKNOZ
            </p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Editor's Choice
            </h2>
            <p className="mt-1.5 text-slate-600">
              A purposeful mix of projects, knowledge, institutions, places and opportunities.
            </p>
          </div>
          <Link href="/explore" className="shrink-0 font-semibold text-blue-700">
            View all ->
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {items.map((entity) =>
            entity ? (
              <Link
                key={`${entity.type}-${entity.slug}`}
                href={getEntityHref(entity)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="aspect-[1.7/1] overflow-hidden bg-slate-100">
                  <img src={imageBySlug[entity.slug]} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">{entity.subtitle}</p>
                  <h3 className="mt-1 text-base font-bold leading-snug text-slate-950">{entity.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{entity.geography}</p>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}

'@
$dest2 = Join-Path $target "src\components\EditorsChoice.tsx"
[System.IO.File]::WriteAllText(
    $dest2,
    $file2,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\EditorsChoice.tsx" -ForegroundColor Green

$file3 = @'
"use client";

import Link from "next/link";
import {useRef} from "react";

const worlds = [
  ["Projects","Buildings, infrastructure and built-environment projects.","/projects","https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"],
  ["Products","Materials, components, systems and technologies.","/products","https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80"],
  ["Knowledge","Research, standards, publications and evidence.","/knowledge","https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80"],
  ["Learning & Education","Courses, programmes, skills and professional learning.","/learning","https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"],
  ["Opportunities","Jobs, internships, competitions, grants and more.","/opportunities","https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"],
  ["People","Professionals, experts, researchers and educators.","/people","https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"],
  ["Organisations","Practices, manufacturers, institutions and bodies.","/organisations","https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"],
  ["Universities","Higher education, research and programmes.","/universities","https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80"],
  ["Places","Countries, regions, cities and local context.","/places","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80"],
] as const;

export default function ExploreWorlds() {
  const rail = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    rail.current?.scrollBy({left: direction * 760, behavior: "smooth"});
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
            <Link href="/explore" className="hidden font-semibold text-blue-700 sm:inline">
              View all ->
            </Link>
            <button type="button" onClick={() => move(-1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"><</button>
            <button type="button" onClick={() => move(1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">></button>
          </div>
        </div>

        <div ref={rail} className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {worlds.map(([title, description, href, image]) => (
            <Link key={href} href={href} className="group min-w-[220px] max-w-[220px] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg md:min-w-[235px] md:max-w-[235px]">
              <div className="aspect-[1.55/1] overflow-hidden bg-slate-100">
                <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="flex min-h-[142px] flex-col p-4">
                <h3 className="font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
                <span className="mt-auto pt-3 font-semibold text-blue-700">-></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'@
$dest3 = Join-Path $target "src\components\ExploreWorlds.tsx"
[System.IO.File]::WriteAllText(
    $dest3,
    $file3,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\ExploreWorlds.tsx" -ForegroundColor Green

$file4 = @'
export type FooterMetrics = {
  visitorsToday?: string | number | null;
  members?: string | number | null;
  projects?: string | number | null;
  productsSystems?: string | number | null;
  knowledgeItems?: string | number | null;
  opportunities?: string | number | null;
};

function show(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

export default function FooterMetricsPanel({
  metrics,
}: {
  metrics?: FooterMetrics;
}) {
  const items = [
    ["Visitors today", metrics?.visitorsToday],
    ["Members", metrics?.members],
    ["Projects", metrics?.projects],
    ["Products & systems", metrics?.productsSystems],
    ["Knowledge", metrics?.knowledgeItems],
    ["Opportunities", metrics?.opportunities],
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4">
      <div className="grid gap-4 xl:grid-cols-[250px_1fr] xl:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
            ARKNOZ AT A GLANCE
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            Live platform data
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Genuine analytics and database values only.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {items.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#0a223c] px-4 py-3"
            >
              <div className="text-xl font-bold leading-none text-white">
                {show(value)}
              </div>
              <div className="mt-1.5 text-[12px] leading-4 text-slate-300">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'@
$dest4 = Join-Path $target "src\components\FooterMetricsPanel.tsx"
[System.IO.File]::WriteAllText(
    $dest4,
    $file4,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\FooterMetricsPanel.tsx" -ForegroundColor Green

$file5 = @'
import Image from "next/image";
import Link from "next/link";
import FooterMetricsPanel, {
  type FooterMetrics,
} from "@/components/FooterMetricsPanel";
import LanguageControl from "@/components/LanguageControl";

const exploreA = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
];

const exploreB = [
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
  ["Community", "/community"],
];

const discover = [
  ["Global", "/global"],
  ["Africa", "/global/africa"],
  ["Asia", "/global/asia"],
  ["Europe", "/global/europe"],
  ["North America", "/global/north-america"],
  ["South America", "/global/south-america"],
  ["Oceania", "/global/oceania"],
];

const arknoz = [
  ["About Arknoz", "/about"],
  ["Our Mission", "/about"],
  ["Contribute", "/community"],
  ["Contact", "/about"],
  ["Help Centre", "/about"],
  ["Privacy", "/about"],
  ["Terms", "/about"],
  ["Accessibility", "/about"],
];

export default function GlobalFooter({
  metrics,
}: {
  metrics?: FooterMetrics;
}) {
  return (
    <footer className="bg-[#06192e] text-slate-300">
      <div className="mx-auto max-w-[1600px] px-6 pt-6 pb-4 lg:px-10">
        <FooterMetricsPanel metrics={metrics} />

        <div className="mt-6 grid gap-7 lg:grid-cols-[1.15fr_.8fr_.85fr_1.15fr]">
          <div>
            <h3 className="text-sm font-bold text-white">Explore Arknoz</h3>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1.5 text-[13px] leading-5">
              <div className="grid content-start gap-1.5">
                {exploreA.map(([label, href]) => (
                  <Link key={label} href={href} className="hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>

              <div className="grid content-start gap-1.5">
                {exploreB.map(([label, href]) => (
                  <Link key={label} href={href} className="hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-5 max-w-md text-[13px] leading-5 text-slate-400">
              One global portal connecting people, places, projects, products,
              knowledge, learning and opportunities across the Built World.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Discover</h3>
            <div className="mt-4 grid gap-1.5 text-[13px] leading-5">
              {discover.map(([label, href]) => (
                <Link key={label} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Arknoz</h3>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1.5 text-[13px] leading-5 lg:grid-cols-1">
              {arknoz.map(([label, href]) => (
                <Link key={label} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <LanguageControl dark />

              <Link
                href="/global"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
              >
                 Global
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Stay informed</h3>
            <p className="mt-4 max-w-sm text-[13px] leading-5">
              Projects, knowledge, opportunities and Arknoz developments.
            </p>

            <form className="mt-4 flex">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Your email address"
                className="min-w-0 flex-1 rounded-l-lg bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-200">
                Community
              </p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-5">
                <Link href="/community" className="hover:text-white">Members</Link>
                <Link href="/community" className="hover:text-white">Collaboration</Link>
                <Link href="/community" className="hover:text-white">Contribution</Link>
                <Link href="/community" className="hover:text-white">Chapters</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
            <div className="rounded-xl bg-white px-3 py-2.5">
              <Image
                src="/brand/arknoz-logo.png"
                alt="Arknoz - The Digital Built World"
                width={210}
                height={54}
                className="h-auto w-[205px] max-w-full object-contain"
              />
            </div>

            <div className="text-[11px] leading-5 text-slate-400">
              <p>(c) 2026 Arknoz Private Limited. All rights reserved.</p>
              <p className="mt-0.5">English is the Arknoz interface language.</p>
            </div>

            <div className="flex flex-col items-start gap-1 text-[11px] text-slate-400 md:items-end">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link href="/about" className="hover:text-white">Privacy</Link>
                <Link href="/about" className="hover:text-white">Terms</Link>
                <Link href="/about" className="hover:text-white">Accessibility</Link>
              </div>
              <span>Knowledge today. A better built tomorrow.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

'@
$dest5 = Join-Path $target "src\components\GlobalFooter.tsx"
[System.IO.File]::WriteAllText(
    $dest5,
    $file5,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\GlobalFooter.tsx" -ForegroundColor Green

$file6 = @'
"use client";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
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
              {label === "Global" && <span className="text-[10px]">v</span>}
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

          <Link href="/join" className="rounded-md bg-[#17315c] px-4 py-2.5 font-semibold text-white hover:bg-[#102541]">
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
$dest6 = Join-Path $target "src\components\GlobalHeader.tsx"
[System.IO.File]::WriteAllText(
    $dest6,
    $file6,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\GlobalHeader.tsx" -ForegroundColor Green

$file7 = @'
"use client";

import Link from "next/link";
import {FormEvent, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {entities} from "@/lib/entities";
import {getEntityHref} from "@/components/EntityCard";

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
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-100">
            PEOPLE | PLACES | IDEAS | SOLUTIONS
          </p>

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
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
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
              className="shrink-0 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              View all ->
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
                    <p className="mt-1 text-xs text-slate-500">{entity.geography}</p>
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
$dest7 = Join-Path $target "src\components\GlobalHero.tsx"
[System.IO.File]::WriteAllText(
    $dest7,
    $file7,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\GlobalHero.tsx" -ForegroundColor Green

$file8 = @'
export default function LanguageControl({
  compact = false,
  dark = false,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <span
      aria-label="English"
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
        dark
          ? "border border-white/15 bg-white/5 text-white"
          : "text-slate-700",
      ].join(" ")}
    >
      <span>{compact ? "EN" : "English"}</span>
    </span>
  );
}

'@
$dest8 = Join-Path $target "src\components\LanguageControl.tsx"
[System.IO.File]::WriteAllText(
    $dest8,
    $file8,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\LanguageControl.tsx" -ForegroundColor Green

$file9 = @'
import Link from "next/link";

const messages = [
  "Projects, knowledge and opportunities connected across one Built World.",
  "Explore by country, city, topic, organisation or university.",
  "Arknoz Phase 1: Explore is available now.",
];

export default function LiveTicker() {
  return (
    <div className="border-y border-white/10 bg-[#06192e] text-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-5 overflow-hidden px-6 py-3 lg:px-10">
        <div className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">
          <span>LIVE NOW</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-max items-center gap-8 text-sm text-slate-200">
            {messages.map((item) => (
              <span key={item}>- {item}</span>
            ))}
          </div>
        </div>

        <Link href="/explore" className="shrink-0 text-sm font-semibold">
          What's new ->
        </Link>
      </div>
    </div>
  );
}

'@
$dest9 = Join-Path $target "src\components\LiveTicker.tsx"
[System.IO.File]::WriteAllText(
    $dest9,
    $file9,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\LiveTicker.tsx" -ForegroundColor Green

$file10 = @'
import Link from "next/link";

export default function M01ActionConnectionsRow() {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-3xl bg-[#0d2a4a] p-7 text-white md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            YOUR BUILT WORLD
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Be part of a more connected Built World.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Save what matters, follow topics and places, build collections and continue where you left off.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Save & follow","Collections","Opportunities","Personal discovery"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/join" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0d2a4a]">
              Join Arknoz ->
            </Link>
            <span className="text-xs text-slate-300">Phase 1 membership remains free.</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 md:p-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Follow the Connections
          </h2>
          <p className="mt-2 text-slate-600">
            See how one Built World record leads naturally to another.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold">
            {["Project","Product / System","Knowledge","People / Organisation","Place"].map((item,index,arr) => (
              <div key={item} className="contents">
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2">{item}</span>
                {index < arr.length - 1 && <span className="text-blue-700">-></span>}
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
            Factual links show why records are connected when evidence supports the relationship.
          </p>
        </div>
      </div>
    </section>
  );
}

'@
$dest10 = Join-Path $target "src\components\M01ActionConnectionsRow.tsx"
[System.IO.File]::WriteAllText(
    $dest10,
    $file10,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\M01ActionConnectionsRow.tsx" -ForegroundColor Green

$file11 = @'
import Link from "next/link";

export default function M01CommunityDiscoverRow() {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            ARKNOZ COMMUNITY
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            People, ideas and participation around the Built World.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Members can discover collaboration, contribute knowledge and follow Arknoz development.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Members","Collaboration","Contribution","News & Development","Competitions & Jobs","Chapters"].map((item) => (
              <Link key={item} href="/community" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 hover:border-blue-300">
                {item}
              </Link>
            ))}
          </div>

          <Link href="/community" className="mt-6 inline-flex font-semibold text-blue-700">
            Go to Community ->
          </Link>
        </div>

        <div className="rounded-3xl bg-slate-50 p-7 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            DISCOVER NOW
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            A broader view of the Built World.
          </h2>
          <p className="mt-3 text-slate-600">
            Hand-picked cross-world discovery for visitors.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["/projects","Buildings, infrastructure and built-environment projects."],
              ["/knowledge","Research, standards, publications and evidence."],
              ["/places","Countries, regions, cities and local context."],
              ["/opportunities","Jobs, internships, competitions, grants and more."],
            ].map(([href,text]) => (
              <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-5 text-slate-700 hover:border-blue-300">
                {text}
              </Link>
            ))}
          </div>

          <Link href="/explore" className="mt-6 inline-flex font-semibold text-blue-700">
            Explore more ->
          </Link>
        </div>
      </div>
    </section>
  );
}

'@
$dest11 = Join-Path $target "src\components\M01CommunityDiscoverRow.tsx"
[System.IO.File]::WriteAllText(
    $dest11,
    $file11,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\M01CommunityDiscoverRow.tsx" -ForegroundColor Green

$file12 = @'
"use client";

import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {entities} from "@/lib/entities";
import {getEntityHref} from "@/components/EntityCard";

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

            <Link href="/global" className="shrink-0 font-semibold text-blue-700">
              View world ->
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
            <button type="button" onClick={go} className="rounded-full bg-[#0d2a4a] px-6 py-2.5 font-semibold text-white">
              Go
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            <Link href="/global" className="col-span-2 rounded-2xl bg-[#0d2a4a] p-5 text-white md:col-span-1">
              <p className="text-xs uppercase tracking-[0.16em] text-blue-200">GLOBAL</p>
              <h3 className="mt-3 text-xl font-bold">One Built World</h3>
            </Link>

            {geoLinks.map(([label, href]) => (
              <Link key={label} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-blue-300">
                {label} <span className="float-end text-blue-700">-></span>
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Quick places</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickLinks.map(([label, href]) => (
                <Link key={label} href={href} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-blue-300">
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
            <Link href="/explore" className="shrink-0 font-semibold text-blue-700">
              View all ->
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
                  <h3 className="mt-2 text-lg font-bold text-slate-950">{entity.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{entity.geography}</p>
                  <span className="mt-4 inline-flex font-semibold text-blue-700">Open -></span>
                </Link>
              ) : null
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700">
              More projects ->
            </Link>
            <Link href="/knowledge" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700">
              More knowledge ->
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'@
$dest12 = Join-Path $target "src\components\M01WorldFeatureSplit.tsx"
[System.IO.File]::WriteAllText(
    $dest12,
    $file12,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\M01WorldFeatureSplit.tsx" -ForegroundColor Green

$file13 = @'
import Link from "next/link";

export default function PhaseRoadmap() {
  const phases = [
    {
      title:"01 EXPLORE",
      status:"AVAILABLE NOW",
      headline:"The Built World organised.",
      text:"Search, discover and follow the Built World globally.",
      href:"/explore",
      action:"Start exploring ->",
      className:"border-blue-200 bg-blue-50",
      accent:"text-blue-700",
    },
    {
      title:"02 CONNECT",
      status:"COMING JAN 2027",
      headline:"The Built World made useful.",
      text:"Compare, collaborate, organise and grow together.",
      href:"/connect",
      action:"Preview Connect ->",
      className:"border-slate-200 bg-white",
      accent:"text-slate-950",
    },
    {
      title:"03 INTELLIGENCE",
      status:"PLANNED APR 2027",
      headline:"The Built World understood.",
      text:"Evidence-led insight where Arknoz has sufficient trusted data.",
      href:"/intelligence",
      action:"Preview Intelligence ->",
      className:"border-purple-200 bg-purple-50",
      accent:"text-purple-700",
    },
  ];

  return (
    <section id="roadmap" className="bg-slate-50 py-8">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="mb-5 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              ARKNOZ ROADMAP
            </p>
            <h2 className="mt-1.5 text-3xl font-bold text-slate-950">
              Explore -> Connect -> Intelligence
            </h2>
          </div>

          <p className="hidden max-w-xl text-right text-sm text-slate-600 md:block">
            Each later phase activates only when the product and data are ready.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map((phase) => (
            <div key={phase.title} className={`rounded-2xl border p-6 ${phase.className}`}>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-bold ${phase.accent}`}>{phase.title}</span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                  {phase.status}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-950">{phase.headline}</h3>
              <p className="mt-2 text-slate-600">{phase.text}</p>
              <Link href={phase.href} className={`mt-5 inline-flex font-semibold ${phase.accent}`}>
                {phase.action}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'@
$dest13 = Join-Path $target "src\components\PhaseRoadmap.tsx"
[System.IO.File]::WriteAllText(
    $dest13,
    $file13,
    (New-Object System.Text.UTF8Encoding($false))
)
Write-Host "Repaired: src\components\PhaseRoadmap.tsx" -ForegroundColor Green


$delete = @(
    "src\proxy.ts",
    "src\lib\i18n.ts",
    "src\lib\m01Translations.ts"
)

foreach ($rel in $delete) {
    $p = Join-Path $target $rel
    if (Test-Path $p) {
        Remove-Item -Force $p
        Write-Host "Removed: $rel" -ForegroundColor Yellow
    }
}

$next = Join-Path $target ".next"
if (Test-Path $next) {
    Remove-Item -Recurse -Force $next
    Write-Host "Removed: .next cache" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PASS: M01 source is now ASCII-safe English." -ForegroundColor Green
Write-Host "No raw emoji, arrows, bullets, middle dots or other risky Unicode remain in the repaired components." -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm.cmd run dev" -ForegroundColor Cyan
