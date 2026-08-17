// LegalPages.tsx — Privacy Policy, Terms of Service, Cookie Policy, Accessibility
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';

function LegalPage({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = `${title} — Sanatan International`;
    window.scrollTo(0, 0);
  }, [title]);
  return (
    <Layout>
      <section className="py-20 texture-cream" style={{ background: 'var(--si-cream)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            ← Back to Home</Link>
          </div>
          <div style={{ marginBottom: '3rem' }}>
            Legal</p>
            {title}</h1>
            Last updated: {lastUpdated}</p>
          </div>
          
            {children}
          </div>
          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--si-orange-tint)', borderRadius: '16px', border: '1px solid var(--si-orange-light)' }}>
            Questions?</p>
            
              Contact us at info@sanataninternational.org</a> or visit our Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  {children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: '1rem' }}>{children}</p>
);
const UL = ({ items }: { items: string[] }) => (
  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
    {items.map((item, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{item}</li>)}
  </ul>
);

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="July 2026">
      <P>Sanatan International ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at sanataninternational.org.</P>
      <H2>Information We Collect</H2>
      <P>We collect information you voluntarily provide, including:</P>
      <UL items={['Name and email address when you subscribe to our newsletter or join the community', 'Contact details when you submit an inquiry through our Contact page', 'Enrollment application details when you apply to Gurukul programs', 'Donation information when you contribute to the Land Fund']} />
      <P>We also automatically collect certain technical information such as IP address, browser type, and pages visited through standard web analytics tools.</P>
      <H2>How We Use Your Information</H2>
      <UL items={['To send you newsletters, program updates, and community announcements you have opted into', 'To process and respond to enrollment applications and inquiries', 'To process donations and issue receipts', 'To improve our website and services', 'To comply with legal obligations']} />
      <H2>Data Sharing</H2>
      <P>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our activities, subject to confidentiality agreements.</P>
      <H2>Cookies</H2>
      <P>We use essential cookies for website functionality and analytics cookies to understand how visitors use our site. You may disable cookies in your browser settings, though some features may not function correctly.</P>
      <H2>Data Retention</H2>
      <P>We retain your information for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. You may request deletion of your data at any time by contacting us.</P>
      <H2>Your Rights</H2>
      <P>You have the right to access, correct, or delete your personal data. You may also withdraw consent for communications at any time by clicking "unsubscribe" in any email or contacting us directly.</P>
      <H2>Contact</H2>
      <P>For privacy-related questions, contact us at <a className="text-si-orange-ink" href="mailto:info@sanataninternational.org">info@sanataninternational.org</a>.</P>
    </LegalPage>
  );
}

export function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="July 2026">
      <P>By accessing or using the Sanatan International website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</P>
      <H2>Use of the Website</H2>
      <P>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the site. You must not use the site to transmit any harmful, offensive, or illegal content.</P>
      <H2>Intellectual Property</H2>
      <P>All content on this website — including text, images, logos, and design — is the property of Sanatan International or its content suppliers and is protected by copyright law. You may not reproduce, distribute, or create derivative works without our express written permission.</P>
      <H2>Donations</H2>
      <P>Donations made through this website are voluntary contributions to Sanatan International's Land Acquisition Fund and general operations. All donations are non-refundable unless required by applicable law. We are committed to using donations transparently, as documented in our quarterly Financial Reports.</P>
      <H2>Enrollment Applications</H2>
      <P>Submission of an enrollment application does not guarantee acceptance. Applications are reviewed by our team and activation occurs within 48–72 hours of approval. We reserve the right to decline applications at our discretion.</P>
      <H2>Disclaimer of Warranties</H2>
      <P>This website is provided "as is" without warranties of any kind. We do not warrant that the site will be uninterrupted, error-free, or free of viruses. The information on this site is for general informational purposes and does not constitute medical, legal, or financial advice.</P>
      <H2>Limitation of Liability</H2>
      <P>To the fullest extent permitted by law, Sanatan International shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.</P>
      <H2>Governing Law</H2>
      <P>These terms are governed by the laws of the State of California, United States. Any disputes shall be resolved in the courts of Contra Costa County, California.</P>
      <H2>Changes to These Terms</H2>
      <P>We may update these Terms of Service from time to time. Continued use of the website after changes constitutes acceptance of the revised terms.</P>
    </LegalPage>
  );
}

export function CookiePolicy() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="July 2026">
      <P>This Cookie Policy explains how Sanatan International uses cookies and similar tracking technologies on our website.</P>
      <H2>What Are Cookies?</H2>
      <P>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you use the site.</P>
      <H2>Types of Cookies We Use</H2>
      <UL items={['Essential cookies: Required for the website to function correctly, such as language preference (EN/हिंदी) and session management.', 'Analytics cookies: Used to understand how visitors interact with our site (page views, session duration). We use privacy-respecting analytics that do not share data with advertising networks.', 'Preference cookies: Remember your choices, such as language selection.']} />
      <H2>Managing Cookies</H2>
      <P>You can control cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Note that disabling essential cookies may affect website functionality.</P>
      <H2>Third-Party Cookies</H2>
      <P>We do not use third-party advertising cookies. Our analytics provider operates under strict data minimisation principles.</P>
      <H2>Updates</H2>
      <P>We may update this Cookie Policy as our practices evolve. The "last updated" date at the top of this page reflects the most recent revision.</P>
    </LegalPage>
  );
}

export function AccessibilityStatement() {
  return (
    <LegalPage title="Accessibility Statement" lastUpdated="July 2026">
      <P>Sanatan International is committed to making our website accessible to all users, including those with disabilities. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.</P>
      <H2>Our Commitment</H2>
      <UL items={['All images include descriptive alt text', 'Colour contrast ratios meet WCAG AA standards', 'The website is navigable by keyboard', 'Language is set in the HTML for screen reader compatibility', 'Forms include proper labels and error messages']} />
      <H2>Known Limitations</H2>
      <P>Some older PDF documents (such as quarterly financial reports) may not be fully accessible. We are working to remediate these and provide accessible alternatives on request.</P>
      <H2>Feedback</H2>
      <P>If you experience accessibility barriers on our website, please contact us at <a className="text-si-orange-ink" href="mailto:info@sanataninternational.org">info@sanataninternational.org</a>. We aim to respond within 5 business days.</P>
      <H2>Enforcement</H2>
      <P>If you are not satisfied with our response, you may contact the US Access Board or your local disability rights organisation for further assistance.</P>
    </LegalPage>
  );
}
