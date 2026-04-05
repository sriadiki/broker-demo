import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCityBySlug, getAllSlugs, CITIES } from '@/lib/cities';
import { Home, Car, Heart, ChevronRight, MapPin, Star, Phone } from 'lucide-react';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'Not Found' };
  return {
    title: `Insurance Broker in ${city.city}, ${city.stateCode} | ClearPath Insurance`,
    description: `Find the best home, auto, and health insurance in ${city.city}, ${city.stateCode}. Independent broker comparing 20+ carriers. Get a free quote in minutes.`,
    keywords: [
      `insurance broker ${city.city}`,
      `home insurance ${city.city} TX`,
      `auto insurance ${city.city} TX`,
      `health insurance ${city.city} ${city.stateCode}`,
      `independent insurance agent ${city.city}`,
    ].join(', '),
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  // LocalBusiness + FAQPage JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `https://broker-demo.fly.dev/insurance/${city.slug}`,
        name: `ClearPath Insurance — ${city.city}, ${city.stateCode}`,
        description: `Independent insurance broker serving ${city.city}, ${city.stateCode}. Home, auto, and health insurance from 20+ carriers.`,
        url: `https://broker-demo.fly.dev/insurance/${city.slug}`,
        telephone: '+19725550100',
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.city,
          addressRegion: city.stateCode,
          addressCountry: 'US',
        },
        areaServed: {
          '@type': 'City',
          name: city.city,
        },
        serviceType: ['Home Insurance', 'Auto Insurance', 'Health Insurance'],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '127',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: city.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  };

  const products = [
    { icon: Home, label: 'Home Insurance', desc: `Protect your ${city.city} home with coverage from top-rated Texas carriers.`, type: 'home', avg: city.avgAutoRate },
    { icon: Car, label: 'Auto Insurance', desc: `Compare auto rates in ${city.city} across 20+ carriers in minutes.`, type: 'auto', avg: city.avgAutoRate },
    { icon: Heart, label: 'Health Insurance', desc: `ACA marketplace and group plans available in ${city.county}.`, type: 'health', avg: city.avgHealthRate },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-20 px-6 bg-gradient-to-br from-cream to-gold/10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted mb-4">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/insurance" className="hover:text-gold transition-colors">Cities</Link>
              <ChevronRight size={13} />
              <span className="text-ink font-medium">{city.city}, {city.stateCode}</span>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <MapPin size={20} className="text-gold mt-1 flex-shrink-0" />
              <div className="section-label">Serving {city.city}, {city.stateCode}</div>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-ink leading-tight mb-6">
              Insurance broker in<br />
              <span className="text-gold">{city.city}</span>
            </h1>
            <p className="text-slate text-lg leading-relaxed max-w-2xl mb-8">
              {city.description} We're an independent broker comparing 20+ carriers to find you the right coverage at the right price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="btn-gold">
                Get a Free Quote <ChevronRight size={16} />
              </Link>
              <a href="tel:+19725550100" className="btn-outline">
                <Phone size={15} /> Call (972) 555-0100
              </a>
            </div>
          </div>
        </section>

        {/* City stats */}
        <section className="bg-ink text-cream py-10">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Population', value: city.population },
              { label: 'Median Home Value', value: city.medianHomeValue },
              { label: 'Avg. Auto Rate', value: city.avgAutoRate },
              { label: 'Avg. Health Rate', value: city.avgHealthRate },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold text-gold">{value}</div>
                <div className="text-cream/60 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="section-label mb-3 text-center">Coverage Options</div>
            <h2 className="font-display text-4xl font-bold text-center text-ink mb-12">
              What we cover in {city.city}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map(({ icon: Icon, label, desc, type }) => (
                <div key={type} className="card hover:shadow-md transition-shadow group">
                  <div className="w-11 h-11 bg-gold/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{label}</h3>
                  <p className="text-slate text-sm leading-relaxed mb-5">{desc}</p>
                  <Link href={`/quote?type=${type}`} className="text-gold text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Get estimate <ChevronRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="bg-ink/5 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="section-label mb-3">Neighborhoods We Serve</div>
            <h2 className="font-display text-3xl font-bold text-ink mb-6">
              Coverage across all of {city.city}
            </h2>
            <div className="flex flex-wrap gap-3">
              {city.neighborhoods.map(n => (
                <span key={n} className="flex items-center gap-1.5 bg-white border border-ink/10 text-slate text-sm px-4 py-2 rounded-sm">
                  <MapPin size={12} className="text-gold" /> {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="section-label mb-3 text-center">Local Knowledge</div>
            <h2 className="font-display text-4xl font-bold text-center text-ink mb-12">
              Insurance FAQ for {city.city} residents
            </h2>
            <div className="space-y-4">
              {city.faqs.map(({ q, a }) => (
                <div key={q} className="card">
                  <h3 className="font-semibold text-ink mb-2">{q}</h3>
                  <p className="text-slate text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other cities */}
        <section className="bg-ink/5 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="section-label mb-3">Also Serving</div>
            <h2 className="font-display text-2xl font-bold text-ink mb-6">Other cities in North Texas</h2>
            <div className="flex flex-wrap gap-3">
              {CITIES.filter(c => c.slug !== city.slug).map(c => (
                <Link
                  key={c.slug}
                  href={`/insurance/${c.slug}`}
                  className="flex items-center gap-2 bg-white border border-ink/10 text-slate text-sm px-4 py-2 rounded-sm hover:border-gold hover:text-ink transition-colors"
                >
                  <MapPin size={12} className="text-gold" />
                  {c.city}, {c.stateCode}
                  <ChevronRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink py-20 text-center px-6">
          <div className="max-w-xl mx-auto">
            <div className="flex justify-center gap-0.5 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-gold text-gold" />)}
            </div>
            <h2 className="font-display text-4xl font-bold text-cream mb-3">
              Ready to protect your {city.city} home?
            </h2>
            <p className="text-cream/60 mb-8">Get an estimate in under 2 minutes. No commitment required.</p>
            <Link href="/quote" className="btn-gold text-base px-8 py-4">
              Get My Free Quote <ChevronRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
