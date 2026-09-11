import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import SystemState from "@/components/SystemState";

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <SystemState
        eyebrow="Access"
        title="You do not have access to this area."
        description="Some Arknoz areas depend on membership, permissions or administrative responsibility."
        primaryLabel="Sign in"
        primaryHref="/sign-in"
        secondaryLabel="Return to Global Home"
        secondaryHref="/"
      />

      <GlobalFooter />
    </main>
  );
}
