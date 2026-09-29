-- Arknoz Admin placement detailed read layer
--
-- Adds controlled Creative and Assignment browsers.
-- Protected tables remain inaccessible directly.

begin;

-- ============================================================
-- 1. CREATIVE BROWSER
-- ============================================================

create or replace function public.get_platform_placement_creatives(
  filter_campaign_id uuid default null,
  filter_status text default null,
  search_text text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  id uuid,
  campaign_id uuid,
  campaign_name text,
  name text,
  headline text,
  body_text text,
  image_url text,
  destination_url text,
  cta_label text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  safe_limit integer :=
    greatest(
      1,
      least(
        coalesce(result_limit, 100),
        500
      )
    );

  safe_offset integer :=
    greatest(
      coalesce(result_offset, 0),
      0
    );

  normalized_status text :=
    nullif(
      lower(trim(filter_status)),
      ''
    );

  normalized_search text :=
    nullif(
      lower(trim(search_text)),
      ''
    );
begin
  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = auth.uid()
      and pa.status = 'active'
      and pa.platform_role in (
        'OWNER',
        'ADMIN'
      )
  ) then
    raise exception
      'Platform placement authority required';
  end if;

  return query
  select
    creative.id,
    creative.campaign_id,
    campaign.name,
    creative.name,
    creative.headline,
    creative.body_text,
    creative.image_url,
    creative.destination_url,
    creative.cta_label,
    creative.status,
    creative.created_at,
    creative.updated_at

  from public.platform_placement_creatives as creative

  join public.platform_placement_campaigns as campaign
    on campaign.id =
      creative.campaign_id

  where
    (
      filter_campaign_id is null
      or creative.campaign_id =
        filter_campaign_id
    )

    and (
      normalized_status is null
      or creative.status =
        normalized_status
    )

    and (
      normalized_search is null
      or lower(creative.name)
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          creative.headline,
          ''
        )
      )
        like '%' || normalized_search || '%'
      or lower(campaign.name)
        like '%' || normalized_search || '%'
    )

  order by
    creative.updated_at desc,
    creative.name

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_placement_creatives(
  uuid,
  text,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_placement_creatives(
  uuid,
  text,
  text,
  integer,
  integer
)
to authenticated;


-- ============================================================
-- 2. ASSIGNMENT BROWSER
-- ============================================================

create or replace function public.get_platform_placement_assignments(
  filter_slot_instance_id uuid default null,
  filter_campaign_id uuid default null,
  filter_status text default null,
  search_text text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  id uuid,
  slot_instance_id uuid,
  instance_key text,
  placement_type text,
  status text,
  campaign_id uuid,
  campaign_name text,
  creative_id uuid,
  creative_name text,
  canonical_entity_type text,
  canonical_entity_slug text,
  replaceable boolean,
  paid_lock boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  safe_limit integer :=
    greatest(
      1,
      least(
        coalesce(result_limit, 100),
        500
      )
    );

  safe_offset integer :=
    greatest(
      coalesce(result_offset, 0),
      0
    );

  normalized_status text :=
    nullif(
      lower(trim(filter_status)),
      ''
    );

  normalized_search text :=
    nullif(
      lower(trim(search_text)),
      ''
    );
begin
  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = auth.uid()
      and pa.status = 'active'
      and pa.platform_role in (
        'OWNER',
        'ADMIN'
      )
  ) then
    raise exception
      'Platform placement authority required';
  end if;

  return query
  select
    assignment.id,
    assignment.slot_instance_id,
    instance.instance_key,
    assignment.placement_type,
    assignment.status,

    assignment.campaign_id,
    campaign.name,

    assignment.creative_id,
    creative.name,

    assignment.canonical_entity_type,
    assignment.canonical_entity_slug,

    assignment.replaceable,
    assignment.paid_lock,

    assignment.starts_at,
    assignment.ends_at,

    assignment.created_at,
    assignment.updated_at

  from public.platform_placement_assignments as assignment

  join public.platform_placement_slot_instances as instance
    on instance.id =
      assignment.slot_instance_id

  left join public.platform_placement_campaigns as campaign
    on campaign.id =
      assignment.campaign_id

  left join public.platform_placement_creatives as creative
    on creative.id =
      assignment.creative_id

  where
    (
      filter_slot_instance_id is null
      or assignment.slot_instance_id =
        filter_slot_instance_id
    )

    and (
      filter_campaign_id is null
      or assignment.campaign_id =
        filter_campaign_id
    )

    and (
      normalized_status is null
      or assignment.status =
        normalized_status
    )

    and (
      normalized_search is null
      or lower(instance.instance_key)
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          campaign.name,
          ''
        )
      )
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          creative.name,
          ''
        )
      )
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          assignment.canonical_entity_type,
          ''
        )
      )
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          assignment.canonical_entity_slug,
          ''
        )
      )
        like '%' || normalized_search || '%'
    )

  order by
    assignment.updated_at desc,
    instance.instance_key

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_placement_assignments(
  uuid,
  uuid,
  text,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_placement_assignments(
  uuid,
  uuid,
  text,
  text,
  integer,
  integer
)
to authenticated;

commit;
