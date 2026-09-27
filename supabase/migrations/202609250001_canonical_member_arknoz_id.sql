-- ARKNOZ CANONICAL MEMBER ID
-- One permanent Arknoz ID for every authenticated member.
-- Identity is independent from role, country and paid membership.

alter table public.member_profiles
  add column if not exists arknoz_id text;


create or replace function public.generate_arknoz_member_id()
returns text
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  alphabet constant text :=
    '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

  token text;
  candidate text;
  i integer;
begin
  loop
    token := '';

    for i in 1..8 loop
      token :=
        token ||
        substr(
          alphabet,
          1 + floor(
            random() *
            length(alphabet)
          )::integer,
          1
        );
    end loop;

    candidate :=
      'ARK-' ||
      substr(token, 1, 4) ||
      '-' ||
      substr(token, 5, 4);

    exit when not exists (
      select 1
      from public.member_profiles
      where arknoz_id = candidate
    );
  end loop;

  return candidate;
end;
$$;


alter table public.member_profiles
  alter column arknoz_id
  set default public.generate_arknoz_member_id();


update public.member_profiles
set arknoz_id =
  public.generate_arknoz_member_id()
where arknoz_id is null
   or btrim(arknoz_id) = '';


alter table public.member_profiles
  alter column arknoz_id set not null;


create unique index if not exists
  member_profiles_arknoz_id_unique
on public.member_profiles (arknoz_id);


create or replace function public.handle_new_arknoz_member()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  insert into public.member_profiles (
    user_id
  )
  values (
    new.id
  )
  on conflict (user_id)
  do nothing;

  return new;
end;
$$;


drop trigger if exists
  on_auth_user_created_create_arknoz_member
on auth.users;


create trigger
  on_auth_user_created_create_arknoz_member
after insert on auth.users
for each row
execute function public.handle_new_arknoz_member();


-- Backfill authenticated users who existed before this migration.
insert into public.member_profiles (
  user_id
)
select
  u.id
from auth.users u
where not exists (
  select 1
  from public.member_profiles p
  where p.user_id = u.id
);
