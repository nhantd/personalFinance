import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { brandClasses, BRAND } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { cn } from "@/lib/utils";

export function PreFooterCta() {
  const { preFooter } = MARKETING_COPY;

  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll>
          <div className="overflow-hidden rounded-xl border-2 border-foreground/10 bg-card shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="grid lg:grid-cols-[1.65fr_1fr]">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <h2 className="font-heading text-3xl font-light leading-snug text-foreground sm:text-4xl">
                  {preFooter.headline}{" "}
                  <em className={`not-italic italic ${brandClasses.highlight}`}>
                    {preFooter.headlineAccent}
                  </em>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {preFooter.subline}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ButtonLink
                    size="lg"
                    href="/signup"
                    className={brandClasses.btnLaunch}
                  >
                    {BRAND.ctaSecondary}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonLink>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {preFooter.ctaHelper}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center border-t border-dashed border-border px-8 py-8 lg:border-t-0 lg:border-l lg:px-10">
                {preFooter.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-b border-border/60 py-4 last:border-0"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-xl font-bold",
                        "highlight" in stat && stat.highlight
                          ? "text-highlight-warm"
                          : "text-foreground",
                      )}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
