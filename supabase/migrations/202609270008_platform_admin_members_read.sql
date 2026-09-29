-- Arknoz Platform Admin Members read model
--
-- Reuses canonical Arknoz identity:
-- auth.users                       = authentication account
-- member_profiles                  = Arknoz member profile + Arknoz ID
-- linked published Person entity   = public profile
-- auth raw_app_meta_data.membership = FREE / PRO entitlement
--
-- No duplicate member/account/verification state is introduced.

begin;

-- ============================================================
-- 1. MEMBERS SUMMARY
-- ============================================================

create or replace function public.get_platform_member_summary()
returns table (
  total_members bigint,
  pro_members bigint,
  public_profiles bigint,
  verified_public_profiles bigint,
  new_members_7d bigint,
  new_members_30d bigint,
  active_members_30d bigint
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
begin
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

  return query
  select
    count(*)::bigint,

    count(*) filter (
      where upper(
        coalesce(
          u.raw_app_meta_data ->> 'membership',
          ''
        )
      ) = 'PRO'
    )::bigint,

    count(*) filter (
      where
        e.entity_type = 'person'
        and e.content_status = 'published'
    )::bigint,

    count(*) filter (
      where
        e.entity_type = 'person'
        and e.content_status = 'published'
        and e.verification_status = 'verified'
    )::bigint,

    count(*) filter (
      where
        u.created_at >=
          now() - interval '7 days'
    )::bigint,

    count(*) filter (
      where
        u.created_at >=
          now() - interval '30 days'
    )::bigint,

    count(*) filter (
      where
        u.last_sign_in_at >=
          now() - interval '30 days'
    )::bigint

  from auth.users as u

  left join public.member_profiles as p
    on p.user_id = u.id

  left join public.entities as e
    on e.id = p.person_entity_id
    and e.entity_type = 'person';
end;
$$;

revoke all
on function public.get_platform_member_summary()
from public;

grant execute
on function public.get_platform_member_summary()
to authenticated;


-- ============================================================
-- 2. MEMBER DIRECTORY
-- ============================================================

create or replace function public.get_platform_members(
  filter_membership text default null,
  filter_public_status text default null,
  filter_verification_status text default null,
  search_text text default null,
  result_limit integer default 100,
  result_offset integer default 0
)
returns table (
  user_id uuid,
  arknoz_id text,
  email text,

  full_name text,
  stage text,
  headline text,
  organisation text,
  location text,

  membership text,
  membership_id text,
  membership_expires_at text,
  arknoz_points numeric,

  email_verified boolean,

  public_profile_status text,
  person_slug text,
  person_path text,
  verification_status text,

  profile_completeness integer,

  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  safe_limit integer :=
    greatest(
      1,
      least(
        coalesce(result_limit, 100),
        500
      )
    );

  safe_offset integer :=
    greatest(
      coalesce(result_offset, 0),
      0
    );

  normalized_membership text :=
    nullif(
      upper(trim(filter_membership)),
      ''
    );

  normalized_public_status text :=
    nullif(
      lower(trim(filter_public_status)),
      ''
    );

  normalized_verification text :=
    nullif(
      lower(trim(filter_verification_status)),
      ''
    );

  normalized_search text :=
    nullif(
      lower(trim(search_text)),
      ''
    );
begin
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

  return query
  with member_directory as (
    select
      u.id as member_user_id,

      p.arknoz_id,

      u.email::text as member_email,

      coalesce(
        p.full_name,
        ''
      ) as member_full_name,

      coalesce(
        p.stage,
        'professional'
      ) as member_stage,

      coalesce(
        p.headline,
        ''
      ) as member_headline,

      p.organisation as member_organisation,

      coalesce(
        p.location,
        ''
      ) as member_location,

      case
        when upper(
          coalesce(
            u.raw_app_meta_data ->> 'membership',
            ''
          )
        ) = 'PRO'
        then 'PRO'
        else 'FREE'
      end as member_membership,

      nullif(
        trim(
          coalesce(
            u.raw_app_meta_data ->> 'membership_id',
            ''
          )
        ),
        ''
      ) as member_membership_id,

      nullif(
        trim(
          coalesce(
            u.raw_app_meta_data ->> 'membership_expires_at',
            ''
          )
        ),
        ''
      ) as member_membership_expires_at,

      case
        when (
          u.raw_app_meta_data ->> 'arknoz_points'
        ) ~ '^-?[0-9]+(?:\.[0-9]+)?$'
        then (
          u.raw_app_meta_data ->> 'arknoz_points'
        )::numeric
        else 0::numeric
      end as member_arknoz_points,

      (
        u.email_confirmed_at is not null
      ) as member_email_verified,

      case
        when p.person_entity_id is null
          then 'not_linked'

        when e.id is null
          then 'invalid_link'

        when e.content_status = 'published'
          then 'published'

        else e.content_status
      end as member_public_profile_status,

      case
        when e.entity_type = 'person'
          then e.slug
        else null
      end as member_person_slug,

      case
        when e.entity_type = 'person'
          then e.canonical_path
        else null
      end as member_person_path,

      case
        when e.entity_type = 'person'
          then e.verification_status
        else null
      end as member_verification_status,

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
      )::integer as member_profile_completeness,

      u.created_at as member_created_at,
      u.last_sign_in_at as member_last_sign_in_at

    from auth.users as u

    left join public.member_profiles as p
      on p.user_id = u.id

    left join public.entities as e
      on e.id = p.person_entity_id
  )

  select
    directory.member_user_id,
    directory.arknoz_id,
    directory.member_email,

    directory.member_full_name,
    directory.member_stage,
    directory.member_headline,
    directory.member_organisation,
    directory.member_location,

    directory.member_membership,
    directory.member_membership_id,
    directory.member_membership_expires_at,
    directory.member_arknoz_points,

    directory.member_email_verified,

    directory.member_public_profile_status,
    directory.member_person_slug,
    directory.member_person_path,
    directory.member_verification_status,

    directory.member_profile_completeness,

    directory.member_created_at,
    directory.member_last_sign_in_at

  from member_directory as directory

  where
    (
      normalized_membership is null
      or directory.member_membership =
        normalized_membership
    )

    and (
      normalized_public_status is null
      or directory.member_public_profile_status =
        normalized_public_status
    )

    and (
      normalized_verification is null
      or coalesce(
        directory.member_verification_status,
        'none'
      ) = normalized_verification
    )

    and (
      normalized_search is null

      or lower(
        coalesce(
          directory.arknoz_id,
          ''
        )
      )
        like '%' || normalized_search || '%'

      or lower(
        coalesce(
          directory.member_email,
          ''
        )
      )
        like '%' || normalized_search || '%'

      or lower(
        directory.member_full_name
      )
        like '%' || normalized_search || '%'

      or lower(
        coalesce(
          directory.member_person_slug,
          ''
        )
      )
        like '%' || normalized_search || '%'
    )

  order by
    directory.member_created_at desc,
    directory.member_user_id desc

  limit safe_limit
  offset safe_offset;
end;
$$;

revoke all
on function public.get_platform_members(
  text,
  text,
  text,
  text,
  integer,
  integer
)
from public;

grant execute
on function public.get_platform_members(
  text,
  text,
  text,
  text,
  integer,
  integer
)
to authenticated;

commit;
