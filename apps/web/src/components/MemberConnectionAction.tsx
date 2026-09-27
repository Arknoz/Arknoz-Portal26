"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ConnectionRow = {
  request_id: string;
  direction: "incoming" | "outgoing";
  request_type: string;
  status: string;
  counterpart_slug: string;
};

type ConnectionState =
  | "loading"
  | "anonymous"
  | "error"
  | "none"
  | "outgoing-pending"
  | "incoming-pending"
  | "connected";

export default function MemberConnectionAction({
  targetSlug,
  returnTo,
}: {
  targetSlug: string;
  returnTo: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [state, setState] = useState<ConnectionState>("loading");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setState("anonymous");
        return;
      }

      const { data, error } = await supabase.rpc(
        "get_my_member_connections"
      );

      if (!active) return;

      if (error) {
        setState("error");
        setMessage("Connection status is temporarily unavailable.");
        return;
      }

      const rows = (data ?? []) as ConnectionRow[];

      const connection = rows.find(
        (row) =>
          row.counterpart_slug === targetSlug &&
          row.request_type === "connect" &&
          (row.status === "pending" || row.status === "accepted")
      );

      if (!connection) {
        setState("none");
        return;
      }

      setRequestId(connection.request_id);

      if (connection.status === "accepted") {
        setState("connected");
        return;
      }

      setState(
        connection.direction === "incoming"
          ? "incoming-pending"
          : "outgoing-pending"
      );
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase, targetSlug]);

  async function handleClick() {
    setMessage(null);

    if (state === "anonymous") {
      const params = new URLSearchParams({
        action: "connect",
        returnTo,
      });

      router.push(`/sign-in?${params.toString()}`);
      return;
    }

    if (
      state === "error" ||
      state === "connected" ||
      state === "outgoing-pending"
    ) {
      return;
    }

    setBusy(true);

    if (state === "incoming-pending" && requestId) {
      const { error } = await supabase.rpc(
        "respond_member_connection_request",
        {
          connection_request_id: requestId,
          response: "accepted",
        }
      );

      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }

      setState("connected");
      setBusy(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "create_member_connection_request",
      {
        target_person_slug: targetSlug,
        request_kind: "connect",
        request_context_path: returnTo,
        request_note: null,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    setRequestId(typeof data === "string" ? data : null);
    setState("outgoing-pending");
    setBusy(false);
  }

  const label =
    busy
      ? "Updating..."
      : state === "error"
        ? "Unavailable"
        : state === "connected"
          ? "Connected"
        : state === "outgoing-pending"
          ? "Request sent"
          : state === "incoming-pending"
            ? "Accept connection"
            : "Connect";

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={
          state === "loading" ||
          state === "error" ||
          busy ||
          state === "connected" ||
          state === "outgoing-pending"
        }
        className="rounded-full bg-[#0b2949] px-5 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#173f69] disabled:cursor-default disabled:opacity-60"
      >
        {label}
      </button>

      {message ? (
        <p
          aria-live="polite"
          className="mt-2 max-w-md text-[11px] text-slate-500"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
