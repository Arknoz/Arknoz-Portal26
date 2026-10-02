-- Arknoz Project Master
-- Sydney Opera House
--
-- Production scope:
--   canonical Project entity
--   Buildings subsection
--   verified public facts in Project detail
--   verified factual evidence sources
--
-- Explicit exclusions:
--   NO media publication
--   NO R2 objects
--   NO candidate-media promotion
--   NO unsupported facts
--
-- Geography:
--   Project -> Sydney -> Australia -> Oceania -> Global
--
-- Evidence basis:
--   Sydney Opera House official
--   UNESCO World Heritage Centre
--   Museums of History NSW
--
-- Approved facts:
--   Architect: Jørn Utzon
--   Construction started: 2 March 1959
--   Opened: 1973
--   World Heritage inscription: 2007
--   World Heritage criterion: (i)

do $$
declare
  sydney_id uuid;
  source_count integer;
  media_count integer;
begin

  -- =========================================================
  -- 1. CANONICAL PROJECT RECORD
  -- =========================================================

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
    verification_status,
    detail,
    is_featured,
    sort_rank,
    last_verified_at,
    published_at
  )
  values (
    'project',
    'sydney-opera-house',
    '/projects/sydney-opera-house',
    'Sydney Opera House',
    'World Heritage Site',
    'Sydney Opera House in Sydney, Australia, was designed by Jørn Utzon. Construction began on 2 March 1959, the building opened in 1973, and it was inscribed on the UNESCO World Heritage List in 2007 under criterion (i).',
    'Sydney, Australia',
    'sydney',
    'Verified',
    'https://www.sydneyoperahouse.com/our-story',
    'published',
    'verified',

    $json$
    {
      "category": "Buildings",

      "strapline":
        "A Sydney cultural building designed by Jørn Utzon and inscribed on the UNESCO World Heritage List.",

      "placeHref":
        "/global/sydney",

      "understanding":
        "The Sydney Opera House is a major cultural building in Sydney, Australia. Its accepted Arknoz production record is limited here to independently supported facts: Jørn Utzon as architect, construction beginning on 2 March 1959, opening in 1973, and UNESCO World Heritage inscription in 2007 under criterion (i).",

      "facts": [
        {
          "label": "Location",
          "value": "Sydney, Australia"
        },
        {
          "label": "Architect",
          "value": "Jørn Utzon"
        },
        {
          "label": "Construction started",
          "value": "2 March 1959"
        },
        {
          "label": "Opened",
          "value": "1973"
        },
        {
          "label": "World Heritage inscription",
          "value": "2007"
        },
        {
          "label": "World Heritage criterion",
          "value": "(i)"
        }
      ],

      "timeline": [
        {
          "date": "2 March 1959",
          "title": "Construction began"
        },
        {
          "date": "1973",
          "title": "Sydney Opera House opened"
        },
        {
          "date": "2007",
          "title": "Inscribed on the UNESCO World Heritage List"
        }
      ],

      "people": [
        {
          "role": "Architect",
          "name": "Jørn Utzon"
        }
      ]
    }
    $json$::jsonb,

    false,
    1000,
    '2026-09-18T00:00:00Z'::timestamptz,
    now()
  )

  on conflict (entity_type, slug)
  do update set
    canonical_path = excluded.canonical_path,
    title = excluded.title,
    subtitle = excluded.subtitle,
    summary = excluded.summary,
    geography_label = excluded.geography_label,
    geography_slug = excluded.geography_slug,
    trust_label = excluded.trust_label,
    official_url = excluded.official_url,
    content_status = excluded.content_status,
    verification_status = excluded.verification_status,
    detail = excluded.detail,
    is_featured = excluded.is_featured,
    sort_rank = excluded.sort_rank,
    last_verified_at = excluded.last_verified_at,
    published_at = coalesce(
      public.entities.published_at,
      excluded.published_at
    ),
    updated_at = now();

  select id
  into sydney_id
  from public.entities
  where entity_type = 'project'
    and slug = 'sydney-opera-house'
  limit 1;

  if sydney_id is null then
    raise exception
      'Sydney Opera House production entity was not created';
  end if;


  -- =========================================================
  -- 2. PROJECT SUBSECTION
  -- =========================================================

  delete from public.entity_subsections
  where entity_id = sydney_id
    and section_key = 'projects';

  insert into public.entity_subsections (
    entity_id,
    section_key,
    subsection_key
  )
  values (
    sydney_id,
    'projects',
    'buildings'
  );


  -- =========================================================
  -- 3. VERIFIED FACTUAL EVIDENCE SOURCES
  -- =========================================================

  delete from public.entity_sources
  where entity_id = sydney_id;

  insert into public.entity_sources (
    entity_id,
    label,
    organisation,
    url,
    source_type,
    last_checked_at
  )
  values
    (
      sydney_id,
      'Sydney Opera House — Our Story',
      'Sydney Opera House',
      'https://www.sydneyoperahouse.com/our-story',
      'official',
      '2026-09-18T00:00:00Z'::timestamptz
    ),
    (
      sydney_id,
      'Sydney Opera House — World Heritage record',
      'UNESCO World Heritage Centre',
      'https://whc.unesco.org/en/list/166',
      'primary',
      '2026-09-18T00:00:00Z'::timestamptz
    ),
    (
      sydney_id,
      'Sydney Opera House construction began — 2 March 1959',
      'Museums of History NSW',
      'https://mhnsw.au/stories/on-this-day/2-march-1959/',
      'secondary',
      '2026-09-18T00:00:00Z'::timestamptz
    ),
    (
      sydney_id,
      'Sydney Opera House officially opened — 20 October 1973',
      'Museums of History NSW',
      'https://mhnsw.au/stories/on-this-day/20-october-1973/',
      'secondary',
      '2026-09-18T00:00:00Z'::timestamptz
    );


  -- =========================================================
  -- 4. MEDIA
  -- =========================================================
  --
  -- Intentionally NO entity_media writes.
  --
  -- Current Sydney media candidates remain:
  --   publication_approved = false
  --   public_storage_authorized = false
  --   database_publication_authorized = false
  --
  -- Therefore this production Project must render using the
  -- evidence-safe empty Media state until a later rights gate.


  -- =========================================================
  -- 5. FAIL-CLOSED VERIFICATION
  -- =========================================================

  if not exists (
    select 1
    from public.entities
    where id = sydney_id
      and entity_type = 'project'
      and slug = 'sydney-opera-house'
      and content_status = 'published'
      and verification_status = 'verified'
      and geography_slug = 'sydney'
  ) then
    raise exception
      'Sydney production verification failed';
  end if;

  select count(*)
  into source_count
  from public.entity_sources
  where entity_id = sydney_id;

  if source_count <> 4 then
    raise exception
      'Sydney source verification failed: expected 4, found %',
      source_count;
  end if;

  select count(*)
  into media_count
  from public.entity_media
  where entity_id = sydney_id;

  if media_count <> 0 then
    raise exception
      'Sydney media gate failed: expected zero public media rows, found %',
      media_count;
  end if;

end
$$;