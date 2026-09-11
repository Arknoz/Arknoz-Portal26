import GlobalHeader from "@/components/GlobalHeader";
import GlobalHero from "@/components/GlobalHero";
import LiveTicker from "@/components/LiveTicker";
import ExploreWorlds from "@/components/ExploreWorlds";
import M01WorldFeatureSplit from "@/components/M01WorldFeatureSplit";
import EditorsChoice from "@/components/EditorsChoice";
import M01ActionConnectionsRow from "@/components/M01ActionConnectionsRow";
import M01CommunityDiscoverRow from "@/components/M01CommunityDiscoverRow";
import PhaseRoadmap from "@/components/PhaseRoadmap";
import BuiltWorldPulse from "@/components/BuiltWorldPulse";
import GlobalFooter from "@/components/GlobalFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />
      <GlobalHero />
      <LiveTicker />
      <ExploreWorlds />
      <M01WorldFeatureSplit />
      <EditorsChoice />
      <M01ActionConnectionsRow />
      <M01CommunityDiscoverRow />
      <PhaseRoadmap />
      <BuiltWorldPulse />
      <GlobalFooter />
    </main>
  );
}
