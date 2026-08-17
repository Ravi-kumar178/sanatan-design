// FloatingShare — sticky bottom-right share FAB with pulse animation
// Mobile: full-width bottom sheet. Desktop: compact popover.
// Hides on scroll-down, reappears on scroll-up.
import { useState, useEffect, useRef } from 'react';

const ICONS = {
  share: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  copy: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  check: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const platforms = [
  { key: 'facebook', label: 'Facebook',    color: '#1877F2', getHref: (u: string, t: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { key: 'x',        label: 'X (Twitter)', color: '#000000', getHref: (u: string, t: string) => `https://x.com/intent/tweet?url=${u}&text=${t}` },
  { key: 'linkedin', label: 'LinkedIn',    color: '#0A66C2', getHref: (u: string, _t: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  { key: 'whatsapp', label: 'WhatsApp',    color: '#25D366', getHref: (u: string, t: string) => `https://wa.me/?text=${t}%20${u}` },
];

export default function FloatingShare() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hide on scroll-down, show on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 100) { setVisible(true); return; }
      setVisible(y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on outside click (desktop only)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, isMobile]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, isMobile]);

  const shareUrl = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = encodeURIComponent(typeof document !== 'undefined' ? document.title : 'Sanatan International');

  const handleCopy = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try { await navigator.clipboard.writeText(url); }
    catch {
      const el = document.createElement('textarea');
      el.value = url; document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PlatformList = () => (
    <>
      {platforms.map((p) => (
        
          <span style={{ color: p.color, display: 'flex', flexShrink: 0 }}>{ICONS[p.key as keyof typeof ICONS]}</span>
          <span style={{ fontSize: isMobile ? '0.95rem' : '0.8rem', fontWeight: 500 }}>{p.label}</span>
        </a>
      ))}
      
        <span style={{ color: copied ? 'var(--si-success)' : 'var(--si-orange-ink)', display: 'flex', flexShrink: 0 }}>
          {copied ? ICONS.check : ICONS.copy}
        </span>
        <span style={{ fontSize: isMobile ? '0.95rem' : '0.8rem', fontWeight: 500 }}>
          {copied ? 'Link Copied!' : 'Copy Link'}
        </span>
      </button>
    </>
  );

  return (
    <>
      {/* ── Mobile bottom sheet backdrop ── */}
      {isMobile && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.4)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'all' : 'none',
            transition: 'opacity 250ms ease',
            backdropFilter: open ? 'blur(2px)' : 'none',
          }}
        />
      )}

      {/* ── Mobile bottom sheet ── */}
      {isMobile && (
        <div
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
            background: 'var(--si-card)',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            padding: '0 0 env(safe-area-inset-bottom, 16px)',
            transform: open ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 320ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {/* Handle bar */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--si-border)' }} />
          </div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 12px' }}>
            
              Share this page
            </p>
            
              {ICONS.close}
            </button>
          </div>
          {/* Platform list */}
          <div style={{ padding: '0 8px 16px' }}>
            <PlatformList />
          </div>
        </div>
      )}

      {/* ── FAB + Desktop popover ── */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '24px',
          zIndex: 9997,
          transform: visible ? 'translateY(0)' : 'translateY(100px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1), opacity 300ms ease',
        }}
      >
        {/* Desktop popover */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute', bottom: '64px', right: 0,
              background: 'var(--si-card)', borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
              border: '1px solid var(--si-surface-alt)',
              padding: '12px 8px',
              width: '210px',
              transformOrigin: 'bottom right',
              transform: open ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(8px)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'all' : 'none',
              transition: 'transform 220ms cubic-bezier(0.23,1,0.32,1), opacity 200ms ease',
            }}
          >
            
              Share this page
            </p>
            <PlatformList />
          </div>
        )}

        {/* FAB with pulse ring */}
        <div style={{ position: 'relative' }}>
          {/* Pulse ring — only when closed */}
          {!open && (
            <div
              style={{
                position: 'absolute', inset: '-6px',
                borderRadius: '50%',
                border: '2px solid var(--si-orange)',
                animation: 'fabPulse 2.5s ease-out infinite',
                pointerEvents: 'none',
              }}
            />
          )}
          
            <span style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              {open ? ICONS.close : ICONS.share}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
