import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "@/components/brand/logo";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { BRAND, brandClasses } from "@/lib/brand";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm text-foreground">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex lg:gap-8">
          <Link
            href="#wealth"
            className="transition-colors hover:text-foreground"
          >
            Wealth
          </Link>
          <Link
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#compare"
            className="transition-colors hover:text-foreground"
          >
            Compare
          </Link>
          <Link
            href="#privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <ButtonLink size="sm" href="/login" className={brandClasses.btnHeader}>
          {BRAND.ctaLabel}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </ButtonLink>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {MARKETING_COPY.footer.tagline}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn
              title="Product"
              links={[
                { label: "Wealth", href: "#wealth" },
                { label: "Features", href: "#features" },
                { label: "How it works", href: "#how-it-works" },
                { label: "Compare", href: "#compare" },
                { label: "Privacy", href: "#privacy" },
                { label: "FAQ", href: "#faq" },
                { label: BRAND.ctaSecondary, href: "/signup" },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: "About", href: "#" },
                { label: "Help", href: "#" },
                { label: "Contact", href: "#" },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
                { label: "Security", href: "/security" },
              ]}
            />
            <FooterColumn
              title="Connect"
              links={[{ label: BRAND.email, href: `mailto:${BRAND.email}` }]}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {MARKETING_COPY.footer.bottomBar}
        </p>
      </div>
    </footer>
  );
}
