import { HUDPanel } from "@/components/hud-panel";

interface SettlementEntry {
  id: string;
  label: string;
  category: string;
  reward: number;
  timestamp: string;
}

interface SettlementFeedProps {
  entries: SettlementEntry[];
}

export function SettlementFeed({ entries }: SettlementFeedProps) {
  return (
    <HUDPanel label="SETTLEMENT_FEED.LOG" labelRight="YOUR ACTIVITY">
      <div className="flex flex-col divide-y divide-border">
        {entries.length ? (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-foreground">{entry.label}</span>
                <span className="font-mono text-[10px] tracking-[0.06em] text-text-muted uppercase">
                  {entry.category} · {entry.timestamp}
                </span>
              </div>
              <span className="shrink-0 font-mono text-sm font-semibold text-cyan-strong">
                {entry.reward >= 0 ? "+" : ""}{entry.reward}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center font-mono text-xs tracking-[0.08em] text-text-muted uppercase">
            No settlement activity yet
          </div>
        )}
      </div>
    </HUDPanel>
  );
}
