import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { Link } from 'wouter';
import PageMeta from '@/components/PageMeta';
import Image from "@/components/Image";

function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }

export default function Vision() {
  return (
    <Layout>
      <PageMeta title="Vision & Mission — Sanatan International" description="Our vision: a world where ancient human sciences serve all of humanity. Four strategic objectives for education, health, technology, and cultural continuity." url="/vision" type="website" />
      <BreadcrumbJsonLd crumbs={[{ name: "Home", href: "/" }, { name: "Vision & Mission", href: "/vision" }]} />
      <section className="section-dark pt-32 pb-20" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/Gemini_Generated_Image_lu0mc9lu0mc9lu0m_d52a8569.png)', backgroundSize: 'cover', backgroundPosition: 'center 30%', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(15,25,35,0.97) 0%, rgba(15,25,35,0.85) 100%)' }} />
        <div className="container max-w-3xl">
          <div style={{ position: 'relative', zIndex: 1 }}>
          <Label c="Vision & Mission" />
          Our Vision</h1>
          
            A world where ancient human sciences serve all of humanity — freely, transparently, and with dignity.
          </p>
          <p className="font-devanagari text-3xl" style={{ color: 'rgba(249,115,22,0.3)' }}>सर्वे भवन्तु सुखिनः</p>
          </div>
        </div>
      </section>
      {/* Mission image banner */}
      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <Image src="/Images/Gemini_Generated_Image_43i66843i66843i6_4395d49e.png" alt="Sanatan International campus vision" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,25,35,0.88) 0%, rgba(15,25,35,0.45) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 10%' }}>
          <div style={{ maxWidth: '500px' }}>
            Our Mission</p>
            
              To build permanent institutions — physical and digital — that make the wisdom of Sanatan Dharma accessible to every Indian family in the world.
            </p>
          </div>
        </div>
      </div>
      <section className="section-cream py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { n: '4.1', title: 'Education & Consciousness', shloka: 'अभ्यासवैराग्याभ्यां तन्निरोधः', src: 'Yoga Sutra 1.12', desc: 'Gurukul-based education developing character, competence, and consciousness for all ages.', img: '/Images/foundation-education_26fd0555.jpg' },
              { n: '4.2', title: 'Health & Wellness', shloka: 'स्वस्थस्य स्वास्थ्य रक्षणं', src: 'Charaka Samhita', desc: 'Preventive healthcare based on Ayurveda, diet, lifestyle, and mental well-being.', img: '/Images/foundation-health_2f1d033a.jpg' },
              { n: '4.3', title: 'Ethical Technology', shloka: 'योगश्चित्तवृत्तिनिरोधः', src: 'Yoga Sutra 1.2', desc: 'Digital tools that protect human dignity, reduce harm, and increase access.', img: '/Images/foundation-technology_ef4a72b7.jpg' },
              { n: '4.4', title: 'Cultural Continuity', shloka: 'वसुधैव कुटुम्बकम्', src: 'Maha Upanishad 6.72', desc: 'Preserving and transmitting the living traditions of Sanatan Dharma.', img: '/Images/campus-drone_f20a22ae.jpg' },
            ].map((v) => (
              <div key={v.n} className="card-white reveal" style={{ overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--si-border)' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <Image src={v.img} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
                  Objective {v.n}</span>
                </div>
                <div className="p-6">
                  {v.title}</h2>
                  <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                    {v.shloka}</p>
                    — {v.src}</p>
                  </div>
                  {v.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/donate" className="btn-orange">Support the Mission</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
