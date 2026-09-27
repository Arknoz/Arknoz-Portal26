import "server-only";

import type { MemberProfileData } from "@/lib/member-profile";
import { createClient } from "@/lib/supabase/server";

export async function getProductionMemberProfile(
  slug: string
): Promise<MemberProfileData | undefined> {
  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_public_member_profile",
    {
      person_slug: slug,
    }
  );

  if (error) {
    throw new Error(
      `[Arknoz member profile] Failed to load ${slug}: ${error.message}`
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    return undefined;
  }

  const {
    data: arknozId,
    error: arknozIdError,
  } = await supabase.rpc(
    "get_public_member_arknoz_id",
    {
      person_slug: slug,
    }
  );

  if (arknozIdError) {
    throw new Error(
      `[Arknoz member profile] Failed to load public Arknoz ID for ${slug}: ${arknozIdError.message}`
    );
  }

  return {
    ...(data as unknown as MemberProfileData),
    arknozId:
      typeof arknozId === "string"
        ? arknozId
        : undefined,
  };
}
