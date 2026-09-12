"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CommunityMemberAccess({
  returnTo,
  area,
}: {
  returnTo: string;
  area?: string;
}) {
  const supabase = useMemo(() => createClient(), []);

  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);

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

  const action =
    area && area.length > 0
      ? `community-${area}`
      : "community-overview";

  const signInParams = new URLSearchParams({
    action,
    returnTo,
  });

  const joinParams = new URLSearchParams({
    action,
    returnTo,
  });

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-6 py-7 lg:px-10">
        <div className="flex flex-col gap-5 rounded-[22px] border border-blue-100 bg-blue-50/60 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              ARKNOZ COMMUNITY
            </p>

            {!ready ? (
              <p className="mt-2 text-sm text-slate-600">
                Checking Arknoz ID access…
              </p>
            ) : signedIn ? (
              <>
                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  Arknoz ID active
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  You can use member participation features as they become
                  available in this Community area.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  Explore freely. Participate with Arknoz ID.
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Community pages remain public to explore. Contribution,
                  collaboration and other member actions require a free
                  Arknoz ID.
                </p>
              </>
            )}
          </div>

          {ready && !signedIn && (
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/sign-in?${signInParams.toString()}`}
                className="rounded-full border border-[#17315c] bg-white px-5 py-2.5 text-sm font-semibold text-[#17315c]"
              >
                Sign in to participate
              </Link>

              <Link
                href={`/join?${joinParams.toString()}`}
                className="rounded-full bg-[#17315c] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Create free Arknoz ID
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}