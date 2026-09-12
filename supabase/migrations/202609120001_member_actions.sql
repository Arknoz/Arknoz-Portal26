create table if not exists public.member_actions (
  user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null
    check (action_type in ('save', 'follow')),
  target_path text not null
    check (
      target_path like '/%'
      and target_path not like '//%'
      and length(target_path) <= 500
    ),
  created_at timestamptz not null default now(),

  primary key (user_id, action_type, target_path)
);

alter table public.member_actions enable row level security;

drop policy if exists "Members can read own actions"
  on public.member_actions;

create policy "Members can read own actions"
  on public.member_actions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Members can create own actions"
  on public.member_actions;

create policy "Members can create own actions"
  on public.member_actions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Members can delete own actions"
  on public.member_actions;

create policy "Members can delete own actions"
  on public.member_actions
  for delete
  to authenticated
  using (auth.uid() = user_id);

revoke all on table public.member_actions from anon;

grant select, insert, delete
  on table public.member_actions
  to authenticated;

create index if not exists member_actions_user_action_idx
  on public.member_actions (user_id, action_type);