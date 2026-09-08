"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTrend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  accent?: "cyan" | "purple";
  className?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  deltaTrend = "neutral",
  icon,
  accent = "cyan",
  className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "clip-chamfer group relative border border-border bg-surface/80 p-4 transition-colors duration-200",
        accent === "cyan" ? "hover:border-cyan/40" : "hover:border-purple/40",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-text-muted uppercase">
          {label}
        </span>
        {icon ? (
          <span
            className={cn(
              "inline-flex size-7 shrink-0 items-center justify-center rounded-sm [&_svg]:size-3.5",
              accent === "cyan"
                ? "bg-cyan/10 text-cyan-strong"
                : "bg-purple/10 text-purple-soft",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "font-mono text-xs font-medium",
              deltaTrend === "up" && "text-cyan-strong",
              deltaTrend === "down" && "text-destructive",
              deltaTrend === "neutral" && "text-text-muted",
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
          accent === "cyan" ? "bg-cyan-strong" : "bg-purple-soft",
        )}
      />
    </motion.div>
  );
}
