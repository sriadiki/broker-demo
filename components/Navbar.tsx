'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink">
          ClearPath <span className="text-gold">Insurance</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
          <Link href="/#services" className="hover:text-ink transition-colors">Services</Link>
          <Link href="/#about" className="hover:text-ink transition-colors">About</Link>
          <Link href="/carriers" className="hover:text-ink transition-colors">Carriers</Link>
          <Link href="/onboarding" className="hover:text-ink transition-colors">Agent Portal</Link>
          <Link href="/quote" className="btn-gold py-2 px-5">Get a Quote</Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-cream border-t border-ink/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/#services" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/carriers" onClick={() => setOpen(false)}>Carriers</Link>
          <Link href="/onboarding" onClick={() => setOpen(false)}>Agent Portal</Link>
          <Link href="/quote" onClick={() => setOpen(false)} className="btn-gold text-center">Get a Quote</Link>
        </div>
      )}
    </header>
  );
}
