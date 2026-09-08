import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HUDPanel } from "@/components/hud-panel";

const sections = [
  {
    title: "01 · Protocol Overview",
    body: "SIKE converts verified cognitive and technical output into network-native equity (SIKE tokens). Contributions are matched to Skill Vectors, executed as Directives, and settled after validator quorum consensus.",
  },
  {
    title: "02 · Directives",
    body: "A Directive is a discrete unit of work posted to the Mission Forge. Each carries a Difficulty Tier (Recon, Standard, Advanced, Apex), a set of eligibility requirements, and a fixed SIKE reward.",
  },
  {
    title: "03 · Reputation Vectors",
    body: "Reputation is tracked per skill domain — Machine Learning QA, Linguistic Validation, Security Auditing, Community Synthesis, Data Engineering, and Governance. Vectors gate access to higher-tier directives.",
  },
  {
    title: "04 · Validator Quorum",
    body: "Submitted work is cross-referenced by a rotating set of validator nodes. Consensus (typically 5-of-7 or higher for Apex directives) is required before SIKE settlement occurs.",
  },
  {
    title: "05 · Settlement & Ledger",
    body: "Once consensus is reached, SIKE is settled instantly to the operator's ledger. All settlements are permanently recorded in the public Impact Ledger.",
  },
  {
    title: "06 · Governance",
    body: "SIKE holders vote on treasury allocation, new directive categories, and validator standards. Voting weight is a function of both SIKE balance and Reputation Vector strength.",
  },
];

export default function DocsPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pb-24 md:pb-16">
        <div className="border-b border-border bg-grid">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 py-14 md:px-8">
            <span className="font-mono text-[11px] tracking-[0.16em] text-cyan-strong uppercase">
              // DOCUMENTATION
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Protocol Specification
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-text-secondary">
              A technical reference for how SIKE verifies, settles, and governs
              network contribution.
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-5 px-5 py-12 md:px-8">
          {sections.map((section) => (
            <HUDPanel key={section.title} label={section.title}>
              <p className="text-sm leading-relaxed text-text-secondary">
                {section.body}
              </p>
            </HUDPanel>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
