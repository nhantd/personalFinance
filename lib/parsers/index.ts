import { csvNeedsLlmFallback, parseCsvContent } from "@/lib/parsers/csv";
import { extractPdfText, pdfNeedsLlmFallback } from "@/lib/parsers/pdf";
import {
  categorizeTransactions,
  extractTransactionsFromText,
} from "@/lib/ai/categorize";
import type { ParsedTransaction } from "@/lib/types/database";

export interface ParseResult {
  transactions: ParsedTransaction[];
  periodStart?: string;
  periodEnd?: string;
}

export async function parseStatement(
  buffer: Buffer,
  fileType: "csv" | "pdf"
): Promise<ParseResult> {
  let transactions: ParsedTransaction[] = [];
  let periodStart: string | undefined;
  let periodEnd: string | undefined;

  if (fileType === "csv") {
    const content = buffer.toString("utf-8");
    transactions = parseCsvContent(content);

    if (csvNeedsLlmFallback(transactions)) {
      const extracted = await extractTransactionsFromText(content, "csv");
      transactions = extracted.transactions;
      periodStart = extracted.periodStart;
      periodEnd = extracted.periodEnd;
    }
  } else {
    const text = await extractPdfText(buffer);

    if (pdfNeedsLlmFallback(text)) {
      throw new Error("Could not extract text from PDF. Try a different export format.");
    }

    const extracted = await extractTransactionsFromText(text, "pdf");
    transactions = extracted.transactions;
    periodStart = extracted.periodStart;
    periodEnd = extracted.periodEnd;
  }

  if (transactions.length === 0) {
    throw new Error("No transactions found in the statement.");
  }

  const categorized = await categorizeTransactions(transactions);

  const dates = categorized.map((t) => t.date).sort();
  if (!periodStart && dates.length > 0) periodStart = dates[0];
  if (!periodEnd && dates.length > 0) periodEnd = dates[dates.length - 1];

  return { transactions: categorized, periodStart, periodEnd };
}
