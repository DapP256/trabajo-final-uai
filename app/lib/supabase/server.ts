import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv, requireServiceRoleKey } from '@/lib/env';

export type SupabaseServiceClient = SupabaseClient;

let serviceClient: SupabaseServiceClient | null = null;

export function getSupabaseServiceClient(): SupabaseServiceClient {
  if (serviceClient) return serviceClient;

  const { NEXT_PUBLIC_SUPABASE_URL } = loadEnv();
  const serviceRoleKey = requireServiceRoleKey();

  serviceClient = createClient(NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'manito-app/server',
      },
    },
  });

  return serviceClient;
}
