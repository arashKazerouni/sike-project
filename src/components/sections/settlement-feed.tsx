import { settlements } from "@/lib/data";
import { HUDPanel } from "@/components/hud-panel";

export function SettlementFeed() {
  return (
    <HUDPanel label="SETTLEMENT_FEED.LOG" labelRight="REAL-TIME">
      <div className="flex flex-col divide-y divide-border">
        {settlements.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{entry.label}</span>
              <span className="font-mono text-[10px] tracking-[0.06em] text-text-muted uppercase">
                {entry.category} · {entry.timestamp}
              </span>
            </div>
            <span className="shrink-0 font-mono text-sm font-semibold text-cyan-strong">
              +{entry.reward}
            </span>
          </div>
        ))}
      </div>
    </HUDPanel>
  );
}
