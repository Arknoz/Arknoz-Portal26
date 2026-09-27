create or replace function public.is_active_pro_member(
  member_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users u
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


create table if not exists public.member_services (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  service_type text not null
    check (
      service_type in (
        'consultation',
        'packaged_service',
        'request_a_proposal'
      )
    ),

  title text not null
    check (
      length(trim(title)) between 1 and 240
    ),

  summary text not null default ''
    check (
      length(summary) <= 2000
    ),

  availability text not null default ''
    check (
      length(availability) <= 240
    ),

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'published'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists
  member_services_user_updated_idx
on public.member_services (
  user_id,
  updated_at desc
);


drop trigger if exists
  member_services_set_updated_at
on public.member_services;

create trigger
  member_services_set_updated_at
before update on public.member_services
for each row
execute function public.set_updated_at();


alter table public.member_services
enable row level security;


drop policy if exists
  "Pro members can read own services"
on public.member_services;

create policy
  "Pro members can read own services"
on public.member_services
for select
to authenticated
using (
  auth.uid() = user_id
  and public.is_active_pro_member(
    auth.uid()
  )
);


drop policy if exists
  "Pro members can create own services"
on public.member_services;

create policy
  "Pro members can create own services"
on public.member_services
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.is_active_pro_member(
    auth.uid()
  )
);


drop policy if exists
  "Pro members can update own services"
on public.member_services;

create policy
  "Pro members can update own services"
on public.member_services
for update
to authenticated
using (
  auth.uid() = user_id
  and public.is_active_pro_member(
    auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and public.is_active_pro_member(
    auth.uid()
  )
);


drop policy if exists
  "Pro members can delete own services"
on public.member_services;

create policy
  "Pro members can delete own services"
on public.member_services
for delete
to authenticated
using (
  auth.uid() = user_id
  and public.is_active_pro_member(
    auth.uid()
  )
);


revoke all
on table public.member_services
from anon, authenticated;


grant select, delete
on table public.member_services
to authenticated;


grant insert (
  user_id,
  service_type,
  title,
  summary,
  availability,
  status
)
on public.member_services
to authenticated;


grant update (
  service_type,
  title,
  summary,
  availability,
  status
)
on public.member_services
to authenticated;