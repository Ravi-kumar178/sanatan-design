// Sanatan International — Campus Vision Page
// Full gallery of 5 renders + campus plan breakdown + fundraising CTA
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { Link } from 'wouter';
import Image from "@/components/Image";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const RENDERS = [
  {
    id: 'night-overview',
    src: '/Images/Gemini_Generated_Image_fbgkmqfbgkmqfbgk_2435fee5.png',
    title: 'Night Aerial — The Shiva Statue & Campus',
    caption: 'The centrepiece of the campus: a towering Adiyogi statue overlooking the Gurukul courtyard, illuminated at night. The symmetrical layout echoes classical temple-city planning — a sacred geometry designed for contemplation and community.',
    tag: 'Aerial · Night',
  },
  {
    id: 'entrance',
    src: '/Images/Gemini_Generated_Image_i9blhii9blhii9bl_57122d19.png',
    title: 'Campus Entrance — "Eternal Way of Living"',
    caption: 'The main entrance gate bears the inscription "Sanatan International · Eternal Way of Living" in English, Hindi, and Spanish — a statement of welcome to all seekers. The Adiyogi statue is visible from the road, anchoring the campus in the Bay Area landscape.',
    tag: 'Entrance · Day',
  },
  {
    id: 'research-centre',
    src: '/Images/Gemini_Generated_Image_lqjheulqjheulqjh_494d4235.png',
    title: 'Research & Learning Centre',
    caption: 'The wave-form research building — inspired by the flowing forms of classical Indian architecture — houses the Āyurveda laboratory, digital learning studios, and the Vedic science research wing. The organic farm stretches behind it, supplying the campus kitchen and Āyurveda herb garden.',
    tag: 'Research Centre · Dusk',
  },
  {
    id: 'campus-day',
    src: '/Images/Gemini_Generated_Image_43i66843i66843i6_4395d49e.png',
    title: 'Campus Overview — Day View',
    caption: 'The full campus at golden hour: the Gurukul teaching halls, yoga pavilions, meditation gardens, residential quarters, and the central courtyard with its reflecting pool. Designed for 500+ residents and daily visitors.',
    tag: 'Full Campus · Day',
  },
  {
    id: 'aerial-full',
    src: '/Images/Gemini_Generated_Image_lu0mc9lu0mc9lu0m_d52a8569.png',
    title: 'Master Plan — 33 Acres, El Sabrante, CA',
    caption: 'The complete 33-acre master plan from above. The campus is organised in concentric rings: the sacred core (Adiyogi statue, temple, courtyard), the learning ring (Gurukul halls, yoga campus, research centre), and the living ring (residential quarters, organic farm, community spaces).',
    tag: 'Master Plan · Aerial',
  },
];

const ZONES = [
  {
    icon: '🏛️',
    name: 'Gurukul Teaching Halls',
    area: '~4 acres',
    desc: 'Six dedicated teaching halls for Sanskrit, Yoga, Āyurveda, Vedic sciences, arts, and leadership. Designed for 200 students simultaneously with open-air courtyards between each hall.',
    status: 'Phase 2',
    color: 'var(--si-orange-ink)',
  },
  {
    icon: '🧘',
    name: 'Yoga & Meditation Campus',
    area: '~3 acres',
    desc: 'An open-air yoga pavilion for 300 practitioners, a dedicated pranayama hall, and three silent meditation domes. The largest outdoor yoga space in Northern California.',
    status: 'Phase 2',
    color: 'var(--si-success)',
  },
  {
    icon: '🔬',
    name: 'Āyurveda Research Centre',
    area: '~2 acres',
    desc: 'A fully equipped Āyurveda laboratory, clinical consultation rooms, a panchakarma treatment wing, and a library of 5,000+ classical texts. Partners with UCSF for integrative medicine research.',
    status: 'Phase 3',
    color: 'var(--si-violet)',
  },
  {
    icon: '🌿',
    name: 'Organic Farm & Herb Garden',
    area: '~8 acres',
    desc: 'A certified organic farm growing Āyurvedic herbs, seasonal vegetables, and medicinal plants. Supplies the campus kitchen, the Āyurveda dispensary, and a community-supported agriculture programme.',
    status: 'Phase 2',
    color: '#059669',
  },
  {
    icon: '🏠',
    name: 'Residential Quarters',
    area: '~5 acres',
    desc: 'Residential accommodation for 150 resident students, visiting scholars, and retreat participants. Designed around traditional ashram principles — simple, clean, and conducive to sadhana.',
    status: 'Phase 3',
    color: '#DC2626',
  },
  {
    icon: '⛩️',
    name: 'Sacred Core — Adiyogi & Temple',
    area: '~4 acres',
    desc: 'The spiritual heart of the campus: the Adiyogi statue, a classical temple, the central reflecting pool, and the main courtyard for satsangs, festivals, and community gatherings of up to 2,000 people.',
    status: 'Phase 1',
    color: 'var(--si-amber)',
  },
];

const PHASES = [
  { phase: 'Phase 1', year: '2024–2025', title: 'Land Acquisition', items: ['33-acre property secured', 'Legal clearance and zoning', 'Master plan finalised', 'Foundation fundraising launched'], active: true },
  { phase: 'Phase 2', year: '2025–2027', title: 'Core Infrastructure', items: ['Gurukul teaching halls', 'Yoga & meditation campus', 'Organic farm established', 'Basic residential quarters'], active: false },
  { phase: 'Phase 3', year: '2027–2030', title: 'Full Campus', items: ['Āyurveda research centre', 'Full residential complex', 'Sacred core & Adiyogi statue', 'Community spaces & amphitheatre'], active: false },
];

export default function Campus() {
  const [activeRender, setActiveRender] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Layout>
      <PageMeta
        title="Campus Vision — 33-Acre Gurukul Campus, El Sabrante, CA"
        description="Explore the architectural vision for Sanatan International's permanent 33-acre campus in El Sabrante, California — Gurukul halls, Yoga campus, Āyurveda research centre, organic farm, and residential quarters."
        url="/campus"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Campus Vision', href: '/campus' }]} />

      {/* ── Hero ── */}
      <section className="on-dark relative overflow-hidden" style={{ background: 'var(--si-hero-dark)', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0">
          <Image src={RENDERS[4].src} alt="Campus aerial view" className="w-full h-full object-cover" style={{ opacity: 0.55, objectPosition: 'center 30%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,25,35,0.5) 0%, rgba(15,25,35,0.4) 40%, rgba(15,25,35,0.92) 100%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, width: '100%', paddingTop: '100px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', padding: '5px 16px', marginBottom: '20px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.35)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-orange)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              
                Land Acquisition Phase Active · El Sabrante, CA
              </span>
            </div>
            
              A permanent home<br />
              for ancient wisdom.</span>
            </h1>
            <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '28px', lineHeight: 1.5 }}>
              33 acres in El Sabrante, California — conceived by Pankaj Tyagi as the first permanent Gurukul campus in the Western world.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              
                View Renders ↓
              </a>
              
                Support the Fund
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="on-dark" style={{ background: 'var(--si-hero-mid)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container py-8">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
            {[
              { n: '33', s: 'Acres', l: 'Total campus area' },
              { n: '500+', s: 'Capacity', l: 'Daily visitors & students' },
              { n: '6', s: 'Zones', l: 'Distinct campus areas' },
              { n: '$2M+', s: 'Goal', l: 'Land acquisition fund' },
              { n: '2026', s: 'Target', l: 'Groundbreaking year' },
            ].map(({ n, s, l }) => (
              <div key={s} style={{ textAlign: 'center' }}>
                {n}</p>
                {s}</p>
                {l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-7xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">Architectural Renders</p>
              
                The campus, visualised
              </h2>
              
                Five architectural vision renders showing the campus at different angles and times of day. Click any image to expand.
              </p>
            </div>
          </Reveal>

          {/* Main featured render */}
          <Reveal delay={100}>
            <div
              className="rounded-2xl overflow-hidden cursor-pointer relative"
              style={{ aspectRatio: '16/7', marginBottom: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={RENDERS[activeRender].src}
                alt={RENDERS[activeRender].title}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 400ms ease' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '28px' }}>
                
                  {RENDERS[activeRender].tag}
                </span>
                
                  {RENDERS[activeRender].title}
                </h3>
                
                  {RENDERS[activeRender].caption}
                </p>
              </div>
              {/* Expand icon */}
              <div style={{ position: 'absolute', top: '20px', right: '20px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </div>
            </div>
          </Reveal>

          {/* Thumbnail strip */}
          <Reveal delay={200}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {RENDERS.map((r, i) => (
                <div
                  key={r.id}
                  onClick={() => setActiveRender(i)}
                  style={{
                    borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/9',
                    border: `2.5px solid ${activeRender === i ? 'var(--si-orange)' : 'transparent'}`,
                    boxShadow: activeRender === i ? '0 0 0 3px rgba(249,115,22,0.2)' : 'none',
                    transition: 'all 200ms ease', opacity: activeRender === i ? 1 : 0.65,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = activeRender === i ? '1' : '0.65'; }}
                >
                  <Image src={r.src} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Campus Zones ── */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="label-chip mb-3">Campus Plan</p>
              
                Six zones, one vision
              </h2>
              
                Each zone of the campus serves a distinct purpose — together they form a complete ecosystem for human flourishing.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {ZONES.map((z, i) => (
              <Reveal key={z.name} delay={i * 80}>
                <div style={{ borderRadius: '16px', border: `1.5px solid ${z.color}22`, background: 'var(--si-card)', padding: '28px', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'box-shadow 200ms ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{z.icon}</span>
                    
                      {z.status}
                    </span>
                  </div>
                  {z.name}</h3>
                  {z.area}</p>
                  {z.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Phased Timeline ── */}
      <section className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="label-chip mb-3">Development Timeline</p>
              
                Three phases to completion
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {PHASES.map((p, i) => (
              <Reveal key={p.phase} delay={i * 120}>
                <div style={{ borderRadius: '16px', padding: '28px', background: p.active ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${p.active ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    
                      {p.active ? '● Active' : p.phase}
                    </span>
                    {p.year}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.3rem', color: p.active ? 'white' : 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>{p.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {p.items.map((item) => (
                      
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.active ? 'var(--si-orange)' : 'rgba(255,255,255,0.2)', flexShrink: 0, marginTop: '6px' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder note ── */}
      <section style={{ background: 'var(--si-orange-tint)', borderTop: '1px solid var(--si-orange-light)', borderBottom: '1px solid var(--si-orange-light)' }}>
        <div className="container py-16 max-w-4xl">
          <Reveal>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Image src="/Images/pankaj_35d7f5c2.png" alt="Pankaj Tyagi"
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0, border: '3px solid var(--si-orange-light)' }} />
              <div style={{ flex: 1, minWidth: '260px' }}>
                
                  "This campus is not a monument. It is a tool — the most powerful tool we can give to the next generation of Indians born outside India. A place where they can come and remember who they are."
                </blockquote>
                
                  PANKAJ TYAGI · Founder & Chief Visionary
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Donate CTA ── */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-4xl text-center">
          <Reveal>
            <p className="label-chip mb-4">Support the Vision</p>
            
              Help us secure the land
            </h2>
            
              We are in the land acquisition phase. Every donation goes directly toward securing the 33-acre property in El Sabrante, California. All finances are publicly documented.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              
                Donate to the Land Fund →
              </Link>
              
                View Financial Reports
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setLightboxOpen(false)}
        >
      {/* ── Sticky Donate CTA ── */}
      
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Support this Vision →
      </Link>
          <Image
            src={RENDERS[activeRender].src}
            alt={RENDERS[activeRender].title}
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
          
            ×
          </button>
        </div>
      )}
    </Layout>
  );
}
