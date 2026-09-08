"use client";

import { useMemo, useState } from "react";
import { ForgeFilters } from "@/components/sections/forge-filters";
import { TaskCard } from "@/components/task-card";
import { directives } from "@/lib/data";
import type { DifficultyTier } from "@/lib/types";

export function ForgeGrid() {
  const [tier, setTier] = useState<DifficultyTier | "All">("All");

  const filtered = useMemo(
    () => (tier === "All" ? directives : directives.filter((d) => d.difficulty === tier)),
    [tier],
  );

  return (
    <div className="flex flex-col gap-6">
      <ForgeFilters active={tier} onChange={setTier} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((directive) => (
          <TaskCard key={directive.id} directive={directive} />
        ))}
      </div>
    </div>
  );
}
