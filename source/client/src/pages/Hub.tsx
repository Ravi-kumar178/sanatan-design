// Sanatan International — The Hub (Unified Page)
// Combines: About the Centre, Vision & Mission, Founders & Advisors
// Section-based navigation with smooth scroll, sticky sub-nav, animated reveals
// Ashram Stone aesthetic: dark hero, warm stone sections, saffron accents
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from "@/components/Image";

// ─── Media outlets for the "Featured In" strip ────────────────────────────────
const MEDIA_OUTLETS = [
  { name: 'Times of India',     abbr: 'TOI',  color: '#E8001C' },
  { name: 'Hindustan Times',    abbr: 'HT',   color: '#E31837' },
  { name: 'NRI Pulse',          abbr: 'NRI',  color: '#1A56DB' },
  { name: 'India Abroad',       abbr: 'IA',   color: '#0A6640' },
  { name: 'Desi Talk',          abbr: 'DT',   color: 'var(--si-violet)' },
  { name: 'The Hindu',          abbr: 'TH',   color: '#1A1A1A' },
  { name: 'India West',         abbr: 'IW',   color: 'var(--si-amber)' },
  { name: 'Sikh Times',         abbr: 'ST',   color: 'var(--si-info)' },
];

// ─── Interview Request Modal ──────────────────────────────────────────────────
function InterviewModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ journalist: '', publication: '', topic: '', date: '', message: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.journalist.trim()) e.journalist = 'Please enter your name.';
    if (!form.publication.trim()) e.publication = 'Please enter your publication.';
    if (!form.topic.trim()) e.topic = 'Please describe the topic.';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setState('loading');
    await new Promise(r => setTimeout(r, 1400));
    setState('success');
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: `1.5px solid ${errors[field] ? 'var(--si-danger)' : 'var(--si-border)'}`,
    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--si-text)',
    outline: 'none', transition: 'border-color 200ms ease, box-shadow 200ms ease',
    background: 'var(--si-card)',
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--si-card)', borderRadius: '20px', width: '100%', maxWidth: '520px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        animation: 'successReveal 0.25s cubic-bezier(0.23,1,0.32,1)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="on-dark" style={{ background: 'var(--si-ink)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            Press & Media</p>
            Request an Interview</h3>
          </div>
          ×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {state === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--si-success-tint)', border: '2px solid var(--si-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              Request Received</h4>
              
                Thank you, {form.journalist}. Our press team will respond to <strong>{form.publication}</strong> within 24–48 hours.
              </p>
              
                "सत्यमेव जयते — Truth alone triumphs."
              </p>
              Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  Journalist Name *</label>
                  <input id="hub-f1" value={form.journalist} onChange={e => setForm({...form, journalist: e.target.value})} placeholder="Your full name" style={inputStyle('journalist')}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.journalist ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                  />
                  {errors.journalist && {errors.journalist}</p>}
                </div>
                <div>
                  Publication *</label>
                  <input id="hub-f2" value={form.publication} onChange={e => setForm({...form, publication: e.target.value})} placeholder="Your media outlet" style={inputStyle('publication')}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.publication ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                  />
                  {errors.publication && {errors.publication}</p>}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                Interview Topic *</label>
                <input id="hub-f3" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} placeholder="e.g. Gurukul education, Land Fund campaign, Ayurveda research…" style={inputStyle('topic')}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.topic ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                {errors.topic && {errors.topic}</p>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                Preferred Date (optional)</label>
                <input id="hub-f4" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inputStyle('date')}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                Additional Notes</label>
                <textarea id="hub-f5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} placeholder="Any additional context or specific questions…" style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '80px' }}
                  onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                  onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--si-border)'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none'; }}
                />
              </div>
              {state === 'error' && (
                <div style={{ background: 'var(--si-danger-tint)', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
                  Something went wrong. Please email <a className="text-si-orange-ink" href="mailto:press@sanataninternational.org">press@sanataninternational.org</a> directly.</p>
                </div>
              )}
              
                {state === 'loading' ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting…</>
                ) : 'Submit Interview Request →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Section IDs ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'about',    label: 'About the Centre' },
  { id: 'vision',   label: 'Vision & Mission' },
  { id: 'founders', label: 'Founders & Advisors' },
];

// ─── Sticky Sub-Nav ───────────────────────────────────────────────────────────
function SubNav({ active }: { active: string }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div style={{
      position: 'sticky', top: '64px', zIndex: 40,
      background: 'var(--si-card)', borderBottom: '1px solid var(--si-border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <div className="container">
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Animated reveal hook ─────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Founders data ────────────────────────────────────────────────────────────
const FOUNDERS = [
  {
    name: 'Pankaj K. Tyagi',
    role: 'Founder & Technology Director',
    bio: 'Pankaj K. Tyagi is the founder of Inerica Systems, a Silicon Valley-based technology automation company. A visionary technologist with deep roots in Sanatan Dharma, Pankaj brings decades of enterprise software expertise to the mission of building ethical, human-centric digital infrastructure for Vedic education. His belief that technology must serve the human spirit — not exploit it — is the philosophical foundation of the Digital Welfare Suite and the Meta Gurukul platform.',
    quote: '"Technology built without dharma is just a faster path to confusion."',
    initials: 'PT',
    portrait: '/Images/founder-pankaj_ad07290f.jpg',
    color: 'var(--si-orange-ink)',
  },
  {
    name: 'Dr. Vineeta Kapoor',
    role: 'Community Director',
    bio: 'Dr. Vineeta Kapoor is a distinguished Obstetrician and Gynaecologist based in New Delhi, holding MBBS and MS (Obstetrics & Gynaecology) qualifications. With over 15 years of clinical experience at Eden Hospital and her own practice, she is rated 97% by her patients. Dr. Kapoor brings her deep commitment to women\'s health, preventive care, and community wellbeing to Sanatan International — championing the integration of Ayurvedic principles into modern healthcare and leading the organisation\'s community outreach across India.',
    quote: '"True health is not the absence of disease — it is the presence of dharma in daily life."',
    initials: 'VK',
    portrait: '/Images/founder-vineeta_ac914354.jpg',
    color: 'var(--si-success)',
  },
  {
    name: 'Pandit Sumit Sharma Ji',
    role: 'Spiritual Director',
    bio: 'Pandit Sumit Sharma Ji is a practising Sanatan Guru with over 20 years of dedicated study and teaching of Vedic philosophy, Sanskrit, and ritual tradition. Trained in the classical Gurukul lineage, he has guided thousands of students and families across India and the diaspora in understanding and living the Sanatan way of life. His guidance forms the spiritual backbone of every programme, curriculum, and community initiative at Sanatan International.',
    quote: '"ज्ञानं परमं बलम् — Knowledge is the supreme strength. All else follows from it."',
    initials: 'SS',
    portrait: '/Images/founder-pandit_533a2a4e.jpg',
    color: 'var(--si-amber)',
  },
  {
    name: 'Nitan Sondhi',
    role: 'Co-Founder',
    bio: 'Nitan Sondhi is a Bay Area entrepreneur and community builder who runs his own driving school in the region. A man of action and deep community trust, Nitan has been instrumental in establishing Sanatan International\'s ground-level presence in Northern California — building local networks, coordinating volunteer efforts, and ensuring the organisation\'s vision translates into tangible, on-the-ground reality. His practical wisdom and grassroots relationships are the bridge between the organisation\'s global mission and its local impact.',
    quote: '"Every great movement begins with one person who shows up — every single day."',
    initials: 'NS',
    portrait: '/Images/founder-nitan_0e7da35f.jpg',
    color: 'var(--si-info)',
  },
];

const ADVISORS = [
  { name: 'Prof. R. Ganesh', role: 'Sanskrit & Vedic Studies', org: 'Rashtriya Sanskrit Sansthan, New Delhi', portrait: '/Images/advisor-1_56a7a0c3.jpg', gender: 'M' },
  { name: 'Dr. Vasant Lad', role: 'Ayurveda Advisory', org: 'Ayurvedic Institute, Albuquerque, NM', portrait: '/Images/advisor-2_49ea6edb.jpg', gender: 'F' },
  { name: 'Smt. Lalitha Iyer', role: 'Governance & Legal', org: 'Former High Court Judge, Chennai', portrait: '/Images/advisor-3_82664cfd.jpg', gender: 'M' },
  { name: 'Dr. Rajiv Malhotra', role: 'Strategic Vision', org: 'Infinity Foundation, Princeton, NJ', portrait: '/Images/advisor-4_15c3e5f8.jpg', gender: 'F' },
  { name: 'Shri Mohan Bhagwat', role: 'Cultural Heritage', org: 'Dharma Civilisation Foundation', portrait: '/Images/advisor-5_5c0c7714.jpg', gender: 'M' },
  { name: 'Dr. Aparna Krishnan', role: 'Community Welfare', org: 'Rural India Support Trust', portrait: '/Images/advisor-6_9d9215df.jpg', gender: 'F' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Hub() {
  const { t, lang } = useLanguage();
  const [activeSection, setActiveSection] = useState('about');
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 130) setActiveSection(s.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const about = useReveal();
  const vision = useReveal();
  const founders = useReveal();
  const advisors = useReveal();

  return (
    <>
    <Layout>
      <PageMeta
        title="The Hub — About, Vision & Founders"
        description="Learn about Sanatan International — our founding story, vision for a Vedic campus, mission pillars, and the founders and advisors guiding the Centre for Human Flourishing."
        url="/hub"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'The Hub', href: '/hub' }]} />

      {/* ── Hero ── */}
      <section className="section-dark pt-32 pb-20 relative overflow-hidden texture-dark">
        {/* Animated background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 20% 50%, var(--si-orange) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--si-orange) 0%, transparent 40%)',
        }} />
        <div className="container max-w-4xl relative">
          <p className="label-chip mb-4">The Hub</p>
          
            Centre for<br />
            <span className="text-si-orange-ink">Human Flourishing</span>
          </h1>
          
            We are building a permanent institution where ancient Vedic wisdom meets modern execution — for the benefit of all humanity, not just a few.
          </p>
          {/* Section jump links */}
          <div className="flex flex-wrap gap-3">
            {SECTIONS.map((s) => (
              
                {s.label} ↓
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Sub-Nav ── */}
      <SubNav active={activeSection} />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: ABOUT THE CENTRE
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="about" style={{ background: 'var(--si-card)', scrollMarginTop: '120px' }}>
        <div
          ref={about.ref}
          className="container py-20"
          style={{
            opacity: about.visible ? 1 : 0,
            transform: about.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label-chip mb-3">{t('nav.hub.about')}</p>
              
                Ancient wisdom.<br />
                <span className="text-si-orange-ink">Modern execution.</span><br />
                Public benefit.
              </h2>
              
                Sanatan International is a nonprofit Centre for Human Flourishing — building a permanent 33-acre campus in El Sabrante, California, to house Gurukul-based education, Ayurveda research, ethical technology, and community welfare programmes.
              </p>
              
                We are not a temple, a yoga studio, or a cultural club. We are an institution — governed by a transparent board, funded by community donations, and accountable to the public. Our programmes serve students from age 8 to 80, across the United States, India, Canada, and beyond.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: '2024', l: 'Founded' },
                  { n: '33 Acres', l: 'Campus Goal' },
                  { n: '4', l: 'Core Programmes' },
                  { n: '3', l: 'Bay Area Regions' },
                ].map((s) => (
                  <div key={s.l} className="card-white p-4 text-center">
                    {s.n}</p>
                    {s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual: three pillars graphic */}
            <div className="space-y-4">
              {[
                { icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="10" r="4" fill="#F97316" stroke="none" opacity="0.7"/><path d="M14 22 Q20 18 26 22"/><path d="M20 22 L20 32"/><path d="M14 28 L20 32 L26 28"/><rect x="8" y="24" width="8" height="6" rx="1" fill="#F97316" fillOpacity="0.3"/><line x1="12" y1="24" x2="12" y2="30"/></svg>), title: 'Gurukul Education', desc: 'Four-level Sanskrit, Yoga, and Vedic sciences curriculum for all ages. Taught by trained Acharyas, not algorithms.', color: 'var(--si-orange-tint)', accent: 'var(--si-orange-ink)' },
                { icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 28 Q10 34 20 34 Q30 34 30 28 L28 20 H12 Z" fill="#F97316" fillOpacity="0.15"/><line x1="20" y1="10" x2="20" y2="24" strokeWidth="3"/><ellipse cx="20" cy="9" rx="3" ry="2" fill="#F97316"/><path d="M25 16 Q32 12 30 20 Q25 18 25 16Z" fill="#F97316" fillOpacity="0.5"/></svg>), title: 'Ayurveda Research', desc: 'Classical Ayurvedic medicine applied to modern preventive health. Evidence-based protocols, not wellness trends.', color: 'var(--si-success-tint)', accent: 'var(--si-success)' },
                { icon: '📱', title: 'Ethical Technology', desc: 'Apps designed to protect human attention and dignity — no ads, no tracking, no manipulation.', color: 'var(--si-info-tint)', accent: 'var(--si-info)' },
                { icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="14" r="4" fill="#F97316" fillOpacity="0.2"/><circle cx="10" cy="20" r="3.5" fill="#F97316" fillOpacity="0.2"/><circle cx="30" cy="20" r="3.5" fill="#F97316" fillOpacity="0.2"/><path d="M14 26 Q14 22 20 22 Q26 22 26 26"/></svg>), title: 'Community Welfare', desc: 'Volunteer networks, elder protection, and community circles across El Sabrante, Oakland, and San Jose.', color: '#FDF4FF', accent: 'var(--si-violet-deep)' },
              ].map((p, i) => (
                <div
                  key={p.title}
                  className="flex items-start gap-4 card-white p-5"
                  style={{
                    opacity: about.visible ? 1 : 0,
                    transform: about.visible ? 'translateX(0)' : 'translateX(30px)',
                    transition: `opacity 600ms ease ${i * 100 + 300}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${i * 100 + 300}ms`,
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: p.color }}>
                    {typeof p.icon === 'string' && p.icon.startsWith('/') ? <Image src={p.icon} alt="" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /> : p.icon}
                  </div>
                  <div>
                    {p.title}</h3>
                    {p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: VISION & MISSION
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="vision" style={{ background: 'var(--si-surface)', scrollMarginTop: '120px' }}>
        <div
          ref={vision.ref}
          className="container py-20"
          style={{
            opacity: vision.visible ? 1 : 0,
            transform: vision.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="text-center mb-14">
            <p className="label-chip mb-3">Vision & Mission</p>
            
              What we are building<br />
              <span className="text-si-orange-ink">and why it matters</span>
            </h2>
            "सर्वे भवन्तु सुखिनः"</p>
            
              May all beings be happy.
            </p>
          </div>

          {/* Vision statement */}
          <div className="max-w-3xl mx-auto mb-14">
            <div className="card-white p-8 text-center" style={{ borderLeft: '4px solid var(--si-orange)' }}>
              
                "A world where every human being has access to the tools of inner development — regardless of religion, nationality, or economic status."
              </p>
              Our Vision Statement</p>
            </div>
          </div>

          {/* Mission pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {[
              {
                num: '01', title: 'Preserve & Transmit',
                desc: 'Preserve the living traditions of Sanskrit, Yoga, Ayurveda, and Vedic sciences — and transmit them to the next generation through structured, accessible Gurukul programmes.',
                icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="24" height="28" rx="3" fill="#F97316" fillOpacity="0.1"/><line x1="13" y1="15" x2="27" y2="15"/><line x1="13" y1="20" x2="27" y2="20"/><line x1="13" y1="25" x2="22" y2="25"/></svg>),
              },
              {
                num: '02', title: 'Research & Apply',
                desc: 'Conduct rigorous, evidence-based research into classical Indian sciences and apply findings to modern challenges in health, education, technology, and governance.',
                icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="9" fill="#F97316" fillOpacity="0.08"/><line x1="24.5" y1="24.5" x2="34" y2="34" strokeWidth="3"/><line x1="14" y1="18" x2="22" y2="18"/><line x1="18" y1="14" x2="18" y2="22"/></svg>),
              },
              {
                num: '03', title: 'Serve & Protect',
                desc: 'Serve vulnerable communities — elders, children, and the economically marginalised — through free programmes, ethical technology, and organised volunteer networks.',
                icon: '🛡️',
              },
            ].map((m, i) => (
              <div
                key={m.num}
                className="card-white p-7"
                style={{
                  opacity: vision.visible ? 1 : 0,
                  transform: vision.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 600ms ease ${i * 150}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${i * 150}ms`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display font-black text-4xl" style={{ color: 'var(--si-surface)', WebkitTextStroke: '1px var(--si-orange)' }}>{m.num}</span>
                  <span className="text-2xl">{typeof m.icon === 'string' && m.icon.startsWith('/') ? <Image src={m.icon} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} /> : m.icon}</span>
                </div>
                {m.title}</h3>
                {m.desc}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="on-dark" style={{ background: 'var(--si-ink)', borderRadius: '24px', padding: '40px 32px' }}>
            Our Core Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { v: 'Satya', t: 'Truth', d: 'We speak and act with radical honesty — in our finances, our governance, and our programmes.' },
                { v: 'Seva', t: 'Service', d: 'Every programme, every role, every decision is oriented toward the welfare of others.' },
                { v: 'Tapas', t: 'Discipline', d: 'We build slowly, carefully, and with long-term vision — not for quick impact metrics.' },
                { v: 'Ahimsa', t: 'Non-harm', d: 'Our technology, our food, our practices — all designed to protect life, not exploit it.' },
              ].map((val) => (
                <div key={val.v} className="text-center p-4">
                  {val.v}</p>
                  {val.t}</p>
                  {val.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: FOUNDERS & ADVISORS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="founders" style={{ background: 'var(--si-card)', scrollMarginTop: '120px' }}>
        <div
          ref={founders.ref}
          className="container py-20"
          style={{
            opacity: founders.visible ? 1 : 0,
            transform: founders.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="text-center mb-14">
            <p className="label-chip mb-3">{t('nav.hub.founders')}</p>
            
              The people behind<br />
              <span className="text-si-orange-ink">the mission</span>
            </h2>
            
              For media inquiries, interview requests, and editorial coverage
            </p>
            <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
              <PressKitButton />
              
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                press@sanataninternational.org
              </a>
              
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Request an Interview
              </button>
            </div>

            {/* ── Featured In media strip ── */}
            <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid var(--si-surface-alt)' }}>
              
                As featured in &amp; media partners
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                {MEDIA_OUTLETS.map((outlet) => (
                  <div
                    key={outlet.name}
                    title={outlet.name}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '7px 14px', borderRadius: '8px',
                      border: '1.5px solid var(--si-surface-alt)', background: 'var(--si-card)',
                      transition: 'all 200ms ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = outlet.color; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 8px ${outlet.color}22`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--si-surface-alt)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                  >
                    
                      {outlet.abbr}
                    </span>
                    
                      {outlet.name}
                    </span>
                  </div>
                ))}
              </div>
              
                * Aspirational media partners — coverage pending confirmation
              </p>
            </div>
          </div>

          {/* Founders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {FOUNDERS.map((f, i) => (
              <div
                key={f.name}
                className="card-white p-8"
                style={{
                  opacity: founders.visible ? 1 : 0,
                  transform: founders.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 600ms ease ${i * 120}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${i * 120}ms`,
                }}
              >
                {/* Avatar + name */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${f.color}30` }}>
                    <Image
                      src={f.portrait}
                      alt={f.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.background = f.color + '18';
                          parent.style.display = 'flex';
                          parent.style.alignItems = 'center';
                          parent.style.justifyContent = 'center';
                          parent.innerHTML = `<span style="color:${f.color};font-family:Playfair Display,serif;font-size:1.25rem;font-weight:700">${f.initials}</span>`;
                        }
                      }}
                    />
                  </div>
                  <div>
                    {f.name}</h3>
                    {f.role}</p>
                  </div>
                </div>
                {f.bio}</p>
                
                  {f.quote}
                </blockquote>
              </div>
            ))}
          </div>

          {/* Advisors */}
          <div
            ref={advisors.ref}
            style={{
              opacity: advisors.visible ? 1 : 0,
              transform: advisors.visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            Advisory Board</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADVISORS.map((a, i) => (
                <div
                  key={a.name}
                  className="card-white p-5 flex items-start gap-4"
                  style={{
                    opacity: advisors.visible ? 1 : 0,
                    transform: advisors.visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 500ms ease ${i * 80}ms, transform 500ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1.5px solid var(--si-orange-light)' }}>
                    <Image
                      src={a.portrait}
                      alt={a.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.background = 'var(--si-orange-tint)';
                          parent.style.display = 'flex';
                          parent.style.alignItems = 'center';
                          parent.style.justifyContent = 'center';
                          const initials = a.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2);
                          parent.innerHTML = `<span style="color:#F97316;font-family:Playfair Display,serif;font-size:0.875rem;font-weight:700">${initials}</span>`;
                        }
                      }}
                    />
                  </div>
                  <div>
                    {a.name}</p>
                    {a.role}</p>
                    {a.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
        <div className="container py-14 text-center">
          "धर्मो रक्षति रक्षितः"</p>
          
            Dharma protects those who protect it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-orange">Support the Mission</Link>
            
              Contact Us →
            </Link>
          </div>
        </div>
      </section>

      <RelatedPages current="/hub" picks={['/gurukul', '/donate', '/contact']} />
    </Layout>
    {showInterviewModal && <InterviewModal onClose={() => setShowInterviewModal(false)} />}
    </>
  );
}

// ─── Press Kit Button ─────────────────────────────────────────────────────────
function PressKitButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [progress, setProgress] = useState('');

  const handleDownload = useCallback(async () => {
    if (state === 'loading') return;
    setState('loading');
    try {
      await downloadPressKit((step, _pct) => setProgress(step));
      setState('done');
      setTimeout(() => setState('idle'), 4000);
    } catch {
      setState('idle');
    }
  }, [state]);

  return (
    
      {state === 'loading' ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          {progress || 'Preparing…'}
        </>
      ) : state === 'done' ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Downloaded!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Press Kit (ZIP)
        </>
      )}
    </button>
  );
}
import { downloadPressKit } from '@/lib/pressKit';
