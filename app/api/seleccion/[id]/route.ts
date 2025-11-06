import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { canAccessPostulacion, isAdmin } from '@/lib/auth/permissions';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const { id } = params;

  const { data, error } = await supabase
    .from('postulacion')
    .select('id, created_at, estado, trabajador_id, aviso_id, aviso:aviso(empresa_id)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo postulacion', details: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: 'Postulacion no encontrada' }, { status: 404 });
  }

  const accessPayload = { ...data, empresa_id: data.aviso?.empresa_id ?? null };

  if (!canAccessPostulacion(session, accessPayload)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  return NextResponse.json({ postulacion: data });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const { id } = params;

  const { data: existing, error: fetchError } = await supabase
    .from('postulacion')
    .select('id, trabajador_id, aviso_id, aviso:aviso(empresa_id)')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: 'Error obteniendo postulacion', details: fetchError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ message: 'Postulacion no encontrada' }, { status: 404 });
  }

  const accessPayload = { ...existing, empresa_id: existing.aviso?.empresa_id ?? null };

  if (!canAccessPostulacion(session, accessPayload)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

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
      if (field === 'estado' && !isAdmin(session) && accessPayload.empresa_id !== session.user.id) {
        continue;
      }
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const { id } = params;

  const { data: existing, error: fetchError } = await supabase
    .from('postulacion')
    .select('id, trabajador_id, aviso_id, aviso:aviso(empresa_id)')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: 'Error obteniendo postulacion', details: fetchError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ message: 'Postulacion no encontrada' }, { status: 404 });
  }

  const accessPayload = { ...existing, empresa_id: existing.aviso?.empresa_id ?? null };

  if (!canAccessPostulacion(session, accessPayload)) {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
  }

  const { error } = await supabase
    .from('postulacion')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: 'Error eliminando postulacion', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
