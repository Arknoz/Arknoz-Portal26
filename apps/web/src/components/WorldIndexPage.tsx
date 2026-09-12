import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import GeographyContextBar from "@/components/GeographyContextBar";

import {
  entities,
  type EntityRecord,
  type EntityType,
} from "@/lib/entities";

import {
  type GeographyItem,
  findGeography,
  getChildren,
} from "@/lib/geography";

type WorldConfig = {
  eyebrow: string;
  path: string;
  entityTypes: EntityType[];
  popular: string[];
  lanes: string[];
};

type HeroFeature = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};

const worldConfigs: Record<string, WorldConfig> = {
  Projects: {
    eyebrow: "PROJECTS",
    path: "/projects",
    entityTypes: ["project"],
    popular: [
      "Buildings",
      "Infrastructure",
      "Interiors",
      "Landscapes",
      "Urban & Masterplanning",
    ],
    lanes: [
      "Buildings",
      "Infrastructure",
      "Interiors",
      "Landscapes",
      "Urban & Masterplanning",
      "Case Projects",
    ],
  },

  Products: {
    eyebrow: "PRODUCTS",
    path: "/products",
    entityTypes: ["product"],
    popular: [
      "Materials",
      "Components",
      "Building Systems",
      "Equipment",
      "Technologies",
    ],
    lanes: [
      "Materials",
      "Components",
      "Building Systems",
      "Equipment",
      "Technologies",
    ],
  },

  Knowledge: {
    eyebrow: "KNOWLEDGE",
    path: "/knowledge",
    entityTypes: ["knowledge"],
    popular: [
      "Books & Publications",
      "Research & Innovation",
      "Case Studies & Solutions",
      "Standards & References",
    ],
    lanes: [
      "Books & Publications",
      "Research & Innovation",
      "Case Studies & Solutions",
      "Standards & References",
      "Methods & Practice",
      "Ideas & Insights",
    ],
  },

  "Learning & Education": {
    eyebrow: "LEARNING & EDUCATION",
    path: "/learning",
    entityTypes: [],
    popular: [
      "Courses",
      "Programmes",
      "Skills",
      "Professional Learning",
      "Resources",
    ],
    lanes: [
      "Courses & Programmes",
      "Skills & Practice",
      "Professional Learning",
      "Workshops & Events",
      "Learning Resources",
      "Institutions & Providers",
    ],
  },

  Opportunities: {
    eyebrow: "OPPORTUNITIES",
    path: "/opportunities",
    entityTypes: ["opportunity"],
    popular: [
      "Jobs",
      "Competitions",
      "Internships",
      "Grants",
      "Fellowships",
    ],
    lanes: [
      "Jobs",
      "Internships",
      "Competitions",
      "Scholarships",
      "Grants",
      "Fellowships",
      "Events",
    ],
  },

  People: {
    eyebrow: "PEOPLE",
    path: "/people",
    entityTypes: ["person"],
    popular: [
      "Architects",
      "Engineers",
      "Researchers",
      "Educators",
      "Built World Professionals",
    ],
    lanes: [
      "Architects",
      "Engineers",
      "Researchers",
      "Educators",
      "Design Leaders",
      "Built World Professionals",
    ],
  },

  Organisations: {
    eyebrow: "ORGANISATIONS",
    path: "/organisations",
    entityTypes: ["organisation"],
    popular: [
      "Practices",
      "Manufacturers",
      "Consultancies",
      "Institutions",
      "Professional Bodies",
    ],
    lanes: [
      "Practices",
      "Manufacturers",
      "Consultancies",
      "Contractors",
      "Institutions",
      "Professional Bodies",
    ],
  },

  Universities: {
    eyebrow: "UNIVERSITIES",
    path: "/universities",
    entityTypes: ["university"],
    popular: [
      "Programmes",
      "Research",
      "Faculty",
      "Laboratories",
      "Student Work",
    ],
    lanes: [
      "Programmes",
      "Research",
      "Faculty",
      "Laboratories",
      "Student Work",
      "University Networks",
    ],
  },

  Places: {
    eyebrow: "PLACES",
    path: "/places",
    entityTypes: ["place"],
    popular: [
      "Countries",
      "Regions",
      "Cities",
      "Local Context",
    ],
    lanes: [
      "Countries",
      "Regions",
      "Cities",
      "Places",
      "Local Context",
    ],
  },

  Community: {
    eyebrow: "COMMUNITY",
    path: "/community",
    entityTypes: [],
    popular: [
      "Members",
      "Collaboration",
      "Contribution",
      "Chapters",
    ],
    lanes: [
      "Arknoz Members",
      "Collaboration",
      "Contribution",
      "Arknoz News & Development",
      "Competitions & Jobs",
      "Arknoz Chapters",
    ],
  },
};

const connectedWorlds = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
  ["Community", "/community"],
] as const;

const approvedFeatureImages: Record<string, string> = {
  "bosco-verticale":
    "https://www.arup.com/globalassets/images/projects/b/bosco-verticale/bosco-verticale-header.webp?height=1035&quality=80&width=1840",

  "mass-timber-system":
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82",

  "urban-biodiversity":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=82",

  "politecnico-di-milano":
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=82",

  "white-arkitekter":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
};

function getEntityHref(entity: EntityRecord) {
  switch (entity.type) {
    case "project":
      return `/projects/${entity.slug}`;

    case "product":
      return `/products/${entity.slug}`;

    case "knowledge":
      return `/knowledge/${entity.slug}`;

    case "person":
      return `/people/${entity.slug}`;

    case "organisation":
      return `/organisations/${entity.slug}`;

    case "university":
      return `/universities/${entity.slug}`;

    case "opportunity":
      return `/opportunities/opportunity/${entity.slug}`;

    case "place":
      return `/places/${entity.slug}`;
  }
}

function getEntityImage(
  entity: EntityRecord
) {
  if (
    entity.type === "project" &&
    entity.project?.media?.[0]?.src
  ) {
    return entity.project.media[0].src;
  }

  return approvedFeatureImages[
    entity.slug
  ];
}

function collectGeographyTerms(
  context: GeographyItem
) {
  const terms = new Set<string>();

  function visit(item: GeographyItem) {
    terms.add(
      item.name.toLowerCase()
    );

    terms.add(
      item.slug
        .replaceAll("-", " ")
        .toLowerCase()
    );

    getChildren(item.slug).forEach(
      visit
    );
  }

  visit(context);

  return Array.from(terms);
}

function matchesContext(
  entity: EntityRecord,
  context?: GeographyItem
) {
  if (
    !context ||
    context.type === "global"
  ) {
    return true;
  }

  const geography =
    entity.geography.toLowerCase();

  return collectGeographyTerms(
    context
  ).some(
    (term) =>
      geography.includes(term)
  );
}

function WorldRecordCard({
  entity,
}: {
  entity: EntityRecord;
}) {
  const image =
    getEntityImage(entity);

  return (
    <Link
      href={getEntityHref(entity)}
      className="group overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      {image ? (
        <div className="aspect-[1.55/1] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <div className="flex aspect-[1.55/1] items-center justify-center bg-gradient-to-br from-[#dcebf8] to-[#b8cfe2]">
          <span className="text-4xl font-bold text-[#0b2949]/25">
            {entity.title
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      )}

      <div className="p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
          {entity.subtitle}
        </p>

        <h3 className="mt-2 text-xl font-bold text-slate-950">
          {entity.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {entity.geography}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {entity.summary}
        </p>

        {entity.trust && (
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {entity.trust}
          </p>
        )}

        <p className="mt-5 text-sm font-bold text-blue-700">
          Explore →
        </p>
      </div>
    </Link>
  );
}

export default function WorldIndexPage({
  title,
  description,
  geoSlug,
}: {
  title: string;
  description: string;
  geoSlug?: string;
}) {
  const context =
    geoSlug
      ? findGeography(geoSlug)
      : undefined;

  const config =
    worldConfigs[title] ?? {
      eyebrow: title.toUpperCase(),
      path: "/explore",
      entityTypes: [],
      popular: [],
      lanes: [],
    };

  const worldRecords =
    config.entityTypes.length > 0
      ? entities.filter(
          (entity) =>
            config.entityTypes.includes(
              entity.type
            )
        )
      : [];

  const visibleRecords =
    worldRecords.filter(
      (entity) =>
        matchesContext(
          entity,
          context
        )
    );

  const featured =
    visibleRecords
      .map((entity) => {
        const image =
          getEntityImage(entity);

        if (!image) {
          return null;
        }

        return {
          type:
            entity.subtitle.toUpperCase(),
          title: entity.title,
          meta: entity.geography,
          href:
            getEntityHref(entity),
          image,
        };
      })
      .filter(
        (
          item
        ): item is HeroFeature =>
          item !== null
      )
      .slice(0, 3);

  const locationLabel =
    context &&
    context.type !== "global"
      ? context.name
      : undefined;

  const heroTitle =
    locationLabel
      ? `${title} in ${locationLabel}.`
      : `Explore ${title}.`;

  const heroDescription =
    locationLabel
      ? `${description} Explore genuine Arknoz records connected to ${locationLabel} without duplicating their canonical identity.`
      : description;

  const ticker = [
    {
      text:
        locationLabel
          ? `Explore ${title.toLowerCase()} connected to ${locationLabel}`
          : `Explore genuine ${title.toLowerCase()} across Arknoz`,
      href: "#records",
    },
    {
      text:
        `Discover ${title.toLowerCase()} by topic and discipline`,
      href: "#explore-world",
    },
    {
      text:
        locationLabel
          ? `Keep ${locationLabel} as the active geography context`
          : "Move across one connected Built World",
      href: "#connected-world",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      {context &&
        context.type !== "global" && (
          <GeographyContextBar
            context={context}
          />
        )}

      <UniversalTopicHero
        eyebrow={
          locationLabel
            ? `${locationLabel.toUpperCase()} · ${config.eyebrow}`
            : config.eyebrow
        }
        title={heroTitle}
        description={
          heroDescription
        }
        searchPlaceholder={
          locationLabel
            ? `Search ${title.toLowerCase()} in ${locationLabel}...`
            : `Search ${title.toLowerCase()}...`
        }
        searchGeo={
          context &&
          context.type !== "global"
            ? context.slug
            : undefined
        }
        popular={
          config.popular
        }
        featured={featured}
        ticker={ticker}
      />

      <section
        id="explore-world"
        className="bg-[#f6f8fb] py-12"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            EXPLORE {config.eyebrow}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {locationLabel
              ? `${title} through the ${locationLabel} context.`
              : `Explore the ${title} world.`}
          </h2>

          <p className="mt-2 max-w-3xl text-slate-600">
            {locationLabel
              ? `The page keeps the complete Arknoz ${title} structure while geography changes relevance, filtering and discovery.`
              : `Move through the main ${title.toLowerCase()} areas using one consistent Arknoz structure.`}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {config.lanes.map(
              (lane) => (
                <Link
                  key={lane}
                  href={`/search?q=${encodeURIComponent(
                    lane
                  )}`}
                  className="group rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    DISCOVER
                  </p>

                  <p className="mt-4 text-lg font-bold text-slate-950">
                    {lane}
                  </p>

                  <p className="mt-5 text-sm font-bold text-blue-700">
                    Explore →
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="records"
        className="bg-white py-12"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                ARKNOZ RECORDS
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                {locationLabel
                  ? `Explore ${title.toLowerCase()} connected to ${locationLabel}.`
                  : `Explore genuine ${title.toLowerCase()} records.`}
              </h2>

              <p className="mt-2 max-w-3xl text-slate-600">
                Only genuine canonical Arknoz records are shown. Geography changes context and relevance without creating duplicate records.
              </p>
            </div>

            {locationLabel && (
              <Link
                href={config.path}
                className="text-sm font-bold text-blue-700"
              >
                View global {title} →
              </Link>
            )}
          </div>

          {visibleRecords.length > 0 ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleRecords.map(
                (entity) => (
                  <WorldRecordCard
                    key={`${entity.type}-${entity.slug}`}
                    entity={entity}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-7 rounded-[24px] border border-slate-200 bg-[#f8fafc] p-7">
              <p className="font-bold text-slate-950">
                {locationLabel
                  ? `No genuine ${title.toLowerCase()} records are connected to ${locationLabel} yet.`
                  : `Published ${title.toLowerCase()} records will appear here as genuine Arknoz data becomes available.`}
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Arknoz does not create placeholder records simply to fill the interface.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="connected-world"
        className="bg-[#f6f8fb] py-12"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            CONNECTED BUILT WORLD
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {locationLabel
              ? `Explore ${locationLabel} across Arknoz.`
              : "Continue across the Built World."}
          </h2>

          <p className="mt-2 max-w-3xl text-slate-600">
            Projects, products, knowledge, people, organisations, universities, opportunities and places remain connected through one canonical Arknoz system.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {connectedWorlds
              .filter(
                ([label]) =>
                  label !== title
              )
              .map(
                (
                  [label, href],
                  index
                ) => (
                  <Link
                    key={href}
                    href={
                      locationLabel
                        ? `${href}?geo=${context?.slug}`
                        : href
                    }
                    className={`rounded-[20px] p-5 transition hover:-translate-y-1 hover:shadow-md ${
                      index === 0
                        ? "bg-[#0b2949] text-white"
                        : "bg-white text-slate-950 ring-1 ring-slate-200"
                    }`}
                  >
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                        index === 0
                          ? "text-blue-200"
                          : "text-blue-700"
                      }`}
                    >
                      {label}
                    </p>

                    <p className="mt-7 font-bold">
                      {locationLabel
                        ? `Explore in ${locationLabel}`
                        : "Explore world"}
                    </p>

                    <p
                      className={`mt-4 text-sm font-bold ${
                        index === 0
                          ? "text-blue-200"
                          : "text-blue-700"
                      }`}
                    >
                      Explore →
                    </p>
                  </Link>
                )
              )}
          </div>
        </div>
      </section>

      <UniversalFooterStrip />
      <GlobalFooter />
    </main>
  );
}
