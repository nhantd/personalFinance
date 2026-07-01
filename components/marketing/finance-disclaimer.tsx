import { FINANCE_DISCLAIMER } from "@/lib/legal/entity";
import { cn } from "@/lib/utils";

interface FinanceDisclaimerProps {
  className?: string;
}

export function FinanceDisclaimer({ className }: FinanceDisclaimerProps) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {FINANCE_DISCLAIMER}
    </p>
  );
}
