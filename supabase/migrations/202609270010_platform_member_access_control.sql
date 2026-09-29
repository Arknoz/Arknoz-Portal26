-- Arknoz Platform Member Access Control
--
-- Canonical platform-level member access state.
-- Missing row means ACTIVE.
-- SUSPENDED blocks Arknoz member functionality without modifying
-- Supabase Auth internals or requiring a service-role client.

begin;

-- ============================================================
-- 1. MEMBER ACCESS STATE
-- ============================================================

create table if not exists public.platform_member_access (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  status text not null default 'active'
    check (
      status in (
        'active',
        'suspended'
      )
    ),

  reason text
    check (
      reason is null
      or length(reason) <= 1000
    ),

  changed_by uuid
    references auth.users(id)
    on delete set null,

  changed_at timestamptz not null
    default now()
);

alter table public.platform_member_access
  enable row level security;

revoke all
on table public.platform_member_access
from anon, authenticated;


-- ============================================================
-- 2. ACCESS AUDIT LOG
-- ============================================================

create table if not exists public.platform_member_access_audit_log (
  id uuid primary key
    default gen_random_uuid(),

  actor_user_id uuid
    references auth.users(id)
    on delete set null,

  -- Deliberately not an FK:
  -- audit history must survive deletion of the auth account.
  target_user_id uuid not null,

  old_status text,
  new_status text not null,

  old_reason text,
  new_reason text,

  created_at timestamptz not null
    default now()
);

alter table public.platform_member_access_audit_log
  enable row level security;

revoke all
on table public.platform_member_access_audit_log
from anon, authenticated;


-- ============================================================
-- 3. CANONICAL ACCESS HELPER
-- ============================================================

create or replace function public.is_platform_member_active(
  member_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    member_user_id is not null
    and exists (
      select 1
      from auth.users as u
      where u.id = member_user_id
    )
    and coalesce(
      (
        select a.status
        from public.platform_member_access as a
        where a.user_id = member_user_id
      ),
      'active'
    ) = 'active';
$$;

revoke all
on function public.is_platform_member_active(uuid)
from public;

grant execute
on function public.is_platform_member_active(uuid)
to authenticated;


-- ============================================================
-- 4. CURRENT MEMBER STATUS
-- ============================================================

create or replace function public.get_my_platform_member_access_status()
returns text
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    case
      when auth.uid() is null
        then 'unauthenticated'

      when public.is_platform_member_active(
        auth.uid()
      )
        then 'active'

      else 'suspended'
    end;
$$;

revoke all
on function public.get_my_platform_member_access_status()
from public;

grant execute
on function public.get_my_platform_member_access_status()
to authenticated;


-- ============================================================
-- 5. PRO MEMBERSHIP MUST ALSO BE ACTIVE
-- ============================================================

create or replace function public.is_active_pro_member(
  member_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    public.is_platform_member_active(
      member_user_id
    )
    and exists (
      select 1
      from auth.users as u
      where u.id = member_user_id
        and upper(
          coalesce(
            u.raw_app_meta_data ->> 'membership',
            ''
          )
        ) = 'PRO'
    );
$$;

revoke all
on function public.is_active_pro_member(uuid)
from public;

grant execute
on function public.is_active_pro_member(uuid)
to authenticated;


-- ============================================================
-- 6. OWNER / ADMIN WRITE CONTROL
-- ============================================================

create or replace function public.set_platform_member_access(
  target_user_id uuid,
  target_status text,
  target_reason text default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  actor_id uuid :=
    auth.uid();

  normalized_status text :=
    lower(
      trim(
        coalesce(
          target_status,
          ''
        )
      )
    );

  normalized_reason text :=
    nullif(
      trim(
        coalesce(
          target_reason,
          ''
        )
      ),
      ''
    );

  previous_status text;
  previous_reason text;
begin
  if actor_id is null then
    raise exception
      'Authentication required';
  end if;

  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = actor_id
      and pa.status = 'active'
      and pa.platform_role in (
        'OWNER',
        'ADMIN'
      )
  ) then
    raise exception
      'Platform member administration authority required';
  end if;

  if target_user_id is null then
    raise exception
      'Target member is required';
  end if;

  if not exists (
    select 1
    from auth.users as u
    where u.id = target_user_id
  ) then
    raise exception
      'Target member does not exist';
  end if;

  if normalized_status not in (
    'active',
    'suspended'
  ) then
    raise exception
      'Invalid member access status';
  end if;

  if
    normalized_status = 'suspended'
    and normalized_reason is null
  then
    raise exception
      'A suspension reason is required';
  end if;

  if
    target_user_id = actor_id
    and normalized_status = 'suspended'
  then
    raise exception
      'You cannot suspend your own account';
  end if;

  if
    normalized_status = 'suspended'
    and exists (
      select 1
      from public.platform_admins as pa
      where pa.user_id =
        target_user_id
        and pa.status = 'active'
    )
  then
    raise exception
      'Remove or suspend platform administration authority before suspending this member';
  end if;

  select
    coalesce(
      a.status,
      'active'
    ),
    a.reason
  into
    previous_status,
    previous_reason
  from (
    select
      target_user_id as user_id
  ) as target
  left join public.platform_member_access as a
    on a.user_id =
      target.user_id;

  insert into public.platform_member_access (
    user_id,
    status,
    reason,
    changed_by,
    changed_at
  )
  values (
    target_user_id,
    normalized_status,
    case
      when normalized_status = 'active'
        then null
      else normalized_reason
    end,
    actor_id,
    now()
  )
  on conflict (user_id)
  do update set
    status =
      excluded.status,
    reason =
      excluded.reason,
    changed_by =
      excluded.changed_by,
    changed_at =
      excluded.changed_at;

  insert into public.platform_member_access_audit_log (
    actor_user_id,
    target_user_id,
    old_status,
    new_status,
    old_reason,
    new_reason
  )
  values (
    actor_id,
    target_user_id,
    previous_status,
    normalized_status,
    previous_reason,
    case
      when normalized_status = 'active'
        then null
      else normalized_reason
    end
  );
end;
$$;

revoke all
on function public.set_platform_member_access(
  uuid,
  text,
  text
)
from public;

grant execute
on function public.set_platform_member_access(
  uuid,
  text,
  text
)
to authenticated;

commit;
