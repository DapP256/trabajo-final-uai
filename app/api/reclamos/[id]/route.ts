import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const { id } = params;

  const { data, error } = await supabase
    .from('reclamo')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo reclamo', details: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: 'Reclamo no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ reclamo: data });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const { id } = params;

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};
  const allowedFields = [
    'titulo_servicio',
    'categoria_motivo',
    'prioridad',
    'descripcion',
    'estado',
    'negocio_id',
    'trabajador_id',
    'aviso_id',
  ];

  for (const field of allowedFields) {
    if (field in payload) {
      updatePayload[field] = payload[field as keyof typeof payload];
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ message: 'No hay campos para actualizar' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reclamo')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error actualizando reclamo', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ reclamo: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const { id } = params;

  const { error } = await supabase
    .from('reclamo')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: 'Error eliminando reclamo', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
