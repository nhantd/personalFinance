import { brandClasses } from "@/lib/brand";
import type { TagType } from "@/lib/marketing/mock-data";
import { cn } from "@/lib/utils";

const TAG_CLASSES: Record<TagType, string> = {
  subscription: brandClasses.tagSubscription,
  goal: brandClasses.tagGoal,
  loan: brandClasses.tagLoan,
  default: brandClasses.tagDefault,
};

export function MockCategoryPill({ label, tagType }: { label: string; tagType: TagType }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-sans font-medium",
        TAG_CLASSES[tagType]
      )}
    >
      {label}
    </span>
  );
}
