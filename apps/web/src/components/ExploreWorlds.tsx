"use client";

import Link from "next/link";
import { useRef } from "react";

import {
  arknozSections,
  isPaidArknozSection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";

const imageBySection:
  Record<
    ArknozSectionKey,
    string
  > = {
  projects:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",

  products:
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",

  knowledge:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",

  learning:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",

  opportunities:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",

  people:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",

  organisations:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",

  universities:
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",

  places:
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",

  community:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",

  connect:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",

  intelligence:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
};

const worlds =
  arknozSections.map(
    (section) => ({
      key: section.key,
      title: section.title,
      description:
        section.description,
      href: section.href,
      image:
        imageBySection[
          section.key
        ],
      paid:
        isPaidArknozSection(
          section.key
        ),
    })
  );

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

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="6"
        y="10"
        width="12"
        height="9"
        rx="2"
      />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 5-5 5 5 5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m8 5 5 5-5 5" />
    </svg>
  );
}

export default function ExploreWorlds() {
  const rail =
    useRef<HTMLDivElement>(
      null
    );

  function move(
    direction: number
  ) {
    rail.current?.scrollBy({
      left:
        direction * 860,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="explore"
      className="scroll-mt-24 bg-[#f6f8fb] py-10"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="rounded-[30px] bg-[#0b2949] p-6 text-white md:p-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                EXPLORE
              </p>

              <h2 className="mt-1.5 text-3xl font-bold tracking-tight md:text-4xl">
                Twelve ways into the Built World.
              </h2>

              <p className="mt-2 max-w-2xl text-slate-300">
                Start with what matters to you, then follow the connections.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="group hidden items-center gap-1.5 font-semibold text-white sm:inline-flex"
              >
                View all
                <ArrowRight />
              </Link>

              <button
                type="button"
                onClick={() =>
                  move(-1)
                }
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                onClick={() =>
                  move(1)
                }
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div
            ref={rail}
            className="mt-6 flex snap-x gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {worlds.map(
              (world) => (
                <Link
                  key={
                    world.key
                  }
                  href={
                    world.href
                  }
                  className="group relative min-w-[250px] max-w-[250px] snap-start overflow-hidden rounded-[24px] bg-slate-950 md:min-w-[280px] md:max-w-[280px]"
                >
                  <div className="aspect-[1/1.05] overflow-hidden">
                    <img
                      src={
                        world.image
                      }
                      alt=""
                      className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
                        world.paid
                          ? "opacity-60"
                          : "opacity-90"
                      }`}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/18 to-transparent" />

                  {world.paid && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                      <LockIcon />
                      Arknoz Pro
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="text-xl font-bold">
                      {world.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-200">
                      {
                        world.description
                      }
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                      {world.paid
                        ? "Preview Arknoz Pro"
                        : "Explore"}

                      {world.paid
                        ? <LockIcon />
                        : <ArrowRight />}
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}