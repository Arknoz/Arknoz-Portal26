-- Arknoz Admin placement inventory write layer
--
-- Direct table access remains blocked.
-- OWNER / ADMIN write through controlled SECURITY DEFINER RPCs.
-- New assignments are created as DRAFT only.
-- A separate publish/activation RPC will control going live.

begin;

-- ============================================================
-- 1. CREATE CAMPAIGN
-- ============================================================

create or replace function public.create_platform_placement_campaign(
  target_name text,
  target_campaign_type text,
  target_advertiser_name text default null,
  target_starts_at timestamptz default null,
  target_ends_at timestamptz default null,
  target_currency_code text default null,
  target_budget_minor bigint default null,
  target_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_name text :=
    nullif(trim(target_name), '');

  normalized_type text :=
    lower(trim(target_campaign_type));

  normalized_currency text :=
    nullif(
      upper(trim(target_currency_code)),
      ''
    );

  created_id uuid;
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

  if normalized_name is null then
    raise exception
      'Campaign name is required';
  end if;

  if normalized_type not in (
    'editorial',
    'sponsored',
    'partner',
    'featured',
    'house'
  ) then
    raise exception
      'Invalid campaign type';
  end if;

  if normalized_currency is not null
     and normalized_currency !~ '^[A-Z]{3}$'
  then
    raise exception
      'Currency must be a 3-letter ISO code';
  end if;

  if target_budget_minor is not null
     and target_budget_minor < 0
  then
    raise exception
      'Budget cannot be negative';
  end if;

  if target_starts_at is not null
     and target_ends_at is not null
     and target_ends_at <= target_starts_at
  then
    raise exception
      'Campaign end must be after start';
  end if;

  insert into public.platform_placement_campaigns (
    name,
    campaign_type,
    advertiser_name,
    status,
    starts_at,
    ends_at,
    currency_code,
    budget_minor,
    notes,
    created_by_user_id,
    updated_by_user_id
  )
  values (
    normalized_name,
    normalized_type,
    nullif(trim(target_advertiser_name), ''),
    'draft',
    target_starts_at,
    target_ends_at,
    normalized_currency,
    target_budget_minor,
    nullif(trim(target_notes), ''),
    caller_user_id,
    caller_user_id
  )
  returning id
  into created_id;

  return created_id;
end;
$$;

revoke all
on function public.create_platform_placement_campaign(
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  text,
  bigint,
  text
)
from public;

grant execute
on function public.create_platform_placement_campaign(
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  text,
  bigint,
  text
)
to authenticated;


-- ============================================================
-- 2. CREATE CAMPAIGN CREATIVE
-- ============================================================

create or replace function public.create_platform_placement_creative(
  target_campaign_id uuid,
  target_name text,
  target_headline text default null,
  target_body_text text default null,
  target_image_url text default null,
  target_destination_url text default null,
  target_cta_label text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_name text :=
    nullif(trim(target_name), '');

  created_id uuid;
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

  if target_campaign_id is null then
    raise exception
      'Campaign is required';
  end if;

  if not exists (
    select 1
    from public.platform_placement_campaigns as campaign
    where campaign.id = target_campaign_id
  ) then
    raise exception
      'Campaign does not exist';
  end if;

  if normalized_name is null then
    raise exception
      'Creative name is required';
  end if;

  insert into public.platform_placement_creatives (
    campaign_id,
    name,
    headline,
    body_text,
    image_url,
    destination_url,
    cta_label,
    status,
    created_by_user_id,
    updated_by_user_id
  )
  values (
    target_campaign_id,
    normalized_name,
    nullif(trim(target_headline), ''),
    nullif(trim(target_body_text), ''),
    nullif(trim(target_image_url), ''),
    nullif(trim(target_destination_url), ''),
    nullif(trim(target_cta_label), ''),
    'draft',
    caller_user_id,
    caller_user_id
  )
  returning id
  into created_id;

  return created_id;
end;
$$;

revoke all
on function public.create_platform_placement_creative(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute
on function public.create_platform_placement_creative(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 3. CREATE DRAFT EXACT ASSIGNMENT
--
-- Target is either:
-- A. creative
-- B. canonical Arknoz entity
--
-- Commercial placement types require:
-- - paid-eligible exact slot
-- - campaign
-- ============================================================

create or replace function public.create_platform_placement_assignment(
  target_slot_instance_id uuid,
  target_placement_type text,
  target_campaign_id uuid default null,
  target_creative_id uuid default null,
  target_canonical_entity_type text default null,
  target_canonical_entity_slug text default null,
  target_replaceable boolean default true,
  target_paid_lock boolean default false,
  target_starts_at timestamptz default null,
  target_ends_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_placement_type text :=
    lower(trim(target_placement_type));

  normalized_entity_type text :=
    nullif(
      lower(trim(target_canonical_entity_type)),
      ''
    );

  normalized_entity_slug text :=
    nullif(
      lower(trim(target_canonical_entity_slug)),
      ''
    );

  slot_is_paid_eligible boolean;

  created_id uuid;
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

  if target_slot_instance_id is null then
    raise exception
      'Exact slot instance is required';
  end if;

  select instance.paid_eligible
  into slot_is_paid_eligible
  from public.platform_placement_slot_instances as instance
  where instance.id =
    target_slot_instance_id
    and instance.inventory_status <>
      'disabled';

  if not found then
    raise exception
      'Exact slot instance does not exist or is disabled';
  end if;

  if normalized_placement_type not in (
    'editorial',
    'sponsored',
    'partner',
    'featured',
    'house'
  ) then
    raise exception
      'Invalid placement type';
  end if;

  if target_starts_at is not null
     and target_ends_at is not null
     and target_ends_at <= target_starts_at
  then
    raise exception
      'Assignment end must be after start';
  end if;

  -- Exactly one assignment target.
  if (
    target_creative_id is not null
    and (
      normalized_entity_type is not null
      or normalized_entity_slug is not null
    )
  ) then
    raise exception
      'Assignment cannot target both a creative and canonical entity';
  end if;

  if (
    target_creative_id is null
    and (
      normalized_entity_type is null
      or normalized_entity_slug is null
    )
  ) then
    raise exception
      'Assignment target is required';
  end if;

  if target_creative_id is not null then
    if target_campaign_id is null then
      raise exception
        'Creative assignment requires a campaign';
    end if;

    if not exists (
      select 1
      from public.platform_placement_creatives as creative
      where creative.id =
        target_creative_id
        and creative.campaign_id =
          target_campaign_id
    ) then
      raise exception
        'Creative does not belong to selected campaign';
    end if;
  end if;

  if normalized_placement_type in (
    'sponsored',
    'partner',
    'featured'
  ) then
    if target_campaign_id is null then
      raise exception
        'Commercial placement requires a campaign';
    end if;

    if slot_is_paid_eligible is not true then
      raise exception
        'Selected slot is not enabled for paid placement';
    end if;
  end if;

  if target_campaign_id is not null
     and not exists (
       select 1
       from public.platform_placement_campaigns as campaign
       where campaign.id =
         target_campaign_id
         and campaign.status not in (
           'completed',
           'cancelled'
         )
     )
  then
    raise exception
      'Campaign is unavailable';
  end if;

  insert into public.platform_placement_assignments (
    slot_instance_id,
    campaign_id,
    creative_id,
    canonical_entity_type,
    canonical_entity_slug,
    placement_type,
    status,
    replaceable,
    paid_lock,
    starts_at,
    ends_at,
    created_by_user_id,
    updated_by_user_id
  )
  values (
    target_slot_instance_id,
    target_campaign_id,
    target_creative_id,
    normalized_entity_type,
    normalized_entity_slug,
    normalized_placement_type,
    'draft',
    coalesce(
      target_replaceable,
      true
    ),
    coalesce(
      target_paid_lock,
      false
    ),
    target_starts_at,
    target_ends_at,
    caller_user_id,
    caller_user_id
  )
  returning id
  into created_id;

  return created_id;
end;
$$;

revoke all
on function public.create_platform_placement_assignment(
  uuid,
  text,
  uuid,
  uuid,
  text,
  text,
  boolean,
  boolean,
  timestamptz,
  timestamptz
)
from public;

grant execute
on function public.create_platform_placement_assignment(
  uuid,
  text,
  uuid,
  uuid,
  text,
  text,
  boolean,
  boolean,
  timestamptz,
  timestamptz
)
to authenticated;

commit;
