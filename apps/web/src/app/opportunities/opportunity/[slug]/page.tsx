import { notFound } from "next/navigation";

import OpportunityDetailPage from "@/components/OpportunityDetailPage";
import { getEntity } from "@/lib/entities";

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
