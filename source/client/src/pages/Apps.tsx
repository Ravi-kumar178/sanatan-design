// Sanatan International — Digital Welfare Suite
// Design: Dark hero, app feature cards with wellbeing image, use-case stories, ethical design principles
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import PageMeta from '@/components/PageMeta';
import RelatedPages from '@/components/RelatedPages';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from "@/components/Image";

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
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: `opacity 550ms ease ${delay}ms, transform 550ms cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}>{children}</div>;
}

const APPS = [
  {
    name: 'DhyanaPath',
    desc: 'Meditation Training',
    tagline: 'No streaks. No scores. Just practice.',
    detail: 'A non-addictive meditation training app based on classical dhyana frameworks from the Yoga Sutras. Structured 8-week programmes, guided sessions from credentialed teachers, and offline-first design.',
    shloka: 'तत्र प्रत्ययैकतानता ध्यानम्',
    src: 'Yoga Sutra 3.2',
    features: ['8-week structured programmes', 'Offline-first design', 'No engagement manipulation', 'Teacher-guided sessions'],
    color: 'var(--si-info)', bg: 'var(--si-info-tint)',
    status: 'Beta',
  },
  {
    name: 'PranaBalance',
    desc: 'Breath & Anxiety Regulation',
    tagline: 'Ancient breath science, clinically grounded.',
    detail: 'Pranayama-based breathing protocols for anxiety, stress, and emotional regulation. Includes Nadi Shodhana, Bhramari, Kapalabhati, and Ujjayi with biofeedback integration.',
    shloka: 'प्राणायामः',
    src: 'Yoga Sutra 2.49',
    features: ['6 classical pranayama techniques', 'Biofeedback integration', 'Anxiety & stress protocols', 'Sleep preparation routines'],
    color: 'var(--si-success)', bg: 'var(--si-success-tint)',
    status: 'Beta',
  },
  {
    name: 'ChittaShuddhi',
    desc: 'Emotional Regulation',
    tagline: 'Purify the mind, not just the mood.',
    detail: 'Tools for emotional purification and mental clarity based on Patanjali\'s chitta-vritti framework. Includes journaling, reflection prompts, and emotional pattern tracking.',
    shloka: 'रागद्वेषवियोगः',
    src: 'Yoga Sutra 2.7-8',
    features: ['Chitta-vritti pattern tracking', 'Guided reflection prompts', 'Emotional purification tools', 'Classical psychology framework'],
    color: 'var(--si-violet-deep)', bg: 'var(--si-fuchsia-tint)',
    status: 'Development',
  },
  {
    name: 'MedhaPlus',
    desc: 'Focus & Cognitive Stability',
    tagline: 'For students, professionals, and aging minds.',
    detail: 'Cognitive training for focus, memory, and mental endurance. Designed for students, professionals, and aging adults using classical memory techniques (Smriti Yoga) and modern cognitive science.',
    shloka: 'स्मृतिलम्भे',
    src: 'Yoga Sutra 3.13',
    features: ['Classical memory techniques', 'Focus training protocols', 'Aging adult programmes', 'Academic performance tools'],
    color: 'var(--si-amber)', bg: 'var(--si-amber-tint)',
    status: 'Development',
  },
  {
    name: 'SeniorSeva',
    desc: 'Elder Protection & Safety',
    tagline: 'Dignity in the digital age.',
    detail: 'A dignified digital safety tool for elders. Protects against scams, simplifies communication, and connects families. Designed with large text, simple navigation, and family oversight features.',
    shloka: 'मातृदेवो भव',
    src: 'Taittiriya Upanishad',
    features: ['Scam detection & alerts', 'Family connection hub', 'Large-text accessibility', 'Emergency contact system'],
    color: 'var(--si-rose)', bg: 'var(--si-rose-tint)',
    status: 'Planning',
  },
];

const PRINCIPLES = [
  { title: 'Non-Addictive Design', desc: 'No streaks, no badges, no dopamine loops. Our apps are designed to be used and put down — not to maximise screen time.' },
  { title: 'No Behavioural Profiling', desc: 'We do not sell your data, build advertising profiles, or track your behaviour for commercial purposes. Your practice is private.' },
  { title: 'Offline Usability', desc: 'Core features work without internet connectivity. Meditation should not depend on a data plan.' },
  { title: 'Accessibility First', desc: 'Designed for all ages, including elders. Large text, simple navigation, and screen reader support are built in from day one.' },
];

export default function Apps() {
  const { t, lang } = useLanguage();
  const [activeApp, setActiveApp] = useState(0);

  return (
    <Layout>
      <PageMeta
        title="Digital Welfare Suite — Sanatan International"
        description="Ethically designed applications — DhyanaPath, PranaBalance, ChittaShuddhi, MedhaPlus, SeniorSeva and more — built on classical Vedic frameworks. Technology that serves human welfare, not exploits it."
        url="/apps"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Digital Welfare Suite', href: '/apps' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark relative overflow-hidden" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/wellbeing-meditation_66e9e78d.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-4">Digital Welfare Suite</p>
            
              Many Applications.<br />
              <span className="text-si-orange-ink">One Purpose.</span>
            </h1>
            Technology that serves human welfare — not exploits it.</p>
            
              Built on classical Vedic frameworks — Yoga Sutras, Āyurveda, and Vedic psychology — our apps are designed to be used and put down. No engagement manipulation. No behavioural profiling. No addiction loops.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Non-addictive design', 'No behavioral profiling', 'Offline usability', 'No engagement manipulation'].map((tag) => (
                {tag}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Wellbeing image + mission */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/10' }}>
                <Image src="/Images/wellbeing-meditation_66e9e78d.jpg" alt="Digital Wellbeing — Meditation with App" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="label-chip mb-4">Our Philosophy</p>
              
                Ancient wisdom,<br /><span className="text-si-orange-ink">ethical technology.</span>
              </h2>
              
                The modern wellness app industry is built on the same psychological mechanisms as social media — variable reward schedules, streak anxiety, and gamification that creates dependency rather than capability.
              </p>
              
                We build differently. Every design decision is tested against one question: does this make the user more capable and independent, or more dependent on the app?
              </p>
              <div className="rounded-xl p-4" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                "योगश्चित्तवृत्तिनिरोधः"</p>
                Yoga is the cessation of the fluctuations of the mind. — Yoga Sutra 1.2</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* App selector */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">The Applications</p>
              Tools for human flourishing</h2>
            </div>
          </Reveal>

          {/* App tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {APPS.map((app, i) => (
              
                {app.name}
              </button>
            ))}
          </div>

          {/* Active app detail */}
          {APPS.map((app, i) => i === activeApp && (
            <div key={app.name}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                  <div className="rounded-2xl p-8" style={{ background: app.bg, border: `2px solid ${app.color}20` }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {app.desc}</span>
                        {app.status}</span>
                      </div>
                    </div>
                    {app.name}</h3>
                    <p className="font-display italic text-lg mb-5" style={{ color: app.color }}>{app.tagline}</p>
                    {app.detail}</p>
                    <div className="rounded-xl p-4" style={{ background: 'var(--si-card)', border: `1px solid ${app.color}30` }}>
                      {app.shloka}</p>
                      — {app.src}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="rounded-2xl p-6" style={{ background: 'var(--si-surface)' }}>
                    Key Features</p>
                    <div className="space-y-3">
                      {app.features.map((f) => (
                        <div key={f} className="flex items-start gap-3">
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: app.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: app.color }} />
                          </div>
                          {f}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--si-border)' }}>
                      <Link href="/gurukul/join">
                        
                          Join Beta Waitlist →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ethical Design Principles */}
      {/* ── App Feature Showcase ── */}
      <section style={{ background: 'var(--si-card)', padding: '80px 0' }}>
        <div className="container">
          Three Apps. One Ecosystem.</p>
          Each app is designed around a single Dharmic principle — and they work together</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              { name: 'Sattva Mind', principle: 'Svadhyaya — Self-Study', desc: 'Guided meditation, pranayama timers, and daily reflection prompts drawn from the Yoga Sutras. Tracks your practice streak and HRV over time.', img: '/Images/wellbeing-meditation_66e9e78d.jpg', color: '#4F46E5', features: ['40+ guided meditations', 'Pranayama timer with breath cues', 'Daily Shloka with commentary', 'HRV and sleep tracking'] },
              { name: 'Dharma Daily', principle: 'Nityakarma — Daily Ritual', desc: 'A gentle daily rhythm app that structures your day around Sandhyavandanam, meals, study, and rest — based on Ayurvedic Dinacharya principles.', img: '/Images/foundation-health_2f1d033a.jpg', color: '#059669', features: ['Dinacharya schedule builder', 'Meal timing based on dosha', 'Sandhya reminder with audio', 'Weekly wellness score'] },
              { name: 'Gurukul Go', principle: 'Adhyayana — Learning', desc: 'The Digital Gurukul in your pocket. Sanskrit lessons, Vedic math games, yoga videos, and live class access — all in one app for children and families.', img: '/Images/digital-gurukul-class_2bc742df.jpg', color: 'var(--si-orange-ink)', features: ['Sanskrit alphabet games', 'Vedic math puzzles', 'Live class access', 'Progress tracking for parents'] },
            ].map((app) => (
              <div key={app.name} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--si-surface-alt)' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <Image src={app.img} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${app.color}CC, transparent)` }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
                    {app.name}</p>
                    {app.principle}</p>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  {app.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {app.features.map((feat) => (
                      
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: app.color, flexShrink: 0 }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              Design Principles</p>
              Built on ethical foundations</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '20px', padding: '28px' }}>
                  {p.title}</h3>
                  {p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <Reveal>
            <p className="label-chip mb-4">Support Development</p>
            Help us build ethical technology.</h2>
            
              The Digital Welfare Suite is funded entirely by community donations. Your support directly funds development, testing, and accessibility work.
            </p>
            <Link href="/donate" className="btn-orange">Support App Development →</Link>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/apps" picks={['/gurukul/digital', '/gurukul/meta', '/donate']} />
    </Layout>
  );
}
