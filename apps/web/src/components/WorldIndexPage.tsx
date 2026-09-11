import GlobalHeader from "@/components/GlobalHeader";
import GeographyContextBar from "@/components/GeographyContextBar";
import { findGeography } from "@/lib/geography";

export default function WorldIndexPage({
  title,
  description,
  geoSlug,
}: {
  title: string;
  description: string;
  geoSlug?: string;
}) {
  const context = geoSlug ? findGeography(geoSlug) : undefined;

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      {context && context.type !== "global" && (
        <GeographyContextBar context={context} />
      )}

      <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          {context ? context.name : "Global"}
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
          {context && context.type !== "global"
            ? `${title} in ${context.name}`
            : title}
        </h1>

        <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-600">
          {description}
        </p>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="font-semibold text-slate-950">
            {context
              ? `${context.name} context active`
              : "Global context active"}
          </p>

          <p className="mt-2 text-slate-600">
            The same Arknoz format is used globally. Records shown here will
            be filtered and ranked according to genuine geographic relevance,
            applicability, availability and evidence.
          </p>
        </div>
      </section>
    </main>
  );
}
