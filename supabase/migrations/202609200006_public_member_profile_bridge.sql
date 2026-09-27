-- Arknoz Public Member Profile Bridge
--
-- Public disclosure is permitted only when:
-- 1. member_profiles.person_entity_id is linked by the trusted system
-- 2. the linked entity is a published Person record
--
-- The function returns only explicitly selected public-safe fields.
-- It does not expose user_id, email, auth metadata or protected entity IDs.

create or replace function public.get_public_member_profile(
  person_slug text
)
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog
as $$
  with linked_member as (
    select
      p.user_id,
      p.full_name,
      p.stage,
      p.headline,
      p.organisation,
      p.location,
      p.about,
      p.disciplines,
      p.sectors,
      p.skills,
      p.languages,
      p.years_experience,
      p.countries,
      p.website,
      p.portfolio_url,
      p.linkedin_url,

      (
        upper(
          coalesce(
            u.raw_app_meta_data ->> 'membership',
            ''
          )
        ) = 'PRO'
      ) as is_pro

    from public.member_profiles p

    inner join public.entities e
      on e.id = p.person_entity_id

    inner join auth.users u
      on u.id = p.user_id

    where
      e.entity_type = 'person'
      and e.slug = person_slug
      and e.content_status = 'published'

    limit 1
  )

  select
    jsonb_build_object(
      'membership',
        case
          when m.is_pro then 'PRO'
          else 'FREE'
        end,

      'stage',
        m.stage,

      'headline',
        m.headline,

      'organisation',
        m.organisation,

      'location',
        m.location,

      'about',
        m.about,

      'disciplines',
        to_jsonb(m.disciplines),

      'sectors',
        to_jsonb(m.sectors),

      'skills',
        to_jsonb(m.skills),

      'languages',
        to_jsonb(m.languages),

      'yearsExperience',
        m.years_experience,

      'countries',
        to_jsonb(m.countries),

      'availability',
        '[]'::jsonb,

      'featuredProjects',
        '[]'::jsonb,

      'workedWith',
        '[]'::jsonb,

      'website',
        m.website,

      'portfolioUrl',
        m.portfolio_url,

      'linkedinUrl',
        m.linkedin_url,

      'experience',
        case
          when m.is_pro then
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'role',
                      x.role_title,

                    'organisation',
                      x.organisation,

                    'location',
                      x.location,

                    'start',
                      case
                        when x.start_date is null
                          then null
                        else to_char(
                          x.start_date,
                          'YYYY'
                        )
                      end,

                    'end',
                      case
                        when x.end_date is null
                          then null
                        else to_char(
                          x.end_date,
                          'YYYY'
                        )
                      end,

                    'current',
                      x.is_current,

                    'description',
                      nullif(
                        x.description,
                        ''
                      )
                  )
                  order by
                    x.is_current desc,
                    x.start_date desc nulls last,
                    x.created_at desc
                )

                from public.member_experiences x

                where
                  x.user_id = m.user_id
              ),
              '[]'::jsonb
            )

          else
            '[]'::jsonb
        end,

      'credentials',
        case
          when m.is_pro then
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'title',
                      c.title,

                    'issuer',
                      c.issuer,

                    'reference',
                      c.credential_id,

                    'verification',
                      c.verification_state
                  )
                  order by
                    c.issue_date desc nulls last,
                    c.created_at desc
                )

                from public.member_credentials c

                where
                  c.user_id = m.user_id
              ),
              '[]'::jsonb
            )

          else
            '[]'::jsonb
        end,

      'services',
        case
          when m.is_pro then
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id',
                      s.id::text,

                    'title',
                      s.title,

                    'category',
                      initcap(
                        replace(
                          s.service_type,
                          '_',
                          ' '
                        )
                      ),

                    'summary',
                      s.summary,

                    'turnaround',
                      nullif(
                        s.availability,
                        ''
                      ),

                    'active',
                      true
                  )
                  order by
                    s.updated_at desc,
                    s.created_at desc
                )

                from public.member_services s

                where
                  s.user_id = m.user_id
                  and s.status = 'published'
              ),
              '[]'::jsonb
            )

          else
            '[]'::jsonb
        end,

      'arknozCvEnabled',
        m.is_pro,

      'visualPortfolioEnabled',
        m.is_pro
    )

  from linked_member m;
$$;


revoke all
on function public.get_public_member_profile(text)
from public;


grant execute
on function public.get_public_member_profile(text)
to anon, authenticated;


comment on function public.get_public_member_profile(text)
is
'Returns the controlled public-safe Arknoz member profile for a trusted member-to-published-person link. Private auth identity and protected IDs are never returned.';