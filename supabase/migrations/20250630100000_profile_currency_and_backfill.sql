-- Use signup metadata for profile defaults
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, default_currency)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'default_currency', 'USD')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Backfill transaction currency from account
update public.transactions t
set currency = a.currency
from public.accounts a
where t.account_id = a.id
  and t.currency is distinct from a.currency;
