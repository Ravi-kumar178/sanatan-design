// Sanatan International — Home Page
// Layout matches www.sanataninternational.org exactly:
// Hero → Choose Your Path → Sanskrit Quote → Three Pillars → Why Land First
// → Progress Timeline → El Sabrante Campus → Marketplace → Community Circles
import React from 'react';
import Layout from '@/components/Layout';
import WelcomeEmailModal from '@/components/WelcomeEmailModal';
import { subscribeToNewsletter } from '@/lib/newsletterApi';
import type { WelcomeEmail } from '@/lib/newsletterApi';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import SpiritualParticles from '@/components/SpiritualParticles';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useCounterAnimation } from '@/hooks/useScrollReveal';
import Image from "@/components/Image";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function LabelChip({ children }: { children: string }) {
  return <p className="label-chip mb-3">{children}</p>;
}

function StatCounter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useCounterAnimation(value);
  return (
    <div className="text-center">
      
        <span ref={ref}>0</span>{suffix}
      </div>
      
        {label}
      </div>
    </div>
  );
}

// ─── Shloka of the Day ───────────────────────────────────────────────────────
const DAILY_SHLOKAS = [
  { id: 0, shloka: 'योगः कर्मसु कौशलम्', transliteration: 'Yogaḥ karmasu kauśalam', source: 'Bhagavad Gita 2.50', meaning: 'Yoga is excellence in action.', context: 'Krishna teaches Arjuna that the highest form of yoga is not withdrawal from the world, but the art of acting with full skill, full presence, and zero attachment to outcome.' },
  { id: 1, shloka: 'विद्या ददाति विनयम्', transliteration: 'Vidyā dadāti vinayam', source: 'Subhashita tradition', meaning: 'True knowledge cultivates humility.', context: 'The complete verse continues: humility gives worthiness, worthiness gives wealth, wealth gives dharma, and dharma gives joy. Knowledge is the root of all flourishing.' },
  { id: 2, shloka: 'आरोग्यं परमं भाग्यम्', transliteration: 'Ārogyaṃ paramaṃ bhāgyam', source: 'Classical Subhashita', meaning: 'Health is the greatest fortune.', context: 'Āyurveda begins here: before wealth, before fame, before any achievement — the body must be a stable, energised vessel. Without health, nothing else is possible.' },
  { id: 3, shloka: 'सत्यं वद। धर्मं चर।', transliteration: 'Satyaṃ vada. Dharmaṃ cara.', source: 'Taittiriya Upanishad 1.11.1', meaning: 'Speak truth. Walk the path of dharma.', context: 'These are the first instructions given by a Vedic teacher to a graduating student. Two sentences. A complete guide for life.' },
  { id: 4, shloka: 'तत् त्वम् असि', transliteration: 'Tat tvam asi', source: 'Chandogya Upanishad 6.8.7', meaning: 'That thou art.', context: 'One of the four Mahavakyas — great sayings — of the Upanishads. The individual self (tvam) is identical to universal consciousness (tat). This is the highest teaching of Vedanta.' },
  { id: 5, shloka: 'अहं ब्रह्मास्मि', transliteration: 'Ahaṃ brahmāsmi', source: 'Brihadaranyaka Upanishad 1.4.10', meaning: 'I am Brahman.', context: 'The second Mahavakya. Not a claim of ego, but the dissolution of it — the recognition that the witness of all experience is the same consciousness that pervades the universe.' },
  { id: 6, shloka: 'सर्वे भवन्तु सुखिनः', transliteration: 'Sarve bhavantu sukhinaḥ', source: 'Brihadaranyaka Upanishad 1.4.14', meaning: 'May all beings be happy.', context: 'The complete prayer: May all be happy. May all be free from illness. May all see what is auspicious. May none suffer. This is the founding prayer of Sanatan International.' },
];

function ShlokaOfTheDay() {
  // Deterministic daily rotation: changes once per day based on UTC date
  const [shlokaIdx, setShlokaIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Audio timestamps for each shloka (approximate start times in the combined audio)
  const SHLOKA_TIMES = [0, 8, 16, 24, 32, 38, 44];

  const playAudio = useCallback(() => {
    if (audioError) return;
    if (!audioRef.current) {
      audioRef.current = new Audio('/Images/shloka-audio_d481fd4d.wav');
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => { setAudioError(true); setIsPlaying(false); };
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = SHLOKA_TIMES[shlokaIdx] || 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setAudioError(true));
    }
  }, [isPlaying, shlokaIdx, audioError]);

  // Stop audio when shloka changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [shlokaIdx]);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setShlokaIdx(dayOfYear % DAILY_SHLOKAS.length);
  }, []);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), 100); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  const goTo = (idx: number) => {
    if (isChanging) return;
    setIsChanging(true);
    setTimeout(() => { setShlokaIdx((idx + DAILY_SHLOKAS.length) % DAILY_SHLOKAS.length); setIsChanging(false); }, 250);
  };

  const s = DAILY_SHLOKAS[shlokaIdx];

  return (
    <section className="on-dark" ref={ref} style={{ background: 'linear-gradient(135deg, var(--si-ink) 0%, #2D1A0A 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container py-16 max-w-3xl relative z-10"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.23,1,0.32,1)' }}>

        {/* Header row */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              "Shloka of the Day"</p>
              Changes daily · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Audio play button */}
            {!audioError && (
              <button onClick={playAudio} title={isPlaying ? 'Pause pronunciation' : 'Hear Sanskrit pronunciation'}
                style={{ width: '34px', height: '34px', borderRadius: '50%', border: `1.5px solid ${isPlaying ? 'var(--si-orange)' : 'rgba(255,255,255,0.2)'}`, background: isPlaying ? 'rgba(249,115,22,0.15)' : 'transparent', color: isPlaying ? 'var(--si-orange-ink)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease', flexShrink: 0 }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; if (!isPlaying) { el.style.borderColor = 'var(--si-orange)'; el.style.color = 'var(--si-orange-ink)'; } }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; if (!isPlaying) { el.style.borderColor = 'rgba(255,255,255,0.2)'; el.style.color = 'rgba(255,255,255,0.5)'; } }}>
                {isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>
            )}
            {/* Navigation dots */}
            <div className="flex gap-1.5">
              {DAILY_SHLOKAS.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  aria-label={`Show shloka ${i + 1} of ${DAILY_SHLOKAS.length}`}
                  aria-current={i === shlokaIdx}
                  style={{ width: i === shlokaIdx ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === shlokaIdx ? 'var(--si-orange)' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 300ms ease', padding: 0 }} />
              ))}
            </div>
          </div>
        </div>

        {/* Shloka content */}
        <div style={{ opacity: isChanging ? 0 : 1, transform: isChanging ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 250ms ease, transform 250ms ease' }}>
          {/* Devanagari */}
          
            "{s.shloka}"
          </p>
          {/* Transliteration */}
          <p className="font-display italic mb-1" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)' }}>
            {s.transliteration}
          </p>
          {/* Source */}
          
            — {s.source}
          </p>
          {/* Meaning */}
          <div style={{ borderLeft: '3px solid var(--si-orange)', paddingLeft: '20px', marginBottom: '16px' }}>
            "{s.meaning}"</p>
            {s.context}</p>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
          <div className="flex gap-2">
            <button onClick={() => goTo(shlokaIdx - 1)} aria-label="Previous shloka" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 150ms ease' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--si-orange)'; el.style.color = 'var(--si-orange-ink)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'rgba(255,255,255,0.5)'; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={() => goTo(shlokaIdx + 1)} aria-label="Next shloka" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 150ms ease' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--si-orange)'; el.style.color = 'var(--si-orange-ink)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'rgba(255,255,255,0.5)'; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          {/* Share this shloka */}
          <div className="flex items-center gap-2">
            Share:</span>
            {[
              { label: 'X', href: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${s.shloka}" — ${s.meaning} (${s.source}) via @SanatanIntl`)}`, color: '#000' },
              { label: 'WA', href: () => `https://wa.me/?text=${encodeURIComponent(`"${s.shloka}" — ${s.meaning} (${s.source}) | Shloka of the Day from Sanatan International: https://sanataninternational.org`)}`, color: '#25D366' },
            ].map((btn) => (
              
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const [welcomeEmailData, setWelcomeEmailData] = useState<import('@/lib/newsletterApi').WelcomeEmail | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      inputRef.current?.focus();
      return;
    }
    setStatus('loading');
    const result = await subscribeToNewsletter(trimmed);
    if (result.success) {
      setStatus('success');
      setWelcomeEmailData(result.welcomeEmail);
      setShowWelcomeModal(true);
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <>
    <section className="py-16 section-cream texture-cream">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center reveal">
          <LabelChip>Community</LabelChip>
          
            Stay Connected
          </h2>
          
            "ज्ञानं परमं बलम्" — Knowledge is the supreme strength.
          </p>
          
            Receive campus updates, new programs, and community gatherings — no noise, only signal.
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-3 p-5 rounded-2xl" style={{ background: 'var(--si-card)', border: '1px solid var(--si-border)', animation: 'successReveal 0.5s ease both' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--si-orange)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left">
                Welcome to the Sangha 🙏</p>
                You'll hear from us when it matters.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              
              <button type="submit" disabled={status === 'loading'} className="btn-orange flex items-center gap-2" style={{ opacity: status === 'loading' ? 0.8 : 1 }}>
                {status === 'loading' ? (
                  <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spinnerRotate 0.8s linear infinite' }}><circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M7 2A5 5 0 0 1 12 7" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg> Joining…</>
                ) : 'Join Sangha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
    {showWelcomeModal && welcomeEmailData && (
      <WelcomeEmailModal email="you" welcomeEmail={welcomeEmailData} onClose={() => setShowWelcomeModal(false)} />
    )}
    </>
  );
}

// ─── Main Home Page ───────────────────────────────────────────────────────────

// ─── Organization + WebSite JSON-LD ──────────────────────────────────────────
// Injected into <head> for Google Knowledge Panel eligibility and sitelinks.
// Schema types: Organization, WebSite (with SearchAction), NonProfit.
function HomeJsonLd() {
  useEffect(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'NGO'],
        '@id': 'https://www.sanataninternational.org/#organization',
        name: 'Sanatan International',
        alternateName: 'Sanatan International — Centre for Human Flourishing',
        url: 'https://www.sanataninternational.org',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.sanataninternational.org/logo.png',
          width: 512,
          height: 512,
        },
        description: 'A nonprofit centre for Gurukul-based education, Ayurveda research, ethical technology, and community welfare. Building a permanent 33-acre campus in El Sabrante, California.',
        foundingDate: '2024',
        foundingLocation: {
          '@type': 'Place',
          name: 'El Sabrante, California, USA',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'El Sabrante',
            addressRegion: 'CA',
            addressCountry: 'US',
          },
        },
        areaServed: ['US', 'IN', 'Global'],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@sanataninternational.org',
            availableLanguage: ['English', 'Hindi', 'Sanskrit'],
          },
          {
            '@type': 'ContactPoint',
            contactType: 'donations',
            email: 'donate@sanataninternational.org',
          },
        ],
        sameAs: [
          'https://www.facebook.com/sanataninternational',
          'https://www.instagram.com/sanataninternational',
          'https://x.com/sanatanint',
          'https://www.youtube.com/@sanataninternational',
        ],
        knowsAbout: [
          'Vedic Education', 'Sanskrit', 'Ayurveda', 'Yoga', 'Gurukul System',
          'Hindu Dharma', 'Digital Welfare', 'Community Welfare',
        ],
        nonprofitStatus: 'Nonprofit501c3',
        taxID: 'Pending 501(c)(3)',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.sanataninternational.org/#website',
        url: 'https://www.sanataninternational.org',
        name: 'Sanatan International',
        description: 'Ancient human sciences. Modern execution. Public benefit.',
        publisher: { '@id': 'https://www.sanataninternational.org/#organization' },
        inLanguage: ['en-US', 'hi-IN'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.sanataninternational.org/faqs?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    schemas.forEach((schema, i) => {
      const id = `org-schema-${i}`;
      const existing = document.querySelector(`script[data-schema="${id}"]`);
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', id);
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });

    return () => {
      [0, 1].forEach((i) => {
        document.querySelector(`script[data-schema="org-schema-${i}"]`)?.remove();
      });
    };
  }, []);
  return null;
}

// ─── Product Quick-View Modal ─────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Sacred A2 Ghee', desc: 'Pure bilona-churned A2 cow ghee, 500ml', price: '$28', badge: 'Best Seller',
    img: '/Images/product-ghee_68449294.jpg', tag: 'Āyurveda',
    details: 'Prepared using the traditional bilona (hand-churned) method from A2 milk of indigenous Gir cows. Cold-processed to preserve all natural vitamins and fatty acids. No additives, no preservatives. Shelf-stable for 12 months.',
    benefits: ['Supports digestive fire (Agni)', 'Rich in butyric acid and fat-soluble vitamins', 'Traditional Āyurvedic cooking medium', 'Suitable for all three doshas'],
    weight: '500ml glass jar', origin: 'Gujarat, India', shelf: '12 months',
  },
  {
    name: 'Ashwagandha Root', desc: 'Certified organic KSM-66 extract, 60 caps', price: '$34', badge: 'Top Rated',
    img: '/Images/product-ashwagandha_55063808.jpg', tag: 'Herbs',
    details: 'KSM-66 is the most clinically studied ashwagandha extract in the world, with 22 gold-standard clinical trials. Each capsule contains 300mg of full-spectrum root extract standardised to ≥5% withanolides.',
    benefits: ['Reduces cortisol by up to 22%', 'Improves sleep quality and onset', 'Increases muscle strength and recovery', 'Supports thyroid and adrenal function'],
    weight: '60 capsules (2-month supply)', origin: 'Rajasthan, India', shelf: '24 months',
  },
  {
    name: 'Triphala Churna', desc: 'Traditional 3-fruit blend, 250g powder', price: '$22', badge: 'New',
    img: '/Images/product-triphala_ef4cf61a.jpg', tag: 'Herbs',
    details: 'The classical Āyurvedic formula combining Amalaki (Emblica officinalis), Haritaki (Terminalia chebula), and Bibhitaki (Terminalia bellerica) in equal proportions. Sun-dried and stone-ground to preserve bioactive compounds.',
    benefits: ['Gentle daily detoxification', 'Supports healthy digestion and elimination', 'Rich in Vitamin C and antioxidants', 'Balances all three doshas'],
    weight: '250g resealable pouch', origin: 'Madhya Pradesh, India', shelf: '18 months',
  },
  {
    name: 'Sacred Agarbatti', desc: 'Hand-rolled temple incense, 100 sticks', price: '$18', badge: null,
    img: '/Images/product-incense_20e053f3.jpg', tag: 'Ritual',
    details: 'Hand-rolled by artisans in Bengaluru using a traditional masala formula: sandalwood, frankincense, rose, and vetiver on a bamboo core. No synthetic fragrances, no charcoal base. Burns for approximately 45 minutes per stick.',
    benefits: ['Creates a sacred atmosphere for puja and meditation', 'Natural aromatherapy — reduces anxiety', 'Supports respiratory health (unlike charcoal-based incense)', 'Traditional temple fragrance blend'],
    weight: '100 sticks per box', origin: 'Karnataka, India', shelf: '36 months',
  },
  {
    name: 'Saffron Yoga Mat', desc: 'Natural rubber, sacred geometry, 6mm', price: '$89', badge: 'Premium',
    img: '/Images/product-yoga-mat_014e3fb5.jpg', tag: 'Yoga',
    details: 'Made from sustainably harvested natural rubber with a closed-cell microfibre top surface. The subtle mandala pattern is embossed (not printed) so it never fades. 6mm thickness for joint support. Non-slip on all surfaces.',
    benefits: ['Superior grip — dry and wet', 'Eco-friendly natural rubber (no PVC)', 'Sacred geometry mandala for focused practice', 'Carries the Sanatan International brand mark'],
    weight: '183cm × 61cm × 6mm, 2.1kg', origin: 'Kerala, India', shelf: 'Lifetime with care',
  },
];

function ProductQuickView({ product, onClose }: { product: typeof PRODUCTS[0]; onClose: () => void }) {
  // Close on Escape
  const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { document.addEventListener('keydown', handleKey); return () => document.removeEventListener('keydown', handleKey); }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: 'var(--si-card)', borderRadius: '20px', maxWidth: '760px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'fadeIn 200ms ease' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--si-border)', background: 'var(--si-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '20px 0 0 20px' }}>
            <Image src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Details */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.tag}</span>
                {product.badge && {product.badge}</span>}
              </div>
              Sanatan International</p>
              {product.name}</h2>
              {product.desc}</p>
            </div>
            {product.price}</p>
            {product.details}</p>
            {/* Benefits */}
            <div>
              Key Benefits</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.benefits.map((b) => (
                  
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--si-orange)', flexShrink: 0, marginTop: '6px' }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            {/* Specs */}
            <div style={{ background: 'var(--si-surface)', borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[['Size / Weight', product.weight], ['Origin', product.origin], ['Shelf Life', product.shelf]].map(([k, v]) => (
                
                  {k}</span>
                  {v}</span>
                </div>
              ))}
            </div>
            {/* CTA */}
            
              Add to Cart — {product.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();
  const [videoOpen, setVideoOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = React.useState<typeof PRODUCTS[0] | null>(null);

  return (
    <>
    <Layout>
      <HomeJsonLd />

      {/* ═══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden texture-dark" style={{ background: "var(--si-hero-dark)", height: "clamp(560px, 100svh, 860px)" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/Images/Gemini_Generated_Image_fbgkmqfbgkmqfbgk_2435fee5.png"
            alt="Ancient Indian lotus temple at dusk"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 35%', opacity: 0.65 }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,25,35,0.45) 0%, rgba(15,25,35,0.35) 35%, rgba(15,25,35,0.82) 100%)' }} />
        </div>
        <SpiritualParticles />

        {/* Hero content — absolutely centered */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 1.5rem 24px' }}>

          {/* Eyebrow badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', padding: '5px 16px', marginBottom: '20px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.35)', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-orange)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0 }} />
            
              Bay Area, California · Est. 2024
            </span>
          </div>

          {/* Main headline */}
          
            You left India.<br />
            Your roots stayed.</span>
          </h1>

          {/* Sub-headline */}
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.82)', marginBottom: '20px', lineHeight: 1.5, maxWidth: '640px' }}>
            Building a permanent Gurukul campus in California —<br />
            so your children grow up knowing who they are.
          </p>

          {/* Urgency line */}
          
            ● Land Acquisition Phase Active — 33-Acre Campus · El Sabrante, CA
          </p>


          {/* ── Live Milestone Counter + Progress Bar ── */}
          <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '6px 16px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--si-emerald)', display: 'inline-block', boxShadow: '0 0 6px var(--si-emerald)' }} />
                142</span>
                Founding Members</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '6px 16px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--si-orange)', display: 'inline-block', boxShadow: '0 0 6px var(--si-orange)' }} />
                47</span>
                Donors This Month</span>
              </div>
            </div>
            <div style={{ width: '100%', maxWidth: '480px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                Campus Land Fund</span>
                $347,500 of $2,000,000</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '17.375%', background: 'linear-gradient(90deg, var(--si-orange), #FBBF24)', borderRadius: '999px' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                17% funded · 1,043 donors · Est. completion 2027</p>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  Share</span>
                  {/* WhatsApp */}
                  <a href="https://wa.me/?text=Sanatan%20International%20is%20building%20a%2033-acre%20Gurukul%20campus%20in%20California.%20%24347%2C500%20raised%20so%20far%20%E2%80%94%20support%20the%20vision%3A%20https%3A%2F%2Fsanataninternational.org%2Fcampus" target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 150ms ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.3)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  {/* X/Twitter */}
                  <a href="https://twitter.com/intent/tweet?text=Sanatan%20International%20is%20building%20a%2033-acre%20Gurukul%20campus%20in%20California%20for%20the%20Indian%20diaspora.%20%24347%2C500%20raised%20so%20far.%20Support%20the%20vision%20%E2%86%92&url=https%3A%2F%2Fsanataninternational.org%2Fcampus&via=SanatanIntl" target="_blank" rel="noopener noreferrer" title="Share on X" style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 150ms ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.18)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsanataninternational.org%2Fcampus" target="_blank" rel="noopener noreferrer" title="Share on Facebook" style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 150ms ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(24,119,242,0.3)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* Copy link */}
                  <button onClick={() => { navigator.clipboard.writeText('https://sanataninternational.org/campus').then(() => { const btn = document.getElementById('copy-milestone-btn'); if (btn) { btn.style.background = 'rgba(16,185,129,0.3)'; setTimeout(() => { btn.style.background = 'rgba(255,255,255,0.08)'; }, 1500); } }); }} id="copy-milestone-btn" title="Copy link" style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'background 150ms ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            
              Support the Campus Fund →
            </Link>
            
              See the Campus →
            </Link>
            
              Explore the Gurukul
            </Link>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 2 }}>
          <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
            <div className="w-1 h-2 rounded-full animate-float-slow" style={{ background: 'var(--si-orange)' }} />
          </div>
        </div>
      </section>

            {/* ═══ STATS BAR ══════════════════════════════════════════════════════ */}
      <section className="on-dark py-10" style={{ background: 'var(--si-hero-mid)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={33} suffix=" Acres" label="Campus Goal" />
            <StatCounter value={4} label="Core Programs" />
            <StatCounter value={3} label="Bay Area Regions" />
            <StatCounter value={200} suffix="+" label="Students Enrolled" />
          </div>
        </div>
      </section>

      {/* ═══ 2. CHOOSE YOUR PATH ════════════════════════════════════════════ */}
      <section className="section-white py-20">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <LabelChip>Start Here</LabelChip>
            
              Choose your path
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'learn', icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="24" height="28" rx="3" fill="#F97316" fillOpacity="0.1"/><line x1="13" y1="15" x2="27" y2="15"/><line x1="13" y1="20" x2="27" y2="20"/><line x1="13" y1="25" x2="22" y2="25"/></svg>), title: 'learn', desc: 'Explore Gurukul programs, Ayurveda research, and ethical technology learning.', href: '/gurukul' },
              { key: 'give', icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22 L12 16 Q12 14 14 14 Q16 14 16 16 L16 20"/><path d="M16 20 L16 14 Q16 12 18 12 Q20 12 20 14 L20 20"/><path d="M20 20 L20 15 Q20 13 22 13 Q24 13 24 15 L24 20"/><path d="M24 20 L24 17 Q24 15 26 15 Q28 15 28 17 L28 24 Q28 30 20 32 Q12 30 12 24 L12 22"/></svg>), title: 'give', desc: 'Support the 33-acre campus fund and help secure a permanent home.', href: '/donate' },
              { key: 'join', icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="14" r="4" fill="#F97316" fillOpacity="0.2"/><circle cx="10" cy="20" r="3.5" fill="#F97316" fillOpacity="0.2"/><circle cx="30" cy="20" r="3.5" fill="#F97316" fillOpacity="0.2"/><path d="M14 26 Q14 22 20 22 Q26 22 26 26"/></svg>), title: 'join', desc: 'Volunteer or advise—lend skills to protect and serve communities worldwide.', href: '/volunteer' },
            ].map((path, i) => (
              <div key={path.key} className={`reveal delay-${(i + 1) * 100} card-dashed p-8`}>
                <div className="text-3xl mb-3">{path.icon}</div>
                <p className="label-chip mb-1">{path.key.toUpperCase()}</p>
                {path.title}</h3>
                {path.desc}</p>
                
                  Start
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. SANSKRIT QUOTE ══════════════════════════════════════════════ */}
      <section className="py-14 section-white" style={{ borderTop: '1px solid var(--si-surface-alt)', borderBottom: '1px solid var(--si-surface-alt)' }}>
        <div className="container text-center reveal">
          
            "योगः कर्मसु कौशलम्" — Bhagavad Gita 2.50
          </p>
          
            Yoga is excellence in action.
          </p>
        </div>
      </section>

      {/* ═══ 3b. SHLOKA OF THE DAY ══════════════════════════════════════════ */}
      <ShlokaOfTheDay />

      {/* ═══ 4. THREE PILLARS ═══════════════════════════════════════════════ */}
      <section className="section-cream py-20 texture-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { iconSrc: '/Images/icon-gurukul-teacher_690a9246.png', iconAlt: 'Gurukul education icon', title: 'Gurukul (Education)', desc: 'Structured training in discipline, focus, ethics, and life skills rooted in classical Yoga and ethics frameworks.', href: '/gurukul/foundation' },
              { iconSrc: '/Images/icon-ayurveda-mortar_16433074.png', iconAlt: 'Ayurveda herb icon', title: 'Ayurveda (Research & Preventive Health)', desc: 'Research, documentation, and education in lifestyle-centered well-being grounded in classical Ayurveda.', href: '/gurukul/ayurveda' },
              { iconSrc: '/Images/icon-tech-lotus_d69ab604.png', iconAlt: 'Ethical technology icon', title: 'Ethical Technology (Human Welfare R&D)', desc: 'Tools designed to protect and support people—especially seniors and vulnerable users—without exploitative design.', href: '/apps' },
            ].map((pillar, i) => (
              <div key={pillar.title} className={`reveal delay-${(i + 1) * 100} card-white p-8`}>
                <div className="mb-4" style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--si-orange-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 250ms cubic-bezier(0.23,1,0.32,1), box-shadow 250ms ease' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1.12) rotate(-4deg)'; el.style.boxShadow = '0 8px 24px rgba(249,115,22,0.25)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1) rotate(0deg)'; el.style.boxShadow = 'none'; }}>
                  <Image src={pillar.iconSrc} alt={pillar.iconAlt} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                </div>
                <LabelChip>Pillar</LabelChip>
                {pillar.title}</h3>
                {pillar.desc}</p>
                
                  Learn More
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. WHY LAND FIRST ══════════════════════════════════════════════ */}
      <section className="section-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <LabelChip>Why Land First</LabelChip>
              
                Buildings can come later. Land makes this mission permanent.
              </h2>
              
                A permanent home ensures independence, long-term planning, and protection from mission drift.
              </p>
              <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                
                  "नायमात्मा प्रवचनेन लभ्यः"
                </p>
                — Katha Upanishad 1.2.23</p>
                
                  Inner knowledge isn't gained by speech alone; it needs discipline and environment.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/donate" className="btn-orange">Donate to Land Fund</Link>
                <Link href="/financial-reports" className="btn-outline">View Transparency</Link>
              </div>
            </div>
            <div className="reveal-right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Permanence', desc: 'Asset held for public benefit' },
                  { label: 'Independence', desc: 'Mission protected from drift' },
                  { label: 'Planning', desc: 'Long-term program stability' },
                  { label: 'Continuity', desc: 'Education + research for generations' },
                ].map((item) => (
                  <div key={item.label} className="card-white p-5">
                    <LabelChip>{item.label}</LabelChip>
                    {item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. PROGRESS TIMELINE ═══════════════════════════════════════════ */}
      <section className="section-white py-20" style={{ borderTop: '1px solid var(--si-surface-alt)' }}>
        <div className="container">
          <div className="text-center mb-12 reveal">
            <LabelChip>Our Work in 2024–2025</LabelChip>
            
              Measured progress, documented publicly
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { date: 'Jan 2024', event: 'Registered as a public-benefit initiative; community advisory circle formed.' },
              { date: 'Apr 2024', event: 'Digital safety toolkit launched for seniors and families.' },
              { date: 'Aug 2024', event: 'Volunteer network onboarded across 3 regions.' },
              { date: 'Dec 2024', event: 'Curriculum framework published for Gurukul levels 1–3.' },
              { date: 'Mar 2025', event: 'Land due-diligence phase initiated for El-Sabrante campus.' },
              { date: 'Jul 2025', event: 'Research ethics policy and governance handbook published.' },
            ].map((item, i) => (
              <div key={item.date} className={`reveal delay-${(i % 3 + 1) * 100} timeline-item`}>
                
                  {item.date}
                </p>
                
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. EL SABRANTE CAMPUS ══════════════════════════════════════════ */}
      <section className="section-warm py-20 texture-cream">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left card */}
            <div className="card-white p-8 reveal">
              <LabelChip>El Sabrante Campus</LabelChip>
              
                Three sanctuaries, one mission
              </h2>
              <div className="rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                <Image src="/Images/Gemini_Generated_Image_lu0mc9lu0mc9lu0m_d52a8569.png" alt="El Sabrante campus vision"
                  className="w-full h-full object-cover" />
              </div>
              <ul className="space-y-3">
                {[
                  { bold: 'Yoga Campus', rest: 'for movement, breathwork, and daily wellness training.' },
                  { bold: 'Meditation and Skill Training', rest: 'for focus, intuition, and leadership development.' },
                  { bold: 'Research and Development', rest: 'to create physical and digital tools for better living.' },
                ].map((item) => (
                  
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--si-orange)' }} />
                    <span><strong>{item.bold}</strong> {item.rest}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right card */}
            <div className="card-white p-8 reveal-right flex flex-col justify-between">
              <div>
                <LabelChip>Community Path</LabelChip>
                
                  Support the land vision
                </h3>
                
                  Land is the anchor for learning, care, and cultural continuity. Your support builds classrooms, halls, and healing spaces.
                </p>
                <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                  {lang === 'hi' && भूमि माता</p>}
                  
                    "The Earth is our mother." Every acre secured is a generation protected.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { num: '33', label: 'Acres planned' },
                    { num: '$2M+', label: 'Fundraising goal' },
                    { num: '500+', label: 'Community capacity' },
                    { num: '2026', label: 'Target groundbreaking' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--si-surface-subtle)', border: '1px solid var(--si-border)' }}>
                      {stat.num}</p>
                      {stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/donate" className="btn-orange text-center">
                Contribute to the Campus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. MARKETPLACE ═════════════════════════════════════════════════ */}
      <section className="section-warm py-20 texture-cream" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 reveal">
            <div>
              <LabelChip>Marketplace</LabelChip>
              
                Organic essentials, curated
              </h2>
              
                Long shelf-life organic foods and wellness staples imported from India for daily living.
              </p>
            </div>
            <Link href="/marketplace" className="btn-outline flex-shrink-0">
              View Full Marketplace →
            </Link>
          </div>
          {/* Branded product grid — 5 products using PRODUCTS data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {PRODUCTS.map((product, i) => (
              <div key={product.name} className={`reveal delay-${(i + 1) * 100} card-white overflow-hidden group`} style={{ cursor: 'pointer' }}>
                <div className="overflow-hidden relative" style={{ aspectRatio: '1/1' }} onClick={() => setQuickViewProduct(product)}>
                  <Image src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.badge && (
                    
                      {product.badge}
                    </span>
                  )}
                  
                    {product.tag}
                  </span>
                  {/* Quick View overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    Quick View</span>
                  </div>
                </div>
                <div className="p-4">
                  Sanatan International</p>
                  {product.name}</h3>
                  {product.desc}</p>
                  <div className="flex items-center justify-between gap-1">
                    {product.price}</span>
                    
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Marketplace trust bar */}
          <div className="mt-8 reveal" style={{ background: 'var(--si-card)', borderRadius: '14px', padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--si-surface-alt)' }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round"><path d="M20 8 Q14 12 12 20 Q10 28 20 32 Q30 28 28 20 Q26 12 20 8Z" fill="#F97316" fillOpacity="0.15"/><path d="M20 8 Q20 16 16 22" strokeWidth="1.5"/><path d="M20 8 Q20 16 24 22" strokeWidth="1.5" opacity="0.7"/></svg>, text: 'Certified Organic' },
              { icon: <svg width="16" height="16" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round"><circle cx="20" cy="20" r="13" fill="#F97316" fillOpacity="0.08" stroke="#F97316"/><path d="M7 20 Q13 16 20 20 Q27 24 33 20" strokeWidth="1.4"/><path d="M20 7 Q16 13 16 20 Q16 27 20 33"/><path d="M20 7 Q24 13 24 20 Q24 27 20 33"/></svg>, text: 'Sourced from India' },
              { icon: <svg width="16" height="16" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round"><rect x="4" y="16" width="26" height="14" rx="2" fill="#F97316" fillOpacity="0.1"/><path d="M30 20 L36 20 L36 26 L30 26"/><circle cx="11" cy="32" r="3" fill="#F97316" fillOpacity="0.4"/><circle cx="25" cy="32" r="3" fill="#F97316" fillOpacity="0.4"/><path d="M4 20 L4 14 L22 10 L30 16"/></svg>, text: 'Free US Shipping $50+' },
              { icon: <svg width="16" height="16" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round"><path d="M20 8 L24 16 L33 17 L27 23 L28 32 L20 28 L12 32 L13 23 L7 17 L16 16 Z" fill="#F97316" fillOpacity="0.15" stroke="#F97316"/><path d="M20 12 L22 18 L28 19 L24 23 L25 29 L20 26 L15 29 L16 23 L12 19 L18 18 Z" fill="#F97316" fillOpacity="0.3" stroke="none"/></svg>, text: 'Sustainable Packaging' },
              { icon: <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="24" rx="4" ry="8" fill="#F97316" opacity="0.9"/><ellipse cx="20" cy="24" rx="4" ry="8" transform="rotate(35 20 24)" fill="#F97316" opacity="0.6"/><ellipse cx="20" cy="24" rx="4" ry="8" transform="rotate(-35 20 24)" fill="#F97316" opacity="0.6"/><circle cx="20" cy="20" r="3.5" fill="#F97316"/></svg>, text: '10% to Campus Fund' },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2">
                <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{t.icon}</span>
                {t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* COURSES */}
      <section className="on-dark py-20 texture-stone" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 reveal">
            <div>
              <p className="label-chip mb-3">{t('home.courses.title')}</p>
              
                Learn from living masters
              </h2>
              <p className="font-display italic mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Ancient sciences. Modern delivery. Credentialed teachers. Not a chatbot.
              </p>
            </div>
            
              View All Programs →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Sanskrit Foundation', subtitle: 'For ages 9–16 & adults', level: 'Beginner', duration: '12 weeks', students: '847', img: '/Images/course-sanskrit_afdd2b82.jpg', color: 'var(--si-orange-ink)' },
              { title: 'Yoga Science', subtitle: 'Asana, Pranayama & Philosophy', level: 'All levels', duration: '12 weeks', students: '1,203', img: '/Images/course-yoga_06b2172a.jpg', color: 'var(--si-success)' },
              { title: 'Vedic Sciences', subtitle: 'Upanishads, Jyotisha & Vastu', level: 'Intermediate', duration: '24 weeks', students: '412', img: '/Images/course-vedic_a01ee9d6.jpg', color: 'var(--si-violet)' },
            ].map((course, i) => (
              <div key={course.title} className={`reveal delay-${(i + 1) * 100} group overflow-hidden`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', cursor: 'pointer', transition: 'all 200ms ease' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.borderColor = 'rgba(249,115,22,0.3)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div className="overflow-hidden relative" style={{ aspectRatio: '3/2' }}>
                  <Image src={course.img} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {course.level}</span>
                    {course.duration}</span>
                  </div>
                </div>
                <div className="p-5">
                  Sanatan International · Gurukul</p>
                  {course.title}</h3>
                  {course.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      
                      {course.students} enrolled</p>
                    </div>
                    
                      Apply →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. COMMUNITY CIRCLES / EVENTS ══════════════════════════════════ */}
      <section className="section-warm py-20 texture-cream" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 reveal">
            <div>
              <LabelChip>{t('home.community.title')}</LabelChip>
              
                Upcoming gatherings
              </h2>
            </div>
            <Link href="/events" className="btn-outline flex-shrink-0">
              View All Events →
            </Link>
          </div>
          {/* Events grid — Coming Soon placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Gurukul Open House', date: 'Coming Soon', location: 'El Sabrante, CA', type: 'Education' },
              { title: 'Ayurveda Workshop', date: 'Coming Soon', location: 'Oakland, CA', type: 'Wellness' },
              { title: 'Community Satsang', date: 'Coming Soon', location: 'San Jose, CA', type: 'Community' },
              { title: 'Sanskrit Immersion', date: 'Coming Soon', location: 'Online', type: 'Language' },
            ].map((event, i) => (
              <div key={event.title} className={`reveal delay-${(i % 2 + 1) * 100} card-white p-6 flex items-center gap-5`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--si-orange-tint)' }}>
                  <span className="text-2xl">🗓</span>
                </div>
                <div>
                  {event.type}</span>
                  {event.title}</h3>
                  {event.date} · {event.location}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            
              Sacred gatherings, community events, and cultural programs are being thoughtfully planned. Stay tuned for upcoming dates and announcements.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ══════════════════════════════════════════════════════ */}
      <NewsletterSection />

    </Layout>
    {quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </>
  );
}
