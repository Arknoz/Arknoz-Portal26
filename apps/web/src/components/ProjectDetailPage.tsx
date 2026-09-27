import HomeNowOnArknozLoop from "@/components/HomeNowOnArknozLoop";
import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import MemberActions from "@/components/MemberActions";
import ProjectDetailTabs from "@/components/ProjectDetailTabs";
import type { EntityRecord } from "@/lib/entities";
import {
  buildArknozSectionHref,
  getArknozSection,
} from "@/lib/arknoz-sections";
import {
  buildGeographyHref,
  geography,
  getGeographyPath,
} from "@/lib/geography";

export default function ProjectDetailPage({
  entity,
  candidatePreview = false,
}: {
  entity: EntityRecord;
  candidatePreview?: boolean;
}) {
  const p = entity.project;
  const facts = p?.facts ?? [];
  const media = p?.media ?? [];

  const heroMedia =
    media.find((item) => item.role === "hero") ??
    media[0];

  const heroImageSrc =
    heroMedia?.src &&
    !heroMedia.src.includes(
      "commons.wikimedia.org/wiki/Special:Redirect"
    )
      ? heroMedia.src
      : undefined;

  const supportingMedia = media
    .filter(
      (item) =>
        item !== heroMedia &&
        item.src &&
        !["diagram", "drawing", "document"].includes(
          (item.role ?? "").toLowerCase()
        ) &&
        !item.src.includes(
          "commons.wikimedia.org/wiki/Special:Redirect"
        )
    )
    .slice(0, 2);

  // Screen 1:
  // LEFT = project identity only.
  // RIGHT = non-duplicated project facts.
  const primaryFacts = facts.slice(0, 0);

  const signature = (
    p?.signature?.length
      ? p.signature
      : facts.slice(0, 4)
  ).slice(0, 4);

  const signatureKeys = new Set(
    signature.map(
      (fact) => `${fact.label}::${fact.value}`
    )
  );

  const atGlance = facts
    .filter(
      (fact) =>
        !signatureKeys.has(
          `${fact.label}::${fact.value}`
        )
    )
    .slice(0, 4);

  const topics = (p?.topics ?? [])
    .filter(Boolean)
    .slice(0, 5);

  const subsection = p?.category || "Projects";
  const canonicalUrl = `/projects/${entity.slug}`;
  const projectSection = getArknozSection("projects");

  const subsectionSlug =
    projectSection?.subsections.find(
      (item) => item.label === subsection
    )?.slug;

  const subsectionHref = subsectionSlug
    ? buildArknozSectionHref("projects", {
        subsection: subsectionSlug,
      })
    : "/projects";

  const placeHref = p?.placeHref || "/global";

  const geographyPath = entity.geographySlug
    ? getGeographyPath(entity.geographySlug)
    : (() => {
        const legacyLabel = entity.geography.toLowerCase();

        const deepestMatch = geography
          .filter(
            (item) =>
              ["country", "region", "city", "place"].includes(
                item.type
              ) &&
              legacyLabel.includes(
                item.name.toLowerCase()
              )
          )
          .sort(
            (a, b) =>
              getGeographyPath(b.slug).length -
              getGeographyPath(a.slug).length
          )[0];

        return deepestMatch
          ? getGeographyPath(deepestMatch.slug)
          : [];
      })();

  const breadcrumbGeography = geographyPath.filter(
    (item) =>
      ["country", "region", "city", "place"].includes(
        item.type
      )
  );

  return (
    <main className="bg-white text-slate-950">
      <GlobalHeader />
      {/* ==================================================
          SCREEN 1 — UNIVERSAL PROJECT MASTER
      ================================================== */}

      <section
        id="project-first-screen"
        className="bg-[#f1efe9] lg:min-h-[calc(100svh-88px)]"
      >
        <div className="mx-auto flex min-h-[calc(100svh-88px)] max-w-[1600px] flex-col px-6 py-3 lg:px-10">

          {/* breadcrumb */}
          <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500">

            {breadcrumbGeography.map((item) => (
              <span
                key={item.slug}
                className="contents"
              >
                <Link
                  href={buildGeographyHref(item.slug)}
                  className="transition hover:text-blue-700"
                >
                  {item.name}
                </Link>

                <span className="text-slate-300">/</span>
              </span>
            ))}

            <Link
              href="/projects"
              className="transition hover:text-blue-700"
            >
              Projects
            </Link>

            <span className="text-slate-300">/</span>

            <Link
              href={subsectionHref}
              className="transition hover:text-blue-700"
            >
              {subsection}
            </Link>

            <span className="text-slate-300">/</span>

            <span className="font-bold text-slate-950">
              {entity.title}
            </span>
          </div>

          <article className="relative min-h-[650px] flex-1 overflow-hidden rounded-[30px] bg-[#17231d] shadow-[0_22px_70px_rgba(15,23,42,.14)]">

            {heroImageSrc ? (
              <img
                src={heroImageSrc}
                alt={heroMedia.alt ?? entity.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#123d68] via-[#0b2949] to-[#071b31]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10" />

            {/* status + place */}
            <div className="absolute left-6 top-6 z-20 flex flex-wrap items-center gap-2">
              {entity.trust ? (
                <span className="rounded-full bg-[#15261f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-white">
                  {entity.trust}
                </span>
              ) : null}

              <Link
                href={subsectionHref}
                className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.10em] text-white backdrop-blur"
              >
                {subsection}
              </Link>
            </div>

            <Link
              href={placeHref}
              className="absolute right-6 top-6 z-20 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.10em] text-white backdrop-blur"
            >
              {entity.geography}
            </Link>

            <div className="relative z-10 grid min-h-[650px] lg:grid-cols-[1.35fr_.65fr]">

              {/* PROJECT IDENTITY */}
              <div className="flex min-h-0 flex-col justify-end p-7 lg:p-9">

                <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-white/65">
                  Arknoz Project Record
                </p>

                <h1 className="mt-3 max-w-[720px] text-[54px] font-semibold leading-[.94] tracking-[-0.045em] text-white xl:text-[76px]">
                  {entity.title}
                </h1>

                <p className="mt-4 max-w-2xl text-[16px] font-medium leading-7 text-white/82">
                  {candidatePreview
                    ? "Source-backed project record in development."
                    : p?.strapline ?? entity.summary}
                </p>

                {signature.length > 0 ? (
                  <div className="mt-7 grid max-w-[820px] gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {signature.map((fact) => (
                      <div
                        key={`${fact.label}-${fact.value}`}
                        className="rounded-[16px] border border-white/15 bg-black/25 px-4 py-3 backdrop-blur-sm"
                      >
                        <p className="text-[19px] font-semibold leading-tight text-white">
                          {fact.value}
                        </p>

                        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.09em] text-white/60">
                          {fact.label}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              {/* PROJECT ENTRY */}
              <div className="flex items-end justify-end p-6 lg:p-9">
                <aside className="w-full max-w-[360px] border-t border-white/35 pt-5 text-white">

                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/65">
                    Explore the project
                  </p>

                  <h2 className="mt-3 text-[27px] font-medium leading-[1.08] tracking-[-0.035em]">
                    One continuous project record.
                  </h2>

                  <p className="mt-3 max-w-[330px] text-[14px] leading-6 text-white/70">
                    Move from project data to design, connections, evidence and Arknoz Pro.
                  </p>

                  <a
                    href="#project-intelligence"
                    className="mt-7 inline-flex items-center gap-4 border-b border-white/60 pb-2 text-[14px] font-medium text-white transition hover:border-white"
                  >
                    Explore project
                    <span aria-hidden="true">↓</span>
                  </a>

                  <div className="mt-7 border-t border-white/20 pt-4">
                    <MemberActions returnTo={canonicalUrl} />
                  </div>

                </aside>
              </div>
            </div>

            {heroImageSrc && heroMedia?.attribution ? (
              <div className="absolute bottom-4 right-6 z-20 max-w-[320px] text-right">
                <p className="text-[10px] font-medium uppercase tracking-[0.10em] text-white/55">
                  Image credit
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/70">
                  {heroMedia.attribution}
                  {heroMedia.license
                    ? ` · ${heroMedia.license}`
                    : ""}
                </p>
              </div>
            ) : null}

          </article>
        </div>
      </section>

      {/* ==================================================
          02 — ARKNOZ NOW · UNIVERSAL
      ================================================== */}

      <HomeNowOnArknozLoop />


      <section
        id="project-intelligence"
        className="border-t border-slate-200 bg-[#f4f7fb]"
      >
        <div className="mx-auto max-w-[1600px] px-6 py-6 lg:px-10">

          <div>
            <ProjectDetailTabs entity={entity} candidatePreview={candidatePreview} />
          </div>
        </div>
      </section>

      <UniversalPublicLastScreen />
    </main>
  );
}
