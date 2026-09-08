"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

const sizeClasses: Record<NonNullable<CyberButtonProps["size"]>, string> = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
};

export function CyberButton({
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "end",
  children,
  ...props
}: CyberButtonProps) {
  return (
    <button
      className={cn(
        "clip-chamfer-sm relative inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-wide transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
        sizeClasses[size],
        variant === "primary" &&
          "bg-cyan text-primary-foreground hover:bg-cyan-strong hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]",
        variant === "secondary" &&
          "border border-purple/40 bg-purple/10 text-foreground hover:border-purple-strong hover:bg-purple/20 hover:shadow-[0_0_24px_rgba(147,51,234,0.25)]",
        variant === "ghost" &&
          "border border-border bg-transparent text-text-secondary hover:border-cyan/40 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {icon && iconPosition === "start" ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {icon && iconPosition === "end" ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
