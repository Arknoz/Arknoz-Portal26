import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore the Built World across projects, products, knowledge, people, organisations, universities, opportunities and places.",
};
import GlobalHeader from "@/components/GlobalHeader";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import ExploreNowHomePanel from "@/components/ExploreNowHomePanel";
import ExploreInteractiveJourney from "@/components/ExploreInteractiveJourney";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <UniversalTopicHero
        eyebrow="EXPLORE"
        title="The Built World. Opened."
        description="Move across projects, products, knowledge, learning, people, organisations, places and opportunities."
        searchPlaceholder="Search project, product, topic, person, organisation or place..."
        popular={["sustainable buildings", "mass timber", "urban biodiversity", "universities", "jobs", "India"]}
        featured={[
          {
            type: "PROJECTS",
            title: "Explore Projects",
            meta: "Buildings · Infrastructure · Development",
            href: "/projects",
            image: "/visuals/portal/project.png",
          },
          {
            type: "PRODUCTS",
            title: "Explore Products",
            meta: "Materials · Systems · Equipment",
            href: "/products",
            image: "/visuals/portal/product.png",
          },
          {
            type: "KNOWLEDGE",
            title: "Explore Knowledge",
            meta: "Research · Cases · References",
            href: "/knowledge",
            image: "/visuals/portal/knowledge.png",
          },
        ]}
        ticker={[
          { text: "Explore the connected Built World", href: "#arknoz-worlds" },
          { text: "Search by project, product, topic, person or place", href: "/search" },
          { text: "Discover genuine records across Arknoz", href: "/featured" },
          { text: "Explore by country, city and local context", href: "/global" },
        ]}
        hideTicker
      />

      {/* ==================================================
          02 — ARKNOZ NOW · SAME LARGE PANEL AS HOME
      ================================================== */}

      <ExploreNowHomePanel />


      {/* ==================================================
          SCREENS 02–05 — INTERACTIVE EXPLORE JOURNEY
      ================================================== */}

      <ExploreInteractiveJourney />

      <UniversalPublicLastScreen />
    </main>
  );
}
