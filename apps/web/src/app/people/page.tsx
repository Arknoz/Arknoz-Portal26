import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
  description:
    "Explore professionals, contributors and people connected to projects, organisations, knowledge and the wider Built World.",
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
      "people",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="people"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}