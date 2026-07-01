import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const { faq } = MARKETING_COPY;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-border bg-muted/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={brandClasses.label}>{faq.label}</p>
        <h2 id="faq-heading" className={`mt-3 ${brandClasses.heading}`}>
          {faq.heading}
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{faq.subline}</p>

        <RevealOnScroll className="mt-10">
          <div className="divide-y divide-border rounded-xl border border-foreground/10 bg-card">
            {faq.items.map((item, index) => (
              <details key={item.question} className="group" open={index === 0}>
                <summary
                  className={cn(
                    "cursor-pointer list-none px-5 py-4 text-sm font-medium text-foreground",
                    "flex items-center justify-between gap-4",
                    "hover:bg-muted/40 [&::-webkit-details-marker]:hidden",
                  )}
                >
                  {item.question}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
