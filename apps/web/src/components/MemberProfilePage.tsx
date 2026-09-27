import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import MemberConnectionAction from "@/components/MemberConnectionAction";
import MemberRequestAction from "@/components/MemberRequestAction";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

import type { EntityRecord } from "@/lib/entities";
import { hasPersonalArknozPro } from "@/lib/entitlements/arknoz-pro";
import type { MemberProfileData } from "@/lib/member-profile";
import { getProfileDetail } from "@/lib/profile-details";
import { getMemberProfile } from "@/lib/member-profile";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function stageLabel(stage?: string) {
  if (!stage) return "Professional";

  return stage
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function MemberProfilePage({
  entity,
  memberData,
}: {
  entity: EntityRecord;
  memberData?: MemberProfileData;
}) {
  const publicProfile = getProfileDetail(entity.slug);
  const member = memberData ?? getMemberProfile(entity.slug);

  const isRegisteredMember = Boolean(member);
  const isPro = hasPersonalArknozPro(member?.membership);

  const headline =
    member?.headline ??
    publicProfile?.professionalLine ??
    entity.subtitle ??
    "Built World professional";

  const location =
    member?.location ??
    publicProfile?.location ??
    entity.geography;

  const about =
    member?.about ??
    publicProfile?.overview ??
    entity.summary;

  const skills =
    member?.skills?.length
      ? member.skills
      : publicProfile?.focus.map((item) => item.title) ?? [];

  const sectors = member?.sectors ?? [];
  const projects = member?.featuredProjects ?? [];
  const experience = member?.experience ?? [];
  const credentials = member?.credentials ?? [];
  const workedWith = member?.workedWith ?? [];

  const services =
    member?.services?.filter(
      (service) => service.active !== false
    ) ?? [];

  const stage =
    isRegisteredMember
      ? stageLabel(member?.stage)
      : "Public Professional Record";

  return (
    <>
      <GlobalHeader />

      <main className="bg-[#f5f7fa] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1560px] px-6 py-5 lg:px-8">
            <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <Link href="/people" className="text-blue-700">
                People
              </Link>

              <span className="text-slate-400">›</span>

              <span className="text-slate-600">
                {publicProfile?.category ?? "Professional"}
              </span>

              <span className="text-slate-400">›</span>

              <span>{entity.title}</span>
            </nav>
          </div>
        </section>

        <section className="bg-[#f5f7fa]">
          <div className="mx-auto max-w-[1560px] px-6 py-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_440px]">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[26px] bg-[#0b2949] text-3xl font-bold text-white">
                    {initials(entity.title)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-blue-700">
                        {stage}
                      </span>

                      {isPro ? (
                        <span className="rounded-full bg-[#0b2949] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                          ARKNOZ PRO
                        </span>
                      ) : null}

                      {isRegisteredMember && !isPro ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          ARKNOZ MEMBER
                        </span>
                      ) : null}
                    </div>

                    {member?.arknozId ? (
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        ARKNOZ ID{" "}
                        <span className="text-[#0b2949]">
                          {member.arknozId}
                        </span>
                      </p>
                    ) : null}

                    <h1 className="mt-4 text-[clamp(36px,4.2vw,68px)] font-bold leading-[.98] tracking-[-.05em]">
                      {entity.title}
                    </h1>

                    <p className="mt-4 text-lg font-bold text-[#0b2949]">
                      {headline}
                    </p>

                    {member?.organisation ? (
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {member.organisation}
                      </p>
                    ) : null}

                    <p className="mt-2 text-sm text-slate-500">
                      {location}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {isRegisteredMember ? (
                      <div className="mt-5 flex flex-wrap items-start gap-3">
                        <MemberConnectionAction
                          targetSlug={entity.slug}
                          returnTo={`/people/${entity.slug}`}
                        />

                        <div className="rounded-full border border-slate-300 bg-white px-5 py-2.5">
                          <MemberRequestAction
                            targetSlug={entity.slug}
                            requestKind="collaborate"
                            contextPath={`/people/${entity.slug}`}
                            label="Collaborate"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-7 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0b2949]">
                      {member?.yearsExperience
                        ? `${member.yearsExperience}+ years`
                        : "Professional record"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Geography
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0b2949]">
                      {member?.countries?.length
                        ? `${member.countries.length} countries`
                        : location}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Services
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0b2949]">
                      {isPro && services.length
                        ? `${services.length} offered`
                        : isPro
                          ? "No active listing"
                          : "Pro feature"}
                    </p>
                  </div>
                </div>
              </article>

              <aside className="relative min-h-[330px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#d9e8f4] via-[#edf4f9] to-[#0b2949] p-6">
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(11,41,73,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.22) 1px,transparent 1px)",
                    backgroundSize: "38px 38px",
                  }}
                />

                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                      PROFESSIONAL IDENTITY
                    </p>

                    <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight text-[#071b31]">
                      Profile · Work · Knowledge · Services
                    </h2>
                  </div>

                  <div className="rounded-[20px] bg-white/80 p-5 backdrop-blur-sm">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      ARKNOZ
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#0b2949]">
                      One Built World professional identity.
                    </p>

                    <p className="mt-2 text-[11px] leading-5 text-slate-600">
                      Connected records strengthen the profile without inventing unsupported experience or relationships.
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-4 overflow-x-auto rounded-[20px] border border-slate-200 bg-white p-1.5">
              <nav className="flex min-w-max items-center">
                {[
                  ["Overview", "#overview"],
                  ["Projects", "#projects"],
                  ["Experience", "#experience"],
                  ["Services", "#services"],
                  ["Knowledge", "#knowledge"],
                  ["Arknoz CV", "#arknoz-cv"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="rounded-[14px] px-5 py-3 text-[12px] font-bold text-slate-600 transition hover:bg-[#0b2949] hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="mx-auto max-w-[1560px] px-6 py-4 lg:px-8"
        >
          <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                ABOUT
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Professional overview
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
                {about}
              </p>

              {sectors.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <span
                      key={sector}
                      className="rounded-full bg-[#f3f6f9] px-3 py-1.5 text-[10px] font-semibold"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="rounded-[26px] bg-[#0b2949] p-6 text-white">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                PROFESSIONAL STATUS
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {isPro
                  ? "Arknoz Pro"
                  : isRegisteredMember
                    ? "Arknoz Member"
                    : "Public Arknoz record"}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {publicProfile?.statusLabel ??
                  "Professional information shown from available Arknoz records."}
              </p>

              {member?.availability?.length ? (
                <div className="mt-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                    AVAILABILITY
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.availability.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[9px] font-semibold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <section
          id="projects"
          className="mx-auto max-w-[1560px] px-6 py-4 lg:px-8"
        >
          <article className="rounded-[26px] border border-slate-200 bg-white p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  PROJECTS
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Selected work
                </h2>
              </div>

              <Link
                href="/projects"
                className="text-[11px] font-bold text-blue-700"
              >
                Explore Projects →
              </Link>
            </div>

            {projects.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.title}
                    className="overflow-hidden rounded-[20px] border border-slate-200"
                  >
                    <div className="flex aspect-[16/9] items-center justify-center bg-[#edf3f7] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Project visual
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-[#0b2949]">
                        {project.title}
                      </h3>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {[project.location, project.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      {project.role ? (
                        <p className="mt-3 text-[11px] font-semibold">
                          {project.role}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-[18px] bg-slate-50 p-5 text-sm text-slate-500">
                Connected project records will appear here when genuine Arknoz project relationships are available.
              </p>
            )}
          </article>
        </section>

        <section
          id="experience"
          className="mx-auto max-w-[1560px] px-6 py-4 lg:px-8"
        >
          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                EXPERIENCE
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Professional timeline
              </h2>

              {experience.length ? (
                <div className="mt-5 divide-y divide-slate-100">
                  {experience.map((item) => (
                    <div
                      key={`${item.role}-${item.organisation}`}
                      className="py-4"
                    >
                      <h3 className="font-bold text-[#0b2949]">
                        {item.role}
                      </h3>

                      <p className="mt-1 text-sm font-semibold">
                        {item.organisation}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {[item.location, item.start, item.current ? "Present" : item.end]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  Structured career history has not been published for this profile.
                </p>
              )}
            </article>

            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                CREDENTIALS
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Qualifications & professional record
              </h2>

              {credentials.length ? (
                <div className="mt-5 space-y-3">
                  {credentials.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[16px] bg-slate-50 p-4"
                    >
                      <p className="text-sm font-bold">
                        {item.title}
                      </p>

                      {item.issuer ? (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {item.issuer}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  No additional credential records have been published.
                </p>
              )}
            </article>
          </div>
        </section>

        <section
          id="services"
          className="mx-auto max-w-[1560px] px-6 py-4 lg:px-8"
        >
          <article className="rounded-[26px] border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  SERVICES
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Professional services
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Only active Arknoz Pro members can publish services. Engagement and transactions are handled directly between provider and client.
                </p>
              </div>

              {isPro && services.length ? (
                <div className="w-fit rounded-full bg-[#0b2949] px-5 py-3 text-white">
                  <MemberRequestAction
                    targetSlug={entity.slug}
                    requestKind="service"
                    contextPath={`/people/${entity.slug}#services`}
                    label="Request Service"
                  />
                </div>
              ) : null}
            </div>

            {isPro && services.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-[20px] border border-slate-200 p-5"
                  >
                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      {service.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-[#0b2949]">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-[9px] font-semibold text-slate-500">
                      {service.remote ? (
                        <span>Remote</span>
                      ) : null}

                      {service.location ? (
                        <span>{service.location}</span>
                      ) : null}

                      {service.turnaround ? (
                        <span>{service.turnaround}</span>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <MemberRequestAction
                        targetSlug={entity.slug}
                        requestKind="service"
                        contextPath={`/people/${entity.slug}?service=${encodeURIComponent(service.id)}`}
                        label="Request Proposal →"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[20px] bg-[#f5f7fa] p-5">
                <p className="text-sm font-bold text-[#0b2949]">
                  {isPro
                    ? "No active service listings."
                    : "Services are an Arknoz Pro publishing feature."}
                </p>

                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  Any Arknoz member can discover and request services. Students, graduates, professionals and specialists may offer appropriate services when they have active Pro access.
                </p>
              </div>
            )}
          </article>
        </section>

        <section
          id="knowledge"
          className="mx-auto max-w-[1560px] px-6 py-4 lg:px-8"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                KNOWLEDGE
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Knowledge & contribution
              </h2>

              {publicProfile?.activities?.length ? (
                <div className="mt-5 space-y-3">
                  {publicProfile.activities.map((item) => (
                    <div
                      key={`${item.label}-${item.title}`}
                      className="rounded-[16px] bg-slate-50 p-4"
                    >
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-blue-700">
                        {item.label}
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  No connected Arknoz knowledge records are currently published.
                </p>
              )}
            </article>

            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                WORKED WITH
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Genuine professional relationships
              </h2>

              {workedWith.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {workedWith.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  Relationships appear only when supported by genuine Arknoz project, organisation or permissioned records.
                </p>
              )}
            </article>
          </div>
        </section>

        <section
          id="arknoz-cv"
          className="mx-auto max-w-[1560px] px-6 py-4 pb-8 lg:px-8"
        >
          <article className="overflow-hidden rounded-[28px] bg-[#0b2949] p-6 text-white sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  ARKNOZ CV
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Structured Built World professional record
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  Arknoz CV combines professional identity, experience, projects, credentials, expertise and connected evidence into a living professional record.
                </p>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-[10px] font-bold">
                  {isPro && member?.arknozCvEnabled
                    ? "Arknoz CV enabled"
                    : "Available with Arknoz Pro"}
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Future outputs can include shareable URL, QR code, PDF and selected-project versions.
                </p>
              </div>
            </div>
          </article>
        </section>

        <UniversalPublicLastScreen />
      </main>
    </>
  );
}
