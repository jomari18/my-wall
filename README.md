# Test 2: My Wall

A 2008-style public wall. Anyone can type a name and a message (and attach a photo), press **Share**, and see every post newest first. New posts appear live, without a refresh.

**Stack:** Next.js 15 (App Router, TypeScript) · Supabase (Postgres, Realtime, Storage) · Vercel

## Features

- Share a message with a display name (defaults to "Anonymous"), with no login
- Posts are saved in Supabase and listed newest first, so they survive a page refresh
- 280-character limit with a live counter, enforced in the UI **and** by a database `CHECK` constraint
- Live feed via Supabase Realtime
- Photo upload to Supabase Storage (JPG/PNG/GIF/WebP, max 5 MB) with a preview before sharing
- Loading, empty, error and uploading states; responsive and keyboard accessible

## Run it locally

1. Create a Supabase project, open **SQL Editor**, paste all of
   [`supabase/migrations/20261120000000_create_wall.sql`](supabase/migrations/20261120000000_create_wall.sql) and run it.
2. Copy `.env.example` to `.env.local` and fill in the values from
   **Project Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. `npm install` then `npm run dev` and open http://localhost:3000.

## Project structure

```
src/
  app/            layout, page, global styles
  components/     Wall (state + realtime), Composer, PhotoPicker, PostList, PostItem, ...
  lib/
    supabase.ts   the one shared Supabase client (reads env vars)
    posts.ts      fetchPosts, createPost, uploadPhoto, validatePhoto
    constants.ts  limits shared with the database rules
supabase/migrations/   table, RLS policies, Realtime, storage bucket
```

## Security

- **RLS is on** for `posts`. Only two policies exist: `SELECT` and `INSERT` for `anon`.
  With no `UPDATE`/`DELETE` policy, those actions are denied. The privileges are also revoked.
- **Database constraints** guard the data even if someone skips the UI: name 1–50 chars,
  message 1–280 chars (and not just spaces).
- **Photos:** the `wall-photos` bucket is public-read, limited to 5 MB and image MIME types.
  `anon` can only `INSERT` objects; with no `SELECT` policy nobody can list files, and with no
  `UPDATE`/`DELETE` policy nobody can replace or remove one.
- Keys live only in `.env.local` / Vercel env vars. `.env*` is git-ignored.
