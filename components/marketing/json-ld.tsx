import { BRAND } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://monae.app";
}

export function MarketingJsonLd() {
  const appUrl = getAppUrl();
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
    url: appUrl,
    featureList: [
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
