import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { isAdmin, isEmpresa, isTrabajador, canAccessPostulacion } from '@/lib/auth/permissions';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const avisoIdParam = params.get('aviso_id');
  const estado = params.get('estado');

  let query = supabase
    .from('postulacion')
    .select('id, created_at, estado, trabajador_id, aviso_id, aviso:aviso(empresa_id)')
    .order('created_at', { ascending: false });

  if (isTrabajador(session)) {
    query = query.eq('trabajador_id', session.user.id);
  } else if (isEmpresa(session)) {
    if (!avisoIdParam) {
      return NextResponse.json({ message: 'aviso_id es requerido para empresas' }, { status: 400 });
    }
    query = query.eq('aviso_id', avisoIdParam);
  }

  if (avisoIdParam && !isTrabajador(session)) {
    query = query.eq('aviso_id', avisoIdParam);
  }
  if (estado) {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo postulaciones', details: error.message }, { status: 500 });
  }

  const transformed = (data ?? []).map((item) => ({
    ...item,
    empresa_id: item.aviso?.empresa_id ?? null,
  }));

  const filtered = transformed.filter((postulacion) => canAccessPostulacion(session, postulacion));

  return NextResponse.json({ postulaciones: filtered });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  if (!isTrabajador(session) && !isAdmin(session)) {
    return NextResponse.json({ message: 'Solo trabajadores pueden postularse' }, { status: 403 });
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const avisoId = typeof payload.aviso_id === 'string' ? payload.aviso_id : undefined;

  if (!avisoId) {
    return NextResponse.json({ message: 'aviso_id es requerido' }, { status: 400 });
  }

  const { data: aviso, error: avisoError } = await supabase
    .from('aviso')
    .select('id, empresa_id, estado')
    .eq('id', avisoId)
    .maybeSingle();

  if (avisoError) {
    return NextResponse.json({ message: 'Error verificando aviso', details: avisoError.message }, { status: 500 });
  }

  if (!aviso) {
    return NextResponse.json({ message: 'Aviso no encontrado' }, { status: 404 });
  }

  if (isTrabajador(session) && aviso.estado !== 'publicado') {
    return NextResponse.json({ message: 'Aviso no disponible para postulaciones' }, { status: 400 });
  }

  const trabajadorId = isAdmin(session) && typeof payload.trabajador_id === 'string' ? payload.trabajador_id : session.user.id;

  const { data, error } = await supabase
    .from('postulacion')
    .insert({ trabajador_id: trabajadorId, aviso_id: avisoId })
    .select('id, created_at, estado, trabajador_id, aviso_id')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error creando postulacion', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ postulacion: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  if (!isEmpresa(session) && !isAdmin(session)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

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

  const { data: current, error: fetchError } = await supabase
    .from('postulacion')
    .select('id, trabajador_id, aviso_id, aviso:aviso(empresa_id)')
    .in('id', ids);

  if (fetchError) {
    return NextResponse.json({ message: 'Error obteniendo postulaciones', details: fetchError.message }, { status: 500 });
  }

  const allowedIds = (current ?? [])
    .filter((item) => canAccessPostulacion(session, { ...item, empresa_id: item.aviso?.empresa_id ?? null }))
    .map((item) => item.id);

  if (!allowedIds.length) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('postulacion')
    .update({ estado })
    .in('id', allowedIds)
    .select('id, estado, trabajador_id, aviso_id, created_at');

  if (error) {
    return NextResponse.json({ message: 'Error actualizando postulaciones', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: data ?? [] });
}
