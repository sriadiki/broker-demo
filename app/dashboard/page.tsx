'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Users, FileText, TrendingUp, Home, Car, Heart,
  RefreshCw, CheckCircle2, Loader2,
  ChevronDown, Wifi, WifiOff, Shield, ChevronRight,
} from 'lucide-react';

type Lead = {
  id: string; name: string; email: string; product_type: string;
  status: string; estimate_low: number; estimate_high: number;
  created_at: string; assigned_to?: string;
};
type Agent = {
  id: string; first_name: string; last_name: string; email: string;
  lines_of_authority: string[]; carrier_appointments: string[]; status: string;
};
type DashData = { leads: Lead[]; agents: Agent[]; source: string; role: string };

const productIcon: Record<string, typeof Home> = { home: Home, auto: Car, health: Heart };

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-amber-50 text-amber-700 border border-amber-200',
  contacted: 'bg-blue-50 text-blue-700 border border-blue-200',
  quoted:    'bg-purple-50 text-purple-700 border border-purple-200',
  closed:    'bg-green-50 text-green-700 border border-green-200',
  approved:  'bg-green-50 text-green-700 border border-green-200',
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
};

const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'closed'];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'agents'>('leads');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  async function updateLeadStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table: 'leads', updates: { status } }),
      });
      setData(prev => prev ? {
        ...prev,
        leads: prev.leads.map(l => l.id === id ? { ...l, status } : l),
      } : prev);
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateAgentStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table: 'agents', updates: { status } }),
      });
      setData(prev => prev ? {
        ...prev,
        agents: prev.agents.map(a => a.id === id ? { ...a, status } : a),
      } : prev);
    } finally {
      setUpdatingId(null);
    }
  }

  const leads = data?.leads ?? [];
  const agents = data?.agents ?? [];
  const filteredLeads = filterStatus === 'all' ? leads : leads.filter(l => l.status === filterStatus);
  const isLive = data?.source === 'live';

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: FileText, sub: `${leads.filter(l => l.status === 'new').length} new` },
    { label: 'Active Agents', value: agents.filter(a => a.status === 'approved').length, icon: Users, sub: `${agents.filter(a => a.status === 'pending').length} pending` },
    { label: 'Quotes Sent', value: leads.filter(l => ['quoted', 'closed'].includes(l.status)).length, icon: TrendingUp, sub: 'This month' },
    { label: 'Conversion', value: leads.length ? `${Math.round(leads.filter(l => l.status === 'closed').length / leads.length * 100)}%` : '—', icon: CheckCircle2, sub: 'Closed rate' },
  ];

  if (authLoading || loading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted">
            <Loader2 size={20} className="animate-spin text-gold" />
            <span className="text-sm">Loading dashboard...</span>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 bg-cream/50">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="section-label mb-1">
                {user.role === 'admin' ? 'Broker Admin' : 'Agent Portal'}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-ink">
                  Welcome, {user.name.split(' ')[0]}
                </h1>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border
                  ${isLive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {isLive ? <Wifi size={11} /> : <WifiOff size={11} />}
                  {isLive ? 'Live data' : 'Demo data'}
                </span>
                {user.role === 'agent' && (
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                    Showing your leads only
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="btn-outline text-sm py-2 gap-2"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              <Link href="/onboarding" className="btn-gold text-sm py-2">
                + Onboard Agent
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <Link href="/carriers" className="card flex items-center gap-3 hover:shadow-md transition-shadow group flex-1 min-w-[200px]">
              <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                <Shield size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink">Carrier Directory</div>
                <div className="text-xs text-muted">14 carriers · 6 appointed</div>
              </div>
              <ChevronRight size={14} className="text-muted ml-auto group-hover:text-gold transition-colors" />
            </Link>
            <Link href="/quote" className="card flex items-center gap-3 hover:shadow-md transition-shadow group flex-1 min-w-[200px]">
              <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                <FileText size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink">New Quote</div>
                <div className="text-xs text-muted">Home, auto, or health</div>
              </div>
              <ChevronRight size={14} className="text-muted ml-auto group-hover:text-gold transition-colors" />
            </Link>
            <Link href="/onboarding" className="card flex items-center gap-3 hover:shadow-md transition-shadow group flex-1 min-w-[200px]">
              <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                <Users size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink">Onboard Agent</div>
                <div className="text-xs text-muted">Add to your network</div>
              </div>
              <ChevronRight size={14} className="text-muted ml-auto group-hover:text-gold transition-colors" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, sub }) => (
              <div key={label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted uppercase tracking-wider">{label}</span>
                  <Icon size={15} className="text-gold" />
                </div>
                <div className="font-display text-3xl font-bold text-ink">{value}</div>
                <div className="text-xs text-muted mt-1">{sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-ink/10 mb-6 gap-6">
            {(['leads', 'agents'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize tracking-wide transition-colors border-b-2 -mb-px
                  ${activeTab === tab ? 'border-gold text-ink' : 'border-transparent text-muted hover:text-ink'}`}
              >
                {tab} ({tab === 'leads' ? leads.length : agents.length})
              </button>
            ))}
          </div>

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div>
              {/* Filter bar */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {['all', ...LEAD_STATUSES].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-colors
                      ${filterStatus === s ? 'bg-ink text-cream border-ink' : 'border-ink/15 text-slate hover:border-ink/30'}`}
                  >
                    {s === 'all' ? `All (${leads.length})` : `${s} (${leads.filter(l => l.status === s).length})`}
                  </button>
                ))}
              </div>

              <div className="card p-0 overflow-hidden">
                {filteredLeads.length === 0 ? (
                  <div className="py-16 text-center text-muted text-sm">
                    No leads yet. <Link href="/quote" className="text-gold hover:underline">Submit a test quote</Link> to see it here.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/5 bg-ink/2">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Lead</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Product</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Estimate</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead, i) => {
                        const Icon = productIcon[lead.product_type] ?? FileText;
                        return (
                          <tr key={lead.id} className={`border-b border-ink/5 last:border-0 hover:bg-gold/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/30'}`}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Icon size={13} className="text-gold" />
                                </div>
                                <div>
                                  <div className="font-medium text-ink">{lead.name}</div>
                                  <div className="text-xs text-muted">{lead.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell">
                              <span className="capitalize text-slate">{lead.product_type}</span>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell text-slate">
                              {lead.estimate_low && lead.estimate_high
                                ? `$${lead.estimate_low}–$${lead.estimate_high}/mo`
                                : '—'}
                            </td>
                            <td className="px-5 py-4">
                              <div className="relative inline-block">
                                <select
                                  value={lead.status}
                                  disabled={updatingId === lead.id}
                                  onChange={e => updateLeadStatus(lead.id, e.target.value)}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer
                                    focus:outline-none transition-colors ${STATUS_STYLES[lead.status] ?? STATUS_STYLES.new}`}
                                >
                                  {LEAD_STATUSES.map(s => (
                                    <option key={s} value={s} className="bg-white text-ink capitalize">{s}</option>
                                  ))}
                                </select>
                                {updatingId === lead.id
                                  ? <Loader2 size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin" />
                                  : <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                }
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell text-xs text-muted">
                              {timeAgo(lead.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* AGENTS TAB */}
          {activeTab === 'agents' && (
            <div>
              <div className="card p-0 overflow-hidden">
                {agents.length === 0 ? (
                  <div className="py-16 text-center text-muted text-sm">
                    No agents yet. <Link href="/onboarding" className="text-gold hover:underline">Onboard an agent</Link> to see them here.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/5">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Agent</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Lines</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Carriers</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent, i) => (
                        <tr key={agent.id} className={`border-b border-ink/5 last:border-0 hover:bg-gold/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/30'}`}>
                          <td className="px-5 py-4">
                            <div className="font-medium text-ink">{agent.first_name} {agent.last_name}</div>
                            <div className="text-xs text-muted">{agent.email}</div>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {(agent.lines_of_authority ?? []).slice(0, 3).map(l => (
                                <span key={l} className="text-xs bg-ink/5 text-slate px-2 py-0.5 rounded-full">{l}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell text-slate">
                            {(agent.carrier_appointments ?? []).length} carriers
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative inline-block">
                              <select
                                value={agent.status}
                                disabled={updatingId === agent.id}
                                onChange={e => updateAgentStatus(agent.id, e.target.value)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer
                                  focus:outline-none transition-colors ${STATUS_STYLES[agent.status] ?? STATUS_STYLES.pending}`}
                              >
                                {['pending', 'approved', 'rejected'].map(s => (
                                  <option key={s} value={s} className="bg-white text-ink capitalize">{s}</option>
                                ))}
                              </select>
                              {updatingId === agent.id
                                ? <Loader2 size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin" />
                                : <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              }
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="mt-4 text-right">
                <Link href="/onboarding" className="btn-gold text-sm py-2">+ Onboard New Agent</Link>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
