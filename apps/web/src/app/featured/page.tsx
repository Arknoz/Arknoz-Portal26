import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import GlobalFooter from "@/components/GlobalFooter";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const imageBySlug: Record<string, string> = {
  "bosco-verticale":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=82",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80";

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

export default function FeaturedPage() {
  const projects = entities.filter((entity) => entity.type === "project");

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="relative overflow-hidden bg-[#071b31] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2200&q=82)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071b31]/96 via-[#0b2949]/86 to-[#0b2949]/52" />

        <div className="relative mx-auto max-w-[1600px] px-6 py-16 lg:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
            ARKNOZ FEATURED
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl font-bold tracking-[-0.045em] md:text-7xl">
            Buildings worth discovering.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-7 text-slate-200 md:text-xl">
            A curated view of genuine published projects and buildings selected across Arknoz.
          </p>
        </div>
      </section>

      <section className="bg-[#f6f8fb] py-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                FEATURED BUILDINGS
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Selected from published Arknoz projects.
              </h2>
              <p className="mt-2 max-w-3xl text-slate-600">
                No fake listings. This page expands automatically as genuine project records are published and selected.
              </p>
            </div>

            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 font-semibold text-blue-700"
            >
              Open all projects
              <ArrowRight />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((entity) => (
                <Link
                  key={`${entity.type}-${entity.slug}`}
                  href={getEntityHref(entity)}
                  className="group overflow-hidden rounded-[26px] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="aspect-[1.35/1] overflow-hidden bg-slate-100">
                    <img
                      src={imageBySlug[entity.slug] ?? fallbackImage}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      {entity.subtitle}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold text-slate-950">
                      {entity.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between gap-4 text-sm text-slate-500">
                      <span>{entity.geography}</span>
                      <span className="text-blue-700">
                        <ArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[26px] border border-slate-200 bg-white p-8">
              <h3 className="text-xl font-bold text-slate-950">
                Featured buildings will appear here as genuine project records are published.
              </h3>
              <p className="mt-2 text-slate-600">
                Arknoz will not invent or pad this page with fake content.
              </p>
            </div>
          )}
        </div>
      </section>

      <UniversalFooterStrip />
      <GlobalFooter />
    </main>
  );
}
