/**
 * Consent-gated analytics.
 *
 * The umami tag used to be injected into index.html at build time, which loads
 * it before the visitor has agreed to anything — the consent banner would have
 * been decorative. It is now injected at runtime, only after acceptance.
 *
 * Also tracks route changes: in a single-page app the initial script records one
 * pageview per session, so without this every visit looks like a bounce.
 */

const ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined;

export const analyticsConfigured = Boolean(ENDPOINT && WEBSITE_ID);

let injected = false;

export function loadAnalytics() {
  if (injected || !analyticsConfigured) return;
  injected = true;
  const s = document.createElement('script');
  s.defer = true;
  s.src = `${ENDPOINT!.replace(/\/+$/, '')}/umami`;
  s.setAttribute('data-website-id', WEBSITE_ID!);
  // Respect Do Not Track even when consent was given.
  s.setAttribute('data-do-not-track', 'true');
  document.head.appendChild(s);
}

/** Records a client-side navigation, if a tracker is present. */
export function trackPageview(path: string) {
  if (!injected) return;
  const umami = (window as unknown as { umami?: { track: (e: unknown) => void } }).umami;
  try {
    umami?.track({ url: path, website: WEBSITE_ID });
  } catch {
    /* analytics must never break navigation */
  }
}
