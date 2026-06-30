"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { Currency, Profile } from "@/lib/types/database";
import { brandClasses } from "@/lib/brand";

interface SettingsFormProps {
  profile: Profile;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [currency, setCurrency] = useState<Currency>(profile.default_currency);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName, default_currency: currency }),
    });
    setSaving(false);

    if (!res.ok) {
      toast.error("Failed to save settings");
      return;
    }
    toast.success("Settings saved");
    router.refresh();
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

  return (
    <div className="space-y-6 max-w-lg">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your display preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Default currency</Label>
            <Select value={currency} onValueChange={(v) => v && setCurrency(v as Currency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={brandClasses.btnPrimary}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-card/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Permanently delete all accounts, statements, transactions, and chat history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" disabled={deleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete all my data
            </Button>
          </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove all your uploaded statements, parsed transactions,
                  and chat history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive">
                  Delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
