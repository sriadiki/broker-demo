'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Car, Heart, ChevronRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

type ProductType = 'home' | 'auto' | 'health';

interface QuoteResult {
  productType: ProductType;
  monthlyEstimateLow: number;
  monthlyEstimateHigh: number;
  assumptions: string[];
  disclaimer: string;
}

interface LeadForm {
  name: string;
  email: string;
  phone: string;
}

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC',
  'ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

function QuotePageInner() {
  const params = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [product, setProduct] = useState<ProductType>((params.get('type') as ProductType) ?? 'home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [lead, setLead] = useState<LeadForm>({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  // Product-specific inputs
  const [homeValue, setHomeValue] = useState('350000');
  const [state, setState] = useState('TX');
  const [deductible, setDeductible] = useState('2500');
  const [vehicleCount, setVehicleCount] = useState('1');
  const [driverCount, setDriverCount] = useState('1');
  const [zipCode, setZipCode] = useState('75034');
  const [householdSize, setHouseholdSize] = useState('1');
  const [coverageType, setCoverageType] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');

  async function getQuote() {
    setLoading(true);
    const body = {
      productType: product,
      homeValue: parseInt(homeValue),
      state,
      deductible: parseInt(deductible),
      vehicleCount: parseInt(vehicleCount),
      driverCount: parseInt(driverCount),
      zipCode,
      householdSize: parseInt(householdSize),
      coverageType,
    };
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', ...lead, productType: product, estimate: result }),
      });
      setSubmitted(true);
      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  const products: { type: ProductType; icon: typeof Home; label: string }[] = [
    { type: 'home', icon: Home, label: 'Home' },
    { type: 'auto', icon: Car, label: 'Auto' },
    { type: 'health', icon: Heart, label: 'Health' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${step >= s ? 'bg-gold text-ink' : 'bg-ink/10 text-muted'}`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                {s < 3 && <div className={`h-px flex-1 w-12 transition-colors ${step > s ? 'bg-gold' : 'bg-ink/10'}`} />}
              </div>
            ))}
            <span className="text-xs text-muted ml-2">
              {step === 1 ? 'Your details' : step === 2 ? 'Your estimate' : 'Confirmed'}
            </span>
          </div>

          {/* Step 1: Inputs */}
          {step === 1 && (
            <div className="card animate-fade-up">
              <div className="section-label mb-2">Step 1</div>
              <h1 className="font-display text-3xl font-bold mb-6">Get your estimate</h1>

              {/* Product selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-ink mb-3">What would you like to insure?</label>
                <div className="grid grid-cols-3 gap-3">
                  {products.map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setProduct(type)}
                      className={`flex flex-col items-center gap-2 p-4 border rounded-sm transition-all
                        ${product === type ? 'border-gold bg-gold/5 text-ink' : 'border-ink/15 text-slate hover:border-ink/30'}`}
                    >
                      <Icon size={20} className={product === type ? 'text-gold' : ''} />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Home fields */}
              {product === 'home' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Estimated home value</label>
                    <select className="select-field" value={homeValue} onChange={e => setHomeValue(e.target.value)}>
                      <option value="150000">$150,000</option>
                      <option value="250000">$250,000</option>
                      <option value="350000">$350,000</option>
                      <option value="500000">$500,000</option>
                      <option value="750000">$750,000</option>
                      <option value="1000000">$1,000,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">State</label>
                    <select className="select-field" value={state} onChange={e => setState(e.target.value)}>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Preferred deductible</label>
                    <select className="select-field" value={deductible} onChange={e => setDeductible(e.target.value)}>
                      <option value="1000">$1,000</option>
                      <option value="2500">$2,500</option>
                      <option value="5000">$5,000</option>
                      <option value="10000">$10,000</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Auto fields */}
              {product === 'auto' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Number of vehicles</label>
                    <select className="select-field" value={vehicleCount} onChange={e => setVehicleCount(e.target.value)}>
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Number of drivers</label>
                    <select className="select-field" value={driverCount} onChange={e => setDriverCount(e.target.value)}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">ZIP code</label>
                    <input className="input-field" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="e.g. 75034" maxLength={5} />
                  </div>
                </div>
              )}

              {/* Health fields */}
              {product === 'health' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Household size</label>
                    <select className="select-field" value={householdSize} onChange={e => setHouseholdSize(e.target.value)}>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Coverage level</label>
                    <select className="select-field" value={coverageType} onChange={e => setCoverageType(e.target.value as typeof coverageType)}>
                      <option value="bronze">Bronze — lower premium, higher out-of-pocket</option>
                      <option value="silver">Silver — balanced</option>
                      <option value="gold">Gold — lower deductible</option>
                      <option value="platinum">Platinum — comprehensive</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={getQuote}
                disabled={loading}
                className="btn-gold w-full justify-center mt-8"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Calculate Estimate <ChevronRight size={16} /></>}
              </button>
              <p className="text-xs text-muted text-center mt-3">
                Estimates are approximate and not binding quotes.
              </p>
            </div>
          )}

          {/* Step 2: Result */}
          {step === 2 && result && (
            <div className="space-y-4 animate-fade-up">
              <div className="card border-gold/30">
                <div className="section-label mb-2">Your Estimate</div>
                <h2 className="font-display text-3xl font-bold mb-1">
                  ${result.monthlyEstimateLow.toLocaleString()} – ${result.monthlyEstimateHigh.toLocaleString()}
                  <span className="text-lg font-normal text-muted">/mo</span>
                </h2>
                <p className="text-sm text-muted mb-6">Estimated monthly premium range</p>

                <div className="bg-gold/5 border border-gold/20 rounded-sm p-4 mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Based On</div>
                  <ul className="space-y-1">
                    {result.assumptions.map(a => (
                      <li key={a} className="text-sm text-slate flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-gold mt-0.5 flex-shrink-0" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-start gap-2 text-xs text-muted border border-ink/10 rounded-sm p-3 mb-6">
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                  {result.disclaimer}
                </div>

                <button onClick={() => setStep(1)} className="btn-outline text-sm w-full justify-center mb-3">
                  Adjust inputs
                </button>
              </div>

              {/* Lead capture */}
              <div className="card">
                <h3 className="font-display text-xl font-semibold mb-1">Want a real quote from a licensed agent?</h3>
                <p className="text-sm text-slate mb-5">We'll reach out within 1 business day with accurate pricing from our carrier network.</p>
                <form onSubmit={submitLead} className="space-y-3">
                  <input className="input-field" placeholder="Full name" required value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))} />
                  <input className="input-field" type="email" placeholder="Email address" required value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))} />
                  <input className="input-field" type="tel" placeholder="Phone number (optional)" value={lead.phone} onChange={e => setLead(p => ({ ...p, phone: e.target.value }))} />
                  <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Connect Me With an Agent <ChevronRight size={16} /></>}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="card text-center animate-fade-up py-12">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-gold" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-3">You're all set, {lead.name.split(' ')[0]}!</h2>
              <p className="text-slate mb-6">
                A licensed agent will reach out to <strong>{lead.email}</strong> within 1 business day with accurate quotes from our carrier partners.
              </p>
              <p className="text-sm text-muted">Check your inbox for a confirmation email shortly.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense>
      <QuotePageInner />
    </Suspense>
  );
}
