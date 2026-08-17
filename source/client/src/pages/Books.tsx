// Books page — Sanatan International Digital Library
// Design: saffron, cream, charcoal editorial style — 3 tabs: Digital, Audio, Video
// Published by Sanatan International Press — unique covers per title, no author name on cover
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import { Link } from 'wouter';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Image from "@/components/Image";
import { submitForm } from '@/lib/formDelivery';

// ── Reveal animation helper ───────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(18px)', transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── SI Publisher Badge ────────────────────────────────────────────────────────
function SIBadge() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: 'rgba(249,115,22,0.12)', borderRadius: '4px', marginTop: '6px' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#F97316"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      Sanatan International Press</span>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const DIGITAL_BOOKS = [
  { id: 1, title: 'Vedanta in the Modern Age', author: 'Dr. Ananya Krishnamurthy', pages: 312, cover: '/Images/book-cover-vedanta-modern_0a3dd695.jpg', desc: 'A rigorous exploration of Advaita Vedanta philosophy and its direct applications to modern life — work, relationships, identity, and consciousness.', tags: ['Philosophy', 'Vedanta'], price: 'Free', badge: 'Featured', preview: 'Chapter 1: The Eternal Question\n\nWho am I? This is not a philosophical curiosity — it is the most practical question a human being can ask. The Vedantic tradition does not answer this question with a belief. It answers it with a method...' },
  { id: 2, title: 'The Gurukul Method', author: 'Pankaj Tyagi', pages: 248, cover: '/Images/book-cover-gurukul-method_3e046834.jpg', desc: 'Ancient education principles for modern children. How the Gurukul model develops character, wisdom, and capability that no standardised curriculum can replicate.', tags: ['Education', 'Parenting'], price: 'Free', badge: 'New', preview: 'Chapter 1: What the Gurukul Actually Was\n\nThe word Gurukul means the family of the Guru. Not a school. Not a classroom. A living arrangement in which knowledge was transmitted through relationship, not curriculum...' },
  { id: 3, title: 'Ayurveda Decoded', author: 'Dr. Vikram Nair', pages: 380, cover: '/Images/book-cover-ayurveda-decoded_96a23996.jpg', desc: 'The science of longevity — from the Tridosha framework to Rasayana herbs, panchakarma, and daily routines. Evidence-based and clinically grounded.', tags: ['Ayurveda', 'Health'], price: 'Free for Members', badge: 'Bestseller', memberOnly: true, preview: 'Chapter 1: The Intelligence of the Body\n\nAyurveda begins with a radical premise: the body is not a machine. It is a field of intelligence. Every cell, every tissue, every organ is not merely performing a function — it is participating in a conversation...' },
  { id: 4, title: 'Roots Across Oceans', author: 'Sanatan International Research Team', pages: 196, cover: '/Images/book-cover-diaspora-roots_90883a84.jpg', desc: 'A guide for the Indian diaspora — navigating cultural identity, raising children with roots, and building community in the West without losing who you are.', tags: ['Diaspora', 'Identity'], price: 'Free', badge: 'Popular', preview: 'Chapter 1: The Weight of Distance\n\nYou left India with two suitcases. You have spent the years since filling a third — invisible, heavier than the other two combined — with everything you could not bring...' },
  { id: 5, title: 'Dharma in the Digital Age', author: 'Pankaj Tyagi', pages: 164, cover: '/Images/book-cover-dharma-video_f76a134d.jpg', desc: 'How ancient Dharmic principles apply to technology, social media, and the attention economy. A practical guide for Indian families in the West.', tags: ['Dharma', 'Technology'], price: 'Free', badge: null, preview: 'Chapter 1: The Attention Economy and the Dharmic Self\n\nYour attention is the most valuable thing you own. Every app, every platform, every notification is designed by some of the most intelligent people on earth with one goal: to take it from you...' },
  { id: 6, title: 'Vedic Mathematics: 16 Sutras', author: 'Pandit Ramesh Shastri', pages: 220, cover: '/Images/book-cover-vedic-math_33af1145.jpg', desc: 'All 16 Sutras explained with worked examples, exercises, and applications from arithmetic to calculus. For ages 10 and above.', tags: ['Mathematics', 'Vedic'], price: 'Free for Members', badge: null, memberOnly: true, preview: 'Chapter 1: What the Vedic Mathematicians Knew\n\nThe 16 Sutras of Vedic Mathematics were not discovered. They were remembered. Bharati Krishna Tirthaji did not invent a new system — he recovered an ancient one from the Atharva Veda...' },
];

const AUDIO_BOOKS = [
  { id: 1, title: 'The Living Yoga', author: 'Swami Dharmananda', duration: '6h 42m', cover: '/Images/book-cover-living-yoga_71cb1a67.jpg', desc: 'Breath, body, and consciousness — a complete audio guide to the living practice of yoga, from asana to samadhi. Narrated by the author.', tags: ['Yoga', 'Pranayama'], price: 'Free with membership', badge: 'Featured' },
  { id: 2, title: 'Guided Meditations from the Upanishads', author: 'Swami Dharmananda', duration: '4h 18m', cover: '/Images/book-cover-meditation-audio_ab0e9a03.jpg', desc: '21 guided meditations drawn directly from the Upanishads — Mandukya, Kena, Isha, and Brihadaranyaka. Each meditation is 10-15 minutes.', tags: ['Meditation', 'Upanishads'], price: 'Free with membership', badge: 'New' },
  { id: 3, title: 'Vedic Chanting: Science of Sacred Sound', author: 'Pandit Ramesh Shastri', duration: '8h 05m', cover: '/Images/book-cover-vedic-chanting_1fe457b2.jpg', desc: 'The physics, physiology, and philosophy of Vedic chanting. Includes pronunciation guides, svaras, and 40 complete chants.', tags: ['Chanting', 'Sanskrit'], price: 'Free for Members', badge: null, memberOnly: true },
  { id: 4, title: 'Bhagavad Gita: The Complete Audio Journey', author: 'Pankaj Tyagi', duration: '5h 30m', cover: '/Images/book-cover-gita-audio_37a4e9ad.jpg', desc: 'All 18 chapters read in Sanskrit with English translation and commentary. Includes the original verses and their practical applications.', tags: ['Bhagavad Gita', 'Philosophy'], price: 'Free with membership', badge: 'Popular' },
  { id: 5, title: 'Pranayama: The Complete Breath Manual', author: 'Dr. Priya Sharma', duration: '3h 22m', cover: '/Images/book-cover-pranayama-guide_b3dcc147.jpg', desc: 'Nadi Shodhana, Kapalabhati, Bhramari — every major pranayama technique explained with neuroscience, practice instructions, and safety guidelines.', tags: ['Pranayama', 'Wellness'], price: 'Free with membership', badge: null },
];

const VIDEO_BOOKS = [
  { id: 1, title: 'Dharma in Daily Life', author: 'Pankaj Tyagi', duration: '30 sessions · 15h', cover: '/Images/book-cover-dharma-daily_7af5aa83.jpg', desc: 'A 30-day video journey through the practical application of Dharmic principles — in work, relationships, parenting, and technology.', tags: ['Dharma', 'Lifestyle'], price: 'Free with enrollment', badge: 'Featured' },
  { id: 2, title: 'Sanskrit for Beginners', author: 'Pandit Ramesh Shastri', duration: '40 lessons · 20h', cover: '/Images/book-cover-sanskrit-beginners_e7dbdb98.jpg', desc: 'Learn Sanskrit from zero to reading the Bhagavad Gita. Devanagari script, grammar, vocabulary, and classical texts. Self-paced.', tags: ['Sanskrit', 'Beginner'], price: 'Free for Members', badge: 'Bestseller', memberOnly: true },
  { id: 3, title: 'Raising Dharmic Children', author: 'Pankaj Tyagi', duration: '24 sessions · 12h', cover: '/Images/book-cover-parenting-video_84659b40.jpg', desc: 'Raising Dharmic children in the West — from the first year to adolescence. Cultural identity, screen time, education, and spiritual development.', tags: ['Parenting', 'Children'], price: 'Free with enrollment', badge: 'New' },
  { id: 4, title: 'Shilajit: Ancient Resin, Modern Science', author: 'Dr. Vikram Nair', duration: '12 sessions · 6h', cover: '/Images/book-cover-shilajit-guide_543d503f.jpg', desc: 'A complete video course on Shilajit — fulvic acid, dibenzo-alpha-pyrones, clinical research, sourcing, and safe use protocols.', tags: ['Ayurveda', 'Herbs'], price: 'Free for Members', badge: null, memberOnly: true },
  { id: 5, title: 'Ayurveda Practitioner Course', author: 'Dr. Vikram Nair', duration: '48 sessions · 24h', cover: '/Images/book-cover-ayurveda-decoded_96a23996.jpg', desc: 'A comprehensive introduction to Ayurvedic medicine — Tridosha, pulse diagnosis, herbal formulations, and clinical case studies.', tags: ['Ayurveda', 'Advanced'], price: 'Free for Members', badge: 'Popular', memberOnly: true },
];

// ── Member Login Modal ────────────────────────────────────────────────────────
function MemberLoginModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'login' | 'checking' | 'not-member' | 'success'>('login');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email address.'); return; }
    setStep('checking');
    // Simulate membership check — in production, verify against donor/enrollment database
    setTimeout(() => {
      // Check if email is in approved donors list (localStorage for now)
      const donors = JSON.parse(localStorage.getItem('si_approved_donors') || '[]');
      const isMember = donors.some((d: { email: string }) => d.email.toLowerCase() === email.toLowerCase());
      setStep(isMember ? 'success' : 'not-member');
    }, 1200);
  };

  const handleNotify = () => {
    const key = 'si_waitlist_books';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ email, title, joinedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    toast.success('Added to waitlist! We will notify you when access is granted.');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', background: 'var(--si-card)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', zIndex: 1 }} onClick={e => e.stopPropagation()}>
        {/* Close button */}
        
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Icon */}
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--si-orange-tint)', border: '2px solid var(--si-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 18px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>

        {step === 'login' && (
          <>
            Member Access Required</p>
            {title}</h3>
            
              This title is free for <strong className="text-si-text-strong">monthly donors</strong> and <strong className="text-si-text-strong">enrolled Gurukul members</strong>. Enter your email to verify your membership.
            </p>
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                Your Email Address</label>
                
              </div>
              
                Verify Membership →
              </button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--si-surface-alt)' }} />
              not a member yet?</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--si-surface-alt)' }} />
            </div>
            
              Become a Monthly Donor — Get Full Access →
            </Link>
          </>
        )}

        {step === 'checking' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 14px', display: 'block' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Verifying membership…</p>
            Checking {email}</p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: '52px', height: '52px', background: 'var(--si-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            Welcome, Member!</h3>
            
              Your membership is verified. You now have full access to <strong>{title}</strong> and all 16 titles in the Digital Library.
            </p>
            
              Start Reading →
            </button>
          </div>
        )}

        {step === 'not-member' && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: '52px', height: '52px', background: 'var(--si-orange-tint)', border: '2px solid var(--si-orange-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            No membership found</h3>
            
              We could not find an active membership for <strong>{email}</strong>. Become a monthly donor to unlock the full library.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
                Become a Monthly Donor →
              </Link>
              
                Notify me when I get access
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Member Only Overlay (card overlay — triggers modal) ───────────────────────
function NotifyMeOverlay({ title }: { title: string }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,25,35,0.82)', backdropFilter: 'blur(3px)', borderRadius: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 10, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setShowModal(true); }}>
        MEMBER ONLY</span>
        Free for monthly donors &amp; enrolled members.</p>
        
          Sign In as Member →
        </button>
      </div>
      {showModal && <MemberLoginModal title={title} onClose={() => setShowModal(false)} />}
    </>
  );
}

// ── Book Card Components ───────────────────────────────────────────────────────
function DigitalBookCard({ book }: { book: typeof DIGITAL_BOOKS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)} style={{ cursor: 'pointer', background: 'var(--si-card)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'none'; el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}>
        {/* Cover */}
        <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
          <Image src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {book.badge && !(book as any).memberOnly && (
            {book.badge}</span>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
            {book.pages} pages</span>
          </div>
          {(book as any).memberOnly && <NotifyMeOverlay title={book.title} />}
        </div>
        {/* Info */}
        <div style={{ padding: '14px' }}>
          {book.title}</h3>
          <SIBadge />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            {book.price}</span>
            Preview →</span>
          </div>
        </div>
      </div>
      {/* Kindle-style reader modal */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setOpen(false)}>
          <div style={{ background: 'var(--si-cream)', borderRadius: '16px', maxWidth: '640px', width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="on-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--si-border)', background: 'var(--si-hero-dark)' }}>
              <div>
                {book.title}</p>
                Published by Sanatan International Press · Preview</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', cursor: 'pointer', padding: '4px 8px' }}>×</button>
            </div>
            <div style={{ padding: '32px 40px', overflowY: 'auto', flex: 1 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', lineHeight: 1.85, color: '#2D2D2D', whiteSpace: 'pre-line' }}>{book.preview}</p>
              <div style={{ marginTop: '32px', padding: '20px', background: 'var(--si-orange-tint)', borderRadius: '10px', textAlign: 'center' }}>
                Continue reading — enroll in the Gurukul for full access to all {DIGITAL_BOOKS.length + AUDIO_BOOKS.length + VIDEO_BOOKS.length} titles.</p>
                Join Us Today →</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AudioBookCard({ book }: { book: typeof AUDIO_BOOKS[0] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ background: 'var(--si-card)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'none'; el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
      {/* Cover */}
      <div style={{ position: 'relative', width: '80px', height: '120px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <Image src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {(book as any).memberOnly ? <NotifyMeOverlay title={book.title} /> : <button onClick={() => { setPlaying(!playing); toast.info(playing ? 'Paused' : 'Audio preview — enroll for full access'); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 150ms ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(249,115,22,0.7)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.45)'; }}>
          {playing ? <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
        </button>}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {book.badge && {book.badge}</span>}
        {book.title}</h3>
        <SIBadge />
        {book.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          🎧 {book.duration}</span>
          {book.price}</span>
          {book.tags.map(t => {t}</span>)}
        </div>
      </div>
    </div>
  );
}

function VideoBookCard({ book }: { book: typeof VIDEO_BOOKS[0] }) {
  return (
    <div style={{ background: 'var(--si-card)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'none'; el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <Image src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {(book as any).memberOnly ? <NotifyMeOverlay title={book.title} /> : (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => toast.info('Enroll in the Gurukul to access this video course')} style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(249,115,22,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 150ms ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
        )}
        {book.badge && !(book as any).memberOnly && {book.badge}</span>}
      </div>
      <div style={{ padding: '18px' }}>
        {book.title}</h3>
        <SIBadge />
        {book.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          🎬 {book.duration}</span>
          {book.price}</span>
        </div>
      </div>
    </div>
  );
}

// ── Author Submission Form ────────────────────────────────────────────────────
function AuthorSubmissionSection() {
  const [form, setForm] = useState({ name: '', email: '', title: '', type: 'digital', synopsis: '', sampleUrl: '', bio: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.title || !form.synopsis) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('si_submissions') || '[]');
      const newEntry = { id: Date.now().toString(), name: form.name, email: form.email, title: form.title, type: form.type, synopsis: form.synopsis, sampleUrl: form.sampleUrl, bio: form.bio, submittedAt: new Date().toISOString(), status: 'pending' };
      existing.push(newEntry);
      localStorage.setItem('si_submissions', JSON.stringify(existing));
      // localStorage alone only ever reached this one browser.
      void submitForm({
        formName: 'Manuscript submission',
        inbox: 'books',
        data: { name: form.name, email: form.email, title: form.title, type: form.type, synopsis: form.synopsis },
      });
      setLoading(false);
      setSubmitted(true);
      toast.success('Submission received! Our editorial team will review within 7–10 days.');
    }, 1000);
  };

  return (
    <section style={{ background: 'var(--si-card)', borderTop: '1px solid var(--si-surface-alt)' }}>
      <div className="container max-w-5xl py-20">
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            {/* Left — info */}
            <div>
              Publish with Us</p>
              Share your knowledge with the Sanatan community</h2>
              
                Sanatan International Press publishes books, audio guides, and video courses on Vedic philosophy, Ayurveda, Sanskrit, Yoga, and Dharmic living. We welcome submissions from scholars, practitioners, and teachers.
              </p>
              {/* Process */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { step: '01', title: 'Submit your proposal', desc: 'Fill in the form with your manuscript details, synopsis, and a sample chapter or video link.' },
                  { step: '02', title: 'Editorial review', desc: 'Our team reviews every submission within 7–10 business days. We evaluate content quality, accuracy, and alignment with our mission.' },
                  { step: '03', title: 'Admin approval', desc: 'Approved works are published under the Sanatan International Press imprint, with full design, formatting, and distribution support.' },
                  { step: '04', title: 'Published & distributed', desc: 'Your work reaches thousands of readers in the Sanatan International community and beyond — free or paid, your choice.' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {item.step}</span>
                    <div>
                      {item.title}</p>
                      {item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Guidelines */}
              <div style={{ marginTop: '28px', padding: '16px 20px', background: 'var(--si-orange-tint)', borderRadius: '10px', borderLeft: '3px solid var(--si-orange)' }}>
                Editorial Guidelines</p>
                
                  <li>Content must be original and not previously published elsewhere</li>
                  <li>All factual claims must be cited with credible sources</li>
                  <li>Content must align with Sanatan Dharma values and principles</li>
                  <li>Minimum 10,000 words for digital books; 60 minutes for audio/video</li>
                  <li>Authors retain copyright; SI receives non-exclusive publishing rights</li>
                </ul>
              </div>
            </div>
            {/* Right — form */}
            <div>
              {submitted ? (
                <div style={{ background: 'var(--si-success-tint)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--si-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--si-success-deep)', marginBottom: '10px' }}>Submission Received</h3>
                  Thank you, {form.name}. Our editorial team will review <strong>{form.title}</strong> and respond to {form.email} within 7–10 business days.</p>
                  Submit Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: 'var(--si-surface)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  Submit a Manuscript</h3>
                  Fields marked * are required</p>
                  {/* Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      Full Name *</label>
                      
                    </div>
                    <div>
                      Email *</label>
                      
                    </div>
                  </div>
                  {/* Title */}
                  <div>
                    Book / Course Title *</label>
                    
                  </div>
                  {/* Type */}
                  <div>
                    Format *</label>
                    
                      <option value="digital">Digital Book (PDF / ePub)</option>
                      <option value="audio">Audio Book</option>
                      <option value="video">Video Course</option>
                    </select>
                  </div>
                  {/* Synopsis */}
                  <div>
                    Synopsis *</label>
                    
                  </div>
                  {/* Sample URL */}
                  <div>
                    Sample Chapter / Video Link</label>
                    
                  </div>
                  {/* Bio */}
                  <div>
                    Author Bio</label>
                    
                  </div>
                  
                    {loading ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting...</> : 'Submit Manuscript for Review →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Books() {
  const [tab, setTab] = useState<'digital' | 'audio' | 'video'>('digital');
  const TABS = [
    { id: 'digital' as const, label: 'Digital Books', icon: '📖', count: DIGITAL_BOOKS.length },
    { id: 'audio' as const, label: 'Audio Books', icon: '🎧', count: AUDIO_BOOKS.length },
    { id: 'video' as const, label: 'Video Courses', icon: '🎬', count: VIDEO_BOOKS.length },
  ];

  return (
    <Layout>
      <PageMeta title="Digital Library — Sanatan International" description="Books, audio guides, and video courses on Vedic philosophy, Ayurveda, Sanskrit, Yoga, and Dharmic living. Published by Sanatan International Press." url="/books" />

      {/* Hero */}
      <section className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, var(--si-hero-mid) 100%)', paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container max-w-4xl" style={{ textAlign: 'center' }}>
          Sanatan International Press</p>
          The Digital Library</h1>
          
            {DIGITAL_BOOKS.length + AUDIO_BOOKS.length + VIDEO_BOOKS.length} titles across digital books, audio guides, and video courses. <strong className="text-white">All titles are free</strong> for members enrolled in a monthly donation or with monthly donation approval.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            Become a Member — Get All Books Free →</Link>
            Publish with Us</a>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ background: 'var(--si-card)', borderBottom: '1px solid var(--si-border)', position: 'sticky', top: '72px', zIndex: 40 }}>
        <div className="container max-w-6xl">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {TABS.map(t => (
              
                <span>{t.icon}</span>{t.label}
                {t.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Membership Access Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, var(--si-orange-tint) 0%, #FEF3C7 100%)', borderBottom: '1px solid var(--si-orange-light)', padding: '14px 0' }}>
        <div className="container max-w-6xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--si-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              
                All 16 titles are <span className="text-si-orange-ink">completely free</span> for members enrolled in a monthly donation or with monthly donation approval.
              </p>
              
                Monthly donors · Enrolled Gurukul families · Approved community members
              </p>
            </div>
          </div>
          
            Become a Monthly Donor →
          </Link>
        </div>
      </div>

      {/* ── Featured Author Spotlight ── */}
      <section style={{ background: 'var(--si-card)', borderBottom: '1px solid var(--si-surface-alt)', padding: '32px 0' }}>
        <div className="container max-w-6xl">
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'center', background: 'linear-gradient(135deg, var(--si-cream), var(--si-orange-tint))', borderRadius: '20px', padding: '32px', border: '1px solid var(--si-orange-light)' }}>
              {/* Photo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--si-orange)', boxShadow: '0 8px 32px rgba(249,115,22,0.25)' }}>
                  <Image src="/Images/pankaj_35d7f5c2.png" alt="Pankaj Tyagi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  Pankaj Tyagi</p>
                  Founder & Chief Visionary</p>
                  <SIBadge />
                </div>
              </div>
              {/* Bio + titles */}
              <div>
                Featured Author</p>
                The mind behind the mission — and the manuscripts</h2>
                
                  Pankaj Tyagi founded Sanatan International in 2024 with a single conviction: that the ancient sciences of India are not relics — they are the most advanced human technologies ever developed. His writing bridges the Vedic tradition and the modern world, making timeless wisdom accessible to the Indian diaspora raising families in the West.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['The Gurukul Method', 'Dharma in the Digital Age', 'Raising Dharmic Children'].map(title => (
                    {title}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  View His Books →</button>
                  Full Bio →</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Book grids */}
      <section style={{ background: 'var(--si-surface)', minHeight: '60vh' }}>
        <div className="container max-w-6xl py-16">
          {tab === 'digital' && (
            <>
              <Reveal><div style={{ marginBottom: '32px' }}>Digital Books</h2>Read in your browser — Kindle-style interface. Click any book to preview the first chapter.</p></div></Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                {DIGITAL_BOOKS.map((book, i) => <Reveal key={book.id} delay={i * 60}><DigitalBookCard book={book} /></Reveal>)}
              </div>
            </>
          )}
          {tab === 'audio' && (
            <>
              <Reveal><div style={{ marginBottom: '32px' }}>Audio Books</h2>Listen on any device. Narrated by Sanatan International faculty.</p></div></Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {AUDIO_BOOKS.map((book, i) => <Reveal key={book.id} delay={i * 60}><AudioBookCard book={book} /></Reveal>)}
              </div>
            </>
          )}
          {tab === 'video' && (
            <>
              <Reveal><div style={{ marginBottom: '32px' }}>Video Courses</h2>Structured video courses with downloadable materials. Self-paced, lifetime access.</p></div></Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {VIDEO_BOOKS.map((book, i) => <Reveal key={book.id} delay={i * 60}><VideoBookCard book={book} /></Reveal>)}
              </div>
            </>
          )}
          <Reveal delay={200}>
            <div className="on-dark" style={{ marginTop: '60px', background: 'linear-gradient(135deg, var(--si-hero-dark), var(--si-hero-mid))', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
              Full Library Access</p>
              All {DIGITAL_BOOKS.length + AUDIO_BOOKS.length + VIDEO_BOOKS.length} titles, free with enrollment</h3>
              Enroll in the Sanatan International Gurukul and get unlimited access to the entire digital library — plus live classes, community events, and the Digital Gurukul platform.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                Join Us Today</Link>
                Explore the Gurukul</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Author Submission */}
      <div id="submit">
        <AuthorSubmissionSection />
      </div>
    </Layout>
  );
}
