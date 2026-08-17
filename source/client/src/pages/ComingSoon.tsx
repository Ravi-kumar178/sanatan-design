import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitForm } from '@/lib/formDelivery';

interface Props { title: string; desc: string; category?: string; }

export default function ComingSoon({ title, desc, category = 'general' }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const WAITLIST_COUNT: Record<string, number> = { marketplace: 312, scriptures: 189, general: 247 };
  const count = WAITLIST_COUNT[category] ?? 247;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email address.'); return; }
    setLoading(true);
    setTimeout(() => {
      const key = `si_waitlist_${category}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ name, email, title, joinedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      void submitForm({
        formName: `Waitlist — ${title}`,
        inbox: 'general',
        data: { name, email, waitlist: title },
      });
      setLoading(false);
      setSubmitted(true);
      toast.success(`You are on the waitlist! We will notify you when ${title} launches.`);
    }, 1000);
  };

  return (
    <Layout>
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--si-cream) 0%, var(--si-orange-tint) 100%)', paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--si-orange-tint)', border: '2px solid var(--si-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 20px rgba(249,115,22,0.15)' }}>
            <span style={{ fontSize: '2rem' }}>🕉</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)', borderRadius: '999px', padding: '4px 14px', marginBottom: '16px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-orange)', display: 'inline-block' }} />
            Coming Soon</span>
          </div>
          {title}</h1>
          {desc}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--si-card)', border: '1px solid var(--si-border)', borderRadius: '999px', padding: '6px 16px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex' }}>
              {['#F97316','#10B981','#7C3AED','#3B82F6'].map((col, i) => (
                <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: col, border: '2px solid white', marginLeft: i > 0 ? '-6px' : '0' }} />
              ))}
            </div>
            
              <strong className="text-si-orange-ink">{count.toLocaleString()}</strong> people on the waitlist
            </span>
          </div>
          {submitted ? (
            <div style={{ background: 'var(--si-success-tint)', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <div style={{ width: '52px', height: '52px', background: 'var(--si-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--si-success-deep)', marginBottom: '8px' }}>You are on the list!</h3>
              We will send a launch notification to <strong>{email}</strong>. You are number <strong>{count + 1}</strong> on the waitlist.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'var(--si-card)', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--si-surface-alt)', marginBottom: '24px', textAlign: 'left' }}>
              Join the Waitlist</h2>
              Be the first to know when we launch. No spam, ever.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  Your Name</label>
                  
                </div>
                <div>
                  Email Address *</label>
                  
                </div>
                
                  {loading ? 'Adding you to the list…' : `Notify Me When ${title} Launches →`}
                </button>
              </div>
            </form>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            ← Return Home</Link>
            <span className="text-si-text-muted">·</span>
            Join the Gurukul instead →</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
