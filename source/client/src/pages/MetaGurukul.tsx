// Meta Gurukul — Dedicated landing page for the Meta Gurukul app
// Ancient wisdom. Daily. Live. Human. — A standalone app for Gurukul-based learning.
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import SpiritualParticles from '@/components/SpiritualParticles';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from "@/components/Image";
import { submitForm } from '@/lib/formDelivery';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}>{children}</div>;
}

// Countdown to next cohort (1st of next month)
function useCountdown() {
  const getNext = () => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    return next.getTime() - now.getTime();
  };
  const [ms, setMs] = useState(getNext);
  useEffect(() => {
    const t = setInterval(() => setMs(getNext()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hrs: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    sec: s % 60,
  };
}

const FEATURES = [
  {
    icon: '/Images/icon-gurukul-teacher_690a9246.png',
    title: 'Daily 20-Min Live Class',
    subtitle: 'Every morning. No recordings only.',
    desc: 'A credentialed teacher — not a chatbot — leads a focused 20-minute Zoom class every day. Sanskrit, Yoga, or Vedic Science. Real learning, real accountability.',
    color: 'var(--si-orange-ink)',
    badge: 'LIVE',
  },
  {
    icon: '/Images/icon-om_a07c1c41.png',
    title: 'Weekly Free Satsang',
    subtitle: 'Open to all. Every Sunday.',
    desc: 'A public, free weekly gathering for the broader community. The top-of-funnel that introduces families to the Gurukul system — no commitment required.',
    color: 'var(--si-success)',
    badge: 'FREE',
  },
  {
    icon: '/Images/icon-ayurveda-mortar_16433074.png',
    title: 'Monthly Cohort Drops',
    subtitle: 'Ages 9–16 · Three streams',
    desc: 'Structured monthly cohorts in Sanskrit, Yoga, and Vedic Science. Small groups, clear progression, and a community of learners growing together.',
    color: 'var(--si-info)',
    badge: 'COHORTS',
  },
  {
    icon: '/Images/icon-tech-lotus_d69ab604.png',
    title: 'Parent Dashboard',
    subtitle: 'Full visibility. Always.',
    desc: "Attendance records, progress tracking, teacher comments, and weekly video updates — all in one place. Parents stay connected to their child's learning journey.",
    color: '#8B5CF6',
    badge: 'PARENTS',
  },
];

const STREAMS = [
  {
    name: 'Sanskrit',
    devanagari: 'संस्कृत',
    color: 'var(--si-orange-ink)',
    desc: 'The mother of all languages. Students learn Devanagari script, basic grammar, and shloka recitation — building a direct connection to the original texts.',
    weeks: ['Devanagari script mastery', 'Basic Sandhi & Vibhakti', 'Shloka recitation — Bhagavad Gita Ch.1', 'Vocabulary building — 200 core words'],
    level: 'Ages 9–16',
    duration: '12 weeks',
    
  },
  {
    name: 'Yoga',
    devanagari: 'योग',
    color: 'var(--si-success)',
    desc: 'Not exercise. A complete science of the body-mind system. Students learn asana, pranayama, and the philosophical framework from Patanjali\'s Yoga Sutras.',
    weeks: ['Surya Namaskar & alignment', 'Pranayama — Nadi Shodhana', 'Yoga Sutras — Samadhi Pada', 'Meditation introduction'],
    level: 'Ages 9–16',
    duration: '12 weeks',
    
  },
  {
    name: 'Vedic Science',
    devanagari: 'वैदिक विज्ञान',
    color: 'var(--si-info)',
    desc: 'Cosmology, mathematics, astronomy, and philosophy from the Vedic tradition. Students discover that ancient India was doing advanced science millennia before the West.',
    weeks: ['Vedic mathematics — Sutras', 'Astronomy — Nakshatras & Graha', 'Cosmology — Pancha Bhuta', 'Ethics — Dharma & Karma framework'],
    level: 'Ages 9–16',
    duration: '12 weeks',
    
  },
];

const EBOOKS_PREVIEW = [
  { title: 'Bhagavad Gita', devanagari: 'भगवद्गीता', category: 'Core Vedic', priority: 'P0' },
  { title: 'Isha Upanishad', devanagari: 'ईशावास्योपनिषद्', category: 'Upanishads', priority: 'P0' },
  { title: 'Yoga Sutras of Patanjali', devanagari: 'योगसूत्र', category: 'Yoga', priority: 'P0' },
  { title: 'Ramayana (Valmiki)', devanagari: 'रामायण', category: 'Itihasa', priority: 'P1' },
  { title: 'Kena Upanishad', devanagari: 'केनोपनिषद्', category: 'Upanishads', priority: 'P1' },
  { title: 'Arthashastra', devanagari: 'अर्थशास्त्र', category: 'Shastra', priority: 'P1' },
];

export default function MetaGurukul() {
  const { t, lang } = useLanguage();
  const [activeStream, setActiveStream] = useState(0);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const countdown = useCountdown();

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    const result = await submitForm({
      formName: 'Meta Gurukul waitlist',
      inbox: 'gurukul',
      data: { email },
    });
    if (result.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(result.error);
    }
  };

  return (
    <Layout>
      <PageMeta
        title="Meta Gurukul — Ancient Wisdom. Daily. Live. Human."
        description="Meta Gurukul is a standalone app bringing daily live Gurukul classes, weekly free Satsang, monthly cohorts for children aged 9–16, and a digital library of Vedic scriptures — directly to your family."
        url="/gurukul/meta-gurukul"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul/foundation' }, { name: 'Meta Gurukul', href: '/gurukul/meta-gurukul' }]} />

      {/* ── HERO ── */}
      <section className="on-dark relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, #1A0A00 50%, var(--si-hero-dark) 100%)' }}>
        <SpiritualParticles />

        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container max-w-6xl relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  GURUKUL · APP</span>
                  {t('mg.soon')}</span>
                </div>
                
                  Meta<br />
                  <span className="text-si-orange-ink">{t('mg.title2')}</span>
                </h1>
                <p className="font-display text-xl mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                  Ancient wisdom. Daily. Live. Human.
                </p>
                
                  Not a course platform. Not pre-recorded content. A real Gurukul — with credentialed teachers, live Zoom classes, monthly cohorts for children, and a complete digital library of Vedic scriptures.
                </p>

                {/* Countdown */}
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                  
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--si-orange)', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    NEXT COHORT · SEP 1, 2026
                  </span>
                  {[['DAYS', countdown.days], ['HRS', countdown.hrs], ['MIN', countdown.min], ['SEC', countdown.sec]].map(([label, val]) => (
                    <div key={label as string} style={{ textAlign: 'center', minWidth: '44px' }}>
                      {String(val).padStart(2, '0')}</p>
                      {label}</p>
                    </div>
                  ))}
                </div>

                {/* Waitlist form */}
                {status === 'success' ? (
                  <div style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '14px', padding: '20px 24px', animation: 'fadeIn 400ms ease' }}>
                    🙏 You're on the list!</p>
                    We'll notify you when Meta Gurukul launches. धन्यवाद</span></p>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlist}>
                    <div className="flex gap-3 flex-col sm:flex-row">
                      
                      
                        {status === 'loading' ? (
                          <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Joining…</>
                        ) : 'Join Waitlist →'}
                      </button>
                    </div>
                    {errorMsg && {errorMsg}</p>}
                    {status === 'error' && {errorMsg} Try again</button></p>}
                    No spam. Unsubscribe anytime. We launch Sep 2026.</p>
                  </form>
                )}
              </Reveal>
            </div>

            {/* Right: app preview card */}
           <Reveal delay={200}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
                {/* App mockup image */}
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/Images/meta-gurukul-app_6104d2a1.jpg" alt="Meta Gurukul App" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(15,25,35,0.8) 100%)' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    ● LIVE NOW</span>
                  </div>
                </div>
                <div style={{ padding: '24px 28px 28px' }}>
                {/* Mock app header */}
                <div className="flex items-center gap-3 mb-6">
                  <Image src="/Images/live-site-logo_9a0f956f.png" alt="Meta Gurukul" style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.9)', borderRadius: '10px', padding: '4px' }} />
                  <div>
                    Meta Gurukul</p>
                    Daily Live Classes</p>
                  </div>
                  ● LIVE NOW</span>
                </div>

                {/* Today's schedule */}
                TODAY'S SCHEDULE</p>
                {[
                  { time: '7:00 AM', title: 'Morning Shloka & Pranayama', teacher: 'Acharya Ramesh', tag: 'Sanskrit', live: true },
                  { time: '4:00 PM', title: 'Yoga Science — Sun Salutation', teacher: 'Dr. Meera Iyer', tag: 'Yoga', live: false },
                  { time: '6:00 PM', title: 'Weekly Satsang — Open to All', teacher: 'Swami Dharmananda', tag: 'Free', live: false },
                ].map((cls, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px 16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', border: cls.live ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                    {cls.time}</p>
                    <div style={{ flex: 1 }}>
                      {cls.title}</p>
                      {cls.teacher}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cls.tag}</span>
                      {cls.live && ● LIVE</span>}
                    </div>
                  </div>
                ))}

               {/* Stats row */}
               <div className="grid grid-cols-3 gap-3 mt-6">
                 {[['847', 'Students'], ['12', 'Teachers'], ['3', 'Streams']].map(([n, l]) => (
                   <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 8px' }}>
                     {n}</p>
                     {l}</p>
                   </div>
                 ))}
               </div>
              </div>{/* end padding wrapper */}
             </div>
           </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="label-chip mb-3">App Features</p>
              
                Everything a Gurukul needs.<br />
                <span className="text-si-orange-ink">In your pocket.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div style={{ background: 'var(--si-card)', borderRadius: '20px', padding: '32px', borderLeft: `4px solid ${f.color}`, height: '100%', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 16px 40px ${f.color}18`; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 280ms cubic-bezier(0.23,1,0.32,1)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.15) rotate(-5deg)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) rotate(0deg)'; }}>
                      <Image src={f.icon} alt={f.title} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {f.title}</p>
                        {f.badge}</span>
                      </div>
                      {f.subtitle}</p>
                    </div>
                  </div>
                  {f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE STREAMS ── */}
      <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-12">
              Monthly Cohorts</p>
              Three streams. One tradition.</h2>
              
                Children aged 9–16 choose their stream. Monthly cohort drops. 12-week structured curriculum.
              </p>
            </div>
          </Reveal>

          {/* Stream tabs */}
          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {STREAMS.map((s, i) => (
              
                <span className="font-devanagari mr-2">{s.devanagari}</span>{s.name}
              </button>
            ))}
          </div>

          {/* Active stream detail */}
          <div key={activeStream} style={{ animation: 'fadeIn 300ms ease' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${STREAMS[activeStream].color}30`, borderRadius: '20px', padding: '32px' }}>
                <p className="font-devanagari text-4xl mb-2" style={{ color: STREAMS[activeStream].color }}>{STREAMS[activeStream].devanagari}</p>
                {STREAMS[activeStream].name}</h3>
                {STREAMS[activeStream].desc}</p>
                <div className="flex gap-4 flex-wrap">
                  {[['Level', STREAMS[activeStream].level], ['Duration', STREAMS[activeStream].duration]].map(([k, v]) => (
                    <div key={k as string} style={{ background: STREAMS[activeStream].color + '12', border: `1px solid ${STREAMS[activeStream].color}30`, borderRadius: '10px', padding: '10px 16px' }}>
                      {k}</p>
                      {v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                12-WEEK CURRICULUM HIGHLIGHTS</p>
                <div className="space-y-3">
                  {STREAMS[activeStream].weeks.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px 16px' }}>
                      W{(i + 1) * 3}</span>
                      {w}</p>
                    </div>
                  ))}
                </div>
                
                  Apply for {STREAMS[activeStream].name} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIGITAL LIBRARY PREVIEW ── */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="label-chip mb-3">Digital Library</p>
                
                  500+ Vedic texts.<br /><span className="text-si-orange-ink">In your hands.</span>
                </h2>
              </div>
              
                Browse full library →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EBOOKS_PREVIEW.map((book, i) => (
              <Reveal key={book.title} delay={i * 60}>
                <div style={{ background: 'var(--si-card)', borderRadius: '14px', padding: '20px', borderTop: '3px solid var(--si-orange)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 24px rgba(249,115,22,0.12)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                  {book.devanagari}</p>
                  {book.title}</p>
                  <div className="flex items-center gap-2">
                    {book.category}</span>
                    {book.priority}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARENT DASHBOARD ── */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="label-chip mb-3">Parent Dashboard</p>
              
                Full visibility.<br /><span className="text-si-orange-ink">Always.</span>
              </h2>
              
                Parents are not passengers. The Meta Gurukul parent dashboard gives you real-time visibility into your child's learning — attendance, progress, teacher comments, and weekly video updates.
              </p>
              <div className="space-y-3">
                {[
                  'Attendance tracking — daily class check-ins',
                  'Progress milestones — per stream, per week',
                  'Teacher comments — direct from the Acharya',
                  'Weekly video update — 2-min summary from teacher',
                  'Direct messaging — ask questions anytime',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '3px' }}><polyline points="20 6 9 17 4 12"/></svg>
                    {item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="on-dark" style={{ background: 'var(--si-hero-dark)', borderRadius: '24px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-6">
                  Arjun's Progress</p>
                  Week 8 of 12</span>
                </div>
                {[
                  { label: 'Sanskrit', pct: 72, color: 'var(--si-orange-ink)' },
                  { label: 'Attendance', pct: 91, color: 'var(--si-success)' },
                  { label: 'Assignments', pct: 85, color: 'var(--si-info)' },
                ].map((bar) => (
                  <div key={bar.label} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      {bar.label}</p>
                      {bar.pct}%</p>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: '3px', transition: 'width 1s cubic-bezier(0.23,1,0.32,1)' }} />
                    </div>
                  </div>
                ))}
                <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '12px', padding: '14px 16px', marginTop: '20px' }}>
                  TEACHER NOTE · ACHARYA RAMESH</p>
                  "Arjun's shloka recitation has improved significantly this week. His pronunciation of the visarga is now correct. Excellent focus."</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--si-orange) 0%, #EA580C 100%)' }} className="relative overflow-hidden">
        <SpiritualParticles />
        <div className="container py-20 text-center max-w-3xl relative z-10">
          <Reveal>
            <p className="font-devanagari text-3xl mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>विद्या ददाति विनयम्</p>
            
              Be among the first families.
            </h2>
            
              Meta Gurukul launches September 2026. Join the waitlist and get early access, founding member pricing, and a free first month.
            </p>
            <div className="flex gap-3 justify-center flex-col sm:flex-row max-w-md mx-auto">
              
                Apply Now →
              </Link>
              
                Learn the Philosophy
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
}
