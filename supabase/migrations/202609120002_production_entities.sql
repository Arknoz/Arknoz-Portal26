create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),

  entity_type text not null
    check (
      entity_type in (
        'project',
        'product',
        'knowledge',
        'person',
        'organisation',
        'university',
        'opportunity',
        'place'
      )
    ),

  slug text not null
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  canonical_path text not null
    check (
      canonical_path like '/%'
      and canonical_path not like '//%'
      and length(canonical_path) <= 500
    ),

  title text not null,
  subtitle text,
  summary text not null default '',

  geography_label text,
  geography_slug text,

  trust_label text,
  official_url text,

  content_status text not null default 'draft'
    check (
      content_status in (
        'draft',
        'review',
        'published',
        'archived'
      )
    ),

  verification_status text not null default 'unverified'
    check (
      verification_status in (
        'unverified',
        'source_backed',
        'verified'
      )
    ),

  detail jsonb not null default '{}'::jsonb,

  is_featured boolean not null default false,
  sort_rank integer not null default 0,

  last_verified_at timestamptz,
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (entity_type, slug),
  unique (canonical_path)
);


create table if not exists public.entity_sources (
  id uuid primary key default gen_random_uuid(),

  entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  label text not null,
  organisation text,
  url text not null,

  source_type text not null default 'official'
    check (
      source_type in (
        'official',
        'primary',
        'secondary',
        'partner',
        'other'
      )
    ),

  last_checked_at timestamptz,

  created_at timestamptz not null default now(),

  unique (entity_id, url)
);


create table if not exists public.entity_media (
  id uuid primary key default gen_random_uuid(),

  entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  role text not null default 'gallery',
  url text not null,
  alt text,

  source_url text,
  attribution text,
  license text,

  rights_status text not null default 'unknown'
    check (
      rights_status in (
        'unknown',
        'owned',
        'licensed',
        'public_domain',
        'permission',
        'approved_external'
      )
    ),

  provenance_status text not null default 'unknown'
    check (
      provenance_status in (
        'unknown',
        'recorded',
        'verified'
      )
    ),

  publishable boolean not null default false,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  check (
    publishable = false
    or (
      rights_status <> 'unknown'
      and provenance_status <> 'unknown'
    )
  )
);


create table if not exists public.entity_relations (
  id uuid primary key default gen_random_uuid(),

  from_entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  to_entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  relation_type text not null,
  description text,

  verification_status text not null default 'unverified'
    check (
      verification_status in (
        'unverified',
        'source_backed',
        'verified'
      )
    ),

  source_url text,
  last_verified_at timestamptz,

  created_at timestamptz not null default now(),

  check (from_entity_id <> to_entity_id),

  unique (
    from_entity_id,
    to_entity_id,
    relation_type
  )
);


create table if not exists public.entity_subsections (
  entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  section_key text not null,
  subsection_key text not null,

  primary key (
    entity_id,
    section_key,
    subsection_key
  )
);


create table if not exists public.entity_topics (
  entity_id uuid not null
    references public.entities(id)
    on delete cascade,

  topic text not null,

  primary key (
    entity_id,
    topic
  )
);


create index if not exists entities_public_type_idx
  on public.entities (
    content_status,
    entity_type
  );

create index if not exists entities_geography_idx
  on public.entities (
    geography_slug
  );

create index if not exists entities_featured_idx
  on public.entities (
    content_status,
    is_featured,
    sort_rank
  );

create index if not exists entities_search_idx
  on public.entities
  using gin (
    to_tsvector(
      'simple',
      coalesce(title, '') ||
      ' ' ||
      coalesce(subtitle, '') ||
      ' ' ||
      coalesce(summary, '') ||
      ' ' ||
      coalesce(geography_label, '')
    )
  );

create index if not exists entities_detail_idx
  on public.entities
  using gin (detail);

create index if not exists entity_sources_entity_idx
  on public.entity_sources(entity_id);

create index if not exists entity_media_entity_idx
  on public.entity_media(entity_id, sort_order);

create index if not exists entity_relations_from_idx
  on public.entity_relations(from_entity_id);

create index if not exists entity_relations_to_idx
  on public.entity_relations(to_entity_id);


create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists entities_set_updated_at
  on public.entities;

create trigger entities_set_updated_at
before update on public.entities
for each row
execute function public.set_updated_at();


alter table public.entities enable row level security;
alter table public.entity_sources enable row level security;
alter table public.entity_media enable row level security;
alter table public.entity_relations enable row level security;
alter table public.entity_subsections enable row level security;
alter table public.entity_topics enable row level security;


drop policy if exists "Public can read published entities"
  on public.entities;

create policy "Public can read published entities"
  on public.entities
  for select
  to anon, authenticated
  using (content_status = 'published');


drop policy if exists "Public can read sources for published entities"
  on public.entity_sources;

create policy "Public can read sources for published entities"
  on public.entity_sources
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.entities e
      where e.id = entity_sources.entity_id
        and e.content_status = 'published'
    )
  );


drop policy if exists "Public can read approved media"
  on public.entity_media;

create policy "Public can read approved media"
  on public.entity_media
  for select
  to anon, authenticated
  using (
    publishable = true
    and exists (
      select 1
      from public.entities e
      where e.id = entity_media.entity_id
        and e.content_status = 'published'
    )
  );


drop policy if exists "Public can read published relations"
  on public.entity_relations;

create policy "Public can read published relations"
  on public.entity_relations
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.entities e
      where e.id = entity_relations.from_entity_id
        and e.content_status = 'published'
    )
    and exists (
      select 1
      from public.entities e
      where e.id = entity_relations.to_entity_id
        and e.content_status = 'published'
    )
  );


drop policy if exists "Public can read published subsections"
  on public.entity_subsections;

create policy "Public can read published subsections"
  on public.entity_subsections
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.entities e
      where e.id = entity_subsections.entity_id
        and e.content_status = 'published'
    )
  );


drop policy if exists "Public can read published topics"
  on public.entity_topics;

create policy "Public can read published topics"
  on public.entity_topics
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.entities e
      where e.id = entity_topics.entity_id
        and e.content_status = 'published'
    )
  );


revoke all on table public.entities
  from anon, authenticated;

revoke all on table public.entity_sources
  from anon, authenticated;

revoke all on table public.entity_media
  from anon, authenticated;

revoke all on table public.entity_relations
  from anon, authenticated;

revoke all on table public.entity_subsections
  from anon, authenticated;

revoke all on table public.entity_topics
  from anon, authenticated;


grant select on table public.entities
  to anon, authenticated;

grant select on table public.entity_sources
  to anon, authenticated;

grant select on table public.entity_media
  to anon, authenticated;

grant select on table public.entity_relations
  to anon, authenticated;

grant select on table public.entity_subsections
  to anon, authenticated;

grant select on table public.entity_topics
  to anon, authenticated;