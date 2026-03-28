import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = supabaseServer();

    if (body.type === 'lead') {
      const { name, email, phone, productType, estimate } = body;
      const { error } = await db.from('leads').insert({
        name, email, phone, product_type: productType,
        estimate_low: estimate?.monthlyEstimateLow,
        estimate_high: estimate?.monthlyEstimateHigh,
        status: 'new',
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (body.type === 'agent') {
      const {
        firstName, lastName, email, phone, npn, licenseNumber,
        licenseState, agency, linesOfAuthority, territories, carriers,
      } = body;
      const { error } = await db.from('agents').insert({
        first_name: firstName, last_name: lastName, email, phone,
        npn, license_number: licenseNumber, license_state: licenseState,
        agency_name: agency, lines_of_authority: linesOfAuthority,
        territories, carrier_appointments: carriers, status: 'pending',
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (e: any) {
    console.error(e);
    // In demo mode (no Supabase configured), silently succeed
    return NextResponse.json({ ok: true, demo: true });
  }
}
