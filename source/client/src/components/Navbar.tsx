// ─── Navbar — Modern Mega-Menu ────────────────────────────────────────────────
// Design: Ashram Stone / Stone Temple Modernism
// Two-tier: dark top bar (lang + sign in/up) + white main bar (logo + mega menus + CTA)
// Mega-menus: full-width panels with images, icons, descriptions, app download links

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { OmIcon, LotusIcon, GurukuIcon, AyurvedaIcon, ScrollIcon, TechLotusIcon, GivingHandsIcon, CommunityIcon, CalendarIcon, ResearchIcon, FinancialIcon, CollabIcon, NewsIcon, ImpactIcon, VolunteerIcon, DonateIcon, AppIcon } from '@/components/SpiritualIcons';
import Image from "@/components/Image";
import ThemeToggle from "@/components/ThemeToggle";

// ── Icon URLs (fresh uploads) ──────────────────────────────────────────────────
const ICONS = {
  yogaPose:    'yogaPose',
  scroll:      'scroll',
  techLotus:   'techLotus',
  givingHands: 'givingHands',
  community:   'community',
  gurukul:     'gurukul',
  ayurveda:    'ayurveda',
  om:          'om',
  lotus:       'lotus',
  calendar:    'calendar',
  research:    'research',
  financial:   'financial',
  collab:      'collab',
  news:        'news',
  impact:      'impact',
  volunteer:   'volunteer',
  donate:      'donate',
  app:         'app',
};

// ── Inline SVG icon resolver (never breaks, no CDN dependency) ─────────────
function NavIcon({ name, size = 20 }: { name: keyof typeof ICONS; size?: number }) {
  const props = { size, color: 'var(--si-orange-ink)' };
  const map: Record<string, React.ReactNode> = {
    om: <OmIcon {...props} />,
    lotus: <LotusIcon {...props} />,
    gurukul: <GurukuIcon {...props} />,
    ayurveda: <AyurvedaIcon {...props} />,
    scroll: <ScrollIcon {...props} />,
    techLotus: <TechLotusIcon {...props} />,
    givingHands: <GivingHandsIcon {...props} />,
    community: <CommunityIcon {...props} />,
    calendar: <CalendarIcon {...props} />,
    research: <ResearchIcon {...props} />,
    yogaPose: <GurukuIcon {...props} />,
    financial: <FinancialIcon {...props} />,
    collab: <CollabIcon {...props} />,
    news: <NewsIcon {...props} />,
    impact: <ImpactIcon {...props} />,
    volunteer: <VolunteerIcon {...props} />,
    donate: <DonateIcon {...props} />,
    app: <AppIcon {...props} />,
  };
  return <>{map[name] || null}</>;
}

// ── Hero images for mega-menu panels ──────────────────────────────────────────
const MEGA_IMAGES = {
  hub:      '/Images/menu-hub-card_2e3e6106.jpg',
  gurukul:  '/Images/menu-gurukul-card_84096ca5.jpg',
  resources:'/Images/menu-resources-card_a7ba1f20.jpg',
  newsroom: '/Images/menu-newsroom-card_7a27ffac.jpg',
};

function Icon({ src, alt, size = 20 }: { src: string; alt: string; size?: number }) {
  // Map URL back to icon name for inline SVG fallback
  // Since ICONS values are now icon name strings, just use src as the name directly
  const name = src as keyof typeof ICONS;
  if (name in { om:1, lotus:1, gurukul:1, ayurveda:1, scroll:1, techLotus:1, givingHands:1, community:1, calendar:1, research:1, yogaPose:1, financial:1, collab:1, news:1, impact:1, volunteer:1, donate:1, app:1 }) {
    return <NavIcon name={name} size={size} />;
  }
  return (
    <Image src={src} alt={alt} width={size} height={size}
      style={{ objectFit: 'contain', flexShrink: 0 }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

/** Mac shows ⌘K, everything else Ctrl K — the label should match the key you press. */
const IS_APPLE =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
const SHORTCUT_LABEL = IS_APPLE ? '⌘K' : 'Ctrl K';
const SHORTCUT_ARIA = IS_APPLE ? 'Command K' : 'Control K';

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location]);

  // The panel already lingered for 180ms after mouse-out before unmounting; that
  // window is now used to play an exit animation instead of the panel simply
  // vanishing. No library needed — the timing was already there.
  const [closingMenu, setClosingMenu] = useState(false);

  const handleMouseEnter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosingMenu(false);
    setOpenMenu(key);
  };
  const handleMouseLeave = () => {
    setClosingMenu(true);
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
      setClosingMenu(false);
    }, 180);
  };

  const isActive = (path: string) => location === path || location.startsWith(path + '/');

  return (
    <>
      {/* ── Top bar ── */}
      <div className="on-dark" style={{ background: 'var(--si-ink)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', color: lang === 'hi' ? 'var(--si-orange-ink)' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Noto Sans Devanagari, sans-serif', transition: 'color 200ms ease' }}
            >
              हिंदी
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            SIGN IN</Link>
            SIGN UP</Link>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <nav data-mainav aria-label="Main navigation" style={{
        position: 'sticky', top: 0, zIndex: 9000,
        background: scrolled ? 'rgba(15,15,15,0.97)' : 'var(--si-ink-deep)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        transition: 'box-shadow 300ms ease, background 300ms ease',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

                    {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 8px rgba(249,115,22,0.2)', flexShrink: 0 }}>
              <Image src="/Images/live-site-logo_9a0f956f.png" alt="Sanatan International" priority style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            </div>
            <div>
              SANATAN</div>
              INTERNATIONAL</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden-mobile">
            {/* THE HUB */}
            <div onMouseEnter={() => handleMouseEnter('hub')} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
              
                THE HUB
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openMenu === 'hub' ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {openMenu === 'hub' && <HubMegaMenu closing={closingMenu} onClose={() => setOpenMenu(null)} />}
            </div>

            {/* GURUKUL */}
            <div onMouseEnter={() => handleMouseEnter('gurukul')} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
              
                GURUKUL
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openMenu === 'gurukul' ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {openMenu === 'gurukul' && <GurukuMegaMenu closing={closingMenu} onClose={() => setOpenMenu(null)} />}
            </div>

            {/* RESOURCES */}
            <div onMouseEnter={() => handleMouseEnter('resources')} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
              
                RESOURCES
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openMenu === 'resources' ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {openMenu === 'resources' && <ResourcesMegaMenu closing={closingMenu} onClose={() => setOpenMenu(null)} />}
            </div>

            {/* NEWSROOM */}
            <div onMouseEnter={() => handleMouseEnter('newsroom')} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
              
                NEWSROOM
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openMenu === 'newsroom' ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {openMenu === 'newsroom' && <NewsroomMegaMenu closing={closingMenu} onClose={() => setOpenMenu(null)} />}
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="hidden-mobile">
            {/*
              Opens the command palette rather than navigating to /search. The
              page still exists and still works — this is the faster path, and
              the shortcut hint teaches the keyboard route.
            */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('si:open-search'))}
              aria-label={`Search (${SHORTCUT_ARIA})`}
              title={`Search  ${SHORTCUT_LABEL}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', justifyContent: 'center', height: '36px', padding: '0 12px', borderRadius: '9px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 200ms ease', flexShrink: 0 }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(249,115,22,0.15)'; el.style.borderColor = 'rgba(249,115,22,0.4)'; el.style.color = 'var(--si-orange-ink)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.07)'; el.style.borderColor = 'rgba(255,255,255,0.12)'; el.style.color = 'rgba(255,255,255,0.7)'; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              {SHORTCUT_LABEL}</kbd>
            </button>
            <ThemeToggle />
            
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              MARKETPLACE
            </Link>
            
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              DONATE
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'rgba(255,255,255,0.85)', display: 'none' }}>
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="on-dark" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'var(--si-ink-deep)', maxHeight: '80vh', overflowY: 'auto' }}>
            {[
              { key: 'hub', label: 'THE HUB', links: [
                { href: '/hub#about', label: 'About the Centre' },
                { href: '/hub#vision', label: 'Vision & Mission' },
                { href: '/hub#founders', label: 'Founders & Advisors' },
                { href: '/financial-reports', label: 'Financial Reports' },
                { href: '/collaborations', label: 'Collaborations' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/campus', label: '🏛 Campus Vision' },
              ]},
              { key: 'gurukul', label: 'GURUKUL', links: [
                { href: '/gurukul/foundation', label: 'The Foundation' },
                { href: '/gurukul/programs', label: 'Program Overview' },
                { href: '/gurukul/digital', label: 'Digital Gurukul' },
                { href: '/gurukul/ayurveda', label: 'Āyurveda Research' },
                { href: '/gurukul/join', label: 'Join Us Today' },
                { href: '/gurukul/meta-gurukul', label: 'Meta Gurukul ✦ APP' },
              ]},
              { key: 'resources', label: 'RESOURCES', links: [
                { href: '/apps', label: 'Digital Welfare Suite' },
                { href: '/books', label: 'Digital Library' },
                { href: '/volunteer', label: 'Volunteer Program' },
                { href: '/events', label: 'Events Calendar' },
              ]},
              { key: 'newsroom', label: 'NEWSROOM', links: [
                { href: '/blog', label: 'Official Blog' },
                { href: '/press', label: 'Media & Press' },
                { href: '/impact', label: 'Impact Stories' },
                { href: '/faqs', label: 'FAQs' },
              ]},
            ].map(section => (
              <div key={section.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                
                  {section.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: mobileExpanded === section.key ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {mobileExpanded === section.key && (
                  <div style={{ paddingBottom: '8px', background: 'rgba(255,255,255,0.04)' }}>
                    {section.links.map(link => (
                      {link.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="on-dark" style={{ padding: '16px 24px', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--si-ink-deep)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              MARKETPLACE</Link>
              DONATE</Link>
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>

      {/* ── Mega menu backdrop ── */}
      {openMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 8999, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }}
          onMouseEnter={() => setOpenMenu(null)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ── Shared mega-menu shell ────────────────────────────────────────────────────
function MegaMenuShell({ children, onClose, closing }: { children: React.ReactNode; onClose: () => void; closing: boolean }) {
  const [menuTop, setMenuTop] = useState(100);
  useEffect(() => {
    const update = () => {
      const nav = document.querySelector('[data-mainav]') as HTMLElement | null;
      if (nav) setMenuTop(nav.getBoundingClientRect().bottom);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return (
    // The panel previously only animated *in*; closing was an instant
    // disappearance. It now plays an exit animation during the 180ms the close
    // timer already waited before unmounting — see handleMouseLeave above.
    <div
      className={closing ? 'mega-menu mega-menu-out' : 'mega-menu mega-menu-in'}
      style={{
        position: 'fixed', left: 0, right: 0, top: `${menuTop}px`, zIndex: 9001,
        background: 'var(--si-card)',
        borderTop: '3px solid var(--si-orange)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      }}
      onMouseLeave={onClose}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        {children}
      </div>
    </div>
  );
}

// ── Mega menu link item ───────────────────────────────────────────────────────
function MegaLink({ href, icon, label, desc, badge }: { href: string; icon?: string; label: string; desc?: string; badge?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        padding: '10px 12px', borderRadius: '10px',
        background: hovered ? 'var(--si-orange-tint)' : 'transparent',
        textDecoration: 'none', transition: 'background 180ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && (
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: hovered ? 'rgba(249,115,22,0.12)' : 'var(--si-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 180ms ease' }}>
          <Icon src={icon} alt={label} size={20} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {label}</span>
          {badge && {badge}</span>}
        </div>
        {desc && {desc}</p>}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hovered ? '#F97316' : '#D1D5DB'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', transition: 'stroke 180ms ease' }}><polyline points="9 18 15 12 9 6"/></svg>
    </Link>
  );
}

// ── THE HUB Mega Menu ─────────────────────────────────────────────────────────
function HubMegaMenu({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  return (
    <MegaMenuShell onClose={onClose} closing={closing}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: '0', padding: '24px 0' }}>
        <div style={{ paddingRight: '24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          About</p>
          <MegaLink href="/hub#about" icon={ICONS.om} label="About the Centre" desc="Our founding story, values, and what makes us different" />
          <MegaLink href="/hub#vision" icon={ICONS.lotus} label="Vision & Mission" desc="A permanent campus for human flourishing — the why" />
          <MegaLink href="/hub#founders" icon={ICONS.gurukul} label="Founders & Advisors" desc="Meet the team guiding the Centre" />
          <MegaLink href="/campus" icon={ICONS.research} label="Campus Vision" desc="33-acre campus renders — Gurukul, Yoga, Āyurveda, farm & more" />
        </div>
        <div style={{ padding: '0 24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Governance</p>
          <MegaLink href="/financial-reports" icon={ICONS.financial} label="Financial Reports" desc="Quarterly transparency reports with PDF download" />
          <MegaLink href="/collaborations" icon={ICONS.community} label="Collaborations" desc="Academic, research, and strategic partnerships" />
          <MegaLink href="/contact" icon={ICONS.givingHands} label="Contact Us" desc="Inquiries, press, and general correspondence" />
        </div>
        <div style={{ paddingLeft: '24px' }}>
          <div className="on-dark" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '140px', background: 'var(--si-ink)' }}>
            <Image src={MEGA_IMAGES.hub} alt="The Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <div style={{ position: 'absolute', inset: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              Centre for Human Flourishing</p>
              El Sabrante, California</p>
            </div>
          </div>
          
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Donate to Land Fund
          </Link>
        </div>
      </div>
    </MegaMenuShell>
  );
}

// ── GURUKUL Mega Menu ─────────────────────────────────────────────────────────
function GurukuMegaMenu({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  return (
    <MegaMenuShell onClose={onClose} closing={closing}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '0', padding: '24px 0' }}>
        <div style={{ paddingRight: '24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Programs</p>
          <MegaLink href="/gurukul/foundation" icon={ICONS.om} label="The Foundation" desc="Core philosophy: Health, Education, Technology" />
          <MegaLink href="/gurukul/programs" icon={ICONS.scroll} label="Program Overview" desc="Kids age bands, adult ladder L1–L6, curriculum" />
          <MegaLink href="/gurukul/ayurveda" icon={ICONS.ayurveda} label="Āyurveda Research" desc="Evidence-based classical Āyurvedic research" />
          <MegaLink href="/gurukul/join" icon={ICONS.givingHands} label="Be a Part of It" desc="Apply as student, parent, teacher, or volunteer" />
        </div>
        <div style={{ padding: '0 24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Digital</p>
          <MegaLink href="/gurukul/digital" icon={ICONS.app} label="Digital Gurukul" desc="Live Zoom classes, weekly satsang, parent dashboard" />
          <MegaLink href="/gurukul/meta-gurukul" icon={ICONS.gurukul} label="Meta Gurukul" desc="Standalone app — daily 20-min live classes" badge="APP" />
          <div className="on-dark" style={{ margin: '12px 12px 0', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--si-ink) 0%, #2D2D2D 100%)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <svg width="12" height="12" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" style={{ display:'inline', marginRight:'5px', verticalAlign:'middle' }}><rect x="11" y="4" width="18" height="32" rx="3.5"/><rect x="14" y="8" width="12" height="20" rx="1.5"/><circle cx="20" cy="32" r="2"/></svg>APP COMING SOON</p>
            Daily Sanskrit, Yoga & Vedic Science classes on your phone</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.65.2.98.09l12.09-6.98-2.83-2.83-10.24 9.72zm-1.5-20.3c-.1.22-.18.47-.18.75v19.58c0 .28.07.53.18.75l.09.09 10.96-10.96v-.26L1.77 3.37l-.09.09zm19.09 8.72l-2.56-1.48-3.14 3.14 3.14 3.14 2.57-1.48c.73-.42.73-1.11 0-1.53l-.01.21zm-18.36 9.6l12.09-6.98-2.83-2.83-9.26 9.81z"/></svg>
                Play Store
              </a>
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: '24px' }}>
          <div className="on-dark" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '120px', background: 'var(--si-ink)' }}>
            <Image src={MEGA_IMAGES.gurukul} alt="Gurukul" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <div style={{ position: 'absolute', inset: 0, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              गुरुकुल</p>
              Ancient wisdom, modern delivery</p>
            </div>
          </div>
          <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
            Next Cohort</p>
            Monthly drops — Ages 9–16</p>
            Apply Now →</Link>
          </div>
        </div>
      </div>
    </MegaMenuShell>
  );
}

// ── RESOURCES Mega Menu ───────────────────────────────────────────────────────
function ResourcesMegaMenu({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  return (
    <MegaMenuShell onClose={onClose} closing={closing}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 260px', gap: '0', padding: '24px 0' }}>
        <div style={{ paddingRight: '24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Community</p>
          <MegaLink href="/volunteer" icon={ICONS.volunteer} label="Volunteer Program" desc="Contribute your skills — education, tech, welfare" />
          <MegaLink href="/events" icon={ICONS.calendar} label="Events Calendar" desc="Satsangs, workshops, fundraisers, and gatherings" />
        </div>
        <div style={{ padding: '0 24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Technology</p>
          <MegaLink href="/apps" icon={ICONS.app} label="Digital Welfare Suite" desc="Human-centric apps without dark patterns" />
          <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
            <MegaLink href="/books" icon={ICONS.research} label="Digital Library" desc="All 16 titles free for monthly donors & enrolled members" />
            <span style={{ position: "absolute", top: "8px", right: "12px", background: "var(--si-orange)", color: "white", fontFamily: "Inter, sans-serif", fontSize: "0.55rem", fontWeight: 700, padding: "2px 7px", borderRadius: "999px", letterSpacing: "0.05em" }}>Member Access</span>
          </div>
          <div style={{ margin: '8px 12px 0', padding: '10px 12px', borderRadius: '10px', background: 'var(--si-surface-subtle)', border: '1px solid var(--si-surface-alt)' }}>
            Our Apps</p>
            {['Dharma Companion', 'Vedic Calendar', 'Sanskrit Learning', 'Wellness Tracker'].map(app => (
              <div key={app} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-orange)', flexShrink: 0 }} />
                {app}</span>
                SOON</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', padding: '0 0 0 0' }}>
            Publishing</p>
            <MegaLink href="/books#submit" icon={ICONS.scroll} label="Publish with Us" desc="Submit your manuscript to Sanatan International Press" />
          </div>
        </div>
        <div style={{ paddingLeft: '24px' }}>
          <div className="on-dark" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '120px', background: 'var(--si-ink)' }}>
            <Image src={MEGA_IMAGES.resources} alt="Resources" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <div style={{ position: 'absolute', inset: 0, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              Serve & Contribute</p>
              Join 1,200+ volunteers worldwide</p>
            </div>
          </div>
          Become a Volunteer →</Link>
        </div>
      </div>
    </MegaMenuShell>
  );
}

// ── NEWSROOM Mega Menu ────────────────────────────────────────────────────────
function NewsroomMegaMenu({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  return (
    <MegaMenuShell onClose={onClose} closing={closing}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 260px', gap: '0', padding: '24px 0' }}>
        <div style={{ paddingRight: '24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Stories</p>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <MegaLink href="/blog" icon={ICONS.news} label="Official Blog" desc="Vedic wisdom, Āyurveda, campus updates, culture" />
          11 articles</span>
        </div>
          <MegaLink href="/impact" icon={ICONS.givingHands} label="Impact Stories" desc="Real stories from students and communities" />
        </div>
        <div style={{ padding: '0 24px', borderRight: '1px solid var(--si-surface-alt)' }}>
          Press</p>
          <MegaLink href="/press" icon={ICONS.news} label="Media & Press" desc="Press releases, media kit, interview requests" />
          <MegaLink href="/faqs" icon={ICONS.research} label="FAQs" desc="Enrollment, donations, campus, and programme questions" />
        </div>
        <div style={{ paddingLeft: '24px' }}>
          <div className="on-dark" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '120px', background: 'var(--si-ink)' }}>
            <Image src={MEGA_IMAGES.newsroom} alt="Newsroom" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <div style={{ position: 'absolute', inset: 0, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              Latest from the Centre</p>
            </div>
          </div>
          Read the Blog →</Link>
        </div>
      </div>
    </MegaMenuShell>
  );
}
