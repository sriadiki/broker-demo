// lib/auth-guard.ts
//
// Use at the top of any protected API route to verify the session
// from the cookie. Returns either the user or a NextResponse 401/403.

import { NextResponse } from 'next/server';
import { verifySession, readSessionTokenFromCookieHeader, type SessionUser } from './session';

export type GuardResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse };

export async function requireUser(req: Request): Promise<GuardResult> {
  const token = readSessionTokenFromCookieHeader(req.headers.get('cookie'));
  const user = await verifySession(token);
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { ok: true, user };
}

export async function requireRole(req: Request, role: 'admin' | 'agent'): Promise<GuardResult> {
  const r = await requireUser(req);
  if (!r.ok) return r;
  if (r.user.role !== role) {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return r;
}
