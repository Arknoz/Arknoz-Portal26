import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import MemberActions from "@/components/MemberActions";
import ProjectDetailTabs from "@/components/ProjectDetailTabs";
import type { EntityRecord } from "@/lib/entities";
import {
  buildArknozSectionHref,
  getArknozSection,
} from "@/lib/arknoz-sections";

export default function ProjectDetailPage({
  entity,
}: {
  entity: EntityRecord;
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

  const primaryFacts = facts.slice(0, 4);

  const signature = (
    p?.signature?.length
      ? p.signature
      : facts.slice(0, 4)
  ).slice(0, 4);

  const atGlance = facts.slice(4, 8);

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

  return (
    <main className="bg-white text-slate-950">
      <GlobalHeader />
      {/* ==================================================
          SCREEN 1 — FROZEN PROJECT MASTER
      ================================================== */}

      <section
        id="project-first-screen"
        className="bg-[#f1efe9] lg:h-[calc(100svh-88px)]"
      >
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-3 lg:px-10">

          {/* breadcrumb */}
          <div className="mb-3 flex shrink-0 items-center gap-2 text-[10px] font-semibold text-slate-500">
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

          {/* master composition */}
          <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[.78fr_1.48fr_.66fr]">

            {/* ------------------------------------------------
                LEFT — PROJECT IDENTITY
            ------------------------------------------------ */}

            <article className="flex min-h-[420px] flex-col rounded-[28px] border border-black/[0.06] bg-[#fbfaf7] p-5 shadow-[0_18px_55px_rgba(15,23,42,.04)] lg:min-h-0">

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {entity.trust ? (
                    <span className="rounded-full bg-[#15261f] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.17em] text-white">
                      {entity.trust}
                    </span>
                  ) : null}

                  <Link
                    href={subsectionHref}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {subsection}
                  </Link>

                  <Link
                    href="/projects"
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Project
                  </Link>
                </div>

                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.24em] text-blue-700">
                  Arknoz Project Record
                </p>

                <h1 className="mt-2 max-w-xl text-[42px] font-black leading-[.94] tracking-[-0.055em] text-slate-950 xl:text-[52px]">
                  {entity.title}
                </h1>

                {p?.strapline ? (
                  <p className="mt-4 max-w-xl text-[17px] font-semibold leading-6 tracking-[-0.015em] text-slate-900">
                    {p.strapline}
                  </p>
                ) : null}

                <p className="mt-3 max-w-xl text-[12px] leading-[1.7] text-slate-600">
                  {entity.summary}
                </p>

                {primaryFacts.length > 0 ? (
                  <div
                    className={`mt-6 grid gap-x-4 gap-y-3 ${
                      primaryFacts.length > 1
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {primaryFacts.map((fact) => (
                      <div
                        key={`${fact.label}-${fact.value}`}
                        className="border-t border-slate-200 pt-2.5"
                      >
                        <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          {fact.label}
                        </p>

                        <p className="mt-1 text-[12px] font-bold leading-4 text-slate-950">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <div className="border-t border-slate-200 pt-4">
                  <MemberActions returnTo={canonicalUrl} />
                </div>
              </div>
            </article>

            {/* ------------------------------------------------
                CENTRE — CINEMATIC PROJECT VISUAL
            ------------------------------------------------ */}

            <article className="group relative min-h-[460px] overflow-hidden rounded-[30px] bg-[#17231d] shadow-[0_22px_70px_rgba(15,23,42,.14)] lg:min-h-0">

              {heroImageSrc ? (
                <img
                  src={heroImageSrc}
                  alt={heroMedia.alt ?? entity.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.45) 1px,transparent 1px)",
                      backgroundSize: "44px 44px",
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center p-10 text-center text-white">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/55">
                        Arknoz Project Visual
                      </p>

                      <p className="mt-4 text-3xl font-bold">
                        {entity.title}
                      </p>

                      <p className="mt-2 text-sm text-white/60">
                        {entity.geography}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {supportingMedia.length > 0 ? (
                <div className="absolute right-4 top-4 z-20 flex gap-2">
                  {supportingMedia.map((item, index) => (
                    <div
                      key={`${item.src}-${index}`}
                      className="group/thumb relative h-[78px] w-[110px] overflow-hidden rounded-[13px] border border-white/30 bg-white/90 shadow-[0_7px_22px_rgba(0,0,0,.18)]"
                    >
                      <img
                        src={item.src}
                        alt={item.alt ?? `${entity.title} supporting visual`}
                        className={`h-full w-full ${
                          item.role === "diagram"
                            ? "bg-white object-contain p-1.5"
                            : "object-cover"
                        }`}
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4">
                        <p className="truncate text-[7px] font-bold uppercase tracking-[0.12em] text-white">
                          {item.role ?? `View ${index + 2}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-black/20" />

              <div className="absolute left-5 top-5 flex items-center gap-2">
                <span className="rounded-full bg-white/92 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.17em] text-slate-950 backdrop-blur">
                  Project Feature
                </span>

                <Link
                  href={placeHref}
                  className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur transition hover:border-white/60 hover:bg-white/15"
                >
                  {entity.geography}
                </Link>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-7">

                <p className="max-w-2xl text-[9px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Arknoz Lens
                </p>

                <h2 className="mt-2 max-w-2xl text-[27px] font-bold leading-[1.08] tracking-[-0.035em] xl:text-[32px]">
                  {p?.visualStatement ??
                    p?.strapline ??
                    entity.summary}
                </h2>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-4">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/50">
                      Project
                    </p>

                    <p className="mt-1 text-[12px] font-bold">
                      {entity.title}
                    </p>
                  </div>

                  {heroImageSrc && heroMedia?.attribution ? (
                    <div className="max-w-[250px] text-right">
                      <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/45">
                        Image credit
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-white/70">
                        {heroMedia.attribution}
                        {heroMedia.license
                          ? ` · ${heroMedia.license}`
                          : ""}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>

            {/* ------------------------------------------------
                RIGHT — PROJECT INTELLIGENCE PREVIEW
            ------------------------------------------------ */}

            <div className="grid min-h-0 gap-3">

              {signature.length > 0 ? (
                <article className="rounded-[25px] bg-[#13231c] p-5 text-white shadow-[0_18px_45px_rgba(14,31,24,.12)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b9d4c6]">
                        Project Signature
                      </p>

                      <p className="mt-1 text-[10px] text-white/45">
                        Distinctive verified signals
                      </p>
                    </div>

                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.15em] text-white/65">
                      Verified
                    </span>
                  </div>

                  <div
                    className={`mt-5 grid gap-2 ${
                      signature.length > 1
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {signature.map((fact) => (
                      <div
                        key={`${fact.label}-${fact.value}`}
                        className="rounded-[15px] border border-white/10 bg-white/[0.055] p-3"
                      >
                        <p className="text-[23px] font-black leading-none tracking-[-0.04em]">
                          {fact.value}
                        </p>

                        <p className="mt-2 text-[8px] font-bold uppercase leading-3 tracking-[0.12em] text-white/55">
                          {fact.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
              <article className="rounded-[25px] border border-slate-200 bg-white p-5">
                {atGlance.length > 0 ? (
                  <>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                      At a Glance
                    </p>

                    <div className="mt-3 divide-y divide-slate-100">
                      {atGlance.map((fact) => (
                        <div
                          key={`${fact.label}-${fact.value}`}
                          className="grid grid-cols-[74px_1fr] gap-3 py-2"
                        >
                          <span className="text-[9px] text-slate-400">
                            {fact.label}
                          </span>

                          <strong className="text-[10px] leading-4 text-slate-900">
                            {fact.value}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}

                {entity.geography ? (
                  <div
                    className={
                      atGlance.length > 0
                        ? "mt-3 border-t border-slate-200 pt-3"
                        : ""
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-[12px] font-black tracking-[-0.02em] text-slate-950">
                          {entity.geography}
                        </p>
                      </div>

                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-700 ring-4 ring-blue-700/10" />
                    </div>
                  </div>
                ) : null}
              </article>
            </div>
          </div>

          {/* ------------------------------------------------
              ARKNOZ LENS
          ------------------------------------------------ */}

          {topics.length > 0 ? (
            <div className="mt-2 flex shrink-0 flex-wrap items-center gap-2 border-t border-black/10 pt-3">
              <span className="mr-2 text-[8px] font-black uppercase tracking-[0.22em] text-blue-700">
                Arknoz Lens
              </span>

              {topics.map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-[8px] font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {topic}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>


      {/* ==================================================
          SCREEN 2
      ================================================== */}

      <section
        id="project-intelligence"
        className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
      >
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-10">
          <div className="mb-4 flex shrink-0 flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-700">
                PROJECT INTELLIGENCE
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Understand the project
              </h2>
            </div>

            <p className="max-w-xl text-[12px] leading-5 text-slate-500">
              Facts, details, people, progress, evidence and connected
              Arknoz records in one workspace.
            </p>
          </div>

          <div className="min-h-0 flex-1">
            <ProjectDetailTabs entity={entity} />
          </div>

          {/* fixed compact ending inside screen 2 */}
          <div className="mt-4 shrink-0 border-t border-slate-200 pt-3">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px]">
              <span className="font-bold uppercase tracking-[0.15em] text-blue-700">
                Continue
              </span>

              <Link href="/projects" className="font-semibold">
                Projects →
              </Link>

              <Link href="/knowledge" className="font-semibold">
                Knowledge →
              </Link>

              <Link href="/learning" className="font-semibold">
                Learning →
              </Link>

              <Link href="/global" className="font-semibold">
                Global →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <UniversalFooterStrip />
      <GlobalFooter />
    </main>
  );
}
