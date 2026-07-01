import { MarketingSiteJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/header-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingSiteJsonLd />
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </>
  );
}
