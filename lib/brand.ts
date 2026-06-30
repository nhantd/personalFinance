export const BRAND = {
  name: "Monae",
  tagline: "Know every cent of your finances",
  ctaLabel: "Launch app",
  ctaSecondary: "Get started — free",
  email: "hello@monae.app",
} as const;

/** Shared Tailwind class fragments for the Monae brand */
export const brandClasses = {
  logo: "text-xl font-bold tracking-tight text-foreground",
  logoAccent: "text-accent",
  label: "text-xs font-semibold uppercase tracking-widest text-accent",
  heading: "font-heading font-light tracking-tight text-3xl sm:text-4xl lg:text-5xl",
  card: "rounded-xl border border-border bg-card shadow-sm",
  cardHover:
    "rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md hover:border-soft/40",
  btnPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
  btnLaunch: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full",
  btnHeader: "bg-brand-dark text-white hover:bg-brand-dark/90 font-medium rounded-full",
  link: "text-accent hover:text-accent/80 font-medium",
  income: "text-success",
  highlight: "text-primary",
  insightBg: "bg-soft/20",
  creepRow: "bg-highlight-warm-bg",
  mockCard: "rounded-lg border border-foreground/15 bg-card",
  mockCardHeader: "flex items-center justify-between border-b border-foreground/10 px-4 py-2.5",
  mockSerifStat: "font-heading text-2xl font-light tracking-tight",
  mockInsightChip:
    "inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-3 py-1.5 text-xs font-medium text-white",
  tagSubscription: "bg-tag-subscription-bg text-tag-subscription",
  tagGoal: "bg-tag-goal-bg text-success",
  tagLoan: "border border-chart-blue/30 bg-transparent text-chart-blue",
  tagDefault: "border border-border bg-muted text-muted-foreground",
  authHeading: "font-heading text-3xl font-light tracking-tight text-foreground",
  authSubheading: "mt-2 text-sm text-muted-foreground",
  authLegal: "mt-8 text-center text-xs text-muted-foreground",
} as const;
