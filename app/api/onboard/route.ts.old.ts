import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Only attempt Supabase if env vars are present
    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (hasSupabase) {
      const { supabaseServer } = await import('@/lib/supabase');
      const db = supabaseServer();

      if (body.type === 'lead') {
        const { name, email, phone, productType, estimate } = body;
        await db.from('leads').insert({
          name, email, phone, product_type: productType,
          estimate_low: estimate?.monthlyEstimateLow,
          estimate_high: estimate?.monthlyEstimateHigh,
          status: 'new',
        });
      }

      if (body.type === 'agent') {
        const {
          firstName, lastName, email, phone, npn, licenseNumber,
          licenseState, agency, linesOfAuthority, territories, carriers,
        } = body;
        await db.from('agents').insert({
          first_name: firstName, last_name: lastName, email, phone,
          npn, license_number: licenseNumber, license_state: licenseState,
          agency_name: agency, lines_of_authority: linesOfAuthority,
          territories, carrier_appointments: carriers, status: 'pending',
        });
      }
    }

    // Always return success (demo works without Supabase)
    return NextResponse.json({ ok: true, demo: !hasSupabase });

  } catch (e: any) {
    console.error('Onboard error:', e.message);
    return NextResponse.json({ ok: true, demo: true });
  }
}
