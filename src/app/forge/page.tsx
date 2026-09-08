import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ForgeGrid } from "@/components/sections/forge-grid";

export default function ForgePage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pb-24 md:pb-16">
        <div className="border-b border-border bg-grid">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-12 md:px-8 md:py-16">
            <span className="font-mono text-[11px] tracking-[0.16em] text-cyan-strong uppercase">
              // MISSION FORGE
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Select a Directive. Convert Skill into Equity.
            </h1>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-text-secondary">
              Directives are matched to your verified skill vectors. Higher difficulty
              tiers carry greater impact — and greater SIKE settlement.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
          <ForgeGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
