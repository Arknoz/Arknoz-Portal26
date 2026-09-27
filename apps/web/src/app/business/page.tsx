import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business",
  description:
    "Explore how businesses, practices, employers and organisations can participate in the Arknoz Built World network.",
};
import PublicDestinationPage from "@/components/PublicDestinationPage";


export default function Page() {
  return (
    <PublicDestinationPage
      title="For Business"
      description="Discover how practices, companies, manufacturers, employers, developers and institutions can operate across Arknoz."
      cards={[
        {
          title: "Organisations",
          description: "Discover practices, companies, institutions and professional organisations.",
          href: "/organisations",
        },
        {
          title: "Projects",
          description: "Explore Built World projects and connected delivery context.",
          href: "/projects",
        },
        {
          title: "Products",
          description: "Explore materials, systems, equipment and manufacturers.",
          href: "/products",
        },
        {
          title: "People",
          description: "Discover professionals and connected expertise.",
          href: "/people",
        },
        {
          title: "Opportunities",
          description: "Jobs, competitions, funding and professional opportunities.",
          href: "/opportunities",
        },
        {
          title: "Arknoz Pro",
          description: "Professional operating tools and intelligence for the Built World.",
          href: "/intelligence",
        },
      ]}
    />
  );
}