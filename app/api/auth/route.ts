import { NextResponse } from 'next/server';
import { verifyDemoLogin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password, action } = await req.json();

    if (action === 'logout') {
      const res = NextResponse.json({ ok: true });
      res.cookies.delete('auth-user');
      return res;
    }

    // Try demo login first (works without Supabase)
    const demoUser = await verifyDemoLogin(email, password);
    if (demoUser) {
      const res = NextResponse.json({ ok: true, user: demoUser });
      res.cookies.set('auth-user', JSON.stringify(demoUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return res;
    }

    // Try real Supabase Auth if configured
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (hasSupabase) {
      const { getSupabaseAuth } = await import('@/lib/auth');
      const supabase = getSupabaseAuth();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          // Look up role from agents table
          const { data: agent } = await supabase
            .from('agents')
            .select('first_name, last_name, status')
            .eq('email', email)
            .single();

          const role = email.includes('admin') ? 'admin' : 'agent';
          const name = agent
            ? `${agent.first_name} ${agent.last_name}`
            : email.split('@')[0];

          const user = { id: data.user.id, email, role, name };
          const res = NextResponse.json({ ok: true, user });
          res.cookies.set('auth-user', JSON.stringify(user), {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });
          return res;
        }
      }
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(/auth-user=([^;]+)/);
  if (!match) return NextResponse.json({ user: null });
  try {
    const user = JSON.parse(decodeURIComponent(match[1]));
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
