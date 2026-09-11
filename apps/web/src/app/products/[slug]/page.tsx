import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/ProductDetailPage";
import { getEntity } from "@/lib/entities";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const entity = getEntity("product", slug);

  if (!entity) {
    notFound();
  }

  return <ProductDetailPage entity={entity} />;
}
