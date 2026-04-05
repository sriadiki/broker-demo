'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CARRIERS, LINE_LABELS, LINE_COLORS, CarrierLine } from '@/lib/carriers';
import { ExternalLink, Shield, Search, Star, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const ALL_LINES: CarrierLine[] = ['home', 'auto', 'health', 'life', 'commercial'];

// Fallback demo appointments per agent email
const DEMO_APPOINTMENTS: Record<string, string[]> = {
  'admin@clearpath.com': CARRIERS.map(c => c.name), // admin sees all
  'sarah@agency.com': ['State Farm', 'Allstate', 'Progressive', 'Nationwide', 'Travelers', 'Farmers', 'Liberty Mutual', 'Chubb'],
  'michael@agency.com': ['GEICO', 'Progressive', 'Farmers', 'Allstate', 'Nationwide'],
  'jennifer@agency.com': ['UnitedHealthcare', 'Aetna', 'Cigna', 'BlueCross BlueShield', 'Humana'],
};

function getAppointedIds(appointedNames: string[]): string[] {
  return CARRIERS
    .filter(c => appointedNames.some(name =>
      c.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(c.name.toLowerCase())
    ))
    .map(c => c.id);
}

export default function CarriersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [filterLine, setFilterLine] = useState<CarrierLine | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAppointedOnly, setShowAppointedOnly] = useState(false);
  const [appointedIds, setAppointedIds] = useState<string[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function loadAppointments() {
      setLoadingAppointments(true);
      try {
        // Try to get real appointments from Supabase via dashboard API
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        const data = await res.json();

        if (user!.role === 'admin') {
          // Admin sees all carriers as appointed
          setAppointedIds(CARRIERS.map(c => c.id));
        } else {
          // Find this agent in the agents list and use their carrier_appointments
          const agentRecord = (data.agents ?? []).find(
            (a: any) => a.email === user!.email
          );
          if (agentRecord?.carrier_appointments?.length > 0) {
            setAppointedIds(getAppointedIds(agentRecord.carrier_appointments));
          } else {
            // Fallback to demo data
            const demoNames = DEMO_APPOINTMENTS[user!.email] ?? [];
            setAppointedIds(getAppointedIds(demoNames));
          }
        }
      } catch {
        // Fallback to demo data on error
        const demoNames = DEMO_APPOINTMENTS[user!.email] ?? [];
        setAppointedIds(getAppointedIds(demoNames));
      } finally {
        setLoadingAppointments(false);
      }
    }

    loadAppointments();
  }, [user]);

  const filtered = CARRIERS.filter(c => {
    const matchesLine = filterLine === 'all' || c.lines.includes(filterLine);
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.notes.toLowerCase().includes(search.toLowerCase());
    const matchesAppointed = !showAppointedOnly || appointedIds.includes(c.id);
    return matchesLine && matchesSearch && matchesAppointed;
  });

  const appointed = CARRIERS.filter(c => appointedIds.includes(c.id));

  if (authLoading || loadingAppointments) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted">
            <Loader2 size={20} className="animate-spin text-gold" />
            <span className="text-sm">Loading your carrier appointments...</span>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <div className="section-label mb-2">Broker Network</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl font-bold text-ink">Carrier Directory</h1>
                <p className="text-slate mt-2">
                  {user?.role === 'admin'
                    ? `All ${CARRIERS.length} carriers in the network.`
                    : `You have ${appointed.length} active appointment${appointed.length !== 1 ? 's' : ''} across ${CARRIERS.length} carrier partners.`}
                </p>
              </div>
              <Link href="/onboarding" className="btn-outline text-sm py-2 self-start">
                + Add Appointment
              </Link>
            </div>
          </div>

          {/* Appointed summary strip */}
          <div className="card mb-8 bg-gold/5 border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={16} className="text-gold" />
              <span className="font-semibold text-sm text-ink">
                {user?.role === 'admin' ? 'All Network Carriers' : 'Your Active Appointments'}
              </span>
              <span className="text-xs text-muted ml-auto">{appointed.length} carriers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {appointed.map(c => (
                <a
                  key={c.id}
                  href={c.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white border border-ink/10 rounded-sm px-3 py-1.5 text-xs font-medium text-ink hover:border-gold hover:shadow-sm transition-all group"
                >
                  <span
                    className="w-5 h-5 rounded-sm flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.logo}
                  </span>
                  {c.name}
                  <ExternalLink size={10} className="text-muted group-hover:text-gold transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="input-field pl-9"
                placeholder="Search carriers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterLine('all')}
                className={`text-xs font-semibold px-3 py-2 rounded-sm border transition-colors
                  ${filterLine === 'all' ? 'bg-ink text-cream border-ink' : 'border-ink/15 text-slate hover:border-ink/30'}`}
              >
                All lines
              </button>
              {ALL_LINES.map(line => (
                <button
                  key={line}
                  onClick={() => setFilterLine(line)}
                  className={`text-xs font-semibold px-3 py-2 rounded-sm border capitalize transition-colors
                    ${filterLine === line ? 'bg-ink text-cream border-ink' : 'border-ink/15 text-slate hover:border-ink/30'}`}
                >
                  {LINE_LABELS[line]}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate whitespace-nowrap">
              <div
                onClick={() => setShowAppointedOnly(p => !p)}
                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer
                  ${showAppointedOnly ? 'bg-gold' : 'bg-ink/15'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                  ${showAppointedOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              {user?.role === 'admin' ? 'All carriers' : 'My appointments only'}
            </label>
          </div>

          <p className="text-xs text-muted mb-4">
            Showing {filtered.length} of {CARRIERS.length} carriers
          </p>

          {/* Carrier grid */}
          {filtered.length === 0 ? (
            <div className="card text-center py-16 text-muted">No carriers match your filters.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(carrier => {
                const isAppointed = appointedIds.includes(carrier.id);
                return (
                  <div
                    key={carrier.id}
                    className={`card hover:shadow-md transition-all flex flex-col
                      ${isAppointed ? 'border-gold/25' : 'opacity-75'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-sm flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: carrier.color }}
                        >
                          {carrier.logo}
                        </div>
                        <div>
                          <div className="font-semibold text-ink text-sm leading-tight">{carrier.name}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={10} className="fill-gold text-gold" />
                            <span className="text-xs text-muted">AM Best {carrier.rating}</span>
                          </div>
                        </div>
                      </div>
                      {isAppointed ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                          <Shield size={9} /> Appointed
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-ink/5 text-muted border border-ink/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          Not appointed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {carrier.lines.map(line => (
                        <span key={line} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${LINE_COLORS[line]}`}>
                          {LINE_LABELS[line]}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate leading-relaxed mb-4 flex-1">{carrier.notes}</p>

                    <div className="flex gap-2 mt-auto pt-3 border-t border-ink/5">
                      {isAppointed ? (
                        <>
                          <a href={carrier.quoteUrl} target="_blank" rel="noopener noreferrer" className="btn-gold text-xs py-2 flex-1 justify-center">
                            Start Quote <ExternalLink size={11} />
                          </a>
                          <a href={carrier.portalUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-2 px-3 justify-center" title="Agent portal">
                            Portal <ExternalLink size={11} />
                          </a>
                        </>
                      ) : (
                        <Link href="/onboarding" className="btn-outline text-xs py-2 flex-1 justify-center">
                          Apply for Appointment <ChevronRight size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
