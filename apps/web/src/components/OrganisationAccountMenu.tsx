"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function OrganisationAccountMenu({
  baseHref,
  profileModuleId,
  oneUnlocked,
}: {
  baseHref: string;
  profileModuleId: string;
  oneUnlocked: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const suffix = oneUnlocked ? "?plan=one" : "";

  async function signOut() {
    setBusy(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#17315c] hover:border-slate-300">
        Account
      </summary>

      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[255px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="p-2">
          <Link
            href={`${baseHref}/${profileModuleId}${suffix}`}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Workspace Profile
          </Link>

          <Link
            href={`${baseHref}/settings${suffix}`}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Settings
          </Link>

          <Link
            href={`${baseHref}/notifications${suffix}`}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Notifications
          </Link>

          <Link
            href={`${baseHref}/security${suffix}`}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Security
          </Link>

          <Link
            href="/about"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Help
          </Link>
        </div>

        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            disabled={busy}
            onClick={signOut}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            {busy ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </details>
  );
}