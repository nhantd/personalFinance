import type { ParsedTransaction } from "@/lib/types/database";

function detectDelimiter(line: string): string {
  const counts = [
    { d: ",", c: (line.match(/,/g) ?? []).length },
    { d: ";", c: (line.match(/;/g) ?? []).length },
    { d: "\t", c: (line.match(/\t/g) ?? []).length },
  ];
  counts.sort((a, b) => b.c - a.c);
  return counts[0].c > 0 ? counts[0].d : ",";
}

function parseDate(value: string): string | null {
  const trimmed = value.trim();
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dmy) {
    const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const mdy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (mdy) {
    return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;
  }

  return null;
}

function parseAmount(value: string): number | null {
  const cleaned = value.replace(/[£$€,\s]/g, "").replace(/[()]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.abs(num);
}

export function parseCsvContent(content: string): ParsedTransaction[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const header = lines[0].toLowerCase().split(delimiter).map((h) => h.trim());

  const dateIdx = header.findIndex((h) =>
    /date|posted|transaction date|value date/.test(h)
  );
  const descIdx = header.findIndex((h) =>
    /description|memo|narrative|details|payee|merchant/.test(h)
  );
  const amountIdx = header.findIndex((h) =>
    /^amount$|transaction amount|debit|credit/.test(h)
  );
  const debitIdx = header.findIndex((h) => /debit|money out|withdrawal/.test(h));
  const creditIdx = header.findIndex((h) => /credit|money in|deposit/.test(h));

  if (dateIdx === -1 || descIdx === -1) return [];

  const transactions: ParsedTransaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ""));
    const date = parseDate(cols[dateIdx] ?? "");
    const description = cols[descIdx] ?? "";
    if (!date || !description) continue;

    let amount: number | null = null;
    let isIncome = false;

    if (amountIdx >= 0 && cols[amountIdx]) {
      const raw = cols[amountIdx];
      const numeric = parseFloat(raw.replace(/[£$€,\s]/g, "").replace(/[()]/g, ""));
      amount = parseAmount(raw);
      if (numeric > 0) {
        isIncome =
          !raw.includes("-") ||
          /payroll|salary|deposit|credit|refund|transfer from|interest/i.test(description);
      } else {
        isIncome = false;
        amount = Math.abs(numeric);
      }
    } else if (debitIdx >= 0 || creditIdx >= 0) {
      const debit = debitIdx >= 0 ? parseAmount(cols[debitIdx] ?? "") : null;
      const credit = creditIdx >= 0 ? parseAmount(cols[creditIdx] ?? "") : null;
      if (credit && credit > 0) {
        amount = credit;
        isIncome = true;
      } else if (debit && debit > 0) {
        amount = debit;
        isIncome = false;
      }
    }

    if (amount === null || amount === 0) continue;

    transactions.push({ date, description, amount, is_income: isIncome });
  }

  return transactions;
}

export function csvNeedsLlmFallback(transactions: ParsedTransaction[]): boolean {
  return transactions.length === 0;
}
