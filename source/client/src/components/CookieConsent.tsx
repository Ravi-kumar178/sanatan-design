import { useEffect, useState } from 'react';
import { Link } from 'wouter';

/**
 * Cookie consent for the analytics tag.
 *
 * The site has a Cookie Policy page and analytics markup but had no consent
 * mechanism. Serving Bay Area and EU diaspora audiences, that matters under
 * both CCPA and GDPR.
 *
 * Deliberately opt-in: nothing loads until the visitor accepts, which is what
 * GDPR requires. Declining is a single click of equal weight — no dark pattern
 * where "reject" is hidden behind a settings panel.
 */

const KEY = 'si-cookie-consent';

export type Consent = 'accepted' | 'declined';

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [choice, setChoice] = useState<Consent | null | 'pending'>('pending');

  useEffect(() => {
    setChoice(getConsent());
  }, []);

  const decide = (value: Consent) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked — the choice still applies for this session */
    }
    setChoice(value);
    window.dispatchEvent(new CustomEvent('si:consent', { detail: value }));
  };

  // 'pending' avoids a flash of the banner before localStorage is read.
  if (choice === 'pending' || choice === 'accepted' || choice === 'declined') return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      style={{
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: 9500,
        maxWidth: '560px',
        margin: '0 auto',
        background: 'var(--si-card)',
        border: '1px solid var(--si-border)',
        borderRadius: '14px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
        padding: '20px 22px',
      }}>
      
        A note on cookies
      </h2>
      
        We would like to measure which pages are useful, using privacy-friendly analytics.
        Nothing is loaded unless you agree, and we never sell your data.{' '}
        
          Read our cookie policy
        </Link>
        .
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        
          Accept
        </button>
        
          Decline
        </button>
      </div>
    </div>
  );
}
