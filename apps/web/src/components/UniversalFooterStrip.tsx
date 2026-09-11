import Link from "next/link";

const worldLinks = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
] as const;

function ArrowRight() {
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

export default function UniversalFooterStrip() {
  return (
    <div className="w-full border-y border-white/10 bg-[#0b2949] text-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
            EXPLORE BY WORLD
          </span>

          {worldLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/[0.1]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="h-px bg-white/10 lg:h-10 lg:w-px" />

        <Link
          href="/explore"
          className="group flex shrink-0 items-center justify-between gap-6 rounded-[18px] border border-white/10 bg-white/[0.055] px-4 py-3"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
              WHAT&apos;S NEW
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Latest projects and opportunities
            </p>
          </div>
          <span className="text-white">
            <ArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
}
