import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description:
    "Explore Built World learning, education, professional development and educational resources across Arknoz.",
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
      "learning",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="learning"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}