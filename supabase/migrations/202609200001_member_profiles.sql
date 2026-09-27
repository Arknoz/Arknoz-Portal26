create table if not exists public.member_profiles (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  person_entity_id uuid unique
    references public.entities(id)
    on delete set null,

  full_name text not null default ''
    check (length(full_name) <= 160),

  stage text not null default 'professional'
    check (
      stage in (
        'student',
        'graduate',
        'professional',
        'specialist',
        'academic',
        'educator',
        'independent'
      )
    ),

  headline text not null default ''
    check (length(headline) <= 240),

  organisation text
    check (organisation is null or length(organisation) <= 240),

  location text not null default ''
    check (length(location) <= 240),

  about text not null default ''
    check (length(about) <= 3000),

  disciplines text[] not null default '{}'::text[],
  sectors text[] not null default '{}'::text[],
  skills text[] not null default '{}'::text[],
  languages text[] not null default '{}'::text[],

  years_experience integer
    check (
      years_experience is null
      or years_experience between 0 and 80
    ),

  countries text[] not null default '{}'::text[],

  website text
    check (website is null or length(website) <= 500),

  portfolio_url text
    check (portfolio_url is null or length(portfolio_url) <= 500),

  linkedin_url text
    check (linkedin_url is null or length(linkedin_url) <= 500),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


drop trigger if exists member_profiles_set_updated_at
  on public.member_profiles;

create trigger member_profiles_set_updated_at
before update on public.member_profiles
for each row
execute function public.set_updated_at();


alter table public.member_profiles enable row level security;


drop policy if exists "Members can read own profile"
  on public.member_profiles;

create policy "Members can read own profile"
  on public.member_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);


drop policy if exists "Members can create own profile"
  on public.member_profiles;

create policy "Members can create own profile"
  on public.member_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);


drop policy if exists "Members can update own profile"
  on public.member_profiles;

create policy "Members can update own profile"
  on public.member_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


revoke all on table public.member_profiles
  from anon, authenticated;

grant select
  on table public.member_profiles
  to authenticated;

grant insert (
  user_id,
  full_name,
  stage,
  headline,
  organisation,
  location,
  about,
  disciplines,
  sectors,
  skills,
  languages,
  years_experience,
  countries,
  website,
  portfolio_url,
  linkedin_url
)
  on public.member_profiles
  to authenticated;

grant update (
  full_name,
  stage,
  headline,
  organisation,
  location,
  about,
  disciplines,
  sectors,
  skills,
  languages,
  years_experience,
  countries,
  website,
  portfolio_url,
  linkedin_url
)
  on public.member_profiles
  to authenticated;
