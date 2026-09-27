"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

type Contribution = {
  importId: string;
  manifestKey: string;
  contributionType: string;
  targetEntityType:
    string | null;
  title: string;
  reviewStatus: string;
  matchStatus: string;
  publicationStatus: string;
  submittedAt:
    string | null;
  evidenceCount: number;
};

function humanize(
  value: string
) {
  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export default function MemberContributionHistory() {
  const [
    contributions,
    setContributions,
  ] =
    useState<
      Contribution[]
    >([]);

  const [
    ready,
    setReady,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let active =
      true;

    async function load() {
      try {
        const response =
          await fetch(
            "/api/contributions/mine",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!active) {
          return;
        }

        if (
          !response.ok ||
          !data?.ok
        ) {
          throw new Error(
            data?.error ||
              "Contribution history could not be loaded."
          );
        }

        setContributions(
          data.contributions ??
            []
        );
      } catch (caught) {
        if (!active) {
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Contribution history could not be loaded."
        );
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
            PRO CONTRIBUTION WORKSPACE
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#17315c]">
            My Contributions
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Submit genuine Built World records,
            evidence and corrections for Arknoz
            review.
          </p>
        </div>

        <Link
          href="/contribute"
          className="w-fit rounded-full bg-[#17315c] px-5 py-3 text-[11px] font-bold text-white"
        >
          New Contribution
        </Link>
      </div>

      {!ready ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading contributions...
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : contributions.length ===
        0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-7">
          <p className="font-bold text-[#17315c]">
            No submitted contributions yet.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start with a project, product,
            knowledge or research record,
            organisation, education record or
            opportunity.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {contributions.map(
            (item) => (
              <article
                key={
                  item.importId
                }
                className="rounded-[22px] border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      {humanize(
                        item.contributionType
                      )}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-[#17315c]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[11px] text-slate-500">
                      Contribution ID ·{" "}
                      {item.importId}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[9px] font-bold text-blue-700">
                      {humanize(
                        item.reviewStatus
                      )}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-600">
                      Match ·{" "}
                      {humanize(
                        item.matchStatus
                      )}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-600">
                      Publication ·{" "}
                      {humanize(
                        item.publicationStatus
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-[11px] sm:grid-cols-3">
                  <div>
                    <span className="text-slate-400">
                      Submitted
                    </span>

                    <p className="mt-1 font-bold">
                      {formatDate(
                        item.submittedAt
                      ) ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400">
                      Evidence
                    </span>

                    <p className="mt-1 font-bold">
                      {
                        item.evidenceCount
                      }{" "}
                      file
                      {item.evidenceCount ===
                      1
                        ? ""
                        : "s"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400">
                      Public record
                    </span>

                    <p className="mt-1 font-bold">
                      Not automatic
                    </p>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}