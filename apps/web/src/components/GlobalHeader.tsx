"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import LanguageControl from "@/components/LanguageControl";

import {
  arknozSections,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";

const nav = [
  ["Home", "/"],
  ["Explore", "/explore"],
  ["Connect", "/connect"],
  ["Intelligence", "/intelligence"],
  ["Global", "/global"],
] as const;

function navIsPaid(
  label: string
) {
  const section =
    arknozSections.find(
      (item) =>
        item.title === label
    );

  return section
    ? isPaidArknozSection(
        section.key
      )
    : false;
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="6.5"
        y="10"
        width="11"
        height="9"
        rx="2"
      />
      <path d="M9 10V7.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

export default function GlobalHeader() {
  const [open, setOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/brand/arknoz-logo.png"
            alt="Arknoz - The Digital Built World"
            width={230}
            height={58}
            priority
            className="h-[54px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          {nav.map(
            ([label, href]) => {
              const paid =
                navIsPaid(label);

              return (
                <Link
                  key={href}
                  href={href}
                  title={
                    paid
                      ? `${label} · Arknoz Pro`
                      : label
                  }
                  className="flex items-center gap-1.5 hover:text-[#17315c]"
                >
                  {label}

                  {paid && (
                    <LockIcon />
                  )}

                  {label ===
                    "Global" && (
                    <ChevronDown />
                  )}
                </Link>
              );
            }
          )}
        </nav>

        <div className="hidden items-center gap-3 text-sm text-slate-700 md:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <SearchIcon />
          </Link>

          <LanguageControl compact />

          <Link
            href="/sign-in"
            className="px-2 hover:text-[#17315c]"
          >
            Sign in
          </Link>

          <Link
            href="/join"
            className="rounded-md bg-[#17315c] px-4 py-2.5 font-semibold text-white hover:bg-[#102541]"
          >
            Join Arknoz
          </Link>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen(!open)
          }
          aria-label="Open Arknoz menu"
          aria-expanded={open}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm lg:hidden"
        >
          {open
            ? "Close"
            : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-5 py-5">
            <nav className="flex flex-col">
              {nav.map(
                ([label, href]) => {
                  const paid =
                    navIsPaid(
                      label
                    );

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                      className="flex items-center gap-2 border-b border-slate-100 py-4 font-semibold text-slate-800"
                    >
                      {label}

                      {paid && (
                        <LockIcon />
                      )}
                    </Link>
                  );
                }
              )}
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/search"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold"
              >
                Search
              </Link>

              <div className="flex items-center justify-center rounded-lg border border-slate-300">
                <LanguageControl />
              </div>

              <Link
                href="/sign-in"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold"
              >
                Sign in
              </Link>

              <Link
                href="/join"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-lg bg-[#17315c] px-4 py-3 text-center font-semibold text-white"
              >
                Join Arknoz
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}