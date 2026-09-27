import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore the Built World across projects, products, knowledge, people, organisations, universities, opportunities and places.",
};
import GlobalHeader from "@/components/GlobalHeader";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import HomeNowOnArknozLoop from "@/components/HomeNowOnArknozLoop";
import ExploreInteractiveJourney from "@/components/ExploreInteractiveJourney";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <UniversalTopicHero
        eyebrow="EXPLORE"
        title="Explore the Built World."
        description="Search everything, enter a Built World section, or start with what you want to do."
        searchPlaceholder="Search projects, products, knowledge, people, places..."
        popular={["sustainable buildings", "mass timber", "urban biodiversity", "universities", "jobs", "India"]}
        featured={[
          {
            type: "PROJECTS",
            title: "Explore Projects",
            meta: "Buildings · Infrastructure · Development",
            href: "/projects",
            image: "/visuals/arknoz-built-world-watermark.jpg",
          },
          {
            type: "PRODUCTS",
            title: "Explore Products",
            meta: "Materials · Systems · Equipment",
            href: "/products",
            image: "/visuals/arknoz-built-world-watermark.jpg",
          },
          {
            type: "KNOWLEDGE",
            title: "Explore Knowledge",
            meta: "Research · Cases · References",
            href: "/knowledge",
            image: "/visuals/arknoz-built-world-watermark.jpg",
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

      <div data-explore-screen="arknoz-now">
        <HomeNowOnArknozLoop />
      </div>


      {/* ==================================================
          SCREENS 02–05 — INTERACTIVE EXPLORE JOURNEY
      ================================================== */}

      <ExploreInteractiveJourney />

      <UniversalPublicLastScreen />
    </main>
  );
}
