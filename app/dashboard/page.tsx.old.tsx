import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Users, FileText, Home, Car, Heart, TrendingUp } from 'lucide-react';

const mockLeads = [
  { name: 'Robert Chen', product: 'home', status: 'new', estimate: '$142–$198/mo', time: '2 min ago' },
  { name: 'Priya Nair', product: 'auto', status: 'contacted', estimate: '$89–$127/mo', time: '1 hr ago' },
  { name: 'Derek Walsh', product: 'health', status: 'quoted', estimate: '$412–$520/mo', time: '3 hr ago' },
  { name: 'Angela Kim', product: 'home', status: 'new', estimate: '$201–$264/mo', time: '5 hr ago' },
];

const mockAgents = [
  { name: 'Sarah Johnson', lines: 'P&C, L&H', carriers: 8, status: 'approved' },
  { name: 'Michael Torres', lines: 'Auto, Home', carriers: 5, status: 'pending' },
  { name: 'Jennifer Park', lines: 'Health, Life', carriers: 6, status: 'approved' },
];

const productIcon = { home: Home, auto: Car, health: Heart };
const statusColors: Record<string, string> = {
  new: 'bg-gold/15 text-gold-800',
  contacted: 'bg-blue-50 text-blue-700',
  quoted: 'bg-green-50 text-green-700',
  approved: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 bg-cream/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="section-label mb-1">Broker Portal</div>
              <h1 className="font-display text-3xl font-bold text-ink">Dashboard</h1>
            </div>
            <Link href="/onboarding" className="btn-outline text-sm py-2">+ Onboard Agent</Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Leads', value: '24', icon: FileText, delta: '+4 today' },
              { label: 'Active Agents', value: '3', icon: Users, delta: '1 pending' },
              { label: 'Quotes Sent', value: '18', icon: TrendingUp, delta: 'This month' },
              { label: 'Conversions', value: '11', icon: TrendingUp, delta: '61% rate' },
            ].map(({ label, value, icon: Icon, delta }) => (
              <div key={label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted">{label}</span>
                  <Icon size={16} className="text-gold" />
                </div>
                <div className="font-display text-3xl font-bold text-ink">{value}</div>
                <div className="text-xs text-muted mt-1">{delta}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="md:col-span-2 card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold">Recent Leads</h2>
                <span className="text-xs text-gold font-semibold">Live demo data</span>
              </div>
              <div className="space-y-3">
                {mockLeads.map(({ name, product, status, estimate, time }) => {
                  const Icon = productIcon[product as keyof typeof productIcon];
                  return (
                    <div key={name} className="flex items-center gap-4 py-3 border-b border-ink/5 last:border-0">
                      <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-ink text-sm">{name}</div>
                        <div className="text-xs text-muted">{estimate} · {time}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[status]}`}>
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agents */}
            <div className="card">
              <h2 className="font-display text-lg font-semibold mb-5">Agents</h2>
              <div className="space-y-4">
                {mockAgents.map(({ name, lines, carriers, status }) => (
                  <div key={name} className="flex flex-col gap-1 py-3 border-b border-ink/5 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-ink">{name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[status]}`}>
                        {status}
                      </span>
                    </div>
                    <div className="text-xs text-muted">{lines} · {carriers} carriers</div>
                  </div>
                ))}
                <Link href="/onboarding" className="text-gold text-xs font-semibold hover:underline mt-2 block">
                  + Add new agent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
