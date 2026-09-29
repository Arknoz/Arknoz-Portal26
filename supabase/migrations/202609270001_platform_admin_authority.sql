-- Arknoz platform administration authority
-- Platform authority is independent from Arknoz ID, Pro membership
-- and organisation/workspace roles.

begin;

create table if not exists public.platform_admins (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  platform_role text not null
    check (
      platform_role in (
        'OWNER',
        'ADMIN',
        'EDITOR',
        'MODERATOR'
      )
    ),

  status text not null default 'active'
    check (
      status in (
        'active',
        'suspended'
      )
    ),

  granted_by_user_id uuid
    references auth.users(id)
    on delete set null,

  granted_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);

create index if not exists
  platform_admins_role_status_idx
on public.platform_admins (
  platform_role,
  status
);

create table if not exists public.platform_admin_audit_log (
  id bigint generated always as identity primary key,

  actor_user_id uuid
    references auth.users(id)
    on delete set null,

  target_user_id uuid
    references auth.users(id)
    on delete set null,

  action text not null
    check (
      action in (
        'grant',
        'update',
        'remove'
      )
    ),

  old_role text,
  new_role text,
  old_status text,
  new_status text,

  created_at timestamptz not null
    default now()
);

create index if not exists
  platform_admin_audit_target_created_idx
on public.platform_admin_audit_log (
  target_user_id,
  created_at desc
);

alter table public.platform_admins
  enable row level security;

alter table public.platform_admin_audit_log
  enable row level security;

revoke all
on table public.platform_admins
from anon, authenticated;

revoke all
on table public.platform_admin_audit_log
from anon, authenticated;


-- ------------------------------------------------------------
-- Current authenticated user's platform role
-- ------------------------------------------------------------

create or replace function public.get_my_platform_role()
returns text
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select pa.platform_role
  from public.platform_admins as pa
  where pa.user_id = auth.uid()
    and pa.status = 'active'
  limit 1;
$$;

revoke all
on function public.get_my_platform_role()
from public;

grant execute
on function public.get_my_platform_role()
to authenticated;


-- ------------------------------------------------------------
-- Console access helper
-- OWNER / ADMIN / EDITOR / MODERATOR all have console access.
-- Module-level permissions will be applied separately.
-- ------------------------------------------------------------

create or replace function public.has_platform_console_access()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = auth.uid()
      and pa.status = 'active'
      and pa.platform_role in (
        'OWNER',
        'ADMIN',
        'EDITOR',
        'MODERATOR'
      )
  );
$$;

revoke all
on function public.has_platform_console_access()
from public;

grant execute
on function public.has_platform_console_access()
to authenticated;


-- ------------------------------------------------------------
-- Owner helper
-- ------------------------------------------------------------

create or replace function public.is_platform_owner()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = auth.uid()
      and pa.status = 'active'
      and pa.platform_role = 'OWNER'
  );
$$;

revoke all
on function public.is_platform_owner()
from public;

grant execute
on function public.is_platform_owner()
to authenticated;


-- ------------------------------------------------------------
-- OWNER-only grant/update
-- Initial OWNER bootstrap must be performed manually by a
-- trusted database administrator. Browser clients cannot create
-- the first OWNER.
-- ------------------------------------------------------------

create or replace function public.set_platform_admin(
  target_user_id uuid,
  target_role text,
  target_status text default 'active'
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_role text :=
    upper(trim(target_role));

  normalized_status text :=
    lower(trim(target_status));

  previous_role text;
  previous_status text;
begin
  if caller_user_id is null then
    raise exception
      'Authentication required';
  end if;

  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = caller_user_id
      and pa.platform_role = 'OWNER'
      and pa.status = 'active'
  ) then
    raise exception
      'Platform OWNER authority required';
  end if;

  if target_user_id is null then
    raise exception
      'Target user is required';
  end if;

  if normalized_role is null
     or normalized_role not in (
       'OWNER',
       'ADMIN',
       'EDITOR',
       'MODERATOR'
     )
  then
    raise exception
      'Invalid platform role';
  end if;

  if normalized_status is null
     or normalized_status not in (
       'active',
       'suspended'
     )
  then
    raise exception
      'Invalid platform admin status';
  end if;

  -- An OWNER cannot accidentally demote or suspend themselves.
  if target_user_id = caller_user_id
     and (
       normalized_role <> 'OWNER'
       or normalized_status <> 'active'
     )
  then
    raise exception
      'An OWNER cannot demote or suspend their own account';
  end if;

  select
    pa.platform_role,
    pa.status
  into
    previous_role,
    previous_status
  from public.platform_admins as pa
  where pa.user_id = target_user_id;

  insert into public.platform_admins (
    user_id,
    platform_role,
    status,
    granted_by_user_id,
    granted_at,
    updated_at
  )
  values (
    target_user_id,
    normalized_role,
    normalized_status,
    caller_user_id,
    now(),
    now()
  )
  on conflict (user_id)
  do update set
    platform_role =
      excluded.platform_role,
    status =
      excluded.status,
    granted_by_user_id =
      caller_user_id,
    updated_at =
      now();

  insert into public.platform_admin_audit_log (
    actor_user_id,
    target_user_id,
    action,
    old_role,
    new_role,
    old_status,
    new_status
  )
  values (
    caller_user_id,
    target_user_id,
    case
      when previous_role is null
        then 'grant'
      else 'update'
    end,
    previous_role,
    normalized_role,
    previous_status,
    normalized_status
  );
end;
$$;

revoke all
on function public.set_platform_admin(
  uuid,
  text,
  text
)
from public;

grant execute
on function public.set_platform_admin(
  uuid,
  text,
  text
)
to authenticated;


-- ------------------------------------------------------------
-- OWNER-only removal
-- ------------------------------------------------------------

create or replace function public.remove_platform_admin(
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  previous_role text;
  previous_status text;
begin
  if caller_user_id is null then
    raise exception
      'Authentication required';
  end if;

  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = caller_user_id
      and pa.platform_role = 'OWNER'
      and pa.status = 'active'
  ) then
    raise exception
      'Platform OWNER authority required';
  end if;

  if target_user_id is null then
    raise exception
      'Target user is required';
  end if;

  if target_user_id = caller_user_id then
    raise exception
      'An OWNER cannot remove their own platform authority';
  end if;

  select
    pa.platform_role,
    pa.status
  into
    previous_role,
    previous_status
  from public.platform_admins as pa
  where pa.user_id = target_user_id;

  if previous_role is null then
    return;
  end if;

  delete from public.platform_admins
  where user_id = target_user_id;

  insert into public.platform_admin_audit_log (
    actor_user_id,
    target_user_id,
    action,
    old_role,
    new_role,
    old_status,
    new_status
  )
  values (
    caller_user_id,
    target_user_id,
    'remove',
    previous_role,
    null,
    previous_status,
    null
  );
end;
$$;

revoke all
on function public.remove_platform_admin(uuid)
from public;

grant execute
on function public.remove_platform_admin(uuid)
to authenticated;

commit;
