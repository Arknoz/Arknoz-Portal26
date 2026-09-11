import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import SystemState from "@/components/SystemState";

export default function UnavailablePage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <SystemState
        eyebrow="Temporarily Unavailable"
        title="This Arknoz record is not currently available."
        description="The source may be under review, the record may be changing, or Arknoz may be validating its current status. We do not show uncertain information as established fact."
      />

      <GlobalFooter />
    </main>
  );
}
