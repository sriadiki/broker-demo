// lib/session.ts
//
// Signed-JWT session, replacing the raw JSON cookie that lived in /api/auth.
// On day 2, this file is REPLACED with a version that includes broker_id.
//
// Uses jose (small, fast, edge-runtime-safe, used by NextAuth).
//
// Required env: SESSION_SECRET  (>= 32 random bytes, generated with `openssl rand -base64 48`)

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export type SessionUser = {
  id: string;
  email: string;
  role: 'admin' | 'agent';
  name: string;
};

const ALG = 'HS256';
const COOKIE_NAME = 'auth-user';
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET is missing or too short (>= 32 chars required)');
  }
  return new TextEncoder().encode(s);
}

export async function signSession(user: SessionUser): Promise<string> {
  return await new SignJWT({ ...user } as JWTPayload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .setSubject(user.id)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    if (typeof payload.email !== 'string' || typeof payload.role !== 'string') return null;
    return {
      id: String(payload.sub ?? payload.id ?? ''),
      email: payload.email,
      role: payload.role as 'admin' | 'agent',
      name: String(payload.name ?? ''),
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: TTL_SECONDS,
    path: '/',
  };
}

export const SESSION_COOKIE = COOKIE_NAME;

/** Pull token from a raw Cookie header (for App Router Request objects). */
export function readSessionTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}
