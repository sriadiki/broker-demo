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

// In-memory store for demo assignments (persists during session)
const demoAssignments: Record<string, string | null> = {
  '1': 'demo-agent-1',
  '2': 'demo-agent-1',
  '3': 'demo-agent-2',
  '4': null,
  '5': 'demo-agent-2',
};

const demoStatuses: Record<string, string> = {
  '1': 'new', '2': 'contacted', '3': 'quoted', '4': 'new', '5': 'new',
};

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
    // Apply in-memory demo mutations
    const leads = MOCK_LEADS.map(l => ({
      ...l,
      assigned_to: demoAssignments[l.id] ?? l.assigned_to,
      status: demoStatuses[l.id] ?? l.status,
    }));
    // Default to showing all leads if no auth cookie (avoids empty state)
    const filtered = authUser?.role === 'agent'
      ? leads.filter(l => l.assigned_to === authUser.id)
      : leads;
    const role = authUser?.role ?? 'admin';
    return NextResponse.json({ leads: filtered, agents: MOCK_AGENTS, source: 'mock', role });
  }

  try {
    const { supabaseServer } = await import('@/lib/supabase');
    const db = supabaseServer();

    let leadsQuery = db
      .from('leads')
      .select('id, name, email, product_type, status, estimate_low, estimate_high, created_at, assigned_to')
      .order('created_at', { ascending: false })
      .limit(50);

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
    const leads = MOCK_LEADS.map(l => ({
      ...l,
      assigned_to: demoAssignments[l.id] ?? l.assigned_to,
      status: demoStatuses[l.id] ?? l.status,
    }));
    const filtered = authUser?.role === 'agent'
      ? leads.filter(l => l.assigned_to === authUser.id)
      : leads;
    return NextResponse.json({ leads: filtered, agents: MOCK_AGENTS, source: 'mock_fallback', role: authUser?.role ?? 'admin' });
  }
}

export async function PATCH(req: Request) {
  const authUser = getAuthUser(req);
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const { id, table, updates } = await req.json();

    // Permission checks
    if (table === 'agents' && authUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (updates.assigned_to !== undefined && authUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can assign leads' }, { status: 403 });
    }

    if (!hasSupabase) {
      // Apply to in-memory demo store
      if (table === 'leads') {
        if (updates.assigned_to !== undefined) demoAssignments[id] = updates.assigned_to;
        if (updates.status !== undefined) demoStatuses[id] = updates.status;
      }
      return NextResponse.json({ ok: true, demo: true });
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
