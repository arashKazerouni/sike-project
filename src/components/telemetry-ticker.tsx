import { tickerFeed } from "@/lib/data";

export function TelemetryTicker() {
  const items = [...tickerFeed, ...tickerFeed];

  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-surface/60 py-2.5">
      <div className="flex w-max animate-[ticker-scroll_45s_linear_infinite] gap-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 font-mono text-[11px] tracking-wide text-text-secondary whitespace-nowrap"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-cyan-strong shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            {item}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
