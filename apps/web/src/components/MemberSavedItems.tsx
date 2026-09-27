"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SavedItem = {
  target_path: string;
  created_at: string;
};

function cleanSegment(value: string) {
  return decodeURIComponent(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function itemTitle(path: string) {
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return "Arknoz";

  return cleanSegment(parts[parts.length - 1]);
}

function itemType(path: string) {
  const section = path.split("/").filter(Boolean)[0] ?? "arknoz";

  const labels: Record<string, string> = {
    projects: "Project",
    products: "Product",
    knowledge: "Knowledge",
    people: "Person",
    organisations: "Organisation",
    places: "Place",
    opportunities: "Opportunity",
    universities: "University",
    global: "Global",
    community: "Community",
  };

  return labels[section] ?? cleanSegment(section);
}

function savedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function MemberSavedItems() {
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [ready, setReady] = useState(false);
  const [removingPath, setRemovingPath] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSaved() {
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
        .from("member_actions")
        .select("target_path,created_at")
        .eq("user_id", user.id)
        .eq("action_type", "save")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setMessage("Arknoz could not load your saved items.");
        setReady(true);
        return;
      }

      setItems(data ?? []);
      setReady(true);
    }

    loadSaved();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function removeSaved(path: string) {
    if (!userId || removingPath) return;

    setRemovingPath(path);
    setMessage(null);

    const { error } = await supabase
      .from("member_actions")
      .delete()
      .eq("user_id", userId)
      .eq("action_type", "save")
      .eq("target_path", path);

    if (error) {
      setMessage("Arknoz could not remove this saved item.");
      setRemovingPath(null);
      return;
    }

    setItems((current) =>
      current.filter((item) => item.target_path !== path)
    );

    setMessage("Removed from Saved.");
    setRemovingPath(null);
  }

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading saved items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Your private Arknoz collection
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Saved items are visible only inside your account. Saving a record does
          not create a public relationship, endorsement or verification state.
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

      {items.length === 0 ? (
        <section className="rounded-[24px] border border-slate-200 bg-white p-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            SAVED
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Nothing saved yet
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Save useful projects, products, knowledge and other Arknoz records
            as you explore the platform. They will appear here automatically.
          </p>

          <Link
            href="/explore"
            className="mt-5 inline-flex rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white"
          >
            Explore Arknoz
          </Link>
        </section>
      ) : (
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                SAVED
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#17315c]">
                Saved records
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.target_path}
                className="flex min-h-44 flex-col rounded-[18px] border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {itemType(item.target_path)}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {savedDate(item.created_at)}
                  </span>
                </div>

                <h3 className="mt-4 break-words text-base font-bold leading-6 text-[#17315c]">
                  {itemTitle(item.target_path)}
                </h3>

                <p className="mt-2 break-all text-[10px] leading-4 text-slate-400">
                  {item.target_path}
                </p>

                <div className="mt-auto flex items-center gap-4 pt-5">
                  <Link
                    href={item.target_path}
                    className="text-xs font-bold text-blue-700"
                  >
                    Open
                  </Link>

                  <button
                    type="button"
                    disabled={removingPath !== null}
                    onClick={() => removeSaved(item.target_path)}
                    className="text-xs font-bold text-slate-500 disabled:opacity-50"
                  >
                    {removingPath === item.target_path
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}