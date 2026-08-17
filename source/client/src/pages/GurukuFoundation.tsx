// Sanatan International — Gurukul: The Foundation
// Core philosophy: three pillars — Health, Education, Technology
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import { Link } from 'wouter';
import { ICONS } from '@/lib/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import SpiritualParticles from '@/components/SpiritualParticles';
import Image from "@/components/Image";

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealBlock({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    id: 'health',
    number: '01',
    title: 'Health',
    subtitle: 'Yoga · Meditation · Āyurveda',
    devanagari: 'आरोग्यम्',
    color: 'var(--si-success)',
    bg: 'var(--si-success-tint)',
    border: '#BBF7D0',
    icon: (
      <Image src="/Images/icon-yoga-pose_4498527a.png" alt="Health pillar icon" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
    ),
    philosophy: 'The body is the first temple. Before a student can absorb knowledge, they must inhabit a stable, healthy, energised physical form. Sanatan science understood this 5,000 years ago — the Gurukul begins with the body, not the book.',
    disciplines: [
      { name: 'Yoga', desc: 'Asana, pranayama, and yogic philosophy as a complete science of the body-mind system. Not exercise — a technology of consciousness.' },
      { name: 'Meditation', desc: 'Dharana → Dhyana progression. Mantra as cognitive anchor. Silence-based practices for stress, focus, and inner clarity.' },
      { name: 'Āyurveda', desc: 'Food as medicine. Dinacharya (daily rhythm). Dosha awareness. Preventive health protocols rooted in classical texts — not wellness trends.' },
    ],
    shloka: '"आरोग्यं परमं भाग्यम्"',
    shlokaTranslation: 'Health is the greatest fortune. — Classical Subhashita',
    outcomes: ['Regulated nervous system', 'Consistent energy and sleep', 'Freedom from lifestyle disease', 'Embodied self-awareness'],
  },
  {
    id: 'education',
    number: '02',
    title: 'Education',
    subtitle: 'Upanishads · Shāstras · Scriptures',
    devanagari: 'विद्या',
    color: 'var(--si-orange-ink)',
    bg: 'var(--si-orange-tint)',
    border: '#FED7AA',
    icon: (
      <Image src="/Images/icon-scroll_bd9f434f.png" alt="Education pillar icon" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
    ),
    philosophy: '"विद्या ददाति विनयम्" — True knowledge cultivates humility. The Gurukul does not transmit information; it transmits wisdom. Every text studied is a mirror held up to the student\'s own consciousness.',
    disciplines: [
      { name: 'Upanishads', desc: '108 Upanishads — the philosophical crown of Vedic literature. Isha, Kena, Katha, Mundaka, Mandukya: the nature of consciousness, self, and reality.' },
      { name: 'Shāstras', desc: 'Yoga Sutras of Patanjali, Arthashastra, Manusmriti (contextually), Natyashastra — systematic knowledge frameworks across every domain of human life.' },
      { name: 'Scriptures & Itihasa', desc: 'Bhagavad Gita, Ramayana, Mahabharata — not as mythology but as living ethical and psychological manuals for modern decision-making.' },
    ],
    shloka: '"विद्या ददाति विनयं विनयाद् याति पात्रताम्"',
    shlokaTranslation: 'Knowledge gives humility; humility gives worthiness. — Subhashita tradition',
    outcomes: ['Sanskrit literacy', 'Scriptural fluency', 'Ethical reasoning', 'Cross-disciplinary wisdom'],
  },
  {
    id: 'technology',
    number: '03',
    title: 'Technology',
    subtitle: 'Ethical · Human-Centric · Dharmic',
    devanagari: 'यन्त्र',
    color: 'var(--si-info)',
    bg: 'var(--si-info-tint)',
    border: '#BFDBFE',
    icon: (
      <Image src="/Images/icon-tech-lotus_d69ab604.png" alt="Technology pillar icon" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
    ),
    philosophy: 'Technology is not the enemy of dharma — misused technology is. The Gurukul trains students to build tools that serve human flourishing, not exploit human attention. Every app we build asks: does this make a human more free, more healthy, more connected to their purpose?',
    disciplines: [
      { name: 'AI Literacy & Ethics', desc: 'Understanding artificial intelligence not just as a tool but as a civilisational force. How to use it wisely, when to refuse it, and how to build with dharmic intent.' },
      { name: 'Digital Welfare Suite', desc: 'Our own apps — SeniorSeva, DharmaKids, VaidyaLink, SanatanLearn — built to solve real community problems without addiction mechanics or data exploitation.' },
      { name: 'Coding & Systems Thinking', desc: 'From Scratch (ages 9–12) to Python and robotics (ages 13–16) to full-stack development (adults). Technology as a tool of seva, not just career.' },
    ],
    shloka: '"यन्त्रमानव संयोगः धर्मेण एव शोभते"',
    shlokaTranslation: 'The union of machine and human shines only through dharma. — Sanatan International',
    outcomes: ['Ethical technology use', 'Coding & systems thinking', 'Digital welfare mindset', 'Human-first product design'],
  },
];

// ─── Teachers ─────────────────────────────────────────────────────────────────
const TEACHERS = [
  {
    name: 'Pandit Ramesh Shastri',
    title: 'Sanskrit & Vedic Studies',
    devanagari: 'पण्डित रमेश शास्त्री',
    experience: '38 years',
    credentials: 'Acharya in Sanskrit, Banaras Hindu University · Vedic Chanting Certification, Pune',
    bio: 'Pandit Shastri has spent four decades immersed in the Vedic tradition — from the banks of the Ganga to classrooms across three continents. He teaches Sanskrit not as a dead language but as a living technology of consciousness, guiding students from Devanagari script to full shloka translation.',
    expertise: ['Sanskrit Grammar (Panini)', 'Vedic Chanting & Mantra', 'Upanishad Commentary', 'Rigveda & Samaveda'],
    pillar: 'Education',
    pillarColor: '#F97316',
    photo: '/Images/teacher-sanskrit_b92cc875.jpg',
  },
  {
    name: 'Dr. Meera Iyer',
    title: 'Yoga & Pranayama',
    devanagari: 'डॉ. मीरा अय्यर',
    experience: '22 years',
    credentials: '500hr E-RYT, Yoga Alliance · PhD in Yoga Therapy, Swami Vivekananda Yoga University',
    bio: 'Dr. Iyer brings the rigour of academic research and the depth of personal practice to every class. A former competitive athlete turned yoga therapist, she understands the body from both Western anatomy and classical Āyurvedic frameworks — and teaches their integration with rare clarity.',
    expertise: ['Hatha & Ashtanga Yoga', 'Pranayama Science', 'Yoga Therapy', 'Yoga Sutras of Patanjali'],
    pillar: 'Health',
    pillarColor: '#16A34A',
    photo: '/Images/teacher-yoga_dbac13c0.jpg',
  },
  {
    name: 'Dr. Vikram Nair',
    title: 'Āyurveda & Preventive Health',
    devanagari: 'डॉ. विक्रम नायर',
    experience: '26 years',
    credentials: 'BAMS, Ayurvedic Medical College Coimbatore · MD (Āyurveda), Gujarat Āyurved University',
    bio: 'Dr. Nair practised clinical Āyurveda for two decades before joining the Gurukul faculty. He specialises in translating classical Āyurvedic protocols into practical, evidence-based lifestyle medicine — making the ancient science of Tridosha and Dinacharya accessible to modern students worldwide.',
    expertise: ['Tridosha Framework', 'Dinacharya & Lifestyle', 'Panchakarma Theory', 'Herbal Pharmacology'],
    pillar: 'Health',
    pillarColor: '#16A34A',
    photo: '/Images/teacher-ayurveda_baa7d902.jpg',
  },
  {
    name: 'Dr. Ananya Krishnamurthy',
    title: 'Vedic Science & Mathematics',
    devanagari: 'डॉ. अनन्या कृष्णमूर्ति',
    experience: '15 years',
    credentials: 'PhD in History of Science, IIT Bombay · Post-doctoral Fellow, Vedic Astronomy, Oxford',
    bio: 'Dr. Krishnamurthy bridges ancient Vedic science and modern STEM with rare intellectual elegance. Her research on Vedic astronomy, zero and infinity in Indian mathematics, and sacred geometry has been published in leading journals — and she brings that same rigour to teaching students aged 9 to 60.',
    expertise: ['Vedic Astronomy & Cosmology', 'Indian Mathematics', 'Sacred Geometry & Vastu', 'Vedic Ecology'],
    pillar: 'Education',
    pillarColor: '#F97316',
    photo: '/Images/teacher-vedic_c3fa0149.jpg',
  },
  {
    name: 'Swami Dharmananda',
    title: 'Meditation & Vedanta',
    devanagari: 'स्वामी धर्मानन्द',
    experience: '31 years',
    credentials: 'Sannyasa Diksha, Ramakrishna Mission · Advanced Meditation Teacher, Bihar School of Yoga',
    bio: 'Swami Dharmananda took sannyasa at 24 and has spent three decades in the direct lineage of Ramakrishna-Vivekananda. He leads the weekly free satsang and teaches advanced meditation — from mantra-based concentration to the silence practices of Vedanta. His teaching style is direct, warm, and completely without pretension.',
    expertise: ['Mantra Meditation', 'Vedanta Philosophy', 'Silence & Retreat Practices', 'Bhakti & Karma Yoga'],
    pillar: 'Education',
    pillarColor: '#F97316',
    photo: '/Images/teacher-meditation_f89e01fb.jpg',
  },
];

// ─── Teacher card component ───────────────────────────────────────────────────
function TeacherCard({ teacher, index }: { teacher: typeof TEACHERS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: `opacity 600ms ease ${index * 80}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${index * 80}ms` }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', transition: 'all 250ms ease', cursor: 'pointer' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,115,22,0.3)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}>
        {/* Portrait */}
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#2A2A2A' }}>
          <Image src={teacher.photo} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 400ms ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.2) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
            {teacher.pillar}</span>
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: '20px' }}>
          <p className="font-devanagari text-base mb-0.5" style={{ color: 'rgba(255,255,255,0.66)' }}>{teacher.devanagari}</p>
          {teacher.name}</p>
          {teacher.title}</p>
          {teacher.experience} experience</p>
          {teacher.bio}</p>
          
            {expanded ? '↑ Show less' : '↓ Read more'}
          </button>
          {/* Expertise chips */}
          <div className="flex flex-wrap gap-1.5">
            {teacher.expertise.map((e) => (
              {e}</span>
            ))}
          </div>
          {/* Credentials */}
          {expanded && (
            <div style={{ marginTop: '12px', background: 'rgba(249,115,22,0.08)', borderRadius: '10px', padding: '10px 14px', border: '1px solid rgba(249,115,22,0.15)' }}>
              Credentials</p>
              {teacher.credentials}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Testimonials data ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    quote: "My son was struggling with focus and confidence. After six months in the Foundation Program, he recites the Gayatri Mantra every morning before school, his grades have improved, and — most importantly — he is calm. The teachers actually know his name.",
    name: "Priya Venkataraman",
    role: "Parent · Foundation Program",
    location: "San Jose, CA",
    child: "Arjun, age 9",
    rating: 5,
    pillar: "Health + Education",
    pillarColor: "#16A34A",
  },
  {
    id: 2,
    quote: "I enrolled in Level 1 not knowing what to expect. Thirty days later, I sleep better, I have a morning routine for the first time in my adult life, and I understand why I was anxious all the time. This is not a wellness course. It is a complete reset.",
    name: "Marcus Thompson",
    role: "Student · L1 Basic Human Reset",
    location: "London, UK",
    child: null,
    rating: 5,
    pillar: "Health",
    pillarColor: "#16A34A",
  },
  {
    id: 3,
    quote: "The Digital Gurukul is unlike anything else available. My daughter is 11 and she can now read Devanagari script, chant three shlokas with correct pronunciation, and explain what the Bhagavad Gita is about. Her teacher, Pandit Shastri, sends a personal note every Friday.",
    name: "Deepa Krishnaswamy",
    role: "Parent · Digital Gurukul",
    location: "Toronto, Canada",
    child: "Kavya, age 11",
    rating: 5,
    pillar: "Education",
    pillarColor: "#F97316",
  },
  {
    id: 4,
    quote: "I have a PhD in computer science and I was sceptical. But the Vedic Science track changed how I think about my own field. The connection between ancient Indian mathematics and modern computation is real, documented, and profound. Dr. Krishnamurthy is a world-class teacher.",
    name: "Rahul Mehta",
    role: "Student · L3 Career + Leadership",
    location: "Bangalore, India",
    child: null,
    rating: 5,
    pillar: "Technology",
    pillarColor: "#3B82F6",
  },
  {
    id: 5,
    quote: "We were worried about screen time. But the Gurukul is different — the live classes are short, purposeful, and the parent dashboard means I know exactly what my kids are learning every day. The weekly video from the teacher is a beautiful touch. We feel like partners.",
    name: "Anita & Suresh Nair",
    role: "Parents · Growth Program",
    location: "Dubai, UAE",
    child: "Rohan (12) and Meera (9)",
    rating: 5,
    pillar: "Education + Health",
    pillarColor: "#7C3AED",
  },
  {
    id: 6,
    quote: "Swami Dharmananda's weekly satsang is the highlight of my week. I joined for free, stayed for the community. Six months later I enrolled in Level 2. The transition from curious visitor to committed student happened naturally — no pressure, no sales tactics.",
    name: "Elena Petrov",
    role: "Student · L2 Dharma Living",
    location: "Berlin, Germany",
    child: null,
    rating: 5,
    pillar: "Education",
    pillarColor: "#F97316",
  },
];

// ─── Testimonials Carousel ────────────────────────────────────────────────────
function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = TESTIMONIALS.length;

  const go = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActive((idx + total) % total);
      setIsAnimating(false);
    }, 200);
  };

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => go(active + 1), 6000);
    return () => clearInterval(timer);
  }, [active]);

  const t = TESTIMONIALS[active];

  return (
    <div style={{ position: 'relative' }}>
      {/* Main testimonial card */}
      <div style={{ background: 'var(--si-surface)', borderRadius: '24px', padding: '40px 48px', minHeight: '280px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative quote mark */}
        <div style={{ position: 'absolute', top: '20px', right: '32px', fontSize: '120px', lineHeight: 1, color: 'rgba(249,115,22,0.07)', fontFamily: 'Georgia, serif', userSelect: 'none', pointerEvents: 'none' }}>"</div>

        <div style={{ opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 200ms ease, transform 200ms ease' }}>
          {/* Stars */}
          <div className="flex gap-1 mb-5">
            {Array.from({ length: t.rating }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F97316" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ))}
          </div>

          {/* Quote */}
          
            "{t.quote}"
          </blockquote>

          {/* Attribution */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar initials */}
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.pillarColor + '20', border: `2px solid ${t.pillarColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="font-display font-black text-sm" style={{ color: t.pillarColor }}>{t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
              </div>
              <div>
                {t.name}</p>
                {t.role}</p>
                {t.location}{t.child ? ` · ${t.child}` : ''}</p>
              </div>
            </div>
            {t.pillar}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
              aria-current={i === active}
              style={{ width: i === active ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === active ? 'var(--si-orange)' : 'var(--si-border-strong)', border: 'none', cursor: 'pointer', transition: 'all 300ms ease', padding: 0 }} />
          ))}
        </div>
        {/* Prev / Next */}
        <div className="flex gap-2">
          <button onClick={() => go(active - 1)} aria-label="Previous testimonial"
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid var(--si-border)', background: 'var(--si-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--si-orange)'; el.style.color = 'var(--si-orange-ink)'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--si-border)'; el.style.color = 'var(--si-text-muted)'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => go(active + 1)} aria-label="Next testimonial"
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid var(--si-border)', background: 'var(--si-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--si-orange)'; el.style.color = 'var(--si-orange-ink)'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--si-border)'; el.style.color = 'var(--si-text-muted)'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherProfiles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {TEACHERS.map((t, i) => <TeacherCard key={t.name} teacher={t} index={i} />)}
    </div>
  );
}

const PRINCIPLES = [
  { title: 'Character Before Competence', desc: 'Every subject answers: "Why does this make my life better today?" Skills without values produce clever problems, not wise solutions.' },
  { title: 'Demonstrated Mastery', desc: 'Assessment by competence, not memorised recall. Every student leaves a year with a portfolio: a project, a performance, a published essay.' },
  { title: 'Five-Track Integration', desc: 'Spiritual + Academic + Practical + Physical + Creative — every age group, every week. No track is optional; all five are non-negotiable.' },
  { title: 'Sanskrit as Foundation', desc: 'Sanskrit and English are non-negotiable. Hindi as third language. Language is the architecture of thought.' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function GurukuFoundation() {
  const { t, lang } = useLanguage();
  const [activePillar, setActivePillar] = useState('health');
  const pillar = PILLARS.find(p => p.id === activePillar)!;

  return (
    <Layout>
      <PageMeta
        title="The Foundation — Gurukul Philosophy"
        description="The core philosophy of Sanatan International's Gurukul: three pillars of Health (Yoga, Meditation, Āyurveda), Education (Upanishads, Shāstras, Scriptures), and Technology (ethical, human-centric, dharmic)."
        url="/gurukul/foundation"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul/foundation' }, { name: 'The Foundation', href: '/gurukul/foundation' }]} />

      {/* ── Hero ── */}
      <section className="section-dark pt-32 pb-24 relative overflow-hidden texture-dark">
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/foundation-education_26fd0555.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        {/* Background mandala */}
        <SpiritualParticles />
        <div style={{ position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)', width: '500px', height: '500px', opacity: 0.04, backgroundImage: 'radial-gradient(circle, var(--si-orange) 1px, transparent 1px)', backgroundSize: '24px 24px', borderRadius: '50%' }} />
        <div className="container max-w-4xl relative z-10">
          <RevealBlock>
            <p className="label-chip mb-4">{t('gf.badge')}</p>
            
              Ancient wisdom.<br />
              <span className="text-si-orange-ink">{t('gf.title2')}</span><br />
              One complete life.
            </h1>
            
              The Gurukul is not a school. It is a complete system for human flourishing — rooted in 5,000 years of tested science, delivered through the most effective modern formats.
            </p>
            "विद्या ददाति विनयम्"</p>
            True knowledge cultivates humility. — Subhashita tradition</p>
          </RevealBlock>
        </div>
      </section>

      {/* ── Why the Gurukul ── */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-5xl">
          <RevealBlock>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="label-chip mb-3">The Problem We Solve</p>
                
                  Modern education produces<br /><span className="text-si-orange-ink">capable but incomplete humans.</span>
                </h2>
                
                  We train people to pass exams, earn salaries, and consume products — but not to manage their minds, understand their bodies, or find meaning in their lives. The result: record levels of anxiety, loneliness, and chronic disease in the most "educated" generation in history.
                </p>
                
                  The classical Gurukul solved this. It produced graduates who were physically robust, intellectually sharp, emotionally stable, spiritually grounded, and practically capable. We are rebuilding that system — for the 21st century.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: '5,000+', label: 'Years of tested wisdom' },
                  { stat: '4', label: 'Levels of progression' },
                  { stat: '3', label: 'Core pillars' },
                  { stat: '100K+', label: 'Students by 2034' },
                ].map((s) => (
                  <div key={s.label} className="card-white p-5 text-center">
                    {s.stat}</p>
                    {s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ── Three Pillars Interactive ── */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-6xl">
          <RevealBlock>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">The Three Pillars</p>
              
                Every complete human needs<br /><span className="text-si-orange-ink">all three.</span>
              </h2>
            </div>
          </RevealBlock>

          {/* Pillar selector tabs */}
          <RevealBlock delay={100}>
            <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
              {PILLARS.map((p) => (
                
                  <span style={{ color: activePillar === p.id ? p.color : 'var(--si-text-light)', display: 'inline-flex', transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.transform = 'scale(1.2) rotate(-8deg)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.transform = 'scale(1) rotate(0deg)'; }}>
                    <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{p.icon}</span>
                  </span>
                  {p.number} · {p.title}
                </button>
              ))}
            </div>
          </RevealBlock>

          {/* Active pillar detail */}
         <div key={activePillar} style={{ animation: 'fadeIn 300ms ease' }}>
           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
             {/* Left: intro */}
             <div className="lg:col-span-2">
               <div style={{ background: pillar.bg, border: `1.5px solid ${pillar.border}`, borderRadius: '20px', padding: '32px' }}>
                {/* Pillar image */}
                {pillar.id === 'health' && (
                  <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '20px' }}>
                    <Image src="/Images/foundation-health_2f1d033a.jpg" alt="Health pillar — Yoga and meditation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                {pillar.id === 'education' && (
                  <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '20px' }}>
                    <Image src="/Images/foundation-education_26fd0555.jpg" alt="Education pillar — Vedic learning" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                {pillar.id === 'technology' && (
                  <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '20px' }}>
                    <Image src="/Images/foundation-technology_ef4a72b7.jpg" alt="Technology pillar — Ethical tech" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                 <div className="flex items-center gap-3 mb-4">
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: pillar.color + '18', color: pillar.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1), box-shadow 300ms ease', cursor: 'default' }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1.15) rotate(-6deg)'; el.style.boxShadow = `0 8px 24px ${pillar.color}40`; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1) rotate(0deg)'; el.style.boxShadow = 'none'; }}>
                      <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{pillar.icon}</span>
                    </div>
                    <div>
                      <p className="font-devanagari text-2xl" style={{ color: pillar.color }}>{pillar.devanagari}</p>
                      {pillar.subtitle}</p>
                    </div>
                  </div>
                  {pillar.title}</h3>
                  {pillar.philosophy}</p>
                  <div style={{ borderLeft: `3px solid ${pillar.color}`, paddingLeft: '16px' }}>
                    <p className="font-devanagari text-base mb-1" style={{ color: pillar.color }}>{pillar.shloka}</p>
                    {pillar.shlokaTranslation}</p>
                  </div>
                </div>
              </div>

              {/* Right: disciplines + outcomes */}
              <div className="lg:col-span-3 space-y-5">
                {/* Disciplines */}
                <div>
                  What We Teach</p>
                  <div className="space-y-3">
                    {pillar.disciplines.map((d, i) => (
                      <div key={d.name} style={{ background: 'var(--si-surface)', borderRadius: '14px', padding: '16px 20px', borderLeft: `3px solid ${pillar.color}` }}>
                        <div className="flex items-start gap-3">
                          <span className="font-display font-bold text-sm flex-shrink-0 mt-0.5" style={{ color: pillar.color }}>0{i + 1}</span>
                          <div>
                            {d.name}</p>
                            {d.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="on-dark" style={{ background: 'var(--si-ink)', borderRadius: '16px', padding: '20px 24px' }}>
                  Graduate Outcomes</p>
                  <div className="grid grid-cols-2 gap-2">
                    {pillar.outcomes.map((o) => (
                      <div key={o} className="flex items-center gap-2">
                        <span style={{ color: pillar.color, flexShrink: 0 }}>›</span>
                        {o}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Design Principles ── */}
      <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
        <div className="container py-20 max-w-5xl">
          <RevealBlock>
            <div className="text-center mb-12">
              Curriculum Design Principles</p>
              
                How we teach is as important<br /><span className="text-si-orange-ink">as what we teach.</span>
              </h2>
            </div>
          </RevealBlock>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PRINCIPLES.map((p, i) => (
              <RevealBlock key={p.title} delay={i * 80}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                  {p.title}</p>
                  {p.desc}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── The 4-Level Scaffold ── */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-5xl">
          <RevealBlock>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">Program Structure</p>
              
                Four levels. Progressive mastery.<br /><span className="text-si-orange-ink">No shortcuts.</span>
              </h2>
            </div>
          </RevealBlock>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { level: 'L1', title: 'Foundation', subtitle: 'Human Sciences', duration: '12 Weeks', desc: 'Discipline, mental clarity, ethical grounding, and physical stability. Mandatory for all.', shloka: '"स्थिरसुखमासनम्"' },
              { level: 'L2', title: 'Consciousness', subtitle: 'Mind Training', duration: '16 Weeks', desc: 'Focus, emotional regulation, and mental resilience. Meditation systems and scriptural psychology.', shloka: '"योगश्चित्तवृत्तिनिरोधः"' },
              { level: 'L3', title: 'Applied Skills', subtitle: 'Leadership', duration: '20 Weeks', desc: 'Communication mastery, leadership, content creation, and real-world project delivery.', shloka: '"कर्मण्येवाधिकारस्ते"' },
              { level: 'L4', title: 'Āchārya', subtitle: 'Trainer Certification', duration: '24 Weeks', desc: 'Teaching methodology, curriculum design, and certification to train others.', shloka: '"आचार्यात् पादमादत्ते"' },
            ].map((l, i) => (
              <RevealBlock key={l.level} delay={i * 80}>
                <div className="card-white p-6 h-full" style={{ borderTop: '3px solid var(--si-orange)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    {l.level}</span>
                    <div>
                      {l.title}</p>
                      {l.subtitle}</p>
                    </div>
                  </div>
                  {l.duration}</p>
                  {l.desc}</p>
                  {l.shloka}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── Teacher Profiles ── */}
      <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
        <div className="container py-20 max-w-6xl">
          <RevealBlock>
            <div className="text-center mb-12">
              Our Faculty</p>
              
                Meet the Teachers
              </h2>
              
                Every class is taught by a credentialed human being — not a chatbot, not an algorithm. Our faculty bring decades of living practice to every session.
              </p>
            </div>
          </RevealBlock>
          <TeacherProfiles />
          <RevealBlock delay={300}>
            <div className="text-center mt-12">
              <Link href="/gurukul/join">
                
                  Apply to Teach →
                </button>
              </Link>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-4xl">
          <RevealBlock>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">Student & Parent Voices</p>
              
                What our community says
              </h2>
              
                Real students, real parents, real transformations — from San Jose to Berlin to Dubai.
              </p>
            </div>
          </RevealBlock>
          <RevealBlock delay={100}>
            <TestimonialsCarousel />
          </RevealBlock>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--si-cta)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <RevealBlock>
            <p className="font-devanagari text-3xl mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>"सर्वे भवन्तु सुखिनः"</p>
            Ready to begin your journey?</h2>
            
              Explore the full curriculum, join the Digital Gurukul, or apply to be a teacher.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/gurukul/programs">
                
                  View Programs →
                </button>
              </Link>
              <Link href="/gurukul/join">
                
                  Join the Gurukul
                </button>
              </Link>
            </div>
          </RevealBlock>
        </div>
      </section>

      <RelatedPages current="/gurukul/foundation" picks={['/gurukul/programs', '/gurukul/digital', '/gurukul/join']} />
    </Layout>
  );
}
