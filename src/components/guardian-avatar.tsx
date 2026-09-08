"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GuardianAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  active?: boolean;
  className?: string;
}

const sizeMap: Record<NonNullable<GuardianAvatarProps["size"]>, number> = {
  sm: 40,
  md: 56,
  lg: 96,
  xl: 160,
};

export function GuardianAvatar({
  size = "md",
  active = true,
  className,
}: GuardianAvatarProps) {
  const px = sizeMap[size];

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="guardianField" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="guardianMask" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e162f" />
            <stop offset="100%" stopColor="#0d0914" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="url(#guardianField)" />

        {/* outer ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#7c3aed"
          strokeOpacity="0.35"
          strokeWidth="0.75"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.25"
          strokeWidth="0.5"
          strokeDasharray="1 3"
        />

        {/* mask silhouette - angular, faceted */}
        <path
          d="M50 14 L74 28 L78 50 L74 68 L50 90 L26 68 L22 50 L26 28 Z"
          fill="url(#guardianMask)"
          stroke="#22d3ee"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        />
        <path
          d="M50 14 L74 28 L78 50 L74 68 L50 90"
          fill="none"
          stroke="#9333ea"
          strokeOpacity="0.4"
          strokeWidth="0.5"
        />

        {/* faceplate lines */}
        <path
          d="M38 40 L50 46 L62 40"
          fill="none"
          stroke="#67e8f9"
          strokeOpacity="0.3"
          strokeWidth="0.5"
        />
        <path
          d="M50 46 L50 66"
          fill="none"
          stroke="#67e8f9"
          strokeOpacity="0.2"
          strokeWidth="0.5"
        />

        {/* eyes */}
        <motion.ellipse
          cx="40"
          cy="48"
          rx="4.2"
          ry="2.4"
          fill="#22d3ee"
          animate={
            active
              ? { opacity: [0.6, 1, 0.6] }
              : { opacity: 0.5 }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }}
        />
        <motion.ellipse
          cx="60"
          cy="48"
          rx="4.2"
          ry="2.4"
          fill="#22d3ee"
          animate={
            active
              ? { opacity: [0.6, 1, 0.6] }
              : { opacity: 0.5 }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }}
        />
      </svg>
    </div>
  );
}
