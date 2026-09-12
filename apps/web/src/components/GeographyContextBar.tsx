import { buildGeographyHref } from "@/lib/geography";
import Link from "next/link";

import {
  arknozSections,
  buildArknozSectionHref,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";

import type {
  GeographyItem,
} from "@/lib/geography";

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

export default function GeographyContextBar({
  context,
}: {
  context: GeographyItem;
}) {
  if (context.type === "global") {
    return null;
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-6 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
        <Link
          href={buildGeographyHref(context.slug)}
          className="shrink-0 px-3 py-4 text-sm font-bold text-[#12315d]"
        >
          {context.name} Home
        </Link>

        {arknozSections.map((section) => {
          const paid =
            isPaidArknozSection(
              section.key
            );

          return (
            <Link
              key={section.key}
              href={buildArknozSectionHref(
                section.key,
                {
                  geo: context.slug,
                }
              )}
              title={
                paid
                  ? `${section.title} · Arknoz Pro`
                  : section.title
              }
              className={`flex shrink-0 items-center gap-1.5 px-3 py-4 text-sm transition ${
                paid
                  ? "font-semibold text-slate-500"
                  : "font-medium text-slate-600 hover:text-[#12315d]"
              }`}
            >
              <span>
                {section.title}
              </span>

              {paid && (
                <LockIcon />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}