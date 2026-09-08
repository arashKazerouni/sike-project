"use client";

import { motion } from "framer-motion";
import { Cpu, Languages, ShieldHalf, Users, Database, Landmark } from "lucide-react";

const vectors = [
  { icon: Cpu, label: "Machine Learning QA", tasks: "412 open" },
  { icon: Languages, label: "Linguistic Validation", tasks: "289 open" },
  { icon: ShieldHalf, label: "Security Auditing", tasks: "97 open" },
  { icon: Users, label: "Community Synthesis", tasks: "156 open" },
  { icon: Database, label: "Data Engineering", tasks: "203 open" },
  { icon: Landmark, label: "Governance", tasks: "64 open" },
];

export function SkillVectors() {
  return (
    <section className="border-b border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="mb-14 flex flex-col gap-3">
          <span className="font-mono text-[11px] tracking-[0.16em] text-purple-soft uppercase">
            // SKILL VECTORS
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Six Domains of Verified Contribution
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
          {vectors.map((vector, i) => {
            const Icon = vector.icon;
            return (
              <motion.div
                key={vector.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-surface-2"
              >
                <Icon className="size-5 text-text-secondary transition-colors group-hover:text-cyan-strong" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">
                    {vector.label}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-text-muted uppercase">
                    {vector.tasks}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
