import "server-only";

import type {
  ProductDetailData,
  ProductMedia,
  ProductSource,
} from "@/lib/product-details";
import { createClient } from "@/lib/supabase/server";

type ProductEntityRow = {
  id: string;
  detail: unknown;
  official_url: string | null;
};

type ProductSourceRow = {
  label: string;
  organisation: string | null;
  url: string;
};

type ProductTopicRow = {
  topic: string;
};

type ProductMediaRow = {
  url: string;
  alt: string | null;
};

export async function getProductionProductDetail(
  slug: string
): Promise<ProductDetailData | undefined> {
  const supabase = await createClient();

  const {
    data: entity,
    error: entityError,
  } = await supabase
    .from("entities")
    .select("id,detail,official_url")
    .eq("entity_type", "product")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();

  if (entityError) {
    throw new Error(
      `[Arknoz data] Failed to load product detail ${slug}: ${entityError.message}`
    );
  }

  if (!entity) {
    return undefined;
  }

  const [
    sourceResult,
    topicResult,
    mediaResult,
  ] = await Promise.all([
    supabase
      .from("entity_sources")
      .select("label,organisation,url")
      .eq("entity_id", entity.id),

    supabase
      .from("entity_topics")
      .select("topic")
      .eq("entity_id", entity.id),

    supabase
      .from("entity_media")
      .select("url,alt")
      .eq("entity_id", entity.id)
      .eq("publishable", true)
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  if (sourceResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load product sources ${slug}: ${sourceResult.error.message}`
    );
  }

  if (topicResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load product topics ${slug}: ${topicResult.error.message}`
    );
  }

  if (mediaResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load product media ${slug}: ${mediaResult.error.message}`
    );
  }

  const base =
    (entity.detail ?? {}) as ProductDetailData;

  const sources: ProductSource[] =
    (
      (sourceResult.data ?? []) as ProductSourceRow[]
    ).map((source) => ({
      label: source.label,
      organisation:
        source.organisation ?? undefined,
      href: source.url,
    }));

  const topics =
    (
      (topicResult.data ?? []) as ProductTopicRow[]
    ).map((item) => item.topic);

  const media: ProductMedia[] =
    (
      (mediaResult.data ?? []) as ProductMediaRow[]
    ).map((item) => ({
      src: item.url,
      alt: item.alt ?? undefined,
    }));

  return {
    ...base,
    officialUrl:
      entity.official_url ??
      base.officialUrl,
    sources,
    topics,
    media,
  };
}