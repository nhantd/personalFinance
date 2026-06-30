import type { Transaction } from "@/lib/types/database";
import {
  computeSummary,
  detectRecurring,
  filterTransactionsByPeriod,
  getPeriodFilters,
} from "@/lib/finance/aggregates";

export function buildChatContext(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return "The user has not uploaded any transactions yet.";
  }

  const periods = getPeriodFilters();
  const thisMonth = filterTransactionsByPeriod(
    transactions,
    periods[0].start,
    periods[0].end
  );
  const lastMonth = filterTransactionsByPeriod(
    transactions,
    periods[1].start,
    periods[1].end
  );
  const allTime = computeSummary(transactions);
  const thisMonthSummary = computeSummary(thisMonth);
  const lastMonthSummary = computeSummary(lastMonth);
  const recurring = detectRecurring(transactions);

  const sampleTransactions = transactions
    .slice(0, 15)
    .map(
      (t) =>
        `${t.date} | ${t.description} | ${t.is_income ? "+" : "-"}${Math.abs(Number(t.amount))} ${t.currency} | ${t.category}`
    )
    .join("\n");

  return `FINANCIAL DATA SUMMARY (computed from ${transactions.length} transactions)

ALL TIME:
- Total income: ${allTime.totalIncome.toFixed(2)}
- Total outflows: ${allTime.totalOutflows.toFixed(2)}
- Surplus/deficit: ${allTime.surplus.toFixed(2)}
- Top categories: ${allTime.byCategory.slice(0, 5).map((c) => `${c.category} (${c.amount.toFixed(2)})`).join(", ")}

THIS MONTH:
- Income: ${thisMonthSummary.totalIncome.toFixed(2)}
- Outflows: ${thisMonthSummary.totalOutflows.toFixed(2)}
- Surplus: ${thisMonthSummary.surplus.toFixed(2)}

LAST MONTH:
- Income: ${lastMonthSummary.totalIncome.toFixed(2)}
- Outflows: ${lastMonthSummary.totalOutflows.toFixed(2)}
- Surplus: ${lastMonthSummary.surplus.toFixed(2)}

RECURRING CHARGES (detected): ${recurring.join(", ") || "None detected"}

SAMPLE TRANSACTIONS:
${sampleTransactions}

Answer questions using only this data. Cite specific figures. Do not give generic financial advice. If data is insufficient, say so.`;
}

export const CHAT_SYSTEM_PROMPT = `You are a personal finance assistant for a privacy-first app. Users upload bank statements — you never see bank credentials.

Rules:
- Answer ONLY from the provided financial summary and transaction data
- Always cite specific numbers from the data
- Be direct and honest, even when the news isn't good
- Do NOT provide generic financial advice or recommend specific products
- If asked something outside the data, explain what data would be needed
- Keep answers concise and actionable`;
