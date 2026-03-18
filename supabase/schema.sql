-- ============================================================
-- Baselyne CRM V1 — Job-Based Service CRM
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

-- Customers
create table customers (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  name        text not null,
  phone       text,
  email       text,
  notes       text,
  created_at  timestamptz default now()
);

-- Jobs (core entity)
create table jobs (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references orgs(id) on delete cascade,
  customer_id     uuid not null references customers(id) on delete cascade,
  title           text not null,
  description     text,
  status          text not null default 'new'
    check (status in ('new','quoted','approved','in_progress','completed','invoiced')),
  quoted_amount   numeric(12,2) default 0,
  approved_amount numeric(12,2),
  address         text,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Job status history (audit trail)
create table job_status_history (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs(id) on delete cascade,
  status      text not null
    check (status in ('new','quoted','approved','in_progress','completed','invoiced')),
  changed_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table orgs         enable row level security;
alter table memberships  enable row level security;
alter table customers    enable row level security;
alter table jobs         enable row level security;
alter table job_status_history enable row level security;

-- Helper function: check if current user is in org
create or replace function is_org_member(p_org_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from memberships
    where org_id = p_org_id
      and user_id = auth.uid()
  );
$$;

-- Orgs
create policy "members_can_read_org" on orgs
  for select using (is_org_member(id));

-- Memberships
create policy "members_can_read_memberships" on memberships
  for select using (is_org_member(org_id));

-- Customers: org-scoped
create policy "members_read_customers" on customers
  for select using (is_org_member(org_id));

create policy "members_insert_customers" on customers
  for insert with check (is_org_member(org_id));

create policy "members_update_customers" on customers
  for update using (is_org_member(org_id));

-- Jobs: org-scoped
create policy "members_read_jobs" on jobs
  for select using (is_org_member(org_id));

create policy "members_insert_jobs" on jobs
  for insert with check (is_org_member(org_id));

create policy "members_update_jobs" on jobs
  for update using (is_org_member(org_id));

-- Job status history: via job's org
create policy "members_read_status_history" on job_status_history
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_id and is_org_member(j.org_id)
    )
  );

create policy "members_insert_status_history" on job_status_history
  for insert with check (
    exists (
      select 1 from jobs j
      where j.id = job_id and is_org_member(j.org_id)
    )
  );

-- ============================================================
-- Indexes
-- ============================================================

create index idx_customers_org_id      on customers(org_id);
create index idx_jobs_org_id           on jobs(org_id);
create index idx_jobs_customer_id      on jobs(customer_id);
create index idx_jobs_status           on jobs(org_id, status);
create index idx_status_history_job_id on job_status_history(job_id);
create index idx_memberships_user_id   on memberships(user_id);
create index idx_memberships_org_id    on memberships(org_id);

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

create trigger jobs_updated_at before update on jobs for each row execute function update_updated_at();
create trigger orgs_updated_at before update on orgs for each row execute function update_updated_at();
