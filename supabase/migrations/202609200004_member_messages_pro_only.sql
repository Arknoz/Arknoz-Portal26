create or replace function public.are_active_pro_members(
  user_a uuid,
  user_b uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    user_a is not null
    and user_b is not null
    and exists (
      select 1
      from auth.users u
      where u.id = user_a
        and upper(
          coalesce(
            u.raw_app_meta_data ->> 'membership',
            ''
          )
        ) = 'PRO'
    )
    and exists (
      select 1
      from auth.users u
      where u.id = user_b
        and upper(
          coalesce(
            u.raw_app_meta_data ->> 'membership',
            ''
          )
        ) = 'PRO'
    );
$$;

revoke all
  on function public.are_active_pro_members(uuid, uuid)
  from public;

grant execute
  on function public.are_active_pro_members(uuid, uuid)
  to authenticated;


create or replace function public.enforce_pro_conversation_pair()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.are_active_pro_members(
    new.participant_a_user_id,
    new.participant_b_user_id
  ) then
    raise exception
      'Arknoz Messages requires active Pro membership for both participants';
  end if;

  return new;
end;
$$;

revoke all
  on function public.enforce_pro_conversation_pair()
  from public;


drop trigger if exists member_conversations_require_pro_pair
  on public.member_conversations;

create trigger member_conversations_require_pro_pair
before insert or update of
  participant_a_user_id,
  participant_b_user_id
on public.member_conversations
for each row
execute function public.enforce_pro_conversation_pair();


drop policy if exists "Participants can read conversations"
  on public.member_conversations;

create policy "Participants can read conversations"
  on public.member_conversations
  for select
  to authenticated
  using (
    (
      auth.uid() = participant_a_user_id
      or auth.uid() = participant_b_user_id
    )
    and public.are_active_pro_members(
      participant_a_user_id,
      participant_b_user_id
    )
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
        and public.are_active_pro_members(
          conversation.participant_a_user_id,
          conversation.participant_b_user_id
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
        and public.are_active_pro_members(
          conversation.participant_a_user_id,
          conversation.participant_b_user_id
        )
    )
  );