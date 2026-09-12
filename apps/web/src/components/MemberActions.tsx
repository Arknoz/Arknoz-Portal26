"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ActionType = "save" | "follow";

export default function MemberActions({
  returnTo,
}: {
  returnTo: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [activeActions, setActiveActions] = useState<Set<ActionType>>(
    new Set()
  );
  const [ready, setReady] = useState(false);
  const [busyAction, setBusyAction] = useState<ActionType | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setUserId(null);
        setReady(true);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("member_actions")
        .select("action_type")
        .eq("user_id", user.id)
        .eq("target_path", returnTo);

      if (!active) return;

      if (!error && data) {
        setActiveActions(
          new Set(
            data
              .map((row) => row.action_type)
              .filter(
                (value): value is ActionType =>
                  value === "save" || value === "follow"
              )
          )
        );
      }

      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [returnTo, supabase]);

  async function toggleAction(action: ActionType) {
    setMessage(null);

    if (!userId) {
      const params = new URLSearchParams({
        action,
        returnTo,
      });

      router.push(`/sign-in?${params.toString()}`);
      return;
    }

    setBusyAction(action);

    const isActive = activeActions.has(action);

    const result = isActive
      ? await supabase
          .from("member_actions")
          .delete()
          .eq("user_id", userId)
          .eq("action_type", action)
          .eq("target_path", returnTo)
      : await supabase
          .from("member_actions")
          .insert({
            user_id: userId,
            action_type: action,
            target_path: returnTo,
          });

    if (result.error) {
      setMessage("Arknoz could not update this action. Please try again.");
      setBusyAction(null);
      return;
    }

    setActiveActions((current) => {
      const next = new Set(current);

      if (isActive) {
        next.delete(action);
      } else {
        next.add(action);
      }

      return next;
    });

    setBusyAction(null);
  }

  const saved = activeActions.has("save");
  const following = activeActions.has("follow");

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!ready || busyAction !== null}
          aria-pressed={saved}
          onClick={() => toggleAction("save")}
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === "save"
            ? "Updating..."
            : saved
              ? "Saved"
              : "Save"}
        </button>

        <button
          type="button"
          disabled={!ready || busyAction !== null}
          aria-pressed={following}
          onClick={() => toggleAction("follow")}
          className="rounded-full bg-[#17315c] px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyAction === "follow"
            ? "Updating..."
            : following
              ? "Following"
              : "Follow"}
        </button>
      </div>

      {message && (
        <p
          aria-live="polite"
          className="mt-3 text-sm text-slate-600"
        >
          {message}
        </p>
      )}
    </div>
  );
}