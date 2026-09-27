import type { ArknozSectionKey } from "@/lib/arknoz-sections";

export type ArknozVisualTheme = {
  key: ArknozSectionKey;
  label: string;

  dark: string;
  mid: string;
  accent: string;

  soft: string;
  softAlt: string;

  textAccent: string;
  border: string;

  heroGradient: string;
  emptyGradient: string;
};

/**
 * ARKNOZ VISUAL THEME V1
 *
 * One Arknoz design language.
 * Distinct identity for each world.
 *
 * This file controls presentation only.
 * It must never control content, publication,
 * rights, data eligibility or Supabase behaviour.
 */
export const arknozVisualThemes: Record<
  ArknozSectionKey,
  ArknozVisualTheme
> = {
  projects: {
    key: "projects",
    label: "Projects",
    dark: "#071b31",
    mid: "#123d68",
    accent: "#4d93d1",
    soft: "#f3f7fb",
    softAlt: "#e8f0f7",
    textAccent: "#245f91",
    border: "#cbd7e3",
    heroGradient:
      "linear-gradient(135deg,#071b31 0%,#123d68 58%,#315b7e 100%)",
    emptyGradient:
      "linear-gradient(135deg,#315b7e 0%,#173b5d 55%,#081d31 100%)",
  },

  products: {
    key: "products",
    label: "Products",
    dark: "#392319",
    mid: "#75432f",
    accent: "#c46f4a",
    soft: "#fbf6f2",
    softAlt: "#f4e9e1",
    textAccent: "#965236",
    border: "#dfcfc5",
    heroGradient:
      "linear-gradient(135deg,#392319 0%,#75432f 58%,#a85f40 100%)",
    emptyGradient:
      "linear-gradient(135deg,#9b6249 0%,#663b2b 55%,#301d16 100%)",
  },

  knowledge: {
    key: "knowledge",
    label: "Knowledge",
    dark: "#211c43",
    mid: "#4b3f79",
    accent: "#7c6bc3",
    soft: "#f7f5fc",
    softAlt: "#ece8f7",
    textAccent: "#5d4ba0",
    border: "#d8d1eb",
    heroGradient:
      "linear-gradient(135deg,#211c43 0%,#4b3f79 58%,#6757a2 100%)",
    emptyGradient:
      "linear-gradient(135deg,#6c5d9e 0%,#40356b 55%,#1d193d 100%)",
  },

  learning: {
    key: "learning",
    label: "Education",
    dark: "#103936",
    mid: "#1f625b",
    accent: "#55a398",
    soft: "#f2f9f7",
    softAlt: "#e4f1ee",
    textAccent: "#28776e",
    border: "#c9dfda",
    heroGradient:
      "linear-gradient(135deg,#103936 0%,#1f625b 58%,#3f887f 100%)",
    emptyGradient:
      "linear-gradient(135deg,#488c83 0%,#245e58 55%,#0c332f 100%)",
  },

  opportunities: {
    key: "opportunities",
    label: "Opportunities",
    dark: "#492f16",
    mid: "#87591f",
    accent: "#d29a3b",
    soft: "#fcf8f0",
    softAlt: "#f6ecd8",
    textAccent: "#9b681f",
    border: "#e5d5b8",
    heroGradient:
      "linear-gradient(135deg,#492f16 0%,#87591f 58%,#b57a2b 100%)",
    emptyGradient:
      "linear-gradient(135deg,#aa7734 0%,#70491d 55%,#3b2613 100%)",
  },

  people: {
    key: "people",
    label: "People",
    dark: "#29243f",
    mid: "#51466d",
    accent: "#8b7dab",
    soft: "#f7f5fa",
    softAlt: "#ece8f1",
    textAccent: "#65577f",
    border: "#d8d1e1",
    heroGradient:
      "linear-gradient(135deg,#29243f 0%,#51466d 58%,#75658f 100%)",
    emptyGradient:
      "linear-gradient(135deg,#75698d 0%,#4a405f 55%,#252137 100%)",
  },

  organisations: {
    key: "organisations",
    label: "Organisations",
    dark: "#202d35",
    mid: "#415761",
    accent: "#748d97",
    soft: "#f4f7f8",
    softAlt: "#e7edef",
    textAccent: "#506d78",
    border: "#ced9dd",
    heroGradient:
      "linear-gradient(135deg,#202d35 0%,#415761 58%,#657983 100%)",
    emptyGradient:
      "linear-gradient(135deg,#687d86 0%,#3f535c 55%,#1c2930 100%)",
  },

  universities: {
    key: "universities",
    label: "Universities",
    dark: "#1e3049",
    mid: "#3c5b7f",
    accent: "#6f95bd",
    soft: "#f3f6fa",
    softAlt: "#e5edf5",
    textAccent: "#456c95",
    border: "#ccd9e5",
    heroGradient:
      "linear-gradient(135deg,#1e3049 0%,#3c5b7f 58%,#5c7fa3 100%)",
    emptyGradient:
      "linear-gradient(135deg,#617f9d 0%,#395570 55%,#192a40 100%)",
  },

  places: {
    key: "places",
    label: "Places",
    dark: "#163b37",
    mid: "#32665f",
    accent: "#65a097",
    soft: "#f2f8f6",
    softAlt: "#e3efec",
    textAccent: "#39786f",
    border: "#c7ddd8",
    heroGradient:
      "linear-gradient(135deg,#163b37 0%,#32665f 58%,#53877e 100%)",
    emptyGradient:
      "linear-gradient(135deg,#588a82 0%,#305f59 55%,#13342f 100%)",
  },

  community: {
    key: "community",
    label: "Community",
    dark: "#382149",
    mid: "#69407b",
    accent: "#a274b6",
    soft: "#faf5fb",
    softAlt: "#f0e6f3",
    textAccent: "#7e4e91",
    border: "#dfcfe5",
    heroGradient:
      "linear-gradient(135deg,#382149 0%,#69407b 58%,#8e60a0 100%)",
    emptyGradient:
      "linear-gradient(135deg,#8d659b 0%,#613d70 55%,#311d40 100%)",
  },

  connect: {
    key: "connect",
    label: "Connect",
    dark: "#123846",
    mid: "#246879",
    accent: "#55a1b2",
    soft: "#f1f8fa",
    softAlt: "#e1eff2",
    textAccent: "#2c7687",
    border: "#c5dce1",
    heroGradient:
      "linear-gradient(135deg,#123846 0%,#246879 58%,#438b9b 100%)",
    emptyGradient:
      "linear-gradient(135deg,#4d8e9c 0%,#275f6d 55%,#0f3340 100%)",
  },

  intelligence: {
    key: "intelligence",
    label: "Intelligence",
    dark: "#4b1e31",
    mid: "#743650",
    accent: "#a85d7a",
    soft: "#fbf7f8",
    softAlt: "#f2e8ec",
    textAccent: "#8a3c5d",
    border: "#dfcbd3",
    heroGradient:
      "linear-gradient(135deg,#4b1e31 0%,#743650 58%,#98506e 100%)",
    emptyGradient:
      "linear-gradient(135deg,#92546d 0%,#663047 55%,#421a2b 100%)",
  },
};

export function getArknozVisualTheme(
  sectionKey?: ArknozSectionKey
): ArknozVisualTheme {
  return arknozVisualThemes[
    sectionKey ?? "projects"
  ];
}