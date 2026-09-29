"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  requirePlatformContentManager,
} from "@/lib/admin/access";

import {
  createClient,
} from "@/lib/supabase/server";


function field(
  formData: FormData,
  name: string
) {
  return String(
    formData.get(name) ?? ""
  ).trim();
}


export async function createContentDraft(
  formData: FormData
) {
  await requirePlatformContentManager(
    "/admin/content"
  );

  const entityType =
    field(
      formData,
      "entity_type"
    );

  const slug =
    field(
      formData,
      "slug"
    ).toLowerCase();

  const title =
    field(
      formData,
      "title"
    );

  if (
    !entityType ||
    !slug ||
    !title
  ) {
    throw new Error(
      "Type, slug and title are required."
    );
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_platform_entity_draft",
    {
      target_entity_type:
        entityType,

      target_slug:
        slug,

      target_title:
        title,

      target_subtitle:
        field(
          formData,
          "subtitle"
        ) || null,

      target_summary:
        field(
          formData,
          "summary"
        ),

      target_geography_label:
        field(
          formData,
          "geography_label"
        ) || null,

      target_geography_slug:
        field(
          formData,
          "geography_slug"
        ) || null,

      target_trust_label:
        field(
          formData,
          "trust_label"
        ) || null,

      target_official_url:
        field(
          formData,
          "official_url"
        ) || null,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/content"
  );

  redirect(
    `/admin/content/${String(data)}`
  );
}


export async function updateContentEntity(
  formData: FormData
) {
  const entityId =
    field(
      formData,
      "entity_id"
    );

  if (!entityId) {
    throw new Error(
      "Entity ID is required."
    );
  }

  await requirePlatformContentManager(
    `/admin/content/${entityId}`
  );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "update_platform_entity_content",
    {
      target_entity_id:
        entityId,

      target_title:
        field(
          formData,
          "title"
        ),

      target_subtitle:
        field(
          formData,
          "subtitle"
        ) || null,

      target_summary:
        field(
          formData,
          "summary"
        ),

      target_geography_label:
        field(
          formData,
          "geography_label"
        ) || null,

      target_geography_slug:
        field(
          formData,
          "geography_slug"
        ) || null,

      target_trust_label:
        field(
          formData,
          "trust_label"
        ) || null,

      target_official_url:
        field(
          formData,
          "official_url"
        ) || null,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/content/${entityId}`
  );

  revalidatePath(
    "/admin/content"
  );
}


export async function setContentEntityState(
  formData: FormData
) {
  const entityId =
    field(
      formData,
      "entity_id"
    );

  if (!entityId) {
    throw new Error(
      "Entity ID is required."
    );
  }

  await requirePlatformContentManager(
    `/admin/content/${entityId}`
  );

  const contentStatus =
    field(
      formData,
      "content_status"
    );

  const verificationStatus =
    field(
      formData,
      "verification_status"
    );

  const featured =
    formData.get(
      "featured"
    ) === "on";

  const rawRank =
    Number(
      field(
        formData,
        "sort_rank"
      ) || "0"
    );

  const sortRank =
    Number.isFinite(rawRank)
      ? Math.trunc(rawRank)
      : 0;

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "set_platform_entity_state",
    {
      target_entity_id:
        entityId,

      target_content_status:
        contentStatus,

      target_verification_status:
        verificationStatus,

      target_featured:
        featured,

      target_sort_rank:
        sortRank,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/content/${entityId}`
  );

  revalidatePath(
    "/admin/content"
  );
}
