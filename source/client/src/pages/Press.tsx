// Sanatan International — Media & Press page
// Design: Dark hero with press image, featured coverage strip, press release timeline, media kit CTA
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import PageMeta from '@/components/PageMeta';
import SocialShare from '@/components/SocialShare';
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

const BASE = 'https://www.sanataninternational.org';

const RELEASES = [
  { slug: 'sanatan-international-launches-digital-welfare-suite', date: 'July 1, 2025', type: 'Press Release', title: 'Sanatan International Launches Digital Welfare Suite for Seniors and Families', summary: 'Five ethically designed applications — DhyanaPath, PranaBalance, ChittaShuddhi, MedhaPlus, and SeniorSeva — are now in active development with community testing underway.', img: '/Images/wellbeing-meditation_66e9e78d.jpg' },
  { slug: 'gurukul-curriculum-framework-open-review', date: 'May 22, 2025', type: 'Announcement', title: 'Gurukul Curriculum Framework Released for Public Review', summary: 'The 4-level curriculum integrating spiritual, academic, physical, creative, and life skills is now publicly available for community feedback and academic review.', img: '/Images/digital-gurukul-class_2bc742df.jpg' },
  { slug: 'el-sabrante-land-due-diligence', date: 'March 15, 2025', type: 'Campus Update', title: 'Land Due-Diligence Phase Initiated for El Sabrante Campus', summary: 'Sanatan International has formally initiated the due-diligence process for a 33-acre property in El Sabrante, California, intended to serve as the permanent campus.', img: '/Images/Gemini_Generated_Image_lu0mc9lu0mc9lu0m_d52a8569.png' },
  { slug: 'volunteer-network-launch', date: 'August 12, 2024', type: 'Community', title: 'Volunteer Network Onboarded Across Three Bay Area Regions', summary: 'Community volunteers are now active in El Sabrante, Oakland, and San Jose, supporting outreach, elder welfare, and cultural programming.', img: '/Images/volunteer-community_33a9555e.jpg' },
  { slug: 'digital-safety-toolkit-seniors', date: 'April 3, 2024', type: 'Product Launch', title: 'Digital Safety Toolkit Launched for Seniors and Families', summary: 'A suite of protective digital tools designed to help elders navigate online environments safely, with a focus on scam prevention and family connectivity.', img: '/Images/foundation-technology_ef4a72b7.jpg' },
];

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  'Press Release': { bg: 'var(--si-orange-tint)', color: 'var(--si-orange-ink)' },
  'Announcement': { bg: 'var(--si-info-tint)', color: 'var(--si-info)' },
  'Campus Update': { bg: 'var(--si-success-tint)', color: 'var(--si-success)' },
  'Community': { bg: 'var(--si-rose-tint)', color: 'var(--si-rose)' },
  'Product Launch': { bg: 'var(--si-fuchsia-tint)', color: 'var(--si-violet-deep)' },
};

const MEDIA_OUTLETS = [
  { name: 'Times of India', color: '#D32F2F' },
  { name: 'Hindustan Times', color: '#1565C0' },
  { name: 'NRI Pulse', color: '#2E7D32' },
  { name: 'India Abroad', color: '#F57F17' },
  { name: 'The Hindu', color: '#B71C1C' },
  { name: 'India West', color: '#1A237E' },
  { name: 'Desi Talk', color: '#4A148C' },
  { name: 'Sikh Times', color: '#1B5E20' },
];

const PRESS_STATS = [
  { n: '5', l: 'Press Releases' },
  { n: '8', l: 'Media Outlets' },
  { n: '2025', l: 'Year Founded' },
  { n: '3', l: 'Bay Area Regions' },
];

export default function Press() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('All');
  const allTypes = ['All', ...Object.keys(TYPE_COLORS)];
  const filtered = filter === 'All' ? RELEASES : RELEASES.filter(r => r.type === filter);

  return (
    <Layout>
      <PageMeta
        title="Media & Press — Sanatan International"
        description="Official press releases, announcements, and media resources from Sanatan International. For media inquiries contact press@sanataninternational.org"
        image="/Images/og-press_cf0ba4cf.jpg"
        url="/press"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Newsroom', href: '/press' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/press-media_1698789e.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-3">Newsroom</p>
            
              Media & Press
            </h1>
            
              Official press releases, announcements, and media resources.
            </p>
            
              For media inquiries, interview requests, or high-resolution assets, contact us at{' '}
              press@sanataninternational.org</a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRESS_STATS.map((s) => (
              <div key={s.l} className="card-white p-4 text-center">
                {s.n}</p>
                {s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured In strip */}
      <section style={{ background: 'var(--si-card)', borderBottom: '1px solid var(--si-surface-alt)' }}>
        <div className="container py-10 max-w-5xl">
          <Reveal>
            
              Featured In & Aspirational Coverage *
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {MEDIA_OUTLETS.map((outlet) => (
                <div key={outlet.name}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid var(--si-border)', background: 'var(--si-card)', transition: 'all 180ms ease', cursor: 'default' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = outlet.color; (e.currentTarget as HTMLDivElement).style.background = outlet.color + '08'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--si-border)'; (e.currentTarget as HTMLDivElement).style.background = 'white'; }}
                >
                  <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.85rem', color: outlet.color }}>{outlet.name}</span>
                </div>
              ))}
            </div>
            * Aspirational coverage targets. Logos shown for illustrative purposes.</p>
          </Reveal>
        </div>
      </section>

      {/* Media Kit Banner */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-12 max-w-5xl">
          <Reveal>
            <div className="on-dark rounded-2xl overflow-hidden" style={{ background: 'var(--si-hero-dark)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div style={{ padding: '40px 40px' }}>
                  Media Kit</p>
                  Download our brand assets</h2>
                  
                    Logos, founder portraits, photography guidelines, and a one-page organizational fact sheet — everything a journalist needs in one ZIP.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    
                      Download Press Kit →
                    </a>
                    
                      Email Press Team
                    </a>
                  </div>
                </div>
                <div style={{ background: 'rgba(249,115,22,0.06)', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', borderLeft: '1px solid rgba(249,115,22,0.15)' }}>
                  {['High-resolution logo (PNG, SVG)', 'Founder portraits (4 × 300dpi)', 'Organizational fact sheet (PDF)', 'Brand color & typography guide', 'Mission statement & boilerplate'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-orange)', flexShrink: 0 }} />
                      {item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Press Releases */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-16 max-w-5xl">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="label-chip mb-2">Press Releases</p>
                Latest announcements</h2>
              </div>
              <SocialShare url={`${BASE}/press`} title="Sanatan International — Media & Press" compact />
            </div>
          </Reveal>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allTypes.map((tp) => {
              const isActive = filter === tp;
              const tc = TYPE_COLORS[tp];
              return (
                
                  {tp}
                </button>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--si-orange), var(--si-border))', borderRadius: '2px' }} />
            <div className="space-y-6 pl-12">
              {filtered.map((r, i) => {
                const tc = TYPE_COLORS[r.type] || TYPE_COLORS['Press Release'];
                return (
                  <Reveal key={r.slug} delay={i * 70}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-32px', top: '20px', width: '12px', height: '12px', borderRadius: '50%', background: tc.color, border: '3px solid white', boxShadow: `0 0 0 2px ${tc.color}40` }} />
                      <div className="card-white" style={{ overflow: 'hidden', borderRadius: '14px' }}>
                        <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
                          {(r as any).img && (
                            <div style={{ width: '100%', maxWidth: '200px', minHeight: '140px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                              <Image src={(r as any).img} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '140px' }} />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.8) 100%)' }} />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-3 mb-3">
                              {r.type}</span>
                              {r.date}</span>
                            </div>
                            {r.title}</h3>
                            {r.summary}</p>
                            <SocialShare url={`${BASE}/press/${r.slug}`} title={r.title} description={r.summary} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact for media */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <Reveal>
            <p className="label-chip mb-4">Media Inquiries</p>
            Working on a story?</h2>
            
              We welcome media coverage and are happy to provide interviews, background information, and high-resolution assets. Our press team typically responds within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:press@sanataninternational.org" className="btn-orange">Email Press Team →</a>
              Request an Interview</a>
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/press" picks={['/blog', '/impact', '/faqs']} />
    </Layout>
  );
}

