"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrencyPlain } from "@/lib/finance/aggregates";
import { brandClasses } from "@/lib/brand";
import { SYSTEM_CATEGORIES, type Currency, type Transaction } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
  initialTransactions: Transaction[];
  currency: Currency;
}

export function TransactionsTable({ initialTransactions, currency }: TransactionsTableProps) {
  const [transactions, setTransactions] = useState(initialTransactions);

  async function updateCategory(transactionId: string, category: string) {
    const res = await fetch("/api/transactions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, category }),
    });

    if (!res.ok) {
      toast.error("Failed to update category");
      return;
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, category } : t))
    );
    toast.success("Category updated");
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No transactions yet.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs">{tx.date}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>
                  <Select
                    value={tx.category}
                    onValueChange={(v) => v && updateCategory(tx.id, v)}
                  >
                    <SelectTrigger className="h-8 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SYSTEM_CATEGORIES.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono",
                    tx.is_income ? brandClasses.income : ""
                  )}
                >
                  {tx.is_income ? "+" : "−"}
                  {formatCurrencyPlain(Math.abs(Number(tx.amount)), currency)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
