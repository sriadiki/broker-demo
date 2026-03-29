import OpenAI from 'openai';
import { Resend } from 'resend';

const PRODUCT_LABELS: Record<string, string> = {
  home: 'home insurance',
  auto: 'auto insurance',
  health: 'health insurance',
};

export interface LeadEmailData {
  name: string;
  email: string;
  productType: string;
  estimateLow?: number;
  estimateHigh?: number;
}

export async function draftLeadEmail(lead: LeadEmailData): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const product = PRODUCT_LABELS[lead.productType] ?? lead.productType;
  const estimateRange =
    lead.estimateLow && lead.estimateHigh
      ? `$${lead.estimateLow}–$${lead.estimateHigh}/month`
      : 'a range based on your details';

  const prompt = `You are a friendly, professional independent insurance broker writing a first-response email to a new lead.

Lead details:
- Name: ${lead.name}
- Product interest: ${product}
- Estimated range: ${estimateRange}

Write a warm, concise first-response email (under 180 words). 
- Address them by first name only
- Reference their product interest and estimated range naturally
- Explain that this is an estimate and a licensed agent will follow up within 1 business day with accurate carrier quotes
- Sign off as "The ClearPath Insurance Team"
- Do NOT use salesy language or excessive exclamation marks
- Plain text only, no markdown, no subject line`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}

export async function sendLeadEmail(lead: LeadEmailData): Promise<boolean> {
  const hasResend = process.env.RESEND_API_KEY;
  const hasOpenAI = process.env.OPENAI_API_KEY;

  if (!hasResend || !hasOpenAI) {
    console.log('[email] Skipping — RESEND_API_KEY or OPENAI_API_KEY not set');
    return false;
  }

  try {
    const body = await draftLeadEmail(lead);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const product = PRODUCT_LABELS[lead.productType] ?? lead.productType;
    const firstName = lead.name.split(' ')[0];

    await resend.emails.send({
      from: 'ClearPath Insurance <hello@clearpath-insurance.com>',
      to: lead.email,
      subject: `Your ${product} estimate, ${firstName}`,
      text: body,
      html: `
        <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #0f0e0c;">
          <div style="border-bottom: 2px solid #c9a84c; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: bold;">ClearPath <span style="color: #c9a84c;">Insurance</span></span>
          </div>
          <div style="font-size: 15px; line-height: 1.8; white-space: pre-line;">${body}</div>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e0d8; font-size: 12px; color: #8a8a7a;">
            This is an estimated range only and is not a binding quote. Final pricing is subject to full underwriting and carrier approval.
          </div>
        </div>
      `,
    });

    console.log(`[email] Sent to ${lead.email}`);
    return true;
  } catch (err) {
    console.error('[email] Failed to send:', err);
    return false;
  }
}
