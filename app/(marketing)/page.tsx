import { HeroSection } from "@/components/marketing/hero";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { MarketingPageJsonLd } from "@/components/marketing/json-ld";
import { PreFooterCta } from "@/components/marketing/pre-footer-cta";
import {
  AskSection,
  FeaturesSection,
  HowItWorksSection,
  PrivacySection,
} from "@/components/marketing/sections";
import { WealthSection } from "@/components/marketing/wealth-section";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata = createPageMetadata({
  title: MARKETING_COPY.metadata.title,
  description: MARKETING_COPY.metadata.description,
  path: "/",
  keywords: MARKETING_COPY.metadata.keywords,
});

export default function HomePage() {
  return (
    <>
      <MarketingPageJsonLd />
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
