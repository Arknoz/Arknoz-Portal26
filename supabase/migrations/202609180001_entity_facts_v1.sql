begin;

-- ============================================================
-- ARKNOZ ENTITY FACTS V1
--
-- Fact lifecycle:
-- candidate
--   -> provisional
--   -> source_verified
--   -> independently_verified
--   -> publishable
--
-- Rules:
-- - every new fact enters as candidate
-- - source_verified requires supporting evidence
-- - independently_verified requires independent evidence
--   plus a real Arknoz reviewer
-- - publishable requires explicit human publication approval
-- - evidence cannot silently disappear behind a verified fact
-- - fact/source links must belong to the same entity
--
-- entities.detail remains the public presentation layer.
-- ============================================================


create table if not exists public.entity_facts (
  id uuid primary key default gen_random_uuid(),

  entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  fact_key text not null
    check (btrim(fact_key) <> ''),

  label text,

  value jsonb not null,

  unit text,

  origin_type text not null default 'import'
    check (
      origin_type in (
        'source_extract',
        'import',
        'ai',
        'editor'
      )
    ),

  fact_status text not null default 'candidate'
    check (
      fact_status in (
        'candidate',
        'provisional',
        'source_verified',
        'independently_verified',
        'publishable'
      )
    ),

  confidence numeric(5,4)
    check (
      confidence is null
      or (confidence >= 0 and confidence <= 1)
    ),

  effective_from timestamptz,
  effective_to timestamptz,

  verified_by uuid
    references auth.users(id)
    on delete set null,

  last_verified_at timestamptz,

  publication_approved_by uuid
    references auth.users(id)
    on delete set null,

  publication_approved_at timestamptz,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (
    effective_to is null
    or effective_from is null
    or effective_to >= effective_from
  ),

  -- Source verification may be deterministic/system-backed,
  -- but it must have a verification timestamp.
  check (
    fact_status not in (
      'source_verified',
      'independently_verified',
      'publishable'
    )
    or last_verified_at is not null
  ),

  -- Independent verification requires an accountable reviewer.
  check (
    fact_status not in (
      'independently_verified',
      'publishable'
    )
    or verified_by is not null
  ),

  -- Publication always requires explicit approval.
  check (
    fact_status <> 'publishable'
    or (
      publication_approved_by is not null
      and publication_approved_at is not null
    )
  )
);


create table if not exists public.entity_fact_sources (
  id uuid primary key default gen_random_uuid(),

  fact_id uuid not null
    references public.entity_facts(id)
    on delete cascade,

  source_id uuid not null
    references public.entity_sources(id)
    on delete cascade,

  support_type text not null default 'supporting'
    check (
      support_type in (
        'supporting',
        'corroborating',
        'contradicting'
      )
    ),

  is_independent boolean not null default false,

  evidence_locator text,
  evidence_excerpt text,

  created_at timestamptz not null default now(),

  unique (fact_id, source_id)
);


create index if not exists entity_facts_entity_status_idx
  on public.entity_facts (
    entity_id,
    fact_status,
    sort_order
  );

create index if not exists entity_facts_key_idx
  on public.entity_facts (
    entity_id,
    fact_key
  );

create index if not exists entity_fact_sources_source_idx
  on public.entity_fact_sources (
    source_id
  );


-- ============================================================
-- UPDATED_AT
-- ============================================================

create or replace function public.set_entity_fact_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entity_facts_set_updated_at
  on public.entity_facts;

create trigger entity_facts_set_updated_at
before update on public.entity_facts
for each row
execute function public.set_entity_fact_updated_at();


-- ============================================================
-- ALL NEW FACTS MUST ENTER AS CANDIDATE
-- ============================================================

create or replace function public.enforce_new_entity_fact_candidate()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.fact_status <> 'candidate' then
    raise exception
      'New Arknoz facts must enter lifecycle as candidate';
  end if;

  return new;
end;
$$;

drop trigger if exists entity_facts_insert_guard
  on public.entity_facts;

create trigger entity_facts_insert_guard
before insert on public.entity_facts
for each row
execute function public.enforce_new_entity_fact_candidate();


-- ============================================================
-- FACT/SOURCE MUST BELONG TO SAME ENTITY
-- ============================================================

create or replace function public.enforce_entity_fact_source_match()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  fact_entity uuid;
  source_entity uuid;
begin

  select entity_id
  into fact_entity
  from public.entity_facts
  where id = new.fact_id;

  select entity_id
  into source_entity
  from public.entity_sources
  where id = new.source_id;

  if fact_entity is null or source_entity is null then
    raise exception
      'Fact or source does not exist';
  end if;

  if fact_entity <> source_entity then
    raise exception
      'Arknoz fact evidence must belong to the same entity';
  end if;

  return new;
end;
$$;

drop trigger if exists entity_fact_sources_entity_guard
  on public.entity_fact_sources;

create trigger entity_fact_sources_entity_guard
before insert or update
on public.entity_fact_sources
for each row
execute function public.enforce_entity_fact_source_match();


-- ============================================================
-- VERIFIED FACT CONTENT CANNOT CHANGE WITHOUT DEMOTION
-- ============================================================

create or replace function public.protect_verified_fact_content_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin

  -- A fact always belongs to the entity where it was created.
  if new.entity_id is distinct from old.entity_id then
    raise exception
      'Arknoz fact entity_id is immutable';
  end if;


  if old.fact_status in (
    'source_verified',
    'independently_verified',
    'publishable'
  )
  and (
    new.fact_key is distinct from old.fact_key
    or new.value is distinct from old.value
    or new.unit is distinct from old.unit
    or new.effective_from is distinct from old.effective_from
    or new.effective_to is distinct from old.effective_to
    or new.origin_type is distinct from old.origin_type
  )
  and new.fact_status not in (
    'candidate',
    'provisional'
  )
  then
    raise exception
      'Demote verified fact before changing substantive fact content';
  end if;


  return new;
end;
$$;


drop trigger if exists entity_facts_content_guard
  on public.entity_facts;

create trigger entity_facts_content_guard
before update of
  entity_id,
  fact_key,
  value,
  unit,
  effective_from,
  effective_to,
  origin_type
on public.entity_facts
for each row
execute function public.protect_verified_fact_content_update();


-- ============================================================
-- DETERMINISTIC LIFECYCLE
-- ============================================================

create or replace function public.enforce_entity_fact_lifecycle()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  old_rank integer;
  new_rank integer;
  has_supporting_source boolean;
  has_independent_source boolean;
begin

  old_rank :=
    case old.fact_status
      when 'candidate' then 1
      when 'provisional' then 2
      when 'source_verified' then 3
      when 'independently_verified' then 4
      when 'publishable' then 5
    end;

  new_rank :=
    case new.fact_status
      when 'candidate' then 1
      when 'provisional' then 2
      when 'source_verified' then 3
      when 'independently_verified' then 4
      when 'publishable' then 5
    end;

  -- Promotion must occur one stage at a time.
  -- Demotion is allowed when evidence becomes stale/invalid.
  if new_rank > old_rank + 1 then
    raise exception
      'Invalid Arknoz fact lifecycle transition: % -> %',
      old.fact_status,
      new.fact_status;
  end if;


  -- A demotion invalidates downstream verification/approval state.
  if new_rank < old_rank then

    if new_rank < 5 then
      new.publication_approved_by := null;
      new.publication_approved_at := null;
    end if;

    if new_rank < 4 then
      new.verified_by := null;
    end if;

    if new_rank < 3 then
      new.last_verified_at := null;
    end if;

  end if;


  if new_rank >= 3 then

    select exists (
      select 1
      from public.entity_fact_sources efs
      where efs.fact_id = new.id
        and efs.support_type in (
          'supporting',
          'corroborating'
        )
    )
    into has_supporting_source;

    if not has_supporting_source then
      raise exception
        'Fact cannot become source_verified without supporting evidence';
    end if;

  end if;


  if new_rank >= 4 then

    select exists (
      select 1
      from public.entity_fact_sources efs
      where efs.fact_id = new.id
        and efs.is_independent = true
        and efs.support_type in (
          'supporting',
          'corroborating'
        )
    )
    into has_independent_source;

    if not has_independent_source then
      raise exception
        'Fact cannot become independently_verified without independent evidence';
    end if;

  end if;


  return new;
end;
$$;


drop trigger if exists entity_facts_lifecycle_guard
  on public.entity_facts;

create trigger entity_facts_lifecycle_guard
before update of fact_status
on public.entity_facts
for each row
when (old.fact_status is distinct from new.fact_status)
execute function public.enforce_entity_fact_lifecycle();


-- ============================================================
-- VERIFIED FACTS CANNOT SILENTLY LOSE REQUIRED EVIDENCE
-- ============================================================

create or replace function public.protect_verified_fact_evidence()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  current_status text;
  supporting_remaining integer;
  independent_remaining integer;
begin

  select fact_status
  into current_status
  from public.entity_facts
  where id = old.fact_id;

  if current_status is null then
    return old;
  end if;


  if current_status in (
    'source_verified',
    'independently_verified',
    'publishable'
  ) then

    select count(*)
    into supporting_remaining
    from public.entity_fact_sources efs
    where efs.fact_id = old.fact_id
      and efs.id <> old.id
      and efs.support_type in (
        'supporting',
        'corroborating'
      );

    if supporting_remaining = 0 then
      raise exception
        'Demote fact before removing its final supporting evidence';
    end if;

  end if;


  if current_status in (
    'independently_verified',
    'publishable'
  )
  and old.is_independent = true
  and old.support_type in (
    'supporting',
    'corroborating'
  ) then

    select count(*)
    into independent_remaining
    from public.entity_fact_sources efs
    where efs.fact_id = old.fact_id
      and efs.id <> old.id
      and efs.is_independent = true
      and efs.support_type in (
        'supporting',
        'corroborating'
      );

    if independent_remaining = 0 then
      raise exception
        'Demote fact before removing its final independent evidence';
    end if;

  end if;


  return old;
end;
$$;


drop trigger if exists entity_fact_sources_delete_guard
  on public.entity_fact_sources;

create trigger entity_fact_sources_delete_guard
before delete on public.entity_fact_sources
for each row
execute function public.protect_verified_fact_evidence();


create or replace function public.protect_verified_fact_evidence_update()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  current_status text;
  supporting_remaining integer;
  independent_remaining integer;
begin

  -- If this edit does not weaken evidence, allow it.
  if
    old.fact_id = new.fact_id
    and old.support_type = new.support_type
    and old.is_independent = new.is_independent
  then
    return new;
  end if;


  select fact_status
  into current_status
  from public.entity_facts
  where id = old.fact_id;


  if current_status in (
    'source_verified',
    'independently_verified',
    'publishable'
  ) then

    select count(*)
    into supporting_remaining
    from public.entity_fact_sources efs
    where efs.fact_id = old.fact_id
      and efs.id <> old.id
      and efs.support_type in (
        'supporting',
        'corroborating'
      );

    if
      new.fact_id = old.fact_id
      and new.support_type in (
        'supporting',
        'corroborating'
      )
    then
      supporting_remaining := supporting_remaining + 1;
    end if;

    if supporting_remaining = 0 then
      raise exception
        'Demote fact before weakening its final supporting evidence';
    end if;

  end if;


  if current_status in (
    'independently_verified',
    'publishable'
  ) then

    select count(*)
    into independent_remaining
    from public.entity_fact_sources efs
    where efs.fact_id = old.fact_id
      and efs.id <> old.id
      and efs.is_independent = true
      and efs.support_type in (
        'supporting',
        'corroborating'
      );

    if
      new.fact_id = old.fact_id
      and new.is_independent = true
      and new.support_type in (
        'supporting',
        'corroborating'
      )
    then
      independent_remaining := independent_remaining + 1;
    end if;

    if independent_remaining = 0 then
      raise exception
        'Demote fact before weakening its final independent evidence';
    end if;

  end if;


  return new;
end;
$$;


drop trigger if exists entity_fact_sources_update_guard
  on public.entity_fact_sources;

create trigger entity_fact_sources_update_guard
before update of fact_id, support_type, is_independent
on public.entity_fact_sources
for each row
execute function public.protect_verified_fact_evidence_update();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.entity_facts
  enable row level security;

alter table public.entity_fact_sources
  enable row level security;


drop policy if exists
  "Public can read publishable facts for published entities"
  on public.entity_facts;

create policy
  "Public can read publishable facts for published entities"
  on public.entity_facts
  for select
  to anon, authenticated
  using (
    fact_status = 'publishable'
    and exists (
      select 1
      from public.entities e
      where e.id = entity_facts.entity_id
        and e.content_status = 'published'
    )
  );


-- Evidence-link internals are not publicly readable in V1.
revoke all on table public.entity_facts
  from anon, authenticated;

revoke all on table public.entity_fact_sources
  from anon, authenticated;

grant select on table public.entity_facts
  to anon, authenticated;

commit;