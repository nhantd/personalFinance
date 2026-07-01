import { Suspense } from "react";
import { BRAND } from "@/lib/brand";
import { NOINDEX_FOLLOW_METADATA } from "@/lib/seo/site";
import LoginPage from "./login-page";

export const metadata = {
  title: `Log in — ${BRAND.name}`,
  description: `Log in to ${BRAND.name} to access your personal finance dashboard.`,
  ...NOINDEX_FOLLOW_METADATA,
};

export default function LoginPageWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
