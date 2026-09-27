import type { ReactNode } from "react";

type ArknozPageShellProps = {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
};

export default function ArknozPageShell({
  children,
  className = "",
  tone = "dark",
}: ArknozPageShellProps) {
  return (
    <main
      className={[
        "relative isolate",
        tone === "dark"
          ? "bg-[#06192e] text-white"
          : "bg-[#f7faf9] text-slate-950",
        className,
      ].join(" ")}
    >
      {children}
    </main>
  );
}