
$ErrorActionPreference = "Stop"

$target = "C:\Arknoz\apps\web\src\components\ExploreWorlds.tsx"

$content = @'
"use client";

import Link from "next/link";
import { useRef } from "react";

const worlds = [
  [
    "Projects",
    "Buildings, infrastructure and built-environment projects.",
    "/projects",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Products",
    "Materials, components, systems and technologies.",
    "/products",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Knowledge",
    "Research, standards, publications and evidence.",
    "/knowledge",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Learning & Education",
    "Courses, programmes, skills and professional learning.",
    "/learning",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Opportunities",
    "Jobs, internships, competitions, grants and more.",
    "/opportunities",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "People",
    "Professionals, experts, researchers and educators.",
    "/people",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Organisations",
    "Practices, manufacturers, institutions and bodies.",
    "/organisations",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Universities",
    "Higher education, research and programmes.",
    "/universities",
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Places",
    "Countries, regions, cities and local context.",
    "/places",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  ],
] as const;

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
            <Link
              href="/explore"
              className="hidden font-semibold text-blue-700 sm:inline"
            >
              View all
            </Link>

            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous"
              className="flex h-10 min-w-16 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next"
              className="flex h-10 min-w-16 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm"
            >
              Next
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

                <p className="mt-2 text-sm leading-5 text-slate-600">
                  {description}
                </p>

                <span className="mt-auto pt-3 font-semibold text-blue-700">
                  Open
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

[System.IO.File]::WriteAllText(
    $target,
    $content,
    (New-Object System.Text.UTF8Encoding($false))
)

$next = "C:\Arknoz\apps\web\.next"
if (Test-Path $next) {
    Remove-Item -Recurse -Force $next
}

Write-Host "ExploreWorlds.tsx replaced successfully." -ForegroundColor Green
Write-Host "Now run: npm.cmd run dev" -ForegroundColor Cyan
