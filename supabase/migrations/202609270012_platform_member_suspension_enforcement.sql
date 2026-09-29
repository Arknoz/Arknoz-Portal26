-- Arknoz Platform Member Suspension Enforcement
--
-- Depends on:
--   202609270010_platform_member_access_control.sql
--
-- Purpose:
-- 1. Suspended members cannot use private member data.
-- 2. Suspended members cannot use organisation/team workspaces.
-- 3. Arknoz Messages requires both participants to be
--    ACTIVE Arknoz Pro members.
-- 4. Connection/collaboration RPCs reject suspended callers.
--
-- Public canonical content is intentionally NOT unpublished here.
-- Content moderation remains a separate Admin concern.

begin;


-- ============================================================
-- 1. RESTRICT PRIVATE MEMBER + WORKSPACE TABLE ACCESS
-- ============================================================
--
-- Existing policies remain intact.
-- This RESTRICTIVE policy is AND-ed with every existing
-- permissive policy for authenticated users.
--
-- SECURITY DEFINER Admin read functions remain unaffected.

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'member_actions',
    'member_profiles',
    'member_experiences',
    'member_credentials',
    'member_services',
    'member_connection_requests',
    'member_conversations',
    'member_messages',
    'organisation_workspaces',
    'organisation_workspace_members',
    'organisation_workspace_records',
    'team_assignments',
    'team_panel_records'
  ]
  loop
    if to_regclass(
      'public.' || target_table
    ) is not null then

      execute format(
        'alter table public.%I enable row level security',
        target_table
      );

      execute format(
        'drop policy if exists %I on public.%I',
        'Active platform members only',
        target_table
      );

      execute format(
        $policy$
          create policy %I
          on public.%I
          as restrictive
          for all
          to authenticated
          using (
            public.is_platform_member_active(
              auth.uid()
            )
          )
          with check (
            public.is_platform_member_active(
              auth.uid()
            )
          )
        $policy$,
        'Active platform members only',
        target_table
      );

    end if;
  end loop;
end;
$$;


-- ============================================================
-- 2. MESSAGES = BOTH ACTIVE + BOTH PRO
-- ============================================================

create or replace function public.are_active_pro_members(
  user_a uuid,
  user_b uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    user_a is not null
    and user_b is not null

    and public.is_active_pro_member(
      user_a
    )

    and public.is_active_pro_member(
      user_b
    );
$$;

revoke all
on function public.are_active_pro_members(
  uuid,
  uuid
)
from public;

grant execute
on function public.are_active_pro_members(
  uuid,
  uuid
)
to authenticated;


-- ============================================================
-- 3. PRESERVE EXISTING CONNECTION IMPLEMENTATION
--    BEHIND ACTIVE-MEMBER WRAPPERS
-- ============================================================

do $$
begin

  if
    to_regprocedure(
      'public.create_member_connection_request(text,text,text,text)'
    ) is not null
    and
    to_regprocedure(
      'public.create_member_connection_request_unchecked(text,text,text,text)'
    ) is null
  then
    alter function
      public.create_member_connection_request(
        text,
        text,
        text,
        text
      )
    rename to
      create_member_connection_request_unchecked;
  end if;


  if
    to_regprocedure(
      'public.respond_member_connection_request(uuid,text)'
    ) is not null
    and
    to_regprocedure(
      'public.respond_member_connection_request_unchecked(uuid,text)'
    ) is null
  then
    alter function
      public.respond_member_connection_request(
        uuid,
        text
      )
    rename to
      respond_member_connection_request_unchecked;
  end if;


  if
    to_regprocedure(
      'public.get_my_member_connections()'
    ) is not null
    and
    to_regprocedure(
      'public.get_my_member_connections_unchecked()'
    ) is null
  then
    alter function
      public.get_my_member_connections()
    rename to
      get_my_member_connections_unchecked;
  end if;


  if
    to_regprocedure(
      'public.start_connected_member_conversation(uuid)'
    ) is not null
    and
    to_regprocedure(
      'public.start_connected_member_conversation_unchecked(uuid)'
    ) is null
  then
    alter function
      public.start_connected_member_conversation(
        uuid
      )
    rename to
      start_connected_member_conversation_unchecked;
  end if;


  if
    to_regprocedure(
      'public.cancel_member_connection_request(uuid)'
    ) is not null
    and
    to_regprocedure(
      'public.cancel_member_connection_request_unchecked(uuid)'
    ) is null
  then
    alter function
      public.cancel_member_connection_request(
        uuid
      )
    rename to
      cancel_member_connection_request_unchecked;
  end if;

end;
$$;


-- ============================================================
-- 4. HIDE UNCHECKED CONNECTION FUNCTIONS
-- ============================================================

revoke all
on function public.create_member_connection_request_unchecked(
  text,
  text,
  text,
  text
)
from public, authenticated;

revoke all
on function public.respond_member_connection_request_unchecked(
  uuid,
  text
)
from public, authenticated;

revoke all
on function public.get_my_member_connections_unchecked()
from public, authenticated;

revoke all
on function public.start_connected_member_conversation_unchecked(
  uuid
)
from public, authenticated;

revoke all
on function public.cancel_member_connection_request_unchecked(
  uuid
)
from public, authenticated;


-- ============================================================
-- 5. CREATE CONNECTION REQUEST
-- ============================================================

create or replace function public.create_member_connection_request(
  target_person_slug text,
  request_kind text default 'connect',
  request_context_path text default null,
  request_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception
      'Authentication required';
  end if;

  if not public.is_platform_member_active(
    auth.uid()
  ) then
    raise exception
      'Arknoz member access is suspended';
  end if;

  return
    public.create_member_connection_request_unchecked(
      target_person_slug,
      request_kind,
      request_context_path,
      request_note
    );
end;
$$;

revoke all
on function public.create_member_connection_request(
  text,
  text,
  text,
  text
)
from public;

grant execute
on function public.create_member_connection_request(
  text,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 6. RESPOND TO CONNECTION REQUEST
-- ============================================================

create or replace function public.respond_member_connection_request(
  connection_request_id uuid,
  response text
)
returns text
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception
      'Authentication required';
  end if;

  if not public.is_platform_member_active(
    auth.uid()
  ) then
    raise exception
      'Arknoz member access is suspended';
  end if;

  return
    public.respond_member_connection_request_unchecked(
      connection_request_id,
      response
    );
end;
$$;

revoke all
on function public.respond_member_connection_request(
  uuid,
  text
)
from public;

grant execute
on function public.respond_member_connection_request(
  uuid,
  text
)
to authenticated;


-- ============================================================
-- 7. READ MY CONNECTIONS
-- ============================================================

create or replace function public.get_my_member_connections()
returns table (
  request_id uuid,
  direction text,
  request_type text,
  status text,
  context_path text,
  note text,
  created_at timestamptz,
  updated_at timestamptz,
  responded_at timestamptz,
  counterpart_slug text,
  counterpart_name text,
  counterpart_headline text,
  counterpart_arknoz_id text
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception
      'Authentication required';
  end if;

  if not public.is_platform_member_active(
    auth.uid()
  ) then
    raise exception
      'Arknoz member access is suspended';
  end if;

  return query
  select
    connection_row.request_id,
    connection_row.direction,
    connection_row.request_type,
    connection_row.status,
    connection_row.context_path,
    connection_row.note,
    connection_row.created_at,
    connection_row.updated_at,
    connection_row.responded_at,
    connection_row.counterpart_slug,
    connection_row.counterpart_name,
    connection_row.counterpart_headline,
    connection_row.counterpart_arknoz_id

  from
    public.get_my_member_connections_unchecked()
      as connection_row;
end;
$$;

revoke all
on function public.get_my_member_connections()
from public;

grant execute
on function public.get_my_member_connections()
to authenticated;


-- ============================================================
-- 8. START CONNECTED CONVERSATION
-- ============================================================

create or replace function public.start_connected_member_conversation(
  accepted_request_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception
      'Authentication required';
  end if;

  if not public.is_platform_member_active(
    auth.uid()
  ) then
    raise exception
      'Arknoz member access is suspended';
  end if;

  return
    public.start_connected_member_conversation_unchecked(
      accepted_request_id
    );
end;
$$;

revoke all
on function public.start_connected_member_conversation(
  uuid
)
from public;

grant execute
on function public.start_connected_member_conversation(
  uuid
)
to authenticated;


-- ============================================================
-- 9. CANCEL CONNECTION REQUEST
-- ============================================================

create or replace function public.cancel_member_connection_request(
  connection_request_id uuid
)
returns text
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception
      'Authentication required';
  end if;

  if not public.is_platform_member_active(
    auth.uid()
  ) then
    raise exception
      'Arknoz member access is suspended';
  end if;

  return
    public.cancel_member_connection_request_unchecked(
      connection_request_id
    );
end;
$$;

revoke all
on function public.cancel_member_connection_request(
  uuid
)
from public;

grant execute
on function public.cancel_member_connection_request(
  uuid
)
to authenticated;


commit;
