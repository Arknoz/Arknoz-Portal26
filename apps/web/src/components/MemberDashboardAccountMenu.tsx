"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";


export default function MemberDashboardAccountMenu({
  email,
}: {
  email: string;
}) {
  const router = useRouter();

  const [busy, setBusy] =
    useState(false);

  async function signOut() {
    setBusy(true);

    const supabase =
      createClient();

    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#17315c] transition hover:border-slate-300">
        Account

        <svg
          viewBox="0 0 20 20"
          width="13"
          height="13"
          fill="none"
          aria-hidden="true"
          className="text-slate-400"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            SIGNED IN AS
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
            {email}
          </p>
        </div>

        <div className="p-2">
          <Link
            href="/dashboard/profile"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Profile
          </Link>

          <Link
            href="/dashboard#settings"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Settings
          </Link>

          <Link
            href="/dashboard#notifications"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Notifications
          </Link>

          <Link
            href="/dashboard#security"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Security
          </Link>

          <Link
            href="/about"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Help
          </Link>
        </div>

        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            disabled={busy}
            onClick={signOut}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
          >
            {busy
              ? "Signing out..."
              : "Sign out"}
          </button>
        </div>
      </div>
    </details>
  );
}