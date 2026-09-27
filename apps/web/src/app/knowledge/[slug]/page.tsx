import type { Metadata } from "next";
import { notFound } from "next/navigation";

import KnowledgeDetailPage from "@/components/KnowledgeDetailPage";

import { getProductionEntity, getProductionEntities } from "@/lib/data/production-entities";
import { getProductionKnowledgeDetail } from "@/lib/data/production-knowledge-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const entity =
    await getProductionEntity(
      "knowledge",
      slug
    );

  if (!entity) {
    return {
      title: "Knowledge",
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
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const [entity, detail, productionEntities] = await Promise.all([
    getProductionEntity("knowledge", slug),
    getProductionKnowledgeDetail(slug),
    getProductionEntities(),
  ]);

  if (!entity) {
    notFound();
  }

  const relatedKnowledge = productionEntities
    .filter(
      (item) =>
        item.type === "knowledge" &&
        item.slug !== slug
    )
    .slice(0, 3);

  return (
    <KnowledgeDetailPage
      entity={entity}
      detail={detail}
      relatedKnowledge={relatedKnowledge}
    />
  );
}
