"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requirePlatformCommunityModerator,
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


export async function cancelPendingConnectionAdmin(
  formData: FormData
) {
  const requestId =
    field(
      formData,
      "request_id"
    );

  const moderationNote =
    field(
      formData,
      "moderation_note"
    );

  if (!requestId) {
    throw new Error(
      "Connection request ID is required."
    );
  }

  if (!moderationNote) {
    throw new Error(
      "Moderation note is required."
    );
  }

  await requirePlatformCommunityModerator(
    "/admin/community"
  );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "cancel_platform_connection_request_admin",
    {
      target_request_id:
        requestId,

      moderation_note:
        moderationNote,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/community"
  );

  revalidatePath(
    "/admin"
  );
}
