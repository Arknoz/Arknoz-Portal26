import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import ProfileDetailTabs from "@/components/ProfileDetailTabs";

import type {
  EntityRecord,
} from "@/lib/entities";

import {
  getProfileDetail,
  type ProfileDetailData,
} from "@/lib/profile-details";


function getInitials(
  title: string
) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0)
    )
    .join("")
    .toUpperCase();
}


function ProfileHeroVisual({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail: ProfileDetailData;
}) {
  const initials =
    getInitials(entity.title);

  return (
    <div className="relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#dcebf8] via-[#edf5fb] to-[#0b2949]">

      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,41,73,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.18) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />


      <div className="absolute left-[9%] top-[12%] flex h-[46%] w-[42%] items-center justify-center rounded-[30px] border border-white/60 bg-white/45 shadow-[0_20px_50px_rgba(7,27,49,.08)] backdrop-blur-[3px]">

        <span className="text-[clamp(62px,7vw,110px)] font-bold tracking-[-.08em] text-[#0b2949]">
          {initials}
        </span>
      </div>


      <div className="absolute right-[7%] top-[13%] w-[38%]">

        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
          {detail.kind === "person"
            ? "PROFESSIONAL PROFILE"
            : detail.kind ===
              "university"
            ? "INSTITUTION PROFILE"
            : "ORGANISATION PROFILE"}
        </p>

        <p className="mt-3 text-[25px] font-bold leading-8 text-[#071b31]">
          {detail.professionalLine}
        </p>

        <div className="mt-5 space-y-2">

          {detail.focus
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.title}
                className="rounded-[12px] bg-white/55 px-3 py-2 text-[9px] font-bold text-[#0b2949] backdrop-blur-sm"
              >
                {item.title}
              </div>
            ))}
        </div>
      </div>


      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31]/95 to-transparent p-7 pt-20 text-white">

        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
          PROFILE
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {entity.title}
        </h2>

        <p className="mt-1 text-[11px] text-slate-300">
          Canonical Arknoz identity
        </p>
      </div>
    </div>
  );
}


export default function ProfileDetailPage({
  entity,
}: {
  entity: EntityRecord;
}) {
  const stored =
    getProfileDetail(entity.slug);

  const detail: ProfileDetailData =
    stored ?? {
      kind:
        entity.type ===
        "person"
          ? "person"
          : entity.type ===
            "university"
          ? "university"
          : "organisation",

      category:
        entity.subtitle ??
        "Profile",

      professionalLine:
        entity.subtitle ??
        "Built World profile",

      tagline:
        entity.summary,

      overview:
        entity.summary,

      location:
        entity.geography,

      statusLabel:
        "Public Arknoz record",

      facts: [
        {
          label: "Type",
          value:
            entity.subtitle ??
            entity.type,
        },
        {
          label: "Location",
          value:
            entity.geography,
        },
      ],

      focus: [],

      activities: [],

      sources: [],

      connections: [],
    };


  const headlineFacts =
    detail.facts.slice(0, 4);

  const glanceFacts =
    detail.facts.slice(3, 6);


  const parentRoute =
    detail.kind === "person"
      ? "/people"
      : detail.kind ===
        "university"
      ? "/universities"
      : "/organisations";


  const parentLabel =
    detail.kind === "person"
      ? "People"
      : detail.kind ===
        "university"
      ? "Universities"
      : "Organisations";


  return (
    <>
      <GlobalHeader />

      <main>

        {/* ==================================================
            SCREEN 1 — CANONICAL IDENTITY
        ================================================== */}

        <section className="bg-[#f6f8fb] lg:h-[calc(100svh-88px)]">

          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-8">

            <nav className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">

              <Link
                href={parentRoute}
                className="text-blue-700"
              >
                {parentLabel}
              </Link>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-600">
                {detail.category}
              </span>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-950">
                {entity.title}
              </span>
            </nav>


            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[.84fr_1.05fr_190px]">


              {/* IDENTITY */}
              <article className="flex min-h-0 flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-7">

                <div>

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-blue-700">
                      {detail.kind ===
                      "person"
                        ? "PERSON"
                        : detail.kind ===
                          "university"
                        ? "UNIVERSITY"
                        : "ORGANISATION"}
                    </span>

                    <span className="rounded-full bg-[#f3f6f9] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600">
                      {detail.category}
                    </span>
                  </div>


                  <h1 className="mt-6 text-[clamp(36px,3.8vw,62px)] font-bold leading-[.98] tracking-[-.045em]">
                    {entity.title}
                  </h1>


                  <h2 className="mt-4 text-[17px] font-bold text-[#0b2949]">
                    {
                      detail.professionalLine
                    }
                  </h2>


                  <p className="mt-4 max-w-[580px] text-[19px] font-bold leading-7">
                    {detail.tagline}
                  </p>


                  <p className="mt-3 text-[12px] font-medium text-slate-500">
                    {detail.location}
                  </p>


                  {headlineFacts.length >
                  0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-x-6">

                      {headlineFacts.map(
                        (fact) => (
                          <div
                            key={fact.label}
                            className="border-t border-slate-200 py-3"
                          >
                            <span className="text-[10px] text-slate-500">
                              {fact.label}
                            </span>

                            <strong className="ml-2 text-[11px]">
                              {fact.value}
                            </strong>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}
                </div>


                <div className="flex items-center justify-between gap-3">

                  {detail.officialUrl ? (
                    <a
                      href={
                        detail.officialUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[#0b2949] px-5 py-3 text-[10px] font-bold text-white transition hover:-translate-y-[1px] hover:shadow-md"
                    >
                      {detail.officialLabel ??
                        "Official source"}{" "}
                      ↗
                    </a>
                  ) : (
                    <span />
                  )}


                  <a
                    href="#profile-detail"
                    className="text-[11px] font-bold text-blue-700"
                  >
                    Profile details ↓
                  </a>
                </div>
              </article>


              {/* VISUAL */}
              <ProfileHeroVisual
                entity={entity}
                detail={detail}
              />


              {/* RIGHT RAIL */}
              <div className="grid min-h-0 grid-rows-[1.05fr_.95fr] gap-3">

                <article className="flex flex-col justify-between rounded-[24px] bg-[#0b2949] p-5 text-white">

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      CANONICAL
                    </p>

                    <h3 className="mt-3 text-[15px] font-bold">
                      Arknoz profile
                    </h3>
                  </div>

                  <p className="text-[10px] leading-5 text-slate-300">
                    Professional identity, work and genuine Built World connections.
                  </p>
                </article>


                <article className="rounded-[24px] border border-slate-200 bg-white p-5">

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    AT A GLANCE
                  </p>

                  <div className="mt-4 space-y-4">

                    {glanceFacts.map(
                      (fact) => (
                        <div
                          key={fact.label}
                        >
                          <p className="text-[9px] text-slate-400">
                            {fact.label}
                          </p>

                          <p className="mt-1 text-[12px] font-bold leading-4">
                            {fact.value}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>


        {/* ==================================================
            SCREEN 2
        ================================================== */}

        <section
          id="profile-detail"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >

          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex items-end justify-between gap-8">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  PROFILE
                </p>

                <h2 className="mt-1 text-[26px] font-bold">
                  Understand the profile
                </h2>
              </div>


              <p className="hidden max-w-xl text-right text-[11px] leading-5 text-slate-500 lg:block">
                Identity, professional or institutional focus, official sources and connected Built World records.
              </p>
            </div>


            <div className="min-h-0 flex-1">

              <ProfileDetailTabs
                entity={entity}
                detail={detail}
              />
            </div>


            <div className="mt-3 flex items-center gap-8 border-t border-slate-200 pt-3 text-[10px] font-bold">

              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/people">
                People →
              </Link>

              <Link href="/organisations">
                Organisations →
              </Link>

              <Link href="/universities">
                Universities →
              </Link>

              <Link href="/global">
                Global →
              </Link>
            </div>
          </div>
        </section>


        <UniversalFooterStrip />
        <GlobalFooter />
      </main>
    </>
  );
}
