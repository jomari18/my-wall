import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Keys come from .env.local (locally) or Vercel env vars (in production).
// They are never hardcoded. The anon key is safe in the browser because
// Row Level Security in the database decides what it is allowed to do.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** Returns one shared Supabase client, created the first time it is needed. */
export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }
  client ??= createClient(url, anonKey);
  return client;
}
