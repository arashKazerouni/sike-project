"use client";

import { motion } from "framer-motion";
import { ScanSearch, ShieldCheck, Coins } from "lucide-react";
import { HUDPanel } from "@/components/hud-panel";

const steps = [
  {
    icon: ScanSearch,
    title: "Accept a Directive",
    description:
      "Browse the Mission Forge and select high-impact tasks matched to your verified skill vectors — from ML QA to security audits.",
  },
  {
    icon: ShieldCheck,
    title: "Execute & Submit Proof",
    description:
      "Complete the directive and submit your work for network verification. A validator quorum cross-references your output for integrity.",
  },
  {
    icon: Coins,
    title: "Value Is Recognized",
    description:
      "Once consensus is reached, SIKE is settled instantly to your ledger and your Reputation Vector strengthens across the skill tree.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="mb-14 flex flex-col gap-3">
          <span className="font-mono text-[11px] tracking-[0.16em] text-cyan-strong uppercase">
            // PROTOCOL FLOW
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            From Directive to Verified Equity
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <HUDPanel
                  label={`STAGE ${String(i + 1).padStart(2, "0")}`}
                  className="h-full"
                >
                  <div className="flex flex-col gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-cyan/10 text-cyan-strong [&_svg]:size-5">
                      <Icon />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </HUDPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
