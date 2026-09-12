import { buildGeographyHref } from "@/lib/geography";
import {
  arknozSections,
  buildArknozSectionHref,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";
import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GeographyContextBar from "@/components/GeographyContextBar";
import {
  GeographyItem,
  getChildren,
} from "@/lib/geography";

const worlds =
  arknozSections.map(
    (section) => ({
      key: section.key,
      label: section.title,
      href: section.href,
      paid:
        isPaidArknozSection(
          section.key
        ),
    })
  );

export default function GeographyPage({
  context,
}: {
  context: GeographyItem;
}) {
  const children = getChildren(context.slug);

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />
      <GeographyContextBar context={context} />

      <section className="bg-[#0d2747] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
            {context.type}
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
            {context.name}
          </h1>

          <p className="mt-5 max-w-2xl text-xl text-slate-200">
            {context.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10">
        <h2 className="text-3xl font-bold">
          Explore {context.name}
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {worlds.map((item) => (
            <Link
              key={item.key}
              href={buildArknozSectionHref(
                item.key,
                {
                  geo: context.slug,
                }
              )}
              title={
                item.paid
                  ? `${item.label} - Arknoz Pro`
                  : item.label
              }
              className={`rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${
                item.paid
                  ? "border-slate-200 bg-slate-50 text-slate-500"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold">
                  {item.label}
                </p>

                {item.paid && (
                  <span className="rounded-full border border-slate-300 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em]">
                    Arknoz Pro &middot; Locked
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {context.name} context
              </p>

              <p
                className={`mt-5 font-bold ${
                  item.paid
                    ? "text-slate-500"
                    : "text-blue-700"
                }`}
              >
                {item.paid
                  ? "Preview Arknoz Pro →"
                  : "→"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {children.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10">
            <h2 className="text-3xl font-bold">
              Explore within {context.name}
            </h2>

            <div className="mt-7 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {children.map((child) => (
                <Link
                  key={child.slug}
                  href={buildGeographyHref(child.slug)}
                  className="min-w-[240px] rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {child.type}
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    {child.name}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {child.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7">
          <strong>One global format. Local truth.</strong>

          <p className="mt-2 max-w-3xl text-slate-600">
            Arknoz brings together local terminology, evidence, regulation,
            professional context, availability and geographic relevance for
            the selected place.
          </p>
        </div>
      </section>
    </main>
  );
}
