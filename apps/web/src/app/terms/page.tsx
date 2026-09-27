import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Read the Arknoz platform terms covering accounts, Arknoz ID, profiles, contributions, Community, Arknoz Pro and acceptable use.",
};
import PublicPolicyPage from "@/components/PublicPolicyPage";

const sections = [
  {
    title: "1. About these terms",
    body:
      "These Terms of Use apply when you access or use Arknoz, including public content, member accounts, professional profiles, workspaces, community functions, contributions and other platform services.",
  },
  {
    title: "2. Using Arknoz",
    body:
      "You may use Arknoz only for lawful purposes and in a manner that does not interfere with the platform, compromise security, misuse another person's information or infringe the rights of others.",
  },
  {
    title: "3. Accounts and Arknoz ID",
    body:
      "Some Arknoz functions require an account. You are responsible for maintaining control of your account and for information submitted through it. Arknoz may assign a permanent Arknoz ID to support professional identity and platform participation.",
  },
  {
    title: "4. Profile and professional information",
    body:
      "You are responsible for ensuring that professional, organisation, experience, credential and other profile information you submit is accurate to the best of your knowledge and that you are authorised to provide it.",
  },
  {
    title: "5. Contributions and uploads",
    body:
      "You should only contribute or upload material that you have the right to provide. You remain responsible for submitted material and for any permissions, rights, licences or attribution required for its use.",
  },
  {
    title: "6. Public content",
    body:
      "Arknoz may organise and display information about projects, products, knowledge, people, organisations, universities, places and opportunities. Information may come from contributors, organisations, public sources or other permitted sources. Users should independently verify information where decisions depend on accuracy or completeness.",
  },
  {
    title: "7. Community and collaboration",
    body:
      "Member participation, connection requests, collaboration, messages and other professional interactions must be genuine, relevant and respectful. Arknoz may restrict activity that is misleading, abusive, fraudulent, unsafe or disruptive to the platform.",
  },
  {
    title: "8. Arknoz Pro",
    body:
      "Arknoz Pro may provide additional professional workspaces, tools, collaboration functions and intelligence. Features, availability and commercial terms may change as the service develops. Paid access will be governed by the terms presented when purchasing or activating the relevant service.",
  },
  {
    title: "9. Platform availability",
    body:
      "Arknoz may update, improve, replace, suspend or discontinue parts of the platform as the service develops. Arknoz does not guarantee uninterrupted or error-free availability.",
  },
  {
    title: "10. Intellectual property",
    body:
      "Arknoz branding, platform design, software and original platform materials remain subject to applicable intellectual property rights. Third-party content remains subject to the rights and licences associated with that material.",
  },
  {
    title: "11. Misuse and access restrictions",
    body:
      "Arknoz may restrict or suspend access where reasonably necessary to protect users, data, rights, platform security or service integrity, or where these Terms are materially breached.",
  },
  {
    title: "12. Information and professional decisions",
    body:
      "Arknoz provides discovery, organisation, professional workflow and information services. Platform information is not a substitute for appropriate professional, technical, legal, financial or other specialist advice where such advice is required.",
  },
  {
    title: "13. Changes to these terms",
    body:
      "Arknoz may update these Terms as the platform develops. Material changes will be reflected on this page together with an updated publication date where appropriate.",
  },
  {
    title: "14. Contact",
    body:
      "Official contact details for questions about these Terms will be added when the Arknoz domain and communication channels are activated.",
  },
];

export default function TermsPage() {
  return (
    <PublicPolicyPage
      eyebrow="TERMS"
      title="Terms of Use"
      description="The basic terms governing access to and use of the Arknoz platform."
      sections={sections}
    />
  );
}
