-- Arknoz Collaboration Bridge
-- Arknoz ID members may create and respond to genuine connection requests.
-- Messaging remains separately protected by Arknoz Pro rules.
-- Private auth user IDs are never intended for public exposure.

create table if not exists public.member_connection_requests (
  id uuid primary key default gen_random_uuid(),

  requester_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  recipient_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  request_type text not null default 'connect'
    check (
      request_type in (
        'connect',
        'collaborate',
        'service'
      )
    ),

  context_path text
    check (
      context_path is null
      or (
        context_path like '/%'
        and context_path not like '//%'
        and length(context_path) <= 500
      )
    ),

  note text
    check (
      note is null
      or length(trim(note)) between 1 and 1000
    ),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'accepted',
        'declined',
        'cancelled'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  responded_at timestamptz,

  check (
    requester_user_id <> recipient_user_id
  )
);


create unique index if not exists member_connection_requests_pending_pair_uidx
  on public.member_connection_requests (
    least(requester_user_id, recipient_user_id),
    greatest(requester_user_id, recipient_user_id),
    request_type
  )
  where status = 'pending';


create index if not exists member_connection_requests_recipient_idx
  on public.member_connection_requests (
    recipient_user_id,
    status,
    created_at desc
  );


create index if not exists member_connection_requests_requester_idx
  on public.member_connection_requests (
    requester_user_id,
    status,
    created_at desc
  );


drop trigger if exists member_connection_requests_set_updated_at
  on public.member_connection_requests;

create trigger member_connection_requests_set_updated_at
before update on public.member_connection_requests
for each row
execute function public.set_updated_at();


alter table public.member_connection_requests
  enable row level security;


revoke all
  on table public.member_connection_requests
  from anon, authenticated;

-- ============================================================
-- Secure collaboration request API
-- Browser supplies only a published Person slug.
-- Private auth user IDs are resolved inside SECURITY DEFINER RPCs.
-- ============================================================

create unique index if not exists member_connection_requests_accepted_pair_uidx
  on public.member_connection_requests (
    least(requester_user_id, recipient_user_id),
    greatest(requester_user_id, recipient_user_id)
  )
  where status = 'accepted'
    and request_type = 'connect';


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
declare
  caller_user_id uuid := auth.uid();
  target_user_id uuid;
  new_request_id uuid;
  normalized_kind text := lower(trim(coalesce(request_kind, 'connect')));
begin
  if caller_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.member_profiles p
    inner join public.entities e
      on e.id = p.person_entity_id
    where p.user_id = caller_user_id
      and e.entity_type = 'person'
      and e.content_status = 'published'
  ) then
    raise exception 'Published Arknoz member profile required';
  end if;

  if normalized_kind not in (
    'connect',
    'collaborate',
    'service'
  ) then
    raise exception 'Invalid connection request type';
  end if;

  select p.user_id
  into target_user_id
  from public.member_profiles p
  inner join public.entities e
    on e.id = p.person_entity_id
  where e.entity_type = 'person'
    and e.slug = trim(target_person_slug)
    and e.content_status = 'published'
  limit 1;

  if target_user_id is null then
    raise exception 'Arknoz member not found';
  end if;

  if target_user_id = caller_user_id then
    raise exception 'You cannot connect with yourself';
  end if;

  if normalized_kind = 'connect'
    and exists (
    select 1
    from public.member_connection_requests r
    where r.status = 'accepted'
      and r.request_type = 'connect'
      and (
        (
          r.requester_user_id = caller_user_id
          and r.recipient_user_id = target_user_id
        )
        or
        (
          r.requester_user_id = target_user_id
          and r.recipient_user_id = caller_user_id
        )
      )
  ) then
    raise exception 'These Arknoz members are already connected';
  end if;

  if exists (
    select 1
    from public.member_connection_requests r
    where r.status = 'pending'
      and r.request_type = normalized_kind
      and (
        (
          r.requester_user_id = caller_user_id
          and r.recipient_user_id = target_user_id
        )
        or
        (
          r.requester_user_id = target_user_id
          and r.recipient_user_id = caller_user_id
        )
      )
  ) then
    raise exception 'A connection request is already pending';
  end if;

  insert into public.member_connection_requests (
    requester_user_id,
    recipient_user_id,
    request_type,
    context_path,
    note
  )
  values (
    caller_user_id,
    target_user_id,
    normalized_kind,
    nullif(trim(request_context_path), ''),
    nullif(trim(request_note), '')
  )
  returning id into new_request_id;

  return new_request_id;
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


create or replace function public.respond_member_connection_request(
  connection_request_id uuid,
  response text
)
returns text
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();
  normalized_response text := lower(trim(response));
  resulting_status text;
begin
  if caller_user_id is null then
    raise exception 'Authentication required';
  end if;

  if normalized_response not in (
    'accepted',
    'declined'
  ) then
    raise exception 'Response must be accepted or declined';
  end if;

  update public.member_connection_requests
  set
    status = normalized_response,
    responded_at = now()
  where id = connection_request_id
    and recipient_user_id = caller_user_id
    and status = 'pending'
  returning status into resulting_status;

  if resulting_status is null then
    raise exception 'Pending connection request not found';
  end if;

  return resulting_status;
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
-- Safe member-facing collaboration reader
-- Returns public counterpart identity only.
-- Never returns either participant's auth user_id.
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
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    r.id as request_id,

    case
      when r.requester_user_id = auth.uid()
        then 'outgoing'
      else 'incoming'
    end as direction,

    r.request_type,
    r.status,
    r.context_path,
    r.note,
    r.created_at,
    r.updated_at,
    r.responded_at,

    e.slug as counterpart_slug,
    p.full_name as counterpart_name,
    p.headline as counterpart_headline,
    p.arknoz_id as counterpart_arknoz_id

  from public.member_connection_requests r

  inner join public.member_profiles p
    on p.user_id =
      case
        when r.requester_user_id = auth.uid()
          then r.recipient_user_id
        else r.requester_user_id
      end

  inner join public.entities e
    on e.id = p.person_entity_id

  where auth.uid() is not null
    and (
      r.requester_user_id = auth.uid()
      or r.recipient_user_id = auth.uid()
    )
    and e.entity_type = 'person'
    and e.content_status = 'published'

  order by r.updated_at desc;
$$;


revoke all
  on function public.get_my_member_connections()
  from public;

grant execute
  on function public.get_my_member_connections()
  to authenticated;


comment on function public.get_my_member_connections()
is
'Returns the signed-in Arknoz member connection requests and accepted connections using only public-safe counterpart identity. Auth user IDs are never returned.';

-- ============================================================
-- Accepted connection -> Arknoz Pro conversation bridge
-- One accepted connection may own one private conversation.
-- Existing Pro-to-Pro messaging enforcement remains authoritative.
-- ============================================================

alter table public.member_conversations
  add column if not exists connection_request_id uuid
    references public.member_connection_requests(id)
    on delete set null;


create unique index if not exists member_conversations_connection_request_uidx
  on public.member_conversations (connection_request_id)
  where connection_request_id is not null;


create or replace function public.start_connected_member_conversation(
  accepted_request_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();
  connection_row public.member_connection_requests%rowtype;
  conversation_id uuid;
  conversation_subject text;
begin
  if caller_user_id is null then
    raise exception 'Authentication required';
  end if;

  select *
  into connection_row
  from public.member_connection_requests r
  where r.id = accepted_request_id
    and r.status = 'accepted'
    and (
      r.requester_user_id = caller_user_id
      or r.recipient_user_id = caller_user_id
    )
  limit 1;

  if connection_row.id is null then
    raise exception 'Accepted Arknoz connection not found';
  end if;

  if not public.are_active_pro_members(
    connection_row.requester_user_id,
    connection_row.recipient_user_id
  ) then
    raise exception 'Arknoz Messages requires active Pro membership for both participants';
  end if;

  select c.id
  into conversation_id
  from public.member_conversations c
  where c.connection_request_id = connection_row.id
  limit 1;

  if conversation_id is not null then
    return conversation_id;
  end if;

  conversation_subject :=
    case connection_row.request_type
      when 'service' then 'Arknoz service request'
      when 'collaborate' then 'Arknoz collaboration'
      else 'Arknoz connection'
    end;

  insert into public.member_conversations (
    participant_a_user_id,
    participant_b_user_id,
    subject,
    context_path,
    connection_request_id
  )
  values (
    connection_row.requester_user_id,
    connection_row.recipient_user_id,
    conversation_subject,
    connection_row.context_path,
    connection_row.id
  )
  returning id into conversation_id;

  return conversation_id;
end;
$$;


revoke all
  on function public.start_connected_member_conversation(uuid)
  from public;

grant execute
  on function public.start_connected_member_conversation(uuid)
  to authenticated;


comment on function public.start_connected_member_conversation(uuid)
is
'Creates or returns the private Arknoz Pro conversation for an accepted member connection. Both participants must have active Pro access.';


-- ============================================================
-- Cancel an outgoing pending connection request
-- ============================================================

create or replace function public.cancel_member_connection_request(
  connection_request_id uuid
)
returns text
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();
  resulting_status text;
begin
  if caller_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.member_connection_requests
  set
    status = 'cancelled',
    responded_at = now()
  where id = connection_request_id
    and requester_user_id = caller_user_id
    and status = 'pending'
  returning status into resulting_status;

  if resulting_status is null then
    raise exception 'Pending outgoing connection request not found';
  end if;

  return resulting_status;
end;
$$;


revoke all
  on function public.cancel_member_connection_request(uuid)
  from public;

grant execute
  on function public.cancel_member_connection_request(uuid)
  to authenticated;
