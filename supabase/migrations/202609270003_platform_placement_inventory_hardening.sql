-- Arknoz placement inventory hardening
--
-- The frozen placement-slot registry becomes the authoritative
-- template vocabulary for database materialized slot instances.

begin;

-- ============================================================
-- 1. REGISTERED SLOT TEMPLATES
-- ============================================================

create table if not exists public.platform_placement_slot_templates (
  slot_id text primary key,

  surface_id text not null,
  component_name text not null,
  slot_role text not null,

  position integer not null
    check (position > 0),

  scope_mode text not null,
  context_type text,
  route_pattern text,

  status text not null
    default 'active'
    check (
      status in (
        'active',
        'disabled'
      )
    ),

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);

insert into public.platform_placement_slot_templates (
  slot_id,
  surface_id,
  component_name,
  slot_role,
  position,
  scope_mode,
  context_type,
  route_pattern
)
values
  ('HOME-P01', 'HOME', 'GlobalHero', 'lead', 1, 'global', null, '/'),
  ('HOME-P02', 'HOME', 'GlobalHero', 'secondary', 2, 'global', null, '/'),
  ('HOME-P03', 'HOME', 'M01WorldFeatureSplit', 'featured', 1, 'global', null, '/'),
  ('HOME-P04', 'HOME', 'M01WorldFeatureSplit', 'featured', 2, 'global', null, '/'),
  ('HOME-P05', 'HOME', 'M01WorldFeatureSplit', 'featured', 3, 'global', null, '/'),
  ('HOME-P06', 'HOME', 'EditorsChoice', 'lead', 1, 'global', null, '/'),
  ('HOME-P07', 'HOME', 'EditorsChoice', 'secondary', 2, 'global', null, '/'),
  ('HOME-P08', 'HOME', 'EditorsChoice', 'secondary', 3, 'global', null, '/'),
  ('HOME-P09', 'HOME', 'EditorsChoice', 'secondary', 4, 'global', null, '/'),
  ('HOME-P10', 'HOME', 'BuiltWorldPulse', 'pulse', 1, 'global', null, '/'),
  ('HOME-P11', 'HOME', 'BuiltWorldPulse', 'pulse', 2, 'global', null, '/'),
  ('HOME-P12', 'HOME', 'BuiltWorldPulse', 'pulse', 3, 'global', null, '/'),
  ('GLOBAL-P01', 'GLOBAL', 'UniversalTopicHero', 'featured', 1, 'global', null, '/global'),
  ('GLOBAL-P02', 'GLOBAL', 'UniversalTopicHero', 'featured', 2, 'global', null, '/global'),
  ('GLOBAL-P03', 'GLOBAL', 'UniversalTopicHero', 'featured', 3, 'global', null, '/global'),
  ('CONTINENT-P01', 'CONTINENT', 'UniversalTopicHero', 'featured', 1, 'geography_context', 'continent', '/global/{continent}'),
  ('CONTINENT-P02', 'CONTINENT', 'UniversalTopicHero', 'featured', 2, 'geography_context', 'continent', '/global/{continent}'),
  ('CONTINENT-P03', 'CONTINENT', 'UniversalTopicHero', 'featured', 3, 'geography_context', 'continent', '/global/{continent}'),
  ('COUNTRY-P01', 'COUNTRY', 'UniversalTopicHero', 'featured', 1, 'geography_context', 'country', '/global/{country}'),
  ('COUNTRY-P02', 'COUNTRY', 'UniversalTopicHero', 'featured', 2, 'geography_context', 'country', '/global/{country}'),
  ('COUNTRY-P03', 'COUNTRY', 'UniversalTopicHero', 'featured', 3, 'geography_context', 'country', '/global/{country}'),
  ('CITY-P01', 'CITY', 'UniversalTopicHero', 'featured', 1, 'geography_context', 'city', '/global/{city}'),
  ('CITY-P02', 'CITY', 'UniversalTopicHero', 'featured', 2, 'geography_context', 'city', '/global/{city}'),
  ('CITY-P03', 'CITY', 'UniversalTopicHero', 'featured', 3, 'geography_context', 'city', '/global/{city}'),
  ('FEATURED-P01', 'FEATURED', 'FeaturedPage', 'curated_first_row', 1, 'query_context', null, '/featured'),
  ('FEATURED-P02', 'FEATURED', 'FeaturedPage', 'curated_first_row', 2, 'query_context', null, '/featured'),
  ('FEATURED-P03', 'FEATURED', 'FeaturedPage', 'curated_first_row', 3, 'query_context', null, '/featured')
on conflict (slot_id)
do update set
  surface_id = excluded.surface_id,
  component_name = excluded.component_name,
  slot_role = excluded.slot_role,
  position = excluded.position,
  scope_mode = excluded.scope_mode,
  context_type = excluded.context_type,
  route_pattern = excluded.route_pattern,
  updated_at = now();

alter table public.platform_placement_slot_templates
  enable row level security;

revoke all
on table public.platform_placement_slot_templates
from anon, authenticated;


-- ============================================================
-- 2. EVERY MATERIALIZED INSTANCE MUST USE A REGISTERED SLOT
-- ============================================================

alter table public.platform_placement_slot_instances
  add constraint platform_placement_instance_template_fk
  foreign key (slot_id)
  references public.platform_placement_slot_templates(slot_id)
  on update cascade
  on delete restrict;


-- ============================================================
-- 3. CREATIVE MUST MATCH ITS CAMPAIGN
-- ============================================================

alter table public.platform_placement_creatives
  add constraint platform_placement_creative_campaign_unique
  unique (
    id,
    campaign_id
  );

alter table public.platform_placement_assignments
  drop constraint if exists
    platform_assignment_target_required;

alter table public.platform_placement_assignments
  add constraint platform_assignment_target_required
  check (
    (
      creative_id is not null
      and campaign_id is not null
      and canonical_entity_type is null
      and canonical_entity_slug is null
    )
    or
    (
      creative_id is null
      and canonical_entity_type is not null
      and canonical_entity_slug is not null
    )
  );

alter table public.platform_placement_assignments
  add constraint platform_assignment_creative_campaign_match
  foreign key (
    creative_id,
    campaign_id
  )
  references public.platform_placement_creatives (
    id,
    campaign_id
  )
  on delete restrict;


-- ============================================================
-- 4. REPLACE GENERIC SLOT CREATION WITH TEMPLATE-BOUND VERSION
-- ============================================================

drop function if exists
  public.ensure_platform_placement_slot(
    text,
    text,
    text,
    text,
    text,
    boolean
  );

create or replace function public.ensure_platform_placement_slot(
  target_slot_id text,
  target_context_key text,
  target_page_path text default null,
  target_paid_eligible boolean default null
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

  template_surface_id text;
  template_context_type text;

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

  select
    template.surface_id,
    template.context_type
  into
    template_surface_id,
    template_context_type
  from public.platform_placement_slot_templates as template
  where template.slot_id =
      normalized_slot_id
    and template.status =
      'active';

  if not found then
    raise exception
      'Unknown or disabled Arknoz placement slot template';
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
    template_surface_id,
    template_context_type,
    nullif(trim(target_page_path), ''),
    coalesce(
      target_paid_eligible,
      false
    ),
    caller_user_id,
    caller_user_id
  )
  on conflict (
    slot_id,
    context_key
  )
  do update set
    page_path =
      coalesce(
        excluded.page_path,
        public.platform_placement_slot_instances.page_path
      ),

    paid_eligible =
      coalesce(
        target_paid_eligible,
        public.platform_placement_slot_instances.paid_eligible
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
  boolean
)
from public;

grant execute
on function public.ensure_platform_placement_slot(
  text,
  text,
  text,
  boolean
)
to authenticated;

commit;
