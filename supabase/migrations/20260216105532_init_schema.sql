-- 1. users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text,
  gender text check (gender in ('male', 'female')),
  birth_year int,
  birth_month int,
  birth_day int,
  birth_hour text,
  calendar_type text check (calendar_type in ('solar', 'lunar'))
);

-- 2. saju_results
create table if not exists saju_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz default now(),
  year_gan text,
  year_ji text,
  month_gan text,
  month_ji text,
  day_gan text,
  day_ji text,
  hour_gan text,
  hour_ji text,
  ohaeng_wood int default 0,
  ohaeng_fire int default 0,
  ohaeng_earth int default 0,
  ohaeng_metal int default 0,
  ohaeng_water int default 0,
  yongshin text,
  ilju_type text,
  personality_tags text[]
);

-- 3. chat_sessions
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  counselor_id text check (counselor_id in ('yunha', 'harin', 'jiho', 'seojin', 'noeul', 'myo')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. chat_messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text,
  created_at timestamptz default now()
);

-- 5. compatibility_results
create table if not exists compatibility_results (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references users(id) on delete cascade,
  user2_id uuid references users(id) on delete cascade,
  score int,
  analysis jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table users enable row level security;
alter table saju_results enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table compatibility_results enable row level security;

-- Policies: allow all for anon (initial stage)
create policy "anon_all_users" on users for all to anon using (true) with check (true);
create policy "anon_all_saju_results" on saju_results for all to anon using (true) with check (true);
create policy "anon_all_chat_sessions" on chat_sessions for all to anon using (true) with check (true);
create policy "anon_all_chat_messages" on chat_messages for all to anon using (true) with check (true);
create policy "anon_all_compatibility_results" on compatibility_results for all to anon using (true) with check (true);
