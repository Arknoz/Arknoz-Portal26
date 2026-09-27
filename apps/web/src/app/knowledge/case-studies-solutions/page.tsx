import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies & Solutions",
  description:
    "Explore Built World case studies, applied solutions and real-world examples across projects, cities, materials and professional practice.",
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
      activeSubsection="case-studies-solutions"
    />
  );
}