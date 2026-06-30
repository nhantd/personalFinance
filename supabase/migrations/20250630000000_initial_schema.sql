-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  default_currency text not null default 'USD' check (default_currency in ('GBP', 'USD', 'EUR')),
  created_at timestamptz not null default now()
);

-- Accounts
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  institution text,
  currency text not null default 'USD' check (currency in ('GBP', 'USD', 'EUR')),
  created_at timestamptz not null default now()
);

-- Statements
create table if not exists public.statements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  file_path text not null,
  file_type text not null check (file_type in ('csv', 'pdf')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  period_start date,
  period_end date,
  parsed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null,
  label text not null,
  icon text,
  is_system boolean not null default false,
  unique (user_id, slug)
);

-- Transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  statement_id uuid not null references public.statements(id) on delete cascade,
  date date not null,
  description text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'USD' check (currency in ('GBP', 'USD', 'EUR')),
  category text not null default 'other',
  is_income boolean not null default false,
  created_at timestamptz not null default now()
);

-- Chat sessions
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now()
);

-- Chat messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_transactions_user_date on public.transactions(user_id, date desc);
create index if not exists idx_statements_user_status on public.statements(user_id, status);
create index if not exists idx_accounts_user on public.accounts(user_id);
create index if not exists idx_chat_sessions_user on public.chat_sessions(user_id, created_at desc);
create index if not exists idx_chat_messages_session on public.chat_messages(session_id, created_at asc);

-- Seed system categories
insert into public.categories (user_id, slug, label, icon, is_system) values
  (null, 'income', 'Income', 'wallet', true),
  (null, 'rent-housing', 'Rent/Housing', 'home', true),
  (null, 'groceries', 'Groceries', 'shopping-cart', true),
  (null, 'transport', 'Transport', 'car', true),
  (null, 'subscriptions', 'Subscriptions', 'repeat', true),
  (null, 'dining', 'Dining', 'utensils', true),
  (null, 'shopping', 'Shopping', 'bag', true),
  (null, 'utilities', 'Utilities', 'zap', true),
  (null, 'transfer', 'Transfer', 'arrow-left-right', true),
  (null, 'loan', 'Loan', 'landmark', true),
  (null, 'other', 'Other', 'circle', true)
on conflict do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.statements enable row level security;
alter table public.transactions enable row level security;
alter table public.categories enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Accounts policies
create policy "Users can view own accounts" on public.accounts for select using (auth.uid() = user_id);
create policy "Users can insert own accounts" on public.accounts for insert with check (auth.uid() = user_id);
create policy "Users can update own accounts" on public.accounts for update using (auth.uid() = user_id);
create policy "Users can delete own accounts" on public.accounts for delete using (auth.uid() = user_id);

-- Statements policies
create policy "Users can view own statements" on public.statements for select using (auth.uid() = user_id);
create policy "Users can insert own statements" on public.statements for insert with check (auth.uid() = user_id);
create policy "Users can update own statements" on public.statements for update using (auth.uid() = user_id);
create policy "Users can delete own statements" on public.statements for delete using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);

-- Categories policies (system + own)
create policy "Anyone can view system categories" on public.categories for select using (is_system = true or auth.uid() = user_id);
create policy "Users can insert own categories" on public.categories for insert with check (auth.uid() = user_id);

-- Chat sessions policies
create policy "Users can view own chat sessions" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own chat sessions" on public.chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own chat sessions" on public.chat_sessions for update using (auth.uid() = user_id);
create policy "Users can delete own chat sessions" on public.chat_sessions for delete using (auth.uid() = user_id);

-- Chat messages policies (via session ownership)
create policy "Users can view own chat messages" on public.chat_messages for select using (
  exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = auth.uid())
);
create policy "Users can insert own chat messages" on public.chat_messages for insert with check (
  exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = auth.uid())
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, default_currency)
  values (new.id, split_part(new.email, '@', 1), 'USD');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for statements
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'statements',
  'statements',
  false,
  10485760,
  array['text/csv', 'application/csv', 'application/pdf', 'text/plain']
)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload own statements"
on storage.objects for insert
with check (
  bucket_id = 'statements'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view own statements"
on storage.objects for select
using (
  bucket_id = 'statements'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own statements"
on storage.objects for delete
using (
  bucket_id = 'statements'
  and auth.uid()::text = (storage.foldername(name))[1]
);
