// Sanatan International — Impact Stories
// Design: Dark hero, stats bar, story cards with images, community transformation section
import React, { useEffect, useRef, useState } from 'react';
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

const STORIES = [
  {
    slug: 'gurukul-student-transformation',
    name: 'Priya, Age 14',
    location: 'Oakland, CA',
    category: 'Education',
    image: '/Images/impact-student_01c13a3f.jpg',
    quote: '"I never thought I could memorize Sanskrit shlokas. Now I recite 25 and understand what they mean."',
    story: 'Priya enrolled in Gurukul Level 1 after struggling with focus and confidence at school. After 12 weeks of structured practice — Sanskrit, Surya Namaskar, and Vedic math — her teachers noticed a marked improvement in her concentration and self-discipline.',
    impact: '25 shlokas memorized',
    color: 'var(--si-info)', bg: 'var(--si-info-tint)',
  },
  {
    slug: 'ayurveda-lifestyle-change',
    name: 'Sunita & Family',
    location: 'San Jose, CA',
    category: 'Wellness',
    image: '/Images/impact-family_fd27a18c.jpg',
    quote: '"The dinacharya program changed how I start every morning. My anxiety is down, my energy is up."',
    story: 'Sunita participated in our Ayurveda lifestyle program after years of chronic fatigue. Following a personalized dinacharya routine based on Ashtanga Hridayam principles, she reported significant improvements in sleep, digestion, and mental clarity within 8 weeks.',
    impact: '8-week transformation',
    color: 'var(--si-success)', bg: 'var(--si-success-tint)',
  },
  {
    slug: 'senior-scam-prevention-bay-area',
    name: 'Ramesh & Meena',
    location: 'El Sabrante, CA',
    category: 'Elder Welfare',
    image: '/Images/volunteer-community_33a9555e.jpg',
    quote: '"Before SeniorSeva, we were afraid to use our phones. Now we feel protected and connected to our family."',
    story: 'A retired couple in El Sabrante were targeted by multiple phone scams in 2024. After joining our digital safety workshop and using SeniorSeva, they reported zero incidents in six months and now help other seniors in their building.',
    impact: 'Scam-free for 6 months',
    color: 'var(--si-rose)', bg: 'var(--si-rose-tint)',
  },
  {
    slug: 'volunteer-community-service',
    name: 'Vikram, Volunteer Coordinator',
    location: 'Bay Area, CA',
    category: 'Community',
    image: '/Images/volunteer-teaching_c04783f9.jpg',
    quote: '"Volunteering here is not just service — it is education. I learn something new about our tradition every week."',
    story: 'Vikram joined as a volunteer in 2024 and now coordinates outreach across three Bay Area regions. He has helped onboard 40+ volunteers and organized 8 community events, all while deepening his own practice.',
    impact: '40+ volunteers onboarded',
    color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)',
  },
];

export default function Impact() {
  const { t, lang } = useLanguage();

  return (
    <Layout>
      <PageMeta
        title="Impact Stories — Sanatan International"
        description="Real people, real change — documented with care. Stories from students, elders, volunteers, and families served by Sanatan International programs."
        url="/impact"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Newsroom', href: '/impact' }, { name: 'Impact Stories', href: '/impact' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/impact-student_01c13a3f.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-3">Newsroom</p>
            
              Impact Stories
            </h1>
            
              Real people. Real change. Documented with care.
            </p>
            
              Every program we run is measured by its effect on people's lives. These are the stories behind the numbers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '200+', label: 'Students served' },
              { num: '40+', label: 'Active volunteers' },
              { num: '8', label: 'Community events' },
              { num: '3', label: 'Bay Area regions' },
            ].map((s) => (
              <div key={s.label} className="card-white p-5 text-center">
                {s.num}</p>
                {s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Cards with images */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">Stories</p>
              Lives transformed</h2>
            </div>
          </Reveal>
          <div className="space-y-10">
            {STORIES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <div className="card-white overflow-hidden" style={{ borderRadius: '20px' }}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                    {/* Image */}
                    <div className={`${i % 2 === 1 ? 'lg:col-start-2' : ''}`} style={{ aspectRatio: '16/10', overflow: 'hidden', position: 'relative' }}>
                      <Image src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${s.color}40, transparent)` }} />
                      <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                        {s.category}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div className="mb-4">
                        {s.name}</p>
                        {s.location}</p>
                      </div>
                      
                        {s.quote}
                      </blockquote>
                      {s.story}</p>
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl px-3 py-2" style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
                          ✓ {s.impact}</p>
                        </div>
                        <SocialShare url={`${BASE}/impact/${s.slug}`} title={`Impact Story: ${s.name}`} description={s.story} compact />
                      </div>
                    </div>
                  </div>
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
            <p className="label-chip mb-4">Be Part of the Story</p>
            Your support creates these stories.</h2>
            
              Every donation, every volunteer hour, every enrollment creates a story like these. Join us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/donate" className="btn-orange">Donate →</a>
              Volunteer →</a>
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/impact" picks={['/blog', '/volunteer', '/donate']} />
    </Layout>
  );
}

