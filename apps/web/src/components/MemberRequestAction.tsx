"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type RequestKind = "service" | "collaborate";

export default function MemberRequestAction({
  targetSlug,
  requestKind,
  contextPath,
  label,
}: {
  targetSlug: string;
  requestKind: RequestKind;
  contextPath: string;
  label: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const params = new URLSearchParams({
        action: requestKind,
        returnTo: contextPath,
      });

      router.push(`/sign-in?${params.toString()}`);
      return;
    }

    setBusy(true);

    const { error } = await supabase.rpc(
      "create_member_connection_request",
      {
        target_person_slug: targetSlug,
        request_kind: requestKind,
        request_context_path: contextPath,
        request_note: null,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    setSent(true);
    setBusy(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || sent}
        className="text-[11px] font-bold text-blue-700 disabled:cursor-default disabled:opacity-60"
      >
        {busy
          ? "Sending..."
          : sent
            ? "Request sent"
            : label}
      </button>

      {message ? (
        <p
          aria-live="polite"
          className="mt-2 max-w-xs text-[10px] leading-4 text-slate-500"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
