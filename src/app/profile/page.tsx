import { Wallet, Hexagon, TrendingUp } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GuardianAvatar } from "@/components/guardian-avatar";
import { MetricCard } from "@/components/metric-card";
import { SkillBreakdown } from "@/components/sections/skill-breakdown";
import { AchievementGrid } from "@/components/sections/achievement-grid";

export default function ProfilePage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pb-24 md:pb-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 md:px-8 md:py-14">
          <div className="clip-chamfer relative overflow-hidden border border-border bg-surface/80 p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
              <GuardianAvatar size="lg" active />
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
                  OPERATOR ID · 0x4F9A
                </span>
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Operator Profile
                </h1>
                <span className="font-mono text-xs tracking-[0.06em] text-cyan-strong uppercase">
                  Rank: Journeyman · Member Since Epoch 01
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard
              label="SIKE Balance"
              value="2,940"
              icon={<Wallet />}
              accent="cyan"
            />
            <MetricCard
              label="Directives Cleared"
              value="128"
              icon={<Hexagon />}
              accent="purple"
            />
            <MetricCard
              label="Network Reputation"
              value="86.4%"
              icon={<TrendingUp />}
              accent="cyan"
            />
          </div>

          <SkillBreakdown />
          <AchievementGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
