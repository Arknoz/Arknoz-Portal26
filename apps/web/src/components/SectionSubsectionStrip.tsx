import Link from "next/link";

import {
  buildArknozSectionHref,
  getArknozSection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";

export default function SectionSubsectionStrip({
  sectionKey,
  geoSlug,
  activeSubsection,
}: {
  sectionKey: ArknozSectionKey;
  geoSlug?: string;
  activeSubsection?: string;
}) {
  const section =
    getArknozSection(sectionKey);

  if (
    !section ||
    section.subsections.length === 0
  ) {
    return null;
  }

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-6 py-4 lg:px-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={buildArknozSectionHref(
              sectionKey,
              { geo: geoSlug }
            )}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !activeSubsection
                ? "border-[#0b2949] bg-[#0b2949] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            All {section.short}
          </Link>

          {section.subsections.map(
            (subsection) => {
              const active =
                activeSubsection ===
                subsection.slug;

              return (
                <Link
                  key={subsection.slug}
                  href={buildArknozSectionHref(
                    sectionKey,
                    {
                      subsection:
                        subsection.slug,
                      geo: geoSlug,
                    }
                  )}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-[#0b2949] bg-[#0b2949] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {subsection.label}
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}