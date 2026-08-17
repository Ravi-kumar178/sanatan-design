// BreadcrumbJsonLd — injects BreadcrumbList schema.org JSON-LD into <head>
// Enables Google to show breadcrumb paths in search results (rich snippets).
// Usage: <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul' }]} />
import { useEffect } from 'react';

interface Crumb { name: string; href: string; }

export default function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `https://www.sanataninternational.org${c.href}`,
      })),
    };
    const id = 'breadcrumb-schema';
    document.querySelector(`script[data-schema="${id}"]`)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', id);
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    return () => { document.querySelector(`script[data-schema="${id}"]`)?.remove(); };
  }, [JSON.stringify(crumbs)]);
  return null;
}
