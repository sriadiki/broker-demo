'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const err = await login(email, password);
    if (err) { setError(err); setSubmitting(false); }
    else router.replace('/dashboard');
  }

  function fillDemo(role: 'admin' | 'agent') {
    setEmail(role === 'admin' ? 'admin@clearpath.com' : 'sarah@agency.com');
    setPassword('demo1234');
    setError('');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display text-2xl font-bold text-ink mb-1">
            ClearPath <span className="text-gold">Insurance</span>
          </div>
          <p className="text-sm text-muted">Agent & Broker Portal</p>
        </div>

        <div className="card shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-gold" />
            <h1 className="font-display text-xl font-semibold">Sign in to your account</h1>
          </div>

          {/* Demo credentials */}
          <div className="bg-gold/5 border border-gold/20 rounded-sm p-4 mb-6">
            <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">Demo credentials</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemo('admin')}
                className="flex-1 text-xs border border-ink/15 rounded-sm py-1.5 px-2 hover:border-gold hover:bg-gold/5 transition-colors font-medium"
              >
                Broker Admin
              </button>
              <button
                onClick={() => fillDemo('agent')}
                className="flex-1 text-xs border border-ink/15 rounded-sm py-1.5 px-2 hover:border-gold hover:bg-gold/5 transition-colors font-medium"
              >
                Agent (Sarah)
              </button>
            </div>
            <p className="text-xs text-muted mt-2">Password: <code className="bg-ink/5 px-1 rounded">demo1234</code></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@agency.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full justify-center mt-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Not an agent yet?{' '}
          <a href="/onboarding" className="text-gold hover:underline font-medium">Apply to join</a>
        </p>
      </div>
    </main>
  );
}
