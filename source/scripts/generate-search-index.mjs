// Generates client/src/lib/searchIndex.ts.
//
// Pages come from the routes declared in App.tsx, so the index cannot drift out
// of sync with the router — adding a route without describing it here fails the
// build rather than silently producing an unsearchable page.
//
// Content (articles, books, programmes, events) lives in scripts/data/search-content.json.
import fs from 'node:fs';
import path from 'node:path';

const APP = 'client/src/App.tsx';
const CONTENT = 'scripts/data/search-content.json';
const OUT = 'client/src/lib/searchIndex.ts';

/** Routes that intentionally never appear in search. */
const EXCLUDED = new Set([
  '/auth/signin', '/auth/signup', '/login', '/register', // redirect stubs
  '/404',
  '/search',                                             // searching for search
  '/admin/submissions',                                  // staff-only
  '/dashboard',                                          // member-only
  '/donate/success',                                     // post-transaction
]);

/** Human metadata for each searchable route. */
const PAGE_META = {
  '/':                        { title: 'Home', desc: 'Sanatan International — a permanent Gurukul campus for the Indian diaspora in California.', tags: ['home', 'sanatan', 'international'] },
  '/about':                   { title: 'About the Centre', desc: 'Our founding story, values, and what makes the Centre different.', tags: ['about', 'story', 'values'] },
  '/hub':                     { title: 'The Hub', desc: 'About, vision, mission, founders and advisors in one place.', tags: ['hub', 'about', 'vision', 'founders'] },
  '/vision':                  { title: 'Vision & Mission', desc: 'A permanent campus for human flourishing — the why behind the work.', tags: ['vision', 'mission', 'purpose'] },
  '/founders':                { title: 'Founders & Advisors', desc: 'Meet the team and advisory board guiding the Centre.', tags: ['founders', 'advisors', 'team', 'board'] },
  '/gurukul':                 { title: 'Gurukul', desc: 'Gurukul-based education rooted in Vedic tradition, for every age and stage.', tags: ['gurukul', 'education', 'school'] },
  '/gurukul/foundation':      { title: 'Gurukul Foundation', desc: 'The foundation programme — the base of the four-level Gurukul curriculum.', tags: ['gurukul', 'foundation', 'curriculum'] },
  '/gurukul/programs':        { title: 'Gurukul Programs', desc: 'Kids programmes and the adult ladder — every age, every stage, one path.', tags: ['programs', 'courses', 'kids', 'adults'] },
  '/gurukul/digital':         { title: 'Digital Gurukul', desc: 'Live daily classes online — Sanskrit, yoga, Ayurveda and Vedic knowledge.', tags: ['digital', 'online', 'live', 'zoom', 'classes'] },
  '/gurukul/meta-gurukul':    { title: 'Meta Gurukul', desc: 'The Meta Gurukul app — daily practice, tracking and community.', tags: ['meta gurukul', 'app', 'mobile'] },
  '/gurukul/ayurveda':        { title: 'Gurukul Ayurveda', desc: 'Ayurveda studies within the Gurukul — herbs, doshas and classical texts.', tags: ['ayurveda', 'herbs', 'health'] },
  '/gurukul/join':            { title: 'Join the Gurukul', desc: 'Enrolment — fees, schedule and how to apply.', tags: ['join', 'enrol', 'enroll', 'apply', 'admission', 'fees'] },
  '/ayurveda':                { title: 'Ayurveda Research', desc: 'Ayurveda research, herb studies and evidence-based preventive health.', tags: ['ayurveda', 'research', 'herbs', 'health'] },
  '/apps':                    { title: 'Digital Welfare Suite', desc: 'Our apps — ethical technology built for human welfare.', tags: ['apps', 'technology', 'digital', 'software'] },
  '/blog':                    { title: 'Blog', desc: 'Research-backed writing on Ayurveda, education, dharma and the diaspora.', tags: ['blog', 'articles', 'writing', 'newsroom'] },
  '/press':                   { title: 'Press & Media', desc: 'Press kit, media coverage and interview requests.', tags: ['press', 'media', 'news', 'journalist'] },
  '/impact':                  { title: 'Impact', desc: 'Who we have reached and what has changed — measured outcomes.', tags: ['impact', 'outcomes', 'results'] },
  '/faqs':                    { title: 'FAQs', desc: 'Answers to the questions we are asked most often.', tags: ['faq', 'faqs', 'questions', 'help'] },
  '/contact':                 { title: 'Contact', desc: 'Get in touch about enrolment, donations, volunteering or media.', tags: ['contact', 'email', 'address', 'phone', 'reach'] },
  '/volunteer':               { title: 'Volunteer', desc: 'Give time and skills — teaching, events, technology and outreach.', tags: ['volunteer', 'help', 'seva', 'give time'] },
  '/events':                  { title: 'Events', desc: 'Satsangs, festivals, open days and the annual campus gala.', tags: ['events', 'calendar', 'satsang', 'festival'] },
  '/donate':                  { title: 'Donate', desc: 'Support the Land Fund and the 33-acre campus.', tags: ['donate', 'donation', 'give', 'fund', 'support', 'contribute'] },
  '/marketplace':             { title: 'Marketplace', desc: 'Organic essentials and authentic products — launching soon.', tags: ['marketplace', 'shop', 'store', 'products'] },
  '/financial-reports':       { title: 'Financial Reports', desc: 'Quarterly transparency reports with downloadable PDFs.', tags: ['financial', 'reports', 'transparency', 'accounts', 'pdf'] },
  '/collaborations':          { title: 'Collaborations', desc: 'Partner institutions, universities and research collaborators.', tags: ['collaborations', 'partners', 'partnerships'] },
  '/campus':                  { title: 'Campus Vision', desc: '33-acre campus renders — Gurukul, yoga, Ayurveda gardens and farm.', tags: ['campus', 'land', 'renders', 'building'] },
  '/books':                   { title: 'Books & Courses', desc: 'Digital books, audio books and video courses.', tags: ['books', 'ebooks', 'courses', 'library', 'read'] },
  '/ebooks':                  { title: 'E-Books', desc: 'Digital books, audio books and video courses.', tags: ['ebooks', 'books', 'digital'] },
  '/scriptures':              { title: 'Digital Scriptures', desc: 'Classical Sanskrit scriptures in digital format — coming soon.', tags: ['scriptures', 'sanskrit', 'texts', 'vedas'] },
  '/privacy-policy':          { title: 'Privacy Policy', desc: 'How we handle personal data.', tags: ['privacy', 'policy', 'data', 'legal'] },
  '/terms-of-service':        { title: 'Terms of Service', desc: 'The terms governing use of this site.', tags: ['terms', 'service', 'legal'] },
  '/cookie-policy':           { title: 'Cookie Policy', desc: 'How this site uses cookies.', tags: ['cookies', 'policy', 'legal'] },
  '/accessibility':           { title: 'Accessibility Statement', desc: 'Our accessibility commitments and how to report a barrier.', tags: ['accessibility', 'a11y', 'wcag', 'legal'] },
};

const app = fs.readFileSync(APP, 'utf-8');
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

const searchable = routes.filter((r) => !EXCLUDED.has(r) && !r.includes(':'));
const missing = searchable.filter((r) => !PAGE_META[r]);
if (missing.length) {
  console.error('\nRoutes with no search metadata — add them to PAGE_META in this script:');
  missing.forEach((r) => console.error('  ' + r));
  process.exit(1);
}

const unused = Object.keys(PAGE_META).filter((r) => !searchable.includes(r));
if (unused.length) console.warn('warning: PAGE_META entries for routes that no longer exist: ' + unused.join(', '));

const pages = searchable.map((r, i) => ({
  id: `p${i + 1}`,
  type: 'page',
  title: PAGE_META[r].title,
  excerpt: PAGE_META[r].desc,
  url: r,
  category: 'Page',
  tags: PAGE_META[r].tags,
}));

const content = JSON.parse(fs.readFileSync(CONTENT, 'utf-8'));
const all = [...pages, ...content];

const header = `// AUTO-GENERATED by scripts/generate-search-index.mjs — do not edit by hand.
// Pages are derived from the routes in App.tsx; content lives in
// scripts/data/search-content.json. Run \`pnpm search:index\` after changing either.

export type SearchType = 'page' | 'article' | 'book' | 'program' | 'event';

export interface SearchEntry {
  id: string;
  type: SearchType;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  tags: string[];
}

export const SEARCH_INDEX: SearchEntry[] = ${JSON.stringify(all, null, 2)};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header, 'utf-8');

const byType = all.reduce((a, e) => ((a[e.type] = (a[e.type] || 0) + 1), a), {});
console.log(`wrote ${OUT}`);
console.log(`  ${all.length} entries:`, Object.entries(byType).map(([k, v]) => `${k}=${v}`).join(' '));
console.log(`  routes found: ${routes.length}, searchable: ${searchable.length}, excluded: ${routes.length - searchable.length}`);
