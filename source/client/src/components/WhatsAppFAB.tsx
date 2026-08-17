import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── WhatsApp Floating Action Button ─────────────────────────────────────────
// Green WhatsApp FAB fixed to bottom-left, with pulse ring, hide-on-scroll-down
// behaviour, and a pre-filled message in the user's language.
// Replace WHATSAPP_NUMBER with the real number (country code, no +/spaces).
// TODO: Replace with real WhatsApp number before going live
const WHATSAPP_NUMBER = '14155551234'; // e.g. '919876543210' for India // placeholder — update with real number

export default function WhatsAppFAB() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  // Hide on scroll-down, show on scroll-up (mirrors FloatingShare behaviour)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 10 && y > 200) setVisible(false);
      else if (y < lastY - 10) setVisible(true);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  // Show tooltip after 3 s on first visit
  useEffect(() => {
    const shown = sessionStorage.getItem('wa-tooltip-shown');
    if (!shown) {
      const t = setTimeout(() => {
        setTooltip(true);
        sessionStorage.setItem('wa-tooltip-shown', '1');
        setTimeout(() => setTooltip(false), 5000);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const message = lang === 'hi'
    ? 'नमस्ते! मैं सनातन इंटरनेशनल के बारे में अधिक जानना चाहता/चाहती हूँ।'
    : 'Namaste! I would like to learn more about Sanatan International.';

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        left: '1.75rem',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.75rem',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Tooltip bubble */}
      {(tooltip || hovered) && (
        
          {lang === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Chat on WhatsApp'}
          {/* Arrow */}
          <span style={{
            position: 'absolute', bottom: '-5px', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--si-ink)',
          }} />
        </div>
      )}

      {/* FAB button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered
            ? '0 0 0 6px rgba(37,211,102,0.25), 0 8px 24px rgba(37,211,102,0.45)'
            : '0 4px 16px rgba(37,211,102,0.4)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          textDecoration: 'none',
          position: 'relative',
        }}
      >
        {/* Pulse ring */}
        <span style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '50%',
          border: '2px solid rgba(37,211,102,0.45)',
          animation: 'waPulse 2.5s ease-in-out infinite',
        }} />
        {/* WhatsApp SVG icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
