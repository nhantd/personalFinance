"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brandClasses } from "@/lib/brand";
import { filterControlClass } from "@/components/ui/editorial-card";
import { SYSTEM_CATEGORIES, type Account, type Transaction } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface TransactionFormDialogProps {
  accounts: Account[];
  onCreated?: (tx: Transaction) => void;
  triggerVariant?: "primary" | "outline";
}

export function TransactionFormDialog({
  accounts,
  onCreated,
  triggerVariant = "primary",
}: TransactionFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [isIncome, setIsIncome] = useState(false);

  const categoryItems = SYSTEM_CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
  const typeItems = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) {
      toast.error("Select an account first");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        date,
        description,
        amount: parseFloat(amount),
        category: isIncome ? "income" : category,
        is_income: isIncome,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Failed to add transaction");
      return;
    }

    const { transaction } = await res.json();
    toast.success("Transaction added");
    onCreated?.(transaction as Transaction);
    setOpen(false);
    setDescription("");
    setAmount("");
    router.refresh();
  }

  if (accounts.length === 0) {
    return (
      <Button variant="outline" size="sm" className="h-8" disabled>
        <Plus className="h-3.5 w-3.5" />
        Add transaction
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          size="sm"
          variant={triggerVariant === "outline" ? "outline" : "default"}
          className={cn(
            triggerVariant === "primary" && "h-8",
            triggerVariant === "primary" && brandClasses.btnPrimary
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          {triggerVariant === "primary" ? (
            <>
              <span className="hidden sm:inline">Add transaction</span>
              <span className="sm:hidden">Add</span>
            </>
          ) : (
            "Add transaction"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {accounts.length > 1 && (
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={accountId} onValueChange={(v) => v && setAccountId(v)}>
                <SelectTrigger className={filterControlClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({a.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tx-date">Date</Label>
              <Input
                id="tx-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={filterControlClass}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={isIncome ? "income" : "expense"}
                items={typeItems}
                onValueChange={(v) => setIsIncome(v === "income")}
              >
                <SelectTrigger className={filterControlClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-desc">Description</Label>
            <Input
              id="tx-desc"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Coffee shop"
              className={filterControlClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Amount</Label>
              <Input
                id="tx-amount"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={filterControlClass}
              />
            </div>
            {!isIncome && (
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  items={categoryItems}
                  onValueChange={(v) => v && setCategory(v)}
                >
                  <SelectTrigger className={filterControlClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button type="submit" className={cn("w-full", brandClasses.btnPrimary)} disabled={loading}>
            {loading ? "Saving…" : "Add transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
