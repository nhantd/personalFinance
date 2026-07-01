"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CurrencySelect } from "@/components/ui/currency-select";
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
import {
  SettingsCard,
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-layout";
import { useSignOut } from "@/components/app/use-sign-out";
import { createClient } from "@/lib/supabase/client";
import { getCurrencyLabel } from "@/lib/currencies";
import { brandClasses } from "@/lib/brand";
import type { Currency, Profile } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export interface SettingsStatement {
  id: string;
  file_type: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  account_name: string;
}

interface SettingsPageClientProps {
  profile: Profile;
  user: Pick<User, "email" | "app_metadata" | "identities">;
  stats: {
    transactions: number;
    statements: number;
    accounts: number;
    assets: number;
  };
  statements: SettingsStatement[];
}

function getSignInLabel(user: SettingsPageClientProps["user"]) {
  const provider =
    (user.app_metadata?.provider as string | undefined) ??
    user.identities?.[0]?.provider ??
    "email";

  if (provider === "google") return "Google";
  return "Email & password";
}

function formatStatementPeriod(statement: SettingsStatement) {
  if (statement.period_start && statement.period_end) {
    return `${statement.period_start} – ${statement.period_end}`;
  }
  return new Date(statement.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "complete") return "secondary";
  if (status === "failed") return "destructive";
  return "outline";
}

export function SettingsPageClient({
  profile,
  user,
  stats,
  statements,
}: SettingsPageClientProps) {
  const router = useRouter();
  const signOut = useSignOut();

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [currency, setCurrency] = useState<Currency>(profile.default_currency);
  const [newEmail, setNewEmail] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function patchProfile(updates: {
    display_name?: string;
    default_currency?: Currency;
  }) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(
        typeof data.error === "string" ? data.error : "Failed to save settings",
      );
    }
  }

  async function handleSaveName() {
    setSavingName(true);
    try {
      await patchProfile({ display_name: displayName });
      toast.success("Display name updated");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save display name",
      );
    } finally {
      setSavingName(false);
    }
  }

  async function handleSaveCurrency() {
    setSavingCurrency(true);
    try {
      await patchProfile({ default_currency: currency });
      toast.success("Currency updated");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save currency",
      );
    } finally {
      setSavingCurrency(false);
    }
  }

  async function handleUpdateEmail() {
    if (!newEmail.trim()) {
      toast.error("Enter a new email address");
      return;
    }

    setUpdatingEmail(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    });
    setUpdatingEmail(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Check your inbox to confirm the new email");
    setNewEmail("");
  }

  async function handleDeleteAll() {
    setDeleting(true);
    const res = await fetch("/api/profile", { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      toast.error("Failed to delete data");
      return;
    }

    toast.success("All data deleted");
    router.push("/dashboard");
    router.refresh();
  }

  const signInLabel = getSignInLabel(user);
  const currencyChanged = currency !== profile.default_currency;
  const nameChanged = displayName !== (profile.display_name ?? "");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Account
        </p>
        <h1 className="font-heading text-3xl font-light tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, security, preferences and data.
        </p>
      </header>

      <SettingsSection label="Account">
        <SettingsCard title="Account details">
          <SettingsRow
            label="Display name"
            description="Used in your dashboard greeting"
            align="start"
          >
            <div className="flex w-full min-w-0 items-center gap-2 sm:w-[22rem]">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10 min-w-0 flex-1"
              />
              <Button
                onClick={handleSaveName}
                disabled={savingName || !nameChanged}
                className={cn("h-10 shrink-0 px-4", brandClasses.btnPrimary)}
              >
                {savingName ? "Saving…" : "Save"}
              </Button>
            </div>
          </SettingsRow>

          <SettingsRow label="Email" description="Your current sign-in email">
            <p className="text-sm text-muted-foreground">{user.email ?? "—"}</p>
          </SettingsRow>

          <SettingsRow
            label="Sign-in method"
            description="How you signed in to Monae"
          >
            <Badge variant="outline" className="capitalize">
              {signInLabel}
            </Badge>
          </SettingsRow>

          <SettingsRow
            label="Change email"
            description="A confirmation link will be sent to the new address"
          >
            <div className="flex w-full min-w-0 items-center gap-2 sm:w-[22rem]">
              <Input
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-10 min-w-0 flex-1"
              />
              <Button
                variant="outline"
                onClick={handleUpdateEmail}
                disabled={updatingEmail || !newEmail.trim()}
                className="h-10 shrink-0 px-4"
              >
                {updatingEmail ? "Sending…" : "Update"}
              </Button>
            </div>
          </SettingsRow>

          <SettingsRow
            label="Sign out"
            description="Sign out of Monae on this device"
          >
            <Button size="sm" variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="Danger zone" variant="danger">
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Permanently delete your statements, transactions, net worth
              entries, and chat history. Your account stays active — only your
              data is removed.
            </p>
            <AlertDialog>
              <AlertDialogTrigger className="mt-4">
                <Button
                  variant="outline"
                  disabled={deleting}
                  className="border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete all my data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove all uploaded statements, parsed
                    transactions, net worth entries, and chat history. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAll}
                    className="bg-destructive"
                  >
                    Delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection label="Preferences">
        <SettingsCard title="Display & currency">
          <SettingsRow
            label="Default currency"
            description="Net worth, dashboard totals, and mixed-currency amounts convert to this currency"
            align="start"
          >
            <div className="flex w-full items-center gap-2 sm:w-[22rem]">
              <CurrencySelect
                value={currency}
                onValueChange={(v) => setCurrency(v as Currency)}
                className="min-w-0 flex-1"
                menuMinWidth={320}
              />
              <Button
                onClick={handleSaveCurrency}
                disabled={savingCurrency || !currencyChanged}
                className={cn("h-10 shrink-0 px-4", brandClasses.btnPrimary)}
              >
                {savingCurrency ? "Saving…" : "Save"}
              </Button>
            </div>
          </SettingsRow>

          <SettingsRow
            label="Active currency"
            description="Currently applied across the app"
          >
            <Badge variant="secondary">
              {getCurrencyLabel(profile.default_currency)}
            </Badge>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection label="Data">
        <SettingsCard
          title="Data management"
          headerAction={
            <span className={cn(brandClasses.label, "text-[9px] text-accent")}>
              No bank login · ever
            </span>
          }
        >
          <SettingsRow
            label="Stored transactions"
            description="Transaction data from your uploaded statements"
          >
            <span className="text-sm text-muted-foreground">
              {stats.transactions} transaction
              {stats.transactions === 1 ? "" : "s"}
            </span>
          </SettingsRow>

          <SettingsRow
            label="Bank accounts"
            description="Accounts created from your uploads"
          >
            <span className="text-sm text-muted-foreground">
              {stats.accounts} account{stats.accounts === 1 ? "" : "s"}
            </span>
          </SettingsRow>

          <SettingsRow
            label="Net worth entries"
            description="Manual assets and liabilities you have added"
          >
            <span className="text-sm text-muted-foreground">
              {stats.assets} entr{stats.assets === 1 ? "y" : "ies"}
            </span>
          </SettingsRow>

          <SettingsRow
            label="Delete all data"
            description="Removes statements, transactions, net worth entries, and chat history"
          >
            <AlertDialog>
              <AlertDialogTrigger>
                <Button size="sm" variant="outline">
                  Clear data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes everything you have uploaded or entered in
                    Monae. Your account and sign-in stay intact.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAll}
                    className="bg-destructive"
                  >
                    Clear data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="Manage uploads">
          {statements.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No imports yet.
            </div>
          ) : (
            statements.map((statement) => (
              <SettingsRow
                key={statement.id}
                label={statement.account_name}
                description={`${statement.file_type.toUpperCase()} · ${formatStatementPeriod(statement)}`}
              >
                <Badge
                  variant={statusVariant(statement.status)}
                  className="capitalize"
                >
                  {statement.status}
                </Badge>
              </SettingsRow>
            ))
          )}

          <SettingsRow
            label="Add more data"
            description="Upload a new bank statement CSV or PDF"
          >
            <Link
              href="/upload"
              className={cn(
                brandClasses.link,
                "inline-flex items-center gap-1 text-sm",
              )}
            >
              Upload statement
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>
    </div>
  );
}
