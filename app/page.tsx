'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Car, Heart, Shield, Star, ChevronRight, Phone, MapPin, Loader2 } from 'lucide-react';
import { getSiteByDomain, getContentByType } from '@/lib/multi-tenant';

interface Site {
  id: string;
  title: string;
  description: string;
  organizations: any;
}

interface ContentItem {
  id: string;
  type: string;
  title: string;
  body: string;
}

const FALLBACK_SERVICES = [
  { 
    icon: Home, 
    label: 'Home Insurance', 
    desc: 'Protect your biggest investment with comprehensive homeowner coverage from top-rated carriers.', 
    type: 'home' 
  },
  { 
    icon: Car, 
    label: 'Auto Insurance', 
    desc: 'State minimum to full coverage — we compare rates across 20+ carriers to find your best price.', 
    type: 'auto' 
  },
  { 
    icon: Heart, 
    label: 'Health Insurance', 
    desc: 'ACA marketplace plans, short-term health, and group coverage for individuals and families.', 
    type: 'health' 
  },
];

const FALLBACK_STATS = [
  { n: '20+', label: 'Carrier Partners' },
  { n: '4,800+', label: 'Policies Placed' },
  { n: '98%', label: 'Client Satisfaction' },
  { n: '$2.1M', label: 'Claims Paid Out' },
];

export default function HomePage() {
  const [site, setSite] = useState<Site | null>(null);
  const [services, setServices] = useState<ContentItem[]>([]);
  const [testimonials, setTestimonials] = useState<ContentItem[]>([]);
  const [faqs, setFAQs] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    const loadSite = async () => {
      try {
        // Get current domain
        if (typeof window !== 'undefined') {
          const currentDomain = window.location.hostname;
          setDomain(currentDomain);

          // Try to load from database
          const siteData = await getSiteByDomain(currentDomain);

          if (siteData) {
            setSite(siteData);

            // Load content
            const servicesData = await getContentByType(siteData.id, 'service');
            const testimonialsData = await getContentByType(siteData.id, 'testimonial');
            const faqsData = await getContentByType(siteData.id, 'faq');

            setServices(servicesData as ContentItem[]);
            setTestimonials(testimonialsData as ContentItem[]);
            setFAQs(faqsData as ContentItem[]);
          } else {
            // Fallback: use hardcoded defaults
            console.log('No site found in database, using fallbacks');
          }
        }
      } catch (error) {
        console.error('Failed to load site:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="text-gold animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  // Use database data if available, otherwise fallback
  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES as any[];
  const displayTestimonials = testimonials.length > 0 
    ? testimonials 
    : [
        { title: 'Maria G. · Frisco, TX', body: 'Saved $480/yr on my home and auto bundle. The process was completely painless.' },
        { title: 'James P. · Allen, TX', body: 'Finally an agent who actually explained my coverage. Highly recommend.' },
        { title: 'Lena T. · McKinney, TX', body: 'Got health coverage for my whole family in one afternoon. Great experience.' },
      ] as any[];
  const displayFAQs = faqs.length > 0 
    ? faqs 
    : [
        { title: 'How long does it take to get a quote?', body: 'Our online quote tool gives you an estimated range in under 2 minutes.' },
        { title: 'Do you work with multiple companies?', body: 'Yes, we work with 20+ top-rated carriers.' },
        { title: 'Is the quote binding?', body: 'No, it\'s an estimate. Final pricing comes after full application.' },
      ] as any[];

  const orgName = site?.organizations?.name || 'Your Business';
  const orgDescription = site?.description || 'Professional services';

  return (
    <>
      <Navbar />
      <main>
        {/* Debug Info (remove in production) */}
        <div className="bg-ink/5 border-b border-ink/10 px-6 py-3 text-center text-xs text-muted">
          Domain: {domain} | Site: {site ? '✅ From DB' : '⚠️ Fallback'} | 
          Services: {displayServices.length} | Testimonials: {displayTestimonials.length}
        </div>

        {/* Hero */}
        <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-gold/10 -z-10" />
          <div
            className="absolute right-0 top-0 w-1/2 h-full -z-10 opacity-10"
            style={{
              background: 'radial-gradient(ellipse at 80% 30%, #c9a84c 0%, transparent 60%)',
            }}
          />

          <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-4 animate-fade-up anim-delay-1">
                {site?.organizations?.industry || 'Professional'} · {site?.organizations?.email?.split('@')[0] || 'Service Provider'}
              </div>
              <h1 className="font-display text-5xl md:text-6xl leading-tight font-bold text-ink mb-6 animate-fade-up anim-delay-2">
                {orgName}
              </h1>
              <p className="text-slate text-lg leading-relaxed mb-8 animate-fade-up anim-delay-3">
                {orgDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up anim-delay-4">
                <Link href="/quote" className="btn-gold text-center">
                  Get a Free Quote <ChevronRight size={16} />
                </Link>
                <a href={`tel:+${site?.organizations?.phone?.replace(/\D/g, '') || '19725550100'}`} className="btn-outline text-center">
                  <Phone size={15} /> Call Us
                </a>
              </div>
            </div>

            <div className="card shadow-xl animate-fade-up anim-delay-3">
              <div className="section-label mb-4">Quick Action</div>
              <h3 className="font-display text-2xl font-semibold mb-6">Get started</h3>
              <Link href="/quote" className="btn-gold w-full justify-center">
                Start My Estimate <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-label mb-3">Services</div>
            <h2 className="font-display text-4xl font-bold text-ink">
              {displayServices.length > 0 ? 'What We Offer' : 'Our Solutions'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {displayServices.map((svc: any, idx: number) => (
              <div key={idx} className="card hover:shadow-md transition-shadow group">
                {svc.icon && (
                  <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <svc.icon size={22} className="text-gold" />
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold mb-3">{svc.title || svc.label}</h3>
                <p className="text-slate text-sm leading-relaxed mb-5">{svc.body || svc.desc}</p>
                <Link href="/quote" className="text-gold text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Learn more <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-label mb-3">Client Stories</div>
            <h2 className="font-display text-4xl font-bold">Real feedback</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {displayTestimonials.map((t: any, idx: number) => (
              <div key={idx} className="card">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-slate text-sm leading-relaxed mb-4">"{t.body}"</p>
                <div className="text-xs font-semibold text-ink">{t.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-ink/5 py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="section-label mb-3">Questions?</div>
              <h2 className="font-display text-4xl font-bold">FAQ</h2>
            </div>
            <div className="space-y-4">
              {displayFAQs.map((faq: any, idx: number) => (
                <div key={idx} className="card">
                  <div className="font-semibold text-ink mb-2">{faq.title}</div>
                  <p className="text-slate text-sm leading-relaxed">{faq.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink py-20 text-center">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-display text-4xl font-bold text-cream mb-4">Ready to get started?</h2>
            <p className="text-cream/60 mb-8">Take the first step today.</p>
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
