import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import MemberActions from "@/components/MemberActions";
import type { EntityRecord } from "@/lib/entities";

const routeByType = {
  project: "projects",
  product: "products",
  knowledge: "knowledge",
  person: "people",
  organisation: "organisations",
  university: "universities",
  opportunity: "opportunities",
  place: "places",
};

export default function EntityDetailPage({
  entity,
}: {
  entity: EntityRecord;
}) {
  const canonicalUrl =
    `/${routeByType[entity.type]}/${entity.slug}`;

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          {entity.subtitle}
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
          {entity.title}
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          {entity.geography}
        </p>

        <div className="mt-7">
          <MemberActions returnTo={canonicalUrl} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="text-2xl font-bold">
              Arknoz Summary
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              {entity.summary}
            </p>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <h3 className="font-bold">
                Evidence & Sources
              </h3>

              <p className="mt-2 text-slate-600">
                Production evidence, claims and sources will be attached
                here. No unsupported facts are fabricated.
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold">
              Continue Exploring
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every Arknoz entity finishes with meaningful next routes
              rather than a dead end.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block font-semibold text-blue-700"
            >
              ← Global Home
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
