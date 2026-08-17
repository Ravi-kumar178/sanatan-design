// Sanatan International — Gurukul: Program Overview
// Kids (3 age bands) + Adult Course Ladder (L1–L6) + 5-year specialization tracks
import { useState, useEffect, useRef } from 'react';
import SpiritualParticles from '@/components/SpiritualParticles';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
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

// ─── Kids Programs ────────────────────────────────────────────────────────────
const KIDS_BANDS = [
  {
    id: 'foundation',
    ages: 'Ages 5–8',
    title: 'Foundation Program',
    goal: 'Confident, healthy, curious, kind child. Joyful exposure, no pressure.',
    color: 'var(--si-success)',
    bg: 'var(--si-success-tint)',
    tracks: [
      { track: 'Spiritual', subjects: 'Basic mantras, Gita stories, Ramayana, Mahabharata, dharma basics, respect for elders', hours: 5 },
      { track: 'Academic', subjects: 'English, Hindi/Sanskrit basics, math (concrete), nature science, geography stories', hours: 10 },
      { track: 'Physical', subjects: 'Fun yoga, flexibility, balance drills, traditional games', hours: 5 },
      { track: 'Creative', subjects: 'Drawing, music, tabla, dance, clay work', hours: 4 },
      { track: 'Life Skills', subjects: 'Cleanliness, gratitude, teamwork, daily routine', hours: 2 },
    ],
    schedule: [
      { day: 'Mon', block: 'Story Circle — Ramayana / Mahabharata / Panchatantra', pillar: 'Spiritual + Creative', outcome: 'One story, one value, one craft' },
      { day: 'Tue', block: 'Body & Breath — fun yoga + games', pillar: 'Physical', outcome: '20 min movement + 5 min belly breathing' },
      { day: 'Wed', block: 'Mantra & Music — chanting + tabla intro', pillar: 'Spiritual + Creative', outcome: '1 mantra mastered + rhythm' },
      { day: 'Thu', block: 'Numbers & Nature — math through nature', pillar: 'Academic', outcome: 'Concrete-to-abstract math' },
      { day: 'Fri', block: "Builders' Workshop — clay, drawing, small projects", pillar: 'Creative + Life Skills', outcome: 'Finished take-home creation' },
      { day: 'Sat', block: 'Family Sangha (parents + kids, 30 min)', pillar: 'All five', outcome: 'Joyful close + parent participation' },
    ],
  },
  {
    id: 'growth',
    ages: 'Ages 9–12',
    title: 'Growth Program',
    goal: 'Disciplined, articulate, scripture-literate, hands-on builder.',
    color: 'var(--si-orange-ink)',
    bg: 'var(--si-orange-tint)',
    tracks: [
      { track: 'Spiritual', subjects: 'Shloka memorization, Gita Ch. 2 & 12 basics, ethics, meditation foundations', hours: 5 },
      { track: 'Academic', subjects: 'Advanced math, science, coding basics (Scratch → Python), history, public speaking', hours: 12 },
      { track: 'Practical', subjects: 'Gardening, cooking basics, first aid, entrepreneurship intro (run a stall)', hours: 4 },
      { track: 'Martial / Physical', subjects: 'Kalaripayattu intro, archery basics, agility drills', hours: 5 },
      { track: 'Creative', subjects: 'Storytelling, instrument intermediate, design thinking', hours: 2 },
    ],
    schedule: [],
  },
  {
    id: 'leadership',
    ages: 'Ages 13–16',
    title: 'Leadership Program',
    goal: 'Confident young leaders who can speak, build, defend dharma, and run small projects.',
    color: 'var(--si-violet)',
    bg: 'var(--si-violet-tint)',
    tracks: [
      { track: 'Spiritual', subjects: 'Vedanta intro, philosophy, debate, comparative religion, dharma in modern world', hours: 6 },
      { track: 'Academic', subjects: 'AI literacy, robotics, finance basics, psychology, economics, advanced English', hours: 12 },
      { track: 'Practical', subjects: 'Communication mastery, sales, leadership, media literacy, content creation', hours: 5 },
      { track: 'Physical', subjects: 'Strength training, advanced yoga, self-defense, endurance', hours: 5 },
      { track: 'Capstone', subjects: 'Year-long student-led project with real-world deliverable', hours: 2 },
    ],
    schedule: [],
  },
];

// ─── Adult Ladder ─────────────────────────────────────────────────────────────
const ADULT_LEVELS = [
  { level: 'L1', title: 'Basic Human Reset', desc: 'Breath, gut, sleep, daily routine, stress management. The foundation everyone needs.', duration: '30 days', format: 'Online cohort + WhatsApp', color: 'var(--si-success)' },
  { level: 'L2', title: 'Dharma Living', desc: 'Gita for modern life, emotion, relationships, money. Philosophy made practical.', duration: '90 days', format: 'Online cohort + monthly satsang', color: 'var(--si-orange-ink)' },
  { level: 'L3', title: 'Career + Leadership', desc: 'Confidence, communication, purpose, execution. Build the life you were meant to live.', duration: '120 days', format: 'Online + 1 weekend retreat', color: 'var(--si-info)' },
  { level: 'L4', title: 'Yoga Teacher Track', desc: '200hr certification. Anatomy, therapy yoga, teaching methods, breath science, meditation leadership.', duration: '180 days', format: 'Hybrid (online + 21-day residential)', color: 'var(--si-violet)' },
  { level: 'L5', title: 'Āyurveda Practitioner', desc: 'Food as medicine, lifestyle correction. Doshas, herbs, nutrition, detox, panchakarma theory.', duration: '180 days', format: 'Hybrid + clinic shadowing', color: '#DC2626' },
  { level: 'L6', title: 'Master Sādhana', desc: 'Silence retreats, advanced meditation, karma yoga. Application-only. A complete transformation.', duration: '365 days', format: 'Residential, application-only', color: '#92400E' },
];

// ─── Specialization Tracks ────────────────────────────────────────────────────
const SPEC_TRACKS = [
  { name: 'Yoga Specialist', subjects: 'Anatomy, therapy yoga, teaching methods, breath science, meditation leadership', credential: '200hr Yoga Teacher cert + apprenticeship', img: '/Images/teacher-yoga_dbac13c0.jpg', color: 'var(--si-orange-ink)' },
  { name: 'Āyurveda Specialist', subjects: 'Doshas, herbs, nutrition, detox, panchakarma theory', credential: 'Āyurveda Lifestyle Counselor cert', img: '/Images/teacher-ayurveda_baa7d902.jpg', color: 'var(--si-success)' },
  { name: 'Sanskrit Scholar', subjects: 'Grammar, chanting, translation, commentary studies', credential: 'Reading-fluency in two scriptures', img: '/Images/teacher-sanskrit_b92cc875.jpg', color: 'var(--si-violet)' },
  { name: 'Leadership / Raj Dharma', subjects: 'Governance, economics, ethics, public policy', credential: 'Capstone policy paper + civic project', img: '/Images/collab-university_7034665f.jpg', color: 'var(--si-info)' },
  { name: 'Vedic Science', subjects: 'Astronomy, mathematics, architecture, ecology', credential: 'Original research paper + working model', img: '/Images/teacher-vedic_c3fa0149.jpg', color: '#DC2626' },
];

// ─── Graduate Profile ─────────────────────────────────────────────────────────
const GRADUATE_PROFILE = [
  'Recite 25 shlokas with meaning',
  'Hold a 5-minute speech in English and Hindi without notes',
  'Complete 50 Surya Namaskars and 30 minutes of meditation',
  'Build a working coding project (game or simple app)',
  'Cook three traditional meals from scratch',
  'Lead a group of younger students for one week',
  'Submit a published essay, performance, or product',
];

export default function GurukuPrograms() {
  const { t, lang } = useLanguage();
  const [activeKids, setActiveKids] = useState('foundation');
  const [activeTab, setActiveTab] = useState<'schedule' | 'tracks'>('tracks');
  const band = KIDS_BANDS.find(b => b.id === activeKids)!;

  return (
    <Layout>
      <PageMeta
        title="Program Overview — Gurukul Curriculum"
        description="Complete curriculum overview for Sanatan International's Gurukul: Kids programs (ages 5–16), Adult Course Ladder (L1–L6), and 5-year specialization tracks in Yoga, Āyurveda, Sanskrit, Leadership, and Vedic Science."
        url="/gurukul/programs"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul/foundation' }, { name: 'Program Overview', href: '/gurukul/programs' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-24 texture-dark">
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/programs-overview_36fa1c0a.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <SpiritualParticles />
        <div className="container max-w-4xl relative z-10">
          <Reveal>
            <p className="label-chip mb-4">Gurukul · Program Overview</p>
            
              Every age. Every stage.<br />
              <span className="text-si-orange-ink">One complete path.</span>
            </h1>
            
              From a 5-year-old learning mantras through play, to an adult earning a 200hr Yoga Teacher certification — the Gurukul has a structured, progressive path for every stage of life.
            </p>
            <div className="flex flex-wrap gap-4">
              
                Kids Programs ↓
              </a>
              
                Adult Ladder ↓
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Program visual strip */}
      <section style={{ background: 'var(--si-surface)', padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: '220px', overflow: 'hidden' }}>
          {[
            { src: '/Images/teacher-sanskrit_b92cc875.jpg', label: 'Sanskrit' },
            { src: '/Images/teacher-yoga_dbac13c0.jpg', label: 'Yoga' },
            { src: '/Images/teacher-ayurveda_baa7d902.jpg', label: 'Āyurveda' },
            { src: '/Images/teacher-vedic_c3fa0149.jpg', label: 'Vedic Studies' },
          ].map(({ src, label }) => (
            <div key={label} style={{ position: 'relative', overflow: 'hidden' }}>
              <Image src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              {label}</span>
            </div>
          ))}
        </div>
      </section>


      {/* ── Kids Programs ── */}
      <section id="kids" style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">Kids Gurukul</p>
              
                Three age bands.<br /><span className="text-si-orange-ink">One complete childhood.</span>
              </h2>
            </div>
          </Reveal>

          {/* Age band tabs */}
          <Reveal delay={100}>
            <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
              {KIDS_BANDS.map((b) => (
                
                  {b.ages} · {b.title}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Band detail */}
          <div key={activeKids} style={{ animation: 'fadeIn 300ms ease' }}>
            <div style={{ background: band.bg, border: `1.5px solid ${band.color}30`, borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  {band.ages}</p>
                  {band.title}</h3>
                  Goal: {band.goal}</p>
                </div>
                {band.id === 'foundation' && (
                  <div className="flex gap-2">
                    {(['tracks', 'schedule'] as const).map((t) => (
                      
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tracks table */}
              {(band.id !== 'foundation' || activeTab === 'tracks') && (
                <div className="overflow-x-auto">
                  
                    <thead>
                      <tr style={{ background: band.color, color: 'var(--si-on-accent)' }}>
                        Track</th>
                        Subjects</th>
                        Hrs/Wk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {band.tracks.map((t, i) => (
                        <tr key={t.track} style={{ background: i % 2 === 0 ? 'var(--si-card)' : band.bg }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.875rem', color: band.color, whiteSpace: 'nowrap' }}>{t.track}</td>
                          {t.subjects}</td>
                          {t.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Weekly schedule (Foundation only) */}
              {band.id === 'foundation' && activeTab === 'schedule' && (
                <div className="overflow-x-auto">
                  
                    <thead>
                      <tr style={{ background: band.color, color: 'var(--si-on-accent)' }}>
                        {['Day', '45-min Block', 'Pillar', 'Outcome'].map((h, i) => (
                          {h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {band.schedule.map((s, i) => (
                        <tr key={s.day} style={{ background: i % 2 === 0 ? 'var(--si-card)' : band.bg }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.875rem', color: band.color }}>{s.day}</td>
                          {s.block}</td>
                          {s.pillar}</td>
                          {s.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Graduate Profile */}
          <Reveal delay={150}>
            <div className="on-dark" style={{ background: 'var(--si-ink)', borderRadius: '20px', padding: '32px' }}>
              <div className="flex items-start gap-4 mb-6">
                <div>
                  3-Year Graduate Profile</p>
                  Every child leaving the programme will demonstrate:</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GRADUATE_PROFILE.map((item, i) => (
                  <div key={item} className="flex items-start gap-3" style={{ background: 'rgba(249,115,22,0.08)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(249,115,22,0.15)' }}>
                    0{i + 1}</span>
                    {item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5-Year Specialization ── */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">Years 4–5</p>
              
                Five-Year Specialization Tracks
              </h2>
              
                Each student picks ONE deep track for years 4 and 5, while continuing core academics.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPEC_TRACKS.map((t, i) => (
              <Reveal key={t.name} delay={i * 70}>
                <div className="card-white h-full" style={{ borderTop: `3px solid ${(t as any).color || 'var(--si-orange)'}`, overflow: 'hidden', borderRadius: '14px' }}>
                  {(t as any).img && (
                    <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                      <Image src={(t as any).img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
                      {t.name}</span>
                    </div>
                  )}
                  <div style={{ padding: '18px 20px' }}>
                  {t.name}</p>
                  {t.subjects}</p>
                  <div style={{ background: 'var(--si-orange-tint)', borderRadius: '8px', padding: '10px 14px' }}>
                    Final Credential</p>
                    {t.credential}</p>
                  </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Adult Course Ladder ── */}
      <section id="adults" style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">Adult Academy</p>
              
                The Adult Course Ladder
              </h2>
              
                A clear, paid, sequential progression. Every adult enters at Level 1 and moves up. No level skipping in the first cohort.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {ADULT_LEVELS.map((l, i) => (
              <Reveal key={l.level} delay={i * 60}>
                <div style={{ background: 'var(--si-surface)', borderRadius: '16px', padding: '24px', borderLeft: `4px solid ${l.color}`, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '20px', alignItems: 'center' }}>
                  <div className="text-center">
                    <p className="font-display font-black text-3xl" style={{ color: l.color }}>{l.level}</p>
                  </div>
                  <div>
                    {l.title}</p>
                    {l.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {l.duration}</span>
                      {l.format}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {/* price removed */}</p>
                    <Link href="/gurukul/join">
                      
                        Apply →
                      </button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--si-cta)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <Reveal>
            <p className="font-devanagari text-3xl mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>"अभ्यासवैराग्याभ्यां तन्निरोधः"</p>
            Your path begins with one step.</h2>
            
              Enroll your child, join an adult cohort, or apply to teach. The Gurukul is open to all who are ready.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/gurukul/join">
                
                  Apply Now →
                </button>
              </Link>
              <Link href="/gurukul/digital">
                
                  Explore Digital Gurukul
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/gurukul/programs" picks={['/gurukul/foundation', '/gurukul/digital', '/gurukul/join']} />
    </Layout>
  );
}
