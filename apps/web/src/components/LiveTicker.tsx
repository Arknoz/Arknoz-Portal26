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
    <div className="flex shrink-0 items-center gap-10 pr-10">
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
          animation: arknozTicker 36s linear infinite;
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
