-- Arknoz Admin Phase 1
-- Real operational overview + community moderation.
--
-- Paid / Pro commercial administration is intentionally deferred.

begin;


-- ============================================================
-- 1. COMMUNITY MODERATION AUDIT
-- ============================================================

create table if not exists
  public.platform_community_moderation_audit_log (
    id uuid primary key
      default gen_random_uuid(),

    actor_user_id uuid
      references auth.users(id)
      on delete set null,

    -- No FK so audit remains even if member data is later removed.
    connection_request_id uuid not null,

    old_status text,
    new_status text not null,

    moderation_note text,

    created_at timestamptz not null
      default now()
  );

alter table
  public.platform_community_moderation_audit_log
enable row level security;

revoke all
on table public.platform_community_moderation_audit_log
from anon, authenticated;


-- ============================================================
-- 2. COMMUNITY MODERATOR AUTHORITY
-- ============================================================

create or replace function
  public.can_moderate_platform_community()
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
        'MODERATOR'
      )
  );
$$;

revoke all
on function public.can_moderate_platform_community()
from public;

grant execute
on function public.can_moderate_platform_community()
to authenticated;


-- ============================================================
-- 3. REAL ADMIN PHASE-1 OVERVIEW
-- ============================================================

create or replace function
  public.get_platform_phase1_overview()
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

    'totalMembers',
      (
        select count(*)
        from auth.users
      ),

    'newMembers7d',
      (
        select count(*)
        from auth.users
        where created_at >=
          now() - interval '7 days'
      ),

    'newMembers30d',
      (
        select count(*)
        from auth.users
        where created_at >=
          now() - interval '30 days'
      ),

    'activeMembers30d',
      (
        select count(*)
        from auth.users
        where last_sign_in_at >=
          now() - interval '30 days'
      ),

    'suspendedMembers',
      (
        select count(*)
        from public.platform_member_access
        where status = 'suspended'
      ),

    'publicProfiles',
      (
        select count(*)
        from public.member_profiles as p
        inner join public.entities as e
          on e.id = p.person_entity_id
        where e.entity_type = 'person'
          and e.content_status = 'published'
      ),

    'totalContent',
      (
        select count(*)
        from public.entities
      ),

    'publishedContent',
      (
        select count(*)
        from public.entities
        where content_status = 'published'
      ),

    'reviewContent',
      (
        select count(*)
        from public.entities
        where content_status = 'review'
      ),

    'draftContent',
      (
        select count(*)
        from public.entities
        where content_status = 'draft'
      ),

    'projects',
      (
        select count(*)
        from public.entities
        where entity_type = 'project'
      ),

    'products',
      (
        select count(*)
        from public.entities
        where entity_type = 'product'
      ),

    'knowledge',
      (
        select count(*)
        from public.entities
        where entity_type = 'knowledge'
      ),

    'people',
      (
        select count(*)
        from public.entities
        where entity_type = 'person'
      ),

    'organisations',
      (
        select count(*)
        from public.entities
        where entity_type = 'organisation'
      ),

    'universities',
      (
        select count(*)
        from public.entities
        where entity_type = 'university'
      ),

    'opportunities',
      (
        select count(*)
        from public.entities
        where entity_type = 'opportunity'
      ),

    'places',
      (
        select count(*)
        from public.entities
        where entity_type = 'place'
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

    'connectionsAccepted',
      (
        select count(*)
        from public.member_connection_requests
        where status = 'accepted'
      ),

    'connectionRequests7d',
      (
        select count(*)
        from public.member_connection_requests
        where created_at >=
          now() - interval '7 days'
      )
  )
  into result;

  return result;
end;
$$;

revoke all
on function public.get_platform_phase1_overview()
from public;

grant execute
on function public.get_platform_phase1_overview()
to authenticated;


-- ============================================================
-- 4. COMMUNITY SUMMARY
-- ============================================================

create or replace function
  public.get_platform_community_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  result jsonb;
begin
  if not public.can_moderate_platform_community() then
    raise exception
      'Platform community moderation authority required';
  end if;

  select jsonb_build_object(
    'total',
      count(*),

    'pending',
      count(*) filter (
        where status = 'pending'
      ),

    'accepted',
      count(*) filter (
        where status = 'accepted'
      ),

    'declined',
      count(*) filter (
        where status = 'declined'
      ),

    'cancelled',
      count(*) filter (
        where status = 'cancelled'
      ),

    'new7d',
      count(*) filter (
        where created_at >=
          now() - interval '7 days'
      ),

    'connect',
      count(*) filter (
        where request_type = 'connect'
      ),

    'collaborate',
      count(*) filter (
        where request_type = 'collaborate'
      ),

    'service',
      count(*) filter (
        where request_type = 'service'
      )
  )
  into result
  from public.member_connection_requests;

  return result;
end;
$$;

revoke all
on function public.get_platform_community_summary()
from public;

grant execute
on function public.get_platform_community_summary()
to authenticated;


-- ============================================================
-- 5. COMMUNITY CONNECTION DIRECTORY
-- ============================================================

create or replace function
  public.get_platform_community_connections(
    search_text text default null,
    filter_status text default null,
    filter_request_type text default null,
    result_limit integer default 100,
    result_offset integer default 0
  )
returns table (
  request_id uuid,
  request_type text,
  status text,
  context_path text,
  note text,

  requester_arknoz_id text,
  requester_name text,

  recipient_arknoz_id text,
  recipient_name text,

  created_at timestamptz,
  updated_at timestamptz,
  responded_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  normalized_search text :=
    nullif(
      lower(
        trim(
          coalesce(
            search_text,
            ''
          )
        )
      ),
      ''
    );

  normalized_status text :=
    nullif(
      lower(
        trim(
          coalesce(
            filter_status,
            ''
          )
        )
      ),
      ''
    );

  normalized_type text :=
    nullif(
      lower(
        trim(
          coalesce(
            filter_request_type,
            ''
          )
        )
      ),
      ''
    );

  safe_limit integer :=
    least(
      greatest(
        coalesce(
          result_limit,
          100
        ),
        1
      ),
      200
    );

  safe_offset integer :=
    greatest(
      coalesce(
        result_offset,
        0
      ),
      0
    );
begin
  if not public.can_moderate_platform_community() then
    raise exception
      'Platform community moderation authority required';
  end if;

  return query
  select
    r.id,
    r.request_type,
    r.status,
    r.context_path,
    r.note,

    requester.arknoz_id,
    coalesce(
      requester.full_name,
      ''
    ),

    recipient.arknoz_id,
    coalesce(
      recipient.full_name,
      ''
    ),

    r.created_at,
    r.updated_at,
    r.responded_at

  from public.member_connection_requests
    as r

  left join public.member_profiles
    as requester
    on requester.user_id =
      r.requester_user_id

  left join public.member_profiles
    as recipient
    on recipient.user_id =
      r.recipient_user_id

  where
    (
      normalized_status is null
      or r.status =
        normalized_status
    )

    and (
      normalized_type is null
      or r.request_type =
        normalized_type
    )

    and (
      normalized_search is null

      or lower(
        coalesce(
          requester.arknoz_id,
          ''
        )
      ) like
        '%' ||
        normalized_search ||
        '%'

      or lower(
        coalesce(
          requester.full_name,
          ''
        )
      ) like
        '%' ||
        normalized_search ||
        '%'

      or lower(
        coalesce(
          recipient.arknoz_id,
          ''
        )
      ) like
        '%' ||
        normalized_search ||
        '%'

      or lower(
        coalesce(
          recipient.full_name,
          ''
        )
      ) like
        '%' ||
        normalized_search ||
        '%'

      or lower(
        coalesce(
          r.context_path,
          ''
        )
      ) like
        '%' ||
        normalized_search ||
        '%'
    )

  order by
    r.updated_at desc,
    r.id desc

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function
  public.get_platform_community_connections(
    text,
    text,
    text,
    integer,
    integer
  )
from public;

grant execute
on function
  public.get_platform_community_connections(
    text,
    text,
    text,
    integer,
    integer
  )
to authenticated;


-- ============================================================
-- 6. SAFE PHASE-1 MODERATION ACTION
-- ============================================================
--
-- Accepted relationships are not force-broken here because
-- an accepted request may already own a private conversation.
-- Phase 1 Admin may cancel pending requests.
-- Suspicious active members can separately be suspended through
-- Members Admin.

create or replace function
  public.cancel_platform_connection_request_admin(
    target_request_id uuid,
    moderation_note text
  )
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  actor_id uuid :=
    auth.uid();

  old_status_value text;
  normalized_note text :=
    nullif(
      trim(
        coalesce(
          moderation_note,
          ''
        )
      ),
      ''
    );
begin
  if not public.can_moderate_platform_community() then
    raise exception
      'Platform community moderation authority required';
  end if;

  if normalized_note is null then
    raise exception
      'Moderation note is required';
  end if;

  if length(normalized_note) > 1000 then
    raise exception
      'Moderation note is too long';
  end if;

  select status
  into old_status_value
  from public.member_connection_requests
  where id =
    target_request_id
  for update;

  if old_status_value is null then
    raise exception
      'Connection request not found';
  end if;

  if old_status_value <> 'pending' then
    raise exception
      'Only pending connection requests can be cancelled by Phase 1 moderation';
  end if;

  update public.member_connection_requests
  set status = 'cancelled'
  where id =
    target_request_id;

  insert into
    public.platform_community_moderation_audit_log (
      actor_user_id,
      connection_request_id,
      old_status,
      new_status,
      moderation_note
    )
  values (
    actor_id,
    target_request_id,
    old_status_value,
    'cancelled',
    normalized_note
  );
end;
$$;

revoke all
on function
  public.cancel_platform_connection_request_admin(
    uuid,
    text
  )
from public;

grant execute
on function
  public.cancel_platform_connection_request_admin(
    uuid,
    text
  )
to authenticated;


commit;
