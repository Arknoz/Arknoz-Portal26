create table if not exists public.member_conversations (
  id uuid primary key default gen_random_uuid(),

  participant_a_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  participant_b_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  subject text not null default 'Arknoz conversation'
    check (length(subject) <= 240),

  context_path text
    check (
      context_path is null
      or (
        context_path like '/%'
        and context_path not like '//%'
        and length(context_path) <= 500
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (participant_a_user_id <> participant_b_user_id)
);


create table if not exists public.member_messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.member_conversations(id)
    on delete cascade,

  sender_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  body text not null
    check (
      length(trim(body)) between 1 and 3000
    ),

  created_at timestamptz not null default now()
);


create index if not exists member_conversations_a_updated_idx
  on public.member_conversations (
    participant_a_user_id,
    updated_at desc
  );

create index if not exists member_conversations_b_updated_idx
  on public.member_conversations (
    participant_b_user_id,
    updated_at desc
  );

create index if not exists member_messages_conversation_created_idx
  on public.member_messages (
    conversation_id,
    created_at
  );


drop trigger if exists member_conversations_set_updated_at
  on public.member_conversations;

create trigger member_conversations_set_updated_at
before update on public.member_conversations
for each row
execute function public.set_updated_at();


create or replace function public.touch_member_conversation_from_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.member_conversations
  set updated_at = new.created_at
  where id = new.conversation_id;

  return new;
end;
$$;

revoke all
  on function public.touch_member_conversation_from_message()
  from public;


drop trigger if exists member_messages_touch_conversation
  on public.member_messages;

create trigger member_messages_touch_conversation
after insert on public.member_messages
for each row
execute function public.touch_member_conversation_from_message();


alter table public.member_conversations enable row level security;
alter table public.member_messages enable row level security;


drop policy if exists "Participants can read conversations"
  on public.member_conversations;

create policy "Participants can read conversations"
  on public.member_conversations
  for select
  to authenticated
  using (
    auth.uid() = participant_a_user_id
    or auth.uid() = participant_b_user_id
  );


drop policy if exists "Participants can read messages"
  on public.member_messages;

create policy "Participants can read messages"
  on public.member_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.member_conversations conversation
      where conversation.id = member_messages.conversation_id
        and (
          auth.uid() = conversation.participant_a_user_id
          or auth.uid() = conversation.participant_b_user_id
        )
    )
  );


drop policy if exists "Participants can send messages"
  on public.member_messages;

create policy "Participants can send messages"
  on public.member_messages
  for insert
  to authenticated
  with check (
    auth.uid() = sender_user_id
    and exists (
      select 1
      from public.member_conversations conversation
      where conversation.id = member_messages.conversation_id
        and (
          auth.uid() = conversation.participant_a_user_id
          or auth.uid() = conversation.participant_b_user_id
        )
    )
  );


revoke all on table public.member_conversations
  from anon, authenticated;

grant select (
  id,
  subject,
  context_path,
  created_at,
  updated_at
)
  on public.member_conversations
  to authenticated;


revoke all on table public.member_messages
  from anon, authenticated;

grant select (
  id,
  conversation_id,
  sender_user_id,
  body,
  created_at
)
  on public.member_messages
  to authenticated;

grant insert (
  conversation_id,
  sender_user_id,
  body
)
  on public.member_messages
  to authenticated;