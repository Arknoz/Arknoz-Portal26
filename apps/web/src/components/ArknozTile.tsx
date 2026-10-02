import Link from "next/link";

type ArknozTileProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  className?: string;
  tone?: "dark" | "light";
  arrow?: boolean;
};

export default function ArknozTile({
  eyebrow,
  title,
  description,
  href,
  className = "",
  tone = "dark",
  arrow = true,
}: ArknozTileProps) {
  const classes = [
    "flex min-h-[76px] flex-col justify-between rounded-[12px] border p-3",
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
    tone === "dark"
      ? "border-white/10 bg-white/[0.025] hover:bg-white/[0.06]"
      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
    className,
  ].join(" ");

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow ? (
            <p
              className={[
                "mb-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                tone === "dark"
                  ? "text-blue-300"
                  : "text-blue-700",
              ].join(" ")}
            >
              {eyebrow}
            </p>
          ) : null}

          <span
            className={[
              "text-[12px] font-semibold",
              tone === "dark"
                ? "text-white"
                : "text-slate-950",
            ].join(" ")}
          >
            {title}
          </span>
        </div>

        {arrow && href ? (
          <span
            aria-hidden="true"
            className={
              tone === "dark"
                ? "text-slate-300"
                : "text-slate-500"
            }
          >
            →
          </span>
        ) : null}
      </div>

      {description ? (
        <p
          className={[
            "mt-3 text-[10px] leading-4",
            tone === "dark"
              ? "text-slate-500"
              : "text-slate-500",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={classes}>
      {content}
    </div>
  );
}