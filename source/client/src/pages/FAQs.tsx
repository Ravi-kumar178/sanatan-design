// Sanatan International — FAQs Page
// Real-time keyword search bar + category sidebar accordion
// Smooth CSS-driven open/close animation, keyboard accessible, orange accent design
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import PageMeta from '@/components/PageMeta';
import SocialShare from '@/components/SocialShare';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

const BASE = 'https://www.sanataninternational.org';
const OG_IMAGE = '/Images/og-faqs_87b460c4.jpg';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const categories = [
  {
    id: 'enrollment',
    icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="24" height="28" rx="3" fill="#F97316" fillOpacity="0.1"/><line x1="13" y1="15" x2="27" y2="15"/><line x1="13" y1="20" x2="27" y2="20"/><line x1="13" y1="25" x2="22" y2="25"/></svg>),
    label: 'Enrollment & Programs',
    faqs: [
      { q: 'Who can enroll in the Gurukul programs?', a: 'Our Gurukul programs are open to all ages and all backgrounds. We welcome students from 8 to 80 — whether you are a complete beginner or have prior exposure to Sanskrit, Yoga, or Vedic studies. No prior knowledge is required for Level 1.' },
      { q: 'What are the four Gurukul levels and how long does each take?', a: 'Level 1 (Foundation) is 12 weeks and covers Sanskrit basics, 25 shlokas, Surya Namaskar, basic pranayama, and Vedic math. Level 2 (Consciousness) is 16 weeks and adds Yoga philosophy, Bhagavad Gita study, and community service. Level 3 (Applied Skills) is 20 weeks and introduces Ayurveda basics, advanced Sanskrit, and leadership. Level 4 (Acharya) is an ongoing certification track for those who wish to teach.' },
      { q: 'How do I enroll in a program?', a: 'Sanatan International Gurukul follows an open, donation-based enrollment model. There are no fixed fees. Any sincere seeker can apply — access is granted through a voluntary donation and a brief document verification process. Your account is activated within 48–72 hours of submission. No one is turned away due to financial hardship.' },
      { q: 'Are classes held in person or online?', a: 'We currently offer both in-person sessions in El Sabrante and Oakland, and live online sessions via Zoom. Recordings are available for enrolled students who miss a session. Once the campus is built, all programs will have a physical option.' },
      { q: 'Is there a minimum age requirement?', a: 'Children as young as 8 can join our junior Gurukul track with parental consent. Adults of all ages are welcome. We have a dedicated senior track for learners aged 60+ that moves at a gentler pace.' },
      { q: 'How do I enroll?', a: 'Click the "Enroll" button on the Gurukul page or contact us at gurukul@sanataninternational.org. Our admissions team will schedule a brief orientation call to understand your goals and place you in the right level.' },
      { q: 'Can I switch levels or pause my enrollment?', a: 'Yes. You can pause your enrollment for up to 60 days without losing your progress. Level transfers are evaluated on a case-by-case basis by the program director. Contact us at least 2 weeks before your next billing cycle.' },
      { q: 'Is there a refund policy?', a: 'We offer a full refund within the first 7 days of enrollment if you are not satisfied. After 7 days, we provide a prorated credit toward future programs. We do not offer cash refunds after the first month.' },
    ],
  },
  {
    id: 'donations',
    icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22 L12 16 Q12 14 14 14 Q16 14 16 16 L16 20"/><path d="M16 20 L16 14 Q16 12 18 12 Q20 12 20 14 L20 20"/><path d="M20 20 L20 15 Q20 13 22 13 Q24 13 24 15 L24 20"/><path d="M24 20 L24 17 Q24 15 26 15 Q28 15 28 17 L28 24 Q28 30 20 32 Q12 30 12 24 L12 22"/></svg>),
    label: 'Donations & Land Fund',
    faqs: [
      { q: 'Where does my donation go?', a: 'All donations are directed to one of three purposes: (1) the El Sabrante Land Acquisition Fund, (2) program support for students who need assistance, or (3) general operations. You can specify your preference when donating. We publish quarterly financial reports so every rupee is accounted for.' },
      { q: 'Is my donation tax-deductible?', a: 'We are in the process of obtaining 501(c)(3) status in the United States. Until that is confirmed, donations are not yet tax-deductible under US law. We will notify all donors as soon as our status is approved. Indian donors may have separate provisions under FCRA — consult your tax advisor.' },
      { q: 'What is the Land Acquisition Fund and how much is needed?', a: 'The Land Acquisition Fund is dedicated to purchasing the 33-acre El Sabrante property in California. The total fundraising goal is $2 million USD. Once the land is secured, a separate building campaign will begin. All fund activity is documented publicly in our Financial Reports section.' },
      { q: 'Can I make a recurring monthly donation?', a: 'Yes. Our donation portal (launching soon) will support monthly recurring donations via credit card, UPI, and bank transfer. Monthly donors will receive a dedicated impact report each quarter showing exactly how their contributions were used.' },
      { q: 'Can I donate in Indian Rupees (INR)?', a: 'Yes. We accept INR donations via UPI, NEFT, and IMPS. Contact us at donate@sanataninternational.org for our bank details. Please note that FCRA regulations apply to foreign contributions — we will guide you through the process.' },
      { q: 'How do I know my donation is being used responsibly?', a: 'We publish full financial reports quarterly, including income, expenditure, and fund balances. Our governance board reviews all major financial decisions. We are committed to radical transparency — if you ever have a question about a specific transaction, email us and we will respond within 5 business days.' },
      { q: 'Can I donate in memory of someone or dedicate a donation?', a: 'Yes. During the donation process, you can add a dedication message. We will send a personalized acknowledgment letter to the family or individual you wish to honor. Dedicated donations above $500 will be listed on our Donor Wall (with permission).' },
    ],
  },
  {
    id: 'campus',
    icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="10" r="4" fill="#F97316" stroke="none" opacity="0.7"/><path d="M14 22 Q20 18 26 22"/><path d="M20 22 L20 32"/><path d="M14 28 L20 32 L26 28"/><rect x="8" y="24" width="8" height="6" rx="1" fill="#F97316" fillOpacity="0.3"/><line x1="12" y1="24" x2="12" y2="30"/></svg>),
    label: 'El Sabrante Campus',
    faqs: [
      { q: 'Where is the El Sabrante campus located?', a: 'El Sabrante is an unincorporated community in Contra Costa County, California, in the East Bay Area. The property we are targeting is approximately 33 acres and is accessible from Richmond and San Pablo. Exact address details will be shared once the purchase is finalized.' },
      { q: 'When will the campus be ready?', a: 'Our target for groundbreaking is 2026, subject to completing the land acquisition. Construction is expected to take 2–3 years in phases. The first phase will include a Yoga campus and outdoor meditation spaces. Full campus completion is projected for 2029–2030.' },
      { q: 'What will the campus include?', a: 'The campus will have three sanctuaries: (1) a Yoga Campus for movement, breathwork, and daily wellness training; (2) a Meditation and Skill Training Centre for focus, intuition, and leadership development; and (3) a Research and Development Hub for creating physical and digital tools for better living.' },
      { q: 'Will the campus be open to the public?', a: 'Yes. The campus is designed as a public-benefit facility. Day programs, retreats, and community events will be open to all. Residential programs will be available for enrolled Gurukul students and researchers.' },
    ],
  },
  {
    id: 'technology',
    icon: 'app',
    label: 'Digital Welfare Suite',
    faqs: [
      { q: 'What is the Digital Welfare Suite?', a: 'It is a collection of five ethically designed applications: DhyanaPath (meditation training), PranaBalance (breath and anxiety regulation), ChittaShuddhi (emotional regulation), MedhaPlus (focus and cognitive stability), and SeniorSeva (elder protection and safety). All apps are non-addictive, offline-capable, and free of behavioral manipulation.' },
      { q: 'Are the apps free to use?', a: 'Yes. All five apps in the Digital Welfare Suite are free for individual use. We may offer optional premium features in the future, but the core functionality will always be free. SeniorSeva in particular will always be completely free for elders.' },
      { q: 'When will the apps be available?', a: 'The apps are currently in active development with community testing underway. DhyanaPath and SeniorSeva are the furthest along. We expect to release beta versions in late 2025. Sign up for our newsletter to be notified when they launch.' },
      { q: 'Do the apps collect personal data?', a: 'No. Our apps are designed with a strict no-surveillance policy. We do not collect behavioral data, usage patterns, or personal information beyond what is necessary for the app to function. There is no advertising, no tracking, and no data sold to third parties.' },
    ],
  },
];

// Flat list for search
const allFaqs = categories.flatMap((cat) =>
  cat.faqs.map((faq) => ({ ...faq, catId: cat.id, catLabel: cat.label, catIcon: cat.icon }))
);

// ─── Accordion Item ────────────────────────────────────────────────────────────
function AccordionItem({
  q, a, isOpen, onToggle, highlight,
}: {
  q: string; a: string; isOpen: boolean; onToggle: () => void; highlight?: string;
}) {
  // Highlight matching text
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} style={{ background: 'var(--si-orange-light)', color: 'var(--si-amber-deep)', borderRadius: '2px', padding: '0 1px' }}>{part}</mark>
        : part
    );
  };

  return (
    <div
      style={{
        background: 'var(--si-card)',
        borderRadius: '16px',
        border: `1.5px solid ${isOpen ? 'var(--si-orange)' : 'var(--si-border)'}`,
        padding: '20px 24px',
        boxShadow: isOpen ? '0 2px 16px rgba(249,115,22,0.08)' : 'none',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 text-left"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        aria-expanded={isOpen}
      >
        
          {highlight ? highlightText(q, highlight) : q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
          style={{
            background: isOpen ? 'var(--si-orange)' : 'var(--si-surface-subtle)',
            border: `1.5px solid ${isOpen ? 'var(--si-orange)' : 'var(--si-border)'}`,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'all 200ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2V8M2 5H8" stroke={isOpen ? 'white' : 'var(--si-text-muted)'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 380ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        
          {highlight ? highlightText(a, highlight) : a}
        </p>
      </div>
    </div>
  );
}

// ─── Main FAQs Page ────────────────────────────────────────────────────────────
function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }

// ─── JSON-LD FAQPage Structured Data ─────────────────────────────────────────
// Injects <script type="application/ld+json"> into <head> for Google rich snippets.
// Enables FAQ accordion directly in search results (no backend required).
function FaqJsonLd() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'Frequently Asked Questions — Sanatan International',
      description: 'Answers to common questions about Gurukul enrollment, donations, the El Sabrante campus, and the Digital Welfare Suite.',
      url: 'https://www.sanataninternational.org/faqs',
      mainEntity: categories.flatMap((cat) =>
        cat.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        }))
      ),
    };
    const existing = document.querySelector('script[data-schema="faqpage"]');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faqpage');
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return null;
}

export default function FAQs() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('enrollment');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Search results — filter across ALL categories
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allFaqs.filter(
      (faq) => faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  const clearSearch = () => {
    setSearchQuery('');
    searchRef.current?.focus();
  };

  return (
    <Layout>
      <PageMeta
        title="Frequently Asked Questions"
        description="Answers to common questions about Sanatan International — Gurukul enrollment, donations and the Land Fund, El Sabrante campus plans, and the Digital Welfare Suite apps."
        image={OG_IMAGE}
        url="/faqs"
        type="website"
      />
      <FaqJsonLd />

      {/* Hero */}
      <section className="section-dark pt-32 pb-20">
        <div className="container max-w-3xl">
          <Label c="Newsroom" />
          
            Frequently Asked Questions
          </h1>
          
            Clear answers to the questions we hear most.
          </p>
          
            Can't find what you're looking for? Email us at{' '}
            
              info@sanataninternational.org
            </a>{' '}
            and we will respond within 2 business days.
          </p>
          <SocialShare
            url={`${BASE}/faqs`}
            title="FAQs — Sanatan International"
            description="Answers to common questions about enrollment, donations, campus plans, and our Digital Welfare Suite."
          />
        </div>
      </section>

      {/* ── Search Bar ── */}
      <div style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-6">
          <div
            className="relative max-w-2xl mx-auto"
            style={{
              boxShadow: searchFocused
                ? '0 0 0 3px rgba(249,115,22,0.2), 0 4px 20px rgba(0,0,0,0.08)'
                : '0 2px 12px rgba(0,0,0,0.06)',
              borderRadius: '16px',
              transition: 'box-shadow 200ms ease',
            }}
          >
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? '#F97316' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 200ms ease' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            

            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'var(--si-surface-alt)', border: 'none', cursor: 'pointer', transition: 'background 150ms ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--si-orange-light)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--si-surface-alt)'; }}
                aria-label="Clear search"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2L8 8M8 2L2 8"/>
                </svg>
              </button>
            )}
          </div>

          {/* Search result count */}
          {isSearching && (
            
              {searchResults.length === 0
                ? 'No questions matched your search.'
                : `${searchResults.length} question${searchResults.length !== 1 ? 's' : ''} found across all categories`}
            </p>
          )}
        </div>
      </div>

      {/* FAQ Body */}
      <section className="section-cream py-16">
        <div className="container">

          {/* ── SEARCH RESULTS VIEW ── */}
          {isSearching ? (
            <div className="max-w-3xl mx-auto">
              {searchResults.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-4">🔍</p>
                  
                    No results for "{searchQuery}"
                  </p>
                  
                    Try a different keyword, or email us directly.
                  </p>
                  <a href="mailto:info@sanataninternational.org" className="btn-orange text-xs" style={{ textDecoration: 'none' }}>
                    Email Us
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((faq, i) => {
                    const key = `search-${i}`;
                    return (
                      <div key={key}>
                        {/* Category badge above first item in each category group */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{faq.catIcon}</span>
                          
                            {faq.catLabel}
                          </span>
                        </div>
                        <AccordionItem
                          q={faq.q}
                          a={faq.a}
                          isOpen={!!openItems[key]}
                          onToggle={() => toggleItem(key)}
                          highlight={searchQuery.trim()}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ── CATEGORY VIEW ── */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Category sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-2">
                  
                    Categories
                  </p>
                  {categories.map((cat) => (
                    
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-semibold leading-tight"
                        style={{ color: activeCategory === cat.id ? 'var(--si-orange-ink)' : 'var(--si-text-strong)' }}>
                        {cat.label}
                      </span>
                      
                        {cat.faqs.length}
                      </span>
                    </button>
                  ))}

                  {/* Quick contact */}
                  <div className="mt-6 rounded-2xl p-5" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                    सेवा</p>
                    Still have questions?</p>
                    
                      We respond to all emails within 2 business days.
                    </p>
                    <a href="mailto:info@sanataninternational.org" className="btn-orange text-xs block text-center"
                      style={{ textDecoration: 'none' }}>
                      Email Us
                    </a>
                  </div>
                </div>
              </div>

              {/* Accordion */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">{currentCategory.icon}</span>
                    
                      {currentCategory.label}
                    </h2>
                  </div>
                  
                    {currentCategory.faqs.length} questions
                  </p>
                </div>

                <div className="space-y-3">
                  {currentCategory.faqs.map((faq, i) => {
                    const key = `${activeCategory}-${i}`;
                    return (
                      <AccordionItem
                        key={key}
                        q={faq.q}
                        a={faq.a}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(key)}
                      />
                    );
                  })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 card-white p-8 text-center" style={{ border: '1.5px solid var(--si-orange-light)' }}>
                  
                    "प्रश्नः ज्ञानस्य द्वारम्"
                  </p>
                  
                    "A question is the door to knowledge."
                  </p>
                  
                    Ready to take the next step? Explore our programs or support the campus mission.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/gurukul" className="btn-orange">Explore Programs</Link>
                    <Link href="/donate" className="btn-outline">Donate to Land Fund</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <RelatedPages current="/faqs" picks={['/gurukul', '/donate', '/blog']} />
    </Layout>
  );
}
