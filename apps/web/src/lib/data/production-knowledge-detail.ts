import "server-only";

import type {
  KnowledgeDetailData,
  KnowledgeSource,
} from "@/lib/knowledge-details";
import { createClient } from "@/lib/supabase/server";

type KnowledgeEntityRow = {
  id: string;
  detail: unknown;
};

type KnowledgeSourceRow = {
  label: string;
  organisation: string | null;
  source_type:
    | "official"
    | "primary"
    | "secondary"
    | "partner"
    | "other";
};

type KnowledgeTopicRow = {
  topic: string;
};

function sourceStatus(
  sourceType: KnowledgeSourceRow["source_type"]
): string {
  switch (sourceType) {
    case "official":
      return "Official source";
    case "primary":
      return "Primary source";
    case "secondary":
      return "Secondary source";
    case "partner":
      return "Partner source";
    default:
      return "Source";
  }
}

export async function getProductionKnowledgeDetail(
  slug: string
): Promise<KnowledgeDetailData | undefined> {
  const supabase = await createClient();

  const entityResult = await supabase
    .from("entities")
    .select("id,detail")
    .eq("entity_type", "knowledge")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();

  if (entityResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load knowledge detail ${slug}: ${entityResult.error.message}`
    );
  }

  if (!entityResult.data) {
    return undefined;
  }

  const entity =
    entityResult.data as KnowledgeEntityRow;

  const [sourceResult, topicResult] =
    await Promise.all([
      supabase
        .from("entity_sources")
        .select("label,organisation,source_type")
        .eq("entity_id", entity.id)
        .order("label", { ascending: true }),

      supabase
        .from("entity_topics")
        .select("topic")
        .eq("entity_id", entity.id)
        .order("topic", { ascending: true }),
    ]);

  if (sourceResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load knowledge sources ${slug}: ${sourceResult.error.message}`
    );
  }

  if (topicResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load knowledge topics ${slug}: ${topicResult.error.message}`
    );
  }

  const base =
    (entity.detail ?? {}) as KnowledgeDetailData;

  const sources: KnowledgeSource[] =
    (
      (sourceResult.data ?? []) as KnowledgeSourceRow[]
    ).map((source) => ({
      label: source.label,
      organisation:
        source.organisation ?? "Source",
      status: sourceStatus(source.source_type),
    }));

  const topics =
    (
      (topicResult.data ?? []) as KnowledgeTopicRow[]
    ).map((item) => item.topic);

  return {
    ...base,
    sources,
    topics,
  };
}