import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Read the Arknoz privacy information covering accounts, Arknoz ID, public and private information, contributions, security and user choices.",
};
import PublicPolicyPage from "@/components/PublicPolicyPage";

const sections = [
  {
    title: "1. About this policy",
    body:
      "This Privacy Policy explains how Arknoz handles information when you use the Arknoz website, create an Arknoz account, build a professional profile, contribute material, participate in the community or use other Arknoz services.",
  },
  {
    title: "2. Information you provide",
    body:
      "Arknoz may process information you provide directly, including account details, professional profile information, experience and credentials, organisation information, contributions, uploaded material, saved activity, connection requests, messages and other information you choose to submit through the platform.",
  },
  {
    title: "3. Arknoz ID and professional identity",
    body:
      "Arknoz may assign a permanent Arknoz ID to a member account. Public profile information and a public Arknoz ID may be displayed where a member has a published profile. Private account identifiers and authentication information are not intended to be displayed publicly.",
  },
  {
    title: "4. How information is used",
    body:
      "Information may be used to operate Arknoz, authenticate members, maintain profiles and workspaces, provide requested platform functions, support collaboration, manage contributions, protect the platform, investigate misuse, maintain records and improve the reliability of Arknoz services.",
  },
  {
    title: "5. Public and private information",
    body:
      "Some information may be intentionally public, such as published professional profiles, organisation information or submitted material approved for public display. Other information, including private account information, private messages and restricted workspace information, is intended to remain subject to the relevant access controls.",
  },
  {
    title: "6. Contributions and uploaded material",
    body:
      "When you contribute or upload material, Arknoz may store and process that material together with information needed to review, manage, attribute and display the contribution. You should only submit material that you are authorised to provide.",
  },
  {
    title: "7. Service providers",
    body:
      "Arknoz may use service providers and infrastructure partners to operate functions such as authentication, hosting, storage, email delivery, security and other technical services. Those providers may process information only as needed to provide the relevant service to Arknoz.",
  },
  {
    title: "8. Security",
    body:
      "Arknoz uses technical and organisational controls intended to protect account and platform information. No online service can guarantee absolute security, and members should protect their login credentials and report suspected unauthorised access.",
  },
  {
    title: "9. Retention",
    body:
      "Arknoz may retain information for as long as reasonably necessary to operate the service, maintain platform integrity, satisfy legitimate record-keeping requirements, resolve disputes and meet applicable legal obligations.",
  },
  {
    title: "10. Your choices",
    body:
      "Members may manage information available through their account and profile interfaces where those controls are provided. Additional privacy requests and contact procedures will be published when Arknoz communication channels are activated.",
  },
  {
    title: "11. Changes to this policy",
    body:
      "Arknoz may update this Privacy Policy as the platform develops. Material updates will be reflected on this page together with an updated publication date where appropriate.",
  },
  {
    title: "12. Contact",
    body:
      "Privacy contact details will be added when the Arknoz domain and official communication channels are activated.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicPolicyPage
      eyebrow="PRIVACY"
      title="Privacy Policy"
      description="How Arknoz handles account, profile, contribution and platform information."
      sections={sections}
    />
  );
}
