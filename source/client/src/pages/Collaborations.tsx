// Sanatan International — Collaborations Page
// Design: Dark hero, branded partnership image cards, filter tabs, collaboration model section
import { useState, useEffect, useRef } from 'react';
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

const FEATURED_PARTNERS = [
  {
    name: 'Rashtriya Sanskrit Sansthan',
    type: 'Academic',
    location: 'New Delhi, India',
    status: 'Active MOU',
    since: '2023',
    image: '/Images/collab-university_7034665f.jpg',
    desc: 'Formal academic partnership for curriculum validation, Sanskrit teacher certification, and joint research into classical Vedic texts. RSV provides access to their digital manuscript library for our E-books programme.',
    tags: ['Sanskrit', 'Curriculum', 'Research'],
    color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)',
  },
  {
    name: 'Ayurvedic Institute, Albuquerque',
    type: 'Research',
    location: 'New Mexico, USA',
    status: 'Active MOU',
    since: '2024',
    image: '/Images/collab-research_e39a0a18.jpg',
    desc: 'Research collaboration on classical Ayurvedic formulations and their clinical applications. Joint development of evidence-based protocols for preventive health. Dr. Vasant Lad serves on our Advisory Board.',
    tags: ['Ayurveda', 'Research', 'Health'],
    color: 'var(--si-success)', bg: 'var(--si-success-tint)',
  },
  {
    name: 'Dharma Civilisation Foundation',
    type: 'Cultural',
    location: 'USA & India',
    status: 'Active Partnership',
    since: '2024',
    image: '/Images/collab-community_26ffd6d5.jpg',
    desc: 'Cultural collaboration on heritage preservation, community education, and the promotion of Dharmic values in the diaspora. Joint events, workshops, and youth programmes across the Bay Area.',
    tags: ['Culture', 'Community', 'Events'],
    color: 'var(--si-violet-deep)', bg: 'var(--si-fuchsia-tint)',
  },
  {
    name: 'Inerica Systems',
    type: 'Technology',
    location: 'Silicon Valley, CA',
    status: 'Active Partnership',
    since: '2023',
    image: '/Images/collab-tech_da5d63c0.jpg',
    desc: 'Technology partnership for building the Digital Welfare Suite, Meta Gurukul app, and digital infrastructure. Inerica Systems provides Silicon Valley-grade engineering expertise to our mission-driven technology development.',
    tags: ['Technology', 'Apps', 'Infrastructure'],
    color: 'var(--si-info)', bg: 'var(--si-info-tint)',
  },
];

const ALL_PARTNERS = [
  { name: 'Rashtriya Sanskrit Sansthan', type: 'Academic', location: 'New Delhi, India', status: 'Active MOU', since: '2023', desc: 'Formal academic partnership for curriculum validation, Sanskrit teacher certification, and joint research into classical Vedic texts.', tags: ['Sanskrit', 'Curriculum', 'Research'], color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)' },
  { name: 'Ayurvedic Institute, Albuquerque', type: 'Research', location: 'New Mexico, USA', status: 'Active MOU', since: '2024', desc: 'Research collaboration on classical Ayurvedic formulations and their clinical applications. Joint development of evidence-based protocols for preventive health.', tags: ['Ayurveda', 'Research', 'Health'], color: 'var(--si-success)', bg: 'var(--si-success-tint)' },
  { name: 'Infinity Foundation', type: 'Strategic', location: 'Princeton, NJ, USA', status: 'Active Partnership', since: '2023', desc: 'Strategic collaboration on civilisational research, academic outreach, and the preservation of Indic knowledge systems.', tags: ['Research', 'Publications', 'Strategy'], color: 'var(--si-info)', bg: 'var(--si-info-tint)' },
  { name: 'Dharma Civilisation Foundation', type: 'Cultural', location: 'USA & India', status: 'Active Partnership', since: '2024', desc: 'Cultural collaboration on heritage preservation, community education, and the promotion of Dharmic values in the diaspora.', tags: ['Culture', 'Community', 'Events'], color: 'var(--si-violet-deep)', bg: 'var(--si-fuchsia-tint)' },
  { name: 'Rural India Support Trust', type: 'Welfare', location: 'Tamil Nadu, India', status: 'Active MOU', since: '2024', desc: 'Welfare collaboration focused on rural community development, traditional knowledge preservation, and sustainable agriculture.', tags: ['Welfare', 'Agriculture', 'Community'], color: 'var(--si-amber)', bg: 'var(--si-amber-tint)' },
  { name: 'Bay Area Yoga Alliance', type: 'Programme', location: 'San Francisco Bay Area, CA', status: 'Active Partnership', since: '2023', desc: 'Programme partnership for Yoga teacher training, community classes, and wellness events across the Bay Area.', tags: ['Yoga', 'Training', 'Wellness'], color: 'var(--si-rose)', bg: 'var(--si-rose-tint)' },
  { name: 'Vedic Heritage Foundation', type: 'Academic', location: 'Houston, TX, USA', status: 'In Discussion', since: '2025', desc: 'Prospective academic partnership for joint Vedic studies programmes, digital scripture preservation, and community education initiatives.', tags: ['Vedic Studies', 'Digital', 'Education'], color: 'var(--si-text-muted)', bg: 'var(--si-surface-subtle)' },
  { name: 'Organic India Foundation', type: 'Sustainability', location: 'Lucknow, India', status: 'In Discussion', since: '2025', desc: 'Prospective partnership for organic farming training, Ayurvedic herb cultivation guidance, and sustainable food systems for the El Sabrante campus.', tags: ['Organic', 'Farming', 'Sustainability'], color: 'var(--si-success)', bg: 'var(--si-success-tint)' },
];

const TYPES = ['All', 'Academic', 'Research', 'Strategic', 'Cultural', 'Welfare', 'Programme', 'Technology', 'Sustainability'];

const COLLAB_MODELS = [
  { title: 'Academic Exchange', desc: 'Joint curriculum development, faculty exchange, and co-authored research publications with universities and academic institutions.', icon: '📚' },
  { title: 'Research Partnership', desc: 'Collaborative studies, shared laboratory resources, and co-publication of peer-reviewed research on Āyurveda and Vedic sciences.', icon: '🔬' },
  { title: 'Community Programmes', desc: 'Joint community events, workshops, and outreach programmes that bring Vedic knowledge to diaspora communities worldwide.', icon: '🤝' },
  { title: 'Technology Collaboration', desc: 'Co-development of digital tools, apps, and platforms that make Vedic education and wellness accessible at scale.', icon: '💻' },
];

export default function Collaborations() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? ALL_PARTNERS : ALL_PARTNERS.filter((p) => p.type === filter);

  return (
    <Layout>
      <PageMeta
        title="Collaborations & Partnerships — Sanatan International"
        description="Sanatan International's network of academic, research, cultural, and welfare partners — working together to preserve and apply Vedic knowledge for the benefit of all."
        url="/collaborations"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'The Hub', href: '/hub' }, { name: 'Collaborations', href: '/collaborations' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/collab-community_26ffd6d5.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-3">The Hub</p>
            
              Collaborations<br />
              <span className="text-si-orange-ink">& Partnerships</span>
            </h1>
            
              We believe no institution can preserve and transmit a civilisation alone. Our partnerships span academic institutions, research centres, cultural foundations, and welfare organisations across India, the United States, and beyond.
            </p>
            "संगच्छध्वं संवदध्वं" — Walk together, speak together.</p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: '8', l: 'Partner Organisations' },
              { n: '5', l: 'Active MOUs' },
              { n: '4', l: 'Countries' },
              { n: '2', l: 'In Discussion' },
            ].map((s) => (
              <div key={s.l} className="card-white p-4 text-center">
                {s.n}</p>
                {s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners — image cards */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">Featured Partnerships</p>
              Our key collaborators</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {FEATURED_PARTNERS.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <div
                  style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--si-card)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 36px rgba(249,115,22,0.12)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden' }}>
                    <Image src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                    {/* SI Brand badge */}
                    <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(249,115,22,0.9)', backdropFilter: 'blur(8px)', borderRadius: '8px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Image src="/Images/live-site-logo_9a0f956f.png" alt="SI" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                      SI PARTNER</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
                      {p.status}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{ padding: '22px 24px 24px' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {p.name}</h3>
                        {p.location} · Since {p.since}</p>
                      </div>
                      {p.type}</span>
                    </div>
                    {p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        {tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How We Collaborate */}
      <section className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              Collaboration Models</p>
              How we work together</h2>
              
                Our partnerships are structured around four collaboration models, each designed to create lasting, measurable impact.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COLLAB_MODELS.map((m, i) => (
              <Reveal key={m.title} delay={i * 80}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '20px', padding: '28px' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>{m.icon}</span>
                  {m.title}</h3>
                  {m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* All Partners grid with filter */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-16 max-w-6xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">All Partners</p>
              Our full network</h2>
            </div>
          </Reveal>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TYPES.map((tp) => {
              const isActive = filter === tp;
              return (
                
                  {tp}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((p) => (
              <div key={p.name} className="card-white p-7"
                style={{ transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(249,115,22,0.1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: p.bg, color: p.color, fontFamily: 'Playfair Display, serif', fontSize: '1rem' }}>
                      {p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      {p.name}</h3>
                      {p.location} · Since {p.since}</p>
                    </div>
                  </div>
                  
                    {p.status}
                  </span>
                </div>
                {p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag: string) => (
                    {tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center" style={{ background: 'var(--si-surface)', borderRadius: '24px', padding: '40px 32px' }}>
            Interested in collaborating?</h3>
            
              We welcome partnerships with academic institutions, research centres, cultural organisations, and welfare bodies that share our commitment to Vedic knowledge and human flourishing.
            </p>
            <Link href="/contact" className="btn-orange">Reach out to our team →</Link>
          </div>
        </div>
      </section>

      <RelatedPages current="/collaborations" picks={['/hub', '/contact', '/volunteer']} />
    </Layout>
  );
}
