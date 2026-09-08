"use client";

import { motion } from "framer-motion";
import { GuardianAvatar } from "@/components/guardian-avatar";

const telemetryStats = [
  { label: "NODES ONLINE", value: "4,812" },
  { label: "EPOCH", value: "04" },
  { label: "VALIDATION RATE", value: "99.2%" },
];

export function GuardianHero() {
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
      {/* rotating rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full border border-dashed border-purple/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-12 rounded-full border border-cyan/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      {/* neural lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" aria-hidden="true">
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x2 = 200 + Math.cos(angle) * 170;
          const y2 = 200 + Math.sin(angle) * 170;
          return (
            <motion.line
              key={i}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="#22d3ee"
              strokeWidth="0.5"
              strokeOpacity="0.18"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.15 }}
            />
          );
        })}
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <GuardianAvatar size="xl" active />
        </motion.div>
      </div>

      {/* telemetry readouts */}
      <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-4 sm:gap-6">
        {telemetryStats.map((stat) => (
          <div
            key={stat.label}
            className="clip-chamfer-sm border border-border bg-surface/90 px-3 py-2 text-center backdrop-blur-sm"
          >
            <div className="font-mono text-sm font-semibold text-cyan-strong">
              {stat.value}
            </div>
            <div className="font-mono text-[8px] tracking-[0.1em] text-text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
