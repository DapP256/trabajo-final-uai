import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { setSessionCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();

  let payload: {
    email?: string;
    password?: string;
    nombre?: string;
    apellido?: string;
    rol?: 'trabajador' | 'empresa' | 'administrador';
    aceptoTerminos?: boolean;
    telefono?: string;
    cp?: string;
    ciudad?: string;
  };

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password?.trim();
  const nombreOriginal = payload.nombre?.trim();
  const apellidoInput = payload.apellido?.trim() || null;
  const rawRol = payload.rol ?? 'trabajador';
  const rol: 'trabajador' | 'empresa' | 'administrador' = rawRol === 'empresa' ? 'empresa' : rawRol === 'administrador' ? 'administrador' : 'trabajador';
  const aceptoTerminos = payload.aceptoTerminos === true;
  const telefono = typeof payload.telefono === 'string' && payload.telefono.trim() ? payload.telefono.trim() : null;
  const cp = typeof payload.cp === 'string' && payload.cp.trim() ? payload.cp.trim() : null;
  const ciudad = typeof payload.ciudad === 'string' && payload.ciudad.trim() ? payload.ciudad.trim() : null;

  let nombre = nombreOriginal || null;
  let apellido = apellidoInput;

  if (!email) {
    return NextResponse.json({ message: 'Email requerido' }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ message: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
  }
  if (!nombre) {
    return NextResponse.json({ message: 'Nombre requerido' }, { status: 400 });
  }
  if (!aceptoTerminos) {
    return NextResponse.json({ message: 'Debés aceptar los términos y condiciones' }, { status: 400 });
  }

  if (rol !== 'empresa' && !apellido && nombre) {
    const parts = nombre.split(' ');
    if (parts.length > 1) {
      nombre = parts.shift() ?? nombre;
      apellido = parts.join(' ') || null;
    }
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
      telefono,
      cp,
      ciudad,
      contacto_nombre: rol === 'empresa' ? nombreOriginal : null,
    })
    .select('id, email, nombre, apellido, rol, estado, created_at')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error creando usuario', details: error.message }, { status: 500 });
  }

  const issuedAt = new Date().toISOString();
  const token = randomUUID();

  const response = NextResponse.json({
    user: {
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      estado: data.estado,
      created_at: data.created_at,
    },
    session: {
      token,
      issued_at: issuedAt,
    },
  });

  setSessionCookie(response, {
    token,
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
