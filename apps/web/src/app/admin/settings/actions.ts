"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requirePlatformOwner,
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


export async function setPlatformAdminByEmail(
  formData: FormData
) {
  await requirePlatformOwner(
    "/admin/settings"
  );

  const email =
    field(
      formData,
      "email"
    );

  const role =
    field(
      formData,
      "role"
    );

  const status =
    field(
      formData,
      "status"
    );

  if (
    !email ||
    !role ||
    !status
  ) {
    throw new Error(
      "Email, role and status are required."
    );
  }

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "set_platform_admin_by_email",
    {
      target_email:
        email,

      target_role:
        role,

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
    "/admin/settings"
  );

  revalidatePath(
    "/admin"
  );
}


export async function removePlatformAdminAction(
  formData: FormData
) {
  await requirePlatformOwner(
    "/admin/settings"
  );

  const userId =
    field(
      formData,
      "user_id"
    );

  if (!userId) {
    throw new Error(
      "Admin user ID is required."
    );
  }

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase.rpc(
    "remove_platform_admin",
    {
      target_user_id:
        userId,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/settings"
  );

  revalidatePath(
    "/admin"
  );
}
