begin;

update public.entities
set
  detail = detail || jsonb_build_object(
    'facts', jsonb_build_array(
      jsonb_build_object(
        'label', 'Type',
        'value', 'World Cities Report'
      ),
      jsonb_build_object(
        'label', 'Publisher',
        'value', 'UN-Habitat'
      ),
      jsonb_build_object(
        'label', 'Published',
        'value', '2024'
      ),
      jsonb_build_object(
        'label', 'Pages',
        'value', '373'
      ),
      jsonb_build_object(
        'label', 'Coverage',
        'value', 'Global'
      ),
      jsonb_build_object(
        'label', 'Language',
        'value', 'English'
      )
    ),

    'themes', jsonb_build_array(
      jsonb_build_object(
        'title', 'Urban climate risk',
        'description', 'Cities face growing exposure to heat, flooding, storms, drought and other climate-related hazards.'
      ),
      jsonb_build_object(
        'title', 'Adaptation & resilience',
        'description', 'Urban planning, infrastructure and governance influence how cities prepare for and respond to climate impacts.'
      ),
      jsonb_build_object(
        'title', 'Climate mitigation',
        'description', 'Cities are major centres of population, buildings, infrastructure and economic activity, making urban climate action important to emissions reduction.'
      ),
      jsonb_build_object(
        'title', 'Equity & vulnerability',
        'description', 'Climate impacts are unevenly distributed, with vulnerable and lower-income urban communities often facing greater exposure and fewer resources.'
      )
    )
  ),
  updated_at = now()
where entity_type = 'knowledge'
  and slug = 'world-cities-report-2024';

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
    ('Cities & Climate'),
    ('Urban Resilience'),
    ('Climate Action'),
    ('Urban Inequality')
) as t(topic)
where e.entity_type = 'knowledge'
  and e.slug = 'world-cities-report-2024'
on conflict (entity_id, topic)
do nothing;

do $$
declare
  fact_count integer;
  theme_count integer;
  topic_count integer;
begin
  select
    jsonb_array_length(detail->'facts'),
    jsonb_array_length(detail->'themes')
  into
    fact_count,
    theme_count
  from public.entities
  where entity_type = 'knowledge'
    and slug = 'world-cities-report-2024';

  select count(*)
  into topic_count
  from public.entity_topics t
  join public.entities e
    on e.id = t.entity_id
  where e.entity_type = 'knowledge'
    and e.slug = 'world-cities-report-2024';

  if fact_count <> 6 then
    raise exception
      'World Cities Report fact enrichment failed: % facts',
      fact_count;
  end if;

  if theme_count <> 4 then
    raise exception
      'World Cities Report theme enrichment failed: % themes',
      theme_count;
  end if;

  if topic_count <> 4 then
    raise exception
      'World Cities Report topic enrichment failed: % topics',
      topic_count;
  end if;
end
$$;

commit;