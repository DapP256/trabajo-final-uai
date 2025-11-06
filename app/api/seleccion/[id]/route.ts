import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const { id } = params;

  const { data, error } = await supabase
    .from('postulacion')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo postulacion', details: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: 'Postulacion no encontrada' }, { status: 404 });
  }

  return NextResponse.json({ postulacion: data });
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

  const allowedFields = ['estado'];
  const updatePayload: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in payload) {
      updatePayload[field] = payload[field as keyof typeof payload];
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ message: 'No hay campos para actualizar' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('postulacion')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ message: 'Error actualizando postulacion', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ postulacion: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const { id } = params;

  const { error } = await supabase
    .from('postulacion')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: 'Error eliminando postulacion', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
