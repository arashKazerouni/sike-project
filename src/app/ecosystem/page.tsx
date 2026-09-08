import { Cpu, Landmark, ShieldHalf, Users } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HUDPanel } from "@/components/hud-panel";
import { GuardianAvatar } from "@/components/guardian-avatar";
import { CyberButton } from "@/components/cyber-button";
import { ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Cpu,
    title: "Verified Compute Layer",
    description:
      "Every directive submission passes through validator quorum before settlement — no self-attested work is ever rewarded.",
  },
  {
    icon: ShieldHalf,
    title: "Reputation as Collateral",
    description:
      "Your Reputation Vector is a portable, on-chain credential. It gates access to higher-tier directives and governance weight.",
  },
  {
    icon: Users,
    title: "Operator-Owned Network",
    description:
      "SIKE holders govern protocol parameters directly — treasury allocation, directive categories, and validator standards.",
  },
  {
    icon: Landmark,
    title: "Treasury-Backed Settlement",
    description:
      "Rewards are settled from a transparent, on-chain treasury funded by ecosystem partners who consume verified output.",
  },
];

export default function EcosystemPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pb-24 md:pb-16">
        <div className="border-b border-border bg-grid">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-16 md:px-8 md:py-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 lg:max-w-xl">
              <span className="font-mono text-[11px] tracking-[0.16em] text-purple-soft uppercase">
                // THE ECOSYSTEM
              </span>
              <h1 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                A Protocol Built on Verified Human Output
              </h1>
              <p className="text-pretty text-sm leading-relaxed text-text-secondary">
                SIKE is not a task marketplace — it is a settlement layer for cognitive
                and technical work. Every directive strengthens the network&apos;s
                collective reputation graph.
              </p>
              <CyberButton size="lg" icon={<ArrowRight />} className="mt-2 w-fit">
                Read the Protocol Spec
              </CyberButton>
            </div>
            <GuardianAvatar size="xl" active />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <HUDPanel key={pillar.title} className="h-full">
                  <div className="flex flex-col gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-purple/10 text-purple-soft [&_svg]:size-5">
                      <Icon />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {pillar.description}
                    </p>
                  </div>
                </HUDPanel>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
