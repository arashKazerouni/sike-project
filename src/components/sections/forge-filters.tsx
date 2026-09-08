"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DifficultyTier } from "@/lib/types";

const tiers: (DifficultyTier | "All")[] = ["All", "Recon", "Standard", "Advanced", "Apex"];

interface ForgeFiltersProps {
  active: DifficultyTier | "All";
  onChange: (tier: DifficultyTier | "All") => void;
}

export function ForgeFilters({ active, onChange }: ForgeFiltersProps) {
  const [_active, setActive] = useState(active);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tiers.map((tier) => (
        <button
          key={tier}
          onClick={() => {
            setActive(tier);
            onChange(tier);
          }}
          className={cn(
            "clip-chamfer-sm border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
            active === tier
              ? "border-cyan/50 bg-cyan/10 text-cyan-strong"
              : "border-border bg-transparent text-text-muted hover:border-cyan/30 hover:text-text-secondary",
          )}
        >
          {tier}
        </button>
      ))}
    </div>
  );
}
