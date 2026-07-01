-- Prefer Google OAuth full_name when creating profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, default_currency)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data->>'default_currency', 'USD')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Backfill Google users still on email-prefix names
update public.profiles p
set display_name = coalesce(
  nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
  nullif(trim(u.raw_user_meta_data->>'name'), ''),
  p.display_name
)
from auth.users u
where p.id = u.id
  and coalesce(u.raw_user_meta_data->>'provider', u.raw_app_meta_data->>'provider') = 'google'
  and (
    p.display_name is null
    or p.display_name = split_part(u.email, '@', 1)
    or p.display_name = u.email
  )
  and coalesce(
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(u.raw_user_meta_data->>'name'), '')
  ) is not null;
