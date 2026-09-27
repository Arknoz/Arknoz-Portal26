"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Conversation = {
  id: string;
  subject: string;
  context_path: string | null;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
};

function displayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function displayTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function MemberMessagesInbox() {
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selected =
    conversations.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    let active = true;

    async function loadInbox() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setMessage("Your Arknoz session could not be found.");
        setReady(true);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("member_conversations")
        .select("id,subject,context_path,created_at,updated_at")
        .order("updated_at", { ascending: false });

      if (!active) return;

      if (error) {
        setMessage("Messages database is not connected yet.");
        setReady(true);
        return;
      }

      const rows = data ?? [];

      setConversations(rows);

      if (rows.length > 0) {
        setSelectedId(rows[0].id);
      }

      setReady(true);
    }

    loadInbox();

    return () => {
      active = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!selectedId || !userId) {
      queueMicrotask(() => setMessages([]));
      return;
    }

    let active = true;

    async function loadThread() {
      setLoadingThread(true);
      setMessage(null);

      const { data, error } = await supabase
        .from("member_messages")
        .select("id,conversation_id,sender_user_id,body,created_at")
        .eq("conversation_id", selectedId)
        .order("created_at", { ascending: true });

      if (!active) return;

      if (error) {
        setMessage("Arknoz could not load this conversation.");
        setLoadingThread(false);
        return;
      }

      setMessages(data ?? []);
      setLoadingThread(false);
    }

    loadThread();

    return () => {
      active = false;
    };
  }, [selectedId, supabase, userId]);

  async function sendMessage() {
    if (!userId || !selectedId || sending) return;

    const body = draft.trim();

    if (!body) return;

    setSending(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("member_messages")
      .insert({
        conversation_id: selectedId,
        sender_user_id: userId,
        body,
      })
      .select("id,conversation_id,sender_user_id,body,created_at")
      .single();

    if (error) {
      setMessage("Arknoz could not send this message.");
      setSending(false);
      return;
    }

    setMessages((current) => [...current, data]);
    setDraft("");

    setConversations((current) =>
      current
        .map((item) =>
          item.id === selectedId
            ? {
                ...item,
                updated_at: data.created_at,
              }
            : item
        )
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
        )
    );

    setSending(false);
  }

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Exclusive Arknoz Pro messaging
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Messages are available only between active Arknoz Pro members. Both
          participants must have Pro access to read or send messages.
        </p>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className="rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
        >
          {message}
        </p>
      ) : null}

      {conversations.length === 0 ? (
        <section className="rounded-[24px] border border-slate-200 bg-white p-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            MESSAGES
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            No conversations yet
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            When a genuine connection between two active Arknoz Pro members starts a
            conversation, it will appear here. Arknoz does not create fake
            messages, contacts or activity.
          </p>

          <Link
            href="/dashboard/connections"
            className="mt-5 inline-flex rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white"
          >
            View Connections
          </Link>
        </section>
      ) : (
        <div className="grid overflow-hidden rounded-[24px] border border-slate-200 bg-white lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <div className="border-b border-slate-200 p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                INBOX
              </p>

              <h2 className="mt-2 text-lg font-bold text-[#17315c]">
                Conversations
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {conversations.length}{" "}
                {conversations.length === 1
                  ? "conversation"
                  : "conversations"}
              </p>
            </div>

            <div className="max-h-[620px] overflow-y-auto">
              {conversations.map((item) => {
                const active = item.id === selectedId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full border-b border-slate-100 p-5 text-left transition ${
                      active ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#17315c]">
                      {item.subject}
                    </p>

                    {item.context_path ? (
                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {item.context_path}
                      </p>
                    ) : null}

                    <p className="mt-2 text-[10px] text-slate-400">
                      Updated {displayDate(item.updated_at)}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-[620px] flex-col">
            {selected ? (
              <>
                <header className="border-b border-slate-200 px-5 py-4 sm:px-6">
                  <h2 className="text-lg font-bold text-[#17315c]">
                    {selected.subject}
                  </h2>

                  {selected.context_path ? (
                    <Link
                      href={selected.context_path}
                      className="mt-1 inline-block text-xs font-bold text-blue-700"
                    >
                      Open related Arknoz record
                    </Link>
                  ) : null}
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-5 sm:p-6">
                  {loadingThread ? (
                    <p className="text-sm text-slate-500">
                      Loading conversation...
                    </p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No messages in this conversation yet.
                    </p>
                  ) : (
                    messages.map((item) => {
                      const mine = item.sender_user_id === userId;

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[78%] rounded-[18px] px-4 py-3 ${
                              mine
                                ? "bg-[#17315c] text-white"
                                : "border border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words text-sm leading-6">
                              {item.body}
                            </p>

                            <p
                              className={`mt-2 text-[9px] ${
                                mine ? "text-blue-100" : "text-slate-400"
                              }`}
                            >
                              {mine ? "You" : "Member"} Â·{" "}
                              {displayTime(item.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={3000}
                    placeholder="Write a message..."
                    className="min-h-24 w-full resize-y rounded-[14px] border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-[10px] text-slate-400">
                      {draft.length}/3000
                    </p>

                    <button
                      type="button"
                      disabled={sending || draft.trim() === ""}
                      onClick={sendMessage}
                      className="rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send message"}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}
