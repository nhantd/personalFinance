"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyBadge } from "@/components/ui/currency-badge";
import { brandClasses } from "@/lib/brand";
import { COLORS } from "@/lib/colors";
import { getCurrencyMeta } from "@/lib/currencies";
import { SYSTEM_CATEGORIES, type Account, type Transaction } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const controlClass = "h-10 w-full";

interface TransactionFormDialogProps {
  accounts: Account[];
  onCreated?: (tx: Transaction) => void;
  triggerVariant?: "primary" | "outline";
}

function formatAccountLabel(account: Account) {
  return account.institution
    ? `${account.name} · ${account.institution}`
    : account.name;
}

function FormField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
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

  const accountItems = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: formatAccountLabel(account),
      })),
    [accounts]
  );

  const categoryItems = SYSTEM_CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
  const typeItems = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];

  const selectedAccount = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const currency = selectedAccount?.currency ?? "USD";
  const currencySymbol = getCurrencyMeta(currency)?.symbol ?? currency;

  useEffect(() => {
    if (!open) return;
    setAccountId(accounts[0]?.id ?? "");
    setDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setAmount("");
    setCategory("other");
    setIsIncome(false);
  }, [open, accounts]);

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
      <DialogContent className="flex max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 gap-2 border-b border-border/60 px-5 pt-4 pb-3">
          <div className="flex items-start gap-3 pr-8">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: COLORS.darkGreen }}
            >
              <Plus className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <DialogTitle>Add transaction</DialogTitle>
              <DialogDescription>Record a manual income or expense entry.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-3 px-5 py-4">
            <FormField label="Account">
              <Select
                value={accountId}
                items={accountItems}
                onValueChange={(v) => v && setAccountId(v)}
              >
                <SelectTrigger className={controlClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <span className="flex items-center gap-2">
                        <span>{formatAccountLabel(account)}</span>
                        <CurrencyBadge code={account.currency} />
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <FormField label="Date" htmlFor="tx-date">
                <DatePicker
                  id="tx-date"
                  required
                  value={date}
                  onChange={setDate}
                  className={controlClass}
                />
              </FormField>
              <FormField label="Type">
                <Select
                  value={isIncome ? "income" : "expense"}
                  items={typeItems}
                  onValueChange={(v) => setIsIncome(v === "income")}
                >
                  <SelectTrigger className={controlClass}>
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
              </FormField>
            </div>

            <FormField label="Description" htmlFor="tx-desc">
              <Input
                id="tx-desc"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Coffee shop"
                className={controlClass}
              />
            </FormField>

            <div className={cn("grid gap-x-4 gap-y-3", isIncome ? "grid-cols-1" : "grid-cols-2")}>
              <FormField label="Amount" htmlFor="tx-amount">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    {currencySymbol}
                  </span>
                  <Input
                    id="tx-amount"
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={cn(controlClass, "pl-8")}
                  />
                </div>
              </FormField>
              {!isIncome && (
                <FormField label="Category">
                  <Select
                    value={category}
                    items={categoryItems}
                    onValueChange={(v) => v && setCategory(v)}
                  >
                    <SelectTrigger className={controlClass}>
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
                </FormField>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Amount in <CurrencyBadge code={currency} className="mx-0.5 inline-flex" />
            </p>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className={brandClasses.btnPrimary}>
              {loading ? "Saving…" : "Add transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
