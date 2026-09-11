import Link from "next/link";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const imageBySlug: Record<string, string> = {
  "urban-biodiversity":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
  "bosco-verticale":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "politecnico-di-milano":
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",
  milan:
    "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=80",
  "white-arkitekter":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  "research-fellowship":
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
};

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function EditorsChoice() {
  const items = [
    "urban-biodiversity",
    "bosco-verticale",
    "politecnico-di-milano",
    "milan",
    "white-arkitekter",
    "research-fellowship",
  ]
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-white pt-5 pb-4">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              CURATED BY ARKNOZ
            </p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Editor's Choice
            </h2>
            <p className="mt-1.5 text-slate-600">
              A purposeful mix of projects, knowledge, institutions, places and opportunities.
            </p>
          </div>

          <Link href="/explore" className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700">
            View all
            <ArrowRight />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {items.map((entity) =>
            entity ? (
              <Link
                key={`${entity.type}-${entity.slug}`}
                href={getEntityHref(entity)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.09)]"
              >
                <div className="aspect-[1.7/1] overflow-hidden bg-slate-100">
                  <img
                    src={imageBySlug[entity.slug]}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                  />
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    {entity.subtitle}
                  </p>
                  <h3 className="mt-1.5 text-base font-bold leading-snug text-slate-950">
                    {entity.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {entity.geography}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                    Open
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
