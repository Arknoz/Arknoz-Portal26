import Link from "next/link";
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

export function getEntityHref(entity: EntityRecord) {
  return `/${routeByType[entity.type]}/${entity.slug}`;
}

export default function EntityCard({
  entity,
}: {
  entity: EntityRecord;
}) {
  return (
    <Link
      href={getEntityHref(entity)}
      className="group block min-w-[250px] overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
    >
      <div className="h-36 bg-gradient-to-br from-blue-100 via-slate-100 to-emerald-50" />

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {entity.subtitle}
        </p>

        <h3 className="mt-2 text-xl font-bold text-slate-950">
          {entity.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {entity.geography}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {entity.summary}
        </p>

        {entity.trust && (
          <span className="mt-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {entity.trust}
          </span>
        )}

        <div className="mt-5 font-bold text-blue-700">
          Explore →
        </div>
      </div>
    </Link>
  );
}
