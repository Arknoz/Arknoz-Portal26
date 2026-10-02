import Link from "next/link";

import {
  buildGeographyHref,
  getGeographyAncestors,
  type GeographyItem,
} from "@/lib/geography";

import {
  arknozExploreSections,
  buildArknozSectionHref,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";

export type GeographyContextNavItem = {
  label: string;
  href: string;
  locked?: boolean;
};

function getHierarchyNav(
  context: GeographyItem
): GeographyContextNavItem[] {
  const ancestors =
    getGeographyAncestors(
      context.slug
    ).reverse();

  const continent =
    ancestors.find(
      (item) =>
        item.type === "continent"
    );

  const country =
    ancestors.find(
      (item) =>
        item.type === "country"
    );

  const region =
    ancestors.find(
      (item) =>
        item.type === "region"
    );

  const city =
    ancestors.find(
      (item) =>
        item.type === "city"
    );

  const items: GeographyContextNavItem[] = [
    {
      label: "Global Home",
      href: "/global",
    },
  ];

  if (
    context.type === "continent" ||
    continent
  ) {
    items.push({
      label: "Continents",
      href: "/global/continents",
    });
  }

  if (
    continent &&
    continent.slug !== context.slug
  ) {
    items.push({
      label: continent.name,
      href: buildGeographyHref(
        continent.slug
      ),
    });
  }

  if (
    context.type === "country" ||
    country
  ) {
    items.push({
      label: "Countries",
      href: "/global/countries",
    });
  }

  if (
    country &&
    country.slug !== context.slug
  ) {
    items.push({
      label: country.name,
      href: buildGeographyHref(
        country.slug
      ),
    });
  }

  if (
    context.type === "region" ||
    region
  ) {
    items.push({
      label: "Regions & States",
      href: "/global/regions",
    });
  }

  if (
    region &&
    region.slug !== context.slug
  ) {
    items.push({
      label: region.name,
      href: buildGeographyHref(
        region.slug
      ),
    });
  }

  if (
    context.type === "city" ||
    city
  ) {
    items.push({
      label: "Cities",
      href: "/global/cities",
    });
  }

  if (
    city &&
    city.slug !== context.slug
  ) {
    items.push({
      label: city.name,
      href: buildGeographyHref(
        city.slug
      ),
    });
  }

  if (context.type === "place") {
    items.push({
      label: "Places",
      href: "/global/places",
    });
  }

  items.push({
    label: `${context.name} Home`,
    href: buildGeographyHref(
      context.slug
    ),
  });

  return items;
}

export function getGeographyContextNav(
  context: GeographyItem
): GeographyContextNavItem[] {
  if (context.type === "global") {
    return [];
  }

  return [
    ...getHierarchyNav(context),

    ...arknozExploreSections.map(
      (section) => ({
        label: section.title,
        href: buildArknozSectionHref(
          section.key,
          {
            geo: context.slug,
          }
        ),
        locked:
          isPaidArknozSection(
            section.key
          ),
      })
    ),
  ];
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="6"
        y="10"
        width="12"
        height="9"
        rx="2"
      />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function GeographyContextBar({
  context,
}: {
  context: GeographyItem;
}) {
  if (context.type === "global") {
    return null;
  }

  const navItems =
    getGeographyContextNav(
      context
    );

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1720px] items-center gap-1 overflow-x-auto px-6 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
        {navItems.map(
          (item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              title={
                item.locked
                  ? `${item.label} · Arknoz Pro`
                  : item.label
              }
              className={`flex shrink-0 items-center gap-1.5 px-3 py-4 text-sm transition ${
                item.locked
                  ? "font-semibold text-slate-500"
                  : index ===
                      navItems.length -
                        arknozExploreSections.length -
                        1
                    ? "font-bold text-[#12315d]"
                    : "font-medium text-slate-600 hover:text-[#12315d]"
              }`}
            >
              <span>
                {item.label}
              </span>

              {item.locked && (
                <LockIcon />
              )}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}