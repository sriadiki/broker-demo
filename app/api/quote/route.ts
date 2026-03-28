import { NextResponse } from 'next/server';
import { estimateQuote, QuoteInput } from '@/lib/quote-engine';

export async function POST(req: Request) {
  try {
    const body: QuoteInput = await req.json();
    const result = estimateQuote(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to estimate quote' }, { status: 500 });
  }
}
