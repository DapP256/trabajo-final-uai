import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { isAdmin, isEmpresa, isTrabajador, canAccessReclamo } from '@/lib/auth/permissions';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const estado = searchParams.get('estado');

  let query = supabase
    .from('reclamo')
    .select('id, titulo_servicio, categoria_motivo, prioridad, descripcion, created_at, estado, usuario_id, negocio_id, trabajador_id, aviso_id')
    .order('created_at', { ascending: false });

  if (isTrabajador(session)) {
    query = query.or(`usuario_id.eq.${session.user.id},trabajador_id.eq.${session.user.id}`);
  } else if (isEmpresa(session)) {
    query = query.or(`negocio_id.eq.${session.user.id},usuario_id.eq.${session.user.id}`);
  } else if (!isAdmin(session)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  if (estado) {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo reclamos', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ reclamos: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const titulo = typeof payload.titulo_servicio === 'string' ? payload.titulo_servicio.trim() : undefined;

  if (!titulo) {
    return NextResponse.json({ message: 'titulo_servicio es requerido' }, { status: 400 });
  }

  const insertPayload = {
    usuario_id: isAdmin(session) && typeof payload.usuario_id === 'string' ? payload.usuario_id : session.user.id,
    titulo_servicio: titulo,
    categoria_motivo: typeof payload.categoria_motivo === 'string' ? payload.categoria_motivo : null,
    prioridad: typeof payload.prioridad === 'string' ? payload.prioridad : null,
    descripcion: typeof payload.descripcion === 'string' ? payload.descripcion : null,
    estado: isAdmin(session) && typeof payload.estado === 'string' ? payload.estado : undefined,
    negocio_id: isEmpresa(session) ? session.user.id : isAdmin(session) && typeof payload.negocio_id === 'string' ? payload.negocio_id : null,
    trabajador_id: isTrabajador(session) ? session.user.id : typeof payload.trabajador_id === 'string' ? payload.trabajador_id : null,
    aviso_id: typeof payload.aviso_id === 'string' ? payload.aviso_id : null,
  };

  const { data, error } = await supabase
    .from('reclamo')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error creando reclamo', details: error.message }, { status: 500 });
  }

  if (!canAccessReclamo(session, data)) {
    await supabase.from('reclamo').delete().eq('id', data.id);
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  return NextResponse.json({ reclamo: data }, { status: 201 });
}
