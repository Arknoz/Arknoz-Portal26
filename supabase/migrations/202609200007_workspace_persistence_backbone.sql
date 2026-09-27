-- ============================================================
-- ARKNOZ WORKSPACE PERSISTENCE BACKBONE
-- Candidate only until explicitly approved for live apply.
--
-- Supports:
--   Company
--   University
--   Institution
--   Team
--   Leadership portfolios
--
-- Does NOT modify the existing canonical entity publication
-- system or existing member tables.
-- ============================================================

begin;


-- ============================================================
-- 1. ORGANISATION WORKSPACES
-- ============================================================

create table if not exists public.organisation_workspaces (
  id uuid primary key default gen_random_uuid(),

  workspace_type text not null
    check (
      workspace_type in (
        'company',
        'university',
        'institution'
      )
    ),

  plan text not null default 'FREE'
    check (
      plan in (
        'FREE',
        'ONE'
      )
    ),

  display_name text not null default '',

  canonical_entity_id uuid
    unique
    references public.entities(id)
    on delete set null,

  lifecycle_status text not null default 'active'
    check (
      lifecycle_status in (
        'active',
        'suspended',
        'archived'
      )
    ),

  created_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists
  organisation_workspaces_type_idx
on public.organisation_workspaces (
  workspace_type
);


create index if not exists
  organisation_workspaces_entity_idx
on public.organisation_workspaces (
  canonical_entity_id
);


-- ============================================================
-- 2. WORKSPACE MEMBERS
-- ============================================================

create table if not exists public.organisation_workspace_members (
  workspace_id uuid not null
    references public.organisation_workspaces(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  workspace_role text not null default 'member'
    check (
      workspace_role in (
        'owner',
        'manager',
        'editor',
        'member'
      )
    ),

  member_status text not null default 'active'
    check (
      member_status in (
        'active',
        'invited',
        'suspended'
      )
    ),

  added_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  primary key (
    workspace_id,
    user_id
  )
);


create unique index if not exists
  organisation_workspace_one_active_owner_idx
on public.organisation_workspace_members (
  workspace_id
)
where
  workspace_role = 'owner'
  and member_status = 'active';


create index if not exists
  organisation_workspace_members_user_idx
on public.organisation_workspace_members (
  user_id
);


-- ============================================================
-- 3. PRIVATE MODULE RECORDS
--
-- The 36 Company / University / Institution service modules
-- can persist their own schema inside payload JSONB while
-- keeping one controlled storage model.
--
-- Publication is NOT automatic.
-- canonical_entity_id + approved status remain server-controlled.
-- ============================================================

create table if not exists public.organisation_workspace_records (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.organisation_workspaces(id)
    on delete cascade,

  module_key text not null,

  record_kind text not null default 'item',

  title text not null default '',

  payload jsonb not null default '{}'::jsonb,

  record_status text not null default 'draft'
    check (
      record_status in (
        'draft',
        'submitted',
        'needs_changes',
        'approved',
        'archived'
      )
    ),

  canonical_entity_id uuid
    references public.entities(id)
    on delete set null,

  created_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists
  organisation_workspace_records_workspace_idx
on public.organisation_workspace_records (
  workspace_id
);


create index if not exists
  organisation_workspace_records_module_idx
on public.organisation_workspace_records (
  workspace_id,
  module_key
);


create index if not exists
  organisation_workspace_records_status_idx
on public.organisation_workspace_records (
  record_status
);


-- ============================================================
-- 4. TRUSTED TEAM ASSIGNMENTS
--
-- Users cannot grant themselves Team access.
-- No authenticated INSERT / UPDATE / DELETE policies are added.
--
-- One Arknoz ID -> one active Team assignment model.
-- Leadership additionally requires one portfolio.
-- ============================================================

create table if not exists public.team_assignments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null unique
    references auth.users(id)
    on delete cascade,

  team_role text not null
    check (
      team_role in (
        'adviser',
        'editor',
        'knowledge_contributor',
        'regional_partner',
        'operations',
        'leadership'
      )
    ),

  leadership_portfolio text
    check (
      leadership_portfolio is null
      or leadership_portfolio in (
        'knowledge_intelligence',
        'education_institutions',
        'community_network',
        'growth_partnerships',
        'product_platform',
        'operations_trust'
      )
    ),

  scope_label text not null default '',
  scope_value text not null default '',

  access_grant text not null default 'FULL_PRO_ONE',

  is_active boolean not null default true,

  assigned_by_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint team_assignment_leadership_portfolio_check
    check (
      (
        team_role = 'leadership'
        and leadership_portfolio is not null
      )
      or
      (
        team_role <> 'leadership'
        and leadership_portfolio is null
      )
    )
);


create index if not exists
  team_assignments_role_idx
on public.team_assignments (
  team_role
);


create index if not exists
  team_assignments_active_idx
on public.team_assignments (
  is_active
);


-- ============================================================
-- 5. TEAM ROLE-SPECIFIC PANEL RECORDS
--
-- Common member services continue using the existing member
-- tables. This table supports the specialist six panels in
-- Team / Leadership dashboards.
-- ============================================================

create table if not exists public.team_panel_records (
  id uuid primary key default gen_random_uuid(),

  assignment_id uuid not null
    references public.team_assignments(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  panel_key text not null,

  title text not null default '',

  payload jsonb not null default '{}'::jsonb,

  record_status text not null default 'active'
    check (
      record_status in (
        'draft',
        'active',
        'in_review',
        'completed',
        'archived'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists
  team_panel_records_assignment_idx
on public.team_panel_records (
  assignment_id
);


create index if not exists
  team_panel_records_user_idx
on public.team_panel_records (
  user_id
);


create index if not exists
  team_panel_records_panel_idx
on public.team_panel_records (
  assignment_id,
  panel_key
);


-- ============================================================
-- 6. TRUSTED MEMBERSHIP HELPERS
-- ============================================================

create or replace function
  public.is_organisation_workspace_member(
    p_workspace_id uuid
  )
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.organisation_workspace_members m
    where
      m.workspace_id = p_workspace_id
      and m.user_id = auth.uid()
      and m.member_status = 'active'
  );
$$;


create or replace function
  public.can_manage_organisation_workspace(
    p_workspace_id uuid
  )
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.organisation_workspace_members m
    where
      m.workspace_id = p_workspace_id
      and m.user_id = auth.uid()
      and m.member_status = 'active'
      and m.workspace_role in (
        'owner',
        'manager'
      )
  );
$$;


revoke all
on function
  public.is_organisation_workspace_member(uuid)
from public;


revoke all
on function
  public.can_manage_organisation_workspace(uuid)
from public;


grant execute
on function
  public.is_organisation_workspace_member(uuid)
to authenticated;


grant execute
on function
  public.can_manage_organisation_workspace(uuid)
to authenticated;


-- ============================================================
-- 7. RLS
-- ============================================================

alter table public.organisation_workspaces
  enable row level security;

alter table public.organisation_workspace_members
  enable row level security;

alter table public.organisation_workspace_records
  enable row level security;

alter table public.team_assignments
  enable row level security;

alter table public.team_panel_records
  enable row level security;


-- ------------------------------------------------------------
-- Organisation workspace shell
-- Members may read.
-- Creation / plan / canonical link / lifecycle remain trusted.
-- ------------------------------------------------------------

drop policy if exists
  "Workspace members can read workspace"
on public.organisation_workspaces;


create policy
  "Workspace members can read workspace"
on public.organisation_workspaces
for select
to authenticated
using (
  public.is_organisation_workspace_member(id)
);


-- ------------------------------------------------------------
-- Workspace memberships
-- Member sees own membership.
-- Owner / manager sees workspace membership.
-- No client-side membership mutation.
-- ------------------------------------------------------------

drop policy if exists
  "Members can read workspace memberships"
on public.organisation_workspace_members;


create policy
  "Members can read workspace memberships"
on public.organisation_workspace_members
for select
to authenticated
using (
  user_id = auth.uid()
  or
  public.can_manage_organisation_workspace(
    workspace_id
  )
);


-- ------------------------------------------------------------
-- Workspace module records
-- Active members collaborate privately.
-- Client cannot manufacture canonical publication.
-- ------------------------------------------------------------

drop policy if exists
  "Workspace members can read records"
on public.organisation_workspace_records;


create policy
  "Workspace members can read records"
on public.organisation_workspace_records
for select
to authenticated
using (
  public.is_organisation_workspace_member(
    workspace_id
  )
);


drop policy if exists
  "Workspace members can create private records"
on public.organisation_workspace_records;


create policy
  "Workspace members can create private records"
on public.organisation_workspace_records
for insert
to authenticated
with check (
  public.is_organisation_workspace_member(
    workspace_id
  )
  and created_by_user_id = auth.uid()
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
  "Workspace members can update private records"
on public.organisation_workspace_records
for update
to authenticated
using (
  public.is_organisation_workspace_member(
    workspace_id
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
  public.is_organisation_workspace_member(
    workspace_id
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
  "Workspace members can delete private drafts"
on public.organisation_workspace_records
for delete
to authenticated
using (
  public.is_organisation_workspace_member(
    workspace_id
  )
  and canonical_entity_id is null
  and record_status in (
    'draft',
    'archived'
  )
);


-- ------------------------------------------------------------
-- Team assignment
-- User can only read their trusted assignment.
-- No self-assignment mutation policies.
-- ------------------------------------------------------------

drop policy if exists
  "Team members can read own assignment"
on public.team_assignments;


create policy
  "Team members can read own assignment"
on public.team_assignments
for select
to authenticated
using (
  user_id = auth.uid()
);


-- ------------------------------------------------------------
-- Team specialist panel records
-- ------------------------------------------------------------

drop policy if exists
  "Team members can read own panel records"
on public.team_panel_records;


create policy
  "Team members can read own panel records"
on public.team_panel_records
for select
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.team_assignments a
    where
      a.id = assignment_id
      and a.user_id = auth.uid()
      and a.is_active = true
  )
);


drop policy if exists
  "Team members can create own panel records"
on public.team_panel_records;


create policy
  "Team members can create own panel records"
on public.team_panel_records
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.team_assignments a
    where
      a.id = assignment_id
      and a.user_id = auth.uid()
      and a.is_active = true
  )
);


drop policy if exists
  "Team members can update own panel records"
on public.team_panel_records;


create policy
  "Team members can update own panel records"
on public.team_panel_records
for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.team_assignments a
    where
      a.id = assignment_id
      and a.user_id = auth.uid()
      and a.is_active = true
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.team_assignments a
    where
      a.id = assignment_id
      and a.user_id = auth.uid()
      and a.is_active = true
  )
);


drop policy if exists
  "Team members can delete own panel drafts"
on public.team_panel_records;


create policy
  "Team members can delete own panel drafts"
on public.team_panel_records
for delete
to authenticated
using (
  user_id = auth.uid()
  and record_status in (
    'draft',
    'archived'
  )
  and exists (
    select 1
    from public.team_assignments a
    where
      a.id = assignment_id
      and a.user_id = auth.uid()
      and a.is_active = true
  )
);


-- ============================================================
-- 8. PRIVILEGES
-- ============================================================

revoke all
on public.organisation_workspaces
from anon;

revoke all
on public.organisation_workspace_members
from anon;

revoke all
on public.organisation_workspace_records
from anon;

revoke all
on public.team_assignments
from anon;

revoke all
on public.team_panel_records
from anon;


grant select
on public.organisation_workspaces
to authenticated;


grant select
on public.organisation_workspace_members
to authenticated;


grant
  select,
  insert,
  update,
  delete
on public.organisation_workspace_records
to authenticated;


grant select
on public.team_assignments
to authenticated;


grant
  select,
  insert,
  update,
  delete
on public.team_panel_records
to authenticated;


-- ============================================================
-- 9. UPDATED-AT TRIGGERS
-- Reuses Arknoz existing public.set_updated_at()
-- ============================================================

drop trigger if exists
  organisation_workspaces_set_updated_at
on public.organisation_workspaces;


create trigger
  organisation_workspaces_set_updated_at
before update
on public.organisation_workspaces
for each row
execute function public.set_updated_at();


drop trigger if exists
  organisation_workspace_records_set_updated_at
on public.organisation_workspace_records;


create trigger
  organisation_workspace_records_set_updated_at
before update
on public.organisation_workspace_records
for each row
execute function public.set_updated_at();


drop trigger if exists
  team_assignments_set_updated_at
on public.team_assignments;


create trigger
  team_assignments_set_updated_at
before update
on public.team_assignments
for each row
execute function public.set_updated_at();


drop trigger if exists
  team_panel_records_set_updated_at
on public.team_panel_records;


create trigger
  team_panel_records_set_updated_at
before update
on public.team_panel_records
for each row
execute function public.set_updated_at();


commit;