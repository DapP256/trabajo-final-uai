'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from '@/lib/env';

export type SupabaseBrowserClient = SupabaseClient;

let browserClient: SupabaseBrowserClient | null = null;

export function getSupabaseBrowserClient(): SupabaseBrowserClient {
  if (browserClient) return browserClient;

  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = loadEnv();

  browserClient = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'manito-auth',
    },
  });

  return browserClient;
}
