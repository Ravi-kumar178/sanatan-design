// Admin Submissions Queue — /admin/submissions
// Internal submissions viewer.
//
// NOT ROUTED. This page was previously served at /admin/submissions behind a
// password compiled into the public JavaScript bundle — readable by anyone, so
// it protected nothing. Client-side auth cannot be made secure; re-enable this
// route only once a server-side session guards it.
// Submissions stored in localStorage (no backend needed for MVP)
// Design: clean admin dashboard, saffron accent on dark sidebar

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { toast } from 'sonner';


type Status = 'pending' | 'approved' | 'rejected' | 'revision';

interface Submission {
  id: string;
  name: string;
  email: string;
  title: string;
  type: string;
  synopsis: string;
  sampleUrl: string;
  bio: string;
  submittedAt: string;
  status: Status;
  note?: string;
}

// Seed demo data if localStorage is empty
function seedDemoData() {
  const existing = localStorage.getItem('si_submissions');
  if (existing) return;
  const demos: Submission[] = [
    { id: '1', name: 'Dr. Priya Sharma', email: 'priya@example.com', title: 'Pranayama & the Autonomic Nervous System', type: 'digital', synopsis: 'A 200-page evidence-based guide connecting Pranayama techniques to vagal tone, HRV, and cortisol regulation. 47 clinical studies cited.', sampleUrl: 'https://drive.google.com/sample1', bio: 'PhD in Integrative Medicine, 15 years clinical practice.', submittedAt: '2026-07-28T10:23:00Z', status: 'pending' },
    { id: '2', name: 'Pandit Ramesh Shastri', email: 'ramesh@example.com', title: 'Vedic Astronomy: The Jyotish Compendium', type: 'digital', synopsis: 'A comprehensive reference work on Jyotish — the 27 nakshatras, planetary periods, and their astronomical basis. 380 pages.', sampleUrl: 'https://drive.google.com/sample2', bio: 'Jyotish Acharya, 30 years of teaching and practice.', submittedAt: '2026-07-25T14:11:00Z', status: 'approved' },
    { id: '3', name: 'Ananya Krishnamurthy', email: 'ananya@example.com', title: 'Raising Bilingual Children in the Diaspora', type: 'video', synopsis: 'A 20-session video course for Indian-American parents on maintaining Hindi, Sanskrit, and cultural identity while raising children in English-dominant environments.', sampleUrl: 'https://youtube.com/sample3', bio: 'Linguist and educator, mother of three bilingual children in the Bay Area.', submittedAt: '2026-07-20T09:45:00Z', status: 'revision', note: 'Please add a session on script literacy (Devanagari) for children aged 5-8.' },
    { id: '4', name: 'Dr. Vikram Nair', email: 'vikram@example.com', title: 'Rasayana: The Ayurvedic Science of Longevity', type: 'audio', synopsis: 'An 8-hour audio guide on Rasayana therapies — Chyawanprash, Ashwagandha, Shatavari, and Brahmi — with modern pharmacological evidence.', sampleUrl: 'https://drive.google.com/sample4', bio: 'MD (Ayurveda), researcher at Kerala Ayurveda Academy.', submittedAt: '2026-07-15T16:30:00Z', status: 'rejected', note: 'Overlaps significantly with existing Ayurveda Decoded title. Please differentiate the scope.' },
  ];
  localStorage.setItem('si_submissions', JSON.stringify(demos));
}

const STATUS_CONFIG: Record<Status, { label: string; bg: string; color: string }> = {
  pending:  { label: 'Pending Review', bg: 'var(--si-orange-tint)', color: 'var(--si-orange-ink)' },
  approved: { label: 'Approved',       bg: 'var(--si-success-tint)', color: '#166534' },
  rejected: { label: 'Rejected',       bg: 'var(--si-danger-tint)', color: '#991B1B' },
  revision: { label: 'Needs Revision', bg: 'var(--si-info-tint)', color: '#1D4ED8' },
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'submissions' | 'donors' | 'waitlist'>('submissions');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donors, setDonors] = useState<{email:string;name:string;tier:string;since:string}[]>([]);
  const [waitlist, setWaitlist] = useState<{email:string;category:string;ts:string}[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (true) {
      seedDemoData();
      // Load donors
    const rawDonors = localStorage.getItem('si_approved_donors');
    if (rawDonors) {
      try { setDonors(JSON.parse(rawDonors)); } catch {}
    }
    // Load waitlist
    const wl: {email:string;category:string;ts:string}[] = [];
    ['marketplace','scriptures','books'].forEach(cat => {
      const raw2 = localStorage.getItem(`si_waitlist_${cat}`);
      if (raw2) {
        try {
          const entries = JSON.parse(raw2);
          entries.forEach((e: any) => wl.push({ email: e.email || e, category: cat, ts: e.ts || new Date().toISOString() }));
        } catch {}
      }
    });
    setWaitlist(wl);
    const raw = localStorage.getItem('si_submissions');
      if (raw) setSubmissions(JSON.parse(raw));
    }
  }, []);

  const save = (updated: Submission[]) => {
    setSubmissions(updated);
    localStorage.setItem('si_submissions', JSON.stringify(updated));
  };

  const updateStatus = (id: string, status: Status, noteText?: string) => {
    const updated = submissions.map(s => s.id === id ? { ...s, status, note: noteText ?? s.note } : s);
    save(updated);
    setSelected(prev => prev?.id === id ? { ...prev, status, note: noteText ?? prev.note } : prev);
    toast.success(`Submission ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'marked for revision'}.`);
  };

  const grantDonor = () => {
    if (!donorEmail.trim()) return;
    const entry = { email: donorEmail.trim().toLowerCase(), name: donorName.trim() || donorEmail.trim(), tier: 'monthly', since: new Date().toISOString() };
    const updated = [...donors.filter(d => d.email !== entry.email), entry];
    setDonors(updated);
    localStorage.setItem('si_approved_donors', JSON.stringify(updated));
    setDonorEmail(''); setDonorName('');
    toast.success(`Library access granted to ${entry.email}`);
  };
  const revokeDonor = (email: string) => {
    const updated = donors.filter(d => d.email !== email);
    setDonors(updated);
    localStorage.setItem('si_approved_donors', JSON.stringify(updated));
    toast.success('Access revoked');
  };
  const exportWaitlist = () => {
    const csv = 'Email,Category,Date\n' + waitlist.map(w => `${w.email},${w.category},${w.ts}`).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'si_waitlist.csv'; a.click();
  };
  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const counts = { all: submissions.length, pending: submissions.filter(s => s.status === 'pending').length, approved: submissions.filter(s => s.status === 'approved').length, rejected: submissions.filter(s => s.status === 'rejected').length, revision: submissions.filter(s => s.status === 'revision').length };


  return (
    <div style={{ minHeight: '100vh', background: 'var(--si-surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="on-dark" style={{ background: 'var(--si-hero-dark)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          SANATAN</Link>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>/</span>
          Editorial Queue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {counts.pending} pending review</span>
          Close</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', background: 'var(--si-card)', borderRight: '1px solid var(--si-border)', padding: '24px 0', flexShrink: 0 }}>
          Filter by Status</p>
          {(['all', 'pending', 'approved', 'revision', 'rejected'] as const).map(f => (
            
              <span style={{ textTransform: 'capitalize' }}>{f === 'all' ? 'All Submissions' : STATUS_CONFIG[f as Status].label}</span>
              {counts[f]}</span>
            </button>
          ))}
          <div style={{ margin: '24px 20px 0', padding: '14px', background: 'var(--si-surface)', borderRadius: '10px' }}>
            Export Emails</p>
            Copy Approved Emails</button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--si-surface-alt)', borderRadius: '12px', padding: '4px' }}>
            {([['submissions','📋 Submissions'], ['donors','🔑 Approved Donors'], ['waitlist','📧 Waitlist']] as const).map(([tab, label]) => (
              
                {label}
              </button>
            ))}
          </div>

          {/* ── Approved Donors Tab ── */}
          {activeTab === 'donors' && (
            <div>
              <div style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                Grant Library Access</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  
                  
                  
                    Grant Access
                  </button>
                </div>
                
                  Adding an email here allows that person to verify their membership on the Books page and access all 16 titles.
                </p>
              </div>
              <div style={{ background: 'var(--si-card)', border: '1px solid var(--si-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--si-surface-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                    {donors.length} approved member{donors.length !== 1 ? 's' : ''} · Full Digital Library access
                  </p>
                  
                    Export CSV
                  </button>
                </div>
                {donors.length === 0 ? (
                  
                    No approved donors yet. Use the form above to grant library access.
                  </div>
                ) : donors.map((d, i) => (
                  <div key={d.email} style={{ padding: '14px 20px', borderBottom: i < donors.length - 1 ? '1px solid var(--si-surface-subtle)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--si-orange), #EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {d.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {d.name}</p>
                      {d.email}</p>
                    </div>
                    
                      {d.tier === 'monthly' ? 'Monthly Donor' : 'Enrolled'}
                    </span>
                    
                      {new Date(d.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Waitlist Tab ── */}
          {activeTab === 'waitlist' && (
            <div>
              <div style={{ background: 'var(--si-card)', border: '1px solid var(--si-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--si-surface-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                    {waitlist.length} waitlist entries across Marketplace, Scriptures, Books
                  </p>
                  
                    Export CSV
                  </button>
                </div>
                {waitlist.length === 0 ? (
                  
                    No waitlist entries yet.
                  </div>
                ) : ['marketplace','scriptures','books'].map(cat => {
                  const entries = waitlist.filter(w => w.category === cat);
                  if (entries.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div style={{ padding: '10px 20px', background: 'var(--si-orange-tint)', borderBottom: '1px solid var(--si-orange-light)' }}>
                        
                          {cat.charAt(0).toUpperCase() + cat.slice(1)} ({entries.length})
                        </p>
                      </div>
                      {entries.map((w, i) => (
                        <div key={w.email + i} style={{ padding: '12px 20px', borderBottom: '1px solid var(--si-surface-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {w.email}</p>
                          {new Date(w.ts).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Submissions Tab ── */}
          {activeTab === 'submissions' && <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            
              {filter === 'all' ? 'All Submissions' : STATUS_CONFIG[filter].label}
              ({filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            
              No submissions in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(sub => (
                <div key={sub.id} onClick={() => { setSelected(sub); setNote(sub.note || ''); }} style={{ background: 'var(--si-card)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: selected?.id === sub.id ? '2px solid var(--si-orange)' : '2px solid transparent', cursor: 'pointer', transition: 'all 150ms ease' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        {sub.title}</h3>
                        {STATUS_CONFIG[sub.status].label}</span>
                        {sub.type}</span>
                      </div>
                      {sub.name} · {sub.email}</a></p>
                      {sub.synopsis}</p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {selected?.id === sub.id && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--si-surface-alt)' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          Full Synopsis</p>
                          {sub.synopsis}</p>
                        </div>
                        <div>
                          Author Bio</p>
                          {sub.bio}</p>
                          {sub.sampleUrl && View Sample →</a>}
                        </div>
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        Editorial Note (sent to author on revision/rejection)</label>
                        
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        ✓ Approve</button>
                        ↩ Request Revision</button>
                        ✕ Reject</button>
                        Reset to Pending</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </> }
        </main>
      </div>
    </div>
  );
}
