import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityDetailPage from "@/components/EntityDetailPage";
import { getEntity } from "@/lib/entities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const entity =
    getEntity(
      "place",
      slug
    );

  if (!entity) {
    return {
      title: "Place",
    };
  }

  return {
    title: entity.title,
    description: entity.summary,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntity("place", slug);

  if (!entity) notFound();

  return <EntityDetailPage entity={entity} />;
}
