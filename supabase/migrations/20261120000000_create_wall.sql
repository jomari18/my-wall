-- Test 2: My Wall
-- Run this whole file once in the Supabase SQL editor.
-- It creates the posts table, locks it down with RLS, turns on Realtime,
-- and creates the photo bucket with its upload rules.

-- ============================================================
-- 1. Posts table
-- ============================================================
create table if not exists public.posts (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null default 'Anonymous'
                         check (char_length(name) <= 50 and char_length(btrim(name)) >= 1),
  message    text        not null
                         check (char_length(message) <= 280 and char_length(btrim(message)) >= 1),
  image_url  text,
  created_at timestamptz not null default now()
);

-- The feed always sorts by newest first, so index that column.
create index if not exists posts_created_at_idx on public.posts (created_at desc);

-- ============================================================
-- 2. Row Level Security
-- With RLS on, every action is denied unless a policy allows it.
-- We add policies for SELECT and INSERT only, so nobody using the
-- public anon key can UPDATE or DELETE a post.
-- ============================================================
alter table public.posts enable row level security;

-- Belt and braces: also remove the table privileges themselves.
revoke update, delete, truncate on public.posts from anon, authenticated;
grant select, insert on public.posts to anon, authenticated;

drop policy if exists "Anyone can read posts" on public.posts;
create policy "Anyone can read posts"
  on public.posts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create posts" on public.posts;
create policy "Anyone can create posts"
  on public.posts
  for insert
  to anon, authenticated
  with check (
    -- A photo link, if any, must point at our own public photo bucket.
    image_url is null
    or image_url ~ '^https://[a-z0-9-]+\.supabase\.co/storage/v1/object/public/wall-photos/'
  );

-- ============================================================
-- 3. Realtime: broadcast new rows to everyone watching the feed
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;
end $$;

-- ============================================================
-- 4. Photo storage
-- A public bucket serves files to anyone with the URL (public read).
-- The bucket itself rejects files over 5 MB or that are not images.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wall-photos',
  'wall-photos',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone may upload into this bucket, only with an image file extension.
-- There is no SELECT policy (so nobody can list every file) and no
-- UPDATE or DELETE policy (so nobody can replace or remove a photo).
drop policy if exists "Anyone can upload wall photos" on storage.objects;
create policy "Anyone can upload wall photos"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'wall-photos'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
  );
