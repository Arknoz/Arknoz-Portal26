import EntityCard from "@/components/EntityCard";
import { entities } from "@/lib/entities";

const chain = [
  entities.find((e) => e.slug === "bosco-verticale")!,
  entities.find((e) => e.slug === "stefano-boeri")!,
  entities.find((e) => e.slug === "mass-timber-system")!,
  entities.find((e) => e.slug === "urban-biodiversity")!,
  entities.find((e) => e.slug === "politecnico-di-milano")!,
  entities.find((e) => e.slug === "milan")!,
];

export default function FollowConnections() {
  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Follow the Connections
          </h2>

          <p className="mt-2 text-slate-600">
            See how everything in the Built World is connected.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chain.map((entity, index) => (
            <div key={`${entity.type}-${entity.slug}`} className="flex items-center gap-3">
              <EntityCard entity={entity} />

              {index < chain.length - 1 && (
                <div className="shrink-0 text-3xl text-slate-400">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
