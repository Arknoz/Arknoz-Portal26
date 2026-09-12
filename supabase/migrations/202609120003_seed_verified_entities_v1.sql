-- M17 Seed V1
-- Source-backed Arknoz records only.
-- No placeholder/demo records.
-- No media is imported in this seed.

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
values

(
  'project',
  'bosco-verticale',
  '/projects/bosco-verticale',
  'Bosco Verticale',
  'Project',
  'A pair of residential towers in Milan that integrate living vegetation directly into the architecture.',
  'Milan, Italy',
  null,
  'Completed',
  'https://www.stefanoboeriarchitetti.net/en/project/vertical-forest/',
  'published',
  'source_backed',
  $json$
  {
    "category": "Buildings",
    "strapline": "Architecture and living nature integrated into one vertical urban habitat.",
    "visualStatement": "Two residential towers shaped around architecture, vegetation and urban biodiversity.",
    "placeHref": "/places/milan",
    "understanding": "Bosco Verticale is a prototype for integrating substantial living vegetation into high-density residential architecture. The project combines two towers with trees, shrubs and plants distributed according to facade exposure while addressing the engineering demands of planting at height.",
    "facts": [
      {"label":"Location","value":"Milan, Italy"},
      {"label":"Project","value":"Boeri Studio"},
      {"label":"Year","value":"2007–2014"},
      {"label":"Client","value":"COIMA Sgr"},
      {"label":"Heights","value":"110 m / 76 m"},
      {"label":"GFA","value":"18,200 m²"},
      {"label":"Trees","value":"800"},
      {"label":"Plant species","value":"About 100"}
    ],
    "anatomy": [
      {"title":"Two residential towers","description":"The project consists of two residential towers approximately 110 metres and 76 metres high in Milan's Porta Nuova district."},
      {"title":"Living facade","description":"The towers host 800 trees, 4,500 shrubs and around 20,000 plants distributed in relation to the solar exposure of the facades."},
      {"title":"Tree engineering","description":"Structural stability of the trees was studied through botanical analysis, wind assessment and wind-tunnel testing."},
      {"title":"Metro and vibration engineering","description":"Engineering work also addressed the existing Milan Metro tunnels below the site and vibration effects on the buildings."}
    ],
    "timeline": [
      {"date":"2007","title":"Project period begins","description":"The official project record identifies the development period as 2007–2014."},
      {"date":"2014","title":"Project completed","description":"The two Vertical Forest towers were completed in Milan."},
      {"date":"2014","title":"International Highrise Award","description":"Bosco Verticale received the International Highrise Award."},
      {"date":"2015","title":"CTBUH recognition","description":"The project received global tall-building recognition from CTBUH."}
    ],
    "people": [
      {"role":"Architecture","name":"Boeri Studio"},
      {"role":"Architect","name":"Stefano Boeri","href":"/people/stefano-boeri"},
      {"role":"Structural engineering","name":"Arup Italia"},
      {"role":"Facilities design","name":"Deerns Italia"},
      {"role":"Landscape / park","name":"LAND"},
      {"role":"Botanical consultancy","name":"Emanuela Borio & Laura Gatti"}
    ]
  }
  $json$::jsonb,
  true,
  10,
  now(),
  now()
),

(
  'project',
  'wonderwoods-utrecht',
  '/projects/wonderwoods-utrecht',
  'Wonderwoods',
  'Project',
  'A mixed-use Vertical Forest project in Utrecht by Stefano Boeri Architetti and MVSA Architects.',
  'Utrecht, Netherlands',
  null,
  'Completed',
  'https://www.stefanoboeriarchitetti.net/en/project/wonderwoods/',
  'published',
  'source_backed',
  $json$
  {
    "category":"Buildings",
    "strapline":"A mixed-use vertical forest in the heart of Utrecht.",
    "placeHref":"/global",
    "understanding":"Wonderwoods combines mixed-use urban functions with the Vertical Forest model as part of Utrecht's Beurskwartier regeneration.",
    "facts":[
      {"label":"Location","value":"Utrecht, Netherlands"},
      {"label":"Project","value":"SBA + MVSA Architects"},
      {"label":"Year","value":"2017–2025"},
      {"label":"Typology","value":"Vertical Forest"}
    ]
  }
  $json$::jsonb,
  false,
  20,
  now(),
  now()
),

(
  'project',
  'trudo-vertical-forest',
  '/projects/trudo-vertical-forest',
  'Trudo Vertical Forest',
  'Project',
  'A social-housing application of the Vertical Forest model in Eindhoven.',
  'Eindhoven, Netherlands',
  null,
  'Completed',
  'https://www.stefanoboeriarchitetti.net/en/project/trudo-vertical-forest/',
  'published',
  'source_backed',
  $json$
  {
    "category":"Buildings",
    "strapline":"Vertical Forest architecture applied to social housing.",
    "placeHref":"/global",
    "understanding":"Trudo Vertical Forest applies the Vertical Forest model to social housing, combining compact apartments with planted balconies and shared environmental benefits.",
    "facts":[
      {"label":"Location","value":"Eindhoven, Netherlands"},
      {"label":"Project","value":"Stefano Boeri Architetti"},
      {"label":"Year","value":"2017–2021"},
      {"label":"Typology","value":"Vertical Forest"}
    ]
  }
  $json$::jsonb,
  false,
  30,
  now(),
  now()
),

(
  'project',
  'nanjing-vertical-forest',
  '/projects/nanjing-vertical-forest',
  'Nanjing Vertical Forest',
  'Project',
  'A two-tower Vertical Forest development in Nanjing integrating architecture and extensive vegetation.',
  'Nanjing, China',
  null,
  'Ongoing',
  'https://www.stefanoboeriarchitetti.net/en/project/nanjing-vertical-forest/',
  'published',
  'source_backed',
  $json$
  {
    "category":"Buildings",
    "strapline":"Vertical Forest architecture adapted to the urban context of Nanjing.",
    "placeHref":"/global",
    "understanding":"Nanjing Vertical Forest extends the Vertical Forest typology into a pair of green towers in Nanjing with mixed public, commercial and working functions.",
    "facts":[
      {"label":"Location","value":"Nanjing, China"},
      {"label":"Project","value":"Stefano Boeri Architetti China"},
      {"label":"Year","value":"2016–ongoing"},
      {"label":"Typology","value":"Vertical Forest"}
    ]
  }
  $json$::jsonb,
  false,
  40,
  now(),
  now()
),

(
  'product',
  'holcim-ecopact',
  '/products/holcim-ecopact',
  'Holcim ECOPact',
  'Product',
  'Holcim''s range of low-carbon concrete for buildings and infrastructure.',
  'Global',
  'global',
  'Official source',
  'https://www.holcim.com/building-materials-solutions/ecopact',
  'published',
  'source_backed',
  $json$
  {
    "category":"Building Materials",
    "subCategory":"Concrete",
    "strapline":"Lower-carbon concrete designed for buildings and infrastructure.",
    "overview":"ECOPact is Holcim's range of low-carbon concrete. The manufacturer positions the range for structural and general construction applications while reducing embodied carbon compared with conventional concrete reference mixes.",
    "manufacturer":"Holcim",
    "manufacturerHref":"https://www.holcim.com/",
    "availability":"More than 30 markets",
    "facts":[
      {"label":"Product type","value":"Low-carbon concrete"},
      {"label":"Manufacturer","value":"Holcim"},
      {"label":"Availability","value":"30+ markets"},
      {"label":"Carbon","value":"At least 30% lower CO₂"},
      {"label":"Performance","value":"Conventional-concrete performance"},
      {"label":"Use","value":"Buildings & infrastructure"}
    ]
  }
  $json$::jsonb,
  true,
  50,
  now(),
  now()
),

(
  'knowledge',
  'world-cities-report-2024',
  '/knowledge/world-cities-report-2024',
  'World Cities Report 2024',
  'Cities and Climate Action',
  'UN-Habitat''s 2024 World Cities Report examines cities and climate action, including urban climate risks, resilience, mitigation and inequality.',
  'Global',
  'global',
  'Official source',
  'https://unhabitat.org/world-cities-report-2024-cities-and-climate-action',
  'published',
  'source_backed',
  $json$
  {
    "section":"Books & Publications",
    "recordType":"Report",
    "strapline":"Cities and Climate Action",
    "abstract":"World Cities Report 2024 examines the relationship between urbanisation and climate change, including the exposure of cities to climate hazards, the role of cities in emissions, resilience and adaptation, and the unequal effects of climate risk on urban communities.",
    "publisher":"UN-Habitat",
    "year":"2024",
    "pages":"373",
    "language":"English",
    "geography":"Global",
    "access":"Official publication source available",
    "rights":"All rights reserved. Public access does not imply redistribution rights."
  }
  $json$::jsonb,
  true,
  60,
  now(),
  now()
),

(
  'person',
  'stefano-boeri',
  '/people/stefano-boeri',
  'Stefano Boeri',
  'Person',
  'Professional identity connected to projects and design practice.',
  'Milan, Italy',
  null,
  'Public professional record',
  'https://www.stefanoboeriarchitetti.net/en/stefano-boeri-biography/',
  'published',
  'source_backed',
  $json$
  {
    "kind":"person",
    "category":"Architects & Urbanists",
    "professionalLine":"Architect · Urban Planner · Professor",
    "tagline":"Architecture, urban forestry and the transformation of contemporary cities.",
    "overview":"Stefano Boeri is an architect and urban planner based in Milan. His professional and academic work spans architecture, urban design, biodiversity and urban forestry, including the Bosco Verticale project and research into the relationship between cities, climate and living systems.",
    "location":"Milan, Italy",
    "officialLabel":"Official biography",
    "statusLabel":"Public professional record"
  }
  $json$::jsonb,
  true,
  70,
  now(),
  now()
),

(
  'organisation',
  'white-arkitekter',
  '/organisations/white-arkitekter',
  'White Arkitekter',
  'Organisation',
  'A practice represented as a canonical organisation.',
  'Gothenburg, Sweden',
  null,
  'Official organisation record',
  'https://whitearkitekter.com/about-white/',
  'published',
  'source_backed',
  $json$
  {
    "kind":"organisation",
    "category":"Architecture & Design Practices",
    "professionalLine":"Architecture · Urban Design · Research",
    "tagline":"Employee-owned architecture and design practice working toward more sustainable built environments.",
    "overview":"White Arkitekter is a Scandinavian architecture practice founded in Gothenburg in 1951. The practice works across architecture and the wider built environment and describes employee ownership, collaboration, research and sustainability as central to its organisation and work.",
    "location":"Gothenburg, Sweden",
    "officialLabel":"Official website",
    "statusLabel":"Official organisation record"
  }
  $json$::jsonb,
  false,
  80,
  now(),
  now()
),

(
  'university',
  'politecnico-di-milano',
  '/universities/politecnico-di-milano',
  'Politecnico di Milano',
  'University',
  'University, programmes, research, people and Built World connections.',
  'Milan, Italy',
  null,
  'Official institution record',
  'https://www.polimi.it/en/the-politecnico/about-polimi',
  'published',
  'source_backed',
  $json$
  {
    "kind":"university",
    "category":"Universities & Institutions",
    "professionalLine":"Architecture · Engineering · Design",
    "tagline":"A public scientific-technological university connecting education, research and the productive world.",
    "overview":"Politecnico di Milano is a public scientific-technological university educating engineers, architects and industrial designers. Its institutional mission connects teaching, research, innovation, technology transfer and relationships with industry and public administration.",
    "location":"Milan, Italy",
    "officialLabel":"Official university",
    "statusLabel":"Official institution record"
  }
  $json$::jsonb,
  true,
  90,
  now(),
  now()
),

(
  'opportunity',
  'vancouver-tall-challenge',
  '/opportunities/opportunity/vancouver-tall-challenge',
  'Vancouver Tall Challenge',
  'Competition',
  'An international architecture ideas competition exploring the future of height and density in downtown Vancouver.',
  'Vancouver, Canada',
  null,
  'Official source',
  'https://architecturecompetitions.com/VancouverTallChallenge',
  'published',
  'source_backed',
  $json$
  {
    "category":"Competitions",
    "opportunityType":"Ideas Competition",
    "strapline":"Design the future of Vancouver's skyline.",
    "organiser":"Buildner",
    "geography":"Vancouver, Canada",
    "eligibility":"Open to all",
    "prize":"$15,000 CAD",
    "status":"Registration open",
    "registrationDeadline":"29 October 2026",
    "submissionDeadline":"30 November 2026",
    "lastChecked":"12 Sep 2026"
  }
  $json$::jsonb,
  true,
  100,
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
  is_featured = excluded.is_featured,
  sort_rank = excluded.sort_rank,
  last_verified_at = excluded.last_verified_at,
  published_at = coalesce(entities.published_at, excluded.published_at);


insert into public.entity_sources (
  entity_id,
  label,
  organisation,
  url,
  source_type,
  last_checked_at
)
select
  e.id,
  s.label,
  s.organisation,
  s.url,
  'official',
  now()
from (
  values
    ('project','bosco-verticale','Vertical Forest — official project record','Stefano Boeri Architetti','https://www.stefanoboeriarchitetti.net/en/project/vertical-forest/'),
    ('project','bosco-verticale','Bosco Verticale — engineering project record','Arup','https://www.arup.com/projects/bosco-verticale/'),
    ('project','wonderwoods-utrecht','Wonderwoods — official project record','Stefano Boeri Architetti','https://www.stefanoboeriarchitetti.net/en/project/wonderwoods/'),
    ('project','trudo-vertical-forest','Trudo Vertical Forest — official project record','Stefano Boeri Architetti','https://www.stefanoboeriarchitetti.net/en/project/trudo-vertical-forest/'),
    ('project','nanjing-vertical-forest','Nanjing Vertical Forest — official project record','Stefano Boeri Architetti','https://www.stefanoboeriarchitetti.net/en/project/nanjing-vertical-forest/'),
    ('product','holcim-ecopact','ECOPact — official product record','Holcim','https://www.holcim.com/building-materials-solutions/ecopact'),
    ('product','holcim-ecopact','Sustainable offering','Holcim','https://www.holcim.com/sustainable-offering'),
    ('knowledge','world-cities-report-2024','World Cities Report 2024: Cities and Climate Action','UN-Habitat','https://unhabitat.org/world-cities-report-2024-cities-and-climate-action'),
    ('person','stefano-boeri','Stefano Boeri — official biography','Stefano Boeri Architetti','https://www.stefanoboeriarchitetti.net/en/stefano-boeri-biography/'),
    ('person','stefano-boeri','Stefano Boeri — faculty record','Politecnico di Milano','https://www.dastu.polimi.it/it/personale/stefano.boeri'),
    ('organisation','white-arkitekter','About White','White Arkitekter','https://whitearkitekter.com/about-white/'),
    ('organisation','white-arkitekter','Offices and contact','White Arkitekter','https://whitearkitekter.com/contact-us/'),
    ('university','politecnico-di-milano','About Polimi','Politecnico di Milano','https://www.polimi.it/en/the-politecnico/about-polimi'),
    ('university','politecnico-di-milano','Politecnico programmes','Politecnico di Milano','https://www.polimi.it/en/prospective-students/politecnico-programmes'),
    ('opportunity','vancouver-tall-challenge','Vancouver Tall Challenge — official competition page','Buildner','https://architecturecompetitions.com/VancouverTallChallenge'),
    ('opportunity','vancouver-tall-challenge','Buildner — Architecture Competitions','Buildner','https://architecturecompetitions.com/')
) as s(entity_type, slug, label, organisation, url)
join public.entities e
  on e.entity_type = s.entity_type
 and e.slug = s.slug
on conflict (entity_id, url)
do update set
  label = excluded.label,
  organisation = excluded.organisation,
  source_type = excluded.source_type,
  last_checked_at = excluded.last_checked_at;


insert into public.entity_subsections (
  entity_id,
  section_key,
  subsection_key
)
select
  e.id,
  s.section_key,
  s.subsection_key
from (
  values
    ('project','bosco-verticale','projects','buildings'),
    ('project','wonderwoods-utrecht','projects','buildings'),
    ('project','trudo-vertical-forest','projects','buildings'),
    ('project','nanjing-vertical-forest','projects','buildings'),
    ('opportunity','vancouver-tall-challenge','opportunities','competitions')
) as s(entity_type, slug, section_key, subsection_key)
join public.entities e
  on e.entity_type = s.entity_type
 and e.slug = s.slug
on conflict do nothing;


insert into public.entity_relations (
  from_entity_id,
  to_entity_id,
  relation_type,
  description,
  verification_status,
  source_url,
  last_verified_at
)
select
  f.id,
  t.id,
  r.relation_type,
  r.description,
  'source_backed',
  r.source_url,
  now()
from (
  values
    (
      'project','bosco-verticale',
      'person','stefano-boeri',
      'architect',
      'Architectural authorship connection.',
      'https://www.stefanoboeriarchitetti.net/en/project/vertical-forest/'
    ),
    (
      'person','stefano-boeri',
      'university','politecnico-di-milano',
      'academic_affiliation',
      'Academic affiliation supported by the university faculty record.',
      'https://www.dastu.polimi.it/it/personale/stefano.boeri'
    )
) as r(
  from_type,
  from_slug,
  to_type,
  to_slug,
  relation_type,
  description,
  source_url
)
join public.entities f
  on f.entity_type = r.from_type
 and f.slug = r.from_slug
join public.entities t
  on t.entity_type = r.to_type
 and t.slug = r.to_slug
on conflict (
  from_entity_id,
  to_entity_id,
  relation_type
)
do update set
  description = excluded.description,
  verification_status = excluded.verification_status,
  source_url = excluded.source_url,
  last_verified_at = excluded.last_verified_at;