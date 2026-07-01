import { MockNetWorthChart } from "@/components/marketing/mocks/mock-net-worth-chart";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";

export function WealthSection() {
  const { wealth } = MARKETING_COPY;

  return (
    <section
      id="wealth"
      aria-labelledby="wealth-heading"
      className="border-b border-border bg-muted/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={brandClasses.label}>{wealth.label}</p>
        <h2 id="wealth-heading" className={`mt-3 ${brandClasses.heading}`}>
          {wealth.heading}
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{wealth.subline}</p>

        <RevealOnScroll className="mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {wealth.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-xl border border-foreground/10 bg-card px-4 py-4 shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {pillar.title}
                </p>
                <p className="mt-2 font-sans text-xl font-semibold tabular-nums tracking-normal text-foreground sm:text-2xl">
                  {pillar.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120} className="mt-6">
          <MockNetWorthChart />
        </RevealOnScroll>
      </div>
    </section>
  );
}
