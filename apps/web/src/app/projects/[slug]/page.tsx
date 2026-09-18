import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/ProjectDetailPage";
import { getProductionEntity } from "@/lib/data/production-entities";
import { getProductionProjectDetail } from "@/lib/data/production-project-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [entity, project] = await Promise.all([
    getProductionEntity("project", slug),
    getProductionProjectDetail(slug),
  ]);

  if (!entity) notFound();

  return (
    <ProjectDetailPage
      entity={{
        ...entity,
        project: project ?? entity.project,
      }}
    />
  );
}