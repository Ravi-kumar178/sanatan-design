// Member Dashboard — /dashboard
// Shows active monthly donation status and unlocked Digital Library access
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import Image from "@/components/Image";

const BOOKS = [
  { id: 1, title: 'Vedanta in the Modern World', type: 'digital', cover: '/Images/book-cover-vedanta-modern_0a3dd695.jpg', desc: 'Ancient non-dualism for contemporary life.' },
  { id: 2, title: 'The Gurukul Method', type: 'digital', cover: '/Images/book-cover-gurukul-method_3e046834.jpg', desc: 'How ancient education transforms modern children.' },
  { id: 3, title: 'Āyurveda Decoded', type: 'digital', cover: '/Images/book-cover-ayurveda-decoded_7c2e1f9a.jpg', desc: 'Tridosha science for everyday wellness.' },
  { id: 4, title: 'Vedic Chanting', type: 'audio', cover: '/Images/book-cover-audio-vedic_5e8b3c2d.jpg', desc: 'Guided Vedic mantra pronunciation course.' },
  { id: 5, title: 'Bhagavad Gita Audio', type: 'audio', cover: '/Images/book-cover-gita-audio_9f4e2b1c.jpg', desc: 'All 18 chapters with verse-by-verse commentary.' },
  { id: 6, title: 'Yoga Fundamentals', type: 'video', cover: '/Images/book-cover-yoga-video_2d7f4e8a.jpg', desc: '12-week video course for complete beginners.' },
];

const TIER_ICONS: Record<string, string> = {
  bhakta: '/Images/icon-giving-hands_3d326c73.png',
  sevak: '/Images/icon-giving-hands_3d326c73.png',
  acharya: '/Images/icon-giving-hands_3d326c73.png',
};

export default function MemberDashboard() {
  const [memberEmail, setMemberEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [memberData, setMemberData] = useState<{name:string;email:string;tier:string;since:string} | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginState, setLoginState] = useState<'idle'|'checking'|'notfound'>('idle');

  useEffect(() => {
    // Check if already verified in session
    const saved = sessionStorage.getItem('si_member_session');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMemberData(data);
        setIsVerified(true);
      } catch {}
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginState('checking');
    setTimeout(() => {
      const donors: {email:string;name:string;tier:string;since:string}[] = JSON.parse(localStorage.getItem('si_approved_donors') || '[]');
      const found = donors.find(d => d.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (found) {
        const data = { name: found.name, email: found.email, tier: found.tier || 'monthly', since: found.since };
        setMemberData(data);
        setIsVerified(true);
        sessionStorage.setItem('si_member_session', JSON.stringify(data));
        setLoginState('idle');
      } else {
        setLoginState('notfound');
      }
    }, 1200);
  };

  const handleLogout = () => {
    setIsVerified(false);
    setMemberData(null);
    sessionStorage.removeItem('si_member_session');
    setLoginEmail('');
    setLoginState('idle');
  };

  const tierLabel = memberData?.tier === 'monthly' ? 'Monthly Donor · Sevak' : memberData?.tier === 'enrolled' ? 'Enrolled Member · Acharya' : 'Supporter · Bhakta';
  const tierColor = memberData?.tier === 'monthly' ? '#F97316' : memberData?.tier === 'enrolled' ? '#EAB308' : 'var(--si-text-muted)';

  return (
    <Layout>
      <PageMeta
        title="Member Dashboard — Sanatan International"
        description="Access your Digital Library, view your monthly donation status, and manage your Sanatan International membership."
        url="/dashboard"
        type="website"
      />

      {/* Hero bar */}
      <div className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, var(--si-hero-mid) 100%)', borderBottom: '1px solid rgba(249,115,22,0.2)', paddingTop: '88px', paddingBottom: '0' }}>
        <div className="container max-w-5xl" style={{ paddingBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '28px' }}>
            <Image src="/Images/logo_01779464.png" alt="SI" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <div>
              Member Dashboard</p>
              
                Sanatan International
              </h1>
            </div>
            {isVerified && memberData && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  {memberData.name}</p>
                  {tierLabel}</p>
                </div>
                
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--si-surface)', minHeight: '80vh' }}>
        <div className="container max-w-5xl py-12">

          {/* ── Not logged in ── */}
          {!isVerified && (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
              <div style={{ background: 'var(--si-card)', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--si-surface-alt)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <Image src="/Images/icon-lotus_855e6a37.png" alt="SI" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '16px' }} />
                  Welcome Back</h2>
                  Enter your email to access your Digital Library and membership benefits.</p>
                </div>
                <form onSubmit={handleVerify}>
                  <div style={{ marginBottom: '16px' }}>
                    Email Address</label>
                    
                    {loginState === 'notfound' && (
                      
                        Email not found in our member list. Become a monthly donor →</Link>
                      </p>
                    )}
                  </div>
                  
                    {loginState === 'checking' ? 'Verifying…' : 'Access My Library →'}
                  </button>
                </form>
                
                  Not a member yet? Become a monthly donor</Link> to unlock all 16 titles.
                </p>
              </div>
            </div>
          )}

          {/* ── Logged in dashboard ── */}
          {isVerified && memberData && (
            <div>
              {/* Membership status card */}
              <div className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark), var(--si-hero-mid))', borderRadius: '20px', padding: '28px 32px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', border: '1px solid rgba(249,115,22,0.2)' }}>
                <Image src="/Images/icon-giving-hands_3d326c73.png" alt="Tier" style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  Active Membership</p>
                  {memberData.name}</h2>
                  {memberData.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '16px 20px', background: 'rgba(249,115,22,0.12)', borderRadius: '12px', border: '1px solid rgba(249,115,22,0.2)' }}>
                    {tierLabel.split('·')[0].trim()}</p>
                    Tier</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    16</p>
                    Titles Unlocked</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--si-success-light)', margin: 0 }}>Active</p>
                    Status</p>
                  </div>
                </div>
              </div>

              {/* Quick access grid */}
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Your Digital Library</h3>
                View all 16 titles →</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {BOOKS.map(book => (
                  <Link key={book.id} href="/books">
                    <div style={{ background: 'var(--si-card)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid var(--si-surface-alt)', cursor: 'pointer', transition: 'transform 150ms ease, box-shadow 150ms ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
                      <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
                        <Image src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                          {book.type === 'digital' ? '📖' : book.type === 'audio' ? '🎧' : '🎬'} {book.type}
                        </div>
                        
                          ✓ Unlocked
                        </div>
                      </div>
                      <div style={{ padding: '12px' }}>
                        {book.title}</p>
                        {book.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Member benefits summary */}
              <div style={{ background: 'var(--si-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--si-surface-alt)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                Your Active Benefits</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '📚', label: 'Full Digital Library', sub: '16 titles unlocked' },
                    { icon: '🎧', label: 'Audio & Video', sub: '10 courses' },
                    { icon: '🕉', label: 'Monthly Satsang', sub: 'Live community call' },
                    { icon: '📜', label: 'Campus Reports', sub: 'Quarterly updates' },
                    { icon: '🌱', label: 'Founding Register', sub: 'Your name on campus' },
                    { icon: '🎓', label: 'Priority Enrollment', sub: 'New cohorts first' },
                  ].map(b => (
                    <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--si-orange-tint)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{b.icon}</span>
                      <div>
                        {b.label}</p>
                        {b.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--si-surface-alt)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  
                    Browse Full Library →
                  </Link>
                  
                    Enroll in a Course →
                  </Link>
                  
                    Manage Donation →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
