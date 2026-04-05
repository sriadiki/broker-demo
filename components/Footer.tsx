import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/60 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-lg font-bold text-cream mb-3">
            ClearPath <span className="text-gold">Insurance</span>
          </div>
          <p className="leading-relaxed">Independent insurance brokerage serving Texas and beyond.</p>
        </div>
        <div>
          <div className="font-semibold text-cream mb-3 uppercase tracking-wider text-xs">Products</div>
          <ul className="space-y-2">
            <li><Link href="/quote?type=home" className="hover:text-cream transition-colors">Home Insurance</Link></li>
            <li><Link href="/quote?type=auto" className="hover:text-cream transition-colors">Auto Insurance</Link></li>
            <li><Link href="/quote?type=health" className="hover:text-cream transition-colors">Health Insurance</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-cream mb-3 uppercase tracking-wider text-xs">Cities</div>
          <ul className="space-y-2">
            <li><Link href="/insurance/frisco-tx" className="hover:text-cream transition-colors">Frisco, TX</Link></li>
            <li><Link href="/insurance/mckinney-tx" className="hover:text-cream transition-colors">McKinney, TX</Link></li>
            <li><Link href="/insurance/plano-tx" className="hover:text-cream transition-colors">Plano, TX</Link></li>
            <li><Link href="/insurance" className="hover:text-cream transition-colors">All cities →</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-cream mb-3 uppercase tracking-wider text-xs">Agents</div>
          <ul className="space-y-2">
            <li><Link href="/onboarding" className="hover:text-cream transition-colors">Join as Agent</Link></li>
            <li><Link href="/carriers" className="hover:text-cream transition-colors">Carrier Directory</Link></li>
            <li><Link href="/login" className="hover:text-cream transition-colors">Agent Login</Link></li>
            <li><Link href="/dashboard" className="hover:text-cream transition-colors">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 py-4 max-w-6xl mx-auto text-xs text-cream/30">
        © {new Date().getFullYear()} ClearPath Insurance. All quotes are estimates only and not binding offers.
      </div>
    </footer>
  );
}
