import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

import ProjectDetailPage from "@/components/ProjectDetailPage";
import type {
  EntityRecord,
  ProjectRecordData,
} from "@/lib/entities";
import { getProductionEntity } from "@/lib/data/production-entities";
import { getProductionProjectDetail } from "@/lib/data/production-project-detail";
import {
  getArknozAccessDecision,
  resolveArknozAudience,
} from "@/lib/entitlements/arknoz-audience";
import { createClient } from "@/lib/supabase/server";

type GiftCityPreviewPackage = {
  entity: {
    slug: string;
    title: string;
    subtitle?: string;
    summary?: string;
    geography_label?: string;
    trust_label?: string;
    detail: ProjectRecordData;
  };
  sources: Array<{
    label: string;
    organisation?: string | null;
    url: string;
  }>;
  topics: string[];
};

async function getGiftCityLocalPreview(): Promise<EntityRecord> {
  const filePath = path.resolve(
    process.cwd(),
    "..",
    "..",
    "data",
    "arknoz-core",
    "countries",
    "india",
    "imports",
    "gift-city-gold-master-dry-run-v1.json"
  );

  const raw = await readFile(filePath, "utf8");

  const data =
    JSON.parse(raw) as GiftCityPreviewPackage;

  const project: ProjectRecordData = {
    ...data.entity.detail,
    sources: data.sources.map((source) => ({
      label: source.label,
      organisation: source.organisation ?? undefined,
      href: source.url,
    })),
    topics: data.topics,
  };

  return {
    slug: data.entity.slug,
    type: "project",
    sectionSubsections: {
      projects: ["urbanism-planning-development"],
    },
    title: data.entity.title,
    subtitle: data.entity.subtitle ?? "",
    geography:
      data.entity.geography_label ?? "India",
    summary: data.entity.summary ?? "",
    trust:
      data.entity.trust_label ?? "Source-backed draft",
    project,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (
    process.env.NODE_ENV !== "production" &&
    slug === "gift-city-gujarat"
  ) {
    const entity =
      await getGiftCityLocalPreview();

    return {
      title: entity.title,
      description: entity.summary,
    };
  }

  const entity =
    await getProductionEntity(
      "project",
      slug
    );

  if (!entity) {
    return {
      title: "Project",
    };
  }

  return {
    title: entity.title,
    description: entity.summary,
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    geo?: string | string[];
    idPreview?: string | string[];
    proPreview?: string | string[];
  }>;
}) {
  const { slug } = await params;

  const query =
    await searchParams;

  const browsingGeoSlug =
    typeof query.geo === "string"
      ? query.geo
      : undefined;

  const arknozIdPreview =
    process.env.NODE_ENV !== "production" &&
    typeof query.idPreview === "string" &&
    query.idPreview === "1";
  const arknozProPreview =
    process.env.NODE_ENV !== "production" &&
    typeof query.proPreview === "string" &&
    query.proPreview === "1";


  // =========================================================
  // PROJECT 26 VIEWER ACCESS
  //
  // Overview  = public
  // Record    = Arknoz ID
  // Lens      = Arknoz Pro
  // Staff     = full access
  //
  // Authentication and RPC calls below are read-only.
  // =========================================================

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();


  let memberAccessStatus:
    unknown = null;

  let platformRole:
    unknown = null;

  let memberAccessCheckOk =
    !user;

  let platformRoleCheckOk =
    !user;


  if (user) {

    const [
      memberAccessResult,
      platformRoleResult,
    ] =
      await Promise.all([
        supabase.rpc(
          "get_my_platform_member_access_status"
        ),

        supabase.rpc(
          "get_my_platform_role"
        ),
      ]);


    memberAccessCheckOk =
      !memberAccessResult.error;

    platformRoleCheckOk =
      !platformRoleResult.error;

    memberAccessStatus =
      memberAccessResult.data;

    platformRole =
      platformRoleResult.data;

  }


  const suspended =
    String(
      memberAccessStatus ?? ""
    )
      .trim()
      .toLowerCase() ===
    "suspended";


  const normalizedPlatformRole =
    String(
      platformRole ?? ""
    )
      .trim()
      .toUpperCase();


  const staff =
    Boolean(user) &&
    memberAccessCheckOk &&
    platformRoleCheckOk &&
    !suspended &&
    [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "MODERATOR",
    ].includes(
      normalizedPlatformRole
    );


  /*
   * Fail closed.
   *
   * If membership status cannot be verified, the viewer is
   * treated as public rather than accidentally receiving
   * protected Record or Lens data.
   */
  const authenticatedForAudience =
    Boolean(user) &&
    memberAccessCheckOk &&
    !suspended;


  const audience =
    resolveArknozAudience({
      authenticated:
        authenticatedForAudience,

      membership:
        authenticatedForAudience
          ? user?.app_metadata
              ?.membership
          : undefined,

      staff,
    });


  const recordAccess =
    getArknozAccessDecision(
      audience,
      {
        required: "id",
        availability: "live",
        unauthorized: "gate",
      }
    );


  const lensAccess =
    getArknozAccessDecision(
      audience,
      {
        required: "pro",
        availability: "live",
        unauthorized: "preview",
      }
    );

  /*
   * Development-only Arknoz ID preview.
   * Production authentication and entitlements are unchanged.
   */
  const effectiveRecordAccessMode =
    arknozProPreview || arknozIdPreview
      ? "full"
      : recordAccess.mode;

  const effectiveLensAccessMode =
    arknozProPreview
      ? "full"
      : lensAccess.mode;

  // Development-only Gold Master preview.
  // Never used by production builds.
  if (
    process.env.NODE_ENV !== "production" &&
    slug === "gift-city-gujarat"
  ) {
    const entity =
      await getGiftCityLocalPreview();

    return (
      <ProjectDetailPage
        entity={entity}
        browsingGeoSlug={browsingGeoSlug}
        recordAccessMode={effectiveRecordAccessMode}
        lensAccessMode={effectiveLensAccessMode}
      />
    );
  }

  const [entity, project] = await Promise.all([
    getProductionEntity("project", slug),
    getProductionProjectDetail(slug),
  ]);

  if (!entity) notFound();

  return (
    <ProjectDetailPage
      entity={{
        ...entity,
        project: project ?? entity.project,
      }}
      browsingGeoSlug={browsingGeoSlug}
      recordAccessMode={effectiveRecordAccessMode}
      lensAccessMode={effectiveLensAccessMode}
    />
  );
}
