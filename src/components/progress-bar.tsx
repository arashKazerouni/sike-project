"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  accent?: "cyan" | "purple";
  size?: "sm" | "md" | "lg";
  showSegments?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  accent = "cyan",
  size = "md",
  showSegments = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-surface-3",
        heightClass,
        className,
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "h-full",
          accent === "cyan"
            ? "bg-gradient-to-r from-cyan-dim to-cyan-strong"
            : "bg-gradient-to-r from-purple-dim to-purple-strong",
        )}
        style={{
          boxShadow:
            accent === "cyan"
              ? "0 0 10px rgba(34,211,238,0.5)"
              : "0 0 10px rgba(147,51,234,0.5)",
        }}
      />
      {showSegments ? (
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-background/60 last:border-r-0" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
