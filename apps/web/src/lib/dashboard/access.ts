import { redirect } from "next/navigation";

import { hasPersonalArknozPro } from "@/lib/entitlements/arknoz-pro";
import { createClient } from "@/lib/supabase/server";

export async function requireDashboardUser(returnTo: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/sign-in?returnTo=${encodeURIComponent(returnTo)}`
    );
  }

  return user;
}

export async function requireProUser(returnTo: string) {
  const user = await requireDashboardUser(returnTo);

  const isPro = hasPersonalArknozPro(
    user.app_metadata?.membership
  );

  if (!isPro) {
    redirect("/dashboard");
  }

  return user;
}
