import "server-only";

import type {
  ProjectMedia,
  ProjectRecordData,
  ProjectSource,
} from "@/lib/entities";
import { createClient } from "@/lib/supabase/server";

type ProjectEntityRow = {
  id: string;
  detail: unknown;
};

type ProjectMediaRow = {
  role: string;
  url: string;
  alt: string | null;
  source_url: string | null;
  attribution: string | null;
  license: string | null;
  rights_status: string;
  provenance_status: string;
  sort_order: number;
};

type ProjectSourceRow = {
  label: string;
  organisation: string | null;
  url: string;
  source_type: string;
};

type ProjectTopicRow = {
  topic: string;
};

function mapMedia(row: ProjectMediaRow): ProjectMedia {
  return {
    src: row.url,
    alt: row.alt ?? undefined,
    role: row.role,
    sourceUrl: row.source_url ?? undefined,
    attribution: row.attribution ?? undefined,
    license: row.license ?? undefined,
    rightsStatus: row.rights_status,
    provenanceStatus: row.provenance_status,
  };
}

function mapSource(row: ProjectSourceRow): ProjectSource {
  return {
    label: row.label,
    organisation: row.organisation ?? undefined,
    href: row.url,
  };
}

export async function getProductionProjectDetail(
  slug: string
): Promise<ProjectRecordData | undefined> {
  const supabase = await createClient();

  const {
    data: entity,
    error: entityError,
  } = await supabase
    .from("entities")
    .select("id,detail")
    .eq("entity_type", "project")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();

  if (entityError) {
    throw new Error(
      `[Arknoz data] Failed to load project detail for ${slug}: ${entityError.message}`
    );
  }

  if (!entity) {
    return undefined;
  }

  const [
    mediaResult,
    sourceResult,
    topicResult,
  ] = await Promise.all([
    supabase
      .from("entity_media")
      .select(
        "role,url,alt,source_url,attribution,license,rights_status,provenance_status,sort_order"
      )
      .eq("entity_id", entity.id)
      .eq("publishable", true)
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("entity_sources")
      .select(
        "label,organisation,url,source_type"
      )
      .eq("entity_id", entity.id)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("entity_topics")
      .select("topic")
      .eq("entity_id", entity.id)
      .order("topic", {
        ascending: true,
      }),
  ]);

  if (mediaResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load project media for ${slug}: ${mediaResult.error.message}`
    );
  }

  if (sourceResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load project sources for ${slug}: ${sourceResult.error.message}`
    );
  }

  if (topicResult.error) {
    throw new Error(
      `[Arknoz data] Failed to load project topics for ${slug}: ${topicResult.error.message}`
    );
  }

  const base =
    ((entity as ProjectEntityRow).detail ??
      {}) as ProjectRecordData;

  const media = (
    (mediaResult.data ?? []) as ProjectMediaRow[]
  ).map(mapMedia);

  const sources = (
    (sourceResult.data ?? []) as ProjectSourceRow[]
  ).map(mapSource);

  const topics = (
    (topicResult.data ?? []) as ProjectTopicRow[]
  ).map((row) => row.topic);

  return {
    ...base,
    media,
    sources,
    topics,
  };
}