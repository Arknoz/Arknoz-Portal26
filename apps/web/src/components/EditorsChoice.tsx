import Link from "next/link";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const imageBySlug: Record<string, string> = {
  "urban-biodiversity":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=82",
  "bosco-verticale":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=82",
  "politecnico-di-milano":
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=82",
  milan:
    "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=82",
  "white-arkitekter":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82",
};

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

export default function EditorsChoice() {
  const items = [
    "urban-biodiversity",
    "bosco-verticale",
    "politecnico-di-milano",
    "milan",
    "white-arkitekter",
  ]
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  const lead = items[0];
  const rest = items.slice(1);

  return (
    <section className="bg-white py-9">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[.94fr_1.06fr]">
          {lead && (
            <Link
              href={getEntityHref(lead)}
              className="group relative min-h-[430px] overflow-hidden rounded-[30px] bg-slate-900"
            >
              <img
                src={imageBySlug[lead.slug]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" />

              <div className="absolute left-0 right-0 top-0 p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                  CURATED BY ARKNOZ
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Editor&apos;s Choice
                </h2>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                  {lead.subtitle}
                </p>
                <h3 className="mt-2 max-w-xl text-3xl font-bold">{lead.title}</h3>
                <p className="mt-1.5 text-sm text-slate-200">{lead.geography}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Explore this story
                  <ArrowRight />
                </span>
              </div>
            </Link>
          )}

          <div className="rounded-[30px] bg-[#f4f7fb] p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  MORE TO EXPLORE
                </p>
                <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">
                  Selected across Arknoz
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  A compact mix of projects, institutions, places and organisations.
                </p>
              </div>

              <Link
                href="/explore"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-700"
              >
                View all
                <ArrowRight />
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {rest.map((entity) =>
                entity ? (
                  <Link
                    key={`${entity.type}-${entity.slug}`}
                    href={getEntityHref(entity)}
                    className="group overflow-hidden rounded-[22px] bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="aspect-[1.55/1] overflow-hidden bg-slate-100">
                      <img
                        src={imageBySlug[entity.slug]}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        {entity.subtitle}
                      </p>
                      <h3 className="mt-1.5 text-lg font-bold text-slate-950">
                        {entity.title}
                      </h3>
                      <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-slate-500">
                        <span>{entity.geography}</span>
                        <span className="text-blue-700">
                          <ArrowRight />
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
