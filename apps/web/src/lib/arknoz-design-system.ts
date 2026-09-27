export const ARKNOZ_DESIGN = {
  layout: {
    headerHeight: 80,
    maxWidth: "max-w-[1720px]",
    pagePadding: "px-5 lg:px-8",
    compactPagePadding: "px-5 lg:px-8",
    desktopScreen:
      "lg:h-[calc(100svh-80px)] lg:min-h-0 lg:max-h-[calc(100svh-80px)]",
  },

  radius: {
    chapter: "rounded-[20px]",
    panel: "rounded-[18px]",
    tile: "rounded-[12px]",
    compact: "rounded-[10px]",
    pill: "rounded-full",
  },

  surface: {
    pageDark: "bg-[#06192e]",
    panelDark: "bg-[#091f36]",
    panelSoftDark: "bg-white/[0.035]",
    tileDark: "bg-white/[0.025]",
    white: "bg-white",
    light: "bg-[#f7faf9]",
  },

  border: {
    dark: "border border-white/10",
    darkSoft: "border border-white/8",
    light: "border border-slate-200",
  },

  typography: {
    eyebrow:
      "text-[8px] font-bold uppercase tracking-[0.16em]",
    headingLarge:
      "text-[31px] font-semibold leading-[1] tracking-[-0.045em] xl:text-[37px]",
    heading:
      "text-[19px] font-semibold tracking-[-0.025em]",
    subheading:
      "text-[14px] font-semibold tracking-[-0.015em]",
    bodyDark:
      "text-[10px] leading-5 text-slate-400",
    bodyLight:
      "text-[10px] leading-5 text-slate-600",
    metaDark:
      "text-[8px] leading-4 text-slate-500",
    metaLight:
      "text-[8px] leading-4 text-slate-500",
  },

  spacing: {
    chapterGap: "gap-3",
    panelPadding: "p-5",
    tilePadding: "p-3",
    screenPaddingY: "py-3",
  },

  interaction: {
    dark:
      "transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
    light:
      "transition hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
  },
} as const;

export type ArknozTone =
  | "dark"
  | "light";

export type ArknozDensity =
  | "compact"
  | "standard";