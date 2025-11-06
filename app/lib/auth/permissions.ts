import type { SessionPayload } from '@/lib/auth/session';

export function isAdmin(session: SessionPayload | null): boolean {
  return session?.user.rol === 'administrador';
}

export function isEmpresa(session: SessionPayload | null): boolean {
  return session?.user.rol === 'empresa';
}

export function isTrabajador(session: SessionPayload | null): boolean {
  return session?.user.rol === 'trabajador';
}

export function canAccessReclamo(session: SessionPayload | null, reclamo: { usuario_id?: string | null; trabajador_id?: string | null; negocio_id?: string | null }): boolean {
  if (!session) return false;
  if (isAdmin(session)) return true;
  if (isTrabajador(session)) {
    return reclamo.usuario_id === session.user.id || reclamo.trabajador_id === session.user.id;
  }
  if (isEmpresa(session)) {
    return reclamo.negocio_id === session.user.id || reclamo.usuario_id === session.user.id;
  }
  return false;
}

export function canManageAviso(session: SessionPayload | null, aviso: { empresa_id: string }): boolean {
  if (!session) return false;
  if (isAdmin(session)) return true;
  if (isEmpresa(session)) {
    return aviso.empresa_id === session.user.id;
  }
  return false;
}

export function canViewAviso(session: SessionPayload | null, aviso: { empresa_id: string; estado: string }): boolean {
  if (!session) return false;
  if (isAdmin(session)) return true;
  if (isEmpresa(session)) {
    return aviso.empresa_id === session.user.id;
  }
  if (isTrabajador(session)) {
    return aviso.estado === 'publicado';
  }
  return false;
}

export function canAccessPostulacion(session: SessionPayload | null, postulacion: { trabajador_id: string; empresa_id?: string }): boolean {
  if (!session) return false;
  if (isAdmin(session)) return true;
  if (isTrabajador(session)) {
    return postulacion.trabajador_id === session.user.id;
  }
  if (isEmpresa(session)) {
    return postulacion.empresa_id === session.user.id;
  }
  return false;
}
