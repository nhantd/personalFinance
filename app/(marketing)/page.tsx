import { HeroSection } from "@/components/marketing/hero";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { MarketingJsonLd } from "@/components/marketing/json-ld";
import { PreFooterCta } from "@/components/marketing/pre-footer-cta";
import {
  AskSection,
  FeaturesSection,
  HowItWorksSection,
  PrivacySection,
} from "@/components/marketing/sections";
import { WealthSection } from "@/components/marketing/wealth-section";

export default function HomePage() {
  return (
    <>
      <MarketingJsonLd />
      <main>
        <HeroSection />
        <WealthSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PrivacySection />
        <AskSection />
        <FaqSection />
        <PreFooterCta />
      </main>
    </>
  );
}
