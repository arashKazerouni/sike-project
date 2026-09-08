import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HUDPanelProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  labelRight?: ReactNode;
  glow?: "cyan" | "purple" | "none";
  children: ReactNode;
}

export function HUDPanel({
  className,
  label,
  labelRight,
  glow = "none",
  children,
  ...props
}: HUDPanelProps) {
  return (
    <div
      className={cn(
        "clip-chamfer relative border border-border bg-surface/80",
        glow === "cyan" && "shadow-[0_0_32px_rgba(6,182,212,0.06)]",
        glow === "purple" && "shadow-[0_0_32px_rgba(124,58,237,0.08)]",
        className,
      )}
      {...props}
    >
      {label ? (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-text-muted uppercase">
            {label}
          </span>
          {labelRight ? (
            <span className="font-mono text-[10px] tracking-[0.1em] text-text-muted">
              {labelRight}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}
