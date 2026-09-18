-- M17 Project Master 01
-- Forth Bridge / Transport
-- Strict public layer:
-- factual data + GREEN-A media only.
-- No paid Arknoz intelligence is stored here.

do $$
declare
  forth_id uuid;
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
    'forth-bridge',
    '/projects/forth-bridge',
    'Forth Bridge',
    'Railway Bridge',
    'A monumental steel cantilever railway bridge across the Firth of Forth in Scotland, opened in 1890 and still operating as part of the railway network.',
    'Scotland, United Kingdom',
    'united-kingdom',
    'Operational',
    'https://www.networkrail.co.uk/who-we-are/our-history/iconic-infrastructure/the-history-of-the-forth-bridge-fife/',
    'published',
    'verified',
    $json$
    {
      "category": "Transport",

      "strapline":
        "A landmark railway crossing where structure becomes architecture.",

      "visualStatement":
        "Structure becomes architecture at the scale of an estuary.",

      "placeHref":
        "/global/scotland",

      "understanding":
        "The Forth Bridge carries railway traffic across the Firth of Forth between the Edinburgh and Fife sides of Scotland. Its three double-cantilever towers, large steel members and long suspended spans make its structural system directly legible in the form of the bridge.",

      "facts": [
        {
          "label": "Location",
          "value": "Scotland, United Kingdom"
        },
        {
          "label": "Project type",
          "value": "Railway bridge"
        },
        {
          "label": "Opened",
          "value": "4 March 1890"
        },
        {
          "label": "Status",
          "value": "Operational"
        },
        {
          "label": "Structural type",
          "value": "Cantilever truss"
        },
        {
          "label": "Material",
          "value": "Steel"
        },
        {
          "label": "Design",
          "value": "John Fowler + Benjamin Baker"
        },
        {
          "label": "Construction",
          "value": "Sir William Arrol & Co."
        }
      ],

      "signature": [
        {
          "label": "Major spans",
          "value": "521 m"
        },
        {
          "label": "Tower height",
          "value": "110 m"
        },
        {
          "label": "Steel",
          "value": "53,000 t"
        },
        {
          "label": "Rivets",
          "value": "6.5 million"
        }
      ],

      "anatomy": [
        {
          "title": "Design need",
          "description":
            "The crossing had to maintain a navigable channel while providing a rigid railway structure capable of carrying heavy train loads."
        },
        {
          "title": "Structural form",
          "description":
            "Three double-cantilever towers establish the main structural rhythm of the bridge, with cantilever arms supporting the suspended connecting spans."
        },
        {
          "title": "Steel system",
          "description":
            "Large riveted steel members form the primary compression and tension system and make the structural forces visually legible."
        },
        {
          "title": "Foundations",
          "description":
            "Major foundations were constructed using large caissons sunk into position before the steel superstructure was erected."
        },
        {
          "title": "Construction logic",
          "description":
            "The foundations were followed by progressive erection of the towers, cantilever arms and connecting spans until the steel bridge was completed in 1889."
        },
        {
          "title": "Performance & conservation",
          "description":
            "The bridge remains in railway use and has undergone major steel maintenance and protective-coating programmes to extend its working life."
        }
      ],

      "timeline": [
        {
          "date": "1882",
          "title": "Construction contract",
          "description":
            "The construction contract was let to Arrol & Co. of Glasgow."
        },
        {
          "date": "1883",
          "title": "Construction begins",
          "description":
            "Work began on the new cantilever bridge."
        },
        {
          "date": "1884",
          "title": "Foundation works",
          "description":
            "The first major caisson was floated into position."
        },
        {
          "date": "1886",
          "title": "Foundations ready",
          "description":
            "The principal foundations were ready to receive the steelwork."
        },
        {
          "date": "1889",
          "title": "Bridge completed",
          "description":
            "The bridge structure was completed in November 1889."
        },
        {
          "date": "1890",
          "title": "Formal opening",
          "description":
            "The bridge formally opened on 4 March 1890."
        },
        {
          "date": "2015",
          "title": "World Heritage",
          "description":
            "The Forth Bridge was inscribed on the UNESCO World Heritage List."
        }
      ],

      "people": [
        {
          "role": "Design engineer",
          "name": "Sir John Fowler"
        },
        {
          "role": "Design engineer",
          "name": "Sir Benjamin Baker"
        },
        {
          "role": "Construction",
          "name": "Sir William Arrol & Co."
        }
      ],

      "connections": [
        {
          "type": "PLACE",
          "title": "United Kingdom",
          "href": "/global/united-kingdom",
          "description":
            "Country context for the project."
        }
      ],

      "learning": []
    }
    $json$::jsonb,
    false,
    10,
    now(),
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
    sort_rank = excluded.sort_rank,
    last_verified_at = excluded.last_verified_at,
    published_at = coalesce(
      public.entities.published_at,
      excluded.published_at
    ),
    updated_at = now();

  select id
  into forth_id
  from public.entities
  where entity_type = 'project'
    and slug = 'forth-bridge'
  limit 1;

  if forth_id is null then
    raise exception 'Forth Bridge production entity was not created';
  end if;


  -- =========================================================
  -- 2. PROJECT CATEGORY
  -- =========================================================

  delete from public.entity_subsections
  where entity_id = forth_id
    and section_key = 'projects';

  insert into public.entity_subsections (
    entity_id,
    section_key,
    subsection_key
  )
  values (
    forth_id,
    'projects',
    'transport'
  );


  -- =========================================================
  -- 3. ARKNOZ LENS / TOPICS
  -- =========================================================

  delete from public.entity_topics
  where entity_id = forth_id;

  insert into public.entity_topics (
    entity_id,
    topic
  )
  values
    (forth_id, 'Rail Infrastructure'),
    (forth_id, 'Cantilever Bridge'),
    (forth_id, 'Steel Structures'),
    (forth_id, 'Bridge Engineering'),
    (forth_id, 'Heritage Engineering');


  -- =========================================================
  -- 4. FACTUAL EVIDENCE SOURCES
  -- These are references/evidence.
  -- Arknoz does not copy protected source prose.
  -- =========================================================

  delete from public.entity_sources
  where entity_id = forth_id;

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
      forth_id,
      'Forth Bridge structured record',
      'Wikidata',
      'https://www.wikidata.org/wiki/Q275',
      'other',
      now()
    ),
    (
      forth_id,
      'History of the Forth Bridge',
      'Network Rail',
      'https://www.networkrail.co.uk/who-we-are/our-history/iconic-infrastructure/the-history-of-the-forth-bridge-fife/',
      'official',
      now()
    ),
    (
      forth_id,
      'The Forth Bridge — World Heritage record',
      'UNESCO World Heritage Centre',
      'https://whc.unesco.org/en/list/1485',
      'official',
      now()
    );


  -- =========================================================
  -- 5. GREEN-A MEDIA
  -- Only worldwide Public Domain / CC0 material.
  -- =========================================================

  delete from public.entity_media
  where entity_id = forth_id;

  insert into public.entity_media (
    entity_id,
    role,
    url,
    alt,
    source_url,
    attribution,
    license,
    rights_status,
    provenance_status,
    publishable,
    sort_order
  )
  values

    (
      forth_id,
      'hero',
      'https://upload.wikimedia.org/wikipedia/commons/6/61/ForthRailwayBridge.jpg',
      'Forth Bridge crossing the Firth of Forth in Scotland',
      'https://commons.wikimedia.org/wiki/File:ForthRailwayBridge.jpg',
      'Renata / Wikimedia Commons',
      'Public Domain — worldwide release',
      'public_domain',
      'verified',
      true,
      1
    ),

    (
      forth_id,
      'diagram',
      'https://upload.wikimedia.org/wikipedia/commons/8/82/Forth_Bridge_side_view.svg',
      'Side elevation structural diagram of the Forth Bridge',
      'https://commons.wikimedia.org/wiki/File:Forth_Bridge_side_view.svg',
      'Sören Gasch / Wikimedia Commons',
      'CC0 1.0',
      'public_domain',
      'verified',
      true,
      2
    );

end
$$;