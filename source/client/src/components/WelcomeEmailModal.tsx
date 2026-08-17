// WelcomeEmailModal — shows a preview of the welcome email after newsletter signup
// Design: Sanatan International — saffron, cream, charcoal editorial style
import { useEffect } from 'react';
import { Link } from 'wouter';
import type { WelcomeEmail } from '@/lib/newsletterApi';

interface Props {
  email: string;
  welcomeEmail: WelcomeEmail;
  onClose: () => void;
}

export default function WelcomeEmailModal({ email, welcomeEmail, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'fadeIn 200ms ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'var(--si-card)', borderRadius: '20px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', animation: 'slideUp 250ms cubic-bezier(0.23,1,0.32,1)' }}>
        {/* Email client chrome */}
        <div style={{ background: 'var(--si-surface-alt)', borderRadius: '20px 20px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--si-border)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--si-danger)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }} />
          </div>
          
            📧 Welcome Email Preview
          </div>
          
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Email header */}
        <div className="on-dark" style={{ background: 'var(--si-hero-dark)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ॐ</span>
            </div>
            <div>
              Sanatan International</p>
              hello@sanataninternational.org → {email}</p>
            </div>
          </div>
          Subject:</p>
          {welcomeEmail.subject}</p>
          {welcomeEmail.preheader}</p>
        </div>

        {/* Email body */}
        <div style={{ padding: '28px 24px' }}>
          {/* Saffron divider */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--si-orange), #FBBF24)', borderRadius: '2px', marginBottom: '24px' }} />

          {welcomeEmail.greeting},</p>
          {welcomeEmail.body}</p>

          {/* Shloka block */}
          <div style={{ background: 'var(--si-orange-tint)', borderLeft: '4px solid var(--si-orange)', borderRadius: '0 12px 12px 0', padding: '16px 20px', marginBottom: '20px' }}>
            {welcomeEmail.shloka}</p>
            {welcomeEmail.shlokaTranslation}</p>
          </div>

          {/* CTA button */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            
              {welcomeEmail.cta} →
            </Link>
          </div>

          {/* Signature */}
          <div style={{ borderTop: '1px solid var(--si-surface-alt)', paddingTop: '16px' }}>
            {welcomeEmail.signature.split('\n').map((line, i) => (
              {line}</p>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--si-surface-alt)', textAlign: 'center' }}>
            
              You are receiving this because you subscribed at sanataninternational.org · <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Unsubscribe</span>
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div style={{ padding: '16px 24px 20px', borderTop: '1px solid var(--si-surface-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          This is a preview of your welcome email.</p>
          
            Got it, thanks! 🙏
          </button>
        </div>
      </div>
    </div>
  );
}
