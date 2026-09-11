import Link from "next/link";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const chainSlugs = [
  "bosco-verticale",
  "stefano-boeri",
  "mass-timber-system",
  "urban-biodiversity",
  "politecnico-di-milano",
  "milan",
];

const discoverySlugs = [
  "bosco-verticale",
  "urban-biodiversity",
  "research-fellowship",
  "white-arkitekter",
];

export default function M01ConnectionsDiscovery() {
  const chain = chainSlugs
    .map((slug) => entities.find((e) => e.slug === slug))
    .filter(Boolean);

  const discovery = discoverySlugs
    .map((slug) => entities.find((e) => e.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-white py-8">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-3xl bg-slate-50 p-7 md:p-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Follow the Connections
          </h2>
          <p className="mt-2 text-slate-600">
            See how one part of the Built World leads naturally to another.
          </p>

          <div className="mt-7 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max items-center">
              {chain.map((entity, index) => {
                if (!entity) return null;
                return (
                  <div key={entity.slug} className="flex items-center">
                    <Link
                      href={getEntityHref(entity)}
                      className="w-[112px] rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-blue-700">
                        {entity.subtitle}
                      </p>
                      <h3 className="mt-2 text-sm font-bold leading-snug text-slate-950">
                        {entity.title}
                      </h3>
                      <p className="mt-2 text-[11px] text-slate-500">
                        {entity.geography}
                      </p>
                    </Link>

                    {index < chain.length - 1 && (
                      <div className="px-2 text-xl text-slate-400">→</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Production relationships will show an explicit “why connected”
            reason whenever evidence supports a factual link.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-7 md:p-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Discover Now
              </h2>
              <p className="mt-2 text-slate-600">
                A compact cross-world selection for visitors.
              </p>
            </div>
            <Link href="/explore" className="font-semibold text-blue-700">
              Explore more →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {discovery.map((entity) => {
              if (!entity) return null;
              return (
                <Link
                  key={entity.slug}
                  href={getEntityHref(entity)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    {entity.subtitle}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">
                    {entity.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {entity.geography}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {entity.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
