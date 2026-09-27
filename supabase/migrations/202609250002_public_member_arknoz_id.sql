-- ARKNOZ PUBLIC MEMBER ID BRIDGE
--
-- Local migration record for the public Arknoz ID lookup already present
-- in the live database.
--
-- Public disclosure is permitted only when:
-- 1. member_profiles.person_entity_id is linked by the trusted system
-- 2. the linked entity is a published Person record
--
-- Returns only the public Arknoz ID.
-- Does not expose user_id, email, auth metadata or protected entity IDs.

create or replace function public.get_public_member_arknoz_id(
  person_slug text
)
returns text
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    p.arknoz_id
  from public.member_profiles p
  inner join public.entities e
    on e.id = p.person_entity_id
  where
    e.entity_type = 'person'
    and e.slug = person_slug
    and e.content_status = 'published'
  limit 1;
$$;


revoke all
on function public.get_public_member_arknoz_id(text)
from public;


grant execute
on function public.get_public_member_arknoz_id(text)
to anon, authenticated;


comment on function public.get_public_member_arknoz_id(text)
is
'Returns the public permanent Arknoz ID for a trusted member linked to a published Person record. Private auth identity is never returned.';
