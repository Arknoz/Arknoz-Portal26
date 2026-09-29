import { redirect } from "next/navigation";

import { requireDashboardUser } from "@/lib/dashboard/access";
import { createClient } from "@/lib/supabase/server";

export type PlatformRole =
  | "OWNER"
  | "ADMIN"
  | "EDITOR"
  | "MODERATOR";

const PLATFORM_ROLES = new Set<PlatformRole>([
  "OWNER",
  "ADMIN",
  "EDITOR",
  "MODERATOR",
]);

function normalizePlatformRole(
  value: unknown
): PlatformRole | null {
  const normalized =
    String(value ?? "")
      .trim()
      .toUpperCase();

  if (
    PLATFORM_ROLES.has(
      normalized as PlatformRole
    )
  ) {
    return normalized as PlatformRole;
  }

  return null;
}

export async function requirePlatformConsoleUser(
  returnTo: string
) {
  const user =
    await requireDashboardUser(returnTo);

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_my_platform_role"
  );

  const role =
    normalizePlatformRole(data);

  if (
    error ||
    !role
  ) {
    redirect("/access-denied");
  }

  return {
    user,
    role,
  };
}

export async function requirePlatformOwner(
  returnTo: string
) {
  const authority =
    await requirePlatformConsoleUser(
      returnTo
    );

  if (
    authority.role !== "OWNER"
  ) {
    redirect("/access-denied");
  }

  return authority;
}
export async function requirePlatformPlacementManager(
  returnTo: string
) {
  const authority =
    await requirePlatformConsoleUser(
      returnTo
    );

  if (
    authority.role !== "OWNER" &&
    authority.role !== "ADMIN"
  ) {
    redirect("/access-denied");
  }

  return authority;
}
export async function requirePlatformMemberManager(
  returnTo: string
) {
  const authority =
    await requirePlatformConsoleUser(
      returnTo
    );

  if (
    authority.role !== "OWNER" &&
    authority.role !== "ADMIN"
  ) {
    redirect("/access-denied");
  }

  return authority;
}

export async function requirePlatformContentManager(
  returnTo: string
) {
  const authority =
    await requirePlatformConsoleUser(
      returnTo
    );

  if (
    authority.role !== "OWNER" &&
    authority.role !== "ADMIN" &&
    authority.role !== "EDITOR"
  ) {
    redirect("/access-denied");
  }

  return authority;
}

export async function requirePlatformCommunityModerator(
  returnTo: string
) {
  const authority =
    await requirePlatformConsoleUser(
      returnTo
    );

  if (
    authority.role !== "OWNER" &&
    authority.role !== "ADMIN" &&
    authority.role !== "MODERATOR"
  ) {
    redirect("/access-denied");
  }

  return authority;
}
