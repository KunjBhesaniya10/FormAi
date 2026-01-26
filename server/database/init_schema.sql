-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table
-- Stores global user constraints and the currently active sport pointer
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  username text unique,
  -- Tracks what the UI should show RIGHT NOW.
  -- Can be null if the user has just signed up and hasn't picked a sport.
  current_sport_id text, 
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. User Sports Junction Table
-- Tracks all sports a user participates in (Multi-Sport support)
create table user_sports (
  user_id uuid references users(id) on delete cascade,
  sport_id text not null, -- e.g., 'table_tennis', 'cricket'
  skill_level text check (skill_level in ('Beginner', 'Intermediate', 'Advanced', 'Pro')),
  joined_at timestamp with time zone default now(),
  
  -- Metadata specific to this sport for this user (e.g. "Right Handed", "Shakehand Grip")
  profile_data jsonb default '{}'::jsonb,
  
  primary key (user_id, sport_id)
);

-- 3. Sessions Table
-- Stores video metadata and AI analysis results
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  sport_id text not null, -- Denormalized mostly, but ensures we know which sport this video was for
  
  video_url text not null,
  duration_seconds integer,
  
  -- The AI Analysis Result (JSON output from Deep Analyst)
  analysis_json jsonb,
  -- The Audio Summary Script (Text output from Deep Analyst)
  coach_audio_script text,
  
  created_at timestamp with time zone default now()
);

-- Index for faster query of a user's sessions for a specific sport
create index idx_sessions_user_sport on sessions(user_id, sport_id);
