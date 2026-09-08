import { ShieldCheck, Flame, Crown, Sparkles, Lock } from "lucide-react";
import { HUDPanel } from "@/components/hud-panel";
import { cn } from "@/lib/utils";

const achievements = [
  { icon: ShieldCheck, label: "First Directive", unlocked: true },
  { icon: Flame, label: "10-Day Streak", unlocked: true },
  { icon: Sparkles, label: "Apex Cleared", unlocked: true },
  { icon: Crown, label: "Top 1% Operator", unlocked: false },
];

export function AchievementGrid() {
  return (
    <HUDPanel label="ACHIEVEMENT_REGISTRY">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements.map((item) => {
          const Icon = item.unlocked ? item.icon : Lock;
          return (
            <div
              key={item.label}
              className={cn(
                "clip-chamfer-sm flex flex-col items-center gap-2 border p-4 text-center",
                item.unlocked
                  ? "border-cyan/30 bg-cyan/5"
                  : "border-border bg-surface-2/50 opacity-50",
              )}
            >
              <Icon
                className={cn(
                  "size-6",
                  item.unlocked ? "text-cyan-strong" : "text-text-muted",
                )}
              />
              <span className="font-mono text-[9px] tracking-[0.06em] text-text-secondary uppercase">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </HUDPanel>
  );
}
