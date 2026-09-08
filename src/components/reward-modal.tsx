"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { GuardianAvatar } from "@/components/guardian-avatar";
import { CyberButton } from "@/components/cyber-button";

interface RewardModalProps {
  open: boolean;
  onClose: () => void;
  reward: number;
  directiveTitle: string;
  reputationFrom: number;
  reputationTo: number;
}

type Phase = "verifying" | "ignition" | "recognized";

const logLines = [
  "ESTABLISHING SECURE CHANNEL...",
  "HASHING CONTRIBUTION PAYLOAD...",
  "CROSS-REFERENCING VALIDATOR QUORUM...",
  "CONSENSUS REACHED // 7 OF 7 NODES",
  "WRITING TO IMPACT LEDGER...",
];

function Counter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(2));
  const [display, setDisplay] = useState("0.00");

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);

  return <>{display}</>;
}

export function RewardModal({
  open,
  onClose,
  reward,
  directiveTitle,
  reputationFrom,
  reputationTo,
}: RewardModalProps) {
  const [phase, setPhase] = useState<Phase>("verifying");
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!open) {
      setPhase("verifying");
      setVisibleLines(0);
      return;
    }

    const lineTimers = logLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 350 * (i + 1)),
    );
    const ignitionTimer = setTimeout(() => setPhase("ignition"), 350 * logLines.length + 400);
    const recognizedTimer = setTimeout(
      () => setPhase("recognized"),
      350 * logLines.length + 400 + 1100,
    );

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(ignitionTimer);
      clearTimeout(recognizedTimer);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={phase === "recognized" ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="clip-chamfer relative w-[min(92vw,440px)] border border-cyan/30 bg-surface p-8 text-center"
            style={{ boxShadow: "0 0 60px rgba(34,211,238,0.12)" }}
          >
            <AnimatePresence mode="wait">
              {phase === "verifying" ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <span className="font-mono text-xs tracking-[0.2em] text-cyan-strong uppercase">
                    VERIFYING COGNITIVE WORK
                  </span>
                  <div className="flex w-full flex-col gap-1.5 text-left">
                    {logLines.slice(0, visibleLines).map((line, i) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-mono text-[10px] tracking-wide text-text-secondary"
                      >
                        <span className="text-cyan-strong">{">"}</span> {line}
                      </motion.div>
                    ))}
                  </div>
                  <div className="h-1 w-full overflow-hidden bg-surface-3">
                    <motion.div
                      className="h-full bg-cyan-strong"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(visibleLines / logLines.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ) : phase === "ignition" ? (
                <motion.div
                  key="ignition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6 py-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                  >
                    <GuardianAvatar size="lg" active />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-display text-sm font-semibold tracking-[0.25em] text-cyan-strong uppercase text-glow-cyan"
                  >
                    IGNITION
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key="recognized"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-5"
                >
                  <GuardianAvatar size="md" active />
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-display text-4xl font-bold tracking-tight text-cyan-strong text-glow-cyan">
                      +<Counter value={reward} /> SIKE
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.16em] text-text-secondary uppercase">
                      Value recognized by the network
                    </span>
                  </div>

                  <div className="w-full border-t border-border pt-4">
                    <p className="mb-3 truncate font-mono text-[11px] text-text-muted">
                      {directiveTitle}
                    </p>
                    <div className="flex items-center justify-center gap-2 font-mono text-xs">
                      <span className="text-text-secondary">
                        Reputation {reputationFrom.toFixed(1)}%
                      </span>
                      <span className="text-cyan-strong">→</span>
                      <span className="font-semibold text-cyan-strong">
                        {reputationTo.toFixed(1)}%
                      </span>
                    </div>
                    <p className="mt-3 truncate font-mono text-[10px] text-text-muted">
                      HASH 0x{Math.random().toString(16).slice(2, 18)}
                    </p>
                  </div>

                  <CyberButton onClick={onClose} className="mt-1 w-full">
                    Continue
                  </CyberButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
