import type { z } from "zod";

const envSchema = (() => {
  try {
    // Lazy import to avoid pulling zod into the client bundle if not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { z } = require("zod") as typeof import("zod");
    return z.object({
      NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida"),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY es requerido"),
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY es requerido").optional(),
    });
  } catch (_) {
    return null;
  }
})();

type EnvShape = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

let cachedEnv: EnvShape | null = null;

export function loadEnv(): EnvShape {
  if (cachedEnv) return cachedEnv;

  const raw: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  if (envSchema) {
    const parsed = envSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Variables de entorno faltantes o inválidas: ${parsed.error.message}`);
    }
    cachedEnv = parsed.data;
    return parsed.data;
  }

  if (!raw.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL no está configurada");
  }
  if (!raw.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada");
  }

  cachedEnv = raw as EnvShape;
  return cachedEnv;
}

export function requireServiceRoleKey(): string {
  const { SUPABASE_SERVICE_ROLE_KEY } = loadEnv();
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY es requerido para operaciones de servicio");
  }
  return SUPABASE_SERVICE_ROLE_KEY;
}
