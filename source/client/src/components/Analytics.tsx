import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getConsent } from './CookieConsent';
import { loadAnalytics, trackPageview } from '@/lib/analytics';

/**
 * Loads analytics once consent exists, and reports client-side navigations.
 *
 * Without the route-change tracking a single-page app only ever registers the
 * first pageview, so every session looks like a bounce.
 */
export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (getConsent() === 'accepted') loadAnalytics();
    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === 'accepted') loadAnalytics();
    };
    window.addEventListener('si:consent', onConsent);
    return () => window.removeEventListener('si:consent', onConsent);
  }, []);

  useEffect(() => {
    trackPageview(location);
  }, [location]);

  return null;
}
