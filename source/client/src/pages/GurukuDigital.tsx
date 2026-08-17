// Sanatan International — Digital Gurukul
// Live Zoom classes, weekly satsang, monthly cohorts, parent dashboard, ebooks, digital scriptures
// Satsang email capture with success animation
import { useState, useEffect, useRef } from 'react';
import SpiritualParticles from '@/components/SpiritualParticles';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from "@/components/Image";
import { submitForm } from '@/lib/formDelivery';
import { SCRIPTURE_COVERS } from '@/lib/scriptureCovers';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: `opacity 550ms ease ${delay}ms, transform 550ms cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}>{children}</div>;
}

// ─── Ebook Data (from provided PDFs) ─────────────────────────────────────────
const EBOOK_CATEGORIES = [
  {
    id: 'vedic',
    label: 'Core Vedic Corpus',
    color: 'var(--si-orange-ink)',
    books: [
      { id: '1.01', title: 'Rigveda', sanskrit: 'ऋग्वेद', priority: 'P0', notes: '10,552 hymns; oldest Veda', source: 'Griffith 1896 (PD)' },
      { id: '1.02', title: 'Samaveda', sanskrit: 'सामवेद', priority: 'P0', notes: 'Musical liturgy', source: 'Griffith 1893 (PD)' },
      { id: '1.03', title: 'Yajurveda (Krishna)', sanskrit: 'कृष्ण यजुर्वेद', priority: 'P0', notes: 'Sacrificial formulae', source: 'Griffith (PD)' },
      { id: '1.04', title: 'Atharvaveda', sanskrit: 'अथर्ववेद', priority: 'P0', notes: 'Healing, protection, daily life', source: 'Griffith 1895 (PD)' },
      { id: '1.05', title: 'Yoga Sutras of Patanjali', sanskrit: 'योग सूत्र', priority: 'P0', notes: '196 sutras; complete yoga science', source: 'Woods 1914 (PD)' },
      { id: '1.06', title: 'Bhagavad Gita', sanskrit: 'भगवद्गीता', priority: 'P0', notes: '18 chapters; standalone module', source: 'Arnold / Besant (PD)' },
      { id: '1.07', title: 'Brahma Sutras', sanskrit: 'ब्रह्म सूत्र', priority: 'P1', notes: 'Vedantic synthesis', source: 'Thibaut 1890 (PD)' },
      { id: '1.08', title: 'Arthashastra', sanskrit: 'अर्थशास्त्र', priority: 'P1', notes: 'Governance and economics', source: 'Shamasastry 1915 (PD)' },
    ],
  },
  {
    id: 'upanishads',
    label: 'Upanishads',
    color: 'var(--si-violet)',
    books: [
      { id: '2.01', title: 'Isha Upanishad', sanskrit: 'ईश उपनिषद्', priority: 'P0', notes: '18 verses; unity of existence', source: 'Müller SBE (PD)' },
      { id: '2.02', title: 'Kena Upanishad', sanskrit: 'केन उपनिषद्', priority: 'P0', notes: 'Nature of Brahman', source: 'Müller SBE (PD)' },
      { id: '2.03', title: 'Katha Upanishad', sanskrit: 'कठ उपनिषद्', priority: 'P0', notes: 'Nachiketa and Yama; death and liberation', source: 'Müller SBE (PD)' },
      { id: '2.04', title: 'Mundaka Upanishad', sanskrit: 'मुण्डक उपनिषद्', priority: 'P0', notes: 'Higher vs lower knowledge', source: 'Müller SBE (PD)' },
      { id: '2.05', title: 'Mandukya Upanishad', sanskrit: 'माण्डूक्य उपनिषद्', priority: 'P0', notes: '12 verses; states of consciousness', source: 'Müller SBE (PD)' },
      { id: '2.06', title: 'Chandogya Upanishad', sanskrit: 'छान्दोग्य उपनिषद्', priority: 'P0', notes: 'Tat tvam asi; Samaveda', source: 'Müller SBE (PD)' },
      { id: '2.07', title: 'Brihadaranyaka Upanishad', sanskrit: 'बृहदारण्यक उपनिषद्', priority: 'P0', notes: 'Largest; Yajnavalkya dialogues', source: 'Müller SBE (PD)' },
      { id: '2.08', title: 'Taittiriya Upanishad', sanskrit: 'तैत्तिरीय उपनिषद्', priority: 'P0', notes: 'Panchakosha model', source: 'Müller SBE (PD)' },
    ],
  },
  {
    id: 'itihasa',
    label: 'Itihasa & Purāṇa',
    color: 'var(--si-success)',
    books: [
      { id: '3.01', title: 'Ramayana (Valmiki)', sanskrit: 'रामायण', priority: 'P0', notes: '24,000 verses; 7 kandas', source: 'Griffith 1870–74 (PD)' },
      { id: '3.02', title: 'Mahabharata (Vyasa)', sanskrit: 'महाभारत', priority: 'P0', notes: '100,000 verses; includes Gita', source: 'Ganguli 1883–96 (PD)' },
      { id: '3.03', title: 'Bhagavata Purana', sanskrit: 'भागवत पुराण', priority: 'P0', notes: 'Krishna devotion; 12 cantos', source: 'Sanyal 1929 (PD)' },
      { id: '3.04', title: 'Vishnu Purana', sanskrit: 'विष्णु पुराण', priority: 'P0', notes: 'Cosmology + Vishnu narratives', source: 'Wilson 1840 (PD)' },
      { id: '3.05', title: 'Shiva Purana', sanskrit: 'शिव पुराण', priority: 'P0', notes: 'Shaiva — comprehensive', source: 'Shastri 1949 (PD)' },
      { id: '3.06', title: 'Devi Mahatmyam', sanskrit: 'देवीमाहात्म्यम्', priority: 'P0', notes: '700 verses to the Goddess', source: 'Tagare/PD' },
      { id: '3.07', title: 'Yoga Vasistha', sanskrit: 'योगवासिष्ठ', priority: 'P1', notes: 'Philosophy in story; Vasistha-Rama', source: 'Vihari-Lala Mitra (PD)' },
      { id: '3.08', title: 'Garuda Purana', sanskrit: 'गरुड पुराण', priority: 'P1', notes: 'Death, afterlife, karma', source: 'Wood/Subramanyam (PD)' },
    ],
  },
];


// ─── Book excerpts (sample content for preview modal) ────────────────────────
const BOOK_EXCERPTS: Record<string, { excerpt: string; pages: string; access: string }> = {
  '1.01': { pages: '~1,200 pages', access: 'Free (Public Domain)', excerpt: 'Agnim īḷe purohitaṃ yajñasya devam ṛtvijam — I praise Agni, the household priest, the divine minister of the sacrifice, the invoker, greatest bestower of treasure. (Rigveda 1.1.1)\n\nThe Rigveda is the oldest of the four Vedas and one of the oldest known religious texts in the world. It contains 10,552 hymns organised into 10 mandalas, composed in Vedic Sanskrit between 1500–1200 BCE. The hymns are dedicated to the Rigvedic deities — Agni (fire), Indra (thunder), Varuna (cosmic order), Soma (ritual drink), and many others.\n\nThe Nasadiya Sukta (10.129) is one of the earliest known attempts to describe the origin of the universe, asking questions that modern cosmology is still grappling with.' },
  '1.02': { pages: '~400 pages', access: 'Free (Public Domain)', excerpt: 'The Samaveda (Veda of Melodies) is the second of the four Vedas. It consists of 1,875 verses, almost all drawn from the Rigveda — but set to musical notation for ritual chanting.\n\nThe Samaveda is the foundation of Indian classical music. The seven svaras (musical notes) — Sa, Re, Ga, Ma, Pa, Dha, Ni — are said to derive from the Samaveda tradition.\n\nFor Gurukul students, the Samaveda is studied alongside basic music theory to understand how the Vedic tradition integrated sound, breath, and consciousness.' },
  '1.05': { pages: '~180 pages', access: 'Free (Public Domain)', excerpt: 'Yogaś citta-vṛtti-nirodhaḥ — Yoga is the cessation of the modifications of the mind. (Yoga Sutras 1.2)\n\nTadā draṣṭuḥ svarūpe avasthānam — Then the seer abides in its own nature. (Yoga Sutras 1.3)\n\nThe Yoga Sutras of Patanjali is the foundational text of classical yoga philosophy. It consists of 196 aphorisms organised into four chapters and introduces the eight-limbed path (Ashtanga Yoga): Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, and Samadhi.' },
  '1.06': { pages: '~200 pages', access: 'Free (Public Domain)', excerpt: 'Nainaṃ chindanti śastrāṇi nainaṃ dahati pāvakaḥ — The soul cannot be cut by weapons, nor burned by fire. (Bhagavad Gita 2.23)\n\nYogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya — Established in yoga, perform actions, abandoning attachment, O Arjuna. (Bhagavad Gita 2.48)\n\nThe Bhagavad Gita is a 700-verse dialogue between Prince Arjuna and Krishna on the battlefield of Kurukshetra. It addresses the nature of the self, the purpose of action, and the paths of knowledge, devotion, and action.' },
  '2.01': { pages: '~40 pages', access: 'Free (Public Domain)', excerpt: 'Īśāvāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat — All this, whatever exists in this moving world, is pervaded by the Lord. (Isha Upanishad 1)\n\nThe Isha Upanishad is just 18 verses yet one of the most profound philosophical texts in the Vedic tradition. It reconciles action (karma) with renunciation (sannyasa), teaching that one can enjoy the world without attachment by recognising the divine presence in all things.' },
  '2.03': { pages: '~80 pages', access: 'Free (Public Domain)', excerpt: 'Uttiṣṭhata jāgrata prāpya varān nibodhata — Arise, awake, and learn by approaching the excellent ones. (Katha Upanishad 1.3.14)\n\nThe Katha Upanishad tells the story of Nachiketa, a young boy who travels to the realm of Yama (Death) and asks the ultimate question: "What happens after death?" The dialogue is one of the most celebrated philosophical conversations in world literature.' },
  '2.05': { pages: '~60 pages', access: 'Free (Public Domain)', excerpt: 'Oṃ ity etad akṣaram idaṃ sarvaṃ — Om — this syllable is all this. (Mandukya Upanishad 1)\n\nThe Mandukya Upanishad is just 12 verses yet Adi Shankaracharya declared it sufficient for liberation. It maps the sacred syllable Om to four states of consciousness: Jagrat (waking), Svapna (dreaming), Sushupti (deep sleep), and Turiya (pure awareness).' },
  '2.06': { pages: '~300 pages', access: 'Free (Public Domain)', excerpt: 'Tat tvam asi — That thou art. (Chandogya Upanishad 6.8.7)\n\nThis three-word phrase is one of the four Mahavakyas (great sayings) of the Upanishads. The Chandogya Upanishad contains the famous dialogue between Uddalaka Aruni and his son Shvetaketu, explaining the nature of Brahman through nine analogies including the salt-in-water metaphor.' },
  '2.07': { pages: '~500 pages', access: 'Free (Public Domain)', excerpt: 'Aham brahmāsmi — I am Brahman. (Brihadaranyaka Upanishad 1.4.10)\n\nThe Brihadaranyaka Upanishad is the largest of all the Upanishads (c. 700 BCE). It contains the celebrated dialogues of the sage Yajnavalkya and introduces Neti, neti (not this, not this) — the method of negation used to approach the ineffable nature of Brahman.' },
  '2.08': { pages: '~120 pages', access: 'Free (Public Domain)', excerpt: 'Satyaṃ jñānam anantaṃ brahma — Brahman is truth, knowledge, and infinite. (Taittiriya Upanishad 2.1.1)\n\nThe Taittiriya Upanishad introduces the Panchakosha model — the five sheaths of the human being: Annamaya (physical), Pranamaya (energy), Manomaya (mental), Vijnanamaya (wisdom), and Anandamaya (bliss). This is the foundation of Āyurvedic and yogic understanding of the human being.' },
  '3.01': { pages: '~1,800 pages', access: 'Free (Public Domain)', excerpt: 'The Ramayana of Valmiki is one of the two great epics of ancient India, comprising 24,000 verses in seven kandas (books). It tells the story of Prince Rama, his wife Sita, and his devoted companion Hanuman.\n\nThe Ramayana is not merely a story — it is a complete manual of dharmic living. Rama embodies Raj Dharma (the ethics of kingship), Sita embodies steadfast devotion, and Hanuman embodies selfless service (seva). Every character is a study in how to live with integrity under pressure.' },
  '3.02': { pages: '~5,000 pages', access: 'Free (Public Domain)', excerpt: 'Dharmo rakṣati rakṣitaḥ — Dharma protects those who protect it. (Mahabharata)\n\nThe Mahabharata is the longest epic poem ever written — 100,000 verses, eight times the length of the Iliad and Odyssey combined. It tells the story of the Kurukshetra War between the Pandavas and Kauravas, but its scope encompasses the entire spectrum of human experience.\n\nThe Bhagavad Gita is embedded in Book 6 of the Mahabharata. The epic also contains the Shanti Parva (Book of Peace) — a comprehensive treatise on governance, ethics, and philosophy.' },
  '3.03': { pages: '~2,000 pages', access: 'Free (Public Domain)', excerpt: 'Dharmasya tattvaṃ nihitaṃ guhāyāṃ — The essence of dharma is hidden in the cave of the heart.\n\nThe Bhagavata Purana is the most beloved of the eighteen major Puranas, dedicated to the life and teachings of Krishna. It consists of 12 cantos (books) and 18,000 verses.\n\nThe 10th Canto — the life of Krishna — is the most celebrated section and has inspired countless works of art, poetry, music, and dance across South Asia. The text is the foundation of the Bhakti (devotion) movement that transformed Indian spirituality between the 7th and 17th centuries.' },
};

// ─── Book Preview Modal ───────────────────────────────────────────────────────
function BookPreviewModal({ book, catColor, onClose }: {
  book: { id: string; title: string; sanskrit: string; priority: string; notes: string; source: string };
  catColor: string;
  onClose: () => void;
}) {
  const info = BOOK_EXCERPTS[book.id] || { excerpt: 'Full excerpt available to enrolled students. Join the Gurukul for complete access to all 100+ texts in the Digital Library.', pages: 'Varies', access: 'Enrolled students' };
  
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', animation: 'fadeIn 200ms ease' }} />
      {/* Modal */}
      <div style={{ position: 'relative', background: 'var(--si-card)', borderRadius: '24px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'successReveal 300ms cubic-bezier(0.23,1,0.32,1)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--si-surface-alt)', flexShrink: 0 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-devanagari text-3xl mb-1" style={{ color: catColor }}>{book.sanskrit}</p>
              {book.title}</h3>
              Source: {book.source} · {info.pages}</p>
            </div>
            <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--si-border)', background: 'var(--si-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--si-surface)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {book.priority} — {book.priority === 'P0' ? 'Essential' : book.priority === 'P1' ? 'High Priority' : 'Standard'}</span>
            {info.access}</span>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
          About This Text</p>
          {book.notes}</p>
          Excerpt & Overview</p>
          <div style={{ background: 'var(--si-surface)', borderRadius: '14px', padding: '20px', borderLeft: `3px solid ${catColor}` }}>
            {info.excerpt.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: para.includes('—') && i === 0 ? 'var(--si-text)' : 'var(--si-text-strong)', fontFamily: i === 0 && para.includes('—') ? 'Cormorant Garamond, serif' : 'Inter, sans-serif', fontStyle: i === 0 && para.includes('—') ? 'italic' : 'normal', fontSize: i === 0 && para.includes('—') ? '1rem' : '0.875rem' }}>{para}</p>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: '1px solid var(--si-surface-alt)', flexShrink: 0 }}>
          {/* Social sharing row */}
          <div style={{ marginBottom: '12px' }}>
            Share this excerpt</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'X / Twitter', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, bg: '#000', href: (t: string, u: string) => `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
                { label: 'Facebook', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, bg: '#1877F2', href: (t: string, u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
                { label: 'LinkedIn', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, bg: '#0A66C2', href: (t: string, u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}&summary=${t}` },
                { label: 'WhatsApp', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>, bg: '#25D366', href: (t: string, u: string) => `https://wa.me/?text=${t}%20${u}` },
              ].map((s) => {
                const shareUrl = encodeURIComponent(`https://www.sanataninternational.org/gurukul/digital`);
                const shareText = encodeURIComponent(`"${book.title}" (${book.sanskrit}) — Ancient Vedic wisdom from Sanatan International's Digital Library`);
                return (
                  
                    <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{s.icon}</span>
                  </a>
                );
              })}
            </div>
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            
              Enroll for Full Access →
            </a>
            
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRIORITY_COLORS: Record<string, string> = {
  P0: '#DC2626',
  P1: '#F97316',
  P2: 'var(--si-text-muted)',
};

// ─── Cohort Countdown Timer ───────────────────────────────────────────────────
function CohortCountdown() {
  const getNextCohortDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 3, 30, 0);
  };
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [cohortDate, setCohortDate] = useState('');
  const [calOpen, setCalOpen] = useState(false);
  const [calAdded, setCalAdded] = useState(false);

  const buildGoogleCalUrl = () => {
    const target = getNextCohortDate();
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(target.getTime() + 3600000); // 1 hour event
    const title = encodeURIComponent('Sanatan International — Gurukul Cohort Begins');
    const details = encodeURIComponent('Your Gurukul cohort starts today! Join at https://www.sanataninternational.org/gurukul/join\n\nStream options: Sanskrit · Yoga · Vedic Science\nFor ages 9–16 and adults (L1–L6).');
    const loc = encodeURIComponent('Online (Zoom link sent on enrollment)');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(target)}/${fmt(end)}&details=${details}&location=${loc}`;
  };

  const buildICSContent = () => {
    const target = getNextCohortDate();
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(target.getTime() + 3600000);
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sanatan International//Gurukul//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(target)}`, `DTEND:${fmt(end)}`,
      'SUMMARY:Sanatan International — Gurukul Cohort Begins',
      'DESCRIPTION:Your Gurukul cohort starts today! Enroll at https://www.sanataninternational.org/gurukul/join',
      'LOCATION:Online (Zoom link sent on enrollment)',
      'BEGIN:VALARM', 'TRIGGER:-PT1D', 'ACTION:DISPLAY', 'DESCRIPTION:Gurukul cohort starts tomorrow!', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
  };

  const downloadICS = () => {
    const blob = new Blob([buildICSContent()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'gurukul-cohort.ics'; a.click();
    URL.revokeObjectURL(url);
    setCalAdded(true); setCalOpen(false);
    setTimeout(() => setCalAdded(false), 3000);
  };

  useEffect(() => {
    const target = getNextCohortDate();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    setCohortDate(`${months[target.getMonth()]} 1, ${target.getFullYear()}`);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
    <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '14px', padding: '14px 18px', display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--si-orange)', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
        Next Cohort · {cohortDate}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[{ label: 'Days', value: timeLeft.days }, { label: 'Hrs', value: timeLeft.hours }, { label: 'Min', value: timeLeft.minutes }, { label: 'Sec', value: timeLeft.seconds }].map((unit, i) => (
          <div key={unit.label} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <div style={{ textAlign: 'center', minWidth: '32px' }}>
              {pad(unit.value)}</p>
              {unit.label.toUpperCase()}</p>
            </div>
            {i < 3 && <span style={{ color: 'rgba(249,115,22,0.85)', fontWeight: 700, fontSize: '1rem', marginBottom: '8px', marginLeft: '4px', marginRight: '4px' }}>:</span>}
          </div>
        ))}
      </div>
    </div>

    {/* "Add to Calendar" button + dropdown */}
    <div style={{ position: 'relative' }}>
      
        {calAdded ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Added!</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="15" x2="12" y2="19"/><line x1="10" y1="17" x2="14" y2="17"/></svg>"Add to Calendar"</>
        )}
      </button>
      {calOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'var(--si-card)', borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', padding: '8px', minWidth: '200px', zIndex: 100, animation: 'fadeIn 150ms ease' }}>
          
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" fill="#4285F4"/><rect x="3" y="4" width="18" height="5" fill="#EA4335"/><circle cx="8" cy="2" r="1.5" fill="#34A853"/><circle cx="16" cy="2" r="1.5" fill="#34A853"/><line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="1"/></svg>
            Google Calendar
          </a>
          
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
    </div>
  );
}

// ─── Satsang Capture Component ───────────────────────────────────────────────
function SatsangCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setState('loading');
    void submitForm({
      formName: 'Digital Gurukul signup',
      inbox: 'gurukul',
      data: { email },
    }).then((r: { ok: boolean }) => setState(r.ok ? 'success' : 'error'));
  };

  return (
    <section className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-ink) 0%, #2D1A0A 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Hero background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/Images/hero-bg_8f4e2a1b.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.35,
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(180deg, rgba(15,15,20,0.6) 0%, rgba(15,15,20,0.85) 100%)' }} />
        <SpiritualParticles />
      {/* Decorative radial glow */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Subtle dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div className="container py-20 max-w-3xl relative z-10">
        <Reveal>
          {state === 'success' ? (
            <div className="text-center" style={{ animation: 'successReveal 400ms cubic-bezier(0.23,1,0.32,1)' }}>
              {/* Animated success ring */}
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(249,115,22,0.3)', animation: 'fabPulse 2s ease-out infinite' }} />
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(249,115,22,0.15)', border: '2px solid var(--si-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              🙏 धन्यवाद</p>
              You're on the list!</h3>
              
                You'll receive a reminder before every free satsang — every Sunday at 6:00 PM IST. <br />No spam. Unsubscribe anytime.
              </p>
            </div>
          ) : (
            <div className="text-center">
              {/* Flame icon */}
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              </div>
              Free · Every Week · Open to All</p>
              
                Join the Free Weekly Satsang
              </h2>
              
                Every Sunday, Swami Dharmananda leads a free public satsang — a spiritual gathering open to anyone, anywhere in the world. No enrollment. No cost. Just community and wisdom.
              </p>
              <p className="font-devanagari text-xl mb-8" style={{ color: 'rgba(249,115,22,0.6)' }}>"सत्संगत्वे निस्संगत्वम्"</p>

              <form onSubmit={handleSubmit} style={{ maxWidth: '480px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div style={{ flex: '1 1 260px', position: 'relative' }}>
                    
                  </div>
                  
                    {state === 'loading' ? (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Joining…</>
                    ) : 'Reserve My Seat →'}
                  </button>
                </div>
                {error && (
                  {error}</p>
                )}
                
                  Every Sunday · 6:00 PM IST · Free forever · Unsubscribe anytime
                </p>
              </form>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}


// ─── App Waitlist Form ────────────────────────────────────────────────────────
function AppWaitlistForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setState('loading');
    void submitForm({
      formName: 'Digital Gurukul newsletter',
      inbox: 'gurukul',
      data: { email },
    }).then((r: { ok: boolean }) => setState(r.ok ? 'success' : 'error'));
  };

  if (state === 'success') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      ✓ You're on the waitlist! We'll notify you at launch.</span>
      <button onClick={() => setDismissed(true)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.62)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      
      
        {state === 'loading' ? 'Joining…' : 'Join Waitlist'}
      </button>
      <button type="button" onClick={() => setDismissed(true)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.62)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}>×</button>
    </form>
  );
}

export default function GurukuDigital() {
  const { t, lang } = useLanguage();
  const [activeEbookCat, setActiveEbookCat] = useState('vedic');
  const [activeSection, setActiveSection] = useState<'app' | 'ebooks'>('app');
  const [activePriorityFilter, setActivePriorityFilter] = useState<string>('all');
  const [previewBook, setPreviewBook] = useState<{ id: string; title: string; sanskrit: string; priority: string; notes: string; source: string } | null>(null);
  const cat = EBOOK_CATEGORIES.find(c => c.id === activeEbookCat)!;
  const filteredBooks = activePriorityFilter === 'all' ? cat.books : cat.books.filter(b => b.priority === activePriorityFilter);

  return (
    <Layout>
      <PageMeta
        title="Digital Gurukul — Live Classes, Parent Dashboard & Digital Library"
        description="The Digital Gurukul app: daily 20-minute live Zoom classes, weekly free satsang, monthly cohorts for ages 9–16, parent dashboard, and a complete digital library of Vedic texts, Upanishads, and scriptures."
        url="/gurukul/digital"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul/foundation' }, { name: 'Digital Gurukul', href: '/gurukul/digital' }]} />

      {/* ── Hero ── */}
      <section className="section-dark pt-32 pb-24 relative overflow-hidden texture-dark">
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/digital-gurukul-class_2bc742df.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.8) 100%)' }} />
        <div style={{ position: 'absolute', left: '-60px', bottom: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
        <div className="container max-w-5xl relative z-10">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="label-chip">{t('nav.gurukul.digital')}</span>
                  App Coming Soon</span>
                </div>
                
                  Ancient wisdom.<br />
                  <span className="text-si-orange-ink">{t('dg.title2')}</span>
                </h1>
                
                  Not a chatbot. Not pre-recorded content. A real credentialed teacher, live on Zoom, every day — 20 minutes that can change a child's life.
                </p>
                <CohortCountdown />

                <div className="flex flex-wrap gap-3">
                  <Link href="/gurukul/join">
                    
                      Join Next Cohort →
                    </button>
                  </Link>
                  
                    Browse Digital Library
                  </a>
                </div>
              </div>

              {/* App preview card */}
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '28px', backdropFilter: 'blur(10px)' }}>
                Today's Schedule</p>
                {[
                  { time: '7:00 AM', title: 'Morning Shloka & Pranayama', teacher: 'Acharya Ramesh', stream: 'Sanskrit', live: true },
                  { time: '4:00 PM', title: 'Yoga Science — Sun Salutation Series', teacher: 'Dr. Meera Iyer', stream: 'Yoga', live: false },
                  { time: '6:00 PM', title: 'Weekly Satsang — Open to All', teacher: 'Swami Dharmananda', stream: 'Free', live: false },
                ].map((cls) => (
                  <div key={cls.time} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '52px' }}>
                      {cls.time}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      {cls.title}</p>
                      {cls.teacher}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cls.stream}</span>
                      {cls.live && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-danger)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />LIVE</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ── Impact Infographic Strip ── */}
      <section className="on-dark" style={{ background: 'var(--si-hero-mid)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container py-10 max-w-6xl">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0', textAlign: 'center' }}>
            {[
              { n: '200+', l: 'Active Students', icon: '🎓', sub: 'Bay Area & beyond' },
              { n: '20 min', l: 'Daily Class', icon: '⏱️', sub: 'Live, not recorded' },
              { n: '5', l: 'Core Subjects', icon: '📚', sub: 'Sanskrit to Yoga' },
              { n: '40+', l: 'Volunteer Teachers', icon: '🙏', sub: 'Credentialed faculty' },
              { n: '3', l: 'Bay Area Regions', icon: '📍', sub: 'San Jose · Oakland · Fremont' },
              { n: '100%', l: 'Free to Join', icon: '💛', sub: 'Donation-supported' },
            ].map(({ n, l, icon, sub }) => (
              <div key={l} style={{ padding: '20px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{icon}</div>
                {n}</p>
                {l}</p>
                {sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How the Digital Gurukul Works — Visual Infographic ── */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">How It Works</p>
              From enrolment to fluency</h2>
              
                A structured 3-year journey from foundational awareness to independent practice.
              </p>
            </div>
          </Reveal>
          {/* Step-by-step flow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { step: '01', title: 'Enrol & Assessment', desc: 'Complete a 10-minute placement assessment. Our teachers identify your child\'s level across Sanskrit, Yoga, and Vedic knowledge. No prior knowledge required.', img: '/Images/impact-student_01c13a3f.jpg', color: 'var(--si-orange-ink)' },
              { step: '02', title: 'Daily 20-Minute Live Class', desc: 'Every weekday morning, your child joins a live Zoom class with a credentialed teacher. Classes are small (max 8 students), interactive, and structured around the Gurukul curriculum.', img: '/Images/digital-gurukul-class_2bc742df.jpg', color: 'var(--si-success)' },
              { step: '03', title: 'Weekly Practice & Review', desc: 'Weekend sessions include shloka recitation practice, Yoga asana, and a parent-child reflection activity. Progress is tracked and shared with parents monthly.', img: '/Images/event-yoga_cf18d319.jpg', color: 'var(--si-violet)' },
              { step: '04', title: 'Community & Celebration', desc: 'Monthly satsangs, quarterly performances, and annual Gurukul celebrations. Your child is part of a living community, not just an online class.', img: '/Images/event-satsang_86ddb9ec.jpg', color: 'var(--si-amber)' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '0', marginBottom: '2px', background: 'var(--si-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  {i % 2 === 0 ? (
                    <>
                      <div style={{ padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '3rem', color: s.color, lineHeight: 1, opacity: 0.3 }}>{s.step}</span>
                          <div style={{ width: '2px', height: '40px', background: s.color, opacity: 0.4 }} />
                          {s.title}</h3>
                        </div>
                        {s.desc}</p>
                      </div>
                      <div style={{ height: '280px', overflow: 'hidden' }}>
                        <Image src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ height: '280px', overflow: 'hidden' }}>
                        <Image src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '3rem', color: s.color, lineHeight: 1, opacity: 0.3 }}>{s.step}</span>
                          <div style={{ width: '2px', height: '40px', background: s.color, opacity: 0.4 }} />
                          {s.title}</h3>
                        </div>
                        {s.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Infographic Strip ── */}
      <section className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-ink) 0%, #2D1A0A 100%)', padding: '56px 0' }}>
        <div className="container">
          Our Impact in Numbers</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            {[
              { n: '200+', label: 'Students Enrolled', icon: '🎓' },
              { n: '40+', label: 'Volunteer Teachers', icon: '🙏' },
              { n: '3', label: 'Bay Area Locations', icon: '📍' },
              { n: '12', label: 'Subjects Taught', icon: '📚' },
              { n: '95%', label: 'Parent Satisfaction', icon: '⭐' },
              { n: '33ac', label: 'Campus Vision', icon: '🌿' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px 16px', textAlign: 'center', border: '1px solid rgba(249,115,22,0.2)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{s.icon}</div>
                {s.n}</p>
                {s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Visual Journey ── */}
      <section style={{ background: 'var(--si-surface)', padding: '72px 0' }}>
        <div className="container">
          A Child&apos;s Journey Through the Digital Gurukul</p>
          Four transformative stages — from first login to Vedic fluency</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              { step: '01', title: 'Explore & Discover', desc: 'Interactive Sanskrit games, yoga videos, and story-based introductions. No pressure — pure joy of learning.', img: '/Images/digital-gurukul-class_2bc742df.jpg', reverse: false },
              { step: '02', title: 'Learn & Practice', desc: 'Structured weekly live classes with certified Acharyas. Sanskrit, Vedic mathematics, yoga, and Ayurveda basics.', img: '/Images/impact-student_01c13a3f.jpg', reverse: true },
              { step: '03', title: 'Connect & Belong', desc: 'Monthly satsangs, peer study groups, and community events build friendships and cultural identity.', img: '/Images/event-satsang_86ddb9ec.jpg', reverse: false },
              { step: '04', title: 'Teach & Lead', desc: 'Advanced students become junior teachers — deepening their own knowledge by sharing it with younger children.', img: '/Images/volunteer-teaching_c04783f9.jpg', reverse: true },
            ].map((item) => (
              <div key={item.step} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                {item.reverse && <div style={{ borderRadius: '18px', overflow: 'hidden', height: '280px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}><Image src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                <div>
                  Step {item.step}</span>
                  {item.title}</p>
                  {item.desc}</p>
                </div>
                {!item.reverse && <div style={{ borderRadius: '18px', overflow: 'hidden', height: '280px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}><Image src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Section nav ── */}
      <div style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)', position: 'sticky', top: '72px', zIndex: 40 }}>
        <div className="container">
          <div className="flex gap-0">
            {[{ id: 'app', label: 'The App' }, { id: 'ebooks', label: 'Digital Library' }].map((s) => (
              
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── App Features ── */}
      {activeSection === 'app' && (
        <>
          {/* Core features */}
          <section style={{ background: 'var(--si-card)' }}>
            <div className="container py-20 max-w-5xl">
              <Reveal>
                <div className="text-center mb-12">
                  <p className="label-chip mb-3">How It Works</p>
                  
                    Four pillars of the<br /><span className="text-si-orange-ink">Digital Gurukul.</span>
                  </h2>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Image src="/Images/icon-gurukul-teacher_690a9246.png" alt="live classes" style={{width:'28px',height:'28px',objectFit:'contain'}} />,
                    title: 'Daily 20-Minute Live Class',
                    subtitle: 'On Zoom + Recording',
                    desc: 'Every day, a credentialed teacher — not a chatbot, not pre-recorded content — delivers a live 20-minute class. Every session is recorded, captioned, and indexed for enrolled students to access forever. Practice loop: daily 15-min asynchronous practice with parent-supervised check-in.',
                    color: 'var(--si-orange-ink)',
                  },
                  {
                    icon: <Image src="/Images/icon-om_a07c1c41.png" alt="satsang" style={{width:'28px',height:'28px',objectFit:'contain'}} />,
                    title: 'Weekly Satsang',
                    subtitle: 'Free · Public · Top-of-Funnel',
                    desc: 'Every week, a free public satsang open to anyone. A spiritual gathering, a community conversation, a doorway into the Gurukul. No enrollment required. This is our gift to the world — and the most powerful introduction to what we do.',
                    color: 'var(--si-success)',
                  },
                  {
                    icon: <Image src="/Images/icon-ayurveda-mortar_16433074.png" alt="cohorts" style={{width:'28px',height:'28px',objectFit:'contain'}} />,
                    title: 'Monthly Cohort Drops',
                    subtitle: 'Ages 9–16 · Three Streams',
                    desc: 'New cohorts open every month for kids aged 9–16 across three streams: Sanskrit, Yoga, and Vedic Science. Small cohorts (max 20 students) ensure every child gets teacher attention. Each cohort runs for 12 weeks with a clear start, end, and certificate.',
                    color: 'var(--si-violet)',
                  },
                  {
                    icon: <Image src="/Images/icon-tech-lotus_d69ab604.png" alt="dashboard" style={{width:'28px',height:'28px',objectFit:'contain'}} />,
                    title: 'Parent Dashboard',
                    subtitle: 'Full Visibility · Weekly Updates',
                    desc: "Parents see everything: child's attendance, progress scores, teacher comments, and a weekly video update from the class teacher. No surprises. Full transparency. The parent is a partner in the child's education, not a bystander.",
                    color: 'var(--si-info)',
                  },
                ].map((f, i) => (
                  <Reveal key={f.title} delay={i * 80}>
                    <div style={{ background: 'var(--si-surface)', borderRadius: '20px', padding: '28px', borderLeft: `4px solid ${f.color}`, height: '100%' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: f.color + '15', color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', transition: 'transform 280ms cubic-bezier(0.23,1,0.32,1), box-shadow 280ms ease' }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1.18) rotate(-6deg)'; el.style.boxShadow = `0 8px 20px ${f.color}50`; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1) rotate(0deg)'; el.style.boxShadow = 'none'; }}>
                        <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{f.icon}</span>
                      </div>
                      {f.title}</p>
                      {f.subtitle}</p>
                      {f.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <SatsangCapture />

          {/* Three streams */}
          <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
            <div className="container py-20 max-w-5xl">
              <Reveal>
                <div className="text-center mb-12">
                  Monthly Cohorts · Ages 9–16</p>
                  
                    Three streams.<br /><span className="text-si-orange-ink">One complete education.</span>
                  </h2>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    stream: 'Sanskrit',
                    devanagari: 'संस्कृत',
                    color: 'var(--si-orange-ink)',
                    desc: 'The language of the gods — and of precision. Students learn Devanagari script, basic grammar, mantra chanting, and translation. By the end of 12 weeks, a student can read and chant 10 shlokas with full meaning.',
                    weeks: [
                      'Weeks 1–4: Devanagari aksharas + 5 mantras',
                      'Weeks 5–8: Basic grammar + Gita verse analysis',
                      'Weeks 9–12: Translation project + recitation',
                    ],
                    cert: 'Sanskrit Sprouts Certificate',
                  },
                  {
                    stream: 'Yoga',
                    devanagari: 'योग',
                    color: 'var(--si-success)',
                    desc: 'Not fitness. The complete science of body, breath, and mind. Students learn asana sequences, pranayama, yoga philosophy, and the Yoga Sutras. By the end, they have a daily practice they can maintain independently.',
                    weeks: [
                      'Weeks 1–4: Foundational asanas + breath awareness',
                      'Weeks 5–8: Pranayama + Yoga Sutras intro',
                      'Weeks 9–12: Full 30-min personal practice design',
                    ],
                    cert: 'Junior Yoga Practitioner Certificate',
                  },
                  {
                    stream: 'Vedic Science',
                    devanagari: 'वैदिक विज्ञान',
                    color: 'var(--si-violet)',
                    desc: 'Astronomy, mathematics, ecology, and architecture — through the lens of Vedic knowledge. Students discover that modern science and ancient wisdom are not opposites. They are the same inquiry, separated by time.',
                    weeks: [
                      'Weeks 1–4: Vedic astronomy + zero and infinity',
                      'Weeks 5–8: Sacred geometry + Vastu principles',
                      'Weeks 9–12: Ecology project + presentation',
                    ],
                    cert: 'Vedic Science Explorer Certificate',
                  },
                ].map((s, i) => (
                  <Reveal key={s.stream} delay={i * 80}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', height: '100%' }}>
                      <p className="font-devanagari text-3xl mb-2" style={{ color: s.color }}>{s.devanagari}</p>
                      {s.stream}</p>
                      {s.desc}</p>
                      <div className="space-y-2 mb-5">
                        {s.weeks.map((w) => (
                          <div key={w} className="flex items-start gap-2">
                            <span style={{ color: s.color, flexShrink: 0, marginTop: '2px' }}>›</span>
                            {w}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: s.color + '15', border: `1px solid ${s.color}30`, borderRadius: '10px', padding: '10px 14px' }}>
                        🎓 {s.cert}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Parent dashboard preview */}
          <section style={{ background: 'var(--si-surface)' }}>
            <div className="container py-20 max-w-5xl">
              <Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="label-chip mb-3">Parent Dashboard</p>
                    
                      You are a partner,<br /><span className="text-si-orange-ink">not a bystander.</span>
                    </h2>
                    
                      The parent dashboard gives you complete visibility into your child's Gurukul journey — attendance, progress, teacher feedback, and a weekly video update. No surprises. Full transparency.
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: 'Attendance tracking', desc: 'See every class attended, missed, and made up' },
                        { label: 'Progress scores', desc: 'Competency-based milestones, not grades' },
                        { label: 'Teacher comments', desc: 'Weekly written notes from your child\'s teacher' },
                        { label: 'Weekly video update', desc: 'A 2-minute video from the teacher every Friday' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3" style={{ background: 'var(--si-card)', borderRadius: '12px', padding: '14px 16px' }}>
                          ✓</span>
                          <div>
                            {item.label}</p>
                            {item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock dashboard */}
                  <div className="card-white p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        Arjun Sharma</p>
                        Sanskrit Stream · Cohort 7</p>
                      </div>
                      Active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[{ label: 'Attendance', value: '94%', color: 'var(--si-success)' }, { label: 'Progress', value: '78%', color: 'var(--si-orange-ink)' }, { label: 'Week', value: '8/12', color: 'var(--si-info)' }].map((s) => (
                        <div key={s.label} style={{ background: 'var(--si-surface)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                          <p className="font-display font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
                          {s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'var(--si-orange-tint)', borderRadius: '10px', padding: '14px', borderLeft: '3px solid var(--si-orange)', marginBottom: '12px' }}>
                      Teacher Note · This Week</p>
                      "Arjun recited the Gayatri Mantra with perfect pronunciation today. Excellent focus. Recommend 5 min daily practice at home."</p>
                    </div>
                    
                      ▶ Watch Weekly Video Update
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {/* ── Digital Library / Ebooks ── */}
      {activeSection === 'ebooks' && (
        <section id="ebooks" style={{ background: 'var(--si-card)' }}>
          <div className="container py-20 max-w-6xl">
            <Reveal>
              <div className="text-center mb-10">
                <p className="label-chip mb-3">{t('dg.library.title')}</p>
                
                  Ebooks & Digital Scriptures
                </h2>
                
                  A curated, public-domain digital library of the most important Vedic texts, Upanishads, Itihasa, and Puranas — free for all enrolled students, and progressively available to the public.
                </p>
              </div>
            </Reveal>

            {/* Category tabs */}
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {EBOOK_CATEGORIES.map((c) => (
                  
                    {c.label}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Priority filter + legend */}
            <Reveal delay={120}>
              <div className="flex flex-wrap gap-2 mb-6 justify-center items-center">
                Filter:</span>
                {[{ p: 'all', label: 'All', color: 'var(--si-text-muted)' }, { p: 'P0', label: 'P0 — Essential', color: '#DC2626' }, { p: 'P1', label: 'P1 — High Priority', color: 'var(--si-orange-ink)' }].map((item) => (
                  
                    {item.label}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Book grid */}
            <div key={activeEbookCat + activePriorityFilter} style={{ animation: 'fadeIn 300ms ease' }}>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  No books match this filter in the current category.</p>
                  Clear filter →</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredBooks.map((book, i) => (
                    <Reveal key={book.id} delay={i * 50}>
                      <div style={{ background: 'var(--si-surface)', borderRadius: '16px', padding: '20px', border: '1.5px solid var(--si-border)', transition: 'all 200ms ease', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = cat.color; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 8px 24px ${cat.color}20`; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--si-border)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                        <div style={{ position: 'relative', marginBottom: '14px', borderRadius: '10px', overflow: 'hidden', aspectRatio: '2 / 3', background: cat.color + '10' }}>
                          <Image
                            src={SCRIPTURE_COVERS[book.id]}
                            alt={`Cover of ${book.title} (${book.sanskrit})`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                        <div className="flex items-start justify-between mb-3">
                          {book.priority}</span>
                          {book.id}</span>
                        </div>
                        <p className="font-devanagari text-xl mb-1" style={{ color: cat.color }}>{book.sanskrit}</p>
                        {book.title}</p>
                        {book.notes}</p>
                        Source: {book.source}</p>
                        
                          Preview Excerpt →
                        </button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Modal */}
            {previewBook && (
              <BookPreviewModal
                book={previewBook}
                catColor={cat.color}
                onClose={() => setPreviewBook(null)}
              />
            )}

            <Reveal delay={200}>
              <div className="mt-10 text-center">
                <div style={{ background: 'var(--si-surface)', borderRadius: '16px', padding: '24px', display: 'inline-block', maxWidth: '500px' }}>
                  Full Library: 100+ Texts</p>
                  
                    The complete digital library covers Core Vedic Corpus, 108 Upanishads, Itihasa & Purana, Dharmashastra, and Vedic Science texts — all public domain, professionally formatted, and indexed.
                  </p>
                  <Link href="/gurukul/join">
                    
                      Enroll for Full Access →
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <RelatedPages current="/gurukul/digital" picks={['/gurukul/programs', '/gurukul/join', '/gurukul/foundation']} />
    {/* Mobile App Waitlist Banner */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 50, background: 'linear-gradient(90deg, #1A0A00 0%, #2D1200 50%, #1A0A00 100%)', borderTop: '1px solid rgba(249,115,22,0.3)', padding: '0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--si-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div>
                
                  📱 Digital Gurukul App — Coming to iOS & Android
                </p>
                
                  Daily live classes, parent dashboard, digital library — in your pocket.
                </p>
              </div>
            </div>
            <AppWaitlistForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
// NOTE: This is a placeholder - the actual file was already complete above
// The patch will be applied via webdev_apply_patch
