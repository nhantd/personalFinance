import { BRAND } from "@/lib/brand";
import { LEGAL_ENTITY } from "@/lib/legal/entity";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { getSiteUrl } from "@/lib/seo/site";

export function MarketingSiteJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    legalName: LEGAL_ENTITY.legalName,
    url: siteUrl,
    email: LEGAL_ENTITY.email,
    description: MARKETING_COPY.metadata.description,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: siteUrl,
    description: MARKETING_COPY.metadata.description,
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      legalName: LEGAL_ENTITY.legalName,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export function MarketingPageJsonLd() {
  const siteUrl = getSiteUrl();
  const { metadata, faq } = MARKETING_COPY;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND.name,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free while in beta",
    },
    description: metadata.description,
    url: siteUrl,
    featureList: [
      "AI personal finance advisor (insights, not advice)",
      "Net worth tracking",
      "Liability tracking",
      "Investment and property tracking",
      "Bank statement upload (CSV and PDF)",
      "AI-powered spending categorization",
      "Plain-language financial Q&A",
      "No bank credentials required",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
