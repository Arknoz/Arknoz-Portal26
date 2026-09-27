import type { Metadata } from "next";
import { notFound } from "next/navigation";

import OpportunityDetailPage from "@/components/OpportunityDetailPage";
import { getEntity } from "@/lib/entities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const entity =
    getEntity(
      "opportunity",
      slug
    );

  if (!entity) {
    return {
      title: "Opportunity",
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

  const entity = getEntity(
    "opportunity",
    slug
  );

  if (!entity) {
    notFound();
  }

  return (
    <OpportunityDetailPage
      entity={entity}
    />
  );
}
