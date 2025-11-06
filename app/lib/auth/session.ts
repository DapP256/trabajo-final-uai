import { createHmac } from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import { requireSessionSecret } from '@/lib/env';

export type SessionRole = 'trabajador' | 'empresa' | 'administrador';

export type SessionPayload = {
  token: string;
  user: {
    id: string;
    email: string;
    nombre?: string | null;
    apellido?: string | null;
    rol: SessionRole;
    estado: string;
  };
  issuedAt: string;
};

const COOKIE_NAME = 'manito_session_v1';

function signPayload(payload: SessionPayload, secret: string): string {
  const json = JSON.stringify(payload);
  const signature = createHmac('sha256', secret).update(json).digest('base64url');
  const encoded = Buffer.from(json, 'utf8').toString('base64url');
  return `${encoded}.${signature}`;
}

function verifyPayload(serialized: string, secret: string): SessionPayload | null {
  const [encoded, signature] = serialized.split('.');
  if (!encoded || !signature) return null;
  const json = Buffer.from(encoded, 'base64url').toString('utf8');
  const expected = createHmac('sha256', secret).update(json).digest('base64url');
  if (!timingSafeEqual(expected, signature)) return null;
  try {
    const parsed = JSON.parse(json) as SessionPayload;
    if (!parsed?.user?.id || !parsed?.token) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return createHmac('sha256', 'dummy').update(aBuf).digest('hex') === createHmac('sha256', 'dummy').update(bBuf).digest('hex');
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 días
  };
}

export function setSessionCookie(response: NextResponse, payload: SessionPayload) {
  const secret = requireSessionSecret();
  const value = signPayload(payload, secret);
  response.cookies.set(COOKIE_NAME, value, cookieOptions());
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', { ...cookieOptions(), maxAge: 0 });
}

export function readSession(request: NextRequest): SessionPayload | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  const secret = requireSessionSecret();
  return verifyPayload(cookie.value, secret);
}

export function requireSession(request: NextRequest): SessionPayload | null {
  const session = readSession(request);
  return session;
}

export function assertRole(session: SessionPayload | null, roles: SessionRole[]): SessionPayload | null {
  if (!session) return null;
  if (roles.includes(session.user.rol)) return session;
  if (session.user.rol === 'administrador') return session;
  return null;
}
