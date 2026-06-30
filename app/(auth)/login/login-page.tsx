"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BRAND, brandClasses } from "@/lib/brand";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Check your email for the magic link");
  }

  return (
    <AuthSplitLayout>
      <div>
        <h1 className={brandClasses.authHeading}>Welcome back</h1>
        <p className={brandClasses.authSubheading}>Sign in to your account</p>

        {sent ? (
          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              We sent a link to <strong className="text-foreground">{email}</strong>. Click it to
              sign in.
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
            <Button
              type="submit"
              className={`h-11 w-full ${brandClasses.btnPrimary}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Sign in"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={brandClasses.link}>
            Sign up
          </Link>
        </p>

        <p className={brandClasses.authLegal}>
          By continuing you agree to {BRAND.name}&apos;s terms of service.
        </p>
      </div>
    </AuthSplitLayout>
  );
}
