"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HeaderAuthControls({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;

      setSignedIn(Boolean(data.user));
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setSignedIn(Boolean(session?.user));
      setReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    setBusy(true);

    await supabase.auth.signOut();

    setSignedIn(false);
    setBusy(false);

    onNavigate?.();

    router.push("/");
    router.refresh();
  }

  if (!ready || !signedIn) {
    if (mobile) {
      return (
        <>
          <Link
            href="/sign-in"
            onClick={onNavigate}
            className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold"
          >
            Sign in
          </Link>

          <Link
            href="/join"
            onClick={onNavigate}
            className="rounded-lg bg-[#17315c] px-4 py-3 text-center font-semibold text-white"
          >
            Join Arknoz
          </Link>
        </>
      );
    }

    return (
      <>
        <Link
          href="/sign-in"
          className="px-2 hover:text-[#17315c]"
        >
          Sign in
        </Link>

        <Link
          href="/join"
          className="rounded-md bg-[#17315c] px-4 py-2.5 font-semibold text-white hover:bg-[#102541]"
        >
          Join Arknoz
        </Link>
      </>
    );
  }

  if (mobile) {
    return (
      <>
        <div className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold">
          Arknoz ID
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={signOut}
          className="rounded-lg bg-[#17315c] px-4 py-3 text-center font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Signing out..." : "Sign out"}
        </button>
      </>
    );
  }

  return (
    <>
      <span className="px-2 font-semibold text-[#17315c]">
        Arknoz ID
      </span>

      <button
        type="button"
        disabled={busy}
        onClick={signOut}
        className="rounded-md border border-slate-300 px-4 py-2.5 font-semibold hover:border-[#17315c] disabled:opacity-50"
      >
        {busy ? "Signing out..." : "Sign out"}
      </button>
    </>
  );
}