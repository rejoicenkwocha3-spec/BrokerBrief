-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ═══════════════════════════════════════════════════════
-- IDENTITY & MULTI-TENANCY
-- ═══════════════════════════════════════════════════════

create table organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  email text,
  phone text,
  website text,
  country text,
  brokerage_type text,
  company_size text,
  plan text not null default 'starter',
  plan_credits_remaining int not null default 10,
  plan_credits_reset_at timestamptz,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  job_title text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type org_role as enum ('owner','admin','manager','broker','staff');

create table organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role org_role not null default 'broker',
  invited_by uuid references profiles(id),
  joined_at timestamptz not null default now(),
  unique(organisation_id, user_id)
);
create index on organisation_members(user_id);
create index on organisation_members(organisation_id);

create table organisation_invitations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  email text not null,
  role org_role not null default 'broker',
  token text unique not null default encode(gen_random_bytes(32),'hex'),
  invited_by uuid references profiles(id),
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════
-- CRM
-- ═══════════════════════════════════════════════════════

create type client_status as enum ('active','inactive','prospect','archived');
create type client_type as enum ('individual','company','trust','smsf','other');

create table clients (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  assigned_to uuid references profiles(id),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  company text,
  industry text,
  client_type client_type not null default 'individual',
  status client_status not null default 'active',
  source text,
  tags text[],
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on clients(organisation_id);
create index on clients(assigned_to);
create index on clients(status);

create table client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  organisation_id uuid not null references organisations(id) on delete cascade,
  author_id uuid references profiles(id),
  content text not null,
  created_at timestamptz not null default now()
);
create index on client_notes(client_id);

create type activity_type as enum (
  'note','call','email','meeting','task_completed','deal_updated',
  'document_uploaded','status_changed','lead_converted'
);

create table client_activities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid references profiles(id),
  activity_type activity_type not null,
  title text not null,
  description text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index on client_activities(client_id, created_at desc);

-- ═══════════════════════════════════════════════════════
-- LEADS
-- ═══════════════════════════════════════════════════════

create type lead_status as enum ('new','contacted','qualified','converted','lost');

create table leads (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  assigned_to uuid references profiles(id),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  company text,
  source text,
  status lead_status not null default 'new',
  notes text,
  converted_client_id uuid references clients(id),
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on leads(organisation_id);
create index on leads(status);

-- ═══════════════════════════════════════════════════════
-- DEALS / PIPELINE
-- ═══════════════════════════════════════════════════════

create type deal_stage as enum (
  'new_lead','contacted','qualified','proposal_sent','negotiation','won','lost'
);

create table deals (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  client_id uuid references clients(id),
  owner_id uuid references profiles(id),
  title text not null,
  value numeric(14,2),
  currency text not null default 'USD',
  stage deal_stage not null default 'new_lead',
  probability int check (probability between 0 and 100),
  expected_close_date date,
  lost_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on deals(organisation_id);
create index on deals(stage);
create index on deals(owner_id);

create table deal_activities (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid references profiles(id),
  from_stage deal_stage,
  to_stage deal_stage,
  note text,
  created_at timestamptz not null default now()
);
create index on deal_activities(deal_id);

-- ═══════════════════════════════════════════════════════
-- MEETINGS
-- ═══════════════════════════════════════════════════════

create type meeting_type as enum (
  'client_meeting','discovery_call','review_meeting','internal_meeting','follow_up'
);
create type meeting_status as enum ('scheduled','completed','cancelled','no_show');

create table meetings (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  created_by uuid references profiles(id),
  client_id uuid references clients(id),
  deal_id uuid references deals(id),
  title text not null,
  meeting_type meeting_type not null default 'client_meeting',
  status meeting_status not null default 'scheduled',
  scheduled_at timestamptz,
  duration_minutes int,
  location text,
  notes text,
  transcript text,
  ai_summary text,
  action_items jsonb default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on meetings(organisation_id);
create index on meetings(client_id);
create index on meetings(scheduled_at);

-- ═══════════════════════════════════════════════════════
-- TASKS
-- ═══════════════════════════════════════════════════════

create type task_status as enum ('todo','in_progress','completed','overdue');
create type task_priority as enum ('low','medium','high','urgent');

create table tasks (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  created_by uuid references profiles(id),
  assigned_to uuid references profiles(id),
  client_id uuid references clients(id),
  deal_id uuid references deals(id),
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on tasks(organisation_id);
create index on tasks(assigned_to);
create index on tasks(due_date);

-- ═══════════════════════════════════════════════════════
-- DOCUMENTS
-- ═══════════════════════════════════════════════════════

create table documents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  uploaded_by uuid references profiles(id),
  client_id uuid references clients(id),
  name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  category text,
  ai_summary text,
  tags text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on documents(organisation_id);
create index on documents(client_id);

-- ═══════════════════════════════════════════════════════
-- AI
-- ═══════════════════════════════════════════════════════

create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references profiles(id),
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on ai_conversations(organisation_id, user_id);

create type ai_role as enum ('user','assistant','tool');

create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role ai_role not null,
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index on ai_messages(conversation_id, created_at);

-- ═══════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════════════════

create table notifications (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references profiles(id),
  title text not null,
  body text,
  type text not null,
  read boolean not null default false,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index on notifications(user_id, read, created_at desc);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════

alter table organisations enable row level security;
alter table profiles enable row level security;
alter table organisation_members enable row level security;
alter table organisation_invitations enable row level security;
alter table clients enable row level security;
alter table client_notes enable row level security;
alter table client_activities enable row level security;
alter table leads enable row level security;
alter table deals enable row level security;
alter table deal_activities enable row level security;
alter table meetings enable row level security;
alter table tasks enable row level security;
alter table documents enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table notifications enable row level security;

-- Helper function: check org membership
create or replace function auth_org_id(org_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from organisation_members
    where organisation_id = org_id
      and user_id = auth.uid()
  );
$$;

-- profiles: users see/edit their own
create policy "profiles_own" on profiles for all using (id = auth.uid());

-- organisations: members can read
create policy "orgs_member_read" on organisations for select using (auth_org_id(id));
create policy "orgs_owner_update" on organisations for update using (
  exists (select 1 from organisation_members where organisation_id = id and user_id = auth.uid() and role = 'owner')
);

-- organisation_members
create policy "members_read" on organisation_members for select using (auth_org_id(organisation_id));
create policy "members_insert_owner" on organisation_members for insert with check (
  exists (select 1 from organisation_members om2 where om2.organisation_id = organisation_id and om2.user_id = auth.uid() and om2.role in ('owner','admin'))
);

-- Allow first member (owner) insert with no prior membership
create policy "members_self_join" on organisation_members for insert with check (user_id = auth.uid());

-- invitations
create policy "invitations_read" on organisation_invitations for select using (auth_org_id(organisation_id));
create policy "invitations_insert" on organisation_invitations for insert with check (auth_org_id(organisation_id));

-- clients
create policy "clients_org" on clients for all using (auth_org_id(organisation_id));
create policy "client_notes_org" on client_notes for all using (auth_org_id(organisation_id));
create policy "client_activities_org" on client_activities for all using (auth_org_id(organisation_id));

-- leads
create policy "leads_org" on leads for all using (auth_org_id(organisation_id));

-- deals
create policy "deals_org" on deals for all using (auth_org_id(organisation_id));
create policy "deal_activities_org" on deal_activities for all using (auth_org_id(organisation_id));

-- meetings
create policy "meetings_org" on meetings for all using (auth_org_id(organisation_id));

-- tasks
create policy "tasks_org" on tasks for all using (auth_org_id(organisation_id));

-- documents
create policy "documents_org" on documents for all using (auth_org_id(organisation_id));

-- ai
create policy "ai_convs_own" on ai_conversations for all using (user_id = auth.uid() and auth_org_id(organisation_id));
create policy "ai_msgs_own" on ai_messages for all using (
  exists (select 1 from ai_conversations where id = conversation_id and user_id = auth.uid())
);

-- notifications
create policy "notifs_own" on notifications for all using (user_id = auth.uid());

-- organisations: allow insert for new org creation
create policy "orgs_insert" on organisations for insert with check (true);

-- ═══════════════════════════════════════════════════════
-- TRIGGERS: auto-create profile on signup
-- ═══════════════════════════════════════════════════════

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles(id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Storage bucket for documents
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
  on conflict (id) do nothing;

create policy "documents_upload" on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid() is not null);

create policy "documents_read" on storage.objects for select
  using (bucket_id = 'documents' and auth.uid() is not null);

create policy "documents_delete" on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid() is not null);
