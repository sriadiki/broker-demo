// app/api/auth/route.ts  (DAY 1 version)
//
// Replaces raw-JSON cookie with a signed JWT.
// GET returns the verified session (or { user: null }).
// POST handles login (demo if NEXT_PUBLIC_DEMO_MODE=true, else Supabase Auth) and logout.
//
// Day 2 will replace this again to add broker_id lookup and Supabase-compatible JWT minting.

import { NextResponse } from 'next/server';
import { verifyDemoLogin, getSupabaseAuth } from '@/lib/auth';
import {
  signSession,
  verifySession,
  sessionCookieOptions,
  readSessionTokenFromCookieHeader,
  SESSION_COOKIE,
  type SessionUser,
} from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password, action } = await req.json();

    if (action === 'logout') {
      const res = NextResponse.json({ ok: true });
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }

    let user: SessionUser | null = await verifyDemoLogin(email, password);

    if (!user) {
      const supabase = getSupabaseAuth();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          // Look up display name; role still derived from email for day 1 (replaced day 2)
          const { data: agent } = await supabase
            .from('agents')
            .select('first_name, last_name')
            .eq('email', email)
            .maybeSingle();

          const role: 'admin' | 'agent' = email.includes('admin') ? 'admin' : 'agent';
          const name = agent ? `${agent.first_name} ${agent.last_name}` : email.split('@')[0];

          user = { id: data.user.id, email, role, name };
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signSession(user);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Login failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const token = readSessionTokenFromCookieHeader(req.headers.get('cookie'));
  const user = await verifySession(token);
  return NextResponse.json({ user });
}
