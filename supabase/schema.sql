-- ============================================================
-- Baselyne Database Schema
-- Multi-org service business operations platform
-- ============================================================

-- Organizations
create table orgs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  slogan      text,
  logo_url    text,
  small_logo_url text,
  primary_color text default '#f97316',
  active      boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Users (extends Supabase auth.users)
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Memberships (user <-> org with role)
create table memberships (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  role        text not null check (role in ('owner', 'admin', 'member')) default 'member',
  joined_at   timestamptz default now(),
  unique (org_id, user_id)
);

-- Jobs (core entity)
create table jobs (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references orgs(id) on delete cascade,
  title           text not null,
  description     text,
  client_name     text not null,
  client_email    text,
  client_phone    text,
  address         text,
  status          text not null default 'new'
    check (status in ('new','contacted','quoted','scheduled','in_progress','completed','cancelled')),
  value           numeric(12,2) default 0,
  source          text default 'other'
    check (source in ('website','referral','google','facebook','yelp','door_knock','other')),
  assigned_to     uuid references profiles(id),
  scheduled_date  date,
  completed_date  date,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Leads
create table leads (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  name        text not null,
  email       text,
  phone       text,
  source      text default 'other'
    check (source in ('website','referral','google','facebook','yelp','door_knock','other')),
  status      text not null default 'new'
    check (status in ('new','contacted','qualified','converted','lost')),
  value       numeric(12,2),
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Org tab visibility settings
create table org_tabs (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  tab_key     text not null,
  visible     boolean not null default true,
  locked      boolean not null default false, -- true = only system admin can toggle
  sort_order  int default 0,
  unique (org_id, tab_key)
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table orgs         enable row level security;
alter table memberships  enable row level security;
alter table jobs         enable row level security;
alter table leads        enable row level security;
alter table org_tabs     enable row level security;

-- Helper function: check if current user is in org
create or replace function is_org_member(p_org_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from memberships
    where org_id = p_org_id
      and user_id = auth.uid()
  );
$$;

-- Orgs: members can read their own org
create policy "members_can_read_org" on orgs
  for select using (is_org_member(id));

-- Memberships: members can see other members in their org
create policy "members_can_read_memberships" on memberships
  for select using (is_org_member(org_id));

-- Jobs: org-scoped read/write
create policy "members_read_jobs" on jobs
  for select using (is_org_member(org_id));

create policy "members_insert_jobs" on jobs
  for insert with check (is_org_member(org_id));

create policy "members_update_jobs" on jobs
  for update using (is_org_member(org_id));

-- Leads: org-scoped read/write
create policy "members_read_leads" on leads
  for select using (is_org_member(org_id));

create policy "members_insert_leads" on leads
  for insert with check (is_org_member(org_id));

create policy "members_update_leads" on leads
  for update using (is_org_member(org_id));

-- Org tabs: org-scoped
create policy "members_read_org_tabs" on org_tabs
  for select using (is_org_member(org_id));

-- ============================================================
-- Indexes
-- ============================================================

create index idx_jobs_org_id          on jobs(org_id);
create index idx_jobs_status          on jobs(org_id, status);
create index idx_leads_org_id         on leads(org_id);
create index idx_memberships_user_id  on memberships(user_id);
create index idx_memberships_org_id   on memberships(org_id);

-- ============================================================
-- Auto-update timestamps
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger jobs_updated_at  before update on jobs  for each row execute function update_updated_at();
create trigger leads_updated_at before update on leads for each row execute function update_updated_at();
create trigger orgs_updated_at  before update on orgs  for each row execute function update_updated_at();
