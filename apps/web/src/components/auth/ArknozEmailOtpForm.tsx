"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ArknozEmailOtpFormProps = {
  mode: "sign-in" | "join";
  returnTo: string;
  action?: string;
};

type MemberAction = "save" | "follow";

export default function ArknozEmailOtpForm({
  mode,
  returnTo,
  action,
}: ArknozEmailOtpFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const memberAction: MemberAction | null =
    action === "save" || action === "follow"
      ? action
      : null;

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage("Enter your email address.");
      return;
    }

    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: mode === "join",
      },
    });

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setStage("otp");
    setMessage(
      mode === "join"
        ? "We sent your Arknoz ID verification code."
        : "We sent your Arknoz sign-in code."
    );
  }

  async function completePreservedAction(
    userId: string
  ) {
    if (!memberAction) return true;

    const { error } = await supabase
      .from("member_actions")
      .insert({
        user_id: userId,
        action_type: memberAction,
        target_path: returnTo,
      });

    if (!error || error.code === "23505") {
      return true;
    }

    setMessage(
      "You are signed in, but Arknoz could not complete the original action. Please try again."
    );

    return false;
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanToken = token.trim();

    if (!cleanToken) {
      setMessage("Enter the code from your email.");
      return;
    }

    setBusy(true);
    setMessage(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: cleanToken,
      type: "email",
    });

    if (error) {
      setBusy(false);
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setBusy(false);
      setMessage("Arknoz could not confirm your account. Please try again.");
      return;
    }

    const completed = await completePreservedAction(
      data.user.id
    );

    setBusy(false);

    if (!completed) {
      return;
    }

    router.replace(returnTo);
    router.refresh();
  }

  if (stage === "otp") {
    return (
      <form
        onSubmit={verifyCode}
        className="mt-8 rounded-2xl border border-slate-200 p-7"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Check your email
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Enter your verification code
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          We sent the code to <strong>{email}</strong>.
        </p>

        {memberAction && (
          <p className="mt-3 text-sm leading-6 text-blue-700">
            After verification, Arknoz will complete your{" "}
            {memberAction === "save" ? "Save" : "Follow"} action.
          </p>
        )}

        <label
          htmlFor="arknoz-otp"
          className="mt-6 block text-sm font-semibold text-slate-800"
        >
          Verification code
        </label>

        <input
          id="arknoz-otp"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg tracking-[0.25em] outline-none focus:border-blue-600"
          placeholder="Enter code"
          autoFocus
        />

        {message && (
          <p
            aria-live="polite"
            className="mt-4 text-sm leading-6 text-slate-600"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Verifying..." : "Verify and continue"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setStage("email");
            setToken("");
            setMessage(null);
          }}
          className="mt-4 w-full text-sm font-semibold text-blue-700"
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={sendCode}
      className="mt-8 rounded-2xl border border-slate-200 p-7"
    >
      <label
        htmlFor="arknoz-email"
        className="block text-sm font-semibold text-slate-800"
      >
        Email address
      </label>

      <input
        id="arknoz-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
        placeholder="you@example.com"
      />

      <p className="mt-3 text-sm leading-6 text-slate-500">
        No password required. Arknoz will send you a one-time verification code.
      </p>

      {message && (
        <p
          aria-live="polite"
          className="mt-4 text-sm leading-6 text-slate-600"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy
          ? "Sending..."
          : mode === "join"
            ? "Create free Arknoz ID"
            : "Send sign-in code"}
      </button>
    </form>
  );
}