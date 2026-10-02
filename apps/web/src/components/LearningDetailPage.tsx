import Link from "next/link";

import LearningDetailTabs from "@/components/LearningDetailTabs";
import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

import type {
  LearningDetailData,
} from "@/lib/learning-details";

export default function LearningDetailPage({
  detail,
}: {
  detail: LearningDetailData;
}) {
  const learningType =
    detail.learningType ?? "Learning";

  const description =
    detail.strapline ??
    detail.summary ??
    "Structured learning across the Built World.";

  return (
    <>
      <main>
        <UniversalPublicFirstScreen
          eyebrow={`${learningType.toUpperCase()} · LEARNING`}
          title={detail.title}
          description={description}
          searchPlaceholder="Search Learning & Education — course, programme, skill, topic or provider..."
          popular={[
            { label: "Learning Home", href: "/learning" },
            { label: learningType, href: "/learning" },
            { label: "Knowledge", href: "/knowledge" },
            { label: "Projects", href: "/projects" },
            { label: "Global", href: "/global" },
          ]}
          contextNav={[
            { label: "Learning Home", href: "/learning" },
            { label: "Knowledge", href: "/knowledge" },
            { label: "Projects", href: "/projects" },
            { label: "Opportunities", href: "/opportunities" },
            { label: "Global", href: "/global" },
          ]}
          featured={[]}
          featuredHref="/learning"
          ticker={[
            {
              text: "Understand this learning record",
              href: "#learning-intelligence",
            },
            {
              text: "Explore Learning & Education",
              href: "/learning",
            },
            {
              text: "Discover connected Knowledge",
              href: "/knowledge",
            },
            {
              text: "Explore connected opportunities",
              href: "/opportunities",
            },
          ]}
        />
{/* ==================================================
            SCREEN 2 — LEARNING INTELLIGENCE
        ================================================== */}

        <section
          id="learning-intelligence"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >
          <div className="mx-auto flex h-full max-w-[1720px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex shrink-0 items-end justify-between gap-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  LEARNING INTELLIGENCE
                </p>

                <h2 className="mt-1 text-[26px] font-bold tracking-tight">
                  Understand the learning
                </h2>
              </div>

              <p className="hidden max-w-xl text-right text-[11px] leading-5 text-slate-500 lg:block">
                Outcomes, resources, provider context, source state and connected Built World pathways in one workspace.
              </p>
            </div>

            <div className="min-h-0 flex-1">
              <LearningDetailTabs
                detail={detail}
              />
            </div>

            <div className="mt-3 flex shrink-0 items-center gap-8 border-t border-slate-200 pt-3 text-[10px] font-bold">
              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/learning">
                Education →
              </Link>

              <Link href="/knowledge">
                Knowledge →
              </Link>

              <Link href="/projects">
                Projects →
              </Link>

              <Link href="/opportunities">
                Opportunities →
              </Link>
            </div>
          </div>
        </section>

        <UniversalPublicLastScreen />
      </main>
    </>
  );
}
