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
    "rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md hover:border-accent/40",
  btnPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
  btnLaunch: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full",
  btnHeader: "bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full",
  link: "text-accent hover:text-accent/80 font-medium",
  income: "text-success",
  highlight: "text-accent",
  authHeading: "font-heading text-3xl font-light tracking-tight text-foreground",
  authSubheading: "mt-2 text-sm text-muted-foreground",
  authLegal: "mt-8 text-center text-xs text-muted-foreground",
} as const;
