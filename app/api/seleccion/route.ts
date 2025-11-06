import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const params = request.nextUrl.searchParams;
  const avisoId = params.get('aviso_id');
  const trabajadorId = params.get('trabajador_id');
  const estado = params.get('estado');

  let query = supabase
    .from('postulacion')
    .select('id, created_at, estado, trabajador_id, aviso_id')
    .order('created_at', { ascending: false });

  if (avisoId) {
    query = query.eq('aviso_id', avisoId);
  }
  if (trabajadorId) {
    query = query.eq('trabajador_id', trabajadorId);
  }
  if (estado) {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo postulaciones', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ postulaciones: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const trabajadorId = typeof payload.trabajador_id === 'string' ? payload.trabajador_id : undefined;
  const avisoId = typeof payload.aviso_id === 'string' ? payload.aviso_id : undefined;

  if (!trabajadorId || !avisoId) {
    return NextResponse.json({ message: 'trabajador_id y aviso_id son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('postulacion')
    .insert({ trabajador_id: trabajadorId, aviso_id: avisoId })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error creando postulacion', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ postulacion: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  let payload: { ids?: string[]; estado?: string };

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const ids = Array.isArray(payload.ids) ? payload.ids.filter((id) => typeof id === 'string') : [];
  const estado = payload.estado;

  if (!ids.length) {
    return NextResponse.json({ message: 'ids es requerido (array de postulaciones)' }, { status: 400 });
  }
  if (!estado) {
    return NextResponse.json({ message: 'estado es requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('postulacion')
    .update({ estado })
    .in('id', ids)
    .select('id, estado, trabajador_id, aviso_id, created_at');

  if (error) {
    return NextResponse.json({ message: 'Error actualizando postulaciones', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: data ?? [] });
}
