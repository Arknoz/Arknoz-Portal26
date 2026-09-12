import "server-only";

import type { ArknozSectionKey } from "@/lib/arknoz-sections";
import type {
  EntityRecord,
  EntityType,
  ProjectRecordData,
} from "@/lib/entities";
import { createClient } from "@/lib/supabase/server";

type DatabaseEntityRow = {
  id: string;
  entity_type: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  geography_label: string | null;
  geography_slug: string | null;
  trust_label: string | null;
  detail: unknown;
};

type DatabaseSubsectionRow = {
  entity_id: string;
  section_key: string;
  subsection_key: string;
};

const entitySelect =
  "id,entity_type,slug,title,subtitle,summary,geography_label,geography_slug,trust_label,detail" as const;

function buildSubsections(
  rows: DatabaseSubsectionRow[]
): Partial<Record<ArknozSectionKey, string[]>> | undefined {
  if (rows.length === 0) {
    return undefined;
  }

  const result: Partial<
    Record<ArknozSectionKey, string[]>
  > = {};

  for (const row of rows) {
    const key =
      row.section_key as ArknozSectionKey;

    const values = result[key] ?? [];

    if (!values.includes(row.subsection_key)) {
      values.push(row.subsection_key);
    }

    result[key] = values;
  }

  return result;
}

function mapEntity(
  row: DatabaseEntityRow,
  subsectionRows: DatabaseSubsectionRow[]
): EntityRecord {
  const type = row.entity_type as EntityType;

  return {
    slug: row.slug,
    type,
    title: row.title,
    subtitle: row.subtitle ?? "",
    geography:
      row.geography_label ?? "Global",
    geographySlug:
      row.geography_slug ?? undefined,
    summary: row.summary ?? "",
    trust: row.trust_label ?? undefined,
    sectionSubsections:
      buildSubsections(subsectionRows),

    project:
      type === "project"
        ? (row.detail as ProjectRecordData)
        : undefined,
  };
}

export async function getProductionEntity(
  type: EntityType,
  slug: string
): Promise<EntityRecord | undefined> {
  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("entities")
    .select(entitySelect)
    .eq("entity_type", type)
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(
      `[Arknoz data] Failed to load ${type}/${slug}: ${error.message}`
    );
  }

  if (!data) {
    return undefined;
  }

  const {
    data: subsectionData,
    error: subsectionError,
  } = await supabase
    .from("entity_subsections")
    .select(
      "entity_id,section_key,subsection_key"
    )
    .eq("entity_id", data.id);

  if (subsectionError) {
    throw new Error(
      `[Arknoz data] Failed to load subsections for ${type}/${slug}: ${subsectionError.message}`
    );
  }

  return mapEntity(
    data as DatabaseEntityRow,
    (subsectionData ?? []) as DatabaseSubsectionRow[]
  );
}

export async function getProductionEntities(): Promise<
  EntityRecord[]
> {
  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("entities")
    .select(entitySelect)
    .eq("content_status", "published")
    .order("sort_rank", {
      ascending: true,
    })
    .order("title", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `[Arknoz data] Failed to load production entities: ${error.message}`
    );
  }

  const rows =
    (data ?? []) as DatabaseEntityRow[];

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.id);

  const {
    data: subsectionData,
    error: subsectionError,
  } = await supabase
    .from("entity_subsections")
    .select(
      "entity_id,section_key,subsection_key"
    )
    .in("entity_id", ids);

  if (subsectionError) {
    throw new Error(
      `[Arknoz data] Failed to load production subsections: ${subsectionError.message}`
    );
  }

  const subsections =
    (subsectionData ?? []) as DatabaseSubsectionRow[];

  return rows.map((row) =>
    mapEntity(
      row,
      subsections.filter(
        (item) =>
          item.entity_id === row.id
      )
    )
  );
}