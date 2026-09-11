"use client";

import { useRef } from "react";
import EntityCard from "@/components/EntityCard";
import { entities } from "@/lib/entities";

export default function FeaturedAcrossWorld() {
  const rail = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    rail.current?.scrollBy({
      left: direction * 760,
      behavior: "smooth",
    });
  }

  const featured = entities.slice(0, 6);

  return (
    <section
      id="featured"
      className="scroll-mt-24 bg-white py-12"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Featured Across the Built World
            </h2>

            <p className="mt-2 text-slate-600">
              Projects, products, knowledge, people, organisations and more.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous featured items"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl shadow-sm hover:bg-slate-50"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next featured items"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl shadow-sm hover:bg-slate-50"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={rail}
          className="mt-8 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featured.map((entity) => (
            <EntityCard key={`${entity.type}-${entity.slug}`} entity={entity} />
          ))}
        </div>
      </div>
    </section>
  );
}
