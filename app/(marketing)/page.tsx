import { HeroSection } from "@/components/marketing/hero";
import { PreFooterCta } from "@/components/marketing/pre-footer-cta";
import {
  AskSection,
  FeaturesSection,
  HowItWorksSection,
  PrivacySection,
} from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PrivacySection />
      <AskSection />
      <PreFooterCta />
    </main>
  );
}
