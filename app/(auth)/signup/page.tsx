"use client";

import Link from "next/link";
import { Suspense } from "react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { BRAND, brandClasses } from "@/lib/brand";

export default function SignupPage() {
  return (
    <AuthSplitLayout>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
      <p className={`${brandClasses.authLegal} mt-8`}>
        By continuing you agree to {BRAND.name}&apos;s{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          terms of service
        </Link>
        .
      </p>
    </AuthSplitLayout>
  );
}
