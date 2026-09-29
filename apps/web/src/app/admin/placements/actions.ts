"use server";

import { revalidatePath } from "next/cache";

import { requirePlatformPlacementManager } from "@/lib/admin/access";
import { createClient } from "@/lib/supabase/server";

function requiredText(
  formData: FormData,
  name: string
) {
  const value =
    String(formData.get(name) ?? "").trim();

  if (!value) {
    throw new Error(
      `${name} is required`
    );
  }

  return value;
}

function optionalText(
  formData: FormData,
  name: string
) {
  const value =
    String(formData.get(name) ?? "").trim();

  return value || null;
}

export async function materializePlacementSlot(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const slotId =
    requiredText(
      formData,
      "slot_id"
    );

  const contextKey =
    requiredText(
      formData,
      "context_key"
    );

  const pagePath =
    optionalText(
      formData,
      "page_path"
    );

  const paidEligible =
    formData.get(
      "paid_eligible"
    ) === "on";

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "ensure_platform_placement_slot",
    {
      target_slot_id:
        slotId,

      target_context_key:
        contextKey,

      target_page_path:
        pagePath,

      target_paid_eligible:
        paidEligible,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}

export async function createPlacementCampaign(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const name =
    requiredText(
      formData,
      "name"
    );

  const campaignType =
    requiredText(
      formData,
      "campaign_type"
    );

  const advertiserName =
    optionalText(
      formData,
      "advertiser_name"
    );

  const currencyCode =
    optionalText(
      formData,
      "currency_code"
    );

  const budgetInput =
    optionalText(
      formData,
      "budget_minor"
    );

  let budgetMinor:
    number | null = null;

  if (budgetInput !== null) {
    const parsed =
      Number(budgetInput);

    if (
      !Number.isInteger(parsed) ||
      parsed < 0
    ) {
      throw new Error(
        "Budget must be a non-negative whole number"
      );
    }

    budgetMinor = parsed;
  }

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "create_platform_placement_campaign",
    {
      target_name:
        name,

      target_campaign_type:
        campaignType,

      target_advertiser_name:
        advertiserName,

      target_currency_code:
        currencyCode,

      target_budget_minor:
        budgetMinor,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}
function optionalDateTime(
  formData: FormData,
  name: string
) {
  const value =
    optionalText(
      formData,
      name
    );

  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      `${name} is invalid`
    );
  }

  return date.toISOString();
}

export async function createPlacementCreative(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const campaignId =
    requiredText(
      formData,
      "campaign_id"
    );

  const name =
    requiredText(
      formData,
      "creative_name"
    );

  const headline =
    optionalText(
      formData,
      "headline"
    );

  const bodyText =
    optionalText(
      formData,
      "body_text"
    );

  const imageUrl =
    optionalText(
      formData,
      "image_url"
    );

  const destinationUrl =
    optionalText(
      formData,
      "destination_url"
    );

  const ctaLabel =
    optionalText(
      formData,
      "cta_label"
    );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "create_platform_placement_creative",
    {
      target_campaign_id:
        campaignId,

      target_name:
        name,

      target_headline:
        headline,

      target_body_text:
        bodyText,

      target_image_url:
        imageUrl,

      target_destination_url:
        destinationUrl,

      target_cta_label:
        ctaLabel,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}

export async function createPlacementAssignment(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const slotInstanceId =
    requiredText(
      formData,
      "slot_instance_id"
    );

  const placementType =
    requiredText(
      formData,
      "placement_type"
    );

  const targetMode =
    requiredText(
      formData,
      "target_mode"
    );

  const campaignId =
    optionalText(
      formData,
      "assignment_campaign_id"
    );

  let creativeId:
    string | null = null;

  let canonicalEntityType:
    string | null = null;

  let canonicalEntitySlug:
    string | null = null;

  if (
    targetMode === "creative"
  ) {
    creativeId =
      requiredText(
        formData,
        "creative_id"
      );
  } else if (
    targetMode === "entity"
  ) {
    canonicalEntityType =
      requiredText(
        formData,
        "canonical_entity_type"
      );

    canonicalEntitySlug =
      requiredText(
        formData,
        "canonical_entity_slug"
      );
  } else {
    throw new Error(
      "Invalid assignment target"
    );
  }

  const startsAt =
    optionalDateTime(
      formData,
      "starts_at"
    );

  const endsAt =
    optionalDateTime(
      formData,
      "ends_at"
    );

  const paidLock =
    formData.get(
      "paid_lock"
    ) === "on";

  const replaceable =
    formData.get(
      "replaceable"
    ) !== "off";

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "create_platform_placement_assignment",
    {
      target_slot_instance_id:
        slotInstanceId,

      target_placement_type:
        placementType,

      target_campaign_id:
        campaignId,

      target_creative_id:
        creativeId,

      target_canonical_entity_type:
        canonicalEntityType,

      target_canonical_entity_slug:
        canonicalEntitySlug,

      target_replaceable:
        replaceable,

      target_paid_lock:
        paidLock,

      target_starts_at:
        startsAt,

      target_ends_at:
        endsAt,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}

export async function setPlacementCampaignStatus(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const campaignId =
    requiredText(
      formData,
      "campaign_id"
    );

  const status =
    requiredText(
      formData,
      "status"
    );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "set_platform_placement_campaign_status",
    {
      target_campaign_id:
        campaignId,

      target_status:
        status,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}

export async function setPlacementCreativeStatus(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const creativeId =
    requiredText(
      formData,
      "creative_id"
    );

  const status =
    requiredText(
      formData,
      "status"
    );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "set_platform_placement_creative_status",
    {
      target_creative_id:
        creativeId,

      target_status:
        status,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}

export async function setPlacementAssignmentStatus(
  formData: FormData
) {
  await requirePlatformPlacementManager(
    "/admin/placements"
  );

  const assignmentId =
    requiredText(
      formData,
      "assignment_id"
    );

  const status =
    requiredText(
      formData,
      "status"
    );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "set_platform_placement_assignment_status",
    {
      target_assignment_id:
        assignmentId,

      target_status:
        status,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/placements"
  );
}
