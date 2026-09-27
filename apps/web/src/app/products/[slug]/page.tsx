import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/ProductDetailPage";
import { getProductionEntity } from "@/lib/data/production-entities";
import { getProductionProductDetail } from "@/lib/data/production-product-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const entity =
    await getProductionEntity(
      "product",
      slug
    );

  if (!entity) {
    return {
      title: "Product",
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

  const [entity, detail] = await Promise.all([
    getProductionEntity("product", slug),
    getProductionProductDetail(slug),
  ]);

  if (!entity) {
    notFound();
  }

  return <ProductDetailPage entity={entity} detail={detail} />;
}
