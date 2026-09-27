"use client";

import { useState } from "react";

import AskArknozPanel from "@/components/AskArknozPanel";


export default function GlobalAskArknoz() {

  const [
    open,
    setOpen,
  ] =
    useState(false);


  return (
    <div
      className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6"
      data-global-ask-arknoz="true"
    >

      {open && (

        <div
          className="
            mb-3
            w-[calc(100vw-2rem)]
            max-w-[440px]
            overflow-hidden
            rounded-[24px]
            bg-white
            shadow-[0_24px_80px_rgba(15,23,42,0.22)]
          "
        >

          <div className="flex justify-end border-b border-slate-100 bg-white px-3 py-2">

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              className="
                inline-flex
                h-8
                items-center
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-slate-600
                transition
                hover:border-slate-300
                hover:text-slate-950
              "
              aria-label="Close Ask Arknoz"
            >
              Close
            </button>

          </div>

          <AskArknozPanel />

        </div>

      )}


      <div className="flex justify-end">

        <button
          type="button"
          onClick={() =>
            setOpen(
              (current) =>
                !current
            )
          }
          aria-expanded={open}
          aria-controls="ask-arknoz"
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-700
            bg-[#0f55c8]
            px-5
            py-3
            text-xs
            font-bold
            text-white
            shadow-[0_12px_32px_rgba(15,85,200,0.28)]
            transition
            hover:bg-[#0b469f]
          "
        >

          <span
            className="h-2 w-2 rounded-full bg-white"
            aria-hidden="true"
          />

          Ask Arknoz

        </button>

      </div>

    </div>
  );
}