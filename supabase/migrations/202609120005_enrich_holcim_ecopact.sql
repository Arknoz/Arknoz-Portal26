begin;

update public.entities
set
  detail = detail || jsonb_build_object(
    'properties', jsonb_build_array(
      jsonb_build_object(
        'title', 'Lower embodied carbon',
        'description', 'Holcim states that ECOPact starts at at least 30% lower CO' || chr(8322) || ' emissions compared with standard CEM I concrete, without offsets.'
      ),
      jsonb_build_object(
        'title', 'Performance',
        'description', 'The manufacturer states that ECOPact provides equal or better properties than conventional concrete.'
      ),
      jsonb_build_object(
        'title', 'Mix flexibility',
        'description', 'The range is offered across different strengths and applications according to local market requirements.'
      ),
      jsonb_build_object(
        'title', 'Conventional handling',
        'description', 'Holcim states that ECOPact can be placed, pumped and finished like conventional concrete.'
      )
    ),

    'applications', jsonb_build_array(
      jsonb_build_object(
        'title', 'Foundations',
        'description', 'Concrete applications at building and infrastructure foundation level.'
      ),
      jsonb_build_object(
        'title', 'Columns & beams',
        'description', 'Structural frame applications where locally available mixes are suitable.'
      ),
      jsonb_build_object(
        'title', 'Walls',
        'description', 'Concrete wall applications across appropriate construction types.'
      ),
      jsonb_build_object(
        'title', 'Driveways & walkways',
        'description', 'External and general concrete applications identified by the manufacturer.'
      )
    ),

    'sustainability', jsonb_build_array(
      jsonb_build_object(
        'title', 'Carbon reduction',
        'description', 'Manufacturer-reported reduction starts at 30% compared with standard CEM I concrete without offsets.'
      ),
      jsonb_build_object(
        'title', 'Circular construction',
        'description', 'The product range uses supplementary cementitious materials and can incorporate recycled construction-demolition materials where local norms allow.'
      ),
      jsonb_build_object(
        'title', 'Local production',
        'description', 'Holcim describes ECOPact as locally produced across participating markets.'
      )
    )
  ),
  updated_at = now()
where entity_type = 'product'
  and slug = 'holcim-ecopact';

insert into public.entity_topics (
  entity_id,
  topic
)
select
  e.id,
  t.topic
from public.entities e
cross join (
  values
    ('Low-carbon concrete'),
    ('Embodied carbon'),
    ('Circular construction')
) as t(topic)
where e.entity_type = 'product'
  and e.slug = 'holcim-ecopact'
on conflict (entity_id, topic)
do nothing;

do $$
declare
  property_count integer;
  topic_count integer;
begin
  select jsonb_array_length(detail->'properties')
  into property_count
  from public.entities
  where entity_type = 'product'
    and slug = 'holcim-ecopact';

  select count(*)
  into topic_count
  from public.entity_topics t
  join public.entities e
    on e.id = t.entity_id
  where e.entity_type = 'product'
    and e.slug = 'holcim-ecopact';

  if property_count <> 4 then
    raise exception 'ECOPact property enrichment failed: % properties', property_count;
  end if;

  if topic_count <> 3 then
    raise exception 'ECOPact topic enrichment failed: % topics', topic_count;
  end if;
end
$$;

commit;