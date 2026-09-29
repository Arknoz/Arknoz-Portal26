-- Arknoz placement lifecycle controls
--
-- Provides controlled campaign, creative and assignment
-- status transitions.
--
-- Direct table mutation remains blocked.

begin;

-- ============================================================
-- 1. PLACEMENT AUDIT LOG
-- ============================================================

create table if not exists public.platform_placement_audit_log (
  id bigint generated always as identity primary key,

  actor_user_id uuid
    references auth.users(id)
    on delete set null,

  object_type text not null
    check (
      object_type in (
        'campaign',
        'creative',
        'assignment',
        'slot_instance'
      )
    ),

  object_id uuid not null,

  action text not null,

  old_status text,
  new_status text,

  created_at timestamptz not null
    default now()
);

create index if not exists
  platform_placement_audit_object_idx
on public.platform_placement_audit_log (
  object_type,
  object_id,
  created_at desc
);

alter table public.platform_placement_audit_log
  enable row level security;

revoke all
on table public.platform_placement_audit_log
from anon, authenticated;


-- ============================================================
-- 2. CAMPAIGN STATUS CONTROL
-- ============================================================

create or replace function public.set_platform_placement_campaign_status(
  target_campaign_id uuid,
  target_status text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_status text :=
    lower(trim(target_status));

  previous_status text;
  campaign_start timestamptz;
  campaign_end timestamptz;
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

  if normalized_status not in (
    'draft',
    'scheduled',
    'live',
    'paused',
    'completed',
    'cancelled'
  ) then
    raise exception
      'Invalid campaign status';
  end if;

  select
    campaign.status,
    campaign.starts_at,
    campaign.ends_at
  into
    previous_status,
    campaign_start,
    campaign_end
  from public.platform_placement_campaigns as campaign
  where campaign.id =
    target_campaign_id
  for update;

  if not found then
    raise exception
      'Campaign does not exist';
  end if;

  if previous_status in (
    'completed',
    'cancelled'
  ) then
    raise exception
      'Completed or cancelled campaign is final';
  end if;

  if normalized_status = 'scheduled' then
    if campaign_start is null
       or campaign_start <= now()
    then
      raise exception
        'Scheduled campaign requires a future start time';
    end if;
  end if;

  if normalized_status = 'live' then
    if campaign_start is not null
       and campaign_start > now()
    then
      raise exception
        'Campaign start time has not arrived';
    end if;

    if campaign_end is not null
       and campaign_end <= now()
    then
      raise exception
        'Campaign has already ended';
    end if;
  end if;

  update public.platform_placement_campaigns
  set
    status = normalized_status,
    updated_by_user_id =
      caller_user_id,
    updated_at =
      now()
  where id =
    target_campaign_id;

  insert into public.platform_placement_audit_log (
    actor_user_id,
    object_type,
    object_id,
    action,
    old_status,
    new_status
  )
  values (
    caller_user_id,
    'campaign',
    target_campaign_id,
    'status_change',
    previous_status,
    normalized_status
  );
end;
$$;

revoke all
on function public.set_platform_placement_campaign_status(
  uuid,
  text
)
from public;

grant execute
on function public.set_platform_placement_campaign_status(
  uuid,
  text
)
to authenticated;


-- ============================================================
-- 3. CREATIVE STATUS CONTROL
-- ============================================================

create or replace function public.set_platform_placement_creative_status(
  target_creative_id uuid,
  target_status text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_status text :=
    lower(trim(target_status));

  previous_status text;
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

  if normalized_status not in (
    'draft',
    'approved',
    'paused',
    'retired'
  ) then
    raise exception
      'Invalid creative status';
  end if;

  select creative.status
  into previous_status
  from public.platform_placement_creatives as creative
  where creative.id =
    target_creative_id
  for update;

  if not found then
    raise exception
      'Creative does not exist';
  end if;

  if previous_status = 'retired' then
    raise exception
      'Retired creative is final';
  end if;

  if normalized_status in (
    'paused',
    'retired'
  )
  and exists (
    select 1
    from public.platform_placement_assignments as assignment
    where assignment.creative_id =
      target_creative_id
      and assignment.status =
        'live'
  )
  then
    raise exception
      'Creative is currently used by a live assignment';
  end if;

  update public.platform_placement_creatives
  set
    status = normalized_status,
    updated_by_user_id =
      caller_user_id,
    updated_at =
      now()
  where id =
    target_creative_id;

  insert into public.platform_placement_audit_log (
    actor_user_id,
    object_type,
    object_id,
    action,
    old_status,
    new_status
  )
  values (
    caller_user_id,
    'creative',
    target_creative_id,
    'status_change',
    previous_status,
    normalized_status
  );
end;
$$;

revoke all
on function public.set_platform_placement_creative_status(
  uuid,
  text
)
from public;

grant execute
on function public.set_platform_placement_creative_status(
  uuid,
  text
)
to authenticated;


-- ============================================================
-- 4. ASSIGNMENT LIFECYCLE
--
-- Locks exact slot row before transition.
-- Prevents overlapping scheduled/live assignments.
-- ============================================================

create or replace function public.set_platform_placement_assignment_status(
  target_assignment_id uuid,
  target_status text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  caller_user_id uuid := auth.uid();

  normalized_status text :=
    lower(trim(target_status));

  previous_status text;

  target_slot_id uuid;
  target_campaign_id uuid;
  target_creative_id uuid;

  target_placement_type text;

  assignment_start timestamptz;
  assignment_end timestamptz;

  effective_start timestamptz;

  slot_inventory_status text;
  slot_paid_eligible boolean;

  campaign_status text;
  campaign_start timestamptz;
  campaign_end timestamptz;

  creative_status text;
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

  if normalized_status not in (
    'draft',
    'scheduled',
    'live',
    'paused',
    'expired',
    'cancelled'
  ) then
    raise exception
      'Invalid assignment status';
  end if;

  select
    assignment.status,
    assignment.slot_instance_id,
    assignment.campaign_id,
    assignment.creative_id,
    assignment.placement_type,
    assignment.starts_at,
    assignment.ends_at
  into
    previous_status,
    target_slot_id,
    target_campaign_id,
    target_creative_id,
    target_placement_type,
    assignment_start,
    assignment_end
  from public.platform_placement_assignments as assignment
  where assignment.id =
    target_assignment_id;

  if not found then
    raise exception
      'Assignment does not exist';
  end if;

  if previous_status in (
    'expired',
    'cancelled'
  ) then
    raise exception
      'Expired or cancelled assignment is final';
  end if;

  -- Serialize operations for the exact position.
  select
    instance.inventory_status,
    instance.paid_eligible
  into
    slot_inventory_status,
    slot_paid_eligible
  from public.platform_placement_slot_instances as instance
  where instance.id =
    target_slot_id
  for update;

  if not found then
    raise exception
      'Exact slot instance does not exist';
  end if;

  if normalized_status in (
    'scheduled',
    'live'
  )
  and slot_inventory_status in (
    'paused',
    'disabled'
  )
  then
    raise exception
      'Exact slot instance is unavailable';
  end if;

  if normalized_status = 'scheduled' then
    if assignment_start is null
       or assignment_start <= now()
    then
      raise exception
        'Scheduled assignment requires a future start time';
    end if;
  end if;

  if normalized_status = 'live' then
    if assignment_start is not null
       and assignment_start > now()
    then
      raise exception
        'Assignment start time has not arrived';
    end if;

    if assignment_end is not null
       and assignment_end <= now()
    then
      raise exception
        'Assignment has already ended';
    end if;
  end if;

  if target_placement_type in (
    'sponsored',
    'partner',
    'featured'
  )
  and normalized_status in (
    'scheduled',
    'live'
  )
  then
    if slot_paid_eligible is not true then
      raise exception
        'Exact slot is not enabled for paid placement';
    end if;

    if target_campaign_id is null then
      raise exception
        'Commercial placement requires a campaign';
    end if;
  end if;

  if target_campaign_id is not null
     and normalized_status in (
       'scheduled',
       'live'
     )
  then
    select
      campaign.status,
      campaign.starts_at,
      campaign.ends_at
    into
      campaign_status,
      campaign_start,
      campaign_end
    from public.platform_placement_campaigns as campaign
    where campaign.id =
      target_campaign_id;

    if not found then
      raise exception
        'Campaign does not exist';
    end if;

    if normalized_status = 'scheduled'
       and campaign_status not in (
         'scheduled',
         'live'
       )
    then
      raise exception
        'Campaign must be scheduled or live first';
    end if;

    if normalized_status = 'live'
       and campaign_status <> 'live'
    then
      raise exception
        'Campaign must be live first';
    end if;

    effective_start :=
      coalesce(
        assignment_start,
        now()
      );

    if campaign_start is not null
       and effective_start <
         campaign_start
    then
      raise exception
        'Assignment starts before campaign';
    end if;

    if campaign_end is not null
       and (
         assignment_end is null
         or assignment_end >
           campaign_end
       )
    then
      raise exception
        'Assignment ends after campaign';
    end if;
  end if;

  if target_creative_id is not null
     and normalized_status in (
       'scheduled',
       'live'
     )
  then
    select creative.status
    into creative_status
    from public.platform_placement_creatives as creative
    where creative.id =
      target_creative_id;

    if creative_status <> 'approved' then
      raise exception
        'Creative must be approved first';
    end if;
  end if;

  -- Prevent overlapping scheduled/live use of the same exact slot.
  if normalized_status in (
    'scheduled',
    'live'
  )
  and exists (
    select 1
    from public.platform_placement_assignments as other_assignment
    where other_assignment.slot_instance_id =
      target_slot_id

      and other_assignment.id <>
        target_assignment_id

      and other_assignment.status in (
        'scheduled',
        'live'
      )

      and tstzrange(
        coalesce(
          other_assignment.starts_at,
          '-infinity'::timestamptz
        ),
        coalesce(
          other_assignment.ends_at,
          'infinity'::timestamptz
        ),
        '[)'
      )
      &&
      tstzrange(
        coalesce(
          assignment_start,
          now()
        ),
        coalesce(
          assignment_end,
          'infinity'::timestamptz
        ),
        '[)'
      )
  )
  then
    raise exception
      'Exact slot already has an overlapping scheduled or live assignment';
  end if;

  update public.platform_placement_assignments
  set
    status =
      normalized_status,
    updated_by_user_id =
      caller_user_id,
    updated_at =
      now()
  where id =
    target_assignment_id;

  -- Derive operational inventory state.
  if slot_inventory_status not in (
    'paused',
    'disabled'
  ) then
    update public.platform_placement_slot_instances
    set
      inventory_status =
        case
          when exists (
            select 1
            from public.platform_placement_assignments as assignment
            where assignment.slot_instance_id =
              target_slot_id
              and assignment.status =
                'live'
          )
          then 'occupied'

          when exists (
            select 1
            from public.platform_placement_assignments as assignment
            where assignment.slot_instance_id =
              target_slot_id
              and assignment.status =
                'scheduled'
          )
          then 'reserved'

          else 'available'
        end,

      updated_by_user_id =
        caller_user_id,

      updated_at =
        now()

    where id =
      target_slot_id;
  end if;

  insert into public.platform_placement_audit_log (
    actor_user_id,
    object_type,
    object_id,
    action,
    old_status,
    new_status
  )
  values (
    caller_user_id,
    'assignment',
    target_assignment_id,
    'status_change',
    previous_status,
    normalized_status
  );
end;
$$;

revoke all
on function public.set_platform_placement_assignment_status(
  uuid,
  text
)
from public;

grant execute
on function public.set_platform_placement_assignment_status(
  uuid,
  text
)
to authenticated;

commit;
