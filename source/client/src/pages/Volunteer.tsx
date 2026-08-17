// Sanatan International — Volunteer Program
// Design: Dark hero with volunteer image, impact stats, role cards, volunteer stories, spotlight
import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import PageMeta from '@/components/PageMeta';
import SocialShare from '@/components/SocialShare';
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

const BASE = 'https://www.sanataninternational.org';

const ROLES = [
  { slug: 'community-outreach-coordinator', title: 'Community Outreach Coordinator', region: 'Bay Area (all regions)', commitment: '4–6 hrs/week', skills: ['Communication', 'Community organizing', 'Bilingual preferred'], desc: 'Help us reach elders, families, and students who can benefit from our programs. Coordinate local events, distribute materials, and serve as a community liaison.', color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)', img: '/Images/volunteer-community_33a9555e.jpg' },
  { slug: 'gurukul-teaching-assistant', title: 'Gurukul Teaching Assistant', region: 'El Sabrante / Online', commitment: '3–5 hrs/week', skills: ['Sanskrit basics', 'Teaching experience', 'Patience'], desc: 'Support Gurukul instructors during Level 1 and Level 2 sessions. Help students with pronunciation, comprehension, and practice exercises.', color: 'var(--si-info)', bg: 'var(--si-info-tint)', img: '/Images/volunteer-teaching_c04783f9.jpg' },
  { slug: 'digital-safety-trainer', title: 'Digital Safety Trainer', region: 'Oakland / San Jose', commitment: '2–4 hrs/week', skills: ['Tech literacy', 'Elder care experience', 'Hindi/Gujarati a plus'], desc: 'Conduct in-person and virtual workshops teaching elders how to use SeniorSeva and other digital safety tools. Patience and empathy are essential.', color: 'var(--si-success)', bg: 'var(--si-success-tint)', img: '/Images/wellbeing-meditation_66e9e78d.jpg' },
  { slug: 'research-documentation-volunteer', title: 'Research & Documentation Volunteer', region: 'Remote', commitment: '5–8 hrs/week', skills: ['Sanskrit or Ayurveda background', 'Academic writing', 'Research methodology'], desc: 'Assist our Ayurveda research team with literature review, translation, and documentation of classical texts for modern application.', color: 'var(--si-violet-deep)', bg: 'var(--si-fuchsia-tint)', img: '/Images/ayurveda-lab_79f87079.jpg' },
];

const VOLUNTEER_STORIES = [
  { name: 'Vikram S.', city: 'Oakland, CA', role: 'Outreach Coordinator', quote: 'Volunteering here is not just service — it is education. I learn something new about our tradition every week.', impact: '40+ volunteers onboarded', img: '/Images/founder-vikram_c1b8a3f2.jpg' },
  { name: 'Ananya P.', city: 'San Jose, CA', role: 'Teaching Assistant', quote: 'Watching a child recite their first Sanskrit shloka with understanding — there is no feeling like it.', impact: '3 batches taught', img: '/Images/founder-ananya_d9e4b2c1.jpg' },
  { name: 'Suresh M.', city: 'Fremont, CA', role: 'Digital Safety Trainer', quote: 'The elders I work with remind me why this mission matters. Their gratitude is the best reward.', impact: '60+ elders trained', img: '/Images/advisor-generic-male_8c4d2e1f.jpg' },
];

export default function Volunteer() {
  const { t, lang } = useLanguage();

  return (
    <Layout>
      <PageMeta
        title="Volunteer Program — Sanatan International"
        description="Join the Sanatan International volunteer network across the Bay Area. Lend your skills to protect and serve communities — education, elder welfare, research, and outreach roles available."
        url="/volunteer"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Resources', href: '/volunteer' }, { name: 'Volunteer', href: '/volunteer' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark relative overflow-hidden" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/volunteer-teaching_c04783f9.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-3">Resources</p>
            
              Volunteer Program
            </h1>
            
              Lend your skills to protect and serve communities worldwide.
            </p>
            
              Volunteering at Sanatan International is not just service — it is education. Every role deepens your understanding of our tradition while making a tangible difference in people's lives.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Impact Stats with image */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="label-chip mb-4">Our Impact</p>
              
                Every volunteer<br /><span className="text-si-orange-ink">multiplies our reach.</span>
              </h2>
              
                Our volunteer network is the backbone of everything we do. From teaching Sanskrit to children in El Sabrante to training elders in Fremont to use digital safety tools — our volunteers are the mission in action.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: '40+', l: 'Active volunteers' },
                  { n: '3', l: 'Bay Area regions' },
                  { n: '8', l: 'Community events' },
                  { n: '200+', l: 'People served' },
                ].map((s) => (
                  <div key={s.l} className="card-white p-5 text-center">
                    {s.n}</p>
                    {s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/3' }}>
                <Image src="/Images/volunteer-community_33a9555e.jpg" alt="Volunteers serving community" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Volunteer of the Month Spotlight */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-12 max-w-5xl">
          <Reveal>
            <div style={{ background: 'linear-gradient(135deg, var(--si-orange-tint) 0%, #FEF3C7 100%)', borderRadius: '20px', padding: '32px', border: '1.5px solid var(--si-orange-light)', display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              <div className="flex items-start gap-5">
                
                  PS
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    ⭐ VOLUNTEER OF THE MONTH</span>
                    July 2025</span>
                  </div>
                  Priya Sharma</p>
                  Gurukul Teaching Assistant · El Sabrante, CA</p>
                  
                    "Every child who recites a shloka with understanding is a seed planted for the next generation. That is why I show up every week."
                  </blockquote>
                  2 batches taught · 30+ students · 6 months of service</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Teaching image + community image */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image src="/Images/volunteer-teaching_c04783f9.jpg" alt="Volunteer teaching Sanskrit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                  Teaching Sanskrit</p>
                  Gurukul Teaching Assistants · El Sabrante</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image src="/Images/volunteer-community_33a9555e.jpg" alt="Community service volunteers" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                  Community Service</p>
                  Community Kitchen Volunteers · Bay Area</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">Open Roles</p>
              Find your role</h2>
              
                We have roles for every skill set and availability level — from 2 hours a week to full programme coordination.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROLES.map((role, i) => (
              <Reveal key={role.slug} delay={i * 80}>
                <div className="card-white" style={{ borderTop: `4px solid ${role.color}`, transition: 'transform 200ms ease, box-shadow 200ms ease', overflow: 'hidden', borderRadius: '16px' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${role.color}20`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                >
                  {(role as any).img && (
                    <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                      <Image src={(role as any).img} alt={role.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${role.color}30 100%)` }} />
                    </div>
                  )}
                  <div style={{ padding: '24px 28px' }}>
                  {role.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    📍 {role.region}</span>
                    ⏱ {role.commitment}</span>
                  </div>
                  {role.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {role.skills.map((s) => (
                      {s}</span>
                    ))}
                  </div>
                  <Link href="/gurukul/join">
                    
                      Apply for this role →
                    </button>
                  </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Stories */}
      <section className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              Volunteer Stories</p>
              Hear from our volunteers</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VOLUNTEER_STORIES.map((vs, i) => (
              <Reveal key={vs.name} delay={i * 80}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '20px', padding: '24px', height: '100%' }}>
                  {(vs as any).img ? (
                    <Image src={(vs as any).img} alt={vs.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '16px', border: '2px solid rgba(249,115,22,0.4)' }} />
                  ) : (
                    
                      {vs.name.split(' ').map((w: string) => w[0]).join('')}
                    </div>
                  )}
                  <blockquote className="font-display italic text-base mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>"{vs.quote}"</blockquote>
                  {vs.name}</p>
                  {vs.role} · {vs.city}</p>
                  {vs.impact}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* Photo Gallery */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">In the Field</p>
              Volunteers in action</h2>
              Real moments from our community — teaching, serving, celebrating, and growing together.</p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <Reveal delay={0}>
              <div style={{ gridRow: 'span 2', borderRadius: '16px', overflow: 'hidden', height: '420px', position: 'relative' }}>
                <Image src="/Images/volunteer-teaching_c04783f9.jpg" alt="Volunteer teaching Sanskrit" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '16px 16px 14px' }}>
                  Sanskrit class</p>
                  Gurukul Teaching Assistants · El Sabrante, CA</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '200px', position: 'relative' }}>
                <Image src="/Images/event-satsang_86ddb9ec.jpg" alt="Community satsang" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '12px 14px 10px' }}>
                  Community Satsang</p>
                  Monthly gathering · Bay Area</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '200px', position: 'relative' }}>
                <Image src="/Images/impact-student_01c13a3f.jpg" alt="Student learning" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '12px 14px 10px' }}>
                  Student milestone</p>
                  First shloka recitation · San Jose, CA</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '208px', position: 'relative' }}>
                <Image src="/Images/volunteer-community_33a9555e.jpg" alt="Community service" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '12px 14px 10px' }}>
                  Community kitchen</p>
                  Outreach volunteers · Oakland, CA</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '208px', position: 'relative' }}>
                <Image src="/Images/event-yoga_cf18d319.jpg" alt="Yoga event" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '12px 14px 10px' }}>
                  Yoga & wellness day</p>
                  Community event · Fremont, CA</p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={240}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', marginTop: '12px', position: 'relative' }}>
              <Image src="/Images/impact-family_fd27a18c.jpg" alt="Family community impact" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', transition: 'transform 400ms ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '16px 20px 14px' }}>
                Families served</p>
                200+ people impacted across Bay Area · 2024–2025</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--si-cta)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <Reveal>
            <p className="font-devanagari text-3xl mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>"परोपकाराय सतां विभूतयः"</p>
            The wealth of the good is for the service of others.</h2>
            
              Join our volunteer network and lend your skills to a mission that matters.
            </p>
            <Link href="/gurukul/join">
              
                Apply to Volunteer →
              </button>
            </Link>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/volunteer" picks={['/events', '/donate', '/gurukul/join']} />
    </Layout>
  );
}
