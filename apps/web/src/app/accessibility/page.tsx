import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Read Arknoz's approach to accessibility, inclusive design, keyboard access, responsive experiences and ongoing platform improvement.",
};
import PublicPolicyPage from "@/components/PublicPolicyPage";

const sections = [
  {
    title: "1. Our approach",
    body:
      "Arknoz aims to make the platform usable by as many people as possible across devices, abilities and ways of interacting with digital services.",
  },
  {
    title: "2. Accessibility goals",
    body:
      "Arknoz is being developed with attention to readable text, clear navigation, keyboard access, responsive layouts, meaningful structure, sufficient interface contrast and understandable interactive controls.",
  },
  {
    title: "3. Ongoing development",
    body:
      "Arknoz is an evolving platform. Some areas may not yet meet every accessibility requirement or work equally well with every assistive technology. Accessibility improvements will continue as the platform develops.",
  },
  {
    title: "4. Images and visual information",
    body:
      "Where practical, Arknoz aims to provide meaningful text alternatives or supporting context for important visual information. Decorative imagery should not be required to understand essential platform content.",
  },
  {
    title: "5. Keyboard and navigation",
    body:
      "Arknoz aims to support logical navigation and access to core interactive functions without requiring a pointing device.",
  },
  {
    title: "6. Responsive access",
    body:
      "The platform is designed to work across desktop, tablet and mobile screen sizes. Layouts and controls may continue to be refined as device testing expands.",
  },
  {
    title: "7. Third-party content",
    body:
      "Some external content, linked resources or third-party services used with Arknoz may have their own accessibility characteristics and may not be controlled by Arknoz.",
  },
  {
    title: "8. Feedback",
    body:
      "If you encounter an accessibility barrier, Arknoz intends to provide a direct feedback channel when official domain and communication services are activated.",
  },
];

export default function AccessibilityPage() {
  return (
    <PublicPolicyPage
      eyebrow="ACCESSIBILITY"
      title="Accessibility Statement"
      description="Arknoz is being developed to support clear, usable and inclusive access across the Built World platform."
      sections={sections}
    />
  );
}
