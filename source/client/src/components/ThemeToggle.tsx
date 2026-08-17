import { useTheme } from '@/contexts/ThemeContext';

/**
 * Light/dark switch for the navbar.
 *
 * Sits on the dark navbar chrome in both themes, so its own colours are fixed
 * rather than token-driven — matching the search icon beside it.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, followsSystem } = useTheme();

  if (!toggleTheme) return null;

  const isDark = theme === 'dark';
  const label = `Switch to ${isDark ? 'light' : 'dark'} theme${followsSystem ? ' (currently following your system setting)' : ''}`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '9px',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        flexShrink: 0,
        padding: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(249,115,22,0.15)';
        el.style.borderColor = 'rgba(249,115,22,0.4)';
        el.style.color = 'var(--si-orange-ink)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.07)';
        el.style.borderColor = 'rgba(255,255,255,0.12)';
        el.style.color = 'rgba(255,255,255,0.7)';
      }}>
      {isDark ? (
        /* Sun — clicking returns to light */
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2M12 19.5v2M4.4 4.4l1.4 1.4M18.2 18.2l1.4 1.4M2.5 12h2M19.5 12h2M4.4 19.6l1.4-1.4M18.2 5.8l1.4-1.4" />
        </svg>
      ) : (
        /* Crescent — clicking goes dark */
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a6.8 6.8 0 0 0 10.8 10.8Z" />
        </svg>
      )}
    </button>
  );
}
