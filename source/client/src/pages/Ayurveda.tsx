import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { Link } from 'wouter';
function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }
export default function Ayurveda() {
  return (
    <Layout>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", href: "/" }, { name: "Ayurveda Research", href: "/ayurveda" }]} />
      <section className="section-dark pt-32 pb-20">
        <div className="container max-w-3xl">
          <Label c="Ayurveda Research" />
          Preventive Health</h1>
          Rooted in tradition. Relevant for today.</p>
          <p className="font-devanagari text-3xl mb-2" style={{ color: 'rgba(249,115,22,0.4)' }}>स्वस्थस्य स्वास्थ्य रक्षणं</p>
          <p className="font-display italic" style={{ color: 'rgba(255,255,255,0.55)' }}>"The primary goal is to preserve the health of the healthy." — Charaka Samhita</p>
        </div>
      </section>
      <section className="section-cream py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Charaka Samhita', desc: 'Internal medicine protocols and preventive health frameworks documented and translated for modern application.', icon: '/Images/icon-scroll_bd9f434f.png' },
              { title: 'Ashtanga Hridayam', desc: 'Daily and seasonal routines (dinacharya and ritucharya) for optimal health across all age groups.', icon: '🌅' },
              { title: 'Sushruta Samhita', desc: 'Surgical traditions and herbal medicine documentation with modern clinical cross-referencing.', icon: '/Images/icon-ayurveda-mortar_16433074.png' },
              { title: 'Nidana Sthana', desc: 'Classical diagnostic frameworks adapted for community health screening and preventive guidance.', icon: '/Images/icon-research_3199c3d9.png' },
            ].map((item, i) => (
              <div key={item.title} className={`reveal delay-${(i + 1) * 100} card-white p-8`}>
                <div className="text-3xl mb-4">{item.icon}</div>
                {item.title}</h2>
                {item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/donate" className="btn-orange">Support Ayurveda Research</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
