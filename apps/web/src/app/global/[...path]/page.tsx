import { notFound } from "next/navigation";
import GeographyPage from "@/components/geography/GeographyPage";
import { findGeography } from "@/lib/geography";

export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;

  const slug = path[path.length - 1];
  const context = findGeography(slug);

  if (!context) {
    notFound();
  }

  return <GeographyPage context={context} />;
}
