"use client";

import { useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Clock, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Directive } from "@/lib/types";
import { CyberButton } from "@/components/cyber-button";

const difficultyColor: Record<Directive["difficulty"], string> = {
  Recon: "text-text-secondary border-border",
  Standard: "text-cyan-soft border-cyan/30",
  Advanced: "text-cyan-strong border-cyan/50",
  Apex: "text-purple-soft border-purple/50",
};

const priorityColor: Record<Directive["priority"], string> = {
  Low: "bg-surface-3 text-text-secondary",
  Elevated: "bg-cyan/10 text-cyan-strong",
  Critical: "bg-purple/15 text-purple-soft",
};

interface TaskCardProps {
  directive: Directive;
}

export function TaskCard({ directive }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [likeState, setLikeState] = useState({ liked: false, count: 0 });

  async function handleLike() {
    const response = await fetch(`/api/missions/${directive.id}/like`, { method: "POST" });
    if (response.ok) setLikeState(await response.json());
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="clip-chamfer group relative flex flex-col gap-4 overflow-hidden border border-border bg-surface/80 p-5 transition-colors duration-200 hover:border-cyan/40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, rgba(34,211,238,0.08), transparent 70%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted">
            DIRECTIVE #{directive.id}
          </span>
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase",
              difficultyColor[directive.difficulty],
            )}
          >
            {directive.difficulty}
          </span>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-sm px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase",
            priorityColor[directive.priority],
          )}
        >
          {directive.priority}
        </span>
      </div>

      <div className="relative flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.12em] text-cyan-strong uppercase">
          {directive.skillVector}
        </span>
        <h3 className="font-display text-lg font-semibold leading-snug text-balance text-foreground">
          {directive.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          {directive.impact}
        </p>
      </div>

      <div className="relative flex flex-col gap-1.5 border-t border-border pt-3">
        {directive.requirements.map((req) => (
          <div key={req} className="flex items-center gap-2 text-xs text-text-muted">
            <span className="size-1 shrink-0 rounded-full bg-text-muted" />
            {req}
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-between border-t border-border pt-3.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Clock className="size-3.5" />
            <span className="font-mono text-xs">{directive.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-strong">
            <Zap className="size-3.5" />
            <span className="font-mono text-sm font-semibold">
              {directive.reward} SIKE
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <button type="button" onClick={handleLike} className="inline-flex h-8 items-center gap-1.5 border border-border px-2.5 font-mono text-xs text-text-secondary transition-colors hover:border-cyan/40 hover:text-cyan-strong" aria-label={`Like ${directive.title}`}>
          <Heart className={cn("size-3.5", likeState.liked && "fill-current text-cyan-strong")} />
          {likeState.count > 0 ? likeState.count : "Like"}
        </button>
        <CyberButton variant="ghost" size="sm" className="flex-1">
          Review Specs
        </CyberButton>
        <CyberButton variant="primary" size="sm" className="flex-1">
          Initialize
        </CyberButton>
      </div>
    </motion.div>
  );
}
