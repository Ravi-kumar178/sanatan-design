// SocialShare — reusable sharing bar for Newsroom & Resources pages
// Platforms: Facebook · X (Twitter) · LinkedIn · WhatsApp · Copy Link
// Design: matches the site's orange accent + Inter typography system
import { useState } from 'react';

interface SocialShareProps {
  url?: string;       // defaults to window.location.href
  title?: string;     // article / page title
  description?: string;
  compact?: boolean;  // true = icon-only row, false = icon + label
  className?: string;
}

const ICONS = {
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  whatsapp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  copy: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

export default function SocialShare({ url, title = '', description = '', compact = false, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || title);

  const platforms = [
    {
      key: 'facebook',
      label: 'Facebook',
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: 'x',
      label: 'X',
      color: '#000000',
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      color: '#0A66C2',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      color: '#25D366',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '9999px',
    border: '1.5px solid #E5E7EB',
    background: 'var(--si-card)',
    color: '#374151',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 160ms cubic-bezier(0.23,1,0.32,1)',
    padding: compact ? '6px 8px' : '6px 14px',
    whiteSpace: 'nowrap',
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {!compact && (
        
          Share
        </span>
      )}

      {platforms.map((p) => (
        <a
          key={p.key}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${p.label}`}
          style={btnBase}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = p.color;
            el.style.borderColor = p.color;
            el.style.color = 'white';
            el.style.transform = 'translateY(-2px)';
            el.style.boxShadow = `0 4px 12px ${p.color}40`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'white';
            el.style.borderColor = 'var(--si-border)';
            el.style.color = 'var(--si-text-strong)';
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'none';
          }}
        >
          {ICONS[p.key as keyof typeof ICONS]}
          {!compact && p.label}
        </a>
      ))}

      {/* Copy link button */}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        style={{
          ...btnBase,
          background: copied ? 'var(--si-cta)' : 'var(--si-card)',
          borderColor: copied ? 'var(--si-orange)' : 'var(--si-border)',
          color: copied ? 'white' : 'var(--si-text-strong)',
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = 'var(--si-orange-tint)';
            el.style.borderColor = 'var(--si-orange)';
            el.style.color = 'var(--si-orange-ink)';
            el.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = 'white';
            el.style.borderColor = 'var(--si-border)';
            el.style.color = 'var(--si-text-strong)';
            el.style.transform = 'translateY(0)';
          }
        }}
      >
        {copied ? ICONS.check : ICONS.copy}
        {!compact && (copied ? 'Copied!' : 'Copy Link')}
      </button>
    </div>
  );
}
