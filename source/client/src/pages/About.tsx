import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { Link } from 'wouter';
import Image from "@/components/Image";

function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }

export default function About() {
  return (
    <Layout>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <section className="section-dark pt-32 pb-20" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url(/Images/Gemini_Generated_Image_43i66843i66843i6_4395d49e.png)", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.12 }} />
        <div className="container max-w-3xl">
          <Label c="About the Centre" />
          
            Who We Are
          </h1>
          
            A public-benefit initiative preserving ancient human sciences through modern execution.
          </p>
          
            Sanatan International is a Centre for Human Flourishing — dedicated to making the timeless wisdom of Sanatan Dharma accessible, applicable, and beneficial for all of humanity. We are headquartered in El Sabrante, California, serving the Bay Area and the global Indian diaspora.
          </p>
        </div>
      </section>
      {/* Image strip */}
      <section style={{ background: 'var(--si-surface)', padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '280px', overflow: 'hidden' }}>
          <Image src="/Images/campus-section_f3504bea.jpg" alt="Sanatan International campus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Image src="/Images/teacher-sanskrit_b92cc875.jpg" alt="Sanskrit teacher" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Image src="/Images/volunteer-community_33a9555e.jpg" alt="Community gathering" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {/* Founder mention — natural, not boastful */}
      <section style={{ background: 'var(--si-card)', borderBottom: '1px solid var(--si-surface-alt)' }}>
        <div className="container py-12 max-w-4xl">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Image src="/Images/pankaj_35d7f5c2.png" alt="Pankaj Tyagi, Founder"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0, border: '3px solid var(--si-orange-light)' }} />
            <div style={{ flex: 1, minWidth: '260px' }}>
              
                "Ancient wisdom is not a relic. It is a living operating system — and we are simply installing it for the modern world."
              </p>
              
                PANKAJ TYAGI · Founder & Chief Visionary, Sanatan International
              </p>
              
                The vision, curriculum, campus plan, and digital welfare suite were all conceived and developed by Pankaj Tyagi, who founded this organisation in 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: '01', title: 'Protection-first mindset', desc: 'We prioritize the safety and dignity of elders, immigrants, and families under pressure.' },
              { num: '02', title: 'Transparent governance', desc: 'All financial decisions, program outcomes, and governance actions are documented publicly.' },
              { num: '03', title: 'Technology as a shield', desc: 'Digital tools that reduce harm and increase access — never exploit or surveil.' },
              { num: '04', title: 'Classical authenticity', desc: 'Rigor, depth, and fidelity to source texts are non-negotiable.' },
              { num: '05', title: 'Community ownership', desc: 'Programs are designed with and for the communities they serve.' },
              { num: '06', title: 'Public benefit, always', desc: 'Every program and app is designed to serve the public — not generate profit.' },
            ].map((p) => (
              <div key={p.num} className="card-white p-6 reveal">
                <p className="label-chip mb-1">{p.num}</p>
                {p.title}</h2>
                {p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/founders" className="btn-orange">Meet the Founders</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
