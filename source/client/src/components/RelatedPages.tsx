// RelatedPages — "You might also like" section with category filter tabs
// Reusable across all Newsroom and Resources pages.
// Pass `current` page slug to exclude it from suggestions.
// Category filter tabs let users sort by Newsroom, Resources, Programs, Technology, Support.
import { useState, useMemo } from 'react';
import { Link } from 'wouter';

interface RelatedPage {
  href: string;
  icon: string;
  category: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

// ─── Full page catalogue ──────────────────────────────────────────────────────
const ALL_PAGES: RelatedPage[] = [
  { href: '/blog',      icon: '✍️', category: 'Newsroom',   title: 'Official Blog',         desc: 'Insights, research, and community stories from our team.',              color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)' },
  { href: '/press',     icon: 'news', category: 'Newsroom',   title: 'Media & Press',          desc: 'Official press releases and announcements.',                            color: 'var(--si-info)', bg: 'var(--si-info-tint)' },
  { href: '/impact',    icon: 'impact', category: 'Newsroom',   title: 'Impact Stories',         desc: 'Real people, real change — documented with care.',                      color: 'var(--si-success)', bg: 'var(--si-success-tint)' },
  { href: '/faqs',      icon: '💬', category: 'Newsroom',   title: 'FAQs',                   desc: 'Clear answers to enrollment, donations, and campus questions.',          color: 'var(--si-violet-deep)', bg: 'var(--si-fuchsia-tint)' },
  { href: '/volunteer', icon: '🤝', category: 'Resources',  title: 'Volunteer Program',      desc: 'Lend your skills to protect and serve communities.',                     color: 'var(--si-rose)', bg: 'var(--si-rose-tint)' },
  { href: '/events',    icon: '📅', category: 'Resources',  title: 'Events Calendar',        desc: 'Sacred gatherings, workshops, and community programs.',                  color: 'var(--si-amber)', bg: 'var(--si-amber-tint)' },
  { href: '/contact',   icon: 'contact', category: 'Resources',  title: 'Contact Us',             desc: 'Reach our team with any question or inquiry.',                           color: 'var(--si-info)', bg: 'var(--si-info-tint)' },
  { href: '/gurukul',   icon: 'scroll', category: 'Programs',   title: 'Gurukul Training',       desc: 'Four-level Vedic education curriculum for all ages.',                    color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)' },
  { href: '/ayurveda',  icon: 'ayurveda', category: 'Programs',   title: 'Ayurveda Research',      desc: 'Classical Ayurvedic science applied to modern preventive health.',        color: 'var(--si-success)', bg: 'var(--si-success-tint)' },
  { href: '/apps',      icon: 'app', category: 'Technology', title: 'Digital Welfare Suite',  desc: 'Ethically designed apps for focus, calm, and safety.',               color: 'var(--si-info)', bg: 'var(--si-info-tint)' },
  { href: '/donate',    icon: '🙏', category: 'Support',    title: 'Donate',                 desc: 'Support the El Sabrante campus land acquisition fund.',                  color: 'var(--si-orange-ink)', bg: 'var(--si-orange-tint)' },
  { href: '/about',     icon: 'financial', category: 'Programs',   title: 'About the Centre',       desc: 'Learn about our mission, governance, and founding story.',               color: 'var(--si-text-muted)', bg: 'var(--si-surface-subtle)' },
];

const ALL_CATEGORIES = ['All', 'Newsroom', 'Resources', 'Programs', 'Technology', 'Support'];

// ─── Component ────────────────────────────────────────────────────────────────
interface RelatedPagesProps {
  current: string;
  picks?: string[];
  title?: string;
}

export default function RelatedPages({ current, picks, title = 'You might also like' }: RelatedPagesProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Base pool: exclude current page
  const pool = useMemo(() => ALL_PAGES.filter((p) => p.href !== current), [current]);

  // If explicit picks provided, use them as the base pool (still filterable by category)
  const basePicks = useMemo(() => {
    if (picks && picks.length > 0) {
      const picked = picks.map((href) => ALL_PAGES.find((p) => p.href === href)).filter((p): p is RelatedPage => !!p);
      // Merge picks with rest of pool (picks first, then fill from pool for category view)
      const pickedHrefs = new Set(picks);
      const rest = pool.filter((p) => !pickedHrefs.has(p.href));
      return [...picked, ...rest];
    }
    return pool;
  }, [picks, pool]);

  // Filter by active category
  const filtered = useMemo(() => {
    if (activeCategory === 'All') return basePicks.slice(0, 6);
    return basePicks.filter((p) => p.category === activeCategory).slice(0, 6);
  }, [activeCategory, basePicks]);

  // Determine which categories have results
  const availableCategories = useMemo(() => {
    return ALL_CATEGORIES.filter((cat) => {
      if (cat === 'All') return true;
      return basePicks.some((p) => p.category === cat);
    });
  }, [basePicks]);

  if (filtered.length === 0 && activeCategory === 'All') return null;

  return (
    <section style={{ background: 'var(--si-surface)', borderTop: '1px solid var(--si-border)' }}>
      <div className="container py-14">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-8" style={{ background: 'var(--si-border)' }} />
            
              {title}
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            
              No related pages in this category.
            </p>
            
              Show all →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filtered.slice(0, 3).map((page) => (
              <Link key={page.href} href={page.href}>
                <div
                  className="group card-white p-6 flex flex-col h-full"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms ease, border-color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 12px 32px rgba(249,115,22,0.12)';
                    el.style.borderColor = 'var(--si-orange-light)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '';
                    el.style.borderColor = '';
                  }}
                >
                  {/* Icon + category */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: page.bg }}>
                      {page.icon}
                    </div>
                    
                      {page.category}
                    </span>
                  </div>

                  {/* Title */}
                  
                    {page.title}
                  </h3>

                  {/* Description */}
                  
                    {page.desc}
                  </p>

                  {/* Arrow CTA */}
                  
                    <span>Explore</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transition: 'transform 200ms ease' }}
                      className="group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
