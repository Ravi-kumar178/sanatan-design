// Sanatan International — Contact Page
// Features: inquiry form with subject dropdown, embedded Google Maps iframe,
// contact info cards, loading/success/error states, BreadcrumbList JSON-LD
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitForm, hasFormEndpoint, INBOXES } from '@/lib/formDelivery';

// ─── BreadcrumbList JSON-LD ───────────────────────────────────────────────────
function BreadcrumbJsonLd({ crumbs }: { crumbs: { name: string; href: string }[] }) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `https://www.sanataninternational.org${c.href}`,
      })),
    };
    const id = 'breadcrumb-schema';
    document.querySelector(`script[data-schema="${id}"]`)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', id);
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    return () => { document.querySelector(`script[data-schema="${id}"]`)?.remove(); };
  }, []);
  return null;
}

const SUBJECTS = [
  'General Inquiry',
  'Gurukul Enrollment',
  'Donations & Land Fund',
  'Volunteer Program',
  'Media & Press',
  'Digital Welfare Suite',
  'Ayurveda Research',
  'Campus & Events',
  'Partnership / Collaboration',
  'Other',
];

type FormState = 'idle' | 'loading' | 'success' | 'error';

function Label({ c }: { c: string }) {
  return <p className="label-chip mb-3">{c}</p>;
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>('idle');
  const [via, setVia] = useState<'endpoint' | 'mailto' | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = lang === 'hi' ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.';
    if (!form.subject) e.subject = lang === 'hi' ? 'कृपया एक विषय चुनें।' : 'Please select a subject.';
    if (!form.message.trim() || form.message.trim().length < 20) e.message = lang === 'hi' ? 'कृपया कम से कम 20 अक्षर लिखें।' : 'Please write at least 20 characters.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setState('loading');

    const result = await submitForm({
      formName: 'Contact enquiry',
      inbox: 'general',
      data: { name: form.name, email: form.email, subject: form.subject, message: form.message },
    });

    if (result.ok) {
      setVia(result.via);
      setState('success');
    } else {
      setErrors({ submit: result.error });
      setState('error');
    }
  };

  const reset = () => { setForm({ name: '', email: '', subject: '', message: '' }); setState('idle'); setErrors({}); };

  const inputStyle = (field: string) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1.5px solid ${errors[field] ? 'var(--si-danger)' : 'var(--si-border)'}`,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    color: 'var(--si-text)',
    background: 'var(--si-card)',
    outline: 'none',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
  });

  return (
    <Layout>
      <PageMeta
        title="Contact Us"
        description="Get in touch with Sanatan International. Reach out about Gurukul enrollment, donations, volunteering, media inquiries, or any other question."
        url="/contact"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }]} />

      {/* ── Hero ── */}
      <section className="section-dark pt-32 pb-20 texture-dark">
        <div className="container max-w-3xl">
          <Label c="Get in Touch" />
          
            We'd love to<br />
            <span className="text-si-orange-ink">hear from you.</span>
          </h1>
          
            Whether you have a question about enrollment, want to support the Land Fund, or are interested in collaborating — our team responds within 2 business days.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'email', label: lang === 'hi' ? 'सामान्य पूछताछ' : 'General Inquiries', value: 'info@sanataninternational.org', href: 'mailto:info@sanataninternational.org' },
              { icon: '🙏', label: lang === 'hi' ? 'दान' : 'Donations', value: 'donate@sanataninternational.org', href: 'mailto:donate@sanataninternational.org' },
              { icon: 'gurukul', label: lang === 'hi' ? 'गुरुकुल नामांकन' : 'Gurukul Enrollment', value: 'gurukul@sanataninternational.org', href: 'mailto:gurukul@sanataninternational.org' },
              { icon: 'press', label: lang === 'hi' ? 'मीडिया और प्रेस' : 'Media & Press', value: 'press@sanataninternational.org', href: 'mailto:press@sanataninternational.org' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="card-white p-5 flex flex-col gap-2"
                style={{ textDecoration: 'none', transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 8px 24px rgba(249,115,22,0.1)';
                  el.style.borderColor = 'var(--si-orange-light)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '';
                  el.style.borderColor = '';
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                {item.label}</p>
                {item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main: Form + Map ── */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* ── Inquiry Form ── */}
            <div>
              <Label c={lang === 'hi' ? 'संदेश भेजें' : 'Send a Message'} />
              
                Contact our team
              </h2>
              
                All fields are required. We respond within 2 business days.
              </p>

              {state === 'success' ? (
                <div style={{ background: 'var(--si-success-tint)', border: '1.5px solid #86EFAC', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
                  <div className="text-4xl mb-4">🙏</div>
                  {via === 'mailto' ? 'Almost there' : 'Message received'}</h3>
                  
                    {via === 'mailto' && 'Your email app should have opened with the message ready — press send to deliver it. '}
                    {lang === 'hi' ? `धन्यवाद, ${form.name}। हम 2 कार्य दिवसों के भीतर ${form.email} पर उत्तर देंगे।` : `Thank you, ${form.name}. We'll reply to ${form.email} within 2 business days.`}
                  </p>
                  "सर्वे भवन्तु सुखिनः"</p>
                  May all beings be happy.</p>
                  
                    {lang === 'hi' ? 'एक और संदेश भेजें' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      
                        {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                      </label>
                      <input id="contact-f1"
                        type="text"
                        placeholder={lang === 'hi' ? 'आपका पूरा नाम' : 'Your full name'}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={inputStyle('name')}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.name ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                        disabled={state === 'loading'}
                      />
                      {errors.name && {errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      
                        {lang === 'hi' ? 'ईमेल पता *' : 'Email Address *'}
                      </label>
                      <input id="contact-f2"
                        type="email"
                        placeholder={lang === 'hi' ? 'आपका@ईमेल.com' : 'your@email.com'}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={inputStyle('email')}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.email ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                        disabled={state === 'loading'}
                      />
                      {errors.email && {errors.email}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      
                        {lang === 'hi' ? 'विषय *' : 'Subject *'}
                      </label>
                      <select id="contact-f3"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        style={{ ...inputStyle('subject'), appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px' }}
                        onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                        onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = errors.subject ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLSelectElement).style.boxShadow = 'none'; }}
                        disabled={state === 'loading'}
                      >
                        <option value="">{lang === 'hi' ? 'विषय चुनें…' : 'Select a subject…'}</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && {errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      
                        {lang === 'hi' ? 'संदेश *' : 'Message *'}
                      </label>
                      <textarea id="contact-f4"
                        placeholder={lang === 'hi' ? 'हम आपकी कैसे सहायता कर सकते हैं…' : 'Tell us how we can help…'}
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '120px' }}
                        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--si-orange)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = errors.message ? 'var(--si-danger)' : 'var(--si-border)'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none'; }}
                        disabled={state === 'loading'}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.message ? {errors.message}</p> : <span />}
                        
                          {form.message.length} {lang === 'hi' ? 'अक्षर' : 'chars'}
                        </p>
                      </div>
                    </div>

                    {/* Error state */}
                    {state === 'error' && (
                      /* errors.submit carries the specific reason from the delivery layer */
                      <div style={{ background: 'var(--si-danger-tint)', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 16px' }}>
                        
                          {lang === 'hi' ? 'कुछ गलत हो गया। कृपया पुनः प्रयास करें या हमें सीधे ईमेल करें' : 'Something went wrong. Please try again or email us directly at'}{' '}
                          <a className="text-si-orange-ink" href="mailto:info@sanataninternational.org">info@sanataninternational.org</a>.
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    
                      {state === 'loading' ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                          {lang === 'hi' ? 'भेजा जा रहा है…' : 'Sending…'}
                        </>
                      ) : (
                        lang === 'hi' ? 'संदेश भेजें →' : 'Send Message →'
                      )}
                    </button>

                    
                      🔒 Your information is never shared with third parties.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* ── Map + Location Info ── */}
            <div className="space-y-6">
              <div>
                <Label c="Our Location" />
                
                  El Sabrante, California
                </h2>
                
                  Our future campus is located in El Sabrante, Contra Costa County — in the East Bay Area of California, accessible from Richmond, San Pablo, and Oakland.
                </p>
              </div>

              {/* Embedded map — El Sabrante, CA */}
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1.5px solid var(--si-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <iframe
                  title="El Sabrante, California — Sanatan International Campus Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25162.38!2d-122.3346!3d37.9627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80857e7c8e1a3f8b%3A0x9c1a3b4f5e6d7a8b!2sEl%20Sobrante%2C%20CA%2094803!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                  width="100%"
                  height="340"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '📍', label: 'Campus Location', value: 'El Sabrante, Contra Costa County, CA 94803' },
                  { icon: '🕐', label: 'Response Time', value: 'Within 2 business days' },
                  { icon: '🌐', label: 'Languages', value: 'English, Hindi, Sanskrit' },
                  { icon: 'phone', label: 'Community Calls', value: 'Sundays 10am–12pm PST (Zoom)' },
                ].map((item) => (
                  <div key={item.label} className="card-white p-4">
                    <span className="text-xl block mb-2">{item.icon}</span>
                    {item.label}</p>
                    {item.value}</p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="card-white p-5">
                Follow us</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Facebook', href: 'https://facebook.com/sanataninternational', color: '#1877F2' },
                    { label: 'Instagram', href: 'https://instagram.com/sanataninternational', color: '#E1306C' },
                    // X's brand mark is black on light and white on dark, so it is
                    // the one social colour that has to follow the theme.
                    { label: 'X / Twitter', href: 'https://x.com/sanatanint', color: 'var(--si-social-x)' },
                    { label: 'YouTube', href: 'https://youtube.com/@sanataninternational', color: '#FF0000' },
                  ].map((s) => (
                    
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sanskrit CTA ── */}
      <section style={{ background: 'var(--si-surface)', borderTop: '1px solid var(--si-border)' }}>
        <div className="container py-12 text-center">
          "वसुधैव कुटुम्बकम्"</p>
          
            The world is one family.
          </p>
          
            We are building a global community rooted in Vedic wisdom. Your message, your question, and your support — all are welcome here.
          </p>
        </div>
      </section>
    </Layout>
  );
}
