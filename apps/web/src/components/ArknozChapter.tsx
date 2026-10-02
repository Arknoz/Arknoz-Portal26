import type { ReactNode } from "react";

type ArknozChapterProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: "dark" | "light";
  fullScreen?: boolean;
};

export default function ArknozChapter({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
  innerClassName = "",
  tone = "dark",
  fullScreen = true,
}: ArknozChapterProps) {
  return (
    <section
      id={id}
      className={[
        "relative isolate overflow-hidden",
        tone === "dark"
          ? "bg-[#06192e] text-white"
          : "bg-[#f7faf9] text-slate-950",
        fullScreen
          ? "lg:h-[calc(100svh-80px)] lg:min-h-0"
          : "",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex h-full max-w-[1720px] flex-col px-5 py-3 lg:px-8",
          innerClassName,
        ].join(" ")}
      >
        {(eyebrow || title || description) ? (
          <header className="shrink-0 pb-4">
            {eyebrow ? (
              <p
                className={[
                  "text-[10px] font-bold uppercase tracking-[0.16em]",
                  tone === "dark"
                    ? "text-blue-300"
                    : "text-blue-700",
                ].join(" ")}
              >
                {eyebrow}
              </p>
            ) : null}

            {title ? (
              <h2 className="mt-1.5 text-[26px] font-semibold tracking-[-0.035em]">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p
                className={[
                  "mt-2 max-w-2xl text-[11px] leading-5",
                  tone === "dark"
                    ? "text-slate-400"
                    : "text-slate-600",
                ].join(" ")}
              >
                {description}
              </p>
            ) : null}
          </header>
        ) : null}

        <div className="min-h-0 flex-1">
          {children}
        </div>
      </div>
    </section>
  );
}