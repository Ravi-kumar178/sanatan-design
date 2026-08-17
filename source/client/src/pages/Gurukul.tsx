import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { Link } from 'wouter';
function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }
const levels = [
  { level: 'Level 1', title: 'Foundation', weeks: '12 Weeks', desc: 'Sanskrit basics, 25 shlokas with meaning, Surya Namaskar, basic pranayama, Vedic math introduction.', price: '₹1,499/mo' },
  { level: 'Level 2', title: 'Consciousness', weeks: '16 Weeks', desc: 'Yoga philosophy, Bhagavad Gita study, anatomy & physiology, creative arts, community service.', price: '₹1,499/mo' },
  { level: 'Level 3', title: 'Applied Skills', weeks: '20 Weeks', desc: 'Ayurveda basics, advanced Sanskrit, leadership development, research methodology, entrepreneurship.', price: '₹1,499/mo' },
  { level: 'Level 4', title: 'Acharya', weeks: 'Ongoing', desc: 'Teaching certification, advanced research, community leadership, curriculum development.', price: 'Contact Us' },
];
export default function Gurukul() {
  return (
    <Layout>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", href: "/" }, { name: "Gurukul", href: "/gurukul" }]} />
      <section className="section-dark pt-32 pb-20">
        <div className="container max-w-3xl">
          <Label c="Digital Gurukul" />
          The Foundation</h1>
          Education as character, competence, and consciousness.</p>
          
            Our 4-level Gurukul curriculum integrates spiritual, academic, physical, creative, and life skills — taught in the classical tradition, delivered through modern platforms. Open to all ages, all backgrounds.
          </p>
        </div>
      </section>
      <section className="section-cream py-20">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <Label c="Curriculum Levels" />
            Four Levels of Mastery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map((l, i) => (
              <div key={l.level} className={`reveal delay-${(i + 1) * 100} card-white p-8`}>
                <div className="flex items-center justify-between mb-4">
                  <Label c={l.level} />
                  {l.weeks}</span>
                </div>
                {l.title}</h3>
                {l.desc}</p>
                <div className="flex items-center justify-between">
                  {l.price}</span>
                  <Link href="/donate" className="btn-orange text-xs py-2 px-4">Enroll</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
