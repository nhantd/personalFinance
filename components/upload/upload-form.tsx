"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { brandClasses } from "@/lib/brand";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Account, Currency } from "@/lib/types/database";
import { CurrencySelect } from "@/components/ui/currency-select";

type ParseStage = "idle" | "uploading" | "parsing" | "complete" | "error";

interface UploadFormProps {
  accounts: Account[];
  defaultCurrency: Currency;
}

function UploadForm({ accounts, defaultCurrency }: UploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "new");
  const [accountName, setAccountName] = useState("Primary Account");
  const [institution, setInstitution] = useState("");
  const [currency, setCurrency] = useState<Currency>(
    accounts[0]?.currency ?? defaultCurrency
  );
  const [stage, setStage] = useState<ParseStage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setError(null);
    }
  }

  function handleAccountChange(value: string) {
    setAccountId(value);
    if (value !== "new") {
      const account = accounts.find((a) => a.id === value);
      if (account) setCurrency(account.currency);
    }
  }

  const accountItems = [
    { value: "new", label: "+ New account" },
    ...accounts.map((a) => ({ value: a.id, label: `${a.name} · ${a.currency}` })),
  ];

  async function handleUpload() {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const fileType = ext === "pdf" ? "pdf" : ext === "csv" ? "csv" : null;

    if (!fileType) {
      toast.error("Only CSV and PDF files are supported");
      return;
    }

    setStage("uploading");
    setProgress(20);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);
      formData.append("fileName", file.name);
      formData.append("currency", currency);

      if (accountId === "new") {
        formData.append("accountName", accountName);
        formData.append("institution", institution);
      } else {
        formData.append("accountId", accountId);
      }

      const uploadRes = await fetch("/api/statements/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      setStage("parsing");
      setProgress(50);

      const parseRes = await fetch("/api/statements/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statementId: uploadData.statementId }),
      });

      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error ?? "Parse failed");

      setProgress(100);
      setStage("complete");
      toast.success(`Parsed ${parseData.transactionCount} transactions`);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setStage("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Upload statement</CardTitle>
          <CardDescription>
            Drop a CSV or PDF bank statement. No bank login required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">
              {file ? file.name : "Drag & drop your statement here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">CSV or PDF, max 10MB</p>
            <Label htmlFor="file-upload" className="mt-4 cursor-pointer">
              <span className={buttonVariants({ variant: "outline", size: "sm" })}>
                Browse files
              </span>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.pdf,text/csv,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Account</Label>
              <Select
                value={accountId}
                items={accountItems}
                onValueChange={(v) => v && handleAccountChange(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {accountId === "new" && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="account-currency">Account currency</Label>
                <CurrencySelect
                  id="account-currency"
                  value={currency}
                  onValueChange={(v) => setCurrency(v as Currency)}
                />
              </div>
            )}
          </div>

          {accountId === "new" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Account name</Label>
                <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Institution (optional)</Label>
                <Input
                  placeholder="Chase, Bank of America, Wells Fargo..."
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </div>
          )}

          {stage !== "idle" && stage !== "error" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {stage === "uploading" && "Uploading..."}
                {stage === "parsing" && "AI is reading your statement..."}
                {stage === "complete" && "Done!"}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || stage === "uploading" || stage === "parsing"}
            className={`w-full ${brandClasses.btnPrimary}`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Upload & analyse
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function UploadPageClient(props: UploadFormProps) {
  return (
    <Suspense>
      <UploadForm {...props} />
    </Suspense>
  );
}
