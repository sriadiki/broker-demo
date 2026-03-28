'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User, Building, Shield, FileCheck, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, Upload,
} from 'lucide-react';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC',
  'ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const LINES = [
  'Property & Casualty (P&C)',
  'Life & Health (L&H)',
  'Homeowners',
  'Auto / Personal Lines',
  'Commercial Lines',
  'Health Insurance',
  'Life Insurance',
  'Medicare / Supplement',
];

const CARRIERS = [
  'State Farm', 'Allstate', 'GEICO', 'Progressive', 'Farmers',
  'Nationwide', 'Liberty Mutual', 'Travelers', 'USAA', 'Chubb',
  'UnitedHealthcare', 'Aetna', 'Cigna', 'BlueCross BlueShield',
];

const steps = [
  { label: 'Personal', icon: User },
  { label: 'License', icon: Shield },
  { label: 'Appointments', icon: Building },
  { label: 'Review', icon: FileCheck },
];

type FormData = {
  firstName: string; lastName: string; email: string; phone: string;
  agency: string; website: string;
  npn: string; licenseNumber: string; licenseState: string;
  linesOfAuthority: string[]; territories: string[];
  carriers: string[]; eoCertificate: string;
  agreeTerms: boolean;
};

const empty: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  agency: '', website: '',
  npn: '', licenseNumber: '', licenseState: 'TX',
  linesOfAuthority: [], territories: [],
  carriers: [], eoCertificate: '',
  agreeTerms: false,
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (field: keyof FormData, value: unknown) =>
    setForm(p => ({ ...p, [field]: value }));

  const toggleArray = (field: 'linesOfAuthority' | 'territories' | 'carriers', val: string) =>
    set(field, (form[field] as string[]).includes(val)
      ? (form[field] as string[]).filter(v => v !== val)
      : [...(form[field] as string[]), val]);

  function validateStep(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!form.firstName) e.firstName = 'Required';
      if (!form.lastName) e.lastName = 'Required';
      if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
      if (!form.phone) e.phone = 'Required';
    }
    if (step === 1) {
      if (!form.npn) e.npn = 'Required';
      if (!form.licenseNumber) e.licenseNumber = 'Required';
      if (form.linesOfAuthority.length === 0) e.linesOfAuthority = 'Select at least one' as any;
    }
    if (step === 2) {
      if (form.carriers.length === 0) e.carriers = 'Select at least one' as any;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validateStep()) setStep(s => Math.min(s + 1, 3)); }
  function back() { setStep(s => Math.max(s - 1, 0)); }

  async function submit() {
    if (!form.agreeTerms) { alert('Please agree to the terms.'); return; }
    setLoading(true);
    try {
      await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'agent', ...form }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
          <div className="card max-w-md w-full text-center py-14 animate-fade-up">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-gold" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">Application Submitted!</h2>
            <p className="text-slate mb-2">
              Thanks, <strong>{form.firstName}</strong>. Your onboarding application is under review.
            </p>
            <p className="text-sm text-muted">
              Our compliance team will verify your credentials and reach out to <strong>{form.email}</strong> within 2 business days.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <div className="section-label mb-2">Agent Portal</div>
            <h1 className="font-display text-4xl font-bold text-ink">Join ClearPath as an Agent</h1>
            <p className="text-slate mt-2">Complete the form below to apply to our broker network. We verify all credentials through NIPR.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center mb-10 gap-0">
            {steps.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-ink' : 'text-muted'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                    ${i < step ? 'bg-gold text-ink' : i === step ? 'bg-ink text-cream' : 'bg-ink/10 text-muted'}`}>
                    {i < step ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                  </div>
                  <span className="text-xs font-semibold hidden sm:block">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-gold' : 'bg-ink/10'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="card animate-fade-up">
            {/* Step 0: Personal Info */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Personal & Agency Information</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">First name *</label>
                    <input className="input-field" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jane" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Last name *</label>
                    <input className="input-field" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5">Email address *</label>
                  <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@agency.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5">Phone *</label>
                  <input className="input-field" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(972) 555-0100" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5">Agency / DBA name</label>
                  <input className="input-field" value={form.agency} onChange={e => set('agency', e.target.value)} placeholder="Smith Insurance Group" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Agency website (optional)</label>
                  <input className="input-field" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://smithinsurance.com" />
                </div>
              </div>
            )}

            {/* Step 1: License */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">License & Compliance</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">NPN (National Producer Number) *</label>
                    <input className="input-field" value={form.npn} onChange={e => set('npn', e.target.value)} placeholder="12345678" />
                    {errors.npn && <p className="text-red-500 text-xs mt-1">{errors.npn}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">License number *</label>
                    <input className="input-field" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} placeholder="TX-1234567" />
                    {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1.5">Primary license state</label>
                  <select className="select-field" value={form.licenseState} onChange={e => set('licenseState', e.target.value)}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Lines of authority * <span className="text-muted font-normal">(select all that apply)</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {LINES.map(line => (
                      <label key={line} className={`flex items-center gap-2.5 p-3 border rounded-sm cursor-pointer transition-colors text-sm
                        ${form.linesOfAuthority.includes(line) ? 'border-gold bg-gold/5' : 'border-ink/15 hover:border-ink/30'}`}>
                        <input type="checkbox" className="accent-gold" checked={form.linesOfAuthority.includes(line)}
                          onChange={() => toggleArray('linesOfAuthority', line)} />
                        {line}
                      </label>
                    ))}
                  </div>
                  {errors.linesOfAuthority && <p className="text-red-500 text-xs mt-2">Select at least one line</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Licensed territories</label>
                  <div className="flex flex-wrap gap-2">
                    {STATES.map(s => (
                      <button key={s} type="button" onClick={() => toggleArray('territories', s)}
                        className={`px-2.5 py-1 text-xs font-medium border rounded-sm transition-colors
                          ${form.territories.includes(s) ? 'border-gold bg-gold text-ink' : 'border-ink/15 text-slate hover:border-ink/30'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Carrier Appointments */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-2">Carrier Appointments</h2>
                <p className="text-slate text-sm mb-6">Select all carriers you currently hold active appointments with.</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {CARRIERS.map(c => (
                    <label key={c} className={`flex items-center gap-2.5 p-3 border rounded-sm cursor-pointer transition-colors text-sm
                      ${form.carriers.includes(c) ? 'border-gold bg-gold/5' : 'border-ink/15 hover:border-ink/30'}`}>
                      <input type="checkbox" className="accent-gold" checked={form.carriers.includes(c)}
                        onChange={() => toggleArray('carriers', c)} />
                      {c}
                    </label>
                  ))}
                </div>
                {errors.carriers && <p className="text-red-500 text-xs mb-4">Select at least one carrier</p>}
                <div className="border-2 border-dashed border-ink/15 rounded-sm p-8 text-center hover:border-gold transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto text-muted mb-2" />
                  <p className="text-sm font-medium text-ink">Upload E&O Certificate</p>
                  <p className="text-xs text-muted mt-1">PDF or image, max 10MB</p>
                  <p className="text-xs text-gold mt-2">(File upload disabled in demo)</p>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Review & Submit</h2>
                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                    { label: 'Agency', value: form.agency || '—' },
                    { label: 'NPN', value: form.npn },
                    { label: 'License', value: `${form.licenseNumber} (${form.licenseState})` },
                    { label: 'Lines', value: form.linesOfAuthority.join(', ') || '—' },
                    { label: 'Territories', value: form.territories.join(', ') || '—' },
                    { label: 'Carriers', value: form.carriers.join(', ') || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 py-2 border-b border-ink/5 text-sm">
                      <span className="font-medium text-ink w-28 flex-shrink-0">{label}</span>
                      <span className="text-slate">{value}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input type="checkbox" className="accent-gold mt-0.5" checked={form.agreeTerms}
                    onChange={e => set('agreeTerms', e.target.checked)} />
                  <span className="text-sm text-slate">
                    I certify that all information provided is accurate and complete. I understand my credentials will be verified through NIPR and that submitting false information may result in disqualification.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-ink/5">
              {step > 0 && (
                <button onClick={back} className="btn-outline flex-1 justify-center">
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={next} className="btn-gold flex-1 justify-center">
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={submit} disabled={loading} className="btn-gold flex-1 justify-center">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Submit Application <CheckCircle2 size={16} /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
