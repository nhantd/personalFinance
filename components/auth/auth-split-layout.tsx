import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { COLORS } from "@/lib/colors";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { BRAND } from "@/lib/brand";

const AUTH_STATS = [
  { value: "Any bank", label: "CSV & PDF supported" },
  { value: "0", label: "Bank credentials held" },
  { value: "$67.96m", label: "Tracked — live" },
] as const;

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside
        className="hidden flex-col justify-between p-10 text-white xl:p-14 lg:flex"
        style={{ backgroundColor: COLORS.darkGreen }}
      >
        <div className="flex items-center gap-3">
          <Logo variant="inverse" href="/" />
          <span className="rounded border border-white/40 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
            Beta
          </span>
        </div>

        <div>
          <p className="font-heading text-3xl font-light leading-snug xl:text-4xl">
            {MARKETING_COPY.auth.tagline}{" "}
            <em className="not-italic italic">
              {MARKETING_COPY.auth.taglineAccent}
            </em>
          </p>
          <div className="mt-8 border-t border-white/15 pt-8">
            <div className="grid grid-cols-3 gap-6">
              {AUTH_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-semibold xl:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-white/75">
            {MARKETING_COPY.auth.credentialBadge}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col justify-between bg-background px-6 py-8 sm:px-12 lg:px-16 lg:py-10">
        <div className="lg:hidden">
          <Logo href="/" />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8 lg:py-12">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-2 text-xs text-muted-foreground">
          <span>{MARKETING_COPY.auth.bottomBar}</span>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
