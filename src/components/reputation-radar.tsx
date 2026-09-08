"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ReputationVector } from "@/lib/types";

interface ReputationRadarProps {
  data: ReputationVector[];
}

export function ReputationRadar({ data }: ReputationRadarProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(148,163,184,0.16)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: "#94a3b8",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
            }}
          />
          <Radar
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={1.5}
            fill="#22d3ee"
            fillOpacity={0.16}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
