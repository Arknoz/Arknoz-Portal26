import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/ProductDetailPage";
import { getProductionEntity } from "@/lib/data/production-entities";
import { getProductionProductDetail } from "@/lib/data/production-product-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [entity, detail] = await Promise.all([
    getProductionEntity("product", slug),
    getProductionProductDetail(slug),
  ]);

  if (!entity) {
    notFound();
  }

  return <ProductDetailPage entity={entity} detail={detail} />;
}
