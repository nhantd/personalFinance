"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencySelect } from "@/components/ui/currency-select";
import { brandClasses } from "@/lib/brand";
import { COLORS } from "@/lib/colors";
import { getCurrencyMeta } from "@/lib/currencies";
import { cn } from "@/lib/utils";
import type { Asset, AssetKind, Currency } from "@/lib/types/database";
import {
  LIABILITY_SUBTYPES,
  NET_WORTH_ASSET_CATEGORIES,
} from "@/lib/types/database";

type EntryType = "asset" | "liability";

const controlClass = "h-10 w-full";
const notesClass = "field-sizing-fixed h-[4.5rem] resize-none";

const tabPanelClass = "mt-3 outline-none";

interface NetWorthEntryDialogProps {
  asset?: Asset;
  defaultCurrency?: Currency;
  defaultEntryType?: EntryType;
  trigger?: React.ReactNode;
  onSaved?: () => void;
}

function resolveAssetCategory(asset: Asset) {
  return (
    NET_WORTH_ASSET_CATEGORIES.find((c) => c.value === asset.subtype) ??
    NET_WORTH_ASSET_CATEGORIES[0]
  );
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

function DateCurrencyFields({
  asOfDate,
  onAsOfDateChange,
  currency,
  onCurrencyChange,
  dateId,
  currencyId,
}: {
  asOfDate: string;
  onAsOfDateChange: (value: string) => void;
  currency: Currency;
  onCurrencyChange: (value: Currency) => void;
  dateId: string;
  currencyId: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      <FormField label="As-of date" htmlFor={dateId}>
        <DatePicker
          id={dateId}
          required
          value={asOfDate}
          onChange={onAsOfDateChange}
          className={controlClass}
        />
      </FormField>
      <FormField label="Currency" htmlFor={currencyId}>
        <CurrencySelect
          id={currencyId}
          value={currency}
          onValueChange={(v) => onCurrencyChange(v as Currency)}
          className={controlClass}
        />
      </FormField>
    </div>
  );
}

function NotesField({
  notes,
  onNotesChange,
  id,
}: {
  notes: string;
  onNotesChange: (value: string) => void;
  id: string;
}) {
  return (
    <FormField label="Notes (optional)" htmlFor={id}>
      <Textarea
        id={id}
        rows={2}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className={notesClass}
      />
    </FormField>
  );
}

function AssetFields({
  name,
  onNameChange,
  assetCategory,
  onAssetCategoryChange,
  value,
  onValueChange,
  debt,
  onDebtChange,
  currencySymbol,
  asOfDate,
  onAsOfDateChange,
  currency,
  onCurrencyChange,
  notes,
  onNotesChange,
}: {
  name: string;
  onNameChange: (value: string) => void;
  assetCategory: string;
  onAssetCategoryChange: (value: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  debt: string;
  onDebtChange: (value: string) => void;
  currencySymbol: string;
  asOfDate: string;
  onAsOfDateChange: (value: string) => void;
  currency: Currency;
  onCurrencyChange: (value: Currency) => void;
  notes: string;
  onNotesChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <FormField label="Name" htmlFor="entry-name-asset">
        <Input
          id="entry-name-asset"
          required
          placeholder="e.g. Family home"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={controlClass}
        />
      </FormField>

      <FormField label="Category">
        <Select
          value={assetCategory}
          items={NET_WORTH_ASSET_CATEGORIES.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onValueChange={(v) => v && onAssetCategoryChange(v)}
        >
          <SelectTrigger className={controlClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NET_WORTH_ASSET_CATEGORIES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <FormField label="Value" htmlFor="entry-value">
          <Input
            id="entry-value"
            type="number"
            min="0"
            step="0.01"
            required
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className={controlClass}
          />
        </FormField>
        <FormField label="Debt" htmlFor="entry-debt">
          <Input
            id="entry-debt"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={debt}
            onChange={(e) => onDebtChange(e.target.value)}
            className={controlClass}
          />
        </FormField>
      </div>

      <p className="-mt-1 text-xs text-muted-foreground">Amounts in {currencySymbol}</p>

      <DateCurrencyFields
        asOfDate={asOfDate}
        onAsOfDateChange={onAsOfDateChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        dateId="entry-date-asset"
        currencyId="entry-currency-asset"
      />
      <NotesField notes={notes} onNotesChange={onNotesChange} id="entry-notes-asset" />
    </div>
  );
}

function LiabilityFields({
  name,
  onNameChange,
  subtype,
  onSubtypeChange,
  value,
  onValueChange,
  currencySymbol,
  asOfDate,
  onAsOfDateChange,
  currency,
  onCurrencyChange,
  notes,
  onNotesChange,
}: {
  name: string;
  onNameChange: (value: string) => void;
  subtype: string;
  onSubtypeChange: (value: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  currencySymbol: string;
  asOfDate: string;
  onAsOfDateChange: (value: string) => void;
  currency: Currency;
  onCurrencyChange: (value: Currency) => void;
  notes: string;
  onNotesChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <FormField label="Name" htmlFor="entry-name-liability">
        <Input
          id="entry-name-liability"
          required
          placeholder="e.g. HECS debt"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={controlClass}
        />
      </FormField>

      <FormField label="Category">
        <Select
          value={subtype}
          items={LIABILITY_SUBTYPES.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onValueChange={(v) => v && onSubtypeChange(v)}
        >
          <SelectTrigger className={controlClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIABILITY_SUBTYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Balance" htmlFor="entry-balance">
        <Input
          id="entry-balance"
          type="number"
          min="0"
          step="0.01"
          required
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={controlClass}
        />
      </FormField>

      <p className="-mt-1 text-xs text-muted-foreground">Amount in {currencySymbol}</p>

      <DateCurrencyFields
        asOfDate={asOfDate}
        onAsOfDateChange={onAsOfDateChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        dateId="entry-date-liability"
        currencyId="entry-currency-liability"
      />
      <NotesField notes={notes} onNotesChange={onNotesChange} id="entry-notes-liability" />
    </div>
  );
}

export function NetWorthEntryDialog({
  asset,
  defaultCurrency = "USD",
  defaultEntryType = "asset",
  trigger,
  onSaved,
}: NetWorthEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>(
    asset?.kind === "liability" ? "liability" : defaultEntryType
  );
  const [assetCategory, setAssetCategory] = useState<string>(
    asset && asset.kind !== "liability"
      ? resolveAssetCategory(asset).value
      : NET_WORTH_ASSET_CATEGORIES[0].value
  );
  const [subtype, setSubtype] = useState<string>(
    asset?.kind === "liability" ? asset.subtype : LIABILITY_SUBTYPES[0].value
  );
  const [name, setName] = useState(asset?.name ?? "");
  const [currency, setCurrency] = useState<Currency>(asset?.currency ?? defaultCurrency);
  const [value, setValue] = useState(String(asset?.value ?? ""));
  const [debt, setDebt] = useState(String(asset?.debt ?? ""));
  const [notes, setNotes] = useState(asset?.notes ?? "");
  const [asOfDate, setAsOfDate] = useState(
    asset?.as_of_date ?? new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    if (!open) return;

    if (asset) {
      setEntryType(asset.kind === "liability" ? "liability" : "asset");
      setName(asset.name);
      setCurrency(asset.currency);
      setValue(String(asset.value));
      setDebt(asset.kind === "liability" ? "" : String(asset.debt ?? ""));
      setNotes(asset.notes ?? "");
      setAsOfDate(asset.as_of_date);

      if (asset.kind === "liability") {
        setSubtype(asset.subtype);
      } else {
        setAssetCategory(resolveAssetCategory(asset).value);
      }
      return;
    }

    setEntryType(defaultEntryType);
    setAssetCategory(NET_WORTH_ASSET_CATEGORIES[0].value);
    setSubtype(LIABILITY_SUBTYPES[0].value);
    setName("");
    setCurrency(defaultCurrency);
    setValue("");
    setDebt("");
    setNotes("");
    setAsOfDate(new Date().toISOString().slice(0, 10));
  }, [open, asset, defaultCurrency, defaultEntryType]);

  const selectedAssetCategory =
    NET_WORTH_ASSET_CATEGORIES.find((c) => c.value === assetCategory) ??
    NET_WORTH_ASSET_CATEGORIES[0];
  const currencySymbol = getCurrencyMeta(currency)?.symbol ?? currency;
  const isEditing = Boolean(asset);
  const isLiability = isEditing ? asset!.kind === "liability" : entryType === "liability";

  const sharedFieldProps = {
    name,
    onNameChange: setName,
    value,
    onValueChange: setValue,
    currencySymbol,
    asOfDate,
    onAsOfDateChange: setAsOfDate,
    currency,
    onCurrencyChange: setCurrency,
    notes,
    onNotesChange: setNotes,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const resolvedEntryType = isEditing
      ? asset!.kind === "liability"
        ? "liability"
        : "asset"
      : entryType;

    let kind: AssetKind;
    let resolvedSubtype: string;

    if (resolvedEntryType === "liability") {
      kind = "liability";
      resolvedSubtype = subtype;
    } else {
      kind = selectedAssetCategory.kind;
      resolvedSubtype = selectedAssetCategory.value;
    }

    const payload = {
      kind,
      subtype: resolvedSubtype,
      name,
      currency,
      value: parseFloat(value) || 0,
      debt: resolvedEntryType === "liability" ? 0 : parseFloat(debt) || 0,
      notes: notes || null,
      as_of_date: asOfDate,
    };

    const res = asset
      ? await fetch("/api/assets", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: asset.id, ...payload }),
        })
      : await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!res.ok) {
      toast.error("Failed to save entry");
      return;
    }

    toast.success(asset ? "Entry updated" : "Entry added");
    setOpen(false);
    onSaved?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger ?? (
          <Button className={brandClasses.btnPrimary}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-w-md flex-col gap-0 p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 gap-2 border-b border-border/60 px-5 pt-4 pb-3">
          <div className="flex items-start gap-3 pr-8">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: COLORS.darkGreen }}
            >
              <Plus className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <DialogTitle>
                {asset ? "Edit net worth entry" : "Add to your net worth"}
              </DialogTitle>
              <DialogDescription>
                Track a manual asset or liability.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-5 py-3">
            {isEditing ? (
              isLiability ? (
                <LiabilityFields
                  {...sharedFieldProps}
                  subtype={subtype}
                  onSubtypeChange={setSubtype}
                />
              ) : (
                <AssetFields
                  {...sharedFieldProps}
                  assetCategory={assetCategory}
                  onAssetCategoryChange={setAssetCategory}
                  debt={debt}
                  onDebtChange={setDebt}
                />
              )
            ) : (
              <Tabs
                value={entryType}
                onValueChange={(v) => v && setEntryType(v as EntryType)}
                className="gap-0"
              >
                <TabsList className="grid h-9 w-full grid-cols-2">
                  <TabsTrigger value="asset" className="capitalize">
                    Asset
                  </TabsTrigger>
                  <TabsTrigger value="liability" className="capitalize">
                    Liability
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="asset" className={tabPanelClass}>
                  <AssetFields
                    {...sharedFieldProps}
                    assetCategory={assetCategory}
                    onAssetCategoryChange={setAssetCategory}
                    debt={debt}
                    onDebtChange={setDebt}
                  />
                </TabsContent>
                <TabsContent value="liability" className={tabPanelClass}>
                  <LiabilityFields
                    {...sharedFieldProps}
                    subtype={subtype}
                    onSubtypeChange={setSubtype}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className={brandClasses.btnPrimary}>
              {saving ? "Saving…" : asset ? "Save changes" : "Add entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
