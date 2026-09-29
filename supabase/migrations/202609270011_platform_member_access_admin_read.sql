-- Arknoz Platform Admin Member Access read model
--
-- Protected administrative view of one member's current
-- access state and access-control audit history.

begin;

create or replace function public.get_platform_member_access_admin(
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
      'Target member is required';
  end if;

  if not exists (
    select 1
    from auth.users as u
    where u.id = target_user_id
  ) then
    raise exception
      'Target member does not exist';
  end if;

  select
    jsonb_build_object(
      'status',
        coalesce(
          access.status,
          'active'
        ),

      'reason',
        access.reason,

      'changedAt',
        access.changed_at,

      'changedByUserId',
        access.changed_by,

      'changedByArknozId',
        changed_by_profile.arknoz_id,

      'recentAudit',
        coalesce(
          (
            select jsonb_agg(
              jsonb_build_object(
                'id',
                  history.id,

                'actorUserId',
                  history.actor_user_id,

                'actorArknozId',
                  history.actor_arknoz_id,

                'oldStatus',
                  history.old_status,

                'newStatus',
                  history.new_status,

                'oldReason',
                  history.old_reason,

                'newReason',
                  history.new_reason,

                'createdAt',
                  history.created_at
              )
              order by
                history.created_at desc
            )
            from (
              select
                log.id,
                log.actor_user_id,
                actor_profile.arknoz_id
                  as actor_arknoz_id,
                log.old_status,
                log.new_status,
                log.old_reason,
                log.new_reason,
                log.created_at

              from public.platform_member_access_audit_log
                as log

              left join public.member_profiles
                as actor_profile
                on actor_profile.user_id =
                  log.actor_user_id

              where log.target_user_id =
                target_user_id

              order by
                log.created_at desc

              limit 50
            ) as history
          ),
          '[]'::jsonb
        )
    )
  into result

  from (
    select
      target_user_id as user_id
  ) as target

  left join public.platform_member_access
    as access
    on access.user_id =
      target.user_id

  left join public.member_profiles
    as changed_by_profile
    on changed_by_profile.user_id =
      access.changed_by;

  return result;
end;
$$;

revoke all
on function public.get_platform_member_access_admin(
  uuid
)
from public;

grant execute
on function public.get_platform_member_access_admin(
  uuid
)
to authenticated;

commit;
