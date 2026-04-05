import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Car, Heart, Shield, Star, ChevronRight, Phone, MapPin } from 'lucide-react';

const services = [
  { icon: Home, label: 'Home Insurance', desc: 'Protect your biggest investment with comprehensive homeowner coverage from top-rated carriers.', type: 'home' },
  { icon: Car, label: 'Auto Insurance', desc: 'State minimum to full coverage — we compare rates across 20+ carriers to find your best price.', type: 'auto' },
  { icon: Heart, label: 'Health Insurance', desc: 'ACA marketplace plans, short-term health, and group coverage for individuals and families.', type: 'health' },
];

const stats = [
  { n: '20+', label: 'Carrier Partners' },
  { n: '4,800+', label: 'Policies Placed' },
  { n: '98%', label: 'Client Satisfaction' },
  { n: '$2.1M', label: 'Claims Paid Out' },
];

const testimonials = [
  { name: 'Maria G.', loc: 'Frisco, TX', text: 'Saved $480/yr on my home and auto bundle. The process was completely painless.', stars: 5 },
  { name: 'James P.', loc: 'Allen, TX', text: 'Finally an agent who actually explained my coverage. Highly recommend ClearPath.', stars: 5 },
  { name: 'Lena T.', loc: 'McKinney, TX', text: 'Got health coverage for my whole family in one afternoon. Great experience.', stars: 5 },
];

const faqs = [
  { q: 'How long does it take to get a quote?', a: 'Our online quote tool gives you an estimated range in under 2 minutes. A binding quote from a carrier typically takes 1 business day.' },
  { q: 'Do you work with multiple insurance companies?', a: 'Yes — we are an independent broker with appointments at 20+ carriers, which means we shop the market for you rather than representing just one company.' },
  { q: 'Is the online quote binding?', a: 'No. The online estimate is a helpful starting point, not a final offer. Final pricing is determined by the carrier after a full application.' },
  { q: 'Are you licensed in Texas?', a: 'Yes. All our agents hold Texas Department of Insurance licenses and valid E&O coverage.' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-gold/10 -z-10" />
          <div className="absolute right-0 top-0 w-1/2 h-full -z-10 opacity-10"
            style={{ background: 'radial-gradient(ellipse at 80% 30%, #c9a84c 0%, transparent 60%)' }} />

          <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-4 animate-fade-up anim-delay-1">
                Independent Insurance Broker · Frisco, TX
              </div>
              <h1 className="font-display text-5xl md:text-6xl leading-tight font-bold text-ink mb-6 animate-fade-up anim-delay-2">
                Insurance that actually <em className="text-gold not-italic">works for you</em>
              </h1>
              <p className="text-slate text-lg leading-relaxed mb-8 animate-fade-up anim-delay-3">
                We shop 20+ carriers to find the right home, auto, or health insurance — at the right price. No pressure. No jargon. Just honest advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up anim-delay-4">
                <Link href="/quote" className="btn-gold text-center">
                  Get a Free Quote <ChevronRight size={16} />
                </Link>
                <a href="tel:+19725550100" className="btn-outline text-center">
                  <Phone size={15} /> Call Us
                </a>
              </div>
              <p className="text-xs text-muted mt-4 animate-fade-up anim-delay-4">
                Quote estimates are for informational purposes only and are not binding.
              </p>
            </div>

            {/* Quick quote card */}
            <div className="card shadow-xl animate-fade-up anim-delay-3">
              <div className="section-label mb-4">Instant Estimate</div>
              <h3 className="font-display text-2xl font-semibold mb-6">What are you looking to insure?</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {services.map(({ icon: Icon, label, type }) => (
                  <Link
                    key={type}
                    href={`/quote?type=${type}`}
                    className="flex flex-col items-center gap-2 p-4 border border-ink/10 rounded-sm hover:border-gold hover:bg-gold/5 transition-all text-center group"
                  >
                    <Icon size={22} className="text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-ink">{label.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
              <Link href="/quote" className="btn-gold w-full justify-center">
                Start My Estimate <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-ink text-cream py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ n, label }) => (
              <div key={label}>
                <div className="font-display text-3xl font-bold text-gold">{n}</div>
                <div className="text-cream/60 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-label mb-3">What We Cover</div>
            <h2 className="font-display text-4xl font-bold text-ink">
              Protection for every stage of life
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, label, desc, type }) => (
              <div key={type} className="card hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{label}</h3>
                <p className="text-slate text-sm leading-relaxed mb-5">{desc}</p>
                <Link href={`/quote?type=${type}`} className="text-gold text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Get an estimate <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-ink/5 py-24">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-4">Why ClearPath</div>
              <h2 className="font-display text-4xl font-bold mb-6">
                An independent broker works for <em className="text-gold not-italic">you</em>, not the carrier
              </h2>
              <p className="text-slate leading-relaxed mb-4">
                Unlike captive agents who represent a single insurance company, we hold appointments with 20+ top-rated carriers. That means we can shop the entire market to find the coverage that fits your situation — not just what one company offers.
              </p>
              <p className="text-slate leading-relaxed mb-6">
                Every agent on our team is licensed by the Texas Department of Insurance and carries professional E&O coverage. We take compliance seriously.
              </p>
              <div className="flex gap-2 flex-wrap">
                {['TDI Licensed', 'E&O Insured', 'NIPR Verified', '20+ Carriers'].map(b => (
                  <span key={b} className="flex items-center gap-1 text-xs font-semibold bg-white/80 border border-ink/10 px-3 py-1.5 rounded-sm">
                    <Shield size={11} className="text-gold" /> {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Link href="/onboarding" className="card hover:shadow-md transition-shadow flex items-start gap-4 group">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-ink mb-1">Are you an insurance agent?</div>
                  <p className="text-sm text-slate">Join our network. Complete onboarding, upload your credentials, and start writing business under our appointments.</p>
                  <span className="text-gold text-sm font-semibold flex items-center gap-1 mt-2 group-hover:gap-2 transition-all">
                    Agent onboarding <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-label mb-3">Client Stories</div>
            <h2 className="font-display text-4xl font-bold">Real people, real savings</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, loc, text, stars }) => (
              <div key={name} className="card">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-slate text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="text-xs font-semibold text-ink">{name} <span className="text-muted font-normal">· {loc}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-ink/5 py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="section-label mb-3">Common Questions</div>
              <h2 className="font-display text-4xl font-bold">FAQ</h2>
            </div>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="card">
                  <div className="font-semibold text-ink mb-2">{q}</div>
                  <p className="text-slate text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cities SEO section */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label mb-3">Service Area</div>
            <h2 className="font-display text-4xl font-bold text-ink">
              Serving North Texas communities
            </h2>
            <p className="text-slate mt-3 max-w-xl mx-auto">
              Local knowledge matters in insurance. Find rates, carrier info, and answers specific to your city.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { slug: 'frisco-tx', city: 'Frisco', desc: 'Home · Auto · Health' },
              { slug: 'mckinney-tx', city: 'McKinney', desc: 'Home · Auto · Health' },
              { slug: 'allen-tx', city: 'Allen', desc: 'Home · Auto · Health' },
              { slug: 'plano-tx', city: 'Plano', desc: 'Home · Auto · Health' },
              { slug: 'prosper-tx', city: 'Prosper', desc: 'Home · Auto · Health' },
              { slug: 'the-colony-tx', city: 'The Colony', desc: 'Home · Auto · Health' },
            ].map(({ slug, city, desc }) => (
              <a
                key={slug}
                href={`/insurance/${slug}`}
                className="card hover:border-gold/30 hover:shadow-md transition-all group flex items-center gap-3"
              >
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-ink group-hover:text-gold transition-colors">{city}, TX</div>
                  <div className="text-xs text-muted">{desc}</div>
                </div>
                <ChevronRight size={13} className="text-muted ml-auto group-hover:text-gold transition-colors" />
              </a>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="/insurance" className="text-gold text-sm font-semibold hover:underline">
              View all cities →
            </a>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-ink py-20 text-center">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-display text-4xl font-bold text-cream mb-4">
              Ready to find better coverage?
            </h2>
            <p className="text-cream/60 mb-8">It takes under 2 minutes to get an estimate.</p>
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
