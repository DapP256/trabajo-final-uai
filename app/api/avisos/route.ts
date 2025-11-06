import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  const params = request.nextUrl.searchParams;
  const empresaId = params.get('empresa_id');
  const estado = params.get('estado');

  let query = supabase
    .from('aviso')
    .select('id, titulo, descripcion, ciudad, cp, salario, tipo_jornada, requisitos, fecha_limite, horario, distancia, telefono, correo_contacto, estado, created_at, empresa_id')
    .order('created_at', { ascending: false });

  if (empresaId) {
    query = query.eq('empresa_id', empresaId);
  }
  if (estado) {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo avisos', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ avisos: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const empresaId = typeof payload.empresa_id === 'string' ? payload.empresa_id : undefined;
  const titulo = typeof payload.titulo === 'string' ? payload.titulo.trim() : undefined;

  if (!empresaId) {
    return NextResponse.json({ message: 'empresa_id es requerido' }, { status: 400 });
  }
  if (!titulo) {
    return NextResponse.json({ message: 'titulo es requerido' }, { status: 400 });
  }

  const insertPayload = {
    empresa_id: empresaId,
    titulo,
    descripcion: typeof payload.descripcion === 'string' ? payload.descripcion : null,
    ciudad: typeof payload.ciudad === 'string' ? payload.ciudad : null,
    cp: typeof payload.cp === 'string' ? payload.cp : null,
    salario: payload.salario ?? null,
    tipo_jornada: typeof payload.tipo_jornada === 'string' ? payload.tipo_jornada : null,
    requisitos: typeof payload.requisitos === 'string' ? payload.requisitos : null,
    fecha_limite: typeof payload.fecha_limite === 'string' ? payload.fecha_limite : null,
    horario: typeof payload.horario === 'string' ? payload.horario : null,
    distancia: typeof payload.distancia === 'number' ? payload.distancia : null,
    telefono: typeof payload.telefono === 'string' ? payload.telefono : null,
    correo_contacto: typeof payload.correo_contacto === 'string' ? payload.correo_contacto : null,
    estado: typeof payload.estado === 'string' ? payload.estado : undefined,
  };

  const { data, error } = await supabase
    .from('aviso')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error creando aviso', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ aviso: data }, { status: 201 });
}
