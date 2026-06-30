import { generateObject } from "ai";
import { z } from "zod";
import { claudeModel } from "@/lib/ai/model";
import type { ParsedTransaction } from "@/lib/types/database";
import { SYSTEM_CATEGORIES } from "@/lib/types/database";

const transactionSchema = z.object({
  transactions: z.array(
    z.object({
      date: z.string().describe("ISO date YYYY-MM-DD"),
      description: z.string(),
      amount: z.number().describe("Positive number; expenses as positive values"),
      is_income: z.boolean(),
    })
  ),
  period_start: z.string().optional(),
  period_end: z.string().optional(),
});

const categorizeSchema = z.object({
  transactions: z.array(
    z.object({
      index: z.number(),
      category: z.enum([
        "income",
        "rent-housing",
        "groceries",
        "transport",
        "subscriptions",
        "dining",
        "shopping",
        "utilities",
        "transfer",
        "loan",
        "other",
      ]),
    })
  ),
});

export async function extractTransactionsFromText(
  rawText: string,
  fileType: "csv" | "pdf"
): Promise<{ transactions: ParsedTransaction[]; periodStart?: string; periodEnd?: string }> {
  const { object } = await generateObject({
    model: claudeModel,
    schema: transactionSchema,
    prompt: `Extract all financial transactions from this bank statement ${fileType.toUpperCase()} content.
Rules:
- Return dates as YYYY-MM-DD
- amount should always be a positive number
- is_income=true for deposits, salary, refunds, credits
- is_income=false for debits, purchases, withdrawals
- Include all transactions found
- Infer statement period if visible

Content:
${rawText.slice(0, 50000)}`,
  });

  return {
    transactions: object.transactions,
    periodStart: object.period_start,
    periodEnd: object.period_end,
  };
}

export async function categorizeTransactions(
  transactions: ParsedTransaction[]
): Promise<ParsedTransaction[]> {
  if (transactions.length === 0) return transactions;

  const categoryList = SYSTEM_CATEGORIES.map((c) => c.slug).join(", ");

  const { object } = await generateObject({
    model: claudeModel,
    schema: categorizeSchema,
    prompt: `Categorize each transaction. Use only these categories: ${categoryList}.
Income transactions should use category "income".

Transactions:
${transactions
  .map(
    (t, i) =>
      `${i}: ${t.date} | ${t.description} | ${t.amount} | income=${t.is_income}`
  )
  .join("\n")}`,
  });

  const categoryMap = new Map(object.transactions.map((t) => [t.index, t.category]));

  return transactions.map((t, i) => ({
    ...t,
    category: t.is_income ? "income" : (categoryMap.get(i) ?? "other"),
  }));
}
