-- M17 Project Master
-- Bosco Verticale: canonical signature, topics and rights-safe hero media.

do $$
declare
  bosco_id uuid;
begin
  select id
  into bosco_id
  from public.entities
  where entity_type = 'project'
    and slug = 'bosco-verticale'
  limit 1;

  if bosco_id is null then
    raise exception 'Bosco Verticale production entity not found';
  end if;

  -- ---------------------------------------------------------
  -- Project Signature
  -- Adaptive highlight structure used by the Project Master.
  -- ---------------------------------------------------------

  update public.entities
  set
    detail = jsonb_set(
      detail,
      '{signature}',
      '[
        {"label":"Residential towers","value":"2"},
        {"label":"Trees","value":"800"},
        {"label":"Plants","value":"20,000"},
        {"label":"Plant species","value":"~100"}
      ]'::jsonb,
      true
    ),
    updated_at = now()
  where id = bosco_id;

  -- ---------------------------------------------------------
  -- Arknoz Lens / normalized topics
  -- ---------------------------------------------------------

  insert into public.entity_topics (
    entity_id,
    topic
  )
  values
    (bosco_id, 'Vertical Forest'),
    (bosco_id, 'Urban Biodiversity'),
    (bosco_id, 'High-Density Housing'),
    (bosco_id, 'Biophilic Design'),
    (bosco_id, 'Living Facade')
  on conflict (entity_id, topic)
  do nothing;

  -- ---------------------------------------------------------
  -- Canonical Project hero media
  -- CC0 / public-domain dedication.
  -- Source and provenance retained with the media record.
  -- ---------------------------------------------------------

  delete from public.entity_media
  where entity_id = bosco_id
    and role = 'hero';

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
  values (
    bosco_id,
    'hero',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bosco_verticale%2C_Milan%2C_Italy_%28Unsplash%29.jpg',
    'Bosco Verticale residential towers with planted balconies in Milan',
    'https://commons.wikimedia.org/wiki/File:Bosco_verticale,_Milan,_Italy_(Unsplash).jpg',
    'Chris Barbalis / Wikimedia Commons',
    'CC0 1.0',
    'public_domain',
    'verified',
    true,
    0
  );
end
$$;