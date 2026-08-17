// Sanatan International — Join Us Today (Join the Gurukul)
// Student enrollment + Teacher application + Volunteer + Parent inquiry
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import Image from "@/components/Image";
import { submitForm } from '@/lib/formDelivery';

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

type FormType = 'student' | 'teacher' | 'parent' | 'volunteer';
type FormState = 'idle' | 'loading' | 'success' | 'error';

function useForm(type: FormType) {
  const [state, setState] = useState<FormState>('idle');
  const [data, setData] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setData(prev => ({ ...prev, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    void submitForm({
      formName: 'Gurukul enrolment enquiry',
      inbox: 'gurukul',
      data,
    }).then((r: { ok: boolean }) => setState(r.ok ? 'success' : 'error'));
  };
  return { state, data, set, submit };
}


// ─── Enrollment Timeline ──────────────────────────────────────────────────────
function EnrollmentTimeline({ t }: { t: (k: string) => string }) {
  const steps = [
    {
      num: '01',
      icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="24" height="28" rx="3" fill="#F97316" fillOpacity="0.1"/><line x1="13" y1="15" x2="27" y2="15"/><line x1="13" y1="20" x2="27" y2="20"/><line x1="13" y1="25" x2="22" y2="25"/></svg>),
      titleEn: 'Apply',
      titleHi: 'आवेदन करें',
      descEn: 'Fill out the application form below. Choose your role and share your background.',
      descHi: 'नीचे आवेदन पत्र भरें। अपनी भूमिका चुनें और अपनी पृष्ठभूमि साझा करें।',
    },
    {
      num: '02',
      icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22 L12 16 Q12 14 14 14 Q16 14 16 16 L16 20"/><path d="M16 20 L16 14 Q16 12 18 12 Q20 12 20 14 L20 20"/><path d="M20 20 L20 15 Q20 13 22 13 Q24 13 24 15 L24 20"/><path d="M24 20 L24 17 Q24 15 26 15 Q28 15 28 17 L28 24 Q28 30 20 32 Q12 30 12 24 L12 22"/></svg>),
      titleEn: 'Donate',
      titleHi: 'दान करें',
      descEn: 'Make a voluntary contribution to the campus fund. Any amount is welcome.',
      descHi: 'परिसर कोष में स्वैच्छिक योगदान करें। कोई भी राशि स्वागत योग्य है।',
    },
    {
      num: '03',
      icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="9" fill="#F97316" fillOpacity="0.08"/><line x1="24.5" y1="24.5" x2="34" y2="34" strokeWidth="3"/><line x1="14" y1="18" x2="22" y2="18"/><line x1="18" y1="14" x2="18" y2="22"/></svg>),
      titleEn: 'Verify',
      titleHi: 'सत्यापन',
      descEn: 'Our team reviews your application and supporting documents within 24–48 hours.',
      descHi: 'हमारी टीम 24–48 घंटों में आपके आवेदन और दस्तावेज़ों की समीक्षा करती है।',
    },
    {
      num: '04',
      icon: (<svg width="24" height="24" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="26" rx="5" ry="10" fill="#F97316" opacity="0.9"/><ellipse cx="20" cy="26" rx="5" ry="10" transform="rotate(45 20 26)" fill="#F97316" opacity="0.6"/><ellipse cx="20" cy="26" rx="5" ry="10" transform="rotate(-45 20 26)" fill="#F97316" opacity="0.6"/><circle cx="20" cy="22" r="4" fill="#F97316"/></svg>),
      titleEn: 'Activate',
      titleHi: 'सक्रिय करें',
      descEn: 'Receive your welcome email and access credentials within 48–72 hours.',
      descHi: '48–72 घंटों में अपना स्वागत ईमेल और एक्सेस क्रेडेंशियल प्राप्त करें।',
    },
  ];

  const { lang } = useLanguage();

  return (
    <div style={{
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(249,115,22,0.25)',
      padding: '2rem',
      marginBottom: '2.5rem',
    }}>
      
        ✦ HOW ENROLLMENT WORKS ✦
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
        {/* Connecting line */}
        <div style={{ position: 'absolute', top: '28px', left: '12.5%', right: '12.5%', height: '2px', background: 'linear-gradient(90deg, var(--si-orange), #EAB308, var(--si-orange))', opacity: 0.4, zIndex: 0 }} />
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Step circle */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--si-orange), #EAB308)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem', boxShadow: '0 0 20px rgba(249,115,22,0.4)',
              flexShrink: 0,
            }}>
              <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', filter:'brightness(0) invert(1)' }}>{step.icon}</span>
            </div>
            {/* Step number */}
            {step.num}</span>
            {/* Title */}
            <p style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.2 }}>
              {lang === 'hi' ? step.titleHi : step.titleEn}
            </p>
            {/* Description */}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', lineHeight: 1.5 }}>
              {lang === 'hi' ? step.descHi : step.descEn}
            </p>
          </div>
        ))}
      </div>
      {/* Mobile: vertical layout hint */}
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textAlign: 'center', marginTop: '1rem' }}>
        Enrollment is open to all · Activation within 48–72 hours · Your data is never sold
      </p>
    </div>
  );
}

export default function GurukuJoin() {
  const { t, lang } = useLanguage();
  const [activeRole, setActiveRole] = useState<FormType>('student');
  const studentForm = useForm('student');
  const teacherForm = useForm('teacher');
  const parentForm = useForm('parent');
  const volunteerForm = useForm('volunteer');

  const forms = { student: studentForm, teacher: teacherForm, parent: parentForm, volunteer: volunteerForm };
  const form = forms[activeRole];

  const ROLES = [
    { id: 'student' as FormType, label: 'Student', icon: <Image src='/Images/icon-gurukul-teacher_690a9246.png' alt='student' style={{width:'24px',height:'24px',objectFit:'contain'}} />, desc: lang === 'hi' ? 'वयस्क पाठ्यक्रम के लिए आवेदन करें (L1–L6)' : 'Apply for an adult course (L1–L6)' },
    { id: 'parent' as FormType, label: 'Parent', icon: '👨‍👩‍👧', desc: lang === 'hi' ? 'अपने बच्चे का पंजीकरण करें (5–16 वर्ष)' : "Register your child (ages 5–16)" },
    { id: 'teacher' as FormType, label: 'Teacher', icon: '🙏', desc: lang === 'hi' ? 'गुरुकुल में पढ़ाने के लिए आवेदन करें' : 'Apply to teach at the Gurukul' },
    { id: 'volunteer' as FormType, label: 'Volunteer', icon: <Image src='/Images/icon-ayurveda-mortar_16433074.png' alt='volunteer' style={{width:'24px',height:'24px',objectFit:'contain'}} />, desc: lang === 'hi' ? 'अपने कौशल और समय का योगदान करें' : 'Contribute your skills and time' },
  ];

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid var(--si-border)', background: 'var(--si-card)',
    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--si-text)',
    outline: 'none', transition: 'border-color 150ms ease',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    fontFamily: 'Inter, sans-serif', color: 'var(--si-text-strong)',
    marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  };

  return (
    <Layout>
      <PageMeta
        title="Join Us Today — Sanatan International Gurukul"
        description="Join Sanatan International's Gurukul as a student, parent, teacher, or volunteer. Enroll in adult courses, register your child, apply to teach, or contribute your skills to the mission."
        url="/gurukul/join"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul/foundation' }, { name: 'Join Us Today', href: '/gurukul/join' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-24 relative overflow-hidden texture-dark" style={{ backgroundImage: "url(/Images/hero-join_68aaa02a.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: 'absolute', left: '-80px', bottom: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)' }} />
        <div className="container max-w-4xl relative z-10">
          <Reveal>
            <p className="label-chip mb-4">{t('join.badge')}</p>
            
              The Gurukul needs you.<br />
              <span className="text-si-orange-ink">{t('join.sub')}</span>
            </h1>
            
              Whether you are a student seeking transformation, a parent wanting the best for your child, a teacher ready to share your knowledge, or a volunteer with skills to offer — there is a place for you here.
            </p>
            "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</p>
            May all be happy. May all be free from illness.</p>
          </Reveal>
        </div>
      </section>

      {/* Role selector */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)', position: 'sticky', top: '72px', zIndex: 40 }}>
        <div className="container">
          <div className="flex flex-wrap gap-0">
            {ROLES.map((r) => (
              
                <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:"24px",height:"24px" }}>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Role intro + form */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left: role info */}
            <div className="lg:col-span-2">
              <Reveal>
                {activeRole === 'student' && (
                  <div>
                    विद्यार्थी</p>
                    Apply as a Student</h2>
                    {/* Enrollment model notice */}
                    <div style={{ background: 'linear-gradient(135deg, var(--si-orange-tint), #FFFBF5)', border: '1px solid rgba(249,115,22,0.25)', borderLeft: '4px solid var(--si-orange)', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px' }}>
                      OPEN ENROLLMENT · DONATION-BASED ACCESS</p>
                      
                        Sanatan International Gurukul is open to all sincere seekers. There are no fixed fees. Access is granted based on a voluntary donation and a brief document verification process. Once approved, your account is activated within <strong>48–72 hours</strong>.
                      </p>
                    </div>
                    
                      Begin your journey with Level 1 — Basic Human Reset. 30 days. Online. No prerequisites. Enrollment is open to all — access is granted through a voluntary donation and document verification.
                    </p>
                    <div className="space-y-3">
                      {[
                        { level: 'L1', title: 'Basic Human Reset', duration: '30 days' },
                        { level: 'L2', title: 'Dharma Living', duration: '90 days' },
                        { level: 'L3', title: 'Career + Leadership', duration: '120 days' },
                      ].map((l) => (
                        <div key={l.level} style={{ background: 'var(--si-surface)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div className="flex items-center gap-3">
                            {l.level}</span>
                            {l.title}</p>
                          </div>
                          <div className="text-right">
                            Open Access</p>
                            {l.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRole === 'parent' && (
                  <div>
                    माता-पिता</p>
                    {lang === 'hi' ? 'अपने बच्चे का पंजीकरण करें' : 'Register Your Child'}</h2>
                    {/* Enrollment model notice */}
                    <div style={{ background: 'linear-gradient(135deg, var(--si-orange-tint), #FFFBF5)', border: '1px solid rgba(249,115,22,0.25)', borderLeft: '4px solid var(--si-orange)', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px' }}>
                      OPEN ENROLLMENT · DONATION-BASED ACCESS</p>
                      
                        All children aged 5–16 are welcome. Enrollment is open to all families — access is granted through a voluntary donation and a brief verification of the child's age and guardian details. Activation takes <strong>48–72 hours</strong> after submission.
                      </p>
                    </div>
                    
                      Monthly cohorts for children aged 5–16 across three programs: Foundation (5–8), Growth (9–12), and Leadership (13–16). Small cohorts of max 20 students ensure personal attention.
                    </p>
                    <div className="space-y-3">
                      {[
                        { ages: '5–8', title: 'Foundation Program', desc: 'Joyful exposure, no pressure' },
                        { ages: '9–12', title: 'Growth Program', desc: 'Discipline and scripture literacy' },
                        { ages: '13–16', title: 'Leadership Program', desc: 'Build, speak, lead' },
                      ].map((p) => (
                        <div key={p.ages} style={{ background: 'var(--si-surface)', borderRadius: '10px', padding: '12px 16px' }}>
                          Ages {p.ages}</p>
                          {p.title}</p>
                          {p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRole === 'teacher' && (
                  <div>
                    आचार्य</p>
                    Apply to Teach</h2>
                    
                      We are looking for credentialed teachers in Sanskrit, Yoga, Āyurveda, Vedic Science, and related disciplines. Teaching at the Gurukul is not a job — it is a calling. We compensate fairly and treat teachers as partners.
                    </p>
                    <div className="space-y-2">
                      {['Sanskrit & Vedic Studies', 'Yoga & Pranayama', 'Āyurveda & Lifestyle Medicine', 'Vedic Science & Mathematics', 'Meditation & Mindfulness', 'Kalaripayattu & Martial Arts'].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-si-orange-ink">›</span>
                          {s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRole === 'volunteer' && (
                  <div>
                    सेवा</p>
                    Volunteer with Us</h2>
                    
                      Seva is not charity — it is the highest form of self-realisation. We welcome volunteers with skills in technology, design, community outreach, administration, media, and more.
                    </p>
                    <div className="space-y-2">
                      {['Technology & App Development', 'Graphic Design & Media', 'Community Outreach', 'Event Organisation', 'Translation & Content', 'Administrative Support'].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-si-orange-ink">›</span>
                          {s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <Reveal delay={100}>
                <div style={{ background: 'var(--si-surface)', borderRadius: '24px', padding: '36px' }}>
                  {form.state === 'success' ? (
                    <div className="text-center py-8">
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--si-success-tint)', border: '2px solid var(--si-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      {lang === 'hi' ? 'आवेदन प्राप्त हुआ!' : 'Application Received!'}</h3>
                      We will review your application and respond within 3–5 business days.</p>
                      धन्यवाद 🙏</p>
                    </div>
                  ) : (
                    <form onSubmit={form.submit}>
                      
                        {activeRole === 'student' && (lang === 'hi' ? 'छात्र नामांकन आवेदन' : 'Student Enrollment Application')}
                        {activeRole === 'parent' && (lang === 'hi' ? 'बाल नामांकन आवेदन' : 'Child Enrollment Application')}
                        {activeRole === 'teacher' && (lang === 'hi' ? 'शिक्षक आवेदन' : 'Teacher Application')}
                        {activeRole === 'volunteer' && (lang === 'hi' ? 'स्वयंसेवक आवेदन' : 'Volunteer Application')}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="gurukujoin-f1" style={labelStyle}>{lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}</label>
                          <input id="gurukujoin-f1" required style={inputStyle} placeholder={lang === 'hi' ? 'आपका पूरा नाम' : 'Your full name'} onChange={(e) => form.set('name', e.target.value)}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                        </div>
                        <div>
                          <label htmlFor="gurukujoin-f2" style={labelStyle}>{lang === 'hi' ? 'ईमेल पता *' : 'Email Address *'}</label>
                          <input id="gurukujoin-f2" required type="email" style={inputStyle} placeholder={lang === 'hi' ? 'आपका@ईमेल.com' : 'your@email.com'} onChange={(e) => form.set('email', e.target.value)}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="gurukujoin-f3" style={labelStyle}>{lang === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'}</label>
                          <input id="gurukujoin-f3" style={inputStyle} placeholder="+1 or +91 number" onChange={(e) => form.set('phone', e.target.value)}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                        </div>
                        <div>
                          <label htmlFor="gurukujoin-f4" style={labelStyle}>{lang === 'hi' ? 'देश / शहर' : 'Country / City'}</label>
                          <input id="gurukujoin-f4" style={inputStyle} placeholder="e.g. San Jose, CA" onChange={(e) => form.set('location', e.target.value)}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                        </div>
                      </div>

                      {activeRole === 'student' && (
                        <div className="mb-4">
                          <label htmlFor="gurukujoin-f5" style={labelStyle}>{lang === 'hi' ? 'कौन सा स्तर? *' : 'Which Level? *'}</label>
                          <select id="gurukujoin-f5" required style={{ ...inputStyle, cursor: 'pointer' }} onChange={(e) => form.set('level', e.target.value)}
                            onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-orange)'; }}
                            onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-border)'; }}>
                            <option value="">Select a level</option>
                            <option value="L1">L1 — Basic Human Reset (30 days)</option>
                            <option value="L2">L2 — Dharma Living (90 days)</option>
                            <option value="L3">L3 — Career + Leadership (120 days)</option>
                            <option value="L4">L4 — Yoga Teacher Track (180 days)</option>
                            <option value="L5">L5 — Āyurveda Practitioner (180 days)</option>
                            <option value="L6">L6 — Master Sādhana (365 days)</option>
                          </select>
                        </div>
                      )}

                      {activeRole === 'parent' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="gurukujoin-f6" style={labelStyle}>{lang === 'hi' ? 'बच्चे का नाम *' : "Child's Name *"}</label>
                              <input id="gurukujoin-f6" required style={inputStyle} placeholder="Child's full name" onChange={(e) => form.set('childName', e.target.value)}
                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                            </div>
                            <div>
                              <label htmlFor="gurukujoin-f7" style={labelStyle}>{lang === 'hi' ? 'बच्चे की आयु *' : "Child's Age *"}</label>
                              <input id="gurukujoin-f7" required type="number" min="5" max="16" style={inputStyle} placeholder="Age (5–16)" onChange={(e) => form.set('childAge', e.target.value)}
                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="gurukujoin-f8" style={labelStyle}>{lang === 'hi' ? 'पसंदीदा धारा *' : 'Preferred Stream *'}</label>
                            <select id="gurukujoin-f8" required style={{ ...inputStyle, cursor: 'pointer' }} onChange={(e) => form.set('stream', e.target.value)}
                              onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-orange)'; }}
                              onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-border)'; }}>
                              <option value="">Select a stream</option>
                              <option value="Sanskrit">Sanskrit</option>
                              <option value="Yoga">Yoga</option>
                              <option value="Vedic Science">Vedic Science</option>
                              <option value="Not sure">Not sure — advise me</option>
                            </select>
                          </div>
                        </>
                      )}

                      {activeRole === 'teacher' && (
                        <>
                          <div className="mb-4">
                            <label htmlFor="gurukujoin-f9" style={labelStyle}>{lang === 'hi' ? 'शिक्षण विशेषज्ञता *' : 'Teaching Specialisation *'}</label>
                            <select id="gurukujoin-f9" required style={{ ...inputStyle, cursor: 'pointer' }} onChange={(e) => form.set('specialisation', e.target.value)}
                              onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-orange)'; }}
                              onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-border)'; }}>
                              <option value="">Select your specialisation</option>
                              <option>Sanskrit & Vedic Studies</option>
                              <option>Yoga & Pranayama</option>
                              <option>Āyurveda & Lifestyle Medicine</option>
                              <option>Vedic Science & Mathematics</option>
                              <option>Meditation & Mindfulness</option>
                              <option>Kalaripayattu & Martial Arts</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="gurukujoin-f10" style={labelStyle}>{lang === 'hi' ? 'अनुभव के वर्ष' : 'Years of Experience'}</label>
                            <input id="gurukujoin-f10" style={inputStyle} placeholder="e.g. 5 years" onChange={(e) => form.set('experience', e.target.value)}
                              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; }}
                              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-border)'; }} />
                          </div>
                        </>
                      )}

                      {activeRole === 'volunteer' && (
                        <div className="mb-4">
                          <label htmlFor="gurukujoin-f11" style={labelStyle}>Skills / Area of Contribution *</label>
                          <select id="gurukujoin-f11" required style={{ ...inputStyle, cursor: 'pointer' }} onChange={(e) => form.set('skills', e.target.value)}
                            onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-orange)'; }}
                            onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-border)'; }}>
                            <option value="">Select your area</option>
                            <option>Technology & App Development</option>
                            <option>Graphic Design & Media</option>
                            <option>Community Outreach</option>
                            <option>Event Organisation</option>
                            <option>Translation & Content</option>
                            <option>Administrative Support</option>
                            <option>Other</option>
                          </select>
                        </div>
                      )}

                      <div className="mb-6">
                        <label htmlFor="gurukujoin-f12" style={labelStyle}>Message / Why do you want to join?</label>
                        <textarea id="gurukujoin-f12" rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell us about yourself and your motivation..." onChange={(e) => form.set('message', e.target.value)}
                          onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--si-orange)'; }}
                          onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--si-border)'; }} />
                      </div>

                      {/* Document verification */}
                      <div style={{ background: 'var(--si-surface-subtle)', border: '1px solid var(--si-border)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                        VERIFICATION DOCUMENTS (OPTIONAL)</p>
                        
                          Attach a government-issued ID or any supporting document to expedite your 48–72 hr activation. Kept strictly confidential.
                        </p>
                        
                      </div>
                      {/* Voluntary donation prompt */}
                      <div style={{ background: 'linear-gradient(135deg,var(--si-orange-tint),#FFFBF5)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div>
                          VOLUNTARY DONATION</p>
                          Support the mission — any amount helps. Not required for enrollment.</p>
                        </div>
                        Donate →</a>
                      </div>
                      
                        {form.state === 'loading' ? (
                          <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Submitting…</>
                        ) : (
                          <>{t('join.submit')}</>
                        )}
                      </button>

                      
                        {t('join.activation')}
                      </p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Member Benefits ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--si-orange-tint) 0%, #FEF3C7 50%, var(--si-orange-tint) 100%)', borderTop: '1px solid var(--si-orange-light)', borderBottom: '1px solid var(--si-orange-light)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              Monthly Donor Benefits</p>
              
                Join as a Monthly Donor.<br />
                <span className="text-si-orange-ink">Unlock the Full Digital Library.</span>
              </h2>
              
                A monthly contribution of $25 or more sustains the campus fund <em>and</em> gives you free access to all 16 titles in the Sanatan International Digital Library — books, audio guides, and video courses.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              { icon: '📚', title: 'Full Digital Library', desc: 'All 6 digital books, 5 audio guides, and 5 video courses — free, forever, as long as your membership is active.', highlight: true },
              { icon: '🎧', title: 'Audio & Video Courses', desc: 'Vedic Chanting, Bhagavad Gita audio, Pranayama manual, Yoga fundamentals, and the Dharma in the Digital Age video series.', highlight: true },
              { icon: '🕉', title: 'Monthly Satsang Call', desc: 'Join a live community call with Pankaj Tyagi and the Sanatan International team — Q&A, guidance, and community connection.' },
              { icon: '📜', title: 'Campus Progress Reports', desc: 'Quarterly PDF reports on land acquisition progress, fund utilisation, and campus design updates — before they go public.' },
              { icon: '🌱', title: 'Founding Donor Register', desc: 'Your name is inscribed in the permanent Founding Donor register, displayed in the campus entrance hall when built.' },
              { icon: '🎓', title: 'Priority Enrollment', desc: 'Monthly donors receive priority enrollment for new Gurukul cohorts and early access to new programs before general registration.' },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 60}>
                <div style={{ background: b.highlight ? 'var(--si-card)' : 'rgba(255,255,255,0.6)', border: b.highlight ? '2px solid var(--si-orange-light)' : '1px solid rgba(249,115,22,0.15)', borderRadius: '16px', padding: '24px', boxShadow: b.highlight ? '0 4px 20px rgba(249,115,22,0.12)' : 'none', position: 'relative', overflow: 'hidden' }}>
                  {b.highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--si-orange), #FBBF24)' }} />}
                  <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '10px' }}>{b.icon}</span>
                  {b.title}</p>
                  {b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                
                  Become a Monthly Donor — From $25/month →
                </a>
                
                  Browse the Digital Library →
                </a>
              </div>
              
                Cancel anytime · No hidden fees · 100% goes to the campus fund
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why join */}
      <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              
                Why the Gurukul is different
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Real teachers, not chatbots', desc: 'Every class is taught by a credentialed human being who knows your name, tracks your progress, and cares about your growth.' },
              { title: 'Small cohorts, personal attention', desc: 'Maximum 20 students per cohort. Your teacher will know your name by week 2. This is not a MOOC.' },
              { title: 'Competency-based, not grade-based', desc: 'You advance when you demonstrate mastery — not when the calendar says so. No pressure. No comparison.' },
              { title: 'Ancient wisdom, modern delivery', desc: 'The content is 5,000 years old. The delivery is 2025. Live Zoom, recorded library, parent dashboard, mobile app.' },
              { title: 'Full financial transparency', desc: 'Every rupee is accounted for publicly. You can read our quarterly financial reports before you pay a single rupee.' },
              { title: 'Community for life', desc: 'Gurukul graduates join a global community of seekers, practitioners, and changemakers. The learning never stops.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                  {item.title}</p>
                  {item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RelatedPages current="/gurukul/join" picks={['/gurukul/programs', '/gurukul/digital', '/donate']} />
    </Layout>
  );
}
