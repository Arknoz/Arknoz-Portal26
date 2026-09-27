import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas & Insights",
  description:
    "Explore ideas, perspectives and insights shaping architecture, construction, cities and the wider Built World.",
};
import WorldIndexRoute from "@/components/WorldIndexRoute";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    geo?: string;
  }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexRoute
      sectionKey="knowledge"
      geoSlug={geo}
      activeSubsection="ideas-insights"
    />
  );
}