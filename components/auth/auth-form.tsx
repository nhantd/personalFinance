"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  SIGNUP_REDIRECT_PATH,
  sanitizeReturnPath,
  buildOAuthCallbackUrl,
} from "@/lib/auth-redirect";
import { brandClasses } from "@/lib/brand";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const next = sanitizeReturnPath(params.get("next") ?? params.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleOAuth() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const destination = mode === "signup" ? SIGNUP_REDIRECT_PATH : next;
    const redirectTo = buildOAuthCallbackUrl(destination);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push(SIGNUP_REDIRECT_PATH);
        router.refresh();
      } else {
        setError(
          "Account created but no session. Check Supabase email confirmation settings.",
        );
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push(next);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <h1 className={brandClasses.authHeading}>
        {mode === "signup" ? "Get started free" : "Welcome back"}
      </h1>
      <p className={brandClasses.authSubheading}>
        {mode === "signup"
          ? "No bank login. Upload a statement and see insights in minutes."
          : "Sign in to your account"}
      </p>

      <div className="mt-8">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          disabled={loading}
          onClick={handleGoogleOAuth}
        >
          Continue with Google
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or use email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handlePassword} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11 bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            className="h-11 bg-card"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className={`h-11 w-full ${brandClasses.btnPrimary}`}
          disabled={loading}
        >
          {loading
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className={brandClasses.link}
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(next)}`}
              className={brandClasses.link}
            >
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
