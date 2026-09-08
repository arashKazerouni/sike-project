"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hexagon,
  Radio,
  UserRound,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CyberButton } from "@/components/cyber-button";

const links = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/forge", label: "Missions" },
  { href: "/dashboard", label: "Network Proof" },
  { href: "/docs", label: "Documentation" },
];

const mobileLinks = [
  { href: "/forge", label: "Directives", icon: Hexagon },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ecosystem", label: "Ecosystem", icon: Radio },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="size-6 text-cyan-strong" aria-hidden="true">
              <path
                d="M12 2 L21 6.5 L21 17.5 L12 22 L3 17.5 L3 6.5 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path d="M12 2 L21 6.5 L21 17.5 L12 22" fill="none" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.9" />
            </svg>
            <span className="font-display text-base font-bold tracking-[0.08em] text-foreground">
              SIKE
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-[11px] tracking-[0.12em] text-text-secondary uppercase transition-colors hover:text-cyan-strong",
                  pathname === link.href && "text-cyan-strong",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <CyberButton size="sm">Connect Identity</CyberButton>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center rounded-sm border border-border p-2 text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {open ? (
          <div className="flex flex-col gap-1 border-t border-border bg-surface px-5 py-4 lg:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2.5 font-mono text-xs tracking-[0.1em] text-text-secondary uppercase hover:bg-surface-2 hover:text-cyan-strong"
              >
                {link.label}
              </Link>
            ))}
            <CyberButton size="sm" className="mt-2">
              Connect Identity
            </CyberButton>
          </div>
        ) : null}
      </header>

      {/* Mobile bottom dock */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 px-2 py-2 backdrop-blur-md md:hidden">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-sm px-2 py-1.5 transition-colors",
                isActive ? "text-cyan-strong" : "text-text-muted",
              )}
            >
              <Icon className="size-5" />
              <span className="font-mono text-[9px] tracking-[0.08em] uppercase">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
