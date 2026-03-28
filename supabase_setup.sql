-- Run this in your Supabase SQL editor

-- Bookings table
create table bookings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  time_slot   text not null,
  address     text not null,   -- stores lesson type
  phone       text,
  description text not null,
  created_at  timestamptz default now()
);

alter table bookings enable row level security;

create policy "Users can insert own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can view own bookings"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Users can delete own bookings"
  on bookings for delete
  using (auth.uid() = user_id);

create policy "Public can view date and time_slot"
  on bookings for select
  using (true);

create index bookings_date_idx on bookings(date);

-- Blocked dates table (admin only)
create table blocked_dates (
  id    uuid primary key default gen_random_uuid(),
  date  date unique not null
);

alter table blocked_dates enable row level security;

create policy "Public can view blocked dates"
  on blocked_dates for select
  using (true);

create policy "Admins can manage blocked dates"
  on blocked_dates for all
  using (auth.jwt() ->> 'role' = 'admin' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Availability RPC — returns booked slots in a date range
create or replace function get_availability(p_start date, p_end date)
returns table (date date, time_slot text)
language sql
security definer
as $$
  select date, time_slot
  from bookings
  where date >= p_start and date <= p_end;
$$;

-- To make a user an admin, run:
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = 'your@email.com';
