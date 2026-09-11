import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import SystemState from "@/components/SystemState";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <SystemState
        eyebrow="404 · Not Found"
        title="This part of the Built World could not be found."
        description="The record may have moved, changed, merged with another Arknoz entity, or the address may be incorrect."
      />

      <GlobalFooter />
    </main>
  );
}
