// PageMeta — injects Open Graph, Twitter Card, and canonical meta tags
// into document.head for rich social preview cards on every page.
// Usage: <PageMeta title="..." description="..." image="..." url="..." />
import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  image?: string;       // absolute URL to OG image (1200×630 recommended)
  url?: string;         // canonical page URL
  type?: 'website' | 'article';
  articleDate?: string; // ISO date string for articles
  articleSection?: string;
}

const SITE_NAME = 'Sanatan International';
const DEFAULT_IMAGE = 'https://www.sanataninternational.org/og-default.jpg';
const BASE_URL = 'https://www.sanataninternational.org';

function setMeta(property: string, content: string, attr: 'property' | 'name' = 'property') {
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function PageMeta({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  articleDate,
  articleSection,
}: PageMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const canonicalUrl = url ? `${BASE_URL}${url}` : (typeof window !== 'undefined' ? window.location.href : BASE_URL);

    // Page title
    document.title = fullTitle;

    // Standard meta
    setMeta('description', description, 'name');
    setMeta('keywords', 'Sanatan International, Gurukul, Ayurveda, Vedic education, Hindu dharma, Bay Area, El Sabrante campus, digital welfare', 'name');

    // Open Graph
    setMeta('og:type', type);
    setMeta('og:site_name', SITE_NAME);
    setMeta('og:title', fullTitle);
    setMeta('og:description', description);
    setMeta('og:image', image);
    setMeta('og:image:width', '1200');
    setMeta('og:image:height', '630');
    setMeta('og:image:alt', title);
    setMeta('og:url', canonicalUrl);
    setMeta('og:locale', 'en_US');

    // Article-specific OG tags
    if (type === 'article' && articleDate) {
      setMeta('article:published_time', articleDate);
    }
    if (type === 'article' && articleSection) {
      setMeta('article:section', articleSection);
    }
    if (type === 'article') {
      setMeta('article:publisher', 'https://www.facebook.com/sanataninternational');
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:site', '@sanatanint', 'name');
    setMeta('twitter:creator', '@sanatanint', 'name');
    setMeta('twitter:title', fullTitle, 'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image', image, 'name');
    setMeta('twitter:image:alt', title, 'name');

    // Canonical link
    setLink('canonical', canonicalUrl);
  }, [title, description, image, url, type, articleDate, articleSection]);

  return null;
}
