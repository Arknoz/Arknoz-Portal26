-- Arknoz Platform Admin Member Detail read model
--
-- Read-only administrative view of one member.
-- Reuses existing canonical identity, profile, entitlement,
-- experience, credentials, services, actions and connection requests.
--
-- No direct table grants are introduced.

begin;

create or replace function public.get_platform_member_detail(
  target_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  result jsonb;
begin
  if auth.uid() is null then
    raise exception
      'Authentication required';
  end if;

  if not exists (
    select 1
    from public.platform_admins as pa
    where pa.user_id = auth.uid()
      and pa.status = 'active'
      and pa.platform_role in (
        'OWNER',
        'ADMIN'
      )
  ) then
    raise exception
      'Platform member administration authority required';
  end if;

  if target_user_id is null then
    raise exception
      'Member user ID is required';
  end if;

  select
    jsonb_build_object(

      -- ========================================================
      -- AUTH ACCOUNT
      -- ========================================================

      'account',
      jsonb_build_object(
        'userId',
          u.id,

        'email',
          u.email,

        'emailVerified',
          u.email_confirmed_at is not null,

        'createdAt',
          u.created_at,

        'lastSignInAt',
          u.last_sign_in_at
      ),

      -- ========================================================
      -- ARKNOZ IDENTITY / PROFILE
      -- ========================================================

      'profile',
      jsonb_build_object(
        'arknozId',
          p.arknoz_id,

        'fullName',
          coalesce(
            p.full_name,
            ''
          ),

        'stage',
          coalesce(
            p.stage,
            'professional'
          ),

        'headline',
          coalesce(
            p.headline,
            ''
          ),

        'organisation',
          p.organisation,

        'location',
          coalesce(
            p.location,
            ''
          ),

        'about',
          coalesce(
            p.about,
            ''
          ),

        'disciplines',
          coalesce(
            to_jsonb(
              p.disciplines
            ),
            '[]'::jsonb
          ),

        'sectors',
          coalesce(
            to_jsonb(
              p.sectors
            ),
            '[]'::jsonb
          ),

        'skills',
          coalesce(
            to_jsonb(
              p.skills
            ),
            '[]'::jsonb
          ),

        'languages',
          coalesce(
            to_jsonb(
              p.languages
            ),
            '[]'::jsonb
          ),

        'countries',
          coalesce(
            to_jsonb(
              p.countries
            ),
            '[]'::jsonb
          ),

        'yearsExperience',
          p.years_experience,

        'website',
          p.website,

        'portfolioUrl',
          p.portfolio_url,

        'linkedinUrl',
          p.linkedin_url,

        'updatedAt',
          p.updated_at,

        'completeness',
          (
            (
              case
                when nullif(
                  trim(
                    coalesce(
                      p.full_name,
                      ''
                    )
                  ),
                  ''
                ) is not null
                then 1
                else 0
              end
              +
              case
                when nullif(
                  trim(
                    coalesce(
                      p.headline,
                      ''
                    )
                  ),
                  ''
                ) is not null
                then 1
                else 0
              end
              +
              case
                when nullif(
                  trim(
                    coalesce(
                      p.location,
                      ''
                    )
                  ),
                  ''
                ) is not null
                then 1
                else 0
              end
              +
              case
                when nullif(
                  trim(
                    coalesce(
                      p.about,
                      ''
                    )
                  ),
                  ''
                ) is not null
                then 1
                else 0
              end
              +
              case
                when coalesce(
                  cardinality(
                    p.disciplines
                  ),
                  0
                ) > 0
                then 1
                else 0
              end
            ) * 20
          )
      ),

      -- ========================================================
      -- MEMBERSHIP / ENTITLEMENT
      -- ========================================================

      'membership',
      jsonb_build_object(
        'plan',
          case
            when upper(
              coalesce(
                u.raw_app_meta_data ->> 'membership',
                ''
              )
            ) = 'PRO'
            then 'PRO'
            else 'FREE'
          end,

        'membershipId',
          nullif(
            trim(
              coalesce(
                u.raw_app_meta_data ->> 'membership_id',
                ''
              )
            ),
            ''
          ),

        'expiresAt',
          nullif(
            trim(
              coalesce(
                u.raw_app_meta_data ->> 'membership_expires_at',
                ''
              )
            ),
            ''
          ),

        'arknozPoints',
          case
            when (
              u.raw_app_meta_data ->> 'arknoz_points'
            ) ~ '^-?[0-9]+(?:\.[0-9]+)?$'
            then (
              u.raw_app_meta_data ->> 'arknoz_points'
            )::numeric
            else 0::numeric
          end
      ),

      -- ========================================================
      -- LINKED PUBLIC PERSON ENTITY
      -- ========================================================

      'publicProfile',
      jsonb_build_object(
        'linked',
          p.person_entity_id is not null,

        'entityId',
          e.id,

        'slug',
          case
            when e.entity_type = 'person'
            then e.slug
            else null
          end,

        'canonicalPath',
          case
            when e.entity_type = 'person'
            then e.canonical_path
            else null
          end,

        'contentStatus',
          case
            when e.entity_type = 'person'
            then e.content_status
            else null
          end,

        'verificationStatus',
          case
            when e.entity_type = 'person'
            then e.verification_status
            else null
          end,

        'lastVerifiedAt',
          case
            when e.entity_type = 'person'
            then e.last_verified_at
            else null
          end,

        'publishedAt',
          case
            when e.entity_type = 'person'
            then e.published_at
            else null
          end
      ),

      -- ========================================================
      -- COUNTS
      -- ========================================================

      'counts',
      jsonb_build_object(
        'saved',
          (
            select count(*)
            from public.member_actions as a
            where a.user_id =
              target_user_id
              and a.action_type =
                'save'
          ),

        'following',
          (
            select count(*)
            from public.member_actions as a
            where a.user_id =
              target_user_id
              and a.action_type =
                'follow'
          ),

        'experiences',
          (
            select count(*)
            from public.member_experiences as x
            where x.user_id =
              target_user_id
          ),

        'credentials',
          (
            select count(*)
            from public.member_credentials as c
            where c.user_id =
              target_user_id
          ),

        'services',
          (
            select count(*)
            from public.member_services as s
            where s.user_id =
              target_user_id
          ),

        'publishedServices',
          (
            select count(*)
            from public.member_services as s
            where s.user_id =
              target_user_id
              and s.status =
                'published'
          ),

        'connections',
          (
            select count(*)
            from public.member_connection_requests as r
            where r.request_type =
              'connect'
              and r.status =
                'accepted'
              and (
                r.requester_user_id =
                  target_user_id
                or r.recipient_user_id =
                  target_user_id
              )
          ),

        'pendingIncomingConnections',
          (
            select count(*)
            from public.member_connection_requests as r
            where r.request_type =
              'connect'
              and r.status =
                'pending'
              and r.recipient_user_id =
                target_user_id
          ),

        'pendingOutgoingConnections',
          (
            select count(*)
            from public.member_connection_requests as r
            where r.request_type =
              'connect'
              and r.status =
                'pending'
              and r.requester_user_id =
                target_user_id
          ),

        'pendingCollaborationRequests',
          (
            select count(*)
            from public.member_connection_requests as r
            where r.request_type =
              'collaborate'
              and r.status =
                'pending'
              and (
                r.requester_user_id =
                  target_user_id
                or r.recipient_user_id =
                  target_user_id
              )
          ),

        'pendingServiceRequests',
          (
            select count(*)
            from public.member_connection_requests as r
            where r.request_type =
              'service'
              and r.status =
                'pending'
              and (
                r.requester_user_id =
                  target_user_id
                or r.recipient_user_id =
                  target_user_id
              )
          )
      ),

      -- ========================================================
      -- EXPERIENCE
      -- ========================================================

      'experiences',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id',
                x.id,

              'type',
                x.experience_type,

              'role',
                x.role_title,

              'organisation',
                x.organisation,

              'location',
                x.location,

              'startDate',
                x.start_date,

              'endDate',
                x.end_date,

              'current',
                x.is_current,

              'verification',
                x.verification_state,

              'createdAt',
                x.created_at,

              'updatedAt',
                x.updated_at
            )
            order by
              x.is_current desc,
              x.start_date desc nulls last,
              x.created_at desc
          )
          from public.member_experiences as x
          where x.user_id =
            target_user_id
        ),
        '[]'::jsonb
      ),

      -- ========================================================
      -- CREDENTIALS
      -- ========================================================

      'credentials',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id',
                c.id,

              'type',
                c.credential_type,

              'title',
                c.title,

              'issuer',
                c.issuer,

              'credentialId',
                c.credential_id,

              'issueDate',
                c.issue_date,

              'expiryDate',
                c.expiry_date,

              'url',
                c.credential_url,

              'verification',
                c.verification_state,

              'createdAt',
                c.created_at,

              'updatedAt',
                c.updated_at
            )
            order by
              c.issue_date desc nulls last,
              c.created_at desc
          )
          from public.member_credentials as c
          where c.user_id =
            target_user_id
        ),
        '[]'::jsonb
      ),

      -- ========================================================
      -- SERVICES
      -- ========================================================

      'services',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id',
                s.id,

              'type',
                s.service_type,

              'title',
                s.title,

              'summary',
                s.summary,

              'availability',
                s.availability,

              'status',
                s.status,

              'createdAt',
                s.created_at,

              'updatedAt',
                s.updated_at
            )
            order by
              s.updated_at desc,
              s.created_at desc
          )
          from public.member_services as s
          where s.user_id =
            target_user_id
        ),
        '[]'::jsonb
      ),

      -- ========================================================
      -- RECENT MEMBER ACTIONS
      -- ========================================================

      'recentActions',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'type',
                recent.action_type,

              'targetPath',
                recent.target_path,

              'createdAt',
                recent.created_at
            )
            order by
              recent.created_at desc
          )
          from (
            select
              a.action_type,
              a.target_path,
              a.created_at
            from public.member_actions as a
            where a.user_id =
              target_user_id
            order by
              a.created_at desc
            limit 100
          ) as recent
        ),
        '[]'::jsonb
      ),

      -- ========================================================
      -- RECENT CONNECTION / COLLABORATION REQUESTS
      -- ========================================================

      'recentRequests',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id',
                recent.id,

              'direction',
                case
                  when recent.requester_user_id =
                    target_user_id
                  then 'outgoing'
                  else 'incoming'
                end,

              'counterpartyUserId',
                case
                  when recent.requester_user_id =
                    target_user_id
                  then recent.recipient_user_id
                  else recent.requester_user_id
                end,

              'requestType',
                recent.request_type,

              'contextPath',
                recent.context_path,

              'status',
                recent.status,

              'createdAt',
                recent.created_at,

              'updatedAt',
                recent.updated_at,

              'respondedAt',
                recent.responded_at
            )
            order by
              recent.created_at desc
          )
          from (
            select
              r.id,
              r.requester_user_id,
              r.recipient_user_id,
              r.request_type,
              r.context_path,
              r.status,
              r.created_at,
              r.updated_at,
              r.responded_at
            from public.member_connection_requests as r
            where
              r.requester_user_id =
                target_user_id
              or r.recipient_user_id =
                target_user_id
            order by
              r.created_at desc
            limit 100
          ) as recent
        ),
        '[]'::jsonb
      )
    )
  into result

  from auth.users as u

  left join public.member_profiles as p
    on p.user_id = u.id

  left join public.entities as e
    on e.id = p.person_entity_id
    and e.entity_type = 'person'

  where u.id =
    target_user_id;

  if result is null then
    raise exception
      'Member does not exist';
  end if;

  return result;
end;
$$;

revoke all
on function public.get_platform_member_detail(
  uuid
)
from public;

grant execute
on function public.get_platform_member_detail(
  uuid
)
to authenticated;

commit;
