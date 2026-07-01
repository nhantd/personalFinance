import { BRAND } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata = createPageMetadata({
  title: `Create your account — ${BRAND.name}`,
  description:
    "Sign up for Monae — your AI personal finance advisor. Upload bank statements, track net worth, and ask questions about your money. Free while in beta.",
  path: "/signup",
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
