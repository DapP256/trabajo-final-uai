import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  let payload: {
    email?: string;
    password?: string;
    nombre?: string;
    apellido?: string;
    rol?: 'trabajador' | 'empresa' | 'administrador';
    aceptoTerminos?: boolean;
  };

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password?.trim();
  const nombre = payload.nombre?.trim();
  const apellido = payload.apellido?.trim() || null;
  const rol = payload.rol ?? 'trabajador';
  const aceptoTerminos = Boolean(payload.aceptoTerminos);

  if (!email) {
    return NextResponse.json({ message: 'Email requerido' }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ message: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
  }
  if (!nombre) {
    return NextResponse.json({ message: 'Nombre requerido' }, { status: 400 });
  }

  const { data: existingUser, error: fetchError } = await supabase
    .from('usuario')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: 'Error verificando usuario existente', details: fetchError.message }, { status: 500 });
  }

  if (existingUser) {
    return NextResponse.json({ message: 'Ya existe un usuario con ese email' }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);

  const { data, error } = await supabase
    .from('usuario')
    .insert({
      email,
      contrasena_hash: passwordHash,
      nombre,
      apellido,
      rol,
      acepto_terminos: aceptoTerminos,
    })
    .select('id, email, nombre, apellido, rol, estado, created_at')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error creando usuario', details: error.message }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      estado: data.estado,
      created_at: data.created_at,
    },
  });
}
