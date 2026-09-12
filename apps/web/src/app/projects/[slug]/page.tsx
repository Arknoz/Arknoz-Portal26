import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/ProjectDetailPage";
import { getProductionEntity } from "@/lib/data/production-entities";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = await getProductionEntity("project", slug);

  if (!entity) notFound();

  return <ProjectDetailPage entity={entity} />;
}
