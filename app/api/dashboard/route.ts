import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MOCK_LEADS = [
  { id: '1', name: 'Robert Chen', product_type: 'home', status: 'new', estimate_low: 142, estimate_high: 198, created_at: new Date(Date.now() - 2 * 60000).toISOString(), email: 'robert@example.com', assigned_to: 'demo-agent-1' },
  { id: '2', name: 'Priya Nair', product_type: 'auto', status: 'contacted', estimate_low: 89, estimate_high: 127, created_at: new Date(Date.now() - 60 * 60000).toISOString(), email: 'priya@example.com', assigned_to: 'demo-agent-1' },
  { id: '3', name: 'Derek Walsh', product_type: 'health', status: 'quoted', estimate_low: 412, estimate_high: 520, created_at: new Date(Date.now() - 3 * 60 * 60000).toISOString(), email: 'derek@example.com', assigned_to: 'demo-agent-2' },
  { id: '4', name: 'Angela Kim', product_type: 'home', status: 'new', estimate_low: 201, estimate_high: 264, created_at: new Date(Date.now() - 5 * 60 * 60000).toISOString(), email: 'angela@example.com', assigned_to: null },
  { id: '5', name: 'Carlos Rivera', product_type: 'auto', status: 'new', estimate_low: 112, estimate_high: 155, created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(), email: 'carlos@example.com', assigned_to: 'demo-agent-2' },
];

const MOCK_AGENTS = [
  { id: 'demo-agent-1', first_name: 'Sarah', last_name: 'Johnson', lines_of_authority: ['P&C', 'L&H'], carrier_appointments: ['State Farm', 'Allstate', 'Progressive', 'Nationwide', 'Travelers', 'Farmers', 'Liberty Mutual', 'Chubb'], status: 'approved', email: 'sarah@agency.com' },
  { id: 'demo-agent-2', first_name: 'Michael', last_name: 'Torres', lines_of_authority: ['Auto', 'Home'], carrier_appointments: ['GEICO', 'Progressive', 'Farmers', 'Allstate', 'Nationwide'], status: 'pending', email: 'michael@agency.com' },
  { id: 'demo-agent-3', first_name: 'Jennifer', last_name: 'Park', lines_of_authority: ['Health', 'Life'], carrier_appointments: ['UnitedHealthcare', 'Aetna', 'Cigna', 'BlueCross BlueShield', 'Humana', 'Anthem'], status: 'approved', email: 'jennifer@agency.com' },
];

function getAuthUser(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(/auth-user=([^;]+)/);
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); } catch { return null; }
}

export async function GET(req: Request) {
  const authUser = getAuthUser(req);
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) {
    // Filter mock data by role
    const leads = authUser?.role === 'agent'
      ? MOCK_LEADS.filter(l => l.assigned_to === authUser.id)
      : MOCK_LEADS;
    return NextResponse.json({ leads, agents: MOCK_AGENTS, source: 'mock', role: authUser?.role ?? 'admin' });
  }

  try {
    const { supabaseServer } = await import('@/lib/supabase');
    const db = supabaseServer();

    let leadsQuery = db
      .from('leads')
      .select('id, name, email, product_type, status, estimate_low, estimate_high, created_at, assigned_to')
      .order('created_at', { ascending: false })
      .limit(50);

    // Agents only see their own leads
    if (authUser?.role === 'agent') {
      leadsQuery = leadsQuery.eq('assigned_to', authUser.id);
    }

    const [leadsRes, agentsRes] = await Promise.all([
      leadsQuery,
      db.from('agents')
        .select('id, first_name, last_name, email, lines_of_authority, carrier_appointments, status')
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    return NextResponse.json({
      leads: leadsRes.data ?? [],
      agents: agentsRes.data ?? [],
      source: 'live',
      role: authUser?.role ?? 'admin',
    });
  } catch (err: any) {
    const leads = authUser?.role === 'agent'
      ? MOCK_LEADS.filter(l => l.assigned_to === authUser.id)
      : MOCK_LEADS;
    return NextResponse.json({ leads, agents: MOCK_AGENTS, source: 'mock_fallback', role: authUser?.role ?? 'admin' });
  }
}

export async function PATCH(req: Request) {
  const authUser = getAuthUser(req);
  // Only admins can update agent status; agents can update lead status
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) return NextResponse.json({ ok: true, demo: true });

  try {
    const { id, table, updates } = await req.json();
    if (table === 'agents' && authUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { supabaseServer } = await import('@/lib/supabase');
    const db = supabaseServer();
    const { error } = await db.from(table).update(updates).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
