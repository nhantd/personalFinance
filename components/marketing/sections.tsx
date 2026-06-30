import { BarChart3, MessageSquare, Shield, Upload } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Download your statement from any bank. Drop CSV or PDF — we never ask for login credentials.",
  },
  {
    icon: BarChart3,
    title: "AI reads",
    description: "Every line is parsed and categorised. Income, outflows, and patterns surface in seconds.",
  },
  {
    icon: MessageSquare,
    title: "Ask anything",
    description: "Chat with your data. Answers computed from your real transactions, not generic advice.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">How it works</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps. No bank login.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-xl border border-border/60 bg-card/30 p-6">
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <step.icon className="mt-4 h-8 w-8 text-emerald-400" />
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    id: "spending",
    num: "01",
    title: "Spending",
    description: "See where every pound and dollar goes. Category breakdowns, recurring charges, and month-over-month trends.",
  },
  {
    id: "budget",
    num: "02",
    title: "Budget snapshot",
    description: "Income vs outflows at a glance. Know your surplus before the month ends.",
  },
  {
    id: "ask",
    num: "03",
    title: "Ask Decode",
    description: "Natural language queries over your real data. How much on subscriptions? Can I afford the trip?",
  },
  {
    id: "privacy",
    num: "04",
    title: "Privacy architecture",
    description: "Encrypted at rest. Row-level security. One-click wipe. Your bank never meets our servers.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">Core systems</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Replaces spreadsheets
          <br />
          and subscription apps.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.id}
              className="group rounded-xl border border-border/60 bg-card/30 p-6 transition-colors hover:border-emerald-500/30"
            >
              <span className="font-mono text-xs text-emerald-400">{f.num} / {f.title.toUpperCase()}</span>
              <h3 className="mt-3 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="border-b border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
              Privacy architecture
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Your bank never
              <br />
              meets our servers.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Most finance apps want your bank login. We never ask. You download statements yourself
              and upload when you choose.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Shield, label: "No credential exposure", detail: "Zero bank login screens. Ever." },
              { icon: Upload, label: "You hold the data", detail: "Download CSV/PDF from your bank, upload on your terms." },
              { icon: Shield, label: "Encrypted at rest", detail: "Row-level security. One-click data wipe in settings." },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 rounded-xl border border-border/60 bg-card/30 p-4"
              >
                <item.icon className="h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center font-mono text-xs text-muted-foreground">
          NO CONNECTION · NO API · NO SCREEN-SCRAPING · EVER
        </p>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Take control of your money, today.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Completely free for the POC. Drop a CSV and Decode decodes it — first insights in about three minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-8 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Get started — free
          </a>
        </div>
        <div className="mt-10 flex justify-center gap-12 text-sm">
          <div>
            <p className="text-muted-foreground">SETUP TIME</p>
            <p className="font-mono font-semibold">3–5 MIN</p>
          </div>
          <div>
            <p className="text-muted-foreground">PRICE</p>
            <p className="font-mono font-semibold">£0.00</p>
          </div>
          <div>
            <p className="text-muted-foreground">BANK LOGIN</p>
            <p className="font-mono font-semibold text-emerald-400">NEVER</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SupportedBanksSection() {
  const banks = ["Chase", "Barclays", "Monzo", "Revolut", "HSBC", "Amex", "+ more"];
  return (
    <section className="border-b border-border/50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">READS STATEMENTS FROM</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {banks.map((bank) => (
            <span
              key={bank}
              className="rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground"
            >
              {bank}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
