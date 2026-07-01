import { brandClasses } from "@/lib/brand";
import { SYSTEM_CATEGORIES } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const CATEGORY_TAG: Record<string, string> = {
  income: brandClasses.tagGoal,
  "rent-housing": brandClasses.tagLoan,
  groceries: "bg-soft/25 text-success",
  transport: "bg-tag-subscription-bg text-tag-subscription",
  subscriptions: brandClasses.tagSubscription,
  dining: "bg-highlight-warm-bg text-highlight-warm",
  shopping: "bg-chart-tan/30 text-foreground",
  utilities: "bg-secondary text-accent",
  transfer: brandClasses.tagDefault,
  loan: brandClasses.tagLoan,
  other: brandClasses.tagDefault,
};

export function getCategoryTagClass(slug: string): string {
  return CATEGORY_TAG[slug] ?? brandClasses.tagDefault;
}

export function CategoryPill({ slug }: { slug: string }) {
  const label = SYSTEM_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-sans font-medium",
        getCategoryTagClass(slug)
      )}
    >
      {label}
    </span>
  );
}
