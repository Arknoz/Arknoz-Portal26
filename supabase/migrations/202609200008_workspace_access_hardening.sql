-- ============================================================
-- ARKNOZ WORKSPACE ACCESS HARDENING
--
-- Candidate only. Do not apply without explicit approval.
--
-- Purpose:
-- 1. FREE vs ONE module access is enforced by database policy.
-- 2. Team members may write only panels belonging to their
--    trusted Team role / Leadership portfolio.
-- 3. UI/query parameters are never the security boundary.
-- ============================================================

begin;


-- ============================================================
-- 1. ORGANISATION MODULE AUTHORIZATION
-- ============================================================

create or replace function
  public.can_use_organisation_module(
    p_workspace_id uuid,
    p_module_key text
  )
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1

    from public.organisation_workspaces w

    join public.organisation_workspace_members m
      on m.workspace_id = w.id

    where
      w.id = p_workspace_id

      and w.lifecycle_status = 'active'

      and m.user_id = auth.uid()

      and m.member_status = 'active'

      and
      (
        (
          w.workspace_type = 'company'

          and p_module_key in (
            'company-profile',
            'people',
            'products-services',
            'projects',
            'knowledge',
            'opportunities',
            'contributions',
            'portfolio-workspace',
            'collaboration',
            'market-intelligence',
            'analytics-benchmarks',
            'team-permissions'
          )

          and
          (
            w.plan = 'ONE'

            or p_module_key in (
              'company-profile',
              'people',
              'products-services',
              'projects',
              'knowledge',
              'opportunities'
            )
          )
        )

        or

        (
          w.workspace_type = 'university'

          and p_module_key in (
            'university-profile',
            'people',
            'programmes',
            'research',
            'projects',
            'opportunities',
            'contributions',
            'publications-evidence',
            'industry-collaboration',
            'research-analytics',
            'impact-benchmarking',
            'team-permissions'
          )

          and
          (
            w.plan = 'ONE'

            or p_module_key in (
              'university-profile',
              'people',
              'programmes',
              'research',
              'projects',
              'opportunities'
            )
          )
        )

        or

        (
          w.workspace_type = 'institution'

          and p_module_key in (
            'institution-profile',
            'people',
            'knowledge-standards',
            'programmes',
            'projects',
            'opportunities',
            'contributions',
            'collaboration-network',
            'impact-evidence',
            'institutional-analytics',
            'geographic-intelligence',
            'team-permissions'
          )

          and
          (
            w.plan = 'ONE'

            or p_module_key in (
              'institution-profile',
              'people',
              'knowledge-standards',
              'programmes',
              'projects',
              'opportunities'
            )
          )
        )
      )
  );
$$;


revoke all
on function
  public.can_use_organisation_module(uuid, text)
from public;


grant execute
on function
  public.can_use_organisation_module(uuid, text)
to authenticated;


-- ============================================================
-- 2. TEAM PANEL AUTHORIZATION
--
-- Common six member services are deliberately NOT listed here:
-- Profile
-- Contributions
-- Activity
-- Messages
-- Saved
-- Opportunities
--
-- They continue through the existing member systems.
-- ============================================================

create or replace function
  public.can_use_team_panel(
    p_assignment_id uuid,
    p_panel_key text
  )
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1

    from public.team_assignments a

    where
      a.id = p_assignment_id

      and a.user_id = auth.uid()

      and a.is_active = true

      and
      (
        (
          a.team_role = 'adviser'
          and p_panel_key in (
            'strategic-briefing',
            'review-requests',
            'intelligence-and-reports',
            'adviser-notes',
            'recommendations',
            'decision-history'
          )
        )

        or

        (
          a.team_role = 'editor'
          and p_panel_key in (
            'editorial-inbox',
            'under-review',
            'sources-and-evidence',
            'editorial-decisions',
            'return-to-admin',
            'published-history'
          )
        )

        or

        (
          a.team_role = 'knowledge_contributor'
          and p_panel_key in (
            'create-contribution',
            'research-and-sources',
            'drafts',
            'review-feedback',
            'published-knowledge',
            'contribution-history'
          )
        )

        or

        (
          a.team_role = 'regional_partner'
          and p_panel_key in (
            'regional-overview',
            'knowledge-and-projects',
            'organisations-and-institutions',
            'opportunities-and-partnerships',
            'regional-growth',
            'contribution-and-business-pipeline'
          )
        )

        or

        (
          a.team_role = 'operations'
          and p_panel_key in (
            'operational-queue',
            'members-and-organisations',
            'contribution-processing',
            'verification-and-review',
            'data-quality',
            'issues-and-reports'
          )
        )

        or

        (
          a.team_role = 'leadership'

          and
          (
            (
              a.leadership_portfolio =
                'knowledge_intelligence'

              and p_panel_key in (
                'knowledge-coverage',
                'contribution-pipeline',
                'research-and-standards',
                'evidence-and-quality',
                'intelligence-reports',
                'knowledge-gaps-and-priorities'
              )
            )

            or

            (
              a.leadership_portfolio =
                'education_institutions'

              and p_panel_key in (
                'university-network',
                'programmes-and-learning',
                'research-institutions',
                'academic-partnerships',
                'education-opportunities',
                'education-growth-and-impact'
              )
            )

            or

            (
              a.leadership_portfolio =
                'community_network'

              and p_panel_key in (
                'member-network',
                'contributors-and-experts',
                'advisers-and-chapters',
                'regional-network',
                'collaboration',
                'community-growth-and-health'
              )
            )

            or

            (
              a.leadership_portfolio =
                'growth_partnerships'

              and p_panel_key in (
                'strategic-partnerships',
                'regional-expansion',
                'organisation-growth',
                'business-pipeline',
                'growth-opportunities',
                'growth-reports-and-priorities'
              )
            )

            or

            (
              a.leadership_portfolio =
                'product_platform'

              and p_panel_key in (
                'product-roadmap',
                'arknoz-pro-and-one',
                'search-data-and-intelligence',
                'experience-and-adoption',
                'product-issues',
                'release-priorities'
              )
            )

            or

            (
              a.leadership_portfolio =
                'operations_trust'

              and p_panel_key in (
                'operational-health',
                'verification-and-review',
                'data-quality-and-provenance',
                'security-and-access',
                'compliance-and-risk',
                'escalations-and-reports'
              )
            )
          )
        )
      )
  );
$$;


revoke all
on function
  public.can_use_team_panel(uuid, text)
from public;


grant execute
on function
  public.can_use_team_panel(uuid, text)
to authenticated;


-- ============================================================
-- 3. HARDEN ORGANISATION RECORD POLICIES
-- ============================================================

drop policy if exists
  "Workspace members can read records"
on public.organisation_workspace_records;


create policy
  "Workspace members can read authorised records"
on public.organisation_workspace_records
for select
to authenticated
using (
  public.can_use_organisation_module(
    workspace_id,
    module_key
  )
);


drop policy if exists
  "Workspace members can create private records"
on public.organisation_workspace_records;


create policy
  "Workspace members can create authorised private records"
on public.organisation_workspace_records
for insert
to authenticated
with check (
  public.can_use_organisation_module(
    workspace_id,
    module_key
  )

  and created_by_user_id =
    auth.uid()

  and canonical_entity_id is null

  and record_status in (
    'draft',
    'submitted'
  )
);


drop policy if exists
  "Workspace members can update private records"
on public.organisation_workspace_records;


create policy
  "Workspace members can update authorised private records"
on public.organisation_workspace_records
for update
to authenticated
using (
  public.can_use_organisation_module(
    workspace_id,
    module_key
  )

  and canonical_entity_id is null

  and record_status in (
    'draft',
    'submitted',
    'needs_changes',
    'archived'
  )
)
with check (
  public.can_use_organisation_module(
    workspace_id,
    module_key
  )

  and canonical_entity_id is null

  and record_status in (
    'draft',
    'submitted',
    'needs_changes',
    'archived'
  )
);


drop policy if exists
  "Workspace members can delete private drafts"
on public.organisation_workspace_records;


create policy
  "Workspace members can delete authorised private drafts"
on public.organisation_workspace_records
for delete
to authenticated
using (
  public.can_use_organisation_module(
    workspace_id,
    module_key
  )

  and canonical_entity_id is null

  and record_status in (
    'draft',
    'archived'
  )
);


-- ============================================================
-- 4. HARDEN TEAM PANEL POLICIES
-- ============================================================

drop policy if exists
  "Team members can read own panel records"
on public.team_panel_records;


create policy
  "Team members can read authorised panel records"
on public.team_panel_records
for select
to authenticated
using (
  user_id = auth.uid()

  and public.can_use_team_panel(
    assignment_id,
    panel_key
  )
);


drop policy if exists
  "Team members can create own panel records"
on public.team_panel_records;


create policy
  "Team members can create authorised panel records"
on public.team_panel_records
for insert
to authenticated
with check (
  user_id = auth.uid()

  and public.can_use_team_panel(
    assignment_id,
    panel_key
  )
);


drop policy if exists
  "Team members can update own panel records"
on public.team_panel_records;


create policy
  "Team members can update authorised panel records"
on public.team_panel_records
for update
to authenticated
using (
  user_id = auth.uid()

  and public.can_use_team_panel(
    assignment_id,
    panel_key
  )
)
with check (
  user_id = auth.uid()

  and public.can_use_team_panel(
    assignment_id,
    panel_key
  )
);


drop policy if exists
  "Team members can delete own panel drafts"
on public.team_panel_records;


create policy
  "Team members can delete authorised panel drafts"
on public.team_panel_records
for delete
to authenticated
using (
  user_id = auth.uid()

  and record_status in (
    'draft',
    'archived'
  )

  and public.can_use_team_panel(
    assignment_id,
    panel_key
  )
);



-- ============================================================
-- 5. CLIENT IDENTITY FIELD GUARDS
--
-- Authenticated users may edit content, but may not rewrite
-- workspace ownership/provenance or move Team records between
-- assignments/panels.
-- Service-role / trusted SQL operations remain available.
-- ============================================================

create or replace function
  public.protect_organisation_workspace_record_identity()
returns trigger
language plpgsql
set search_path = public, auth
as $$
begin
  if auth.role() = 'authenticated' then

    if new.workspace_id
         is distinct from old.workspace_id
       or new.module_key
         is distinct from old.module_key
       or new.record_kind
         is distinct from old.record_kind
       or new.created_by_user_id
         is distinct from old.created_by_user_id
       or new.canonical_entity_id
         is distinct from old.canonical_entity_id
    then
      raise exception
        'Workspace record identity fields are server controlled.';
    end if;

  end if;

  return new;
end;
$$;


drop trigger if exists
  organisation_workspace_records_identity_guard
on public.organisation_workspace_records;


create trigger
  organisation_workspace_records_identity_guard
before update
on public.organisation_workspace_records
for each row
execute function
  public.protect_organisation_workspace_record_identity();


create or replace function
  public.protect_team_panel_record_identity()
returns trigger
language plpgsql
set search_path = public, auth
as $$
begin
  if auth.role() = 'authenticated' then

    if new.assignment_id
         is distinct from old.assignment_id
       or new.user_id
         is distinct from old.user_id
       or new.panel_key
         is distinct from old.panel_key
    then
      raise exception
        'Team panel identity fields are server controlled.';
    end if;

  end if;

  return new;
end;
$$;


drop trigger if exists
  team_panel_records_identity_guard
on public.team_panel_records;


create trigger
  team_panel_records_identity_guard
before update
on public.team_panel_records
for each row
execute function
  public.protect_team_panel_record_identity();

commit;