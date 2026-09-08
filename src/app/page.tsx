import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsBar } from "@/components/sections/stats-bar";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SkillVectors } from "@/components/sections/skill-vectors";
import { LedgerPreview } from "@/components/sections/ledger-preview";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <SkillVectors />
        <LedgerPreview />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
