import { ArrowRight, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";

const mockTransactions = [
  { date: "03 JUN", desc: "TESCO EXPRESS", cat: "Groceries", amount: "−£42.18" },
  { date: "03 JUN", desc: "TFL TRAVEL", cat: "Transport", amount: "−£8.60" },
  { date: "02 JUN", desc: "SPOTIFY UK", cat: "Subscriptions", amount: "−£10.99", creep: true },
  { date: "01 JUN", desc: "TRANSFER → ISA", cat: "Goal ✓", amount: "+£500.00", positive: true },
  { date: "28 MAY", desc: "MORTGAGE PAYMENT", cat: "Loan", amount: "−£1,240" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-background to-background" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Badge variant="outline" className="mb-6 border-emerald-500/30 text-emerald-400">
          PRIVACY-FIRST · NO BANK LOGIN EVER
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your money,
          <br />
          <span className="text-emerald-400">decoded</span> to the cent.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Drop a bank statement. Decode reads it, categorises every line, and answers your money questions.
          No credentials. No advisor fee.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink size="lg" href="/signup" className="bg-emerald-600 hover:bg-emerald-500">
            Get started — free
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
          <ButtonLink size="lg" variant="outline" href="#how-it-works">
            See how it works
          </ButtonLink>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/50 p-4 font-mono text-sm backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Upload className="h-4 w-4" />
              STATEMENT.CSV — CHASE CHECKING
              <span className="ml-auto animate-pulse text-emerald-400">READING</span>
            </div>
            <div className="space-y-2">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.desc}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/30 pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{tx.date}</span>
                  <span className="flex-1">{tx.desc}</span>
                  <span className="text-xs text-muted-foreground">{tx.cat}</span>
                  {tx.creep && (
                    <span className="text-xs text-amber-400">▲28% creep</span>
                  )}
                  <span className={tx.positive ? "text-emerald-400" : ""}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
              Decode&apos;s read
            </p>
            <p className="mt-3 text-lg">
              Surplus of <span className="font-semibold text-emerald-400">£1,847</span> this month.
              Spotify crept <span className="text-amber-400">▲28%</span>. Holiday fund is{" "}
              <span className="font-semibold">24% funded</span>.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">INCOME</p>
                <p className="text-xl font-semibold">£4.2k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">OUTFLOWS</p>
                <p className="text-xl font-semibold">£2.4k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SURPLUS</p>
                <p className="text-xl font-semibold text-emerald-400">+£1,847</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
