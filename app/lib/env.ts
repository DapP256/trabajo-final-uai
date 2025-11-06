type EnvShape = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SESSION_SECRET: string;
};

let cachedEnv: EnvShape | null = null;

function assertEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`${key} no está configurada`);
  }
  return value;
}

export function loadEnv(): EnvShape {
  if (cachedEnv) return cachedEnv;

  const NEXT_PUBLIC_SUPABASE_URL = assertEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  try {
    new URL(NEXT_PUBLIC_SUPABASE_URL);
  } catch (error) {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida (${error instanceof Error ? error.message : String(error)})`);
  }

  const NEXT_PUBLIC_SUPABASE_ANON_KEY = assertEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  cachedEnv = {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY,
  };

  return cachedEnv;
}

export function requireServiceRoleKey(): string {
  const { SUPABASE_SERVICE_ROLE_KEY } = loadEnv();
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY es requerido para operaciones de servicio");
  }
  return SUPABASE_SERVICE_ROLE_KEY;
}
