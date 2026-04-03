'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CARRIERS, LINE_LABELS, LINE_COLORS, CarrierLine } from '@/lib/carriers';
import { ExternalLink, Shield, Search, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ALL_LINES: CarrierLine[] = ['home', 'auto', 'health', 'life', 'commercial'];

// Simulated appointed carriers for demo — in production this comes from the agent's profile
const DEMO_APPOINTED = ['state-farm', 'progressive', 'travelers', 'unitedhealthcare', 'aetna', 'bcbs'];

export default function CarriersPage() {
  const [filterLine, setFilterLine] = useState<CarrierLine | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAppointedOnly, setShowAppointedOnly] = useState(false);

  const filtered = CARRIERS.filter(c => {
    const matchesLine = filterLine === 'all' || c.lines.includes(filterLine);
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.notes.toLowerCase().includes(search.toLowerCase());
    const matchesAppointed = !showAppointedOnly || DEMO_APPOINTED.includes(c.id);
    return matchesLine && matchesSearch && matchesAppointed;
  });

  const appointed = CARRIERS.filter(c => DEMO_APPOINTED.includes(c.id));

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
                  {appointed.length} active appointments across {CARRIERS.length} carrier partners.
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
              <span className="font-semibold text-sm text-ink">Your Active Appointments</span>
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
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="input-field pl-9"
                placeholder="Search carriers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Line filter */}
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

            {/* Appointed toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate whitespace-nowrap">
              <div
                onClick={() => setShowAppointedOnly(p => !p)}
                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer
                  ${showAppointedOnly ? 'bg-gold' : 'bg-ink/15'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                  ${showAppointedOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              Appointed only
            </label>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted mb-4">
            Showing {filtered.length} of {CARRIERS.length} carriers
          </p>

          {/* Carrier grid */}
          {filtered.length === 0 ? (
            <div className="card text-center py-16 text-muted">
              No carriers match your filters.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(carrier => {
                const isAppointed = DEMO_APPOINTED.includes(carrier.id);
                return (
                  <div
                    key={carrier.id}
                    className={`card hover:shadow-md transition-all group flex flex-col
                      ${isAppointed ? 'border-gold/25' : 'opacity-80'}`}
                  >
                    {/* Card header */}
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
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                          <Shield size={9} /> Appointed
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-ink/5 text-muted border border-ink/10 px-2 py-0.5 rounded-full">
                          Not appointed
                        </span>
                      )}
                    </div>

                    {/* Lines of business */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {carrier.lines.map(line => (
                        <span
                          key={line}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize
                            ${LINE_COLORS[line]}`}
                        >
                          {LINE_LABELS[line]}
                        </span>
                      ))}
                    </div>

                    {/* Notes */}
                    <p className="text-xs text-slate leading-relaxed mb-4 flex-1">
                      {carrier.notes}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-3 border-t border-ink/5">
                      {isAppointed ? (
                        <>
                          <a
                            href={carrier.quoteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-gold text-xs py-2 flex-1 justify-center"
                          >
                            Start Quote <ExternalLink size={11} />
                          </a>
                          <a
                            href={carrier.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-xs py-2 px-3 justify-center"
                            title="Agent portal"
                          >
                            Portal <ExternalLink size={11} />
                          </a>
                        </>
                      ) : (
                        <Link
                          href="/onboarding"
                          className="btn-outline text-xs py-2 flex-1 justify-center"
                        >
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
