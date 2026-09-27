create table if not exists public.member_experiences (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  organisation_entity_id uuid
    references public.entities(id)
    on delete set null,

  experience_type text not null default 'employment'
    check (
      experience_type in (
        'employment',
        'practice',
        'freelance',
        'academic',
        'volunteer',
        'other'
      )
    ),

  role_title text not null
    check (length(role_title) <= 240),

  organisation text not null
    check (length(organisation) <= 240),

  location text
    check (location is null or length(location) <= 240),

  start_date date,
  end_date date,

  is_current boolean not null default false,

  description text not null default ''
    check (length(description) <= 3000),

  verification_state text not null default 'self-declared'
    check (
      verification_state in (
        'self-declared',
        'connected-record',
        'project-backed',
        'organisation-confirmed',
        'credential-verified',
        'professional-body-verified',
        'source-verified'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (
    end_date is null
    or start_date is null
    or end_date >= start_date
  )
);


create table if not exists public.member_credentials (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  issuer_entity_id uuid
    references public.entities(id)
    on delete set null,

  credential_type text not null default 'degree'
    check (
      credential_type in (
        'degree',
        'license',
        'certification',
        'membership',
        'award',
        'other'
      )
    ),

  title text not null
    check (length(title) <= 240),

  issuer text not null
    check (length(issuer) <= 240),

  credential_id text
    check (credential_id is null or length(credential_id) <= 240),

  issue_date date,
  expiry_date date,

  credential_url text
    check (credential_url is null or length(credential_url) <= 500),

  description text not null default ''
    check (length(description) <= 3000),

  verification_state text not null default 'self-declared'
    check (
      verification_state in (
        'self-declared',
        'connected-record',
        'project-backed',
        'organisation-confirmed',
        'credential-verified',
        'professional-body-verified',
        'source-verified'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (
    expiry_date is null
    or issue_date is null
    or expiry_date >= issue_date
  )
);


drop trigger if exists member_experiences_set_updated_at
  on public.member_experiences;

create trigger member_experiences_set_updated_at
before update on public.member_experiences
for each row
execute function public.set_updated_at();


drop trigger if exists member_credentials_set_updated_at
  on public.member_credentials;

create trigger member_credentials_set_updated_at
before update on public.member_credentials
for each row
execute function public.set_updated_at();


alter table public.member_experiences enable row level security;
alter table public.member_credentials enable row level security;


create policy "Members can read own experiences"
  on public.member_experiences
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Members can create own experiences"
  on public.member_experiences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Members can update own experiences"
  on public.member_experiences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Members can delete own experiences"
  on public.member_experiences
  for delete
  to authenticated
  using (auth.uid() = user_id);


create policy "Members can read own credentials"
  on public.member_credentials
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Members can create own credentials"
  on public.member_credentials
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Members can update own credentials"
  on public.member_credentials
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Members can delete own credentials"
  on public.member_credentials
  for delete
  to authenticated
  using (auth.uid() = user_id);


revoke all on table public.member_experiences
  from anon, authenticated;

grant select, delete
  on table public.member_experiences
  to authenticated;

grant insert (
  user_id,
  experience_type,
  role_title,
  organisation,
  location,
  start_date,
  end_date,
  is_current,
  description
)
  on public.member_experiences
  to authenticated;

grant update (
  experience_type,
  role_title,
  organisation,
  location,
  start_date,
  end_date,
  is_current,
  description
)
  on public.member_experiences
  to authenticated;


revoke all on table public.member_credentials
  from anon, authenticated;

grant select, delete
  on table public.member_credentials
  to authenticated;

grant insert (
  user_id,
  credential_type,
  title,
  issuer,
  credential_id,
  issue_date,
  expiry_date,
  credential_url,
  description
)
  on public.member_credentials
  to authenticated;

grant update (
  credential_type,
  title,
  issuer,
  credential_id,
  issue_date,
  expiry_date,
  credential_url,
  description
)
  on public.member_credentials
  to authenticated;