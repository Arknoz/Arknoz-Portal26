export default function LanguageControl({
  compact = false,
  dark = false,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <span
      aria-label="English"
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
        dark
          ? "border border-white/15 bg-white/5 text-white"
          : "text-slate-700",
      ].join(" ")}
    >
      <span>{compact ? "EN" : "English"}</span>
    </span>
  );
}
