import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GeographyContextBar from "@/components/GeographyContextBar";
import {
  GeographyItem,
  getChildren,
} from "@/lib/geography";

const worlds = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
  ["Community", "/community"],
];

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
          {worlds.map(([label, href]) => (
            <Link
              key={href}
              href={`${href}?geo=${context.slug}`}
              className="rounded-xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <p className="font-semibold">{label}</p>

              <p className="mt-2 text-sm text-slate-500">
                {context.name} context
              </p>

              <p className="mt-5 font-bold text-blue-700">
                →
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
                  href={`/global/${child.slug}`}
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
            Arknoz keeps one canonical global architecture while local
            terminology, evidence, regulation, professional context,
            availability and geographic relevance change according to the
            selected place.
          </p>
        </div>
      </section>
    </main>
  );
}
