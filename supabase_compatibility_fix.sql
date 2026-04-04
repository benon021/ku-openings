-- KU OPEN TOURNAMENT - COMPATIBILITY SCHEMA (FIXED)
-- Instructions: Run this in your Supabase SQL Editor. 
-- WARNING: This will DELETE existing data to reset the schema correctly.

-- Drop existing tables (in correct order)
drop table if exists knockout_matches;
drop table if exists events;
drop table if exists matches;
drop table if exists players;
drop table if exists teams;
drop table if exists pools;
drop table if exists categories;
drop table if exists profiles;

-- 1. Profiles (using TEXT for ID compatibility)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  password text,
  role text check (role in ('admin', 'staff', 'viewer')) default 'viewer',
  updated_at timestamp with time zone default now()
);

-- 2. Categories (using TEXT for ID compatibility)
create table categories (
  id text primary key,
  name text not null unique
);

-- 3. Pools
create table pools (
  id text primary key,
  name text not null,
  category_id text references categories(id) on delete cascade
);

-- 4. Teams
create table teams (
  id text primary key,
  name text not null,
  category_id text references categories(id) on delete cascade,
  pool_id text references pools(id) on delete set null,
  logo_url text,
  password text default '12345678',
  qualified boolean default false
);

-- 5. Players
create table players (
  id text primary key,
  name text not null,
  jersey_number integer,
  team_id text references teams(id) on delete cascade
);

-- 6. Matches
create table matches (
  id text primary key,
  teamA_id text references teams(id) on delete cascade,
  teamB_id text references teams(id) on delete cascade,
  category_id text references categories(id) on delete cascade,
  pool_id text references pools(id) on delete set null,
  time timestamp with time zone,
  pitch text,
  status text check (status in ('upcoming', 'live', 'finished')) default 'upcoming',
  current_quarter text default 'Not Started',
  scoreA integer default 0,
  scoreB integer default 0,
  locked boolean default false,
  updated_at timestamp with time zone default now()
);

-- 7. Events (Goals & Cards)
create table events (
  id uuid default gen_random_uuid() primary key,
  match_id text references matches(id) on delete cascade,
  team_id text references teams(id) on delete cascade,
  player_id text references players(id) on delete cascade,
  type text check (type in ('goal', 'card')),
  card_type text,
  minute integer,
  created_at timestamp with time zone default now()
);

-- 8. Row Level Security (Enable all public access for rapid deployment)
alter table profiles enable row level security;
alter table categories enable row level security;
alter table pools enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table events enable row level security;

-- 9. Public Access Policies (Essential for Vercel)
create policy "Public Select Categories" on categories for select using (true);
create policy "Public Select Pools" on pools for select using (true);
create policy "Public Select Teams" on teams for select using (true);
create policy "Public Select Players" on players for select using (true);
create policy "Public Select Matches" on matches for select using (true);
create policy "Public Select Events" on events for select using (true);

-- Allow seeding inserts
create policy "Public Insert Categories" on categories for insert with check (true);
create policy "Public Insert Pools" on pools for insert with check (true);
create policy "Public Insert Teams" on teams for insert with check (true);
create policy "Public Insert Matches" on matches for insert with check (true);

create policy "Public All Profiles" on profiles for all using (true);
