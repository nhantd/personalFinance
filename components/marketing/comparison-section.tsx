import { Check } from "lucide-react";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { cn } from "@/lib/utils";

export function ComparisonSection() {
  const { comparison } = MARKETING_COPY;

  return (
    <section
      id="compare"
      aria-labelledby="compare-heading"
      className="border-b border-border py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={brandClasses.label}>{comparison.label}</p>
        <h2 id="compare-heading" className={`mt-3 ${brandClasses.heading}`}>
          {comparison.heading}
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{comparison.subline}</p>

        <RevealOnScroll className="mt-12">
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-foreground/10 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Feature
                  </th>
                  {comparison.columns.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest",
                        i === 0
                          ? "bg-accent/5 text-accent"
                          : "text-muted-foreground",
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, rowIndex) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-border/60 last:border-0",
                      rowIndex % 2 === 0 ? "bg-card" : "bg-muted/20",
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="border-l border-accent/20 bg-accent/5 px-4 py-3 font-medium text-foreground">
                      <span className="flex items-center gap-2">
                        {row.monae}
                        {"monaeWins" in row && row.monaeWins && (
                          <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.lumio}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.emma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="space-y-4 md:hidden">
            {comparison.columns.map((col, colIndex) => (
              <div
                key={col}
                className={cn(
                  "rounded-xl border p-4",
                  colIndex === 0
                    ? "border-accent/30 bg-accent/5"
                    : "border-foreground/10 bg-card",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-widest",
                    colIndex === 0 ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {col}
                </p>
                <dl className="mt-3 space-y-3">
                  {comparison.rows.map((row) => {
                    const value =
                      colIndex === 0
                        ? row.monae
                        : colIndex === 1
                          ? row.lumio
                          : row.emma;
                    return (
                      <div key={row.feature}>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {row.feature}
                        </dt>
                        <dd className="mt-0.5 flex items-center gap-2 text-sm font-medium text-foreground">
                          {value}
                          {colIndex === 0 &&
                            "monaeWins" in row &&
                            row.monaeWins && (
                              <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                            )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
