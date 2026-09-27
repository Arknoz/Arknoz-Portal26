import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Understand Arknoz public access, free Arknoz ID membership and the Arknoz Pro professional layer.",
};
import PublicDestinationPage from "@/components/PublicDestinationPage";


export default function Page() {
  return (
    <PublicDestinationPage
      title="Pricing"
      description="Arknoz provides broad public discovery access, with deeper professional capabilities delivered through Arknoz Pro and organisation workspaces."
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
          description: "Paid professional operating layer with advanced workspaces, collaboration, messaging, tools, analytics and deeper intelligence.",
          href: "/intelligence",
        },
        {
          title: "Organisation Workspaces",
          description: "Company, university and institution capabilities are delivered through authorised Arknoz workspaces.",
        },
        {
          title: "Pricing Information",
          description: "Commercial pricing will be published when the corresponding paid services are opened for wider access.",
        },
        {
          title: "Current Access",
          description: "Public discovery remains open. Arknoz ID provides free member access. Arknoz Pro paid access will open when commercial activation is ready.",
          href: "/explore",
        },
      ]}
    />
  );
}
