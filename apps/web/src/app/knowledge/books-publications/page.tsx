import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books & Publications",
  description:
    "Explore books, publications and published Built World knowledge across architecture, construction, cities, sustainability and related fields.",
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
      activeSubsection="books-publications"
    />
  );
}