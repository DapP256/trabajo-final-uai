import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

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

  const passwordOk = await compare(password, data.contrasena_hash);
  if (!passwordOk) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  const sessionToken = randomUUID();

  await supabase
    .from('usuario')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', data.id);

  return NextResponse.json({
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
      issued_at: new Date().toISOString(),
    },
  });
}
