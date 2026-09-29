-- Arknoz Admin Phase 1
-- System health, Admin roster/settings and audit visibility.

begin;


-- ============================================================
-- 1. NEVER ALLOW LOSS OF THE LAST ACTIVE OWNER
-- ============================================================

create or replace function
  public.protect_last_active_platform_owner()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  if tg_op = 'DELETE' then
    if
      old.platform_role = 'OWNER'
      and old.status = 'active'
      and not exists (
        select 1
        from public.platform_admins as pa
        where pa.user_id <> old.user_id
          and pa.platform_role = 'OWNER'
          and pa.status = 'active'
      )
    then
      raise exception
        'Arknoz must retain at least one active platform OWNER';
    end if;

    return old;
  end if;

  if
    old.platform_role = 'OWNER'
    and old.status = 'active'
    and (
      new.platform_role <> 'OWNER'
      or new.status <> 'active'
    )
    and not exists (
      select 1
      from public.platform_admins as pa
      where pa.user_id <> old.user_id
        and pa.platform_role = 'OWNER'
        and pa.status = 'active'
    )
  then
    raise exception
      'Arknoz must retain at least one active platform OWNER';
  end if;

  return new;
end;
$$;


drop trigger if exists
  platform_admins_last_owner_guard
on public.platform_admins;


create trigger
  platform_admins_last_owner_guard
before update or delete
on public.platform_admins
for each row
execute function
  public.protect_last_active_platform_owner();


-- ============================================================
-- 2. BASIC PLATFORM SYSTEM HEALTH
-- ============================================================

create or replace function
  public.get_platform_system_health()
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  result jsonb;
begin
  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = auth.uid()
      and pa.status = 'active'
  ) then
    raise exception
      'Platform administration authority required';
  end if;

  select jsonb_build_object(
    'databaseNow',
      now(),

    'databaseName',
      current_database(),

    'currentRole',
      (
        select pa.platform_role
        from public.platform_admins as pa
        where pa.user_id = auth.uid()
          and pa.status = 'active'
        limit 1
      ),

    'adminsTotal',
      (
        select count(*)
        from public.platform_admins
      ),

    'adminsActive',
      (
        select count(*)
        from public.platform_admins
        where status = 'active'
      ),

    'ownersActive',
      (
        select count(*)
        from public.platform_admins
        where platform_role = 'OWNER'
          and status = 'active'
      ),

    'adminsSuspended',
      (
        select count(*)
        from public.platform_admins
        where status = 'suspended'
      ),

    'membersSuspended',
      (
        select count(*)
        from public.platform_member_access
        where status = 'suspended'
      ),

    'entitiesTotal',
      (
        select count(*)
        from public.entities
      ),

    'entitiesPublished',
      (
        select count(*)
        from public.entities
        where content_status = 'published'
      ),

    'entitiesReview',
      (
        select count(*)
        from public.entities
        where content_status = 'review'
      ),

    'connectionsTotal',
      (
        select count(*)
        from public.member_connection_requests
      ),

    'connectionsPending',
      (
        select count(*)
        from public.member_connection_requests
        where status = 'pending'
      ),

    'adminAuditEvents',
      (
        select count(*)
        from public.platform_admin_audit_log
      ),

    'contentAuditEvents',
      (
        select count(*)
        from public.platform_content_audit_log
      ),

    'communityAuditEvents',
      (
        select count(*)
        from public.platform_community_moderation_audit_log
      )
  )
  into result;

  return result;
end;
$$;

revoke all
on function public.get_platform_system_health()
from public;

grant execute
on function public.get_platform_system_health()
to authenticated;


-- ============================================================
-- 3. OWNER ADMIN ROSTER
-- ============================================================

create or replace function
  public.get_platform_admin_roster()
returns table (
  user_id uuid,
  email text,
  arknoz_id text,
  full_name text,
  platform_role text,
  status text,
  granted_at timestamptz,
  updated_at timestamptz,
  granted_by_user_id uuid
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
begin
  if not public.is_platform_owner() then
    raise exception
      'Platform OWNER authority required';
  end if;

  return query
  select
    pa.user_id,
    u.email::text,
    mp.arknoz_id,
    coalesce(
      mp.full_name,
      ''
    ),
    pa.platform_role,
    pa.status,
    pa.granted_at,
    pa.updated_at,
    pa.granted_by_user_id

  from public.platform_admins as pa

  inner join auth.users as u
    on u.id = pa.user_id

  left join public.member_profiles as mp
    on mp.user_id = pa.user_id

  order by
    case pa.platform_role
      when 'OWNER' then 1
      when 'ADMIN' then 2
      when 'EDITOR' then 3
      when 'MODERATOR' then 4
      else 5
    end,
    pa.granted_at asc;
end;
$$;

revoke all
on function public.get_platform_admin_roster()
from public;

grant execute
on function public.get_platform_admin_roster()
to authenticated;


-- ============================================================
-- 4. OWNER CAN GRANT / UPDATE BY EMAIL
-- ============================================================

create or replace function
  public.set_platform_admin_by_email(
    target_email text,
    target_role text,
    target_status text default 'active'
  )
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  resolved_user_id uuid;
  normalized_email text :=
    lower(
      trim(
        coalesce(
          target_email,
          ''
        )
      )
    );
begin
  if not public.is_platform_owner() then
    raise exception
      'Platform OWNER authority required';
  end if;

  if normalized_email = '' then
    raise exception
      'Target email is required';
  end if;

  select u.id
  into resolved_user_id
  from auth.users as u
  where lower(
    coalesce(
      u.email::text,
      ''
    )
  ) = normalized_email
  limit 1;

  if resolved_user_id is null then
    raise exception
      'Arknoz user account not found for this email';
  end if;

  perform public.set_platform_admin(
    resolved_user_id,
    target_role,
    target_status
  );

  return resolved_user_id;
end;
$$;

revoke all
on function public.set_platform_admin_by_email(
  text,
  text,
  text
)
from public;

grant execute
on function public.set_platform_admin_by_email(
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 5. RECENT ADMIN AUTHORITY AUDIT
-- ============================================================

create or replace function
  public.get_platform_admin_audit_recent(
    result_limit integer default 100
  )
returns table (
  audit_id bigint,
  action text,

  actor_user_id uuid,
  actor_email text,

  target_user_id uuid,
  target_email text,

  old_role text,
  new_role text,
  old_status text,
  new_status text,

  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  safe_limit integer :=
    least(
      greatest(
        coalesce(
          result_limit,
          100
        ),
        1
      ),
      500
    );
begin
  if not public.is_platform_owner() then
    raise exception
      'Platform OWNER authority required';
  end if;

  return query
  select
    log.id,
    log.action,

    log.actor_user_id,
    actor.email::text,

    log.target_user_id,
    target.email::text,

    log.old_role,
    log.new_role,
    log.old_status,
    log.new_status,

    log.created_at

  from public.platform_admin_audit_log
    as log

  left join auth.users as actor
    on actor.id =
      log.actor_user_id

  left join auth.users as target
    on target.id =
      log.target_user_id

  order by
    log.created_at desc,
    log.id desc

  limit safe_limit;
end;
$$;

revoke all
on function public.get_platform_admin_audit_recent(
  integer
)
from public;

grant execute
on function public.get_platform_admin_audit_recent(
  integer
)
to authenticated;


-- ============================================================
-- 6. RECENT PHASE-1 OPERATIONS AUDIT
-- ============================================================

create or replace function
  public.get_platform_operations_audit_recent(
    result_limit integer default 100
  )
returns table (
  event_type text,
  action text,
  actor_user_id uuid,
  actor_email text,
  target_label text,
  detail text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  safe_limit integer :=
    least(
      greatest(
        coalesce(
          result_limit,
          100
        ),
        1
      ),
      500
    );
begin
  if not public.is_platform_owner() then
    raise exception
      'Platform OWNER authority required';
  end if;

  return query

  select *
  from (

    select
      'content'::text
        as event_type,

      c.action::text
        as action,

      c.actor_user_id,

      u.email::text
        as actor_email,

      (
        c.entity_type ||
        ':' ||
        c.entity_slug
      )::text
        as target_label,

      coalesce(
        c.new_value::text,
        ''
      )::text
        as detail,

      c.created_at

    from public.platform_content_audit_log
      as c

    left join auth.users as u
      on u.id =
        c.actor_user_id


    union all


    select
      'community'::text
        as event_type,

      'moderate'::text
        as action,

      m.actor_user_id,

      u.email::text
        as actor_email,

      m.connection_request_id::text
        as target_label,

      (
        coalesce(
          m.old_status,
          ''
        ) ||
        ' -> ' ||
        m.new_status ||
        case
          when m.moderation_note is null
            then ''
          else
            ' | ' ||
            m.moderation_note
        end
      )::text
        as detail,

      m.created_at

    from public.platform_community_moderation_audit_log
      as m

    left join auth.users as u
      on u.id =
        m.actor_user_id

  ) as audit

  order by
    audit.created_at desc

  limit safe_limit;
end;
$$;

revoke all
on function public.get_platform_operations_audit_recent(
  integer
)
from public;

grant execute
on function public.get_platform_operations_audit_recent(
  integer
)
to authenticated;


commit;
