import Link from "next/link";

const columns = [
  {
    title: "Protocol",
    links: [
      { label: "Mission Forge", href: "/forge" },
      { label: "Network Proof", href: "/dashboard" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Governance", href: "/docs" },
      { label: "Validator Nodes", href: "/docs" },
      { label: "Impact Ledger", href: "/dashboard" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "About SIKE", href: "/ecosystem" },
      { label: "Skill Vectors", href: "/forge" },
      { label: "Profile", href: "/profile" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="size-6 text-cyan-strong" aria-hidden="true">
                <path
                  d="M12 2 L21 6.5 L21 17.5 L12 22 L3 17.5 L3 6.5 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.9" />
              </svg>
              <span className="font-display text-base font-bold tracking-[0.08em] text-foreground">
                SIKE
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
              Protocol of Verified Action. Cognitive and technical output, settled as
              network equity.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
                {col.title}
              </span>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-cyan-strong"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <span className="font-mono text-[10px] tracking-[0.08em] text-text-muted uppercase">
            © 2025 SIKE PROTOCOL // ALL NODES OPERATIONAL
          </span>
          <span className="font-mono text-[10px] tracking-[0.08em] text-text-muted uppercase">
            EPOCH 04 · BLOCK 1,204,881
          </span>
        </div>
      </div>
    </footer>
  );
}
