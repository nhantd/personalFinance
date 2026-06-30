# Monae — Personal Finance POC

Privacy-first personal finance app. Upload bank statements (CSV/PDF), get AI categorization, spending insights, and conversational Q&A — no bank login ever.

## Stack

- **Next.js 16** (App Router) on Vercel
- **TypeScript** + Tailwind CSS + shadcn/ui
- **Supabase** — Auth, Postgres, Storage, RLS
- **Anthropic Claude** — Statement parsing & chat

## Getting started

### 1. Clone and install

```bash
npm install
```

### 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/20250630000000_initial_schema.sql` via the SQL editor or Supabase CLI
3. Enable Email auth (magic link) in Authentication → Providers
4. Add your site URL to Authentication → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Test with sample statements

Sample CSV files are in `samples/`:

- `samples/us-chase-checking.csv` — US format (single Amount column)
- `samples/uk-barclays-current.csv` — UK format (Debit/Credit columns)

## Deploy to Vercel

1. Push to GitHub and import in Vercel
2. Add all env vars from `.env.example`
3. Update Supabase redirect URLs with your production domain

## Features

- **Landing page** — Kleev-inspired marketing site
- **Magic link auth** — No passwords
- **Statement upload** — CSV & PDF, up to 10MB
- **AI parsing** — Extracts & categorizes transactions
- **Dashboard** — Income, outflows, surplus, category chart
- **Transactions** — Full list with category override
- **Ask Monae** — Chat grounded in your data
- **Settings** — Currency preference, one-click data wipe

## Project structure

```
app/
  (marketing)/     Public landing page
  (auth)/          Login & signup
  (app)/           Authenticated app (dashboard, upload, etc.)
  api/             Upload, parse, chat, profile routes
components/        UI components
lib/               Supabase, parsers, AI, finance utilities
supabase/          Database migrations
samples/           Test CSV files
```

## Privacy

- No bank credentials ever requested
- Row-level security on all tables
- Private storage bucket per user
- One-click delete all data in Settings
