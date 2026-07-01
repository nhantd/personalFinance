import type { Transaction } from "@/lib/types/database";
import {
  computeSummary,
  detectRecurring,
  filterTransactionsByPeriod,
  getPeriodFilters,
} from "@/lib/finance/aggregates";

export function buildChatInsights(transactions: Transaction[]): string[] {
  if (transactions.length === 0) {
    return ["Upload transactions to unlock personalized insights."];
  }

  const periods = getPeriodFilters();
  const thisMonth = filterTransactionsByPeriod(
    transactions,
    periods[0].start,
    periods[0].end
  );
  const thisMonthSummary = computeSummary(thisMonth);
  const allTime = computeSummary(transactions);
  const recurring = detectRecurring(transactions);

  const insights: string[] = [];

  const surplus = thisMonthSummary.surplus;
  if (surplus >= 0) {
    insights.push(
      `This month you're ${surplus === 0 ? "breaking even" : `ahead by ${surplus.toFixed(2)}`} after income and spending.`
    );
  } else {
    insights.push(
      `This month you're spending ${Math.abs(surplus).toFixed(2)} more than you earn.`
    );
  }

  const topCategory = allTime.byCategory[0];
  if (topCategory) {
    insights.push(
      `Your biggest expense category is ${topCategory.category} at ${topCategory.amount.toFixed(2)} all time.`
    );
  }

  if (recurring.length > 0) {
    insights.push(
      `We detected ${recurring.length} recurring charge${recurring.length === 1 ? "" : "s"} — ask about subscriptions or bills.`
    );
  } else {
    insights.push(
      `You have ${transactions.length} transactions on file — ask about any category or time period.`
    );
  }

  return insights.slice(0, 3);
}
