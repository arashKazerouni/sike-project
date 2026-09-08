"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3 } from "lucide-react";
import { impactLedger } from "@/lib/data";
import { HUDPanel } from "@/components/hud-panel";
import { CyberButton } from "@/components/cyber-button";
import { cn } from "@/lib/utils";

export function LedgerPreview() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] tracking-[0.16em] text-cyan-strong uppercase">
              // LIVE IMPACT LEDGER
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Every Contribution, Permanently Verified
            </h2>
          </div>
          <CyberButton variant="ghost" size="sm">
            View Full Ledger
          </CyberButton>
        </div>

        <HUDPanel label="IMPACT_LEDGER.LOG" labelRight="LIVE FEED">
          <div className="flex flex-col divide-y divide-border">
            {impactLedger.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-7 shrink-0 items-center justify-center rounded-sm [&_svg]:size-3.5",
                      entry.status === "Verified"
                        ? "bg-cyan/10 text-cyan-strong"
                        : "bg-purple/10 text-purple-soft",
                    )}
                  >
                    {entry.status === "Verified" ? <CheckCircle2 /> : <Clock3 />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {entry.title}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.06em] text-text-muted uppercase">
                      {entry.category} · {entry.date}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-sm font-semibold text-cyan-strong">
                  +{entry.reward}
                </span>
              </motion.div>
            ))}
          </div>
        </HUDPanel>
      </div>
    </section>
  );
}
