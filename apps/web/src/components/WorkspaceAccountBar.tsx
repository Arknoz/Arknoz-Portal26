"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AccountState = {
  email: string | null;
  arknozId: string;
};

const WORKSPACES = [
  {
    label: "My Arknoz",
    href: "/dashboard",
    type: "Individual",
  },
  {
    label: "My Company",
    href: "/preview/workspaces/company",
    type: "Company",
  },
  {
    label: "My University",
    href: "/preview/workspaces/university",
    type: "University",
  },
  {
    label: "My Institution",
    href: "/preview/workspaces/institution",
    type: "Institution",
  },
];

export default function WorkspaceAccountBar({
  workspaceName,
  workspaceType,
  planLabel,
}: {
  workspaceName: string;
  workspaceType: string;
  planLabel: string;
}) {
  const router = useRouter();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [account, setAccount] =
    useState<AccountState | null>(
      null
    );

  const [ready, setReady] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (!user) {
        setAccount(null);
        setReady(true);
        return;
      }

      const {
        data: memberProfile,
      } =
        await supabase
          .from("member_profiles")
          .select("arknoz_id")
          .eq("user_id", user.id)
          .maybeSingle();

      if (!active) {
        return;
      }

      const arknozId =
        typeof memberProfile?.arknoz_id ===
          "string" &&
        memberProfile.arknoz_id.trim()
          .length > 0
          ? memberProfile.arknoz_id.trim()
          : "Arknoz ID pending";

      setAccount({
        email:
          user.email ?? null,
        arknozId,
      });

      setReady(true);
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function signOut() {
    setSigningOut(true);

    await supabase.auth.signOut();

    setAccount(null);

    router.replace("/");
    router.refresh();
  }

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1512px] flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition hover:border-slate-300">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  CURRENT WORKSPACE
                </p>

                <p className="mt-0.5 truncate text-sm font-bold text-[#17315c]">
                  {workspaceName}
                </p>
              </div>

              <svg
                viewBox="0 0 20 20"
                width="14"
                height="14"
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

            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[270px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                SWITCH WORKSPACE
              </p>

              {WORKSPACES.map(
                (item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {item.type}
                      </p>
                    </div>

                    <span className="text-slate-300">
                      →
                    </span>
                  </Link>
                )
              )}
            </div>
          </details>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {workspaceType}
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-600">
              {planLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-600 transition hover:text-[#17315c]"
          >
            My Arknoz
          </Link>

          <Link
            href="/dashboard#settings"
            className="text-xs font-semibold text-slate-600 transition hover:text-[#17315c]"
          >
            Settings
          </Link>

          <Link
            href="/about"
            className="text-xs font-semibold text-slate-600 transition hover:text-[#17315c]"
          >
            Help
          </Link>

          <div className="hidden h-7 w-px bg-slate-200 sm:block" />

          {!ready ? (
            <span className="text-xs text-slate-400">
              Loading identity…
            </span>
          ) : account ? (
            <>
              <div className="min-w-0 text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  ARKNOZ ID
                </p>

                <p className="mt-0.5 text-xs font-bold text-[#17315c]">
                  {account.arknozId}
                </p>

                {account.email ? (
                  <p className="mt-0.5 max-w-[200px] truncate text-[10px] text-slate-400">
                    {account.email}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 transition hover:border-slate-300 hover:text-slate-800 disabled:opacity-50"
              >
                {signingOut
                  ? "Signing out…"
                  : "Sign out"}
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg bg-[#17315c] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
