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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
    />
  );
}