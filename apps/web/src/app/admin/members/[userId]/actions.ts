"use server";

import { revalidatePath } from "next/cache";

import { requirePlatformMemberManager } from "@/lib/admin/access";
import { createClient } from "@/lib/supabase/server";

export async function setMemberAccess(
  formData: FormData
) {
  const userId =
    String(
      formData.get("user_id") ?? ""
    ).trim();

  const status =
    String(
      formData.get("status") ?? ""
    )
      .trim()
      .toLowerCase();

  const reason =
    String(
      formData.get("reason") ?? ""
    ).trim();

  if (!userId) {
    throw new Error(
      "Member user ID is required."
    );
  }

  if (
    status !== "active" &&
    status !== "suspended"
  ) {
    throw new Error(
      "Invalid member access status."
    );
  }

  if (
    status === "suspended" &&
    !reason
  ) {
    throw new Error(
      "A suspension reason is required."
    );
  }

  await requirePlatformMemberManager(
    `/admin/members/${userId}`
  );

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "set_platform_member_access",
    {
      target_user_id:
        userId,

      target_status:
        status,

      target_reason:
        status === "suspended"
          ? reason
          : null,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/members/${userId}`
  );

  revalidatePath(
    "/admin/members"
  );
}
