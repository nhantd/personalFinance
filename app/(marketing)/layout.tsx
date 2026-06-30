import { MarketingFooter, MarketingHeader } from "@/components/marketing/header-footer";
import { HeroSection } from "@/components/marketing/hero";
import {
  CtaSection,
  FeaturesSection,
  HowItWorksSection,
  PrivacySection,
  SupportedBanksSection,
} from "@/components/marketing/sections";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </>
  );
}
