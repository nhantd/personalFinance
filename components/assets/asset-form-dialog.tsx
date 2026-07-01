"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { brandClasses } from "@/lib/brand";
import type { Asset, AssetKind, Currency } from "@/lib/types/database";
import {
  INVESTMENT_SUBTYPES,
  OTHER_ASSET_SUBTYPES,
  PROPERTY_SUBTYPES,
} from "@/lib/types/database";
import { CurrencySelect } from "@/components/ui/currency-select";

interface AssetFormDialogProps {
  kind: AssetKind;
  asset?: Asset;
  trigger?: React.ReactNode;
  onSaved?: () => void;
}

function subtypesForKind(kind: AssetKind) {
  if (kind === "investment") return INVESTMENT_SUBTYPES;
  if (kind === "property") return PROPERTY_SUBTYPES;
  return OTHER_ASSET_SUBTYPES;
}

export function AssetFormDialog({ kind, asset, trigger, onSaved }: AssetFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const subtypes = subtypesForKind(kind);

  const [subtype, setSubtype] = useState(asset?.subtype ?? subtypes[0].value);
  const [name, setName] = useState(asset?.name ?? "");
  const [currency, setCurrency] = useState<Currency>(asset?.currency ?? "USD");
  const [value, setValue] = useState(String(asset?.value ?? ""));
  const [debt, setDebt] = useState(String(asset?.debt ?? "0"));
  const [institution, setInstitution] = useState(asset?.institution ?? "");
  const [notes, setNotes] = useState(asset?.notes ?? "");
  const [asOfDate, setAsOfDate] = useState(
    asset?.as_of_date ?? new Date().toISOString().slice(0, 10)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      kind,
      subtype,
      name,
      currency,
      value: parseFloat(value) || 0,
      debt: parseFloat(debt) || 0,
      institution: institution || null,
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
      toast.error("Failed to save asset");
      return;
    }

    toast.success(asset ? "Asset updated" : "Asset added");
    setOpen(false);
    onSaved?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger ?? <Button className={brandClasses.btnPrimary}>Add asset</Button>}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit asset" : "Add asset"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={subtype} items={subtypes.map((s) => ({ value: s.value, label: s.label }))} onValueChange={(v) => v && setSubtype(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subtypes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset-name">Name</Label>
            <Input id="asset-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="asset-value">Value</Label>
              <Input
                id="asset-value"
                type="number"
                min="0"
                step="0.01"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            {(kind === "property" || kind === "other") && (
              <div className="space-y-2">
                <Label htmlFor="asset-debt">Debt</Label>
                <Input
                  id="asset-debt"
                  type="number"
                  min="0"
                  step="0.01"
                  value={debt}
                  onChange={(e) => setDebt(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset-currency">Currency</Label>
            <CurrencySelect
              id="asset-currency"
              value={currency}
              onValueChange={(v) => setCurrency(v as Currency)}
            />
          </div>
          {kind === "investment" && (
            <div className="space-y-2">
              <Label htmlFor="asset-institution">Institution (optional)</Label>
              <Input
                id="asset-institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="asset-date">As of date</Label>
            <Input
              id="asset-date"
              type="date"
              required
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset-notes">Notes (optional)</Label>
            <Input id="asset-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button type="submit" disabled={saving} className={`w-full ${brandClasses.btnPrimary}`}>
            {saving ? "Saving…" : asset ? "Update" : "Add"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
