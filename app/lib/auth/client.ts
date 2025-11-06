'use client';

import { MANITO_USER_STORAGE_KEY } from '@/lib/auth/constants';

type AuthRole = 'trabajador' | 'empresa' | 'administrador';

export type AuthUser = {
  id: string;
  email: string;
  nombre?: string | null;
  apellido?: string | null;
  rol: AuthRole;
  estado: string;
};

type LoginParams = {
  email: string;
  password: string;
  remember: boolean;
};

type RegisterParams = {
  email: string;
  password: string;
  nombre: string;
  rol: AuthRole;
  aceptoTerminos: boolean;
  remember?: boolean;
  telefono?: string | null;
  cp?: string | null;
  ciudad?: string | null;
};

function storeUserLocally(user: AuthUser | null, remember: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (user && remember) {
      localStorage.setItem(MANITO_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MANITO_USER_STORAGE_KEY);
    }
    if (user) {
      sessionStorage.setItem(MANITO_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(MANITO_USER_STORAGE_KEY);
    }
  } catch (_) {
    // no-op
  }
}

function determineRedirect(user: AuthUser): string {
  switch (user.rol) {
    case 'administrador':
      return '/admin';
    case 'empresa':
      return '/DashboardEmpresa';
    case 'trabajador':
    default:
      return '/DashboardEmpleado';
  }
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  let body: unknown = null;

  if (contentType.includes('application/json') && !response.bodyUsed) {
    try {
      body = await response.clone().json();
    } catch (_) {
      try {
        body = await response.json();
      } catch (_) {
        body = null;
      }
    }
  }

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && body !== null && 'message' in body && typeof (body as any).message === 'string'
        ? (body as any).message
        : null) || 'Ocurrió un error inesperado';
    throw new Error(message);
  }

  return body;
}

export async function loginUser(params: LoginParams): Promise<{ user: AuthUser; redirect: string }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: params.email, password: params.password }),
  });

  const body = await handleResponse(response);
  const user = (body && typeof body === 'object' && body !== null && 'user' in body ? (body as any).user : null) as
    | AuthUser
    | null;
  if (!user) {
    throw new Error('Respuesta inválida del servidor');
  }
  const remember = params.remember ?? false;
  storeUserLocally(user, remember);

  return { user, redirect: determineRedirect(user) };
}

export async function registerUser(params: RegisterParams): Promise<{ user: AuthUser; redirect: string }> {
  if (!params.aceptoTerminos) {
    throw new Error('Debes aceptar los términos y condiciones');
  }

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: params.email,
      password: params.password,
      nombre: params.nombre,
      rol: params.rol,
      aceptoTerminos: params.aceptoTerminos,
      telefono: params.telefono,
      cp: params.cp,
      ciudad: params.ciudad,
    }),
  });

  const body = await handleResponse(response);
  const user = (body && typeof body === 'object' && body !== null && 'user' in body ? (body as any).user : null) as
    | AuthUser
    | null;
  if (!user) {
    throw new Error('Respuesta inválida del servidor');
  }
  const remember = params.remember ?? true;
  storeUserLocally(user, remember);

  return { user, redirect: determineRedirect(user) };
}
