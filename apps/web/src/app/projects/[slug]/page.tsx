import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/ProjectDetailPage";
import { getEntity } from "@/lib/entities";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntity("project", slug);

  if (!entity) notFound();

  return <ProjectDetailPage entity={entity} />;
}
