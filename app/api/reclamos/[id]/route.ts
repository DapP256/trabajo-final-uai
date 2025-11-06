import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { canAccessReclamo, isAdmin, isEmpresa } from '@/lib/auth/permissions';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

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

  if (!canAccessReclamo(session, data)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  return NextResponse.json({ reclamo: data });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const { id } = params;

  const { data: existing, error: fetchError } = await supabase
    .from('reclamo')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: 'Error obteniendo reclamo', details: fetchError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ message: 'Reclamo no encontrado' }, { status: 404 });
  }

  if (!canAccessReclamo(session, existing)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

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

  const updatePayload: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in payload) {
      if (field === 'estado' && !isAdmin(session) && !isEmpresa(session)) {
        continue;
      }
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const { id } = params;

  const { data: existing, error: fetchError } = await supabase
    .from('reclamo')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: 'Error obteniendo reclamo', details: fetchError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ message: 'Reclamo no encontrado' }, { status: 404 });
  }

  if (!canAccessReclamo(session, existing)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  const { error } = await supabase
    .from('reclamo')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: 'Error eliminando reclamo', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
