-- Arknoz platform placement and advertising inventory
--
-- Existing Arknoz identity:
--   slot template + context = exact permanent position
--
-- Example:
--   CITY-P01 + mumbai
--   => CITY-P01::mumbai
--
-- Exact slot instances are materialized only when operationally needed.
-- Do not pre-create every possible geography/page position.

begin;

-- ============================================================
-- 1. EXACT SLOT INSTANCES
-- ============================================================

create table if not exists public.platform_placement_slot_instances (
  id uuid primary key
    default gen_random_uuid(),

  instance_key text not null unique,

  slot_id text not null,
  context_key text not null,

  surface_id text,
  context_type text,
  page_path text,

  paid_eligible boolean not null
    default false,

  inventory_status text not null
    default 'available'
    check (
      inventory_status in (
        'available',
        'reserved',
        'occupied',
        'paused',
        'disabled'
      )
    ),

  created_by_user_id uuid
    references auth.users(id)
    on delete set null,

  updated_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint platform_placement_slot_identity_unique
    unique (
      slot_id,
      context_key
    ),

  constraint platform_placement_slot_id_normalized
    check (
      slot_id = upper(trim(slot_id))
    ),

  constraint platform_placement_context_normalized
    check (
      context_key = lower(trim(context_key))
    ),

  constraint platform_placement_instance_key_consistent
    check (
      instance_key =
        slot_id || '::' || context_key
    )
);

create index if not exists
  platform_placement_slots_surface_idx
on public.platform_placement_slot_instances (
  surface_id,
  context_type
);

create index if not exists
  platform_placement_slots_status_idx
on public.platform_placement_slot_instances (
  inventory_status,
  paid_eligible
);

create index if not exists
  platform_placement_slots_context_idx
on public.platform_placement_slot_instances (
  context_key
);


-- ============================================================
-- 2. CAMPAIGNS
-- One campaign may control one slot or millions of slots.
-- ============================================================

create table if not exists public.platform_placement_campaigns (
  id uuid primary key
    default gen_random_uuid(),

  name text not null,

  campaign_type text not null
    check (
      campaign_type in (
        'editorial',
        'sponsored',
        'partner',
        'featured',
        'house'
      )
    ),

  advertiser_name text,

  status text not null
    default 'draft'
    check (
      status in (
        'draft',
        'scheduled',
        'live',
        'paused',
        'completed',
        'cancelled'
      )
    ),

  starts_at timestamptz,
  ends_at timestamptz,

  currency_code text
    check (
      currency_code is null
      or currency_code ~ '^[A-Z]{3}$'
    ),

  budget_minor bigint
    check (
      budget_minor is null
      or budget_minor >= 0
    ),

  notes text,

  created_by_user_id uuid
    references auth.users(id)
    on delete set null,

  updated_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint platform_campaign_date_order
    check (
      ends_at is null
      or starts_at is null
      or ends_at > starts_at
    )
);

create index if not exists
  platform_placement_campaign_status_idx
on public.platform_placement_campaigns (
  status,
  starts_at,
  ends_at
);


-- ============================================================
-- 3. CAMPAIGN CREATIVES
-- Creative is separate from slot identity.
-- The same creative may be assigned to many exact positions.
-- ============================================================

create table if not exists public.platform_placement_creatives (
  id uuid primary key
    default gen_random_uuid(),

  campaign_id uuid not null
    references public.platform_placement_campaigns(id)
    on delete cascade,

  name text not null,

  headline text,
  body_text text,
  image_url text,
  destination_url text,
  cta_label text,

  status text not null
    default 'draft'
    check (
      status in (
        'draft',
        'approved',
        'paused',
        'retired'
      )
    ),

  created_by_user_id uuid
    references auth.users(id)
    on delete set null,

  updated_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);

create index if not exists
  platform_placement_creatives_campaign_idx
on public.platform_placement_creatives (
  campaign_id,
  status
);


-- ============================================================
-- 4. EXACT SLOT ASSIGNMENTS
--
-- Assignment target is either:
-- A. canonical Arknoz entity
-- B. campaign creative
--
-- Organic entity visibility remains independent.
-- ============================================================

create table if not exists public.platform_placement_assignments (
  id uuid primary key
    default gen_random_uuid(),

  slot_instance_id uuid not null
    references public.platform_placement_slot_instances(id)
    on delete cascade,

  campaign_id uuid
    references public.platform_placement_campaigns(id)
    on delete set null,

  creative_id uuid
    references public.platform_placement_creatives(id)
    on delete set null,

  canonical_entity_type text,
  canonical_entity_slug text,

  placement_type text not null
    check (
      placement_type in (
        'editorial',
        'sponsored',
        'partner',
        'featured',
        'house'
      )
    ),

  status text not null
    default 'draft'
    check (
      status in (
        'draft',
        'scheduled',
        'live',
        'paused',
        'expired',
        'cancelled'
      )
    ),

  replaceable boolean not null
    default true,

  paid_lock boolean not null
    default false,

  starts_at timestamptz,
  ends_at timestamptz,

  created_by_user_id uuid
    references auth.users(id)
    on delete set null,

  updated_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint platform_assignment_target_required
    check (
      (
        creative_id is not null
        and canonical_entity_type is null
        and canonical_entity_slug is null
      )
      or
      (
        creative_id is null
        and canonical_entity_type is not null
        and canonical_entity_slug is not null
      )
    ),

  constraint platform_assignment_date_order
    check (
      ends_at is null
      or starts_at is null
      or ends_at > starts_at
    ),

  constraint platform_paid_lock_explicit
    check (
      paid_lock = false
      or placement_type in (
        'sponsored',
        'partner',
        'featured'
      )
    )
);

-- Mirrors existing Arknoz rule:
-- one active assignment per exact slot/context.
create unique index if not exists
  platform_one_live_assignment_per_slot_idx
on public.platform_placement_assignments (
  slot_instance_id
)
where status = 'live';

create index if not exists
  platform_placement_assignments_campaign_idx
on public.platform_placement_assignments (
  campaign_id,
  status
);

create index if not exists
  platform_placement_assignments_schedule_idx
on public.platform_placement_assignments (
  starts_at,
  ends_at,
  status
);


-- ============================================================
-- 5. SECURITY
-- No direct browser mutation or table browsing.
-- Admin RPCs will expose controlled operations.
-- ============================================================

alter table public.platform_placement_slot_instances
  enable row level security;

alter table public.platform_placement_campaigns
  enable row level security;

alter table public.platform_placement_creatives
  enable row level security;

alter table public.platform_placement_assignments
  enable row level security;

revoke all
on table public.platform_placement_slot_instances
from anon, authenticated;

revoke all
on table public.platform_placement_campaigns
from anon, authenticated;

revoke all
on table public.platform_placement_creatives
from anon, authenticated;

revoke all
on table public.platform_placement_assignments
from anon, authenticated;


-- ============================================================
-- 6. OWNER / ADMIN COMMERCIAL AUTHORITY HELPER
-- ============================================================

create or replace function public.can_manage_platform_placements()
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
        'ADMIN'
      )
  );
$$;

revoke all
on function public.can_manage_platform_placements()
from public;

grant execute
on function public.can_manage_platform_placements()
to authenticated;


-- ============================================================
-- 7. LAZY SLOT INSTANCE MATERIALIZATION
--
-- Calling this for CITY-P01 + mumbai creates exactly one
-- permanent inventory record:
-- CITY-P01::mumbai
--
-- Repeated calls return the same instance.
-- ============================================================

create or replace function public.ensure_platform_placement_slot(
  target_slot_id text,
  target_context_key text,
  target_surface_id text default null,
  target_context_type text default null,
  target_page_path text default null,
  target_paid_eligible boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_slot_id text :=
    upper(trim(target_slot_id));

  normalized_context_key text :=
    lower(trim(target_context_key));

  exact_instance_key text;

  resolved_id uuid;
begin
  if caller_user_id is null then
    raise exception
      'Authentication required';
  end if;

  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = caller_user_id
      and pa.status = 'active'
      and pa.platform_role in (
        'OWNER',
        'ADMIN'
      )
  ) then
    raise exception
      'Platform placement authority required';
  end if;

  if normalized_slot_id is null
     or normalized_slot_id = ''
  then
    raise exception
      'Slot ID is required';
  end if;

  if normalized_context_key is null
     or normalized_context_key = ''
  then
    raise exception
      'Context key is required';
  end if;

  exact_instance_key :=
    normalized_slot_id
    || '::'
    || normalized_context_key;

  insert into public.platform_placement_slot_instances (
    instance_key,
    slot_id,
    context_key,
    surface_id,
    context_type,
    page_path,
    paid_eligible,
    created_by_user_id,
    updated_by_user_id
  )
  values (
    exact_instance_key,
    normalized_slot_id,
    normalized_context_key,
    nullif(trim(target_surface_id), ''),
    nullif(lower(trim(target_context_type)), ''),
    nullif(trim(target_page_path), ''),
    target_paid_eligible,
    caller_user_id,
    caller_user_id
  )
  on conflict (
    slot_id,
    context_key
  )
  do update set
    surface_id =
      coalesce(
        excluded.surface_id,
        public.platform_placement_slot_instances.surface_id
      ),
    context_type =
      coalesce(
        excluded.context_type,
        public.platform_placement_slot_instances.context_type
      ),
    page_path =
      coalesce(
        excluded.page_path,
        public.platform_placement_slot_instances.page_path
      ),
    updated_by_user_id =
      caller_user_id,
    updated_at =
      now()
  returning id
  into resolved_id;

  return resolved_id;
end;
$$;

revoke all
on function public.ensure_platform_placement_slot(
  text,
  text,
  text,
  text,
  text,
  boolean
)
from public;

grant execute
on function public.ensure_platform_placement_slot(
  text,
  text,
  text,
  text,
  text,
  boolean
)
to authenticated;

commit;
