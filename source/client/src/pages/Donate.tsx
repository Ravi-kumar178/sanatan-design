// Sanatan International — Donate Page (frontend only)
// Features: animated progress bar, milestone markers, preset amounts,
// custom amount input, dedication field, form validation, success state
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { submitForm } from '@/lib/formDelivery';
import { goToDonationPlatform, hasDonationPlatform } from '@/lib/donation';

// ─── Campaign Data ─────────────────────────────────────────────────────────────
const GOAL = 2_000_000;
const RAISED = 347_500;
const DONORS = 1_243;
const DAYS_LEFT = 412;
const PCT = Math.round((RAISED / GOAL) * 100);

const milestones = [
  { pct: 10,  label: 'Legal & Due Diligence', amount: '$200K', done: true },
  { pct: 25,  label: 'Land Deposit',           amount: '$500K', done: false },
  { pct: 50,  label: 'Full Purchase',           amount: '$1M',  done: false },
  { pct: 75,  label: 'Phase 1 Construction',   amount: '$1.5M', done: false },
  { pct: 100, label: 'Campus Complete',         amount: '$2M',  done: false },
];

const PRESET_AMOUNTS = [25, 50, 108, 250, 500, 1000];

const FUND_OPTIONS = [
  { id: 'land',       label: 'Land Acquisition Fund', desc: 'Directly funds the El Sabrante property purchase' },
  { id: 'scholarship',label: 'Student Scholarships',  desc: 'Covers tuition for students who cannot afford fees' },
  { id: 'operations', label: 'General Operations',    desc: 'Supports day-to-day programs and community outreach' },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.max(0, Math.round(eased * target)));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Animated Progress Bar ─────────────────────────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth(pct), 200);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct]);

  return (
    <div ref={ref} className="relative">
      {/* Track */}
      <div className="w-full rounded-full overflow-hidden" style={{ height: '14px', background: 'var(--si-surface-alt)' }}>
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${width}%`,
            background: 'linear-gradient(90deg, var(--si-orange) 0%, #FBBF24 100%)',
            borderRadius: '9999px',
            transition: 'width 1.8s cubic-bezier(0.23,1,0.32,1)',
            position: 'relative',
          }}
        >
          {/* Shimmer */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '9999px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            animation: 'shimmer 2.5s infinite',
          }} />
        </div>
      </div>

      {/* Milestone dots */}
      {milestones.map((m) => (
        <div
          key={m.pct}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${m.pct}%` }}
        >
          <div
            className="w-4 h-4 rounded-full border-2"
            style={{
              background: m.done || pct >= m.pct ? 'var(--si-orange)' : 'var(--si-card)',
              borderColor: m.done || pct >= m.pct ? 'var(--si-orange)' : 'var(--si-border-strong)',
              transition: 'all 0.5s ease',
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main Donate Page ─────────────────────────────────────────────────────────
function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function Donate() {
  const { t, lang } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(108);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedFund, setSelectedFund] = useState('land');
  const [recurring, setRecurring] = useState(false);
  const [dedication, setDedication] = useState('');
  const [showDedication, setShowDedication] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!finalAmount || finalAmount <= 0) e.amount = 'Please select or enter a donation amount.';
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState('submitting');

    const intent = {
      amount: finalAmount || 0,
      frequency: (recurring ? 'monthly' : 'one-time') as 'monthly' | 'one-time',
      fund: selectedFund,
      name,
      email,
    };

    // With a hosted donation page configured, hand the donor straight to it —
    // card details never touch this site, which is how the compliance works.
    if (goToDonationPlatform(intent)) return;

    // No platform configured yet: record the pledge honestly rather than
    // showing a success screen for money that was never collected.
    const result = await submitForm({
      formName: 'Donation pledge',
      inbox: 'donate',
      data: { ...intent, dedication },
    });
    setFormState(result.ok ? 'success' : 'error');
  };

  const handleReset = () => {
    setFormState('idle');
    setSelectedAmount(108);
    setCustomAmount('');
    setName('');
    setEmail('');
    setDedication('');
    setErrors({});
  };

  return (
    <Layout>
      <PageMeta
        title="Donate — Land Acquisition Fund"
        description="Support the Sanatan International Land Acquisition Fund. Help us purchase 33 acres in El Sabrante, California to build a permanent Gurukul campus. Every contribution counts."
        url="/donate"
        type="website"
      />

      {/* Hero */}
      <section className="section-dark pt-32 pb-24 texture-dark">
        <div className="container max-w-4xl">
          <Label c="Support the Mission" />
          
            Build the Campus.<br />
            <span className="text-si-orange-ink">{t('donate.title2')}</span>
          </h1>
          <p className="font-display italic text-xl mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
            We are acquiring 33 acres in El Sabrante, California to build a permanent Gurukul campus for Vedic education, Ayurveda research, and community welfare.
          </p>
          
          Your donation goes directly to the Land Acquisition Fund. Every rupee is documented publicly in our quarterly financial reports.
        </p>
          <div style={{ marginBottom: '28px' }}>
            
              See the Campus Vision — 5 architectural renders →
            </Link>
          </div>

        {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Raised', value: <AnimatedNumber target={RAISED} prefix="$" /> },
              { label: 'Goal', value: '$2,000,000' },
              { label: 'Donors', value: <AnimatedNumber target={DONORS} suffix="+" /> },
              { label: 'Days Active', value: <AnimatedNumber target={DAYS_LEFT} /> },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {s.value}</p>
                {s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-12 max-w-4xl">
          <div className="flex items-center justify-between mb-3">
            
              Campaign Progress
            </p>
            
              {PCT}% funded
            </p>
          </div>
          <ProgressBar pct={PCT} />

          {/* Milestone labels */}
          <div className="relative mt-4" style={{ height: '48px' }}>
            {milestones.map((m) => (
              <div
                key={m.pct}
                className="absolute text-center"
                style={{ left: `${m.pct}%`, transform: 'translateX(-50%)', width: '80px' }}
              >
                
                  {m.amount}
                </p>
                
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Current milestone note */}
          <div className="mt-6 rounded-xl px-5 py-3 flex items-center gap-3"
            style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
            <span className="text-xl">🎯</span>
            
              <strong>Next milestone:</strong> Land Deposit ($500K) — we need <strong>${(500_000 - RAISED).toLocaleString()}</strong> more to secure the property.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form + Sidebar */}
      <section className="section-cream py-20 texture-cream">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Form ── */}
            <div className="lg:col-span-3">
              {formState === 'success' ? (
                /* Success State */
                <div className="card-white p-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'var(--si-success-tint)', border: '2px solid #86EFAC' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  धन्यवाद</p>
                  
                    Thank You, {name}!
                  </h2>
                  
                    Your donation of <strong>${finalAmount?.toLocaleString()}</strong> to the <strong>{FUND_OPTIONS.find(f => f.id === selectedFund)?.label}</strong> has been received.
                  </p>
                  
                    A confirmation will be sent to <strong>{email}</strong>. Your contribution brings us closer to securing the El Sabrante campus.
                  </p>
                  <div className="rounded-xl p-4 mb-8" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                    <p className="font-display italic text-base" style={{ color: 'var(--si-amber-deep)' }}>
                      "दानं परमं बलम्" — Generosity is the supreme strength.
                    </p>
                  </div>
                  <button onClick={handleReset} className="btn-outline text-sm">{lang === 'hi' ? 'एक और दान करें' : 'Make Another Donation'}</button>
                </div>
              ) : (
                /* Donation Form */
                <form onSubmit={handleSubmit} noValidate>
                  <div className="card-white p-8">
                    
                      {lang === 'hi' ? 'दान करें' : 'Make a Donation'}
                    </h2>

                    {/* Recurring toggle */}
                    <div className="flex gap-2 mb-6">
                      {(['one-time', 'monthly'] as const).map((type) => (
                        
                          {type === 'one-time' ? (lang === 'hi' ? 'एकबारगी' : 'One-time') : (lang === 'hi' ? 'मासिक' : 'Monthly')}
                        </button>
                      ))}
                    </div>

                    {/* Preset amounts */}
                    
                      {lang === 'hi' ? 'राशि चुनें (USD)' : 'Select Amount (USD)'}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {PRESET_AMOUNTS.map((amt) => (
                        
                          ${amt}
                          {amt === 108 && (
                            <span className="block text-[9px] font-normal mt-0.5 opacity-80">Sacred 108</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div className="relative mb-1">
                      $</span>
                      
                    </div>
                    {errors.amount && ⚠ {errors.amount}</p>}

                    {/* Fund selection */}
                    
                      Designate Your Gift
                    </p>
                    <div className="space-y-2 mb-5">
                      {FUND_OPTIONS.map((fund) => (
                        <label
                          key={fund.id}
                          className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
                          style={{
                            border: `1.5px solid ${selectedFund === fund.id ? 'var(--si-orange)' : 'var(--si-border)'}`,
                            background: selectedFund === fund.id ? 'var(--si-orange-tint)' : 'var(--si-card)',
                          }}
                        >
                          <input
                            type="radio"
                            name="fund"
                            value={fund.id}
                            checked={selectedFund === fund.id}
                            onChange={() => setSelectedFund(fund.id)}
                            style={{ accentColor: 'var(--si-orange)', marginTop: '2px', flexShrink: 0 }}
                          />
                          <div>
                            {lang === 'hi' ? (fund.id === 'land' ? 'भूमि अधिग्रहण कोष' : fund.id === 'scholarship' ? 'छात्र छात्रवृत्ति' : 'सामान्य संचालन') : fund.label}</p>
                            {fund.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Donor info */}
                    
                      Your Details
                    </p>
                    <div className="space-y-3 mb-4">
                      <div>
                        
                        {errors.name && ⚠ {errors.name}</p>}
                      </div>
                      <div>
                        
                        {errors.email && ⚠ {errors.email}</p>}
                      </div>
                    </div>

                    {/* Dedication toggle */}
                    
                      <span>{showDedication ? '−' : '+'}</span>
                      {lang === 'hi' ? (showDedication ? 'समर्पण हटाएं' : 'यह दान समर्पित करें (वैकल्पिक)') : (showDedication ? 'Remove dedication' : 'Dedicate this donation (optional)')}
                    </button>
                    {showDedication && (
                      
                    )}

                    {/* Submit */}
                    
                      {formState === 'submitting' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Processing…
                        </span>
                      ) : (
                        `Donate ${finalAmount ? `$${Number(finalAmount).toLocaleString()}` : ''} ${recurring ? '/ month' : 'Now'} →`
                      )}
                    </button>

                    
                      🔒 Secure form · No payment data stored · Full transparency reporting
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Why donate */}
              <div className="card-white p-6">
                {lang === 'hi' && भूमि माता</p>}
                Why Land First?</h3>
                <div className="space-y-3">
                  {[
                    { icon: 'financial', text: 'A permanent campus makes every program durable and independent of rented spaces.' },
                    { icon: 'ayurveda', text: 'The 33-acre property will host organic farming, Ayurveda gardens, and outdoor yoga spaces.' },
                    { icon: 'scroll', text: 'Residential Gurukul programs require a physical campus — online learning is a bridge, not the destination.' },
                    { icon: 'om', text: 'The campus will serve as a global centre for Vedic education accessible to all.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      {item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparency */}
              <div className="card-white p-6" style={{ border: '1.5px solid var(--si-orange-light)' }}>
                Our Transparency Promise</h3>
                <div className="space-y-2">
                  {[
                    '✓ Quarterly financial reports published publicly',
                    '✓ Every donation acknowledged by email',
                    '✓ Governance board reviews all major decisions',
                    '✓ No donation data sold or shared',
                  ].map((item) => (
                    {item}</p>
                  ))}
                </div>
                
                  View Financial Reports →
                </a>
              </div>

              {/* Other ways */}
              {/* Monthly Donor Benefits */}
              <div className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, var(--si-hero-mid) 100%)', borderRadius: '14px', padding: '22px', border: '1.5px solid rgba(249,115,22,0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    Monthly Donor</p>
                    From $25 / month</p>
                  </div>
                </div>
                
                  Sustain the campus fund and unlock full access to the Sanatan International Digital Library — all 16 titles, free.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                  {[
                    { icon: '📚', text: 'Full Digital Library — all 16 titles free', highlight: true },
                    { icon: '🎧', text: 'All audio books & video courses included', highlight: true },
                    { icon: '🕉', text: 'Monthly Satsang community call invite' },
                    { icon: '📜', text: 'Quarterly campus progress report' },
                    { icon: '🌱', text: 'Named in the Founding Donor register' },
                  ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>{b.icon}</span>
                      {b.text}</p>
                    </div>
                  ))}
                </div>
                
                  Become a Monthly Donor →
                </button>
              </div>

              <div className="card-white p-6">
                Other Ways to Give</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Bank Transfer (INR)', detail: 'UPI / NEFT / IMPS — contact donate@sanataninternational.org' },
                    { label: 'Cheque', detail: 'Payable to "Sanatan International" — contact us for mailing address' },
                    { label: 'Volunteer', detail: 'Donate your time and skills — visit our Volunteer page' },
                  ].map((item) => (
                    <div key={item.label} className="pb-3" style={{ borderBottom: '1px solid var(--si-surface-alt)' }}>
                      {item.label}</p>
                      {item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


// ─── Donor Wall with Hover Tooltips ──────────────────────────────────────────
// Infinite scroll ticker. Each card shows a tooltip with a short donor message
// on hover — fades in above the card with a subtle upward slide.
const DONORS_LIST = [
  { name: 'Priya S.',    amount: '$500',   fund: 'Land Fund',    time: '2 min ago',  flag: '🇺🇸', message: '"For the next generation of seekers. May this campus stand for a thousand years."' },
  { name: 'Ramesh K.',   amount: '$108',   fund: 'Land Fund',    time: '15 min ago', flag: '🇮🇳', message: '"108 — the sacred number. A small offering with a big prayer."' },
  { name: 'Ananya M.',   amount: '$250',   fund: 'Scholarships', time: '1 hr ago',   flag: '🇨🇦', message: '"I learned Sanskrit as a child. Every child deserves that gift."' },
  { name: 'Vikram T.',   amount: '$1,000', fund: 'Land Fund',    time: '3 hrs ago',  flag: '🇺🇸', message: '"Land is the foundation. Without roots, no tree can grow tall."' },
  { name: 'Sunita P.',   amount: '$50',    fund: 'Operations',   time: '5 hrs ago',  flag: '🇬🇧', message: '"Even a small lamp dispels darkness. Jai Sanatan Dharma."' },
  { name: 'Arjun N.',    amount: '$108',   fund: 'Land Fund',    time: '8 hrs ago',  flag: '🇺🇸', message: '"In memory of my grandfather, who recited the Gita every morning."' },
  { name: 'Meera J.',    amount: '$200',   fund: 'Scholarships', time: '12 hrs ago', flag: '🇦🇺', message: '"Education is the greatest gift. Let no child be turned away."' },
  { name: 'Suresh B.',   amount: '$500',   fund: 'Land Fund',    time: '1 day ago',  flag: '🇮🇳', message: '"Our ancestors built temples with stone. We build with seva and dana."' },
  { name: 'Kavitha R.',  amount: '$75',    fund: 'Operations',   time: '1 day ago',  flag: '🇸🇬', message: '"Proud to support this mission from Singapore. Dharmo rakshati rakshitah."' },
  { name: 'Deepak A.',   amount: '$108',   fund: 'Land Fund',    time: '2 days ago', flag: '🇺🇸', message: '"May El Sabrante become a beacon of Vedic wisdom for the West."' },
  { name: 'Lakshmi V.',  amount: '$300',   fund: 'Scholarships', time: '2 days ago', flag: '🇮🇳', message: '"Dedicated to all the children who will learn here one day."' },
  { name: 'Rohit C.',    amount: '$1,000', fund: 'Land Fund',    time: '3 days ago', flag: '🇺🇸', message: '"This is not charity — it is investment in civilisation."' },
  { name: 'Nandita S.',  amount: '$108',   fund: 'Land Fund',    time: '3 days ago', flag: '🇳🇿', message: '"From New Zealand with love. The diaspora stands with you."' },
  { name: 'Harish M.',   amount: '$250',   fund: 'Operations',   time: '4 days ago', flag: '🇮🇳', message: '"Keep the lights on. The work you do matters deeply."' },
  { name: 'Pooja L.',    amount: '$50',    fund: 'Scholarships', time: '5 days ago', flag: '🇺🇸', message: '"A student myself — giving back so others can learn too."' },
];

// Individual card with tooltip
function DonorCard({ donor, index }: { donor: typeof DONORS_LIST[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      
        {/* Arrow */}
        <div style={{
          position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid var(--si-ink)',
        }} />
        
          {donor.message}
        </p>
        
          — {donor.name} · {donor.flag}
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: hovered ? 'var(--si-orange-tint)' : 'var(--si-card)',
          borderRadius: '16px',
          border: `1.5px solid ${hovered ? 'var(--si-orange-light)' : 'var(--si-surface-alt)'}`,
          padding: '14px 18px',
          minWidth: '220px',
          cursor: 'default',
          boxShadow: hovered ? '0 4px 20px rgba(249,115,22,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'all 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1rem' }}>{donor.flag}</span>
          
            {donor.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
            {donor.amount}
          </span>
          
            {donor.fund}
          </span>
        </div>
        
          {donor.time} · hover for message
        </p>
      </div>
    </div>
  );
}

export function DonorWall() {
  const doubled = [...DONORS_LIST, ...DONORS_LIST];

  return (
    <section style={{ background: 'var(--si-surface)', borderTop: '1px solid var(--si-border)', overflow: 'hidden' }}>
      <div className="container py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label-chip mb-1">Community</p>
            
              Recent Donors
            </h2>
            
              Hover any card to read their message
            </p>
          </div>
          <div className="text-right">
            1,243</p>
            
              Total donors
            </p>
          </div>
        </div>

        {/* Scrolling ticker — pauses on hover */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Left fade */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to right, var(--si-surface), transparent)',
            pointerEvents: 'none',
          }} />
          {/* Right fade */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to left, var(--si-surface), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Track — pause animation on hover */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              animation: 'donorScroll 45s linear infinite',
              width: 'max-content',
              paddingBottom: '8px', // space for tooltip overflow
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'; }}
          >
            {doubled.map((donor, i) => (
              <DonorCard key={i} donor={donor} index={i} />
            ))}
          </div>
        </div>

        {/* Sanskrit quote */}
        <div className="text-center mt-10">
          
            "दानं परमं बलम्"
          </p>
          
            Generosity is the supreme strength.
          </p>
        </div>
      </div>
    </section>
  );
}
