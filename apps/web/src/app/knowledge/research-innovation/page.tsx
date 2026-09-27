import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research & Innovation",
  description:
    "Explore research, innovation, emerging approaches and evidence advancing the Built World.",
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
      activeSubsection="research-innovation"
    />
  );
}