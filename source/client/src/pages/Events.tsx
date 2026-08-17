// Sanatan International — Events Calendar
// Design: Dark hero with satsang image, featured event hero cards, calendar grid, past events gallery
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import PageMeta from '@/components/PageMeta';
import SocialShare from '@/components/SocialShare';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from "@/components/Image";
import { downloadIcs, googleCalendarUrl } from '@/lib/calendar';

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

const FEATURED_EVENTS = [
  {
    slug: 'campus-fundraiser-gala',
    title: 'Campus Land Fund Fundraiser',
    date: 'October 10, 2025',
    time: '6:00 PM – 10:00 PM PDT',
    location: 'Bay Area (venue TBD)',
    type: 'Fundraiser',
    image: '/Images/event-satsang_86ddb9ec.jpg',
    desc: 'An evening of community, culture, and commitment to the El Sabrante campus vision. Dinner, cultural performances, and a campaign update.',
    featured: true,
  },
  {
    slug: 'gurukul-open-house-2025',
    title: 'Gurukul Open House',
    date: 'August 15, 2025',
    time: '10:00 AM – 1:00 PM PDT',
    location: 'El Sabrante, CA',
    type: 'Education',
    image: '/Images/event-yoga_cf18d319.jpg',
    desc: 'Tour our Gurukul programs, meet instructors, and learn how to enroll. Open to families, students, and community members of all backgrounds.',
    featured: true,
  },
];

const EVENTS = [
  { slug: 'gurukul-open-house-2025', title: 'Gurukul Open House', date: 'August 15, 2025', time: '10:00 AM – 1:00 PM PDT', location: 'El Sabrante, CA', type: 'Education', status: 'upcoming', desc: 'Tour our Gurukul programs, meet instructors, and learn how to enroll. Open to families, students, and community members of all backgrounds.' },
  { slug: 'ayurveda-workshop-oakland', title: 'Ayurveda & Dinacharya Workshop', date: 'August 22, 2025', time: '2:00 PM – 5:00 PM PDT', location: 'Oakland, CA', type: 'Wellness', status: 'upcoming', desc: 'A hands-on workshop introducing Ayurvedic daily routines (dinacharya) for modern life. Includes a Q&A with our Ayurveda research team.' },
  { slug: 'community-satsang-san-jose', title: 'Community Satsang', date: 'September 5, 2025', time: '6:00 PM – 8:00 PM PDT', location: 'San Jose, CA', type: 'Community', status: 'upcoming', desc: 'A monthly community gathering for shared practice, discussion, and connection. All are welcome. Light refreshments provided.' },
  { slug: 'sanskrit-immersion-online', title: 'Sanskrit Immersion Weekend', date: 'September 13–14, 2025', time: '9:00 AM – 4:00 PM PDT', location: 'Online (Zoom)', type: 'Language', status: 'upcoming', desc: 'An intensive two-day introduction to Sanskrit — script, pronunciation, and foundational grammar. Suitable for complete beginners.' },
  { slug: 'digital-safety-workshop-fremont', title: 'Digital Safety Workshop for Seniors', date: 'September 20, 2025', time: '11:00 AM – 1:00 PM PDT', location: 'Fremont, CA', type: 'Welfare', status: 'upcoming', desc: 'A free workshop helping elders navigate online safety, identify scams, and use SeniorSeva. Bilingual support available (Hindi/Gujarati).' },
  { slug: 'campus-fundraiser-gala', title: 'Campus Land Fund Fundraiser', date: 'October 10, 2025', time: '6:00 PM – 10:00 PM PDT', location: 'Bay Area (venue TBD)', type: 'Fundraiser', status: 'upcoming', desc: 'An evening of community, culture, and commitment to the El Sabrante campus vision. Dinner, cultural performances, and a campaign update.' },
];

const PAST_EVENTS = [
  { title: 'Holi Community Celebration', date: 'March 2025', location: 'El Sabrante', attendees: '120+', type: 'Community' },
  { title: 'Yoga & Pranayama Workshop', date: 'February 2025', location: 'Oakland', attendees: '45', type: 'Wellness' },
  { title: 'Sanskrit Reading Circle', date: 'January 2025', location: 'Online', attendees: '30', type: 'Language' },
  { title: 'Elder Care Digital Safety', date: 'December 2024', location: 'Fremont', attendees: '60+', type: 'Welfare' },
  { title: 'Diwali Satsang & Puja', date: 'November 2024', location: 'San Jose', attendees: '200+', type: 'Community' },
  { title: 'Gurukul Orientation Day', date: 'October 2024', location: 'El Sabrante', attendees: '85', type: 'Education' },
];

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  Education: { bg: 'var(--si-info-tint)', color: 'var(--si-info)' },
  Wellness: { bg: 'var(--si-success-tint)', color: 'var(--si-success)' },
  Community: { bg: 'var(--si-orange-tint)', color: 'var(--si-orange-ink)' },
  Language: { bg: 'var(--si-fuchsia-tint)', color: 'var(--si-violet-deep)' },
  Welfare: { bg: 'var(--si-rose-tint)', color: 'var(--si-rose)' },
  Fundraiser: { bg: 'var(--si-amber-tint)', color: 'var(--si-amber)' },
};

export default function Events() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('All');
  const types = ['All', ...Object.keys(TYPE_COLORS)];
  const filtered = filter === 'All' ? EVENTS : EVENTS.filter(e => e.type === filter);

  return (
    <Layout>
      <PageMeta
        title="Events & Gatherings — Sanatan International"
        description="Upcoming satsangs, workshops, Gurukul open houses, and community events from Sanatan International across the Bay Area and online."
        url="/events"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Events', href: '/events' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark relative overflow-hidden" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/event-satsang_86ddb9ec.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-3">Community</p>
            
              Gatherings &<br /><span className="text-si-orange-ink">Events</span>
            </h1>
            
              Satsangs, workshops, and community celebrations across the Bay Area.
            </p>
            
              Join us for in-person and online events — from Sanskrit immersions and Ayurveda workshops to community satsangs and fundraiser galas. All are welcome.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Events — image hero cards */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-16 max-w-6xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">Featured Events</p>
              Don't miss these</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {FEATURED_EVENTS.map((ev, i) => {
              const tc = TYPE_COLORS[ev.type] || TYPE_COLORS['Community'];
              return (
                <Reveal key={ev.slug} delay={i * 100}>
                  <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--si-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(249,115,22,0.12)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/8', overflow: 'hidden' }}>
                      <Image src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                        {ev.type}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
                        {ev.title}</p>
                        {ev.date} · {ev.location}</p>
                      </div>
                    </div>
                    <div style={{ padding: '20px 24px 24px' }}>
                      {ev.desc}</p>
                      <div className="flex items-center justify-between">
                        {ev.time}</span>
                        
                            Add to calendar
                          </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Events with filter */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-16 max-w-5xl">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="label-chip mb-2">Upcoming Events</p>
                All gatherings</h2>
              </div>
              <SocialShare url={`${BASE}/events`} title="Sanatan International — Events" compact />
            </div>
          </Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {types.map((tp) => {
              const isActive = filter === tp;
              const tc = TYPE_COLORS[tp];
              return (
                
                  {tp}
                </button>
              );
            })}
          </div>
          <div className="space-y-5">
            {filtered.map((ev, i) => {
              const tc = TYPE_COLORS[ev.type] || TYPE_COLORS['Community'];
              return (
                <Reveal key={ev.slug} delay={i * 60}>
                  <div className="card-white p-6"
                    style={{ transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(249,115,22,0.08)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div style={{ minWidth: '80px', textAlign: 'center', background: tc.bg, borderRadius: '12px', padding: '10px 8px', flexShrink: 0 }}>
                        <p className="font-display font-bold text-xl" style={{ color: tc.color }}>{ev.date.split(' ')[1]?.replace(',', '') || ev.date.split(' ')[0]}</p>
                        {ev.date.split(' ')[0]?.slice(0, 3)}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {ev.type}</span>
                          {ev.time}</span>
                        </div>
                        {ev.title}</h3>
                        📍 {ev.location}</p>
                        {ev.desc}</p>
                        <div className="flex items-center gap-4">
                          
                              Add to calendar
                            </button>
                            
                              Google Calendar →
                            </a>
                          <SocialShare url={`${BASE}/events/${ev.slug}`} title={ev.title} description={ev.desc} compact />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Past Events Gallery */}
      <section className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              Past Events</p>
              A year of gathering</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PAST_EVENTS.map((ev, i) => {
              const tc = TYPE_COLORS[ev.type] || TYPE_COLORS['Community'];
              return (
                <Reveal key={ev.title} delay={i * 60}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                    {ev.type}</span>
                    {ev.title}</p>
                    {ev.date} · {ev.location}</p>
                    {ev.attendees} attendees</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Host an event CTA */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <Reveal>
            <p className="label-chip mb-4">Host an Event</p>
            Want to organise a satsang in your city?</h2>
            
              We support community members who want to host Sanatan International events in their area. We provide materials, speakers, and coordination support.
            </p>
            <Link href="/contact" className="btn-orange">Contact Our Events Team →</Link>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/events" picks={['/volunteer', '/donate', '/gurukul/join']} />
    </Layout>
  );
}
