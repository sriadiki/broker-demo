import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (body.type === 'lead') {
      const { name, email, phone, productType, estimate } = body;

      // 1. Save lead to Supabase
      if (hasSupabase) {
        const { supabaseServer } = await import('@/lib/supabase');
        const db = supabaseServer();
        await db.from('leads').insert({
          name,
          email,
          phone,
          product_type: productType,
          estimate_low: estimate?.monthlyEstimateLow,
          estimate_high: estimate?.monthlyEstimateHigh,
          status: 'new',
        });
      }

      // 2. Send AI-drafted first-response email (non-blocking)
      const { sendLeadEmail } = await import('@/lib/email');
      sendLeadEmail({
        name,
        email,
        productType,
        estimateLow: estimate?.monthlyEstimateLow,
        estimateHigh: estimate?.monthlyEstimateHigh,
      }).catch(err => console.error('[email] background error:', err));

      return NextResponse.json({ ok: true, demo: !hasSupabase });
    }

    if (body.type === 'agent') {
      const {
        firstName, lastName, email, phone, npn, licenseNumber,
        licenseState, agency, linesOfAuthority, territories, carriers,
      } = body;

      if (hasSupabase) {
        const { supabaseServer } = await import('@/lib/supabase');
        const db = supabaseServer();
        await db.from('agents').insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          npn,
          license_number: licenseNumber,
          license_state: licenseState,
          agency_name: agency,
          lines_of_authority: linesOfAuthority,
          territories,
          carrier_appointments: carriers,
          status: 'pending',
        });
      }

      return NextResponse.json({ ok: true, demo: !hasSupabase });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });

  } catch (e: any) {
    console.error('Onboard error:', e.message);
    return NextResponse.json({ ok: true, demo: true });
  }
}
