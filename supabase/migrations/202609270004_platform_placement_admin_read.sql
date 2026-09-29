-- Arknoz Admin placement inventory read layer
--
-- Protected placement tables remain inaccessible directly.
-- OWNER / ADMIN read through controlled SECURITY DEFINER RPCs.

begin;

-- ============================================================
-- 1. INVENTORY SUMMARY
-- ============================================================

create or replace function public.get_platform_placement_summary()
returns table (
  registered_templates bigint,
  materialized_instances bigint,
  paid_eligible_instances bigint,
  available_instances bigint,
  reserved_instances bigint,
  occupied_instances bigint,
  live_assignments bigint,
  active_campaigns bigint
)
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    (
      select count(*)
      from public.platform_placement_slot_templates
      where status = 'active'
    ) as registered_templates,

    (
      select count(*)
      from public.platform_placement_slot_instances
    ) as materialized_instances,

    (
      select count(*)
      from public.platform_placement_slot_instances
      where paid_eligible = true
    ) as paid_eligible_instances,

    (
      select count(*)
      from public.platform_placement_slot_instances
      where inventory_status = 'available'
    ) as available_instances,

    (
      select count(*)
      from public.platform_placement_slot_instances
      where inventory_status = 'reserved'
    ) as reserved_instances,

    (
      select count(*)
      from public.platform_placement_slot_instances
      where inventory_status = 'occupied'
    ) as occupied_instances,

    (
      select count(*)
      from public.platform_placement_assignments
      where status = 'live'
    ) as live_assignments,

    (
      select count(*)
      from public.platform_placement_campaigns
      where status in (
        'scheduled',
        'live'
      )
    ) as active_campaigns

  where exists (
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
on function public.get_platform_placement_summary()
from public;

grant execute
on function public.get_platform_placement_summary()
to authenticated;


-- ============================================================
-- 2. REGISTERED SLOT TEMPLATE BROWSER
-- ============================================================

create or replace function public.get_platform_placement_templates(
  filter_surface_id text default null,
  filter_context_type text default null,
  search_text text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  slot_id text,
  surface_id text,
  component_name text,
  slot_role text,
  position integer,
  scope_mode text,
  context_type text,
  route_pattern text,
  status text,
  materialized_count bigint
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

  normalized_surface text :=
    nullif(
      upper(trim(filter_surface_id)),
      ''
    );

  normalized_context_type text :=
    nullif(
      lower(trim(filter_context_type)),
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
    template.slot_id,
    template.surface_id,
    template.component_name,
    template.slot_role,
    template.position,
    template.scope_mode,
    template.context_type,
    template.route_pattern,
    template.status,

    (
      select count(*)
      from public.platform_placement_slot_instances as instance
      where instance.slot_id =
        template.slot_id
    ) as materialized_count

  from public.platform_placement_slot_templates as template

  where
    (
      normalized_surface is null
      or template.surface_id =
        normalized_surface
    )

    and (
      normalized_context_type is null
      or template.context_type =
        normalized_context_type
    )

    and (
      normalized_search is null
      or lower(template.slot_id)
        like '%' || normalized_search || '%'
      or lower(template.surface_id)
        like '%' || normalized_search || '%'
      or lower(template.component_name)
        like '%' || normalized_search || '%'
      or lower(template.slot_role)
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          template.route_pattern,
          ''
        )
      )
        like '%' || normalized_search || '%'
    )

  order by
    template.surface_id,
    template.position,
    template.slot_id

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_placement_templates(
  text,
  text,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_placement_templates(
  text,
  text,
  text,
  integer,
  integer
)
to authenticated;


-- ============================================================
-- 3. MATERIALIZED EXACT SLOT INSTANCE BROWSER
-- ============================================================

create or replace function public.get_platform_placement_instances(
  filter_surface_id text default null,
  filter_context_type text default null,
  filter_inventory_status text default null,
  filter_paid_eligible boolean default null,
  search_text text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  id uuid,
  instance_key text,
  slot_id text,
  context_key text,
  surface_id text,
  context_type text,
  page_path text,
  paid_eligible boolean,
  inventory_status text,
  current_assignment_id uuid,
  current_placement_type text,
  current_assignment_status text,
  current_campaign_id uuid,
  current_campaign_name text,
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

  normalized_surface text :=
    nullif(
      upper(trim(filter_surface_id)),
      ''
    );

  normalized_context_type text :=
    nullif(
      lower(trim(filter_context_type)),
      ''
    );

  normalized_status text :=
    nullif(
      lower(trim(filter_inventory_status)),
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
    instance.id,
    instance.instance_key,
    instance.slot_id,
    instance.context_key,
    instance.surface_id,
    instance.context_type,
    instance.page_path,
    instance.paid_eligible,
    instance.inventory_status,

    assignment.id,
    assignment.placement_type,
    assignment.status,

    campaign.id,
    campaign.name,

    instance.created_at,
    instance.updated_at

  from public.platform_placement_slot_instances as instance

  left join lateral (
    select a.*
    from public.platform_placement_assignments as a
    where a.slot_instance_id =
      instance.id
      and a.status in (
        'live',
        'scheduled',
        'paused'
      )
    order by
      case a.status
        when 'live' then 1
        when 'scheduled' then 2
        when 'paused' then 3
        else 4
      end,
      a.updated_at desc
    limit 1
  ) as assignment
    on true

  left join public.platform_placement_campaigns as campaign
    on campaign.id =
      assignment.campaign_id

  where
    (
      normalized_surface is null
      or instance.surface_id =
        normalized_surface
    )

    and (
      normalized_context_type is null
      or instance.context_type =
        normalized_context_type
    )

    and (
      normalized_status is null
      or instance.inventory_status =
        normalized_status
    )

    and (
      filter_paid_eligible is null
      or instance.paid_eligible =
        filter_paid_eligible
    )

    and (
      normalized_search is null
      or lower(instance.instance_key)
        like '%' || normalized_search || '%'
      or lower(instance.slot_id)
        like '%' || normalized_search || '%'
      or lower(instance.context_key)
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          instance.page_path,
          ''
        )
      )
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          campaign.name,
          ''
        )
      )
        like '%' || normalized_search || '%'
    )

  order by
    instance.updated_at desc,
    instance.instance_key

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_placement_instances(
  text,
  text,
  text,
  boolean,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_placement_instances(
  text,
  text,
  text,
  boolean,
  text,
  integer,
  integer
)
to authenticated;


-- ============================================================
-- 4. CAMPAIGN BROWSER
-- ============================================================

create or replace function public.get_platform_placement_campaigns(
  filter_status text default null,
  search_text text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  id uuid,
  name text,
  campaign_type text,
  advertiser_name text,
  status text,
  starts_at timestamptz,
  ends_at timestamptz,
  currency_code text,
  budget_minor bigint,
  assignment_count bigint,
  live_assignment_count bigint,
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
    campaign.id,
    campaign.name,
    campaign.campaign_type,
    campaign.advertiser_name,
    campaign.status,
    campaign.starts_at,
    campaign.ends_at,
    campaign.currency_code,
    campaign.budget_minor,

    (
      select count(*)
      from public.platform_placement_assignments as assignment
      where assignment.campaign_id =
        campaign.id
    ) as assignment_count,

    (
      select count(*)
      from public.platform_placement_assignments as assignment
      where assignment.campaign_id =
        campaign.id
        and assignment.status =
          'live'
    ) as live_assignment_count,

    campaign.created_at,
    campaign.updated_at

  from public.platform_placement_campaigns as campaign

  where
    (
      normalized_status is null
      or campaign.status =
        normalized_status
    )

    and (
      normalized_search is null
      or lower(campaign.name)
        like '%' || normalized_search || '%'
      or lower(
        coalesce(
          campaign.advertiser_name,
          ''
        )
      )
        like '%' || normalized_search || '%'
    )

  order by
    campaign.updated_at desc,
    campaign.name

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_placement_campaigns(
  text,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_placement_campaigns(
  text,
  text,
  integer,
  integer
)
to authenticated;

commit;
