import type { Directive } from "@/lib/types";

export type VerificationDecision = "approved" | "rejected";

export function verifyMissionProof(directive: Directive, proof: string): VerificationDecision {
  const normalized = proof.trim();
  if (normalized.length < 20) return "rejected";

  // The first MVP only performs deterministic quality gates. Human/admin review
  // remains the authoritative check for whether the claimed work is actually valid.
  const hasStructuredEvidence = /https?:\/\/|\bresult\b|\bevidence\b|\bcompleted\b/i.test(normalized);
  const hasTaskContext = normalized.toLowerCase().includes(directive.skillVector.toLowerCase().split(" ")[0]);

  return hasStructuredEvidence && hasTaskContext ? "approved" : "rejected";
}
