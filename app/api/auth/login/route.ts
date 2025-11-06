import { NextRequest, NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { randomUUID, timingSafeEqual } from 'crypto';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { setSessionCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  let payload: { email?: string; password?: string };
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password?.trim();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('usuario')
    .select('id, email, nombre, apellido, rol, estado, contrasena_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: 'Error buscando usuario', details: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  const storedHash = data.contrasena_hash ?? '';
  const isBcryptHash = typeof storedHash === 'string' && /^\$2[aby]\$/i.test(storedHash.slice(0, 4));

  let passwordOk = false;
  let shouldRehash = false;

  if (isBcryptHash) {
    passwordOk = await compare(password, storedHash);
  } else if (storedHash) {
    if (storedHash.length === password.length) {
      try {
        passwordOk = timingSafeEqual(Buffer.from(password), Buffer.from(storedHash));
      } catch (_) {
        passwordOk = false;
      }
    }
    shouldRehash = passwordOk;
  }

  if (!passwordOk) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  if (shouldRehash) {
    try {
      const newHash = await hash(password, 10);
      await supabase.from('usuario').update({ contrasena_hash: newHash }).eq('id', data.id);
    } catch (_) {
      // Si falla la actualización, continuamos con el login igualmente
    }
  }

  const sessionToken = randomUUID();
  const issuedAt = new Date().toISOString();

  await supabase
    .from('usuario')
    .update({ last_login_at: issuedAt })
    .eq('id', data.id);

  const response = NextResponse.json({
    user: {
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      estado: data.estado,
    },
    session: {
      token: sessionToken,
      issued_at: issuedAt,
    },
  });

  setSessionCookie(response, {
    token: sessionToken,
    user: {
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      estado: data.estado,
    },
    issuedAt,
  });

  return response;
}
