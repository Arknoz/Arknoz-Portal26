import Link from "next/link";

import KnowledgeDetailTabs from "@/components/KnowledgeDetailTabs";
import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import { getEntityHref } from "@/components/EntityCard";

import type {
  EntityRecord,
} from "@/lib/entities";

import type {
  KnowledgeDetailData,
} from "@/lib/knowledge-details";

function KnowledgeHeroVisual({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: KnowledgeDetailData;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#dcebf8] via-[#eef5fa] to-[#0b2949]">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,41,73,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.18) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ORIGINAL ARKNOZ DOCUMENT VISUAL */}
      <div className="absolute left-[10%] top-[10%] h-[70%] w-[55%] rounded-[20px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(7,27,49,.14)] backdrop-blur-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-blue-700">
          {detail?.recordType ??
            "KNOWLEDGE"}
        </p>

        <p className="mt-6 text-[28px] font-bold leading-8 tracking-tight text-[#071b31]">
          WORLD
          <br />
          CITIES
          <br />
          REPORT
          <br />
          2024
        </p>

        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-[11px] font-bold text-[#0b2949]">
            Cities and Climate Action
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            UN-Habitat
          </p>
        </div>
      </div>

      {/* ABSTRACT CITY SIGNAL */}
      <div className="absolute bottom-[18%] right-[7%] flex h-[38%] items-end gap-2 opacity-70">
        <div className="h-[40%] w-8 bg-white/45" />
        <div className="h-[65%] w-9 bg-white/45" />
        <div className="h-[48%] w-8 bg-white/45" />
        <div className="h-[90%] w-10 bg-white/45" />
        <div className="h-[58%] w-9 bg-white/45" />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31]/95 to-transparent p-7 pt-20 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
          KNOWLEDGE
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {entity.title}
        </h2>

        <p className="mt-1 text-[12px] text-slate-300">
          Source-aware knowledge record
        </p>
      </div>
    </div>
  );
}

export default function KnowledgeDetailPage({
  entity,
  detail,
  relatedKnowledge = [],
}: {
  entity: EntityRecord;
  detail?: KnowledgeDetailData;
  relatedKnowledge?: EntityRecord[];
}) {

  const facts = detail?.facts ?? [];

  const section =
    detail?.section ?? "Knowledge";

  const knowledgeFeatured = relatedKnowledge
    .slice(0, 3)
    .map((item) => ({
      type: item.subtitle || "KNOWLEDGE",
      title: item.title,
      meta: `${item.geography}${item.trust ? ` · ${item.trust}` : ""}`,
      href: getEntityHref(item),
      image: "/visuals/portal/knowledge.png",
    }));

  return (
    <>
      <main>
        <UniversalPublicFirstScreen
          eyebrow={`${section.toUpperCase()} · KNOWLEDGE`}
          title={entity.title}
          description={detail?.strapline || entity.summary}
          searchPlaceholder={`Search Knowledge — publication, research, standard, method or topic...`}
          popular={[
            { label: "Knowledge Home", href: "/knowledge" },
            { label: section, href: "/knowledge" },
            { label: "Projects", href: "/projects" },
            { label: "Global", href: "/global" },
          ]}
          contextNav={[
            { label: "Knowledge Home", href: "/knowledge" },
            { label: section, href: "/knowledge" },
            { label: "Projects", href: "/projects" },
            { label: "Products", href: "/products" },
            { label: "Global", href: "/global" },
          ]}
          featured={knowledgeFeatured}
          featuredHref="/knowledge"
          ticker={[
            { text: "Explore related Knowledge", href: "#knowledge-intelligence" },
            { text: "Continue into Arknoz Intelligence", href: "#knowledge-intelligence" },
            { text: "Discover connected Projects", href: "/projects" },
            { text: "Explore the Built World globally", href: "/global" },
          ]}
        />
{/* ==================================================
            SCREEN 2
        ================================================== */}

        <section
          id="knowledge-intelligence"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >
          <div className="mx-auto flex h-full max-w-[1720px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex shrink-0 items-end justify-between gap-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  KNOWLEDGE INTELLIGENCE
                </p>

                <h2 className="mt-1 text-[26px] font-bold tracking-tight">
                  Understand the knowledge
                </h2>
              </div>

              <p className="hidden max-w-xl text-right text-[12px] leading-5 text-slate-500 lg:block">
                Context, themes, provenance, rights and connected Built World knowledge in one workspace.
              </p>
            </div>

            <div className="min-h-0 flex-1">
              <KnowledgeDetailTabs
                entity={entity}
                detail={detail}
                relatedKnowledge={relatedKnowledge}
              />
            </div>

            <div className="mt-3 flex shrink-0 items-center gap-8 border-t border-slate-200 pt-3 text-[11px] font-bold">
              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/knowledge">
                Knowledge →
              </Link>

              <Link href="/projects">
                Projects →
              </Link>

              <Link href="/products">
                Products →
              </Link>

              <Link href="/global">
                Global →
              </Link>
            </div>
          </div>
        </section>

        <UniversalPublicLastScreen />
      </main>
    </>
  );
}
