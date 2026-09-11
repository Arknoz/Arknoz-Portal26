import { notFound } from "next/navigation";
import EntityDetailPage from "@/components/EntityDetailPage";
import { getEntity } from "@/lib/entities";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntity("knowledge", slug);

  if (!entity) notFound();

  return <EntityDetailPage entity={entity} />;
}
