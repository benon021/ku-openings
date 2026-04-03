-- KU OPEN TOURNAMENT - DATABASE SCHEMA SETUP
-- Instructions: Run this in your Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (for role management)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'staff', 'viewer')) default 'viewer',
  updated_at timestamp with time zone default now()
);

-- 2. Categories (Men/Women)
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique
);

-- 3. Pools
create table if not exists pools (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category_id uuid references categories(id) on delete cascade
);

-- 4. Teams
create table if not exists teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category_id uuid references categories(id) on delete cascade,
  pool_id uuid references pools(id) on delete set null,
  logo_url text,
  qualified boolean default false
);

-- 5. Players
create table if not exists players (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  jersey_number integer,
  team_id uuid references teams(id) on delete cascade
);

-- 6. Matches
create table if not exists matches (
  id uuid default uuid_generate_v4() primary key,
  teamA_id uuid references teams(id) on delete cascade,
  teamB_id uuid references teams(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  pool_id uuid references pools(id) on delete set null,
  time timestamp with time zone,
  pitch text,
  status text check (status in ('upcoming', 'live', 'finished')) default 'upcoming',
  current_quarter text check (current_quarter in ('Q1', 'Q2', 'Q3', 'Q4', 'HT', 'FT', 'Not Started')) default 'Not Started',
  scoreA integer default 0,
  scoreB integer default 0,
  locked boolean default false,
  updated_at timestamp with time zone default now()
);

-- 7. Events (Goals & Cards)
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  type text check (type in ('goal', 'card')),
  goal_type text check (goal_type in ('field', 'pc', 'stroke')),
  card_type text check (card_type in ('green', 'yellow', 'red')),
  minute integer,
  created_at timestamp with time zone default now()
);

-- 8. Knockout Matches (Flexible Bracket)
create table if not exists knockout_matches (
  id uuid default uuid_generate_v4() primary key,
  round text check (round in ('QF', 'SF', 'F', 'Bronze')),
  teamA_id uuid references teams(id) on delete set null,
  teamB_id uuid references teams(id) on delete set null,
  sourceA text, -- e.g., 'Pool A 1st'
  sourceB text, -- e.g., 'Pool B 2nd'
  winner_id uuid references teams(id) on delete set null,
  match_id uuid references matches(id) on delete set null,
  category_id uuid references categories(id) on delete cascade
);

-- 9. Row Level Security (RLS)
alter table profiles enable row level security;
alter table categories enable row level security;
alter table pools enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table events enable row level security;
alter table knockout_matches enable row level security;

-- Viewer Policies (Select all)
create policy "Public Select Categories" on categories for select using (true);
create policy "Public Select Pools" on pools for select using (true);
create policy "Public Select Teams" on teams for select using (true);
create policy "Public Select Players" on players for select using (true);
create policy "Public Select Matches" on matches for select using (true);
create policy "Public Select Events" on events for select using (true);
create policy "Public Select Knockout" on knockout_matches for select using (true);
create policy "Public Select Profiles" on profiles for select using (true);

-- Admin & Staff Modification logic here...
-- For brevity, let's allow authenticated users with certain roles to update.
-- You should refine these in production.

-- Function to handle new user signup and create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'viewer');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (Men)
do $$
declare
  men_id uuid;
  pool_a_id uuid;
  pool_b_id uuid;
  team_1_id uuid;
  team_2_id uuid;
  team_3_id uuid;
  team_4_id uuid;
  team_5_id uuid;
  team_6_id uuid;
  team_7_id uuid;
  team_8_id uuid;
begin
  -- Get Category
  select id into men_id from categories where name = 'Men' limit 1;
  if men_id is null then
    insert into categories (name) values ('Men') returning id into men_id;
  end if;

  -- Create Pools
  insert into pools (name, category_id) values ('A', men_id) returning id into pool_a_id;
  insert into pools (name, category_id) values ('B', men_id) returning id into pool_b_id;

  -- Create Teams Pool A
  insert into teams (name, category_id, pool_id) values ('Hustlers HC', men_id, pool_a_id) returning id into team_1_id;
  insert into teams (name, category_id, pool_id) values ('Titans United', men_id, pool_a_id) returning id into team_2_id;
  insert into teams (name, category_id, pool_id) values ('Apex Warriors', men_id, pool_a_id) returning id into team_3_id;
  insert into teams (name, category_id, pool_id) values ('Storm Club', men_id, pool_a_id) returning id into team_4_id;

  -- Create Teams Pool B
  insert into teams (name, category_id, pool_id) values ('Viper Strikers', men_id, pool_b_id) returning id into team_5_id;
  insert into teams (name, category_id, pool_id) values ('Blue Phantoms', men_id, pool_b_id) returning id into team_6_id;
  insert into teams (name, category_id, pool_id) values ('Red Devils', men_id, pool_b_id) returning id into team_7_id;
  insert into teams (name, category_id, pool_id) values ('Royal Knights', men_id, pool_b_id) returning id into team_8_id;

  -- Create Sample Matches
  insert into matches (teamA_id, teamB_id, category_id, pool_id, time, pitch, status, scoreA, scoreB, current_quarter)
  values (team_1_id, team_2_id, men_id, pool_a_id, now() - interval '1 hour', 'Pitch 1', 'live', 2, 1, 'Q3');
  
  insert into matches (teamA_id, teamB_id, category_id, pool_id, time, pitch, status)
  values (team_3_id, team_4_id, men_id, pool_a_id, now() + interval '2 hours', 'Pitch 2', 'upcoming');

  insert into matches (teamA_id, teamB_id, category_id, pool_id, time, pitch, status, scoreA, scoreB, current_quarter)
  values (team_5_id, team_6_id, men_id, pool_b_id, now() - interval '3 hours', 'Pitch 1', 'finished', 0, 0, 'FT');

  -- Create Sample Players for Team 1
  insert into players (name, jersey_number, team_id) values ('James Harden', 13, team_1_id);
  insert into players (name, jersey_number, team_id) values ('Kevin Durant', 7, team_1_id);
  insert into players (name, jersey_number, team_id) values ('Stephen Curry', 30, team_2_id);
end $$;

-- SEED DATA (Women)
do $$
declare
  women_id uuid;
  pool_wa_id uuid;
  team_w1_id uuid;
  team_w2_id uuid;
begin
  -- Get Category
  select id into women_id from categories where name = 'Women' limit 1;
  if women_id is null then
    insert into categories (name) values ('Women') returning id into women_id;
  end if;

  -- Create Pool
  insert into pools (name, category_id) values ('A', women_id) returning id into pool_wa_id;

  -- Create Teams
  insert into teams (name, category_id, pool_id) values ('Lady Hawks', women_id, pool_wa_id) returning id into team_w1_id;
  insert into teams (name, category_id, pool_id) values ('Silver Queens', women_id, pool_wa_id) returning id into team_w2_id;

  -- Create Sample Match
  insert into matches (teamA_id, teamB_id, category_id, pool_id, time, pitch, status)
  values (team_w1_id, team_w2_id, women_id, pool_wa_id, now() + interval '1 day', 'Main Arena', 'upcoming');
end $$;
