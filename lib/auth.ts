import { createClient } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'agent' | null;

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

// Demo users for when Supabase Auth is not configured
export const DEMO_USERS = [
  { id: 'demo-admin', email: 'admin@clearpath.com', password: 'demo1234', role: 'admin' as UserRole, name: 'Broker Admin' },
  { id: 'demo-agent-1', email: 'sarah@agency.com', password: 'demo1234', role: 'agent' as UserRole, name: 'Sarah Johnson' },
  { id: 'demo-agent-2', email: 'michael@agency.com', password: 'demo1234', role: 'agent' as UserRole, name: 'Michael Torres' },
];

export function getSupabaseAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function verifyDemoLogin(email: string, password: string): Promise<AuthUser | null> {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role, name: user.name };
}
