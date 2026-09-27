import type { ReactNode } from "react";

type ArknozPanelProps = {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
  accent?: boolean;
};

export default function ArknozPanel({
  children,
  className = "",
  tone = "dark",
  accent = false,
}: ArknozPanelProps) {
  const surface =
    tone === "dark"
      ? accent
        ? "border border-blue-400/20 bg-[#0b3154]"
        : "border border-white/10 bg-white/[0.035]"
      : accent
        ? "border border-blue-200 bg-blue-50"
        : "border border-slate-200 bg-white";

  return (
    <section
      className={[
        "rounded-[18px] p-5",
        surface,
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}