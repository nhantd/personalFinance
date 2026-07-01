import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { BankLogosStrip } from "@/components/marketing/bank-logos";
import { HeroMockCard } from "@/components/marketing/hero-mock-card";
import { BRAND, brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";

export function HeroSection() {
  const { hero } = MARKETING_COPY;

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden monae-hero-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge
              variant="secondary"
              className="mb-6 w-fit border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              {hero.eyebrow}
            </Badge>

            <h1 className="font-heading text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              {hero.headline}{" "}
              <span className={`italic ${brandClasses.highlight}`}>{hero.headlineAccent}</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subline}
            </p>

            <div className="mt-8">
              <ButtonLink size="lg" href="/signup" className={brandClasses.btnLaunch}>
                {BRAND.ctaSecondary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {hero.ctaHelper}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="w-full max-w-md animate-float lg:max-w-none">
              <HeroMockCard />
            </div>
          </div>
        </div>
      </div>

      <BankLogosStrip />
    </section>
  );
}
