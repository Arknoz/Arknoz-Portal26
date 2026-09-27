import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Explore jobs, competitions, collaborations, fellowships, funding and other opportunities across the Built World.",
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
      "opportunities",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="opportunities"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}