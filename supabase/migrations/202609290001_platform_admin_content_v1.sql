-- Arknoz Platform Admin Content V1
--
-- Phase 1:
-- Projects, Products, Knowledge, People,
-- Organisations, Universities, Opportunities, Places.
--
-- Provides protected Admin:
-- - summary
-- - search/filter
-- - create draft
-- - edit core content
-- - review/publish/archive
-- - verification
-- - featured/sort controls
-- - audit history

begin;


-- ============================================================
-- 1. CONTENT ADMIN AUDIT
-- ============================================================

create table if not exists public.platform_content_audit_log (
  id uuid primary key
    default gen_random_uuid(),

  actor_user_id uuid
    references auth.users(id)
    on delete set null,

  -- Deliberately no FK so history survives entity deletion.
  entity_id uuid not null,

  entity_type text not null,
  entity_slug text not null,

  action text not null
    check (
      action in (
        'create',
        'edit',
        'state'
      )
    ),

  old_value jsonb,
  new_value jsonb,

  created_at timestamptz not null
    default now()
);

alter table public.platform_content_audit_log
  enable row level security;

revoke all
on table public.platform_content_audit_log
from anon, authenticated;


-- ============================================================
-- 2. AUTHORITY HELPERS
-- ============================================================

create or replace function public.can_read_platform_content_admin()
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
        'ADMIN',
        'EDITOR',
        'MODERATOR'
      )
  );
$$;

revoke all
on function public.can_read_platform_content_admin()
from public;

grant execute
on function public.can_read_platform_content_admin()
to authenticated;


create or replace function public.can_manage_platform_content()
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
        'ADMIN',
        'EDITOR'
      )
  );
$$;

revoke all
on function public.can_manage_platform_content()
from public;

grant execute
on function public.can_manage_platform_content()
to authenticated;


-- ============================================================
-- 3. SUMMARY
-- ============================================================

create or replace function public.get_platform_content_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  result jsonb;
begin
  if not public.can_read_platform_content_admin() then
    raise exception
      'Platform content administration authority required';
  end if;

  select jsonb_build_object(
    'total',
      count(*),

    'draft',
      count(*) filter (
        where e.content_status = 'draft'
      ),

    'review',
      count(*) filter (
        where e.content_status = 'review'
      ),

    'published',
      count(*) filter (
        where e.content_status = 'published'
      ),

    'archived',
      count(*) filter (
        where e.content_status = 'archived'
      ),

    'verified',
      count(*) filter (
        where e.verification_status = 'verified'
      ),

    'sourceBacked',
      count(*) filter (
        where e.verification_status = 'source_backed'
      ),

    'unverified',
      count(*) filter (
        where e.verification_status = 'unverified'
      ),

    'featured',
      count(*) filter (
        where e.is_featured = true
      ),

    'byType',
      coalesce(
        (
          select jsonb_object_agg(
            typed.entity_type,
            typed.total
          )
          from (
            select
              entity_type,
              count(*) as total
            from public.entities
            group by entity_type
          ) as typed
        ),
        '{}'::jsonb
      )
  )
  into result
  from public.entities as e;

  return result;
end;
$$;

revoke all
on function public.get_platform_content_summary()
from public;

grant execute
on function public.get_platform_content_summary()
to authenticated;


-- ============================================================
-- 4. CONTENT DIRECTORY
-- ============================================================

create or replace function public.get_platform_content_entities(
  search_text text default null,
  filter_entity_type text default null,
  filter_content_status text default null,
  filter_verification_status text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  id uuid,
  entity_type text,
  slug text,
  canonical_path text,
  title text,
  subtitle text,
  summary text,
  geography_label text,
  geography_slug text,
  trust_label text,
  official_url text,
  content_status text,
  verification_status text,
  is_featured boolean,
  sort_rank integer,
  source_count bigint,
  media_count bigint,
  last_verified_at timestamptz,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  normalized_search text :=
    nullif(
      trim(
        coalesce(
          search_text,
          ''
        )
      ),
      ''
    );

  normalized_type text :=
    nullif(
      lower(
        trim(
          coalesce(
            filter_entity_type,
            ''
          )
        )
      ),
      ''
    );

  normalized_status text :=
    nullif(
      lower(
        trim(
          coalesce(
            filter_content_status,
            ''
          )
        )
      ),
      ''
    );

  normalized_verification text :=
    nullif(
      lower(
        trim(
          coalesce(
            filter_verification_status,
            ''
          )
        )
      ),
      ''
    );

  safe_limit integer :=
    least(
      greatest(
        coalesce(
          result_limit,
          100
        ),
        1
      ),
      500
    );

  safe_offset integer :=
    greatest(
      coalesce(
        result_offset,
        0
      ),
      0
    );
begin
  if not public.can_read_platform_content_admin() then
    raise exception
      'Platform content administration authority required';
  end if;

  return query
  select
    e.id,
    e.entity_type,
    e.slug,
    e.canonical_path,
    e.title,
    e.subtitle,
    e.summary,
    e.geography_label,
    e.geography_slug,
    e.trust_label,
    e.official_url,
    e.content_status,
    e.verification_status,
    e.is_featured,
    e.sort_rank,

    (
      select count(*)
      from public.entity_sources as s
      where s.entity_id = e.id
    ) as source_count,

    (
      select count(*)
      from public.entity_media as m
      where m.entity_id = e.id
    ) as media_count,

    e.last_verified_at,
    e.published_at,
    e.created_at,
    e.updated_at

  from public.entities as e

  where
    (
      normalized_type is null
      or e.entity_type =
        normalized_type
    )

    and (
      normalized_status is null
      or e.content_status =
        normalized_status
    )

    and (
      normalized_verification is null
      or e.verification_status =
        normalized_verification
    )

    and (
      normalized_search is null
      or e.title ilike
        '%' || normalized_search || '%'
      or e.slug ilike
        '%' || normalized_search || '%'
      or coalesce(
        e.subtitle,
        ''
      ) ilike
        '%' || normalized_search || '%'
      or coalesce(
        e.geography_label,
        ''
      ) ilike
        '%' || normalized_search || '%'
      or e.canonical_path ilike
        '%' || normalized_search || '%'
    )

  order by
    e.updated_at desc,
    e.title asc

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_content_entities(
  text,
  text,
  text,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_content_entities(
  text,
  text,
  text,
  text,
  integer,
  integer
)
to authenticated;


-- ============================================================
-- 5. CREATE DRAFT
-- ============================================================

create or replace function public.create_platform_entity_draft(
  target_entity_type text,
  target_slug text,
  target_title text,
  target_subtitle text default null,
  target_summary text default '',
  target_geography_label text default null,
  target_geography_slug text default null,
  target_trust_label text default null,
  target_official_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  actor_id uuid :=
    auth.uid();

  normalized_type text :=
    lower(
      trim(
        coalesce(
          target_entity_type,
          ''
        )
      )
    );

  normalized_slug text :=
    lower(
      trim(
        coalesce(
          target_slug,
          ''
        )
      )
    );

  normalized_title text :=
    trim(
      coalesce(
        target_title,
        ''
      )
    );

  canonical_path_value text;
  new_entity_id uuid;
begin
  if not public.can_manage_platform_content() then
    raise exception
      'Platform content management authority required';
  end if;

  if normalized_type not in (
    'project',
    'product',
    'knowledge',
    'person',
    'organisation',
    'university',
    'opportunity',
    'place'
  ) then
    raise exception
      'Invalid entity type';
  end if;

  if normalized_slug !~
    '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  then
    raise exception
      'Invalid entity slug';
  end if;

  if normalized_title = '' then
    raise exception
      'Entity title is required';
  end if;

  canonical_path_value :=
    case normalized_type
      when 'project'
        then '/projects/' ||
          normalized_slug

      when 'product'
        then '/products/' ||
          normalized_slug

      when 'knowledge'
        then '/knowledge/' ||
          normalized_slug

      when 'person'
        then '/people/' ||
          normalized_slug

      when 'organisation'
        then '/organisations/' ||
          normalized_slug

      when 'university'
        then '/universities/' ||
          normalized_slug

      when 'opportunity'
        then '/opportunities/' ||
          normalized_slug

      when 'place'
        then '/places/' ||
          normalized_slug
    end;

  insert into public.entities (
    entity_type,
    slug,
    canonical_path,
    title,
    subtitle,
    summary,
    geography_label,
    geography_slug,
    trust_label,
    official_url,
    content_status,
    verification_status
  )
  values (
    normalized_type,
    normalized_slug,
    canonical_path_value,
    normalized_title,
    nullif(
      trim(
        coalesce(
          target_subtitle,
          ''
        )
      ),
      ''
    ),
    coalesce(
      target_summary,
      ''
    ),
    nullif(
      trim(
        coalesce(
          target_geography_label,
          ''
        )
      ),
      ''
    ),
    nullif(
      lower(
        trim(
          coalesce(
            target_geography_slug,
            ''
          )
        )
      ),
      ''
    ),
    nullif(
      trim(
        coalesce(
          target_trust_label,
          ''
        )
      ),
      ''
    ),
    nullif(
      trim(
        coalesce(
          target_official_url,
          ''
        )
      ),
      ''
    ),
    'draft',
    'unverified'
  )
  returning id
  into new_entity_id;

  insert into public.platform_content_audit_log (
    actor_user_id,
    entity_id,
    entity_type,
    entity_slug,
    action,
    new_value
  )
  values (
    actor_id,
    new_entity_id,
    normalized_type,
    normalized_slug,
    'create',
    jsonb_build_object(
      'content_status',
        'draft',
      'verification_status',
        'unverified',
      'canonical_path',
        canonical_path_value
    )
  );

  return new_entity_id;
end;
$$;

revoke all
on function public.create_platform_entity_draft(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute
on function public.create_platform_entity_draft(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 6. EDIT CORE CONTENT
-- ============================================================

create or replace function public.update_platform_entity_content(
  target_entity_id uuid,
  target_title text,
  target_subtitle text,
  target_summary text,
  target_geography_label text,
  target_geography_slug text,
  target_trust_label text,
  target_official_url text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  actor_id uuid :=
    auth.uid();

  old_row public.entities%rowtype;
  new_row public.entities%rowtype;

  normalized_title text :=
    trim(
      coalesce(
        target_title,
        ''
      )
    );
begin
  if not public.can_manage_platform_content() then
    raise exception
      'Platform content management authority required';
  end if;

  if normalized_title = '' then
    raise exception
      'Entity title is required';
  end if;

  select *
  into old_row
  from public.entities
  where id = target_entity_id
  for update;

  if old_row.id is null then
    raise exception
      'Entity not found';
  end if;

  update public.entities
  set
    title =
      normalized_title,

    subtitle =
      nullif(
        trim(
          coalesce(
            target_subtitle,
            ''
          )
        ),
        ''
      ),

    summary =
      coalesce(
        target_summary,
        ''
      ),

    geography_label =
      nullif(
        trim(
          coalesce(
            target_geography_label,
            ''
          )
        ),
        ''
      ),

    geography_slug =
      nullif(
        lower(
          trim(
            coalesce(
              target_geography_slug,
              ''
            )
          )
        ),
        ''
      ),

    trust_label =
      nullif(
        trim(
          coalesce(
            target_trust_label,
            ''
          )
        ),
        ''
      ),

    official_url =
      nullif(
        trim(
          coalesce(
            target_official_url,
            ''
          )
        ),
        ''
      )

  where id =
    target_entity_id

  returning *
  into new_row;

  insert into public.platform_content_audit_log (
    actor_user_id,
    entity_id,
    entity_type,
    entity_slug,
    action,
    old_value,
    new_value
  )
  values (
    actor_id,
    old_row.id,
    old_row.entity_type,
    old_row.slug,
    'edit',

    jsonb_build_object(
      'title',
        old_row.title,
      'subtitle',
        old_row.subtitle,
      'summary',
        old_row.summary,
      'geography_label',
        old_row.geography_label,
      'geography_slug',
        old_row.geography_slug,
      'trust_label',
        old_row.trust_label,
      'official_url',
        old_row.official_url
    ),

    jsonb_build_object(
      'title',
        new_row.title,
      'subtitle',
        new_row.subtitle,
      'summary',
        new_row.summary,
      'geography_label',
        new_row.geography_label,
      'geography_slug',
        new_row.geography_slug,
      'trust_label',
        new_row.trust_label,
      'official_url',
        new_row.official_url
    )
  );
end;
$$;

revoke all
on function public.update_platform_entity_content(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute
on function public.update_platform_entity_content(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 7. LIFECYCLE / VERIFICATION / CURATION STATE
-- ============================================================

create or replace function public.set_platform_entity_state(
  target_entity_id uuid,
  target_content_status text,
  target_verification_status text,
  target_featured boolean,
  target_sort_rank integer
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  actor_id uuid :=
    auth.uid();

  normalized_content_status text :=
    lower(
      trim(
        coalesce(
          target_content_status,
          ''
        )
      )
    );

  normalized_verification_status text :=
    lower(
      trim(
        coalesce(
          target_verification_status,
          ''
        )
      )
    );

  old_row public.entities%rowtype;
  new_row public.entities%rowtype;
begin
  if not public.can_manage_platform_content() then
    raise exception
      'Platform content management authority required';
  end if;

  if normalized_content_status not in (
    'draft',
    'review',
    'published',
    'archived'
  ) then
    raise exception
      'Invalid content status';
  end if;

  if normalized_verification_status not in (
    'unverified',
    'source_backed',
    'verified'
  ) then
    raise exception
      'Invalid verification status';
  end if;

  select *
  into old_row
  from public.entities
  where id =
    target_entity_id
  for update;

  if old_row.id is null then
    raise exception
      'Entity not found';
  end if;

  update public.entities
  set
    content_status =
      normalized_content_status,

    verification_status =
      normalized_verification_status,

    is_featured =
      coalesce(
        target_featured,
        false
      ),

    sort_rank =
      coalesce(
        target_sort_rank,
        0
      ),

    published_at =
      case
        when
          normalized_content_status =
            'published'
          and published_at is null
        then now()
        else published_at
      end,

    last_verified_at =
      case
        when
          normalized_verification_status =
            'verified'
          and (
            verification_status <>
              'verified'
            or last_verified_at is null
          )
        then now()
        else last_verified_at
      end

  where id =
    target_entity_id

  returning *
  into new_row;

  insert into public.platform_content_audit_log (
    actor_user_id,
    entity_id,
    entity_type,
    entity_slug,
    action,
    old_value,
    new_value
  )
  values (
    actor_id,
    old_row.id,
    old_row.entity_type,
    old_row.slug,
    'state',

    jsonb_build_object(
      'content_status',
        old_row.content_status,
      'verification_status',
        old_row.verification_status,
      'is_featured',
        old_row.is_featured,
      'sort_rank',
        old_row.sort_rank
    ),

    jsonb_build_object(
      'content_status',
        new_row.content_status,
      'verification_status',
        new_row.verification_status,
      'is_featured',
        new_row.is_featured,
      'sort_rank',
        new_row.sort_rank
    )
  );
end;
$$;

revoke all
on function public.set_platform_entity_state(
  uuid,
  text,
  text,
  boolean,
  integer
)
from public;

grant execute
on function public.set_platform_entity_state(
  uuid,
  text,
  text,
  boolean,
  integer
)
to authenticated;


-- ============================================================
-- 8. SINGLE ENTITY ADMIN DETAIL
-- ============================================================

create or replace function public.get_platform_content_entity(
  target_entity_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  result jsonb;
begin
  if not public.can_read_platform_content_admin() then
    raise exception
      'Platform content administration authority required';
  end if;

  select
    jsonb_build_object(
      'id',
        e.id,

      'entityType',
        e.entity_type,

      'slug',
        e.slug,

      'canonicalPath',
        e.canonical_path,

      'title',
        e.title,

      'subtitle',
        e.subtitle,

      'summary',
        e.summary,

      'geographyLabel',
        e.geography_label,

      'geographySlug',
        e.geography_slug,

      'trustLabel',
        e.trust_label,

      'officialUrl',
        e.official_url,

      'contentStatus',
        e.content_status,

      'verificationStatus',
        e.verification_status,

      'featured',
        e.is_featured,

      'sortRank',
        e.sort_rank,

      'sourceCount',
        (
          select count(*)
          from public.entity_sources as s
          where s.entity_id = e.id
        ),

      'mediaCount',
        (
          select count(*)
          from public.entity_media as m
          where m.entity_id = e.id
        ),

      'lastVerifiedAt',
        e.last_verified_at,

      'publishedAt',
        e.published_at,

      'createdAt',
        e.created_at,

      'updatedAt',
        e.updated_at
    )
  into result
  from public.entities as e
  where e.id =
    target_entity_id;

  if result is null then
    raise exception
      'Entity not found';
  end if;

  return result;
end;
$$;

revoke all
on function public.get_platform_content_entity(
  uuid
)
from public;

grant execute
on function public.get_platform_content_entity(
  uuid
)
to authenticated;

commit;
