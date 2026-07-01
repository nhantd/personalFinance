-- Loosen currency constraints to support ISO 4217 codes (e.g. VND)
alter table public.profiles drop constraint if exists profiles_default_currency_check;
alter table public.accounts drop constraint if exists accounts_currency_check;
alter table public.transactions drop constraint if exists transactions_currency_check;

-- Future-ready bank balance fields (unused in v1 UI)
alter table public.accounts
  add column if not exists current_balance numeric(18, 2),
  add column if not exists balance_as_of date;

-- Asset kinds
create type public.asset_kind as enum ('investment', 'property', 'other');

-- User-entered wealth items
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind public.asset_kind not null,
  subtype text not null,
  name text not null,
  currency text not null default 'USD',
  value numeric(18, 2) not null default 0,
  debt numeric(18, 2) not null default 0,
  institution text,
  notes text,
  as_of_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_assets_user on public.assets(user_id);
create index if not exists idx_assets_user_kind on public.assets(user_id, kind);

-- Historical snapshots for net worth chart
create table if not exists public.asset_snapshots (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  recorded_at date not null,
  value numeric(18, 2) not null,
  debt numeric(18, 2) not null default 0,
  currency text not null,
  unique (asset_id, recorded_at)
);

create index if not exists idx_asset_snapshots_user_date on public.asset_snapshots(user_id, recorded_at desc);

-- Cached FX rates
create table if not exists public.fx_rates (
  base_currency text not null,
  quote_currency text not null,
  rate numeric(18, 8) not null,
  rate_date date not null default current_date,
  fetched_at timestamptz not null default now(),
  primary key (base_currency, quote_currency, rate_date)
);

-- RLS
alter table public.assets enable row level security;
alter table public.asset_snapshots enable row level security;
alter table public.fx_rates enable row level security;

create policy "Users can view own assets" on public.assets for select using (auth.uid() = user_id);
create policy "Users can insert own assets" on public.assets for insert with check (auth.uid() = user_id);
create policy "Users can update own assets" on public.assets for update using (auth.uid() = user_id);
create policy "Users can delete own assets" on public.assets for delete using (auth.uid() = user_id);

create policy "Users can view own asset snapshots" on public.asset_snapshots for select using (auth.uid() = user_id);
create policy "Users can insert own asset snapshots" on public.asset_snapshots for insert with check (auth.uid() = user_id);
create policy "Users can update own asset snapshots" on public.asset_snapshots for update using (auth.uid() = user_id);
create policy "Users can delete own asset snapshots" on public.asset_snapshots for delete using (auth.uid() = user_id);

-- FX rates readable by authenticated users; writes via service role only
create policy "Authenticated users can read fx rates" on public.fx_rates for select using (auth.role() = 'authenticated');
