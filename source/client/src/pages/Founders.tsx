import Layout from '@/components/Layout';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { Link } from 'wouter';
import Image from "@/components/Image";

function Label({ c }: { c: string }) { return <p className="label-chip mb-3">{c}</p>; }

const founders = [
  {
    name: 'Pankaj Tyagi',
    pos: 'Founder & Chief Visionary',
    img: '/Images/pankaj_35d7f5c2.png',
    quote: '"Ancient wisdom is not a relic. It is a living operating system — and we are simply installing it for the modern world."',
    desc: 'Pankaj Tyagi is the founding mind behind Sanatan International. The vision, the mission, the curriculum architecture, the campus plan, the digital welfare suite — every pillar of this organisation traces back to his thinking and years of quiet, dedicated work. A practitioner of Vedic sciences and a student of classical education systems, Pankaj started this initiative with a small group of Bay Area families in 2024 and has since built it into a structured, transparent public-benefit organisation. He does not seek recognition — he seeks results.',
    stats: [{ v: '4+', l: 'Programs Built' }, { v: '2024', l: 'Founded' }, { v: '200+', l: 'Students' }],
  },
  {
    name: 'Vineeta',
    pos: 'Co-Founder & Program Director',
    img: '/Images/vineeta_c1121350.png',
    quote: '"Every child deserves to know the depth of the civilisation they come from."',
    desc: 'Expert in Āyurveda and classical education systems. Vineeta leads curriculum development and wellness research, ensuring all programs maintain the highest standards of classical authenticity and practical relevance for diaspora families.',
    stats: [{ v: '12+', l: 'Courses' }, { v: '5+', l: 'Research Papers' }, { v: '200+', l: 'Students' }],
  },
];

export default function Founders() {
  return (
    <Layout>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", href: "/" }, { name: "Founders & Advisors", href: "/founders" }]} />

      {/* Hero with campus vision image */}
      <section className="section-dark pt-32 pb-20">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/Images/Gemini_Generated_Image_s2bwyus2bwyus2bw_05f20977.png)', backgroundSize: 'cover', backgroundPosition: 'center 30%', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,25,35,0.7) 0%, rgba(15,25,35,0.9) 100%)' }} />
        <div className="container max-w-3xl">
          <Label c="Leadership" />
          Visionaries &amp; Guardians</h1>
          
            Built from conviction, not capital. The people behind Sanatan International started with a simple belief: that every Indian family abroad deserves access to their roots.
          </p>
        </div>
      </section>

      <section className="section-cream py-20">
        <div className="container">
          <div className="space-y-16">
            {founders.map((f, i) => (
              <div key={f.name} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center reveal`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <Image src={f.img} alt={f.name} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <Label c={i === 0 ? 'Founder & Visionary' : 'Co-Founder'} />
                  {f.name}</h2>
                  <p className="label-chip mb-5">{f.pos}</p>
                  {(f as any).quote && (
                    
                      {(f as any).quote}
                    </blockquote>
                  )}
                  {f.desc}</p>
                  <div className="flex gap-8 mb-6">
                    {f.stats.map((s) => (
                      <div key={s.l}>
                        {s.v}</p>
                        {s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Campus Vision section */}
          <div className="mt-24">
            <div className="text-center mb-10">
              <Label c="The Campus Vision" />
              
                What we are building
              </h2>
              
                A 33-acre campus in El Sabrante, California — conceived by Pankaj Tyagi as a permanent home for Sanatan Dharma in the West. These are the architectural vision renders.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { src: '/Images/Gemini_Generated_Image_lu0mc9lu0mc9lu0m_d52a8569.png', caption: 'Aerial campus overview — 33 acres, El Sabrante, CA' },
                { src: '/Images/Gemini_Generated_Image_43i66843i66843i6_4395d49e.png', caption: 'Campus with Shiva statue and Gurukul buildings' },
                { src: '/Images/Gemini_Generated_Image_i9blhii9blhii9bl_57122d19.png', caption: 'Campus entrance — "Sanatan International · Eternal Way of Living"' },
                { src: '/Images/Gemini_Generated_Image_lqjheulqjheulqjh_494d4235.png', caption: 'Research & learning centre with organic farm' },
              ].map(({ src, caption }) => (
                <div key={caption} className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                  <Image src={src} alt={caption} className="w-full h-full object-cover" />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', padding: '16px 20px' }}>
                    {caption}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/donate" className="btn-orange">Support the Campus Fund</Link>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}
