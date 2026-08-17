// ─── Footer — Redesigned ──────────────────────────────────────────────────────
// Design: Ashram Stone / Stone Temple Modernism
// Dark charcoal background, saffron accents, Sanskrit verse, rich 5-column layout

import { Link } from 'wouter';
import Image from "@/components/Image";

const SOCIAL = [
  { href: 'https://facebook.com/sanataninternational', label: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { href: 'https://instagram.com/sanataninternational', label: 'Instagram', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { href: 'https://x.com/sanatanintl', label: 'X / Twitter', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { href: 'https://youtube.com/sanataninternational', label: 'YouTube', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg> },
  { href: 'https://linkedin.com/company/sanataninternational', label: 'LinkedIn', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
];

const FOOTER_LINKS = [
  {
    title: 'The Hub',
    links: [
      { label: 'About the Centre', href: '/hub#about' },
      { label: 'Vision & Mission', href: '/hub#vision' },
      { label: 'Founders & Advisors', href: '/hub#founders' },
      { label: 'Financial Reports', href: '/financial-reports' },
      { label: 'Collaborations', href: '/collaborations' },
    ],
  },
  {
    title: 'Gurukul',
    links: [
      { label: 'The Foundation', href: '/gurukul/foundation' },
      { label: 'Programs Overview', href: '/gurukul/programs' },
      { label: 'Digital Gurukul', href: '/gurukul/digital' },
      { label: 'Āyurveda Research', href: '/gurukul/ayurveda' },
      { label: 'Digital Scriptures', href: '/gurukul/digital#library' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Digital Welfare Suite', href: '/apps' },
      { label: 'Volunteer Program', href: '/volunteer' },
      { label: 'Events Calendar', href: '/events' },
      { label: 'Donate', href: '/donate' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Newsroom',
    links: [
      { label: 'Official Blog', href: '/blog' },
      { label: 'Media & Press', href: '/press' },
      { label: 'Impact Stories', href: '/impact' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    
      {/* Decorative top border */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, var(--si-orange) 20%, #F59E0B 50%, var(--si-orange) 80%, transparent)' }} />

      {/* Sanskrit verse banner */}
      <div style={{ background: 'rgba(249,115,22,0.08)', borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '14px 0', textAlign: 'center' }}>
        
          ॐ सर्वे भवन्तु सुखिनः · सर्वे सन्तु निरामयाः
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0', fontStyle: 'italic' }}>
          May all beings be happy · May all beings be free from illness
        </p>
      </div>

      {/* Main footer grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 2rem 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', marginBottom: '40px' }}>

          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                <Image src="/Images/live-site-logo_9a0f956f.png" alt="Sanatan International" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
              </div>
              <div>
                SANATAN</div>
                INTERNATIONAL</div>
              </div>
            </Link>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '20px' }}>
              "Ancient human sciences. Modern execution. Public benefit."
            </p>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                El Sabrante, California, USA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@sanataninternational.org</a>
              </div>
            </div>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 200ms ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--si-orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--si-orange)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {FOOTER_LINKS.map(col => (
              <div key={col.title}>
                {col.title}</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map(link => (
                    <li key={link.href} style={{ marginBottom: '8px' }}>
                      {link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Donate CTA strip */}
        <div style={{ borderRadius: '16px', background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(245,158,11,0.08) 100%)', border: '1px solid rgba(249,115,22,0.2)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            Build the Campus. Preserve the Dharma.</p>
            $347,500 raised of $2,000,000 goal · 1,243 donors · El Sabrante, California</p>
          </div>
          
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Donate to Land Fund
          </Link>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
            © {year} Sanatan International. All rights reserved. · Registered Nonprofit
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cookie Policy', href: '/cookies' },
              { label: 'Accessibility', href: '/accessibility' },
            ].map(link => (
              {link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
