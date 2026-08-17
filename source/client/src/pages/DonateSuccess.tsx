// Donation Success — /donate/success
// Thank-you confirmation page with direct link to Digital Library
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import Image from "@/components/Image";

export default function DonateSuccess() {
  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    setConfetti(true);
    const t = setTimeout(() => setConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Layout>
      <PageMeta
        title="Thank You — Sanatan International"
        description="Your donation to the Sanatan International campus fund has been received. Thank you for supporting the future of Dharmic education in California."
        url="/donate/success"
        type="website"
      />

      {/* Confetti animation */}
      {confetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '-10px',
              left: `${Math.random() * 100}%`,
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              background: ['var(--si-orange)','#EAB308','var(--si-emerald)','var(--si-info)','#EC4899'][Math.floor(Math.random() * 5)],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards`,
              opacity: 0,
            }} />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <div style={{ background: 'linear-gradient(180deg, var(--si-orange-tint) 0%, var(--si-surface) 100%)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container max-w-2xl" style={{ textAlign: 'center' }}>

          {/* Mandala / success icon */}
          <div style={{ marginBottom: '32px', position: 'relative', display: 'inline-block' }}>
            <Image src="/Images/icon-lotus_855e6a37.png" alt="Thank you" style={{ width: '180px', height: '180px', objectFit: 'contain', animation: 'rotateSlow 20s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--si-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px rgba(16,185,129,0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>

          <style>{`@keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

          {/* Thank you message */}
          
            ✦ Donation Received ✦
          </p>
          
            धन्यवाद — Thank You
          </h1>
          
            Your contribution has been received and will go directly toward the <strong>33-acre Gurukul campus</strong> in El Sabrante, California.
          </p>
          
            You will receive a confirmation email within 24 hours. If you made a monthly donation, your Digital Library access will be activated within 48 hours.
          </p>

          {/* Donation tiers visual */}
          <div style={{ background: 'var(--si-card)', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid var(--si-orange-light)', marginBottom: '32px' }}>
            <Image src="/Images/icon-giving-hands_3d326c73.png" alt="Donation tiers" style={{ width: '100%', maxWidth: '360px', height: 'auto', objectFit: 'contain', marginBottom: '16px' }} />
            
              You are now a Founding Donor
            </p>
            
              Monthly donors receive the <strong>Sevak</strong> tier — full Digital Library access, monthly Satsang calls, and your name in the Founding Donor register.
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            
              📚 Access Your Digital Library →
            </Link>
            
              View Member Dashboard →
            </Link>
          </div>

          {/* Share */}
          <div style={{ background: 'var(--si-card)', borderRadius: '16px', padding: '20px 24px', border: '1px solid var(--si-surface-alt)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            
              Share the mission with your community
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              
                WhatsApp
              </a>
              
                Share on X
              </a>
              
                Facebook
              </a>
            </div>
          </div>

          
            Questions? Email us at <a className="text-si-orange-ink" href="mailto:info@sanataninternational.org">info@sanataninternational.org</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
