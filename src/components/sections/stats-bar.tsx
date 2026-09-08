import { TelemetryTicker } from "@/components/telemetry-ticker";

const stats = [
  { label: "TOTAL VALUE GENERATED", value: "$14.2M" },
  { label: "ACTIVE OPERATORS", value: "48,120" },
  { label: "DIRECTIVES CLEARED", value: "1,204,880" },
  { label: "AVG. VALIDATION TIME", value: "4.2 min" },
];

export function StatsBar() {
  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-x border-border bg-border md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 bg-background px-6 py-6"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {stat.value}
            </span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-text-muted uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
      <TelemetryTicker />
    </section>
  );
}
