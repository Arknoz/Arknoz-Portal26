import Link from "next/link";
import { entities } from "@/lib/entities";
import EntityCard from "@/components/EntityCard";

export default function DiscoverNow() {
  const items = entities.slice(0, 7);

  return (
    <section id="member" className="scroll-mt-24 bg-white py-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Discover Now
            </h2>

            <p className="mt-2 text-slate-600">
              Explore ideas, projects, knowledge and opportunities from
              across the Built World.
            </p>
          </div>

          <Link
            href="/explore"
            className="font-semibold text-blue-700"
          >
            Explore more →
          </Link>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((entity) => (
            <EntityCard
              key={`${entity.type}-${entity.slug}`}
              entity={entity}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-950">
              Make Arknoz yours
            </h3>

            <p className="mt-1 text-slate-600">
              Join to save, follow and build your own Built World.
            </p>
          </div>

          <a
            href="#top"
            className="mt-4 inline-flex rounded-full bg-[#17315c] px-5 py-3 font-semibold text-white sm:mt-0"
          >
            Join Arknoz
          </a>
        </div>
      </div>
    </section>
  );
}
