import { Activity, Wallet, TrendingUp, Hexagon } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { MetricCard } from "@/components/metric-card";
import { HUDPanel } from "@/components/hud-panel";
import { ReputationRadar } from "@/components/reputation-radar";
import { SettlementFeed } from "@/components/sections/settlement-feed";
import { reputationVectors } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pb-24 md:pb-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:px-8 md:py-12">
          <DashboardHeader />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="SIKE Balance"
              value="2,940"
              delta="+150 today"
              deltaTrend="up"
              icon={<Wallet />}
              accent="cyan"
            />
            <MetricCard
              label="Directives Cleared"
              value="128"
              delta="+4 this week"
              deltaTrend="up"
              icon={<Hexagon />}
              accent="purple"
            />
            <MetricCard
              label="Network Reputation"
              value="86.4%"
              delta="+1.2%"
              deltaTrend="up"
              icon={<TrendingUp />}
              accent="cyan"
            />
            <MetricCard
              label="Validation Streak"
              value="19 days"
              delta="Personal best"
              deltaTrend="neutral"
              icon={<Activity />}
              accent="purple"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <HUDPanel label="REPUTATION_VECTOR.MAP" labelRight="6 SKILLS">
                <ReputationRadar data={reputationVectors} />
              </HUDPanel>
            </div>
            <div className="lg:col-span-3">
              <SettlementFeed />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
