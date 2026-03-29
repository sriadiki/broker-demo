import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MOCK_DATA = {
  leads: [
    { id: '1', name: 'Robert Chen', product_type: 'home', status: 'new', estimate_low: 142, estimate_high: 198, created_at: new Date(Date.now() - 2 * 60000).toISOString(), email: 'robert@example.com' },
    { id: '2', name: 'Priya Nair', product_type: 'auto', status: 'contacted', estimate_low: 89, estimate_high: 127, created_at: new Date(Date.now() - 60 * 60000).toISOString(), email: 'priya@example.com' },
    { id: '3', name: 'Derek Walsh', product_type: 'health', status: 'quoted', estimate_low: 412, estimate_high: 520, created_at: new Date(Date.now() - 3 * 60 * 60000).toISOString(), email: 'derek@example.com' },
    { id: '4', name: 'Angela Kim', product_type: 'home', status: 'new', estimate_low: 201, estimate_high: 264, created_at: new Date(Date.now() - 5 * 60 * 60000).toISOString(), email: 'angela@example.com' },
    { id: '5', name: 'Carlos Rivera', product_type: 'auto', status: 'new', estimate_low: 112, estimate_high: 155, created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(), email: 'carlos@example.com' },
  ],
  agents: [
    { id: '1', first_name: 'Sarah', last_name: 'Johnson', lines_of_authority: ['P&C', 'L&H'], carrier_appointments: ['State Farm', 'Allstate', 'Progressive', 'Nationwide', 'Travelers', 'Farmers', 'Liberty Mutual', 'Chubb'], status: 'approved', email: 'sarah@agency.com' },
    { id: '2', first_name: 'Michael', last_name: 'Torres', lines_of_authority: ['Auto', 'Home'], carrier_appointments: ['GEICO', 'Progressive', 'Farmers', 'Allstate', 'Nationwide'], status: 'pending', email: 'michael@agency.com' },
    { id: '3', first_name: 'Jennifer', last_name: 'Park', lines_of_authority: ['Health', 'Life'], carrier_appointments: ['UnitedHealthcare', 'Aetna', 'Cigna', 'BlueCross BlueShield', 'Humana', 'Anthem'], status: 'approved', email: 'jennifer@agency.com' },
  ],
};

export async function GET() {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) {
    return NextResponse.json({ ...MOCK_DATA, source: 'mock' });
  }

  try {
    const { supabaseServer } = await import('@/lib/supabase');
    const db = supabaseServer();

    const [leadsRes, agentsRes] = await Promise.all([
      db
        .from('leads')
        .select('id, name, email, product_type, status, estimate_low, estimate_high, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      db
        .from('agents')
        .select('id, first_name, last_name, email, lines_of_authority, carrier_appointments, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      leads: leadsRes.data ?? [],
      agents: agentsRes.data ?? [],
      source: 'live',
    });
  } catch (err: any) {
    console.error('Dashboard fetch error:', err.message);
    return NextResponse.json({ ...MOCK_DATA, source: 'mock_fallback' });
  }
}

export async function PATCH(req: Request) {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const { id, table, updates } = await req.json();
    const { supabaseServer } = await import('@/lib/supabase');
    const db = supabaseServer();
    const { error } = await db.from(table).update(updates).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
