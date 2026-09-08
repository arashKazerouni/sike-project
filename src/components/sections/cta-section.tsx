"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CyberButton } from "@/components/cyber-button";
import { GuardianAvatar } from "@/components/guardian-avatar";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 py-24 text-center md:px-8 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GuardianAvatar size="lg" active />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
        >
          Your Reputation Is Your Equity.
          <br />
          <span className="text-cyan-strong text-glow-cyan">Start Building It Now.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="max-w-lg text-pretty text-base leading-relaxed text-text-secondary"
        >
          Connect your identity, select your first directive, and join 48,000+ operators
          converting verified skill into network ownership.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.26 }}
        >
          <CyberButton size="lg" icon={<ArrowRight />}>
            Initialize Protocol
          </CyberButton>
        </motion.div>
      </div>
    </section>
  );
}
