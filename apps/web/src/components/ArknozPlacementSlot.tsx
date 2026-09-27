import ArknozContextPanel from "@/components/ArknozContextPanel";

export type ArknozPlacementContent = {
  placementType:
    | "context"
    | "featured"
    | "sponsored"
    | "related"
    | "pro"
    | "partner";
  eyebrow?: string;
  label: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
};

type ArknozPlacementSlotProps = {
  slotKey: string;
  tone?: "light" | "dark";

  /*
    Future Admin / database assignment.
    When supplied, this always takes priority.
  */
  assignment?: ArknozPlacementContent | null;

  /*
    Safe platform-owned editorial fallback.
    No fake records or fabricated activity.
  */
  fallback?: ArknozPlacementContent | null;

  className?: string;
};

export default function ArknozPlacementSlot({
  slotKey,
  tone = "dark",
  assignment = null,
  fallback = null,
  className = "",
}: ArknozPlacementSlotProps) {
  const placement =
    assignment ??
    fallback;

  if (!placement) {
    return null;
  }

  const eyebrow =
    placement.eyebrow ??
    (
      placement.placementType === "sponsored"
        ? "Sponsored"
        : undefined
    );

  return (
    <div
      data-arknoz-placement-slot={slotKey}
      data-placement-type={placement.placementType}
      className={[
        "hidden xl:block",
        className,
      ].join(" ")}
    >
      <ArknozContextPanel
        placementType={placement.placementType}
        eyebrow={eyebrow}
        label={placement.label}
        title={placement.title}
        description={placement.description}
        href={placement.href}
        cta={placement.cta}
        tone={tone}
      />
    </div>
  );
}