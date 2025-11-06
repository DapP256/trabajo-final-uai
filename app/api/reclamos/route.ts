import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const searchParams = request.nextUrl.searchParams;
  const usuarioId = searchParams.get('usuario_id');
  const estado = searchParams.get('estado');

  let query = supabase
    .from('reclamo')
    .select('id, titulo_servicio, categoria_motivo, prioridad, descripcion, created_at, estado, usuario_id, negocio_id, trabajador_id, aviso_id')
    .order('created_at', { ascending: false });

  if (usuarioId) {
    query = query.eq('usuario_id', usuarioId);
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
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const usuarioId = typeof payload.usuario_id === 'string' ? payload.usuario_id : undefined;
  const titulo = typeof payload.titulo_servicio === 'string' ? payload.titulo_servicio.trim() : undefined;

  if (!usuarioId) {
    return NextResponse.json({ message: 'usuario_id es requerido' }, { status: 400 });
  }
  if (!titulo) {
    return NextResponse.json({ message: 'titulo_servicio es requerido' }, { status: 400 });
  }

  const insertPayload = {
    usuario_id: usuarioId,
    titulo_servicio: titulo,
    categoria_motivo: typeof payload.categoria_motivo === 'string' ? payload.categoria_motivo : null,
    prioridad: typeof payload.prioridad === 'string' ? payload.prioridad : null,
    descripcion: typeof payload.descripcion === 'string' ? payload.descripcion : null,
    estado: typeof payload.estado === 'string' ? payload.estado : undefined,
    negocio_id: typeof payload.negocio_id === 'string' ? payload.negocio_id : null,
    trabajador_id: typeof payload.trabajador_id === 'string' ? payload.trabajador_id : null,
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

  return NextResponse.json({ reclamo: data }, { status: 201 });
}
