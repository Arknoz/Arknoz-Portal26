"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

const phases = [
  [
    "01",
    "EXPLORE",
    "AVAILABLE NOW",
    "The Built World organised.",
    "Search, discover and follow the Built World globally.",
    "/explore",
    "Start exploring",
  ],
  [
    "02",
    "CONNECT",
    "COMING JAN 2027",
    "The Built World made useful.",
    "Compare, collaborate, organise and grow together.",
    "/connect",
    "Preview Connect",
  ],
  [
    "03",
    "INTELLIGENCE",
    "PLANNED APR 2027",
    "The Built World understood.",
    "Evidence-led insight where Arknoz has sufficient trusted data.",
    "/intelligence",
    "Preview Intelligence",
  ],
] as const;

const spotlightItems = [
  {
    eyebrow: "ARKNOZ SPOTLIGHT",
    title: "Real Projects. Global Impact.",
    text: "Explore how projects, knowledge and people connect across the Built World.",
    href: "/projects",
    action: "Explore projects",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=82",
  },
  {
    eyebrow: "DISCOVER THE WORLD",
    title: "Move from place to possibility.",
    text: "Explore countries, cities and local Built World context through one global structure.",
    href: "/global",
    action: "Explore places",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=82",
  },
  {
    eyebrow: "CONTRIBUTE",
    title: "Useful knowledge grows through contribution.",
    text: "Join Arknoz and help strengthen the quality and reach of Built World information.",
    href: "/community",
    action: "Open community",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=82",
  },
  {
    eyebrow: "PHASE 1",
    title: "Explore is available now.",
    text: "Search across projects, products, knowledge, people, organisations, universities and places.",
    href: "/explore",
    action: "Start exploring",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=82",
  },
] as const;

export default function PhaseRoadmap() {
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % spotlightItems.length);
    }, 5 * 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  const spotlight = spotlightItems[spotlightIndex];

  return (
    <section id="roadmap" className="bg-[#f6f8fb] py-10">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white text-slate-950 shadow-sm">
          <div className="grid gap-6 p-7 lg:grid-cols-[.68fr_1.32fr] lg:p-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  ARKNOZ ROADMAP
                </p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#0b1733]">
                  Explore.
                  <br />
                  Connect.
                  <br />
                  Intelligence.
                </h2>
                <p className="mt-4 max-w-md leading-7 text-slate-600">
                  Each later phase activates only when the product, evidence and coverage are ready.
                </p>
              </div>

              <div className="relative min-h-[310px] overflow-hidden rounded-[24px] border border-slate-200 bg-[#f4f8fc]">
                <img
                  key={spotlight.image}
                  src={spotlight.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/84 to-white/46" />

                <div className="relative flex min-h-[310px] flex-col justify-between p-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                      {spotlight.eyebrow}
                    </p>
                    <h3 className="mt-3 max-w-lg text-3xl font-bold leading-tight text-[#0b1733]">
                      {spotlight.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                      {spotlight.text}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={spotlight.href}
                      className="group inline-flex items-center gap-2 rounded-full bg-[#0b2949] px-5 py-3 text-sm font-bold text-white"
                    >
                      {spotlight.action}
                      <ArrowRight />
                    </Link>

                    <div className="mt-5 flex gap-2">
                      {spotlightItems.map((item, index) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => setSpotlightIndex(index)}
                          aria-label={`Show spotlight ${index + 1}`}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            index === spotlightIndex ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {phases.map(([number, title, status, headline, text, href, action], index) => (
                <Link
                  key={number}
                  href={href}
                  className={`group grid gap-3 rounded-[22px] border px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center ${
                    index === 0
                      ? "border-blue-200 bg-[#eef5ff]"
                      : index === 2
                      ? "border-purple-200 bg-[#faf7ff]"
                      : "border-slate-200 bg-[#fbfdff]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0
                        ? "bg-blue-100 text-blue-700"
                        : index === 2
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {number}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-bold ${
                          index === 0
                            ? "text-blue-700"
                            : index === 2
                            ? "text-purple-700"
                            : "text-[#0b1733]"
                        }`}
                      >
                        {title}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
                        {status}
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-xl font-bold text-[#0b1733]">
                      {headline}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{text}</p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b2949]">
                    {action}
                    <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
