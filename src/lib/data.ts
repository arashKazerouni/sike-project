import type { Directive, LedgerEntry, ReputationVector } from "@/lib/types";

export const directives: Directive[] = [
  {
    id: "AX-1092",
    skillVector: "Machine Learning QA",
    difficulty: "Advanced",
    title: "Structural Audit of LLM Output",
    impact: "Improves training quality for open-source AI models.",
    requirements: ["3+ completed QA directives", "Reputation ≥ 85%"],
    estimatedTime: "45 min",
    reward: 150,
    priority: "Elevated",
  },
  {
    id: "TN-2214",
    skillVector: "Linguistic Validation",
    difficulty: "Standard",
    title: "Cross-Dialect Translation Review",
    impact: "Validates translation accuracy for regional language models.",
    requirements: ["Fluency verification", "No prior flags"],
    estimatedTime: "30 min",
    reward: 80,
    priority: "Low",
  },
  {
    id: "SC-0587",
    skillVector: "Security Auditing",
    difficulty: "Apex",
    title: "Smart Contract Vulnerability Sweep",
    impact: "Hardens protocol-adjacent contracts before mainnet exposure.",
    requirements: ["Security Auditing: Apprentice+", "Reputation ≥ 92%"],
    estimatedTime: "2 hr",
    reward: 420,
    priority: "Critical",
  },
  {
    id: "CS-3301",
    skillVector: "Community Synthesis",
    difficulty: "Recon",
    title: "Governance Proposal Digest",
    impact: "Summarizes proposal sentiment for governance dashboard.",
    requirements: ["None"],
    estimatedTime: "15 min",
    reward: 35,
    priority: "Low",
  },
  {
    id: "DE-4471",
    skillVector: "Data Engineering",
    difficulty: "Advanced",
    title: "Superhuman Dataset Scrubbing",
    impact: "Removes corrupted samples ahead of next epoch training run.",
    requirements: ["Data Engineering: Journeyman+"],
    estimatedTime: "1.5 hr",
    reward: 210,
    priority: "Elevated",
  },
  {
    id: "GV-1188",
    skillVector: "Governance",
    difficulty: "Standard",
    title: "Delegate Voting Record Reconciliation",
    impact: "Reconciles delegate voting history for the epoch report.",
    requirements: ["Governance: Apprentice+"],
    estimatedTime: "40 min",
    reward: 95,
    priority: "Low",
  },
];

const missionVectors = ["Machine Learning QA", "Linguistic Validation", "Security Auditing", "Community Synthesis", "Data Engineering", "Governance"];
const missionTiers = ["Recon", "Standard", "Advanced", "Apex"] as const;
export const missionCatalog: Directive[] = Array.from({ length: 240 }, (_, index) => {
  const base = directives[index % directives.length];
  return {
    ...base,
    id: `SIKE-${String(index + 1).padStart(4, "0")}`,
    skillVector: missionVectors[index % missionVectors.length],
    difficulty: missionTiers[index % missionTiers.length],
    title: `${base.title} // Node ${String(index + 1).padStart(3, "0")}`,
    reward: 25 + ((index * 37) % 480),
    priority: index % 5 === 0 ? "Critical" : base.priority,
  };
});

export const reputationVectors: ReputationVector[] = [
  { skill: "Data Engineering", value: 92 },
  { skill: "Linguistic Validation", value: 78 },
  { skill: "Security Auditing", value: 65 },
  { skill: "Community Synthesis", value: 88 },
  { skill: "Governance", value: 71 },
];

export const settlements: LedgerEntry[] = [
  {
    id: "LDG-9911",
    label: "Node Validation",
    category: "Security Auditing",
    reward: 45,
    timestamp: "6 min ago",
  },
  {
    id: "LDG-9910",
    label: "QA Audit",
    category: "Machine Learning QA",
    reward: 120,
    timestamp: "1 hr ago",
  },
  {
    id: "LDG-9908",
    label: "Translation Core",
    category: "Linguistic Validation",
    reward: 80,
    timestamp: "3 hr ago",
  },
  {
    id: "LDG-9903",
    label: "Governance Digest",
    category: "Governance",
    reward: 35,
    timestamp: "yesterday",
  },
];

export const tickerFeed = [
  "USER 0x4F9 REVIEWED DATASET // +25 SIKE",
  "SECURITY NODE #881 COMPLETED VALIDATION",
  "TOTAL ECOSYSTEM VALUE GENERATED: $14,291,000",
  "USER 0x7C2 CLEARED APEX DIRECTIVE // +420 SIKE",
  "GOVERNANCE QUORUM REACHED // EPOCH 04 PROPOSAL #12",
  "USER 0x1A8 VALIDATED TRANSLATION CORE // +80 SIKE",
  "NETWORK REPUTATION AVERAGE: 94.2%",
  "USER 0x9E3 COMPLETED SECURITY SWEEP // +150 SIKE",
];

export const impactLedger = [
  {
    id: "IL-01",
    title: "Structural Audit of LLM Output",
    category: "Machine Learning QA",
    reward: 150,
    date: "Epoch 04 · Day 18",
    status: "Verified" as const,
  },
  {
    id: "IL-02",
    title: "Smart Contract Vulnerability Sweep",
    category: "Security Auditing",
    reward: 420,
    date: "Epoch 04 · Day 16",
    status: "Verified" as const,
  },
  {
    id: "IL-03",
    title: "Cross-Dialect Translation Review",
    category: "Linguistic Validation",
    reward: 80,
    date: "Epoch 04 · Day 14",
    status: "Verified" as const,
  },
  {
    id: "IL-04",
    title: "Governance Proposal Digest",
    category: "Community Synthesis",
    reward: 35,
    date: "Epoch 04 · Day 11",
    status: "Verified" as const,
  },
  {
    id: "IL-05",
    title: "Superhuman Dataset Scrubbing",
    category: "Data Engineering",
    reward: 210,
    date: "Epoch 04 · Day 09",
    status: "Pending" as const,
  },
];
