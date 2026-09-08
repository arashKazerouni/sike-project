export type DifficultyTier = "Recon" | "Standard" | "Advanced" | "Apex";

export interface Directive {
  id: string;
  skillVector: string;
  difficulty: DifficultyTier;
  title: string;
  impact: string;
  requirements: string[];
  estimatedTime: string;
  reward: number;
  priority: "Low" | "Elevated" | "Critical";
}

export interface ReputationVector {
  skill: string;
  value: number;
}

export interface LedgerEntry {
  id: string;
  label: string;
  category: string;
  reward: number;
  timestamp: string;
}
