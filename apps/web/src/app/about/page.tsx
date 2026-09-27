import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Arknoz, the open Built World network connecting projects, products, knowledge, people, organisations, universities, opportunities and places.",
};
import PublicDestinationPage from "@/components/PublicDestinationPage";


export default function AboutPage() {
  return (
    <PublicDestinationPage
      title="About Arknoz"
      description="Arknoz connects projects, products, knowledge, learning, opportunities, people, organisations, universities, places, community and professional intelligence in one global Built World system."
      cards={[
        {
          title: "Discover",
          description: "Projects, products, people, organisations, universities and places.",
          href: "/explore",
        },
        {
          title: "Understand",
          description: "Knowledge, research, references, learning and connected evidence.",
          href: "/knowledge",
        },
        {
          title: "Participate",
          description: "Opportunities, contribution, collaboration and Arknoz Community.",
          href: "/community",
        },
        {
          title: "Connect",
          description: "Professional workflows, organisations and collaboration across the Built World.",
          href: "/organisations",
        },
        {
          title: "Intelligence",
          description: "Professional operating tools and intelligence through Arknoz Pro.",
          href: "/intelligence",
        },
        {
          title: "Global",
          description: "A geography-aware structure from global context to continents, countries, regions, cities and places.",
          href: "/global",
        },
      ]}
    />
  );
}