import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access",
  description:
    "Understand free public Arknoz access, free Arknoz ID membership and the future Arknoz Pro professional layer.",
};
import PublicDestinationPage from "@/components/PublicDestinationPage";


export default function Page() {
  return (
    <PublicDestinationPage
      title="Access"
      description="Arknoz public discovery and Arknoz ID membership are free. Arknoz Pro is the future professional layer and is not yet available for activation."
      cards={[
        {
          title: "Explore Arknoz",
          description: "Open public discovery across projects, products, knowledge, learning, opportunities, people, organisations, universities and places.",
          href: "/explore",
        },
        {
          title: "Arknoz ID",
          description: "Free member identity with your professional profile, Arknoz ID, saved activity, contributions, Community access and professional connections.",
          href: "/join",
        },
        {
          title: "Arknoz Pro",
          description: "Future professional operating layer with advanced workspaces, messaging, tools, analytics and deeper intelligence. Coming later.",
          href: "/intelligence",
        },
        {
          title: "Organisation Workspaces",
          description: "Company, university and institution capabilities are delivered through authorised Arknoz workspaces.",
        },
        {
          title: "Arknoz Pro Availability",
          description: "Arknoz Pro is not being sold during the public-beta launch. Access details will be published before activation.",
        },
        {
          title: "Current Access",
          description: "Public discovery is free. Arknoz ID is free. Arknoz Pro remains visible as the future professional layer and is coming later.",
          href: "/explore",
        },
      ]}
    />
  );
}
