import { HeroSection } from "@/components/marketing/hero";
import {
  CtaSection,
  FeaturesSection,
  HowItWorksSection,
  PrivacySection,
  SupportedBanksSection,
} from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SupportedBanksSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PrivacySection />
      <CtaSection />
    </main>
  );
}
