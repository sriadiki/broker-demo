'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink">
          ClearPath <span className="text-gold">Insurance</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
          <Link href="/#services" className="hover:text-ink transition-colors">Services</Link>
          <Link href="/carriers" className="hover:text-ink transition-colors">Carriers</Link>
          <Link href="/#about" className="hover:text-ink transition-colors">About</Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-ink transition-colors">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(p => !p)}
                  className="flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-ink text-sm font-medium px-3 py-1.5 rounded-sm hover:bg-gold/20 transition-colors"
                >
                  <span className="w-5 h-5 bg-gold rounded-full flex items-center justify-center text-ink text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </span>
                  {user.name.split(' ')[0]}
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-ink/10 rounded-sm shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-ink/5">
                      <div className="text-xs font-semibold text-ink">{user.name}</div>
                      <div className="text-xs text-muted capitalize">{user.role}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate hover:bg-gold/5 hover:text-ink transition-colors"
                    >
                      <LayoutDashboard size={13} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={13} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:text-ink transition-colors">Sign in</Link>
              <Link href="/quote" className="btn-gold py-2 px-5">Get a Quote</Link>
            </div>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-ink/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/#services" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/carriers" onClick={() => setOpen(false)}>Carriers</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-red-600">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
              <Link href="/quote" onClick={() => setOpen(false)} className="btn-gold text-center">Get a Quote</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
