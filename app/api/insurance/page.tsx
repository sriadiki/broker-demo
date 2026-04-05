import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CITIES } from '@/lib/cities';
import { MapPin, ChevronRight, Home, Car, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insurance Broker in North Texas | ClearPath Insurance',
  description: 'Independent insurance broker serving Frisco, McKinney, Allen, Plano, Prosper and surrounding North Texas cities. Home, auto, and health insurance from 20+ carriers.',
};

export default function InsurancePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="section-label mb-3">Service Area</div>
          <h1 className="font-display text-5xl font-bold text-ink mb-4">
            Serving North Texas
          </h1>
          <p className="text-slate text-lg leading-relaxed max-w-2xl mb-12">
            We're an independent insurance broker licensed in Texas with local knowledge of the DFW metroplex. Select your city for local rates, carrier info, and frequently asked questions.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CITIES.map(city => (
              <Link
                key={city.slug}
                href={`/insurance/${city.slug}`}
                className="card hover:shadow-md hover:border-gold/30 transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <MapPin size={16} className="text-gold" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold text-ink">{city.city}</div>
                    <div className="text-xs text-muted">{city.county} · Pop. {city.population}</div>
                  </div>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {city.slug.includes('frisco') || city.slug.includes('mckinney') || city.slug.includes('allen') || city.slug.includes('plano') || city.slug.includes('prosper') || city.slug.includes('colony') ? (
                    <>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">Home</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">Auto</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">Health</span>
                    </>
                  ) : null}
                </div>
                <div className="text-sm text-slate leading-relaxed mb-4 line-clamp-2">{city.description}</div>
                <div className="flex items-center gap-1 text-gold text-sm font-semibold group-hover:gap-2 transition-all">
                  View local rates <ChevronRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
