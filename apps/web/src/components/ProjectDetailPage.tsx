import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import MemberActions from "@/components/MemberActions";
import ProjectDetailTabs from "@/components/ProjectDetailTabs";
import type { EntityRecord } from "@/lib/entities";

export default function ProjectDetailPage({
  entity,
}: {
  entity: EntityRecord;
}) {
  const p = entity.project;
  const facts = p?.facts ?? [];
  const media = p?.media ?? [];

  const subsection = p?.category || "Projects";
  const canonicalUrl = `/projects/${entity.slug}`;

  return (
    <main className="bg-white text-slate-950">
      <GlobalHeader />

      {/* ==================================================
          SCREEN 1
      ================================================== */}

      <section
        id="project-first-screen"
        className="bg-[#f6f8fb] lg:h-[calc(100svh-88px)]"
      >
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-10">
          <div className="mb-4 flex shrink-0 items-center gap-2 text-[11px] font-semibold text-slate-500">
            <Link href="/projects" className="hover:text-blue-700">
              Projects
            </Link>

            <span>›</span>

            <Link href="/projects" className="hover:text-blue-700">
              {subsection}
            </Link>

            <span>›</span>

            <span className="font-bold text-slate-950">
              {entity.title}
            </span>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[.75fr_1.25fr]">
            {/* identity */}
            <article className="flex h-full flex-col justify-between rounded-[26px] bg-white p-7 ring-1 ring-slate-200">
              <div>
                <div className="flex flex-wrap gap-2">
                  {entity.trust ? (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-blue-700">
                      {entity.trust}
                    </span>
                  ) : null}

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    {subsection}
                  </span>
                </div>

                <h1 className="mt-5 text-5xl font-bold tracking-[-0.045em] xl:text-6xl">
                  {entity.title}
                </h1>

                {p?.strapline ? (
                  <p className="mt-4 max-w-2xl text-[21px] font-semibold leading-7">
                    {p.strapline}
                  </p>
                ) : null}

                <p className="mt-4 max-w-2xl text-[15px] leading-6 text-slate-600">
                  {entity.summary}
                </p>

                <div className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                  {facts.slice(0, 4).map((fact) => (
                    <div
                      key={fact.label}
                      className="border-t border-slate-200 pt-2.5 text-[13px]"
                    >
                      <span className="text-slate-500">
                        {fact.label}
                      </span>

                      <strong className="ml-2 text-slate-950">
                        {fact.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <MemberActions returnTo={canonicalUrl} />

                <a
                  href="#project-intelligence"
                  className="text-sm font-bold text-blue-700"
                >
                  Project details ↓
                </a>
              </div>
            </article>

            {/* reference-style visual */}
            <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1fr_180px]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-[#0b2949]">
                {media[0] ? (
                  <img
                    src={media[0].src}
                    alt={media[0].alt ?? entity.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-6 pt-24 text-white">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-100">
                    PROJECT
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {entity.title}
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-200">
                    Verified project record
                  </p>
                </div>
              </div>

              <div className="hidden h-full min-h-0 grid-rows-2 gap-3 lg:grid">
                <article className="flex flex-col justify-between rounded-[22px] bg-[#0b2949] p-4 text-white">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                      VERIFIED
                    </p>

                    <p className="mt-2 text-sm font-bold">
                      Project data
                    </p>
                  </div>

                  <p className="text-[11px] leading-5 text-slate-300">
                    Source-backed identity, facts and engineering information.
                  </p>
                </article>

                <article className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    AT A GLANCE
                  </p>

                  <div className="mt-3 space-y-3">
                    {facts.slice(4, 7).map((fact) => (
                      <div key={fact.label}>
                        <p className="text-[10px] text-slate-400">
                          {fact.label}
                        </p>

                        <p className="text-sm font-bold">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
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
