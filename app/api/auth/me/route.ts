import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const session = requireSession(request);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('usuario')
    .select('id, email, nombre, apellido, rol, estado')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: 'Error obteniendo usuario', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data ?? session.user });
}
