"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

function formatDate(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function cleanPath(path: string) {
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) {
    return "Arknoz record";
  }

  return decodeURIComponent(
    parts[parts.length - 1]
  )
    .replace(/[-_]+/g, " ")
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    );
}

function firstText(
  record: Record<string, unknown> | null,
  keys: string[]
) {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return value.trim();
    }
  }

  return "";
}

/* ==========================================================
   ACTIVITY
   ========================================================== */

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  detail: string;
  href?: string;
  occurredAt: string;
};

export function MemberActivity() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [items, setItems] = useState<ActivityItem[]>(
    []
  );

  const [ready, setReady] = useState(false);

  const [message, setMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setMessage(
          "Your Arknoz session could not be found."
        );
        setReady(true);
        return;
      }

      const [
        actions,
        profile,
        experiences,
        credentials,
      ] = await Promise.all([
        supabase
          .from("member_actions")
          .select(
            "action_type,target_path,created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(50),

        supabase
          .from("member_profiles")
          .select("created_at,updated_at")
          .eq("user_id", user.id)
          .maybeSingle(),

        supabase
          .from("member_experiences")
          .select(
            "id,role_title,organisation,created_at,updated_at"
          )
          .eq("user_id", user.id)
          .order("updated_at", {
            ascending: false,
          })
          .limit(30),

        supabase
          .from("member_credentials")
          .select(
            "id,title,issuer,created_at,updated_at"
          )
          .eq("user_id", user.id)
          .order("updated_at", {
            ascending: false,
          })
          .limit(30),
      ]);

      if (!active) return;

      const hasError = [
        actions.error,
        profile.error,
        experiences.error,
        credentials.error,
      ].some(Boolean);

      if (hasError) {
        setMessage(
          "Arknoz could not load every activity source."
        );
      }

      const result: ActivityItem[] = [];

      for (const action of actions.data ?? []) {
        result.push({
          id:
            `action-${action.action_type}-` +
            action.target_path,
          type:
            action.action_type === "follow"
              ? "FOLLOWED"
              : "SAVED",
          title:
            action.action_type === "follow"
              ? `Followed ${cleanPath(
                  action.target_path
                )}`
              : `Saved ${cleanPath(
                  action.target_path
                )}`,
          detail: action.target_path,
          href: action.target_path,
          occurredAt: action.created_at,
        });
      }

      if (profile.data?.updated_at) {
        result.push({
          id: "profile",
          type: "PROFILE",
          title: "Profile updated",
          detail:
            "Your professional Arknoz profile was updated.",
          href: "/dashboard/profile",
          occurredAt: profile.data.updated_at,
        });
      }

      for (
        const experience of experiences.data ?? []
      ) {
        result.push({
          id: `experience-${experience.id}`,
          type: "EXPERIENCE",
          title: experience.role_title,
          detail: experience.organisation,
          href:
            "/dashboard/experience-credentials",
          occurredAt:
            experience.updated_at ??
            experience.created_at,
        });
      }

      for (
        const credential of credentials.data ?? []
      ) {
        result.push({
          id: `credential-${credential.id}`,
          type: "CREDENTIAL",
          title: credential.title,
          detail: credential.issuer,
          href:
            "/dashboard/experience-credentials",
          occurredAt:
            credential.updated_at ??
            credential.created_at,
        });
      }

      result.sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() -
          new Date(a.occurredAt).getTime()
      );

      setItems(result.slice(0, 80));
      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading activity...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Your private Arknoz history
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Activity contains genuine account actions.
          It is not a social feed and does not create
          popularity signals.
        </p>
      </div>

      {message ? (
        <p className="rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {message}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-bold text-[#17315c]">
            No activity yet
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Genuine activity will appear here as
            you use Arknoz.
          </p>
        </div>
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                RECENT ACTIVITY
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#17315c]">
                Your Arknoz activity
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              {items.length} records
            </p>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      {item.type}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(
                        item.occurredAt
                      )}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-[#17315c]">
                    {item.title}
                  </h3>

                  <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                    {item.detail}
                  </p>
                </div>

                {item.href ? (
                  <Link
                    href={item.href}
                    className="shrink-0 text-xs font-bold text-blue-700"
                  >
                    Open
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   OPPORTUNITIES
   ========================================================== */

type SavedOpportunity = {
  target_path: string;
  created_at: string;
};

export function MemberOpportunities() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    opportunities,
    setOpportunities,
  ] = useState<SavedOpportunity[]>([]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) {
        setReady(true);
        return;
      }

      const { data } = await supabase
        .from("member_actions")
        .select("target_path,created_at")
        .eq("user_id", user.id)
        .eq("action_type", "save")
        .like(
          "target_path",
          "/opportunities/%"
        )
        .order("created_at", {
          ascending: false,
        });

      if (!active) return;

      setOpportunities(data ?? []);
      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading opportunities...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            DISCOVER
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Built World opportunities
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Explore genuine jobs, competitions,
            collaborations, fellowships and other
            opportunity records already published
            on Arknoz.
          </p>

          <Link
            href="/opportunities"
            className="mt-5 inline-flex rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white"
          >
            Browse Opportunities
          </Link>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            SAVED
          </p>

          <p className="mt-2 text-4xl font-bold text-[#17315c]">
            {opportunities.length}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Opportunity records currently saved
            to your private Arknoz account.
          </p>
        </div>
      </div>

      {opportunities.length > 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#17315c]">
            Saved opportunities
          </h2>

          <div className="mt-4 divide-y divide-slate-100">
            {opportunities.map((item) => (
              <div
                key={item.target_path}
                className="flex items-center justify-between gap-5 py-4"
              >
                <div>
                  <p className="text-sm font-bold text-[#17315c]">
                    {cleanPath(
                      item.target_path
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Saved{" "}
                    {formatDate(
                      item.created_at
                    )}
                  </p>
                </div>

                <Link
                  href={item.target_path}
                  className="text-xs font-bold text-blue-700"
                >
                  Open
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ==========================================================
   ARKNOZ CV
   ========================================================== */

type Experience = {
  id: string;
  role_title: string;
  organisation: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
};

type Credential = {
  id: string;
  title: string;
  issuer: string;
  credential_type: string;
  issue_date: string | null;
  expiry_date: string | null;
  description: string;
};

export function MemberArknozCV() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [profile, setProfile] =
    useState<Record<string, unknown> | null>(
      null
    );

  const [
    experiences,
    setExperiences,
  ] = useState<Experience[]>([]);

  const [
    credentials,
    setCredentials,
  ] = useState<Credential[]>([]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) {
        setReady(true);
        return;
      }

      const [p, e, c] =
        await Promise.all([
          supabase
            .from("member_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle(),

          supabase
            .from("member_experiences")
            .select(
              "id,role_title,organisation,location,start_date,end_date,is_current,description"
            )
            .eq("user_id", user.id)
            .order("start_date", {
              ascending: false,
            }),

          supabase
            .from("member_credentials")
            .select(
              "id,title,issuer,credential_type,issue_date,expiry_date,description"
            )
            .eq("user_id", user.id)
            .order("issue_date", {
              ascending: false,
            }),
        ]);

      if (!active) return;

      setProfile(
        (p.data as Record<
          string,
          unknown
        > | null) ?? null
      );

      setExperiences(e.data ?? []);
      setCredentials(c.data ?? []);
      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Building Arknoz CV...
      </div>
    );
  }

  const name =
    firstText(profile, [
      "display_name",
      "full_name",
      "name",
    ]) || "Professional profile";

  const headline = firstText(profile, [
    "professional_title",
    "headline",
    "title",
  ]);

  const location = firstText(profile, [
    "location",
    "city",
  ]);

  const about = firstText(profile, [
    "about",
    "bio",
    "summary",
  ]);

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Live structured CV
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Arknoz CV is generated from your
          professional profile, experience and
          credentials. It does not invent missing
          information.
        </p>
      </div>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-[#17315c]">
          {name}
        </h2>

        {headline ? (
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {headline}
          </p>
        ) : null}

        {location ? (
          <p className="mt-1 text-xs text-slate-500">
            {location}
          </p>
        ) : null}

        {about ? (
          <p className="mt-5 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {about}
          </p>
        ) : null}

        <div className="mt-5">
          <Link
            href="/dashboard/profile"
            className="text-xs font-bold text-blue-700"
          >
            Edit professional profile
          </Link>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#17315c]">
            Experience
          </h2>

          <span className="text-xs text-slate-400">
            {experiences.length}
          </span>
        </div>

        {experiences.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No experience records added yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {experiences.map((item) => (
              <article
                key={item.id}
                className="py-4 first:pt-0"
              >
                <h3 className="text-sm font-bold text-[#17315c]">
                  {item.role_title}
                </h3>

                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {item.organisation}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  {formatDate(
                    item.start_date
                  )}
                  {item.start_date
                    ? " - "
                    : ""}
                  {item.is_current
                    ? "Present"
                    : formatDate(
                        item.end_date
                      )}
                </p>

                {item.description ? (
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#17315c]">
            Credentials
          </h2>

          <span className="text-xs text-slate-400">
            {credentials.length}
          </span>
        </div>

        {credentials.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No credentials added yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {credentials.map((item) => (
              <article
                key={item.id}
                className="py-4 first:pt-0"
              >
                <h3 className="text-sm font-bold text-[#17315c]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {item.issuer}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  {item.credential_type}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-5">
          <Link
            href="/dashboard/experience-credentials"
            className="text-xs font-bold text-blue-700"
          >
            Manage professional records
          </Link>
        </div>
      </section>

      <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-4">
        <p className="text-xs leading-5 text-slate-500">
          Connected project evidence will be
          included only when genuine Arknoz
          person-project relationships are
          available. Missing project links are
          not fabricated.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================
   ADVANCED ANALYTICS
   ========================================================== */

type Metric = {
  label: string;
  value: number;
  note: string;
};

export function MemberAdvancedAnalytics() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [metrics, setMetrics] = useState<
    Metric[]
  >([]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) {
        setReady(true);
        return;
      }

      const [
        actions,
        experiences,
        credentials,
        profiles,
      ] = await Promise.all([
        supabase
          .from("member_actions")
          .select("action_type")
          .eq("user_id", user.id),

        supabase
          .from("member_experiences")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),

        supabase
          .from("member_credentials")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),

        supabase
          .from("member_profiles")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),
      ]);

      if (!active) return;

      const actionRows =
        actions.data ?? [];

      const saved = actionRows.filter(
        (item) =>
          item.action_type === "save"
      ).length;

      const followed = actionRows.filter(
        (item) =>
          item.action_type === "follow"
      ).length;

      setMetrics([
        {
          label: "Saved records",
          value: saved,
          note:
            "Records genuinely saved to your account.",
        },
        {
          label: "Followed records",
          value: followed,
          note:
            "Records genuinely followed by your account.",
        },
        {
          label: "Experience records",
          value: experiences.count ?? 0,
          note:
            "Professional experience records in Arknoz.",
        },
        {
          label: "Credentials",
          value: credentials.count ?? 0,
          note:
            "Credential records currently stored.",
        },
        {
          label: "Profile",
          value:
            (profiles.count ?? 0) > 0
              ? 1
              : 0,
          note:
            "Whether a professional profile exists.",
        },
      ]);

      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Evidence-based personal analytics
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          These values come from your real Arknoz
          records. No peer rankings, popularity
          scores or invented benchmarks are used.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[24px] border border-slate-200 bg-white p-6"
          >
            <p className="text-xs font-semibold text-slate-500">
              {metric.label}
            </p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-[#17315c]">
              {metric.value.toLocaleString()}
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              {metric.note}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}