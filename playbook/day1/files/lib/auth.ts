// lib/auth.ts
//
// Day 1 changes:
// - DEMO_USERS is gated by NEXT_PUBLIC_DEMO_MODE (only available when explicitly enabled).
// - verifyDemoLogin returns null in production unless demo mode is on.
// - Re-export of SessionUser type so consumers have one source of truth.

import { createClient } from '@supabase/supabase-js';
import type { SessionUser } from './session';

export type AuthUser = SessionUser; // legacy alias kept for client components
export type UserRole = SessionUser['role'] | null;

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const RAW_DEMO_USERS = [
  { id: 'demo-admin',    email: 'admin@clearpath.com', password: 'demo1234', role: 'admin' as const, name: 'Broker Admin' },
  { id: 'demo-agent-1',  email: 'sarah@agency.com',    password: 'demo1234', role: 'agent' as const, name: 'Sarah Johnson' },
  { id: 'demo-agent-2',  email: 'michael@agency.com',  password: 'demo1234', role: 'agent' as const, name: 'Michael Torres' },
];

export const DEMO_USERS = DEMO_MODE ? RAW_DEMO_USERS : [];

export function getSupabaseAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function verifyDemoLogin(email: string, password: string): Promise<SessionUser | null> {
  if (!DEMO_MODE) return null;
  const user = RAW_DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role, name: user.name };
}
