import { HUDPanel } from "@/components/hud-panel";
import { ProgressBar } from "@/components/progress-bar";
import { reputationVectors } from "@/lib/data";

export function SkillBreakdown() {
  return (
    <HUDPanel label="SKILL_VECTOR_BREAKDOWN" labelRight="6 TRACKED">
      <div className="flex flex-col gap-5">
        {reputationVectors.map((vector) => (
          <div key={vector.skill} className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.06em] uppercase">
              <span className="text-text-secondary">{vector.skill}</span>
              <span className="text-cyan-strong">{vector.value}%</span>
            </div>
            <ProgressBar value={vector.value} accent="cyan" size="sm" />
          </div>
        ))}
      </div>
    </HUDPanel>
  );
}
