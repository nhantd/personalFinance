import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tight">
          <span className="text-emerald-400">.</span>
          decode
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink variant="ghost" size="sm" href="/login">Log in</ButtonLink>
          <ButtonLink size="sm" href="/signup" className="bg-emerald-600 hover:bg-emerald-500">
            Get started — free
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-mono text-lg font-semibold">
              <span className="text-emerald-400">.</span>decode
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              AI personal finance platform. Your statements, your data, your decisions.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Launch app</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><span>Terms</span></li>
              <li><span>Privacy</span></li>
              <li><span>Security</span></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Connect</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>hello@decode.app</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          DECODE · EVERY CENT OF YOUR FINANCES, DECODED
        </p>
      </div>
    </footer>
  );
}
