"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Hexagon,
  Radio,
  UserRound,
  Menu,
  LogOut,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (active) setAuthenticated(Boolean(data.user));
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function logout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    setAuthenticated(false);
    setAccountOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

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

          <div className="relative hidden items-center gap-3 lg:flex" ref={accountRef}>
            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex h-8 items-center gap-2 border border-cyan/30 bg-cyan/5 px-3.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-cyan-strong uppercase transition-colors hover:border-cyan/60 hover:bg-cyan/10"
                >
                  <Trophy className="size-3.5" />
                  My Rewards
                </Link>
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  className="flex size-8 items-center justify-center rounded-sm border border-border bg-surface text-text-secondary transition-colors hover:border-cyan/40 hover:text-cyan-strong"
                  aria-label="Open account menu"
                  aria-expanded={accountOpen}
                >
                  <UserRound className="size-4" />
                </button>
                {accountOpen ? (
                  <div className="absolute right-0 top-11 w-44 border border-border bg-surface p-1.5 shadow-2xl">
                    <Link
                      href="/profile"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 font-mono text-[10px] tracking-[0.1em] text-text-secondary uppercase hover:bg-surface-2 hover:text-cyan-strong"
                    >
                      <UserRound className="size-3.5" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-3 py-2.5 font-mono text-[10px] tracking-[0.1em] text-text-secondary uppercase hover:bg-surface-2 hover:text-cyan-strong"
                    >
                      <LogOut className="size-3.5" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <Link href="/login">
                <CyberButton size="sm">Connect Identity</CyberButton>
              </Link>
            )}
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
            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-sm border border-cyan/30 bg-cyan/5 px-3 py-2.5 font-mono text-xs font-semibold tracking-[0.1em] text-cyan-strong uppercase"
                >
                  <Trophy className="size-4" />
                  My Rewards
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-sm px-3 py-2.5 font-mono text-xs tracking-[0.1em] text-text-secondary uppercase hover:bg-surface-2 hover:text-cyan-strong"
                >
                  <UserRound className="size-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 rounded-sm px-3 py-2.5 font-mono text-xs tracking-[0.1em] text-text-secondary uppercase hover:bg-surface-2 hover:text-cyan-strong"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="mt-2">
                <CyberButton size="sm" className="w-full">Connect Identity</CyberButton>
              </Link>
            )}
          </div>
        ) : null}
      </header>

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
