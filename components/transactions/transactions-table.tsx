"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrencyPlain } from "@/lib/finance/aggregates";
import { filterControlClass } from "@/components/ui/editorial-card";
import { brandClasses } from "@/lib/brand";
import { SYSTEM_CATEGORIES, type Currency, type Transaction } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
  initialTransactions: Transaction[];
  fallbackCurrency?: Currency;
}

export function TransactionsTable({
  initialTransactions,
  fallbackCurrency = "USD",
}: TransactionsTableProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);

  async function patchTransaction(
    transactionId: string,
    updates: Record<string, unknown>
  ) {
    const res = await fetch("/api/transactions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, ...updates }),
    });

    if (!res.ok) {
      toast.error("Failed to update transaction");
      return null;
    }

    const { transaction } = await res.json();
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? (transaction as Transaction) : t))
    );
    return transaction as Transaction;
  }

  async function deleteTransaction(transactionId: string) {
    const res = await fetch(`/api/transactions?id=${transactionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Failed to delete transaction");
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    toast.success("Transaction deleted");
    router.refresh();
  }

  const categoryItems = SYSTEM_CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));

  return (
    <div className={cn(brandClasses.mockCard, "overflow-hidden")}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-36">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-40">Category</TableHead>
            <TableHead className="w-28">Type</TableHead>
            <TableHead className="w-32 text-right">Amount</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No transactions match your filters.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <Input
                    type="date"
                    defaultValue={tx.date}
                    className={cn(filterControlClass, "h-9 font-mono text-xs")}
                    onBlur={(e) => {
                      if (e.target.value && e.target.value !== tx.date) {
                        patchTransaction(tx.id, { date: e.target.value });
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    defaultValue={tx.description}
                    className={cn(filterControlClass, "h-9 text-sm")}
                    onBlur={(e) => {
                      if (e.target.value.trim() && e.target.value !== tx.description) {
                        patchTransaction(tx.id, { description: e.target.value.trim() });
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={tx.category}
                    items={categoryItems}
                    onValueChange={(v) => v && patchTransaction(tx.id, { category: v })}
                  >
                    <SelectTrigger className={cn(filterControlClass, "h-9 w-full")}>
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
                <TableCell>
                  <Select
                    value={tx.is_income ? "income" : "expense"}
                    items={[
                      { value: "expense", label: "Expense" },
                      { value: "income", label: "Income" },
                    ]}
                    onValueChange={(v) =>
                      v &&
                      patchTransaction(tx.id, {
                        is_income: v === "income",
                        category: v === "income" ? "income" : tx.category,
                      })
                    }
                  >
                    <SelectTrigger className={cn(filterControlClass, "h-9 w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={Math.abs(Number(tx.amount))}
                    className={cn(
                      filterControlClass,
                      "h-9 w-full text-right font-mono text-sm",
                      tx.is_income ? brandClasses.income : ""
                    )}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!Number.isNaN(val) && val > 0 && val !== Math.abs(Number(tx.amount))) {
                        patchTransaction(tx.id, { amount: val });
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove &ldquo;{tx.description}&rdquo; from your
                          records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTransaction(tx.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
