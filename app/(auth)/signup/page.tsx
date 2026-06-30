"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
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
import { toast } from "sonner";
import { BRAND, brandClasses } from "@/lib/brand";
import type { Currency } from "@/lib/types/database";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/upload&currency=${currency}`,
        data: { default_currency: currency },
      },
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    localStorage.setItem("pending_currency", currency);
    setSent(true);
    toast.success("Check your email to complete signup");
  }

  return (
    <div>
      <h1 className={brandClasses.authHeading}>Get started free</h1>
      <p className={brandClasses.authSubheading}>
        No bank login. Upload a statement and see insights in minutes.
      </p>

      {sent ? (
        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            We sent a link to <strong className="text-foreground">{email}</strong>. Click it to
            create your account.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label>Default currency</Label>
            <Select value={currency} onValueChange={(v) => v && setCurrency(v as Currency)}>
              <SelectTrigger className="h-11 bg-card">
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
            type="submit"
            className={`h-11 w-full ${brandClasses.btnPrimary}`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Create account"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className={brandClasses.link}>
          Log in
        </Link>
      </p>

      <p className={brandClasses.authLegal}>
        By continuing you agree to {BRAND.name}&apos;s terms of service.
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthSplitLayout>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
