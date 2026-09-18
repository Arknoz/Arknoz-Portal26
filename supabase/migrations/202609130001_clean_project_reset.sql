-- ARKNOZ PROJECT CLEAN RESET
-- Removes all existing Project records and Project member actions.
-- Keeps the Projects category, routes, schema and historical migrations.
-- Dependent entity data is removed through ON DELETE CASCADE.

begin;

-- Remove saved/followed links pointing to old Project pages.
delete from public.member_actions
where target_path like '/projects/%';

-- Remove every current Project entity.
-- Cascades automatically remove:
--   entity_sources
--   entity_media
--   entity_subsections
--   entity_topics
--   entity_relations where the Project is either endpoint
delete from public.entities
where entity_type = 'project';

-- Fail closed if any Project somehow remains.
do $$
begin
  if exists (
    select 1
    from public.entities
    where entity_type = 'project'
  ) then
    raise exception
      'Arknoz Project clean reset failed: project records remain.';
  end if;

  if exists (
    select 1
    from public.member_actions
    where target_path like '/projects/%'
  ) then
    raise exception
      'Arknoz Project clean reset failed: stale project member actions remain.';
  end if;
end
$$;

commit;