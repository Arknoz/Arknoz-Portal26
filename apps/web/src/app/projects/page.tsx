import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore architecture, buildings, infrastructure, development and Built World projects across countries, cities and regions.",
};
import WorldIndexRoute from "@/components/WorldIndexRoute";
import { resolveArknozSubsectionFromQuery } from "@/lib/arknoz-route-context";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    geo?: string;
    type?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;

  const activeSubsection =
    resolveArknozSubsectionFromQuery(
      "projects",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="projects"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}