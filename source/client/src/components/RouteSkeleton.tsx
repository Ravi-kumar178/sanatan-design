import Navbar from './Navbar';

/**
 * Placeholder shown while a lazily-loaded route chunk downloads.
 *
 * Mirrors the shape every page on this site shares — dark hero, then a band of
 * cards — so the layout doesn't jump when the real content arrives. A centred
 * spinner gave no such hint and made the page feel emptier than it was.
 *
 * The real Navbar is rendered here on purpose. Layout (and therefore the navbar)
 * lives inside each page, so while a route chunk is in flight there is no page
 * and the site chrome would otherwise disappear entirely. Navbar is already in
 * the eager entry chunk, so this costs no extra bytes.
 */
export default function RouteSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <Navbar />

      {/* Hero band — dark in both themes, matching .section-dark */}
      <div className="on-dark" style={{ background: 'var(--si-hero-dark)', padding: '128px 0 80px' }}>
        <div className="container max-w-3xl">
          <div className="skeleton" style={{ width: '140px', height: '14px', marginBottom: '24px', opacity: 0.25 }} />
          <div className="skeleton" style={{ width: '100%', maxWidth: '620px', height: '52px', marginBottom: '16px', opacity: 0.18 }} />
          <div className="skeleton" style={{ width: '70%', maxWidth: '440px', height: '52px', marginBottom: '28px', opacity: 0.18 }} />
          <div className="skeleton" style={{ width: '100%', maxWidth: '540px', height: '16px', marginBottom: '10px', opacity: 0.12 }} />
          <div className="skeleton" style={{ width: '80%', maxWidth: '430px', height: '16px', opacity: 0.12 }} />
        </div>
      </div>

      {/* Content band — three cards, the site's most common section */}
      <div style={{ background: 'var(--si-surface)', padding: '64px 0' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--si-card)',
                  border: '1px solid var(--si-border)',
                  borderRadius: '1rem',
                  padding: '28px',
                }}>
                <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px', marginBottom: '20px' }} />
                <div className="skeleton" style={{ width: '60%', height: '13px', marginBottom: '14px' }} />
                <div className="skeleton" style={{ width: '90%', height: '20px', marginBottom: '16px' }} />
                <div className="skeleton" style={{ width: '100%', height: '12px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '95%', height: '12px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '65%', height: '12px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
