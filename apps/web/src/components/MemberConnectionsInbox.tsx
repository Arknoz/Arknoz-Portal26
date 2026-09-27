"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ConnectionRow = {
  request_id: string;
  direction: "incoming" | "outgoing";
  request_type: "connect" | "collaborate" | "service";
  status: "pending" | "accepted" | "declined" | "cancelled";
  context_path: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  responded_at: string | null;
  counterpart_slug: string;
  counterpart_name: string;
  counterpart_headline: string;
  counterpart_arknoz_id: string;
};

function requestLabel(type: ConnectionRow["request_type"]) {
  if (type === "service") return "Service request";
  if (type === "collaborate") return "Collaboration";
  return "Connection";
}

export default function MemberConnectionsInbox() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [rows, setRows] = useState<ConnectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc(
      "get_my_member_connections"
    );

    if (error) {
      setMessage("Arknoz could not load your connections.");
      setLoading(false);
      return;
    }

    setRows((data ?? []) as ConnectionRow[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let active = true;

    void supabase
      .rpc("get_my_member_connections")
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          setMessage("Arknoz could not load your connections.");
          setLoading(false);
          return;
        }

        setRows((data ?? []) as ConnectionRow[]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [supabase]);

  async function respond(
    requestId: string,
    response: "accepted" | "declined"
  ) {
    setBusyId(requestId);
    setMessage(null);

    const { error } = await supabase.rpc(
      "respond_member_connection_request",
      {
        connection_request_id: requestId,
        response,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusyId(null);
      return;
    }

    await load();
    setBusyId(null);
  }

  async function startConversation(requestId: string) {
    setBusyId(requestId);
    setMessage(null);

    const { error } = await supabase.rpc(
      "start_connected_member_conversation",
      {
        accepted_request_id: requestId,
      }
    );

    if (error) {
      setMessage(
        "Private messages require active Arknoz Pro access for both members."
      );
      setBusyId(null);
      return;
    }

    router.push("/dashboard/messages");
  }

  async function cancel(requestId: string) {
    setBusyId(requestId);
    setMessage(null);

    const { error } = await supabase.rpc(
      "cancel_member_connection_request",
      {
        connection_request_id: requestId,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusyId(null);
      return;
    }

    await load();
    setBusyId(null);
  }

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading connections...
      </p>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-bold text-[#17315c]">
          No connection activity yet.
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Connect, collaborate or request services from published Arknoz member profiles.
        </p>

        <Link
          href="/people"
          className="mt-4 inline-flex rounded-full bg-[#17315c] px-5 py-2.5 text-[11px] font-bold text-white"
        >
          Explore People
        </Link>
      </div>
    );
  }

  return (
    <div>
      {message ? (
        <p
          aria-live="polite"
          className="mb-4 rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
        >
          {message}
        </p>
      ) : null}

      <div className="space-y-3">
        {rows.map((row) => {
          const pending = row.status === "pending";
          const incoming = row.direction === "incoming";
          const busy = busyId === row.request_id;

          return (
            <article
              key={row.request_id}
              className="rounded-[18px] border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-700">
                      {requestLabel(row.request_type)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      {row.status}
                    </span>

                    <span className="text-[10px] font-semibold text-slate-400">
                      {incoming ? "Incoming" : "Outgoing"}
                    </span>
                  </div>

                  <Link
                    href={`/people/${row.counterpart_slug}`}
                    className="mt-3 block text-lg font-bold text-[#17315c] hover:text-blue-700"
                  >
                    {row.counterpart_name}
                  </Link>

                  {row.counterpart_headline ? (
                    <p className="mt-1 text-sm text-slate-600">
                      {row.counterpart_headline}
                    </p>
                  ) : null}

                  {row.counterpart_arknoz_id ? (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {row.counterpart_arknoz_id}
                    </p>
                  ) : null}

                  {row.note ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {row.note}
                    </p>
                  ) : null}
                </div>

                {pending ? (
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {incoming ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            respond(row.request_id, "accepted")
                          }
                          className="rounded-full bg-[#17315c] px-4 py-2 text-[10px] font-bold text-white disabled:opacity-50"
                        >
                          {busy ? "Updating..." : "Accept"}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            respond(row.request_id, "declined")
                          }
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold text-slate-600 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => cancel(row.request_id)}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold text-slate-600 disabled:opacity-50"
                      >
                        {busy ? "Updating..." : "Cancel"}
                      </button>
                    )}
                  </div>
                ) : row.status === "accepted" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      startConversation(row.request_id)
                    }
                    className="shrink-0 rounded-full bg-[#17315c] px-4 py-2 text-[10px] font-bold text-white disabled:opacity-50"
                  >
                    {busy ? "Opening..." : "Start Pro conversation"}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
