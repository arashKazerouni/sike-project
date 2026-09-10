"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Heart, Loader2, Send, Zap } from "lucide-react";
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

interface TaskCardProps { directive: Directive; }

type RunStatus = "initialized" | "in_progress" | "submitted" | "verified" | "rejected" | null;
type SubmissionStatus = "submitted" | "approved" | "rejected" | null;

export function TaskCard({ directive }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [runStatus, setRunStatus] = useState<RunStatus>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
  const [proof, setProof] = useState("");
  const [submitBusy, setSubmitBusy] = useState(false);
  const [initBusy, setInitBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/missions/${directive.id}/like`).then(async (response) => ({ response, data: await response.json().catch(() => null) })),
      fetch(`/api/missions/${directive.id}/initialize`).then(async (response) => ({ response, data: await response.json().catch(() => null) })),
    ]).then(([likeResult, runResult]) => {
      if (!active) return;
      if (likeResult.response.ok) {
        setLiked(Boolean(likeResult.data?.liked));
        setLikeCount(Number(likeResult.data?.count) || 0);
      }
      if (runResult.response.ok) {
        setRunStatus(runResult.data?.status ?? null);
        setSubmissionStatus(runResult.data?.submission?.status ?? null);
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [directive.id]);

  async function handleLike() {
    if (likeBusy) return;
    setLikeBusy(true); setError(null);
    try {
      const response = await fetch(`/api/missions/${directive.id}/like`, { method: "POST" });
      const data = await response.json().catch(() => null);
      if (response.status === 401) { setError("Connect your identity to interact with missions."); return; }
      if (!response.ok) throw new Error(data?.error || "Unable to update like.");
      setLiked(Boolean(data.liked)); setLikeCount(Number(data.count) || 0);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to update like."); }
    finally { setLikeBusy(false); }
  }

  async function handleInitialize() {
    if (initBusy || runStatus) return;
    setInitBusy(true); setError(null);
    try {
      const response = await fetch(`/api/missions/${directive.id}/initialize`, { method: "POST" });
      const data = await response.json().catch(() => null);
      if (response.status === 401) { setError("Connect your identity before initializing a mission."); return; }
      if (!response.ok) throw new Error(data?.error || "Unable to initialize mission.");
      setRunStatus(data.status ?? "initialized");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to initialize mission."); }
    finally { setInitBusy(false); }
  }

  async function handleSubmit() {
    if (submitBusy || !proof.trim()) return;
    setSubmitBusy(true); setError(null);
    try {
      const response = await fetch(`/api/missions/${directive.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proof }),
      });
      const data = await response.json().catch(() => null);
      if (response.status === 401) { setError("Connect your identity before submitting a mission."); return; }
      if (!response.ok) throw new Error(data?.error || "Unable to submit mission.");
      setRunStatus("submitted");
      setSubmissionStatus("submitted");
      setProof("");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to submit mission."); }
    finally { setSubmitBusy(false); }
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect(); if (!rect) return;
    setSpot({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }

  const closed = runStatus === "verified" || runStatus === "rejected";
  const awaitingReview = runStatus === "submitted" || submissionStatus === "submitted";

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }} transition={{ duration: 0.4, ease: "easeOut" }} className="clip-chamfer group relative flex flex-col gap-4 overflow-hidden border border-border bg-surface/80 p-5 transition-colors duration-200 hover:border-cyan/40">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, rgba(34,211,238,0.08), transparent 70%)` }} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5"><span className="font-mono text-[10px] tracking-[0.14em] text-text-muted">DIRECTIVE #{directive.id}</span><span className={cn("inline-flex w-fit items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase", difficultyColor[directive.difficulty])}>{directive.difficulty}</span></div>
        <span className={cn("shrink-0 rounded-sm px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase", priorityColor[directive.priority])}>{directive.priority}</span>
      </div>
      <div className="relative flex flex-col gap-2"><span className="font-mono text-[10px] tracking-[0.12em] text-cyan-strong uppercase">{directive.skillVector}</span><h3 className="font-display text-lg font-semibold leading-snug text-balance text-foreground">{directive.title}</h3><p className="text-sm leading-relaxed text-text-secondary">{directive.impact}</p></div>
      {reviewOpen ? <div className="relative border border-cyan/20 bg-surface-2/60 p-3.5"><span className="font-mono text-[10px] tracking-[0.12em] text-cyan-strong uppercase">Mission specifications</span><div className="mt-2 flex flex-col gap-1.5">{directive.requirements.map((req) => <div key={req} className="flex items-start gap-2 text-xs text-text-secondary"><span className="mt-1 size-1 shrink-0 rounded-full bg-cyan-strong" />{req}</div>)}</div><div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] text-text-muted"><span>EST. {directive.estimatedTime}</span><span>{directive.reward} SIKE SETTLEMENT</span></div></div> : <div className="relative flex flex-col gap-1.5 border-t border-border pt-3">{directive.requirements.map((req) => <div key={req} className="flex items-center gap-2 text-xs text-text-muted"><span className="size-1 shrink-0 rounded-full bg-text-muted" />{req}</div>)}</div>}
      <div className="relative flex items-center justify-between border-t border-border pt-3.5"><div className="flex items-center gap-4"><div className="flex items-center gap-1.5 text-text-secondary"><Clock className="size-3.5" /><span className="font-mono text-xs">{directive.estimatedTime}</span></div><div className="flex items-center gap-1.5 text-cyan-strong"><Zap className="size-3.5" /><span className="font-mono text-sm font-semibold">{directive.reward} SIKE</span></div></div></div>
      {runStatus === "initialized" || runStatus === "in_progress" ? <div className="relative flex flex-col gap-2 border border-cyan/20 bg-surface-2/50 p-3"><span className="font-mono text-[10px] tracking-[0.12em] text-cyan-strong uppercase">Submit work</span><textarea value={proof} onChange={(event) => setProof(event.target.value)} rows={4} maxLength={10000} placeholder="Describe the work completed and provide evidence, links, or results..." className="resize-none border border-border bg-surface px-3 py-2 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-cyan/40" /><CyberButton variant="primary" size="sm" onClick={handleSubmit} disabled={submitBusy || proof.trim().length < 20}>{submitBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}{submitBusy ? "Submitting..." : "Submit for Review"}</CyberButton></div> : null}
      {awaitingReview ? <div className="relative flex items-center gap-2 border border-cyan/20 bg-cyan/5 px-3 py-2 font-mono text-[11px] text-cyan-strong"><Loader2 className="size-3.5 animate-spin" />SUBMISSION RECEIVED · AWAITING REVIEW</div> : null}
      {runStatus === "verified" ? <div className="relative flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 font-mono text-[11px] text-emerald-300"><Check className="size-3.5" />MISSION VERIFIED · +{directive.reward} SIKE SETTLED</div> : null}
      {runStatus === "rejected" ? <div className="relative border border-red-400/20 bg-red-400/5 px-3 py-2 font-mono text-[11px] text-red-300">MISSION REJECTED · REVIEW THE REQUIREMENTS AND TRY A NEW ELIGIBLE DIRECTIVE</div> : null}
      {error ? <p className="relative text-[11px] text-red-400">{error}</p> : null}
      <div className="relative flex items-center gap-2"><button type="button" onClick={handleLike} disabled={likeBusy} className="inline-flex h-8 items-center gap-1.5 border border-border px-2.5 font-mono text-xs text-text-secondary transition-colors hover:border-cyan/40 hover:text-cyan-strong disabled:opacity-60" aria-label={`${liked ? "Unlike" : "Like"} ${directive.title}`}>{likeBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Heart className={cn("size-3.5", liked && "fill-current text-cyan-strong")} />}{likeCount > 0 ? likeCount : "Like"}</button><CyberButton variant="ghost" size="sm" className="flex-1" onClick={() => setReviewOpen((value) => !value)}>{reviewOpen ? "Hide Specs" : "Review Specs"}</CyberButton><CyberButton variant="primary" size="sm" className="flex-1" onClick={handleInitialize} disabled={initBusy || Boolean(runStatus)}>{initBusy ? <Loader2 className="size-3.5 animate-spin" /> : runStatus === "initialized" || runStatus === "in_progress" ? <Check className="size-3.5" /> : null}{initBusy ? "Initializing..." : runStatus ? (closed ? "Closed" : "Initialized") : "Initialize"}</CyberButton></div>
    </motion.div>
  );
}
