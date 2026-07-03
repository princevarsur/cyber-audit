-- 0001_schema.sql — GRC Risk & Compliance Dashboard schema
create extension if not exists pgcrypto;

create table if not exists company_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  employees int,
  environment text[] default '{}',
  summary text,
  created_at timestamptz default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  asset_code text unique not null,
  asset_name text not null,
  asset_type text,
  owner text,
  business_criticality text,
  data_classification text,
  description text,
  created_at timestamptz default now()
);

create table if not exists controls (
  id uuid primary key default gen_random_uuid(),
  control_code text unique not null,
  control_name text not null,
  control_type text check (control_type in ('Administrative','Technical','Physical')),
  description text,
  framework_reference text,
  implementation_status text,
  owner text,
  created_at timestamptz default now()
);

create table if not exists risks (
  id uuid primary key default gen_random_uuid(),
  risk_code text unique not null,
  risk_title text not null,
  asset_id uuid references assets(id) on delete set null,
  threat text,
  vulnerability text,
  likelihood int check (likelihood between 1 and 5),
  impact int check (impact between 1 and 5),
  inherent_risk_score int generated always as (likelihood * impact) stored,
  risk_rating text,
  control_recommendation text,
  residual_risk_score int,
  status text default 'Open',
  owner text,
  created_at timestamptz default now()
);

create table if not exists compliance_mappings (
  id uuid primary key default gen_random_uuid(),
  mapping_code text unique not null,
  control_id uuid references controls(id) on delete set null,
  framework text default 'NIST CSF 2.0',
  function_category text,
  requirement text,
  compliance_status text check (compliance_status in ('Compliant','Partially Compliant','Non-Compliant','Not Started')),
  evidence_notes text,
  created_at timestamptz default now()
);

create table if not exists policies (
  id uuid primary key default gen_random_uuid(),
  policy_code text unique not null,
  title text not null,
  purpose text,
  scope text,
  policy_statement text,
  owner text,
  review_date date,
  status text default 'Active',
  created_at timestamptz default now()
);

create table if not exists gap_assessments (
  id uuid primary key default gen_random_uuid(),
  requirement text not null,
  current_state text,
  gap text,
  risk_level text,
  recommendation text,
  priority text,
  created_at timestamptz default now()
);

create index if not exists idx_risks_asset on risks(asset_id);
create index if not exists idx_mappings_control on compliance_mappings(control_id);
