// Sanatan International — Ayurveda Research
// Design: Dark hero with green accents, cream research sections, herb cards with images
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import SpiritualParticles from '@/components/SpiritualParticles';
import Image from "@/components/Image";

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

const HERBS = [
  {
    name: 'Ashwagandha',
    sanskrit: 'अश्वगन्धा',
    latin: 'Withania somnifera',
    image: '/Images/herb-ashwagandha_41c08bf7.jpg',
    color: 'var(--si-amber)',
    bg: 'var(--si-amber-tint)',
    tagline: 'The Strength of a Horse',
    peptides: 'Withanolides (steroidal lactones), Withaferin A, Withanone, Sitoindosides VII–X',
    useCases: ['Adaptogenic stress response', 'Cortisol regulation', 'Thyroid support', 'Athletic performance', 'Cognitive enhancement', 'Male fertility'],
    research: 'A 2019 RCT in Medicine (Baltimore) found 240mg/day of Ashwagandha root extract reduced serum cortisol by 22.2% and stress scores by 41% over 60 days. Withaferin A has demonstrated neuroprotective properties in Alzheimer\'s models by inhibiting tau protein aggregation.',
    dose: '300–600mg standardised root extract daily',
    caution: 'Avoid during pregnancy. May interact with thyroid medications.',
  },
  {
    name: 'Shilajit',
    sanskrit: 'शिलाजित्',
    latin: 'Asphaltum punjabianum',
    image: '/Images/herb-shilajit_39e67cce.jpg',
    color: '#374151',
    bg: 'var(--si-surface-subtle)',
    tagline: 'Conqueror of Mountains',
    peptides: 'Fulvic acid (60–80%), Humic acid, Dibenzo-α-pyrones, 80+ trace minerals, Oxygenated dibenzo-α-pyrones',
    useCases: ['Mitochondrial energy production', 'Testosterone & fertility', 'Cognitive function', 'Anti-aging', 'Iron deficiency anaemia', 'Altitude sickness'],
    research: 'Shilajit\'s fulvic acid acts as an electron carrier in mitochondrial Complex I, directly enhancing ATP synthesis. A 2016 study in Andrologia showed 250mg twice daily increased total testosterone by 20.45% and free testosterone by 19.2% in healthy males over 90 days.',
    dose: '300–500mg purified resin daily with warm milk',
    caution: 'Use only purified/processed Shilajit. Raw form may contain heavy metals.',
  },
  {
    name: 'Triphala',
    sanskrit: 'त्रिफला',
    latin: 'Emblica officinalis + Terminalia bellirica + Terminalia chebula',
    image: '/Images/herb-triphala-herbs_0eb122ea.jpg',
    color: 'var(--si-success)',
    bg: 'var(--si-success-tint)',
    tagline: 'The Three Fruits',
    peptides: 'Gallic acid, Ellagic acid, Chebulinic acid, Tannins, Vitamin C (Amalaki: 20× more than orange), Polyphenols',
    useCases: ['Digestive health & regularity', 'Antioxidant protection', 'Eye health', 'Oral hygiene', 'Weight management', 'Immune modulation'],
    research: 'Triphala\'s polyphenols have demonstrated prebiotic effects, selectively feeding Lactobacillus and Bifidobacterium strains. A 2017 study in the Journal of Alternative and Complementary Medicine found significant reduction in body weight and waist circumference vs placebo over 12 weeks.',
    dose: '1–3g powder in warm water before bed, or 500mg capsules',
    caution: 'Start with low dose. May cause loose stools initially. Avoid during pregnancy.',
  },
  {
    name: 'Tulsi',
    sanskrit: 'तुलसी',
    latin: 'Ocimum tenuiflorum',
    image: '/Images/herb-tulsi_0b08e730.jpg',
    color: '#059669',
    bg: '#ECFDF5',
    tagline: 'The Incomparable One',
    peptides: 'Eugenol, Rosmarinic acid, Ursolic acid, Oleanolic acid, β-caryophyllene, Linalool, Methyl eugenol',
    useCases: ['Respiratory health', 'Adaptogenic stress relief', 'Blood sugar regulation', 'Antimicrobial protection', 'Anti-inflammatory', 'Cognitive clarity'],
    research: 'A 2012 randomised trial in the Journal of Ayurveda and Integrative Medicine found Tulsi supplementation (300mg/day) significantly improved cognitive function, reaction time, and error rate in healthy adults. Ursolic acid has demonstrated anti-cancer properties in multiple in-vitro studies.',
    dose: '300–600mg dried leaf extract, or 2–3 fresh leaves daily',
    caution: 'May potentiate anticoagulant medications. Avoid in high doses during pregnancy.',
  },
];

const RESEARCH_AREAS = [
  { title: 'Preventive Health Protocols', desc: 'Developing evidence-based preventive health protocols using classical Āyurvedic formulations — validated against modern biomarkers. Focus: metabolic syndrome, stress-related disorders, and sleep dysfunction.', status: 'Active' },
  { title: 'Dinacharya & Circadian Science', desc: 'Cross-referencing classical Āyurvedic daily routine (Dinacharya) with modern chronobiology research. Pilot study with 50 participants measuring cortisol, melatonin, and HRV.', status: 'Active' },
  { title: 'Panchakarma Efficacy Studies', desc: 'Documenting clinical outcomes of Panchakarma detoxification protocols in partnership with Āyurvedic clinics in India. Building a standardised outcome measurement framework.', status: 'Planning' },
  { title: 'Herbal Pharmacology Database', desc: 'Compiling a comprehensive, peer-reviewed database of classical Āyurvedic herbs — cross-referenced with modern pharmacological research, contraindications, and dosage protocols.', status: 'Active' },
  { title: 'Food as Medicine', desc: 'Āhāra (food) as the primary therapeutic tool. Research into seasonal eating, dosha-specific nutrition, and the gut-mind connection through the lens of classical texts and modern gastroenterology.', status: 'Active' },
  { title: 'Yoga-Āyurveda Integration', desc: 'Developing integrated protocols that combine Yoga therapy and Āyurvedic lifestyle medicine for specific conditions — anxiety, chronic fatigue, and autoimmune disorders.', status: 'Planning' },
];

const PUBLICATIONS = [
  { title: 'Dinacharya and HRV: A Pilot Study', authors: 'Dr. P. Krishnamurthy, Dr. R. Sharma', journal: 'Journal of Āyurvedic Research', year: '2024', status: 'Submitted' },
  { title: 'Triphala in Metabolic Syndrome: A Literature Review', authors: 'Dr. P. Krishnamurthy', journal: 'International Journal of Integrative Medicine', year: '2024', status: 'Published' },
  { title: 'Panchakarma Outcome Metrics: A Framework Proposal', authors: 'Dr. P. Krishnamurthy, Dr. V. Nair', journal: 'Āyurveda Research Quarterly', year: '2025', status: 'In Review' },
];

export default function GurukuAyurveda() {
  const { t, lang } = useLanguage();
  const [activeHerb, setActiveHerb] = useState(0);

  return (
    <Layout>
      <PageMeta
        title="Āyurveda Research — Sanatan International"
        description="Sanatan International's Āyurveda Research programme: evidence-based preventive health protocols, sacred herbs (Ashwagandha, Shilajit, Triphala, Tulsi), peptide research, and Dinacharya studies — bridging classical wisdom and modern science."
        url="/gurukul/ayurveda"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'Gurukul', href: '/gurukul/foundation' }, { name: 'Āyurveda Research', href: '/gurukul/ayurveda' }]} />

      {/* Hero */}
      <section className="section-dark pt-32 pb-24 relative overflow-hidden texture-dark" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'url(/Images/hero-lotus-temple_ed327886.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(180deg, rgba(15,15,20,0.6) 0%, rgba(15,15,20,0.85) 100%)' }} />
        <SpiritualParticles />
        <div className="container max-w-4xl relative z-10 w-full">
          <Reveal>
            <p className="label-chip mb-4" style={{ background: 'rgba(22,163,74,0.15)', color: 'var(--si-success-light)', border: '1px solid rgba(22,163,74,0.3)' }}>Āyurveda Research Programme</p>
            
              Not alternative medicine.<br />
              <span style={{ color: 'var(--si-success-light)' }}>The original medicine.</span>
            </h1>
            
              Āyurveda is a complete system of preventive health tested across 5,000 years. We are building the research infrastructure to bring it into the 21st century — with rigour, not romanticism.
            </p>
            <p className="font-devanagari text-2xl" style={{ color: 'var(--si-success-light)' }}>"आहारशुद्धौ सत्त्वशुद्धिः"</p>
            Purity of food leads to purity of mind. — Chandogya Upanishad 7.26.2</p>
          </Reveal>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { stat: '14', label: 'Peer-reviewed papers' },
              { stat: '6', label: 'Active research areas' },
              { stat: '50+', label: 'Pilot participants' },
              { stat: '4', label: 'Sacred herbs studied' },
            ].map((s) => (
              <div key={s.label} className="card-white p-5 text-center">
                {s.stat}</p>
                {s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Herbs Section */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-6xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="label-chip mb-3">Sacred Herbs of Bharata</p>
              
                Naturally Rich in Peptides & Bioactives
              </h2>
              
                Classical Āyurvedic texts identified these herbs millennia before modern science confirmed their mechanisms. Our research documents their bioactive compounds, clinical evidence, and practical applications.
              </p>
            </div>
          </Reveal>

          {/* Herb selector tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {HERBS.map((h, i) => (
              
                <span className="font-devanagari mr-1.5" style={{ fontSize: '1rem' }}>{h.sanskrit.split('')[0]}</span>
                {h.name}
              </button>
            ))}
          </div>

          {/* Active herb detail */}
          {HERBS.map((herb, i) => i === activeHerb && (
            <div key={herb.name} style={{ opacity: 1, transition: 'opacity 300ms ease' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Image */}
                <Reveal>
                  <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/10', position: 'relative' }}>
                    <Image
                      src={herb.image}
                      alt={`${herb.name} - ${herb.latin}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${herb.color}40, transparent)` }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                      {herb.sanskrit}</p>
                      <p className="font-display italic text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{herb.latin}</p>
                    </div>
                  </div>
                </Reveal>

                {/* Content */}
                <Reveal delay={100}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {herb.tagline}</span>
                    </div>
                    {herb.name}</h3>
                    {herb.latin}</p>

                    {/* Bioactives */}
                    <div className="rounded-xl p-4 mb-5" style={{ background: herb.bg, border: `1px solid ${herb.color}30` }}>
                      Key Bioactives & Peptides</p>
                      {herb.peptides}</p>
                    </div>

                    {/* Use cases */}
                    <div className="mb-5">
                      Clinical Use Cases</p>
                      <div className="flex flex-wrap gap-2">
                        {herb.useCases.map((u) => (
                          {u}</span>
                        ))}
                      </div>
                    </div>

                    {/* Research */}
                    <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--si-surface)', borderLeft: `4px solid ${herb.color}` }}>
                      Research Findings</p>
                      {herb.research}</p>
                    </div>

                    {/* Dosage & Caution */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl p-4" style={{ background: 'var(--si-success-tint)', border: '1px solid #BBF7D0' }}>
                        Typical Dosage</p>
                        {herb.dose}</p>
                      </div>
                      <div className="rounded-xl p-4" style={{ background: 'var(--si-orange-tint)', border: '1px solid var(--si-orange-light)' }}>
                        Caution</p>
                        {herb.caution}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          ))}

          {/* Herb cards grid (all 4 as thumbnails) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14">
            {HERBS.map((herb, i) => (
              <Reveal key={herb.name} delay={i * 80}>
                <div
                  onClick={() => setActiveHerb(i)}
                  style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeHerb === i ? herb.color : 'transparent'}`, transition: 'all 200ms ease', transform: activeHerb === i ? 'scale(1.02)' : 'scale(1)' }}
                >
                  <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                    <Image src={herb.image} alt={herb.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                      {herb.sanskrit}</p>
                      <p className="font-display font-bold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{herb.name}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research Lab Section */}
      <section className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container py-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/10' }}>
                <Image src="/Images/ayurveda-lab_79f87079.jpg" alt="Ayurveda Research Laboratory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="label-chip mb-4" style={{ background: 'rgba(22,163,74,0.15)', color: 'var(--si-success-light)', border: '1px solid rgba(22,163,74,0.3)' }}>Research Methodology</p>
              
                Classical texts meet<br /><span style={{ color: 'var(--si-success-light)' }}>modern laboratory science.</span>
              </h2>
              
                Our research methodology begins with classical Āyurvedic texts — Charaka Samhitā, Suśruta Samhitā, and Ashtānga Hridayam — and cross-references their protocols with modern pharmacological studies, randomised controlled trials, and biomarker analysis.
              </p>
              <div className="space-y-3">
                {[
                  'Text-to-trial validation: classical formulations → modern RCTs',
                  'Biomarker tracking: cortisol, HRV, inflammatory markers',
                  'Standardised extract analysis: HPLC, mass spectrometry',
                  'Outcome documentation: peer-reviewed publication pipeline',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-success-light)', marginTop: '8px', flexShrink: 0 }} />
                    {item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tridosha Framework */}
      <section className="on-dark" style={{ background: 'var(--si-ink)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3" style={{ background: 'rgba(22,163,74,0.15)', color: 'var(--si-success-light)', border: '1px solid rgba(22,163,74,0.3)' }}>Foundation Science</p>
              The Tridosha Framework</h2>
              
                Āyurveda's foundational model: three biological forces that govern all physiological and psychological processes.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { dosha: 'Vāta', sanskrit: 'वात', element: 'Air + Space', governs: 'Movement, nervous system, creativity, communication', imbalance: 'Anxiety, insomnia, dry skin, constipation', color: 'var(--si-info)', qualities: ['Light', 'Dry', 'Mobile', 'Cold', 'Subtle'] },
              { dosha: 'Pitta', sanskrit: 'पित्त', element: 'Fire + Water', governs: 'Digestion, metabolism, intelligence, transformation', imbalance: 'Inflammation, anger, acid reflux, skin rashes', color: 'var(--si-orange-ink)', qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Spreading'] },
              { dosha: 'Kapha', sanskrit: 'कफ', element: 'Earth + Water', governs: 'Structure, immunity, stability, memory', imbalance: 'Weight gain, lethargy, congestion, depression', color: 'var(--si-success)', qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth'] },
            ].map((d, i) => (
              <Reveal key={d.dosha} delay={i * 80}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${d.color}30`, borderRadius: '20px', padding: '28px', height: '100%' }}>
                  <p className="font-devanagari text-4xl mb-1" style={{ color: d.color }}>{d.sanskrit}</p>
                  {d.dosha}</p>
                  {d.element}</p>
                  <div className="mb-4">
                    Governs</p>
                    {d.governs}</p>
                  </div>
                  <div className="mb-4">
                    Imbalance Signs</p>
                    {d.imbalance}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {d.qualities.map((q) => (
                      {q}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-20 max-w-5xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label-chip mb-3">Current Research</p>
              Six active research areas</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RESEARCH_AREAS.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <div style={{ background: 'var(--si-surface)', borderRadius: '16px', padding: '24px', borderLeft: '4px solid var(--si-success)', height: '100%' }}>
                  <div className="flex items-start justify-between mb-3">
                    {r.status}</span>
                  </div>
                  {r.title}</p>
                  {r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section style={{ background: 'var(--si-surface)' }}>
        <div className="container py-20 max-w-4xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="label-chip mb-3">Research Output</p>
              Recent Publications</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {PUBLICATIONS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="card-white p-6" style={{ borderLeft: '4px solid var(--si-success)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      {p.title}</p>
                      {p.authors} · {p.journal}</p>
                      {p.year}</p>
                    </div>
                    {p.status}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--si-success)' }}>
        <div className="container py-16 text-center max-w-3xl">
          <Reveal>
            <p className="font-devanagari text-3xl mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>"स्वस्थस्य स्वास्थ्य रक्षणम्"</p>
            Collaborate with our research team.</h2>
            
              We welcome partnerships with Āyurvedic physicians, biomedical researchers, and institutions who share our commitment to evidence-based traditional medicine.
            </p>
            <Link href="/contact">
              
                Contact Our Research Team →
              </button>
            </Link>
          </Reveal>
        </div>
      </section>

      <RelatedPages current="/gurukul/ayurveda" picks={['/gurukul/foundation', '/gurukul/programs', '/gurukul/join']} />
    </Layout>
  );
}
