import Link from "next/link";

type ArknozContextPanelProps = {
  label: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
  eyebrow?: string;
  tone?: "light" | "dark";
  placementType?:
    | "context"
    | "featured"
    | "sponsored"
    | "related"
    | "pro"
    | "partner";
};

export default function ArknozContextPanel({
  label,
  title,
  description,
  href,
  cta,
  eyebrow,
  tone = "light",
  placementType = "context",
}: ArknozContextPanelProps) {
  const dark =
    tone === "dark";

  const body = (
    <div
      className={[
        "rounded-[18px] border p-5 transition",
        dark
          ? "border-white/15 bg-white/[0.06] text-white"
          : "border-slate-200 bg-white text-slate-950",
        href
          ? dark
            ? "hover:bg-white/[0.1]"
            : "hover:border-slate-300 hover:shadow-sm"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p
            className={[
              "text-[11px] font-semibold uppercase tracking-[0.15em]",
              dark
                ? "text-white/45"
                : "text-slate-400",
            ].join(" ")}
          >
            {eyebrow ?? placementType}
          </p>

          <p
            className={[
              "mt-3 text-[11px] font-semibold uppercase tracking-[0.12em]",
              dark
                ? "text-blue-200"
                : "text-blue-700",
            ].join(" ")}
          >
            {label}
          </p>

          <h3 className="mt-2 text-[19px] font-semibold tracking-[-0.025em]">
            {title}
          </h3>

          {description ? (
            <p
              className={[
                "mt-3 max-w-md text-[12px] leading-5",
                dark
                  ? "text-white/55"
                  : "text-slate-500",
              ].join(" ")}
            >
              {description}
            </p>
          ) : null}
        </div>

        {href ? (
          <span
            aria-hidden="true"
            className={[
              "mt-1 shrink-0 text-lg",
              dark
                ? "text-white/65"
                : "text-blue-700",
            ].join(" ")}
          >
            →
          </span>
        ) : null}
      </div>

      {href && cta ? (
        <p
          className={[
            "mt-5 text-[12px] font-semibold",
            dark
              ? "text-white"
              : "text-blue-700",
          ].join(" ")}
        >
          {cta} →
        </p>
      ) : null}
    </div>
  );

  if (!href) {
    return body;
  }

  return (
    <Link
      href={href}
      className="block"
    >
      {body}
    </Link>
  );
}