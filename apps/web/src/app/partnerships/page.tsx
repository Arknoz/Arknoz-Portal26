import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Explore partnership opportunities with Arknoz across the Built World, including knowledge, institutions, industry and professional collaboration.",
};
import PublicDestinationPage from "@/components/PublicDestinationPage";


export default function Page() {
  return (
    <PublicDestinationPage
      title="Partnerships"
      description="Connect universities, practices, industry, research, institutions and organisations through the Arknoz Built World network."
      cards={[
        {
          title: "Universities",
          description: "Connect academic programmes, research, people and institutional activity.",
          href: "/universities",
        },
        {
          title: "Organisations",
          description: "Discover practices, companies, institutions and potential collaborators.",
          href: "/organisations",
        },
        {
          title: "Community",
          description: "Participation, contribution and collaboration across Arknoz.",
          href: "/community",
        },
        {
          title: "Knowledge",
          description: "Research, evidence, references and practical Built World knowledge.",
          href: "/knowledge",
        },
        {
          title: "Opportunities",
          description: "Calls, competitions, funding and collaboration opportunities.",
          href: "/opportunities",
        },
        {
          title: "Explore",
          description: "Move across the wider connected Built World.",
          href: "/explore",
        },
      ]}
    />
  );
}