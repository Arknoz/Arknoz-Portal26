import { notFound } from "next/navigation";

import KnowledgeDetailPage from "@/components/KnowledgeDetailPage";

import {
  getEntity,
} from "@/lib/entities";

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const entity =
    getEntity("knowledge", slug);

  if (!entity) {
    notFound();
  }

  return (
    <KnowledgeDetailPage
      entity={entity}
    />
  );
}
