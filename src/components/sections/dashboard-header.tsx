"use client";

import { motion } from "framer-motion";
import { GuardianAvatar } from "@/components/guardian-avatar";

interface DashboardHeaderProps {
  displayName: string;
  userId: string;
  stellarAddress: string | null;
  verifiedTasks: number;
}

function shorten(value: string) {
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

export function DashboardHeader({ displayName, userId, stellarAddress, verifiedTasks }: DashboardHeaderProps) {
  return (
    <div className="clip-chamfer relative overflow-hidden border border-border bg-surface/80 p-6 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <GuardianAvatar size="lg" active />
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
              OPERATOR ID · {shorten(userId)}
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {displayName}
            </h1>
            <span className="font-mono text-xs tracking-[0.06em] text-cyan-strong uppercase">
              {stellarAddress ? `Stellar · ${shorten(stellarAddress)}` : "Stellar wallet not connected"}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full flex-col gap-2 sm:w-64"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.1em] text-text-muted uppercase">
            <span>Verified Tasks</span>
            <span className="text-cyan-strong">{verifiedTasks}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-background">
            <div className="h-full w-full bg-cyan-strong/60" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
