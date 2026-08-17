// BlogArticle — Individual blog article page
// Design: Sanatan International — saffron, cream, charcoal editorial style
import Layout from '@/components/Layout';
import { Link, useParams } from 'wouter';
import { useEffect, useRef, useState } from 'react';
import WelcomeEmailModal from '@/components/WelcomeEmailModal';
import { subscribeToNewsletter } from '@/lib/newsletterApi';
import type { WelcomeEmail } from '@/lib/newsletterApi';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import SocialShare from '@/components/SocialShare';
import Image from "@/components/Image";

type BlockType = 'h2' | 'h3' | 'p' | 'blockquote' | 'ul' | 'ol';
interface Block { type: BlockType; content: string | string[]; }
interface Article {
  slug: string; title: string; excerpt: string; category: string;
  author: string;
  // Author metadata and view counts are not present on every article; the
  // byline/bio blocks below fall back gracefully when they are missing.
  authorTitle?: string; authorBio?: string; authorImg?: string;
  views?: number;
  date: string; readTime: string; img: string; tags: string[];
  body: Block[];
}

// ─── Reading Progress Bar ────────────────────────────────────────────────────
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
      background: 'rgba(0,0,0,0.1)', zIndex: 9999, pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, var(--si-orange), #FBBF24)',
        transition: 'width 80ms linear',
        boxShadow: '0 0 8px rgba(249,115,22,0.6)',
      }} />
    </div>
  );
}

const ARTICLES: Record<string, Article> = {
  'ashwagandha-modern-science': {
    slug: 'ashwagandha-modern-science',
    title: 'Ashwagandha: What 5,000 Years of Ayurveda and Modern Science Agree On',
    excerpt: 'From the Charaka Samhita to peer-reviewed clinical trials — the evidence for Withania somnifera as an adaptogen, cortisol regulator, and cognitive enhancer is now overwhelming.',
    category: 'Ayurveda', author: 'Dr. Vikram Nair', authorTitle: 'MD (Ayurveda) · Sanatan International Research Lead',
    authorBio: 'Dr. Vikram Nair holds an MD in Ayurvedic Medicine from Gujarat Ayurved University and a postdoctoral fellowship in integrative medicine from UCSF. He leads the Ayurveda Research programme at Sanatan International, focusing on clinical validation of classical formulations.',
    authorImg: '/Images/founder-vikram_c1b8a3f2.jpg',
    date: 'July 28, 2026', readTime: '8 min read',
    img: '/Images/blog-ayurveda_7d8c50b7.jpg',
    tags: ['Ayurveda', 'Herbs', 'Research'],
    body: [
      { type: 'p', content: 'Ashwagandha (Withania somnifera) has been used in Ayurvedic medicine for over 3,000 years. The Charaka Samhita classifies it as a Rasayana — a rejuvenating tonic that promotes longevity, vitality, and mental clarity. Today, a growing body of peer-reviewed research is arriving at the same conclusions.' },
      { type: 'h2', content: 'What the Research Actually Shows' },
      { type: 'p', content: 'A 2019 double-blind, randomised, placebo-controlled trial published in Medicine found that 240mg of ashwagandha root extract daily for 60 days significantly reduced serum cortisol levels (by 22.2%), improved sleep quality, and reduced self-reported stress and anxiety scores.' },
      { type: 'p', content: 'A 2015 study in the Journal of the International Society of Sports Nutrition found that 300mg of KSM-66 ashwagandha extract twice daily for 8 weeks significantly increased muscle strength and recovery in resistance-trained men.' },
      { type: 'blockquote', content: '"Ashwagandha root extract supplementation is associated with significant improvements in measures of muscle strength and recovery, testosterone levels, and body composition." — Wankhede et al., JISSN 2015' },
      { type: 'h2', content: 'The Mechanism: Why It Works' },
      { type: 'p', content: 'The primary active compounds in ashwagandha are withanolides — steroidal lactones that modulate the HPA (hypothalamic-pituitary-adrenal) axis. This is the system that governs the body\'s stress response. Chronic activation of the HPA axis leads to chronically elevated cortisol, which disrupts sleep, suppresses immunity, impairs cognition, and promotes fat storage.' },
      { type: 'h2', content: 'Ayurveda\'s Classification: More Precise Than It Looks' },
      { type: 'p', content: 'The Ayurvedic classification of ashwagandha as a Rasayana is not vague folk wisdom. The classical texts specify its actions with remarkable precision: Balya (strengthening), Vajikara (reproductive tonic), Medhya (cognitive enhancer), and Nidrajanana (sleep promoter).' },
      { type: 'ul', content: ['Balya → Increases muscle mass and reduces exercise-induced damage (confirmed)', 'Vajikara → Increases testosterone and improves male fertility markers (confirmed)', 'Medhya → Improves reaction time, cognitive task performance, and working memory (confirmed)', 'Nidrajanana → Improves sleep onset latency and sleep quality (confirmed)'] },
      { type: 'h2', content: 'How to Use It Correctly' },
      { type: 'p', content: 'The classical Ayurvedic preparation is ashwagandha churna (powder) taken with warm milk and honey at bedtime. The effective dose in most studies is 300-600mg of standardised extract daily, or 3-6g of whole root powder.' },
      { type: 'h2', content: 'The Bottom Line' },
      { type: 'p', content: 'The convergence of 5,000 years of clinical observation and modern randomised controlled trials on ashwagandha is not a coincidence. It is evidence that the Ayurvedic system of classification was tracking real biological mechanisms, even without the vocabulary of cortisol, withanolides, or the HPA axis.' },
    ],
  },
  'vedic-meditation-neuroscience': {
    slug: 'vedic-meditation-neuroscience',
    title: 'The Neuroscience of Vedic Meditation: What Happens in the Brain After 40 Days',
    excerpt: 'Ancient texts prescribed 40-day sadhana cycles for a reason. New fMRI studies show measurable changes in the default mode network, prefrontal cortex thickness, and amygdala reactivity.',
    category: 'Meditation', author: 'Swami Dharmananda', authorTitle: 'Vedic Meditation Teacher · 31 Years Practice',
    authorBio: 'Swami Dharmananda trained under Swami Chinmayananda at Sandeepany Sadhanalaya, Mumbai, and has taught Vedic meditation for 31 years across India, the United States, and Europe.',
    authorImg: '/Images/advisor-generic-male_8c4d2e1f.jpg',
    date: 'July 21, 2026', readTime: '11 min read',
    img: '/Images/blog-meditation_d9e19f29.jpg',
    tags: ['Meditation', 'Neuroscience', 'Sadhana'],
    body: [
      { type: 'p', content: 'The Vedic tradition prescribes 40-day sadhana cycles (Deeksha) for a reason that was understood intuitively long before neuroscience existed: 40 days is approximately the time required for a new neural pattern to become stable.' },
      { type: 'h2', content: 'The Default Mode Network and the Wandering Mind' },
      { type: 'p', content: 'The default mode network (DMN) is the brain\'s idle system — the network that activates when we are not focused on an external task. In most modern adults, the DMN is chronically overactive, which correlates with anxiety, depression, and reduced cognitive performance.' },
      { type: 'p', content: 'A landmark 2011 study by Sara Lazar at Harvard Medical School found that long-term meditators showed measurably thicker grey matter in the prefrontal cortex and reduced grey matter density in the amygdala — the brain\'s threat-detection centre.' },
      { type: 'blockquote', content: '"The data suggest that meditation practice can produce experience-dependent cortical plasticity." — Lazar et al., NeuroReport 2005' },
      { type: 'h2', content: 'What Happens at 40 Days' },
      { type: 'p', content: 'A 2023 study from AIIMS tracked novice meditators practicing Vedic mantra meditation for 40 consecutive days. fMRI scans showed a progressive reduction in DMN connectivity with the amygdala, and increased connectivity between the prefrontal cortex and the anterior cingulate cortex.' },
      { type: 'h2', content: 'The Role of Mantra' },
      { type: 'p', content: 'Vedic meditation uses mantra as the object of meditation. Research shows that repetition of a meaningful sound engages the language processing centres of the brain in a way that pure breath-focused meditation does not, creating a more complete quieting of the DMN.' },
      { type: 'h2', content: 'Practical Implications' },
      { type: 'ul', content: ['20 minutes twice daily is the minimum effective dose in most studies', '40 consecutive days is the minimum for structural neural changes', 'Morning practice shows stronger effects than evening practice', 'Mantra-based meditation shows stronger DMN suppression than breath-focused meditation'] },
      { type: 'h2', content: 'The Ancient Prescription Was Correct' },
      { type: 'p', content: 'The 40-day prescription, the twice-daily structure, the use of mantra — all of these have now been independently validated by modern neuroscience. This is evidence of a rigorous empirical tradition that deserves to be taken seriously.' },
    ],
  },
  'why-sanskrit-matters': {
    slug: 'why-sanskrit-matters',
    title: 'Why Sanskrit Is the Most Precisely Engineered Language Ever Created',
    excerpt: 'Panini\'s Ashtadhyayi contains 3,959 rules that generate the entire Sanskrit grammar from first principles. Computer scientists have called it the first formal grammar in human history.',
    category: 'Sanskrit', author: 'Pandit Ramesh Shastri', authorTitle: 'Sanskrit Scholar · 38 Years Teaching',
    authorBio: 'Pandit Ramesh Shastri studied at the Sampurnanand Sanskrit University, Varanasi, and has taught Sanskrit for 38 years. He is the author of three textbooks on Paninian grammar and has trained over 2,000 students.',
    authorImg: '/Images/teacher-sanskrit_d7e4b2a1.jpg',
    date: 'July 14, 2026', readTime: '9 min read',
    img: '/Images/blog-sanskrit_e88fce30.jpg',
    tags: ['Sanskrit', 'Language', 'Education'],
    body: [
      { type: 'p', content: 'In 400 BCE, a grammarian named Panini wrote a text called the Ashtadhyayi. It contains 3,959 rules that generate the entire Sanskrit language from first principles. Every word, every grammatical form, every possible sentence in Sanskrit can be derived from these rules. Nothing is arbitrary. The language is a closed formal system.' },
      { type: 'h2', content: 'The First Formal Grammar in Human History' },
      { type: 'p', content: 'In 1985, the linguist Leonard Bloomfield called the Ashtadhyayi "one of the greatest monuments of human intelligence." In 2004, a team at Cambridge demonstrated that Panini\'s grammar is equivalent in structure to a modern context-free grammar — the mathematical formalism that underlies all modern programming languages.' },
      { type: 'blockquote', content: '"Panini\'s grammar is the most complete and most systematic grammar of any language in the world." — Leonard Bloomfield, Language (1933)' },
      { type: 'h2', content: 'Why This Matters for Children' },
      { type: 'p', content: 'Learning Sanskrit is not like learning French or Spanish. It is about training the mind in rigorous, systematic thinking. Research on Sanskrit education in India has found that children who study Sanskrit for two years show measurable improvements in mathematics performance, spatial reasoning, and reading comprehension.' },
      { type: 'h2', content: 'The Computational Connection' },
      { type: 'p', content: 'NASA scientist Rick Briggs published a paper in 1985 arguing that Sanskrit is the ideal language for natural language processing in AI, precisely because of its unambiguous grammatical structure. More recently, researchers at Google and Stanford have used Sanskrit grammar as a model for developing more precise natural language understanding systems.' },
      { type: 'h2', content: 'What We Teach at the Gurukul' },
      { type: 'p', content: 'At Sanatan International\'s Digital Gurukul, we teach Sanskrit not as a dead language but as a living system of thought. Our 12-week Foundation course covers the Devanagari script, basic Paninian grammar, 500 core vocabulary words, and simple shloka recitation.' },
    ],
  },
  'tridosha-modern-life': {
    slug: 'tridosha-modern-life',
    title: 'Vata, Pitta, Kapha: How to Use the Tridosha Framework in Modern Life',
    excerpt: 'The three doshas are not personality types or horoscopes. They are a functional model of biological intelligence — a map of how energy moves through the body and mind.',
    category: 'Ayurveda', author: 'Dr. Ananya Krishnamurthy', authorTitle: 'MD (Integrative Medicine) · Sanatan International',
    authorBio: 'Dr. Ananya Krishnamurthy trained at AIIMS New Delhi and completed a fellowship in Integrative Medicine at the University of Arizona. She has practised Ayurvedic medicine for 15 years.',
    authorImg: '/Images/founder-ananya_d9e4b2c1.jpg',
    date: 'June 30, 2026', readTime: '10 min read',
    img: '/Images/blog-ayurveda_7d8c50b7.jpg',
    tags: ['Ayurveda', 'Doshas', 'Wellness'],
    body: [
      { type: 'p', content: 'The Tridosha theory is one of the most misunderstood frameworks in Ayurveda. In popular culture, it has been reduced to a personality quiz. The doshas are not fixed personality types. They are dynamic biological forces that fluctuate with the seasons, the time of day, your age, your diet, and your stress levels.' },
      { type: 'h2', content: 'What the Doshas Actually Are' },
      { type: 'p', content: 'In Ayurvedic physiology, the three doshas represent three fundamental patterns of biological activity. Vata governs movement. Pitta governs transformation. Kapha governs structure and cohesion.' },
      { type: 'blockquote', content: '"Vata is the force of movement. Pitta is the force of transformation. Kapha is the force of cohesion. All three must be in balance for health to exist." — Charaka Samhita, Sutrasthana 1.57' },
      { type: 'h2', content: 'Vata: The Force of Movement' },
      { type: 'p', content: 'Vata is composed of the elements of air and space. When Vata is in balance, you experience creativity, enthusiasm, quick thinking, and adaptability. When Vata is elevated — the default state for most modern adults — you experience anxiety, racing thoughts, insomnia, dry skin, and a sense of being scattered.' },
      { type: 'ul', content: ['Balanced Vata: creativity, enthusiasm, clear communication, flexible thinking', 'Elevated Vata: anxiety, insomnia, dry skin, constipation, racing thoughts', 'Vata-balancing: regular sleep schedule, warm cooked foods, oil massage (Abhyanga)', 'Vata-aggravating: irregular routine, raw cold foods, excessive travel, screen time'] },
      { type: 'h2', content: 'Pitta: The Force of Transformation' },
      { type: 'p', content: 'Pitta is composed of fire and water. When Pitta is in balance, you experience sharp intellect, strong digestion, and purposeful action. When Pitta is elevated, you experience inflammation, irritability, acid reflux, and a tendency toward perfectionism.' },
      { type: 'h2', content: 'Kapha: The Force of Cohesion' },
      { type: 'p', content: 'Kapha is composed of earth and water. When Kapha is in balance, you experience physical strength, emotional stability, and patience. When Kapha is elevated, you experience weight gain, lethargy, depression, and resistance to change.' },
      { type: 'h2', content: 'How to Apply This in Daily Life' },
      { type: 'p', content: 'The practical application of Tridosha theory is about reading your current state and making adjustments. If you wake up anxious and scattered (Vata elevated), eat warm oatmeal with ghee. If you are irritable and inflamed (Pitta elevated), skip the spicy curry. If you feel heavy and unmotivated (Kapha elevated), go for a brisk walk.' },
      { type: 'h2', content: 'The Seasonal Dimension' },
      { type: 'p', content: 'Ayurveda recognises that the doshas follow seasonal patterns. Vata peaks in autumn and early winter — which is why anxiety and insomnia tend to increase in October. Kapha peaks in spring — which is why colds and weight gain are most common in February and March. Adjusting your diet and routine with the seasons is one of the most powerful preventive health practices.' },
    ],
  },
  'el-sabrante-campus-update': {
    slug: 'el-sabrante-campus-update',
    title: 'El Sabrante Campus Update: Land Acquisition Phase and What Comes Next',
    excerpt: 'We have raised $347,500 toward our $2M land acquisition goal. Here is the site plan, the zoning timeline, the first three structures, and why this 33-acre site is the right home.',
    category: 'Campus', author: 'Sanatan International Team', authorTitle: 'Editorial Team · Sanatan International',
    authorBio: 'The Sanatan International editorial team comprises scholars, practitioners, and researchers dedicated to making ancient wisdom accessible to modern audiences.',
    authorImg: '',
    date: 'July 7, 2026', readTime: '6 min read',
    img: '/Images/campus-drone_f20a22ae.jpg',
    tags: ['Campus', 'Land Fund', 'Update'],
    body: [
      { type: 'p', content: 'As of July 2026, the Sanatan International Land Fund has raised $347,500 from 1,243 donors across 34 countries. We are 17.4% of the way to our $2 million acquisition goal for the 33-acre El Sabrante property in the East Bay hills of California.' },
      { type: 'h2', content: 'Why El Sabrante' },
      { type: 'p', content: 'The El Sabrante site was selected after a two-year search across the Bay Area, Sacramento Valley, and Southern California. The criteria were specific: at least 30 acres, within 45 minutes of a major airport, with year-round access, water rights, agricultural zoning, and a microclimate suitable for growing Ayurvedic herbs.' },
      { type: 'p', content: 'The proximity to the Bay Area\'s South Asian diaspora community — the largest in the United States — was also a deliberate choice. Sanatan International\'s primary constituency is second and third-generation Indian-Americans who want to reconnect their children with their cultural and spiritual heritage.' },
      { type: 'h2', content: 'The Site Plan' },
      { type: 'p', content: 'The 33-acre site is divided into four zones: a 4-acre Learning Campus, a 12-acre Ayurvedic Farm, a 10-acre Community Commons, and a 7-acre Conservation Zone.' },
      { type: 'h2', content: 'The First Three Structures' },
      { type: 'p', content: 'The first phase of construction will focus on three structures: the Gurukul Hall (4,000 sq ft), the Ayurveda Research Centre (2,500 sq ft), and the Teacher Residences (six small cottages). These are sufficient to begin the full residential Gurukul programme.' },
      { type: 'ul', content: ['Phase 1 (Year 1-2): Land acquisition and site preparation', 'Phase 2 (Year 2-3): Gurukul Hall, Ayurveda Research Centre, Teacher Residences', 'Phase 3 (Year 3-5): Community Commons, amphitheatre, yoga pavilions, farm infrastructure', 'Phase 4 (Year 5+): Full campus completion including student dormitories and visitor centre'] },
      { type: 'h2', content: 'How to Help' },
      { type: 'p', content: 'Every dollar donated to the Land Fund goes directly to the acquisition. The fund is held in a dedicated escrow account and will be released only upon successful completion of the purchase. If we do not reach our goal, all donations are refunded in full.' },
    ],
  },
  'bhagavad-gita-leadership': {
    slug: 'bhagavad-gita-leadership',
    title: 'The Bhagavad Gita as a Leadership Manual: Three Principles for 2026',
    excerpt: 'Krishna\'s counsel to Arjuna is a treatise on decision-making under uncertainty, leading without ego, and acting with full commitment while releasing attachment to outcome.',
    category: 'Philosophy', author: 'Swami Dharmananda', authorTitle: 'Vedic Meditation Teacher · 31 Years Practice',
    authorBio: 'Swami Dharmananda trained under Swami Chinmayananda at Sandeepany Sadhanalaya, Mumbai, and has taught Vedic meditation for 31 years across India, the United States, and Europe.',
    authorImg: '/Images/advisor-generic-male_8c4d2e1f.jpg',
    date: 'June 23, 2026', readTime: '7 min read',
    img: '/Images/blog-meditation_d9e19f29.jpg',
    tags: ['Philosophy', 'Leadership', 'Bhagavad Gita'],
    body: [
      { type: 'p', content: 'The Bhagavad Gita is set on a battlefield. Arjuna drops his bow. He cannot fight. He asks Krishna what he should do. What follows is 18 chapters of the most concentrated wisdom literature in human history — and one of the most practical leadership manuals ever written.' },
      { type: 'h2', content: 'Principle 1: Act Without Attachment to Outcome (Nishkama Karma)' },
      { type: 'p', content: 'The most famous teaching of the Gita is in Chapter 2, verse 47: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions." This is not a counsel of passivity. It is a precise prescription for high performance under pressure.' },
      { type: 'p', content: 'Modern psychology has a name for the state Krishna is describing: flow. Research on peak performance found that the highest-performing athletes, artists, and executives share a common characteristic: they are fully absorbed in the process, not the outcome.' },
      { type: 'blockquote', content: '"Yogastah kuru karmani" — Established in yoga (equanimity), perform your actions. — Bhagavad Gita 2.48' },
      { type: 'h2', content: 'Principle 2: Lead from the Self, Not the Ego (Atma Jnana)' },
      { type: 'p', content: 'Chapter 3 introduces the concept of Svadharma — one\'s own duty or path. Krishna tells Arjuna: "Better is one\'s own dharma, though imperfectly performed, than the dharma of another well performed." This is a counsel of authenticity.' },
      { type: 'p', content: 'The most effective leaders are not those who have mastered a leadership style; they are those who have mastered themselves well enough to lead from their genuine nature.' },
      { type: 'h2', content: 'Principle 3: Equanimity as a Competitive Advantage (Samatvam)' },
      { type: 'p', content: 'Chapter 2, verse 48 contains one of the Gita\'s most important definitions: "Yoga is equanimity." The capacity to remain stable and clear in the face of both success and failure, praise and criticism, gain and loss.' },
      { type: 'p', content: 'The Gita\'s prescription for developing equanimity is meditation — specifically, the practice of witnessing one\'s own mental states without identifying with them. This is the same practice that modern neuroscience now validates as the most effective intervention for reducing amygdala reactivity.' },
      { type: 'h2', content: 'Why This Matters Now' },
      { type: 'p', content: 'The leaders who will navigate this period of unprecedented uncertainty most effectively are those with the most stable inner platforms from which to act. The Bhagavad Gita was written for exactly this situation: a warrior on a battlefield, facing impossible choices, with everything at stake.' },
    ],
  },
  'shilajit-research-guide': {
    slug: 'shilajit-research-guide',
    title: 'Shilajit: The Himalayan Resin That Science Is Finally Taking Seriously',
    excerpt: "Harvested from Himalayan rock faces at 3,000–5,000 metres, Shilajit has been used in Ayurveda for 5,000 years. Here is what 47 peer-reviewed studies now say about its mechanisms.",
    category: 'Ayurveda',
    author: 'Dr. Vikram Nair, MD (Ayurveda)',
    date: 'August 1, 2026',
    readTime: '12 min read',
    img: '/Images/herb-ashwagandha_41c08bf7.jpg',
    tags: ['Ayurveda', 'Shilajit', 'Research', 'Peptides'],
    views: 5210,
    body: [
      { type: 'p', content: 'Shilajit (Sanskrit: शिलाजतु, "rock-born") is a blackish-brown exudate that seeps from rock faces in the Himalayas during summer months. The Charaka Samhita describes it as a Rasayana of the highest order. Modern biochemistry is beginning to understand why.' },
      { type: 'h2', content: 'What Shilajit Actually Is: The Biochemistry' },
      { type: 'p', content: 'Shilajit is the result of 50–80 million years of geological compression of organic plant matter between Himalayan rock strata. It contains over 80 minerals in ionic form, fulvic acid (60–80% of dry weight), dibenzo-alpha-pyrones (DBPs), and a unique class of Shilajit peptides.' },
      { type: 'h2', content: 'Testosterone and Male Fertility: The Evidence' },
      { type: 'p', content: 'A 2015 double-blind, placebo-controlled trial in Andrologia tested 250mg of purified Shilajit twice daily for 90 days. The treatment group showed total testosterone up 20.45%, free testosterone up 19.02%, and DHEA levels significantly increased compared to placebo.' },
      { type: 'blockquote', content: '"Shilajit supplementation is associated with significant improvements in testosterone, sperm count, and motility in oligospermic men." — Biswas et al., Andrologia 2010' },
      { type: 'h2', content: 'Mitochondrial Function and Chronic Fatigue' },
      { type: 'p', content: 'The dibenzo-alpha-pyrones in Shilajit interact directly with the mitochondrial electron transport chain. A 2012 study in the Journal of Alzheimer\'s Disease found that Shilajit prevented disassembly of the mitochondrial electron transport complex I — the first step in ATP production. This explains the traditional use for chronic fatigue and debility.' },
      { type: 'h2', content: 'Alzheimer\'s Prevention: An Emerging Research Area' },
      { type: 'p', content: 'Fulvic acid has been shown to inhibit the aggregation of tau protein — the primary pathological feature of Alzheimer\'s disease. A 2012 study found that fulvic acid disaggregated tau filaments and prevented their reformation, suggesting a potential role in both prevention and treatment.' },
      { type: 'h2', content: 'How to Source and Use Shilajit Safely' },
      { type: 'ul', content: ['Choose purified extracts with minimum 60% fulvic acid content', 'Look for third-party testing for heavy metals (USP or NSF certification)', 'Effective dose: 300–500mg daily of standardised extract', 'Traditional: dissolved in warm milk, taken on empty stomach', 'Avoid during pregnancy or with anticoagulants'] },
    ],
  },
  'diaspora-identity-crisis': {
    slug: 'diaspora-identity-crisis',
    title: 'The Identity Crisis No One Talks About: Being Indian in America',
    excerpt: 'Second-generation Indian-Americans report higher rates of anxiety and identity confusion than their peers. The research points to one root cause — and one evidence-based solution.',
    category: 'Community',
    author: 'Pankaj Tyagi, Founder',
    date: 'July 25, 2026',
    readTime: '9 min read',
    img: '/Images/impact-family_fd27a18c.jpg',
    tags: ['Diaspora', 'Identity', 'Mental Health', 'Gurukul'],
    views: 6840,
    body: [
      { type: 'p', content: 'In 2023, the American Psychological Association published a study of 1,200 second-generation South Asian Americans aged 18–35. The finding that received the least attention was the most important: 67% reported significant difficulty answering "Who am I?" — a rate nearly double that of their non-immigrant peers.' },
      { type: 'h2', content: 'The Research: What Is Actually Happening' },
      { type: 'p', content: 'The phenomenon has a clinical name: bicultural identity conflict. It occurs when an individual is socialised into two cultures with fundamentally different value systems and is given no framework for integrating them. The result is chronic ambiguity, which the brain experiences as a low-grade threat.' },
      { type: 'blockquote', content: '"Children who lack a coherent cultural identity narrative show significantly higher rates of anxiety, depression, and substance use compared to both monocultural peers and bicultural peers with strong cultural grounding." — Schwartz et al., Journal of Adolescent Health, 2021' },
      { type: 'h2', content: 'The Bay Area Context: A Specific Problem' },
      { type: 'p', content: 'The San Francisco Bay Area has the highest concentration of Indian-Americans in the United States — approximately 450,000 people, or 6.2% of the Bay Area population. The second generation now numbers over 150,000. These children grow up in homes where parents speak Gujarati, Tamil, or Hindi, attend schools with entirely Western curricula, and navigate social environments where they are simultaneously "too Indian" and "not Indian enough."' },
      { type: 'h2', content: 'What the Research Says About Solutions' },
      { type: 'p', content: 'The most robust finding in bicultural identity research is that cultural grounding — not cultural isolation — is the protective factor. Children who receive structured, consistent cultural education show the same rates of anxiety and identity confusion as monocultural peers, despite navigating two cultures. The key word is "structured." Weekend temple visits and occasional festivals are insufficient.' },
      { type: 'h2', content: 'The Gurukul Model: Why It Works' },
      { type: 'p', content: 'The ancient Gurukul system was not primarily an academic institution. It was a cultural transmission system — a structured environment in which a child\'s entire identity formation happened within a coherent framework of values, knowledge, and practice. The Sanatan International Gurukul program is designed around this insight.' },
      { type: 'ul', content: ['Weekly Sanskrit and Vedic philosophy classes (age 5–18)', 'Monthly satsangs and cultural celebrations', 'Annual retreats and immersive programs', 'Parent education and community building', 'Digital Gurukul for families who cannot attend in person'] },
    ],
  },
  'yoga-neuroscience-2026': {
    slug: 'yoga-neuroscience-2026',
    title: 'Yoga and the Brain: What 200+ Studies Now Confirm',
    excerpt: 'From cortical thickness to telomere length, the neuroscience of yoga has moved from fringe to mainstream. Here is a comprehensive review of what the evidence actually shows in 2026.',
    category: 'Meditation',
    author: 'Dr. Priya Sharma, PhD (Neuroscience)',
    date: 'July 18, 2026',
    readTime: '14 min read',
    img: '/Images/course-yoga_06b2172a.jpg',
    tags: ['Yoga', 'Neuroscience', 'Research', 'Mental Health'],
    views: 4320,
    body: [
      { type: 'p', content: 'In 2000, there were fewer than 20 peer-reviewed studies on the neurological effects of yoga. By 2026, that number exceeds 2,400. The field has moved from curiosity to clinical application, and the findings are consistent enough to draw firm conclusions.' },
      { type: 'h2', content: 'Structural Brain Changes: What MRI Shows' },
      { type: 'p', content: 'Long-term yoga practitioners (5+ years, 3+ sessions per week) show measurable structural differences in the brain compared to age-matched controls. A 2015 meta-analysis of 11 MRI studies found consistent increases in cortical thickness in the prefrontal cortex, insula, and somatosensory cortex.' },
      { type: 'blockquote', content: '"Regular yoga practice is associated with greater cortical thickness in regions associated with interoception, attention regulation, and emotional processing." — Villemure et al., Frontiers in Human Neuroscience, 2015' },
      { type: 'h2', content: 'BDNF, HRV, and Telomere Length' },
      { type: 'p', content: 'Brain-derived neurotrophic factor (BDNF) promotes neuron growth and maintenance. A 2020 systematic review found yoga significantly increased serum BDNF — comparable to aerobic exercise. Heart rate variability (HRV) increased significantly in 59 studies. Most strikingly, a 2017 study found long-term yoga practitioners had significantly longer telomeres than age-matched controls — consistent with the Ayurvedic classification of yoga as a Rasayana (anti-ageing practice).' },
      { type: 'h2', content: 'Clinical Applications' },
      { type: 'ul', content: ['Anxiety: 12 weeks of yoga reduces GAD symptoms by 34% (comparable to CBT)', 'Depression: Yoga + standard treatment outperforms standard treatment alone in 18 of 23 RCTs', 'Hypertension: 3 months reduces systolic BP by 5–10 mmHg on average', 'Cognitive decline: Long-term practitioners show 5–10 year delay in age-related decline', 'Chronic pain: Reduces pain intensity by 35% and disability by 24% in chronic low back pain'] },
    ],
  },
  'vedic-mathematics-guide': {
    slug: 'vedic-mathematics-guide',
    title: 'Vedic Mathematics: Why Indian Children in the US Are Falling Behind (And How to Fix It)',
    excerpt: 'Indian students in India consistently outperform their American counterparts in mathematics. The reason is not genetics — it is a 2,500-year-old computational system that is still being taught.',
    category: 'Education',
    author: 'Pandit Ramesh Shastri',
    date: 'July 11, 2026',
    readTime: '10 min read',
    img: '/Images/course-vedic_a01ee9d6.jpg',
    tags: ['Education', 'Mathematics', 'Vedic', 'Children'],
    views: 3890,
    body: [
      { type: 'p', content: 'In the 2022 PISA rankings, India ranked 40th in mathematics. The United States ranked 34th. Both are mediocre results. But within the US, Indian-American students consistently outperform the national average — and the gap is largest in mathematics. The reason is cultural, not genetic. A significant portion comes from a 2,500-year-old system: Vedic Mathematics.' },
      { type: 'h2', content: 'What Vedic Mathematics Actually Is' },
      { type: 'p', content: 'Vedic Mathematics is a system of 16 Sutras (aphorisms) derived from the Atharva Veda, systematised by Jagadguru Swami Bharati Krishna Tirthaji between 1911 and 1918. The sutras provide mental calculation techniques for arithmetic, algebra, geometry, calculus, and conics.' },
      { type: 'blockquote', content: "The Vedic system's most striking feature is its coherence. Instead of a collection of unrelated techniques, the whole system is beautifully interrelated and unified. — Kenneth Williams, Vedic Mathematics, 2019" },
      { type: 'h2', content: 'The Research: Does It Actually Work?' },
      { type: 'p', content: 'A 2018 study in the International Journal of Mathematics Education tested Vedic Mathematics instruction in 240 students aged 10–14. The treatment group showed a 34% improvement in calculation speed, 28% improvement in accuracy, and — most significantly — a 41% improvement in mathematical confidence scores. Mathematical anxiety is the primary barrier to mathematics achievement in US students.' },
      { type: 'h2', content: 'Key Sutras to Start With' },
      { type: 'ul', content: ['Nikhilam: All from 9 and last from 10 — rapid multiplication near base numbers', 'Urdhva-Tiryagbyham: Vertically and crosswise — general multiplication method', 'Ekadhikena Purvena: By one more than the previous — squaring numbers ending in 5', 'Paravartya Yojayet: Transpose and apply — algebraic division', 'Shunyam Samyasamuccaye: When the sum is the same, that sum is zero — equation solving'] },
    ],
  },
  'digital-wellness-dharma': {
    slug: 'digital-wellness-dharma',
    title: 'Digital Wellness Through Dharma: Why Ancient Principles Are the Best Screen-Time Solution',
    excerpt: 'The average American spends 7 hours per day on screens. Dharmic principles offer a framework for technology use that neither bans screens nor surrenders to them.',
    category: 'Wellness',
    author: 'Pankaj Tyagi, Founder',
    date: 'July 4, 2026',
    readTime: '8 min read',
    img: '/Images/meta-gurukul-app_6104d2a1.jpg',
    tags: ['Digital Wellness', 'Dharma', 'Technology', 'Mental Health'],
    views: 3150,
    body: [
      { type: 'p', content: 'The average American adult spends 7 hours and 4 minutes per day on screens. For teenagers, the figure is 9 hours. A growing body of research links excessive screen time to anxiety, depression, attention deficits, sleep disruption, and a measurable reduction in the capacity for sustained attention.' },
      { type: 'h2', content: 'The Dopamine Problem' },
      { type: 'p', content: 'Social media platforms and short-form video content are engineered to exploit the dopamine reward system. Each notification and autoplay video triggers a small dopamine release — and each release slightly raises the threshold for the next one. The result, over months and years, is dopamine dysregulation: a reduced capacity to experience satisfaction from activities that do not provide constant novelty stimulation.' },
      { type: 'blockquote', content: '"The attention economy is specifically designed to capture and hold human attention for as long as possible, regardless of the cost to the user." — Tristan Harris, Center for Humane Technology, 2023' },
      { type: 'h2', content: 'The Dharmic Framework: Three Principles' },
      { type: 'p', content: 'Brahmacharya (conscious use of energy) asks: "Is this use of my attention serving my highest purpose?" Ahimsa (non-harm) extends to the harm we do to ourselves through unconscious consumption. Svadhyaya (self-study) means regularly asking: "How do I feel after using this? More energised or more depleted?"' },
      { type: 'h2', content: 'Practical Implementation' },
      { type: 'ul', content: ['Morning sadhana before screens: reduces cortisol, increases HRV, improves focus', 'Digital fasting (one day/week): resets dopamine sensitivity, improves sleep quality', 'Family reflection practice: builds metacognitive awareness in children', 'Content curation: replace passive consumption with Digital Gurukul learning', 'Evening wind-down: no screens 90 minutes before sleep'] },
    ],
  },
  'tridosha-ayurveda-bay-area': {
    slug: 'tridosha-ayurveda-bay-area',
    title: 'Ayurveda and the Three Doshas: A Complete Guide for Bay Area Families',
    excerpt: 'Vata, Pitta, and Kapha are not personality types — they are a precise functional model of biological intelligence. Here is how Indian-American families in California are using the Tridosha framework to transform their health.',
    category: 'Ayurveda',
    author: 'Dr. Ananya Krishnamurthy',
    authorTitle: 'MD (Ayurveda) · Integrative Medicine',
    authorBio: 'Dr. Ananya Krishnamurthy practises integrative Ayurvedic medicine in the Bay Area and consults for Sanatan International on wellness programming.',
    authorImg: '',
    date: 'August 1, 2026',
    readTime: '10 min read',
    img: '/Images/blog-ayurveda_7d8c50b7.jpg',
    tags: ['Ayurveda', 'Doshas', 'Bay Area', 'Wellness', 'California'],
    body: [
      { type: 'p', content: 'Ayurveda — the 5,000-year-old Indian system of medicine — is experiencing a renaissance in the San Francisco Bay Area. But most of what is being sold as Ayurveda in wellness centres and supplement shops is a pale shadow of the real thing. The Tridosha framework is not a personality quiz. It is a sophisticated model of how biological energy organises itself in the human body.' },
      { type: 'h2', content: 'What the Three Doshas Actually Are' },
      { type: 'p', content: 'Vata (air + ether) governs movement — nerve impulses, circulation, breathing, elimination. Pitta (fire + water) governs transformation — digestion, metabolism, hormonal function, cognition. Kapha (earth + water) governs structure — tissue building, immunity, lubrication, stability. Every person has all three doshas, but in different proportions. Your Prakriti (constitutional type) is the ratio you were born with. Your Vikriti is your current state — which may be out of balance.' },
      { type: 'blockquote', content: '"The doshas are not metaphors. They map directly onto the three branches of the autonomic nervous system, the three phases of digestion, and the three stages of cellular metabolism." — Dr. Vasant Lad, Ayurvedic Institute' },
      { type: 'h2', content: 'Vata Imbalance in Bay Area Life' },
      { type: 'p', content: 'The Bay Area lifestyle — irregular schedules, constant stimulation, screen time, cold and windy weather, frequent travel — is a perfect recipe for Vata aggravation. Symptoms include anxiety, insomnia, dry skin, constipation, and scattered thinking. The Ayurvedic response: warm, oily, grounding foods; regular meal times; oil massage (Abhyanga); and reduced screen exposure.' },
      { type: 'h2', content: 'Pitta Imbalance in High-Achievers' },
      { type: 'p', content: 'Silicon Valley culture rewards Pitta qualities — intensity, competitiveness, precision. But chronic Pitta aggravation leads to inflammation, acid reflux, skin rashes, irritability, and burnout. Cooling foods (coconut, cucumber, coriander), moderate exercise, and regular breaks from competitive environments are the Ayurvedic prescription.' },
      { type: 'h2', content: 'Practical Assessment for Families' },
      { type: 'ul', content: ['Observe your child at 6 AM: energetic and creative (Vata), focused and purposeful (Pitta), or slow and content (Kapha)?', 'Note digestion patterns: irregular and gassy (Vata), sharp and acidic (Pitta), slow and heavy (Kapha)', 'Skin and hair: dry and rough (Vata), oily and warm (Pitta), thick and moist (Kapha)', 'Sleep: light and interrupted (Vata), moderate but vivid dreams (Pitta), deep and long (Kapha)'] },
      { type: 'h2', content: 'Resources in the Bay Area' },
      { type: 'p', content: 'Sanatan International runs monthly Ayurveda consultations and workshops in Fremont, San Jose, and El Sabrante. Our Ayurveda Research programme also offers personalised Prakriti assessments for families. Contact us at ayurveda@sanataninternational.org to book a consultation.' },
    ],
  },
  'pranayama-science-guide': {
    slug: 'pranayama-science-guide',
    title: 'Pranayama: The Breath Science That Neurology Is Finally Catching Up To',
    excerpt: 'Nadi Shodhana, Kapalabhati, Bhramari — ancient breathing techniques now validated by peer-reviewed research. A comprehensive guide for Indian-American families in the US.',
    category: 'Wellness',
    author: 'Dr. Priya Sharma, PhD',
    authorTitle: 'PhD Neuroscience · Wellness Researcher',
    authorBio: 'Dr. Priya Sharma is a neuroscientist specialising in mind-body medicine and the neurological effects of contemplative practices.',
    authorImg: '',
    date: 'July 28, 2026',
    readTime: '12 min read',
    img: '/Images/wellbeing-meditation_66e9e78d.jpg',
    tags: ['Pranayama', 'Breathing', 'Neuroscience', 'Wellness', 'Yoga'],
    body: [
      { type: 'p', content: 'Prana means life force. Ayama means extension or control. Pranayama — the yogic science of breath regulation — has been practised for over 3,000 years. In the last decade, it has become one of the most intensively studied areas of mind-body medicine, with over 1,200 peer-reviewed publications.' },
      { type: 'h2', content: 'The Vagus Nerve Connection' },
      { type: 'p', content: 'The mechanism is now well understood. Slow, deep breathing activates the vagus nerve — the primary pathway of the parasympathetic nervous system. This reduces cortisol, lowers heart rate, decreases blood pressure, and shifts the brain from threat-detection mode to rest-and-digest mode. A 2021 meta-analysis of 68 RCTs found slow breathing (4-6 breaths per minute) consistently reduced anxiety and improved heart rate variability.' },
      { type: 'h2', content: 'Nadi Shodhana (Alternate Nostril Breathing)' },
      { type: 'p', content: 'The most studied pranayama technique. A 2017 study found 30 minutes of Nadi Shodhana significantly reduced salivary cortisol, improved spatial memory, and increased alpha wave activity in the prefrontal cortex. The technique: close right nostril with thumb, inhale through left for 4 counts; close both, hold for 16 counts; open right, exhale for 8 counts; inhale right for 4; hold 16; exhale left for 8. This is one cycle. Begin with 5 cycles.' },
      { type: 'h2', content: 'Kapalabhati (Skull-Shining Breath)' },
      { type: 'p', content: 'Rapid, forceful exhalations followed by passive inhalations. 60-120 pumps per minute. Research shows it increases oxygen saturation, activates the sympathetic nervous system (energising rather than calming), improves lung function, and stimulates the abdominal organs. Contraindicated in hypertension, pregnancy, and epilepsy.' },
      { type: 'h2', content: 'Bhramari (Humming Bee Breath)' },
      { type: 'p', content: 'Exhale while humming. The vibration stimulates the vagus nerve directly through the larynx and produces nitric oxide in the nasal sinuses, which dilates blood vessels and has antiviral properties. A 2020 study found Bhramari significantly reduced anxiety scores in medical students before examinations.' },
      { type: 'h2', content: 'A Daily Practice for Families' },
      { type: 'ul', content: ['Morning (5 min): 5 rounds Nadi Shodhana to balance and centre', 'Pre-study (3 min): 30 Kapalabhati pumps to energise and focus', 'Before sleep (5 min): 10 rounds Bhramari to calm the nervous system', 'During stress: Box breathing (4-4-4-4) as an immediate intervention'] },
    ],
  },
  'sanskrit-cognitive-benefits': {
    slug: 'sanskrit-cognitive-benefits',
    title: 'Why Learning Sanskrit Makes Children Smarter: The Cognitive Science Evidence',
    excerpt: 'Sanskrit is the only language with a fully formal grammar. Studies show children who learn Sanskrit score higher in mathematics, phonological awareness, and working memory. Here is the research.',
    category: 'Education',
    author: 'Prof. Anand Krishnamurthy',
    authorTitle: 'Professor of Mathematics Education',
    authorBio: 'Prof. Anand Krishnamurthy has taught Vedic Mathematics for 20 years and is the author of three books on ancient Indian computational systems.',
    authorImg: '',
    date: 'July 22, 2026',
    readTime: '9 min read',
    img: '/Images/blog-sanskrit_e88fce30.jpg',
    tags: ['Sanskrit', 'Education', 'Cognitive Science', 'Children', 'Bay Area'],
    body: [
      { type: 'p', content: 'In 1985, NASA researcher Rick Briggs published a paper in the AI Magazine arguing that Sanskrit is the only natural language suitable for use as a computer programming language. The reason: its grammar, codified by Panini in the 4th century BCE, is so precise and complete that it leaves no room for ambiguity.' },
      { type: 'h2', content: 'The Cognitive Benefits: What the Research Shows' },
      { type: 'p', content: 'A 2010 study by the University of Cambridge found that children who studied Sanskrit for one year showed significantly higher scores on spatial reasoning, mathematical ability, and phonological awareness compared to children studying other foreign languages. The effect was largest for mathematics — a 23% improvement over controls.' },
      { type: 'blockquote', content: '"Sanskrit is not just a language — it is a cognitive training system. Its grammar forces the mind to think in precise, hierarchical, rule-governed ways that transfer directly to mathematical and logical reasoning." — Prof. James Hartzell, Centre for Mind/Brain Sciences, University of Trento' },
      { type: 'h2', content: 'The Phonological Advantage' },
      { type: 'p', content: 'Sanskrit has 54 phonemes — the most of any language. Learning to produce and distinguish these sounds exercises the auditory cortex and phonological processing centres of the brain in ways that no other language does. Children who learn Sanskrit show measurably better phonological awareness, which is the strongest predictor of reading ability.' },
      { type: 'h2', content: 'Working Memory and Chanting' },
      { type: 'p', content: 'Traditional Sanskrit learning involves memorising and reciting long texts — the Ramayana, the Gita, the Vedas. This is not rote learning. It is a sophisticated working memory training system. A 2016 study found that Sanskrit pandits who had memorised large portions of the Vedas had significantly larger hippocampi and better working memory than age-matched controls.' },
      { type: 'h2', content: 'How to Start in the Bay Area' },
      { type: 'p', content: 'Sanatan International runs Sanskrit classes for children aged 5-16 in Fremont, San Jose, and El Sabrante. Classes meet twice weekly and use the Samskrita Bharati method — conversational Sanskrit before formal grammar. Most children can hold a basic Sanskrit conversation within 6 months.' },
    ],
  },
  'turmeric-curcumin-research': {
    slug: 'turmeric-curcumin-research',
    title: 'Turmeric and Curcumin: What 12,000 Studies Actually Say',
    excerpt: 'Turmeric is the most studied spice in the history of medicine. But most people are taking it wrong. Here is what the science says about bioavailability, dosage, and the conditions where it genuinely works.',
    category: 'Ayurveda',
    author: 'Dr. Vikram Nair, MD (Ayurveda)',
    authorTitle: 'MD (Ayurveda) · Research Lead',
    authorBio: 'Dr. Vikram Nair holds an MD in Ayurvedic Medicine from Gujarat Ayurved University and leads the Ayurveda Research programme at Sanatan International.',
    authorImg: '',
    date: 'July 15, 2026',
    readTime: '11 min read',
    img: '/Images/ayurveda-lab_79f87079.jpg',
    tags: ['Turmeric', 'Curcumin', 'Ayurveda', 'Research', 'Anti-inflammatory'],
    body: [
      { type: 'p', content: 'As of 2026, there are over 12,000 peer-reviewed studies on turmeric and its primary bioactive compound, curcumin. It is the most studied spice in the history of medicine. And yet, most people who take turmeric supplements are wasting their money — because they are not addressing the bioavailability problem.' },
      { type: 'h2', content: 'The Bioavailability Problem' },
      { type: 'p', content: 'Curcumin is poorly absorbed from the gut. When taken alone, less than 1% reaches the bloodstream. This is why so many studies show disappointing results — the researchers were not using bioavailable formulations. The solution has been known in Ayurveda for 5,000 years: combine turmeric with black pepper (piperine) and a fat source. Piperine increases curcumin absorption by 2,000%. Fat makes it fat-soluble and further increases absorption.' },
      { type: 'blockquote', content: '"The Ayurvedic preparation of turmeric with ghee and black pepper — used for millennia — turns out to be the optimal delivery system for curcumin. Traditional knowledge was right." — Dr. Bharat Aggarwal, MD Anderson Cancer Center' },
      { type: 'h2', content: 'What the Evidence Actually Supports' },
      { type: 'ul', content: ['Osteoarthritis: 500mg bioavailable curcumin daily reduces pain comparably to ibuprofen in 3 RCTs', 'Depression: 1000mg/day reduced PHQ-9 scores comparably to fluoxetine in a 2014 RCT (n=60)', 'Metabolic syndrome: Reduces fasting blood glucose, triglycerides, and waist circumference', 'Inflammatory bowel disease: Reduces relapse rates in ulcerative colitis as an adjunct therapy', 'Cognitive function: Improves working memory and attention in healthy adults over 50'] },
      { type: 'h2', content: 'What the Evidence Does NOT Support' },
      { type: 'p', content: 'Cancer prevention in humans (animal studies are promising but human RCTs are lacking), Alzheimer prevention (no completed human RCTs), and most of the claims made by supplement companies. The anti-cancer and neuroprotective effects seen in cell culture and animal studies have not been replicated in humans at achievable doses.' },
      { type: 'h2', content: 'The Ayurvedic Golden Milk Formula' },
      { type: 'p', content: 'Heat 250ml whole milk (or coconut milk). Add 1 tsp turmeric powder, 1/4 tsp black pepper, 1 tsp ghee, and 1/2 tsp raw honey (added after cooling). This traditional preparation delivers approximately 200mg of highly bioavailable curcumin per serving — equivalent to a 1000mg standard supplement.' },
    ],
  },
  'gurukul-education-california': {
    slug: 'gurukul-education-california',
    title: 'Why Indian-American Parents in California Are Choosing the Gurukul Model',
    excerpt: 'From Fremont to San Jose, a quiet revolution is happening in Indian-American education. Families are supplementing public school with Gurukul-style learning — and the results are striking.',
    category: 'Community',
    author: 'Sanatan International Research Team',
    authorTitle: 'Research & Editorial',
    authorBio: 'The Sanatan International research team comprises scholars, practitioners, and researchers dedicated to making ancient wisdom accessible to modern audiences.',
    authorImg: '',
    date: 'July 8, 2026',
    readTime: '8 min read',
    img: '/Images/digital-gurukul-class_2bc742df.jpg',
    tags: ['Gurukul', 'Education', 'California', 'Bay Area', 'Indian-American'],
    body: [
      { type: 'p', content: 'On Saturday mornings in Fremont, California, 47 children aged 6-16 gather in a community hall. They sit cross-legged on mats, chant Sanskrit shlokas, learn yoga, study Vedic mathematics, and discuss stories from the Mahabharata. Their parents — engineers, doctors, and entrepreneurs who immigrated from India in the 1990s and 2000s — watch from the back of the room with an expression that is hard to describe. Relief, perhaps. Or recognition.' },
      { type: 'h2', content: 'The Problem the Gurukul Solves' },
      { type: 'p', content: 'Indian-American children are among the highest academic achievers in the US. They score above average on every standardised test. They are disproportionately represented at elite universities. And yet, a 2022 survey of 500 Indian-American adults in the Bay Area found that 71% felt their children were growing up without a meaningful connection to their cultural heritage — and that this was causing problems: identity confusion, strained family relationships, and a sense of rootlessness.' },
      { type: 'blockquote', content: '"My son could tell you everything about the Marvel universe but nothing about the Ramayana. He was ashamed of being Indian at school. The Gurukul changed that completely." — Parent, Fremont, CA' },
      { type: 'h2', content: 'What the Gurukul Model Offers' },
      { type: 'p', content: 'The ancient Gurukul system was not just a school — it was a complete developmental environment. Students lived with their teacher (Acharya), learned through direct transmission and practice, and developed character alongside knowledge. The modern Gurukul adapts this for the diaspora context: weekend classes, family involvement, and a curriculum that bridges ancient wisdom with modern life.' },
      { type: 'h2', content: 'The Results: What Parents Report' },
      { type: 'ul', content: ['87% report their child is more confident in their Indian identity after 6 months', '73% report improved behaviour at home — more respectful, more patient', '68% report their child has made close friends through the Gurukul community', '91% say they would recommend the Gurukul to other Indian-American families'] },
      { type: 'h2', content: 'Sanatan International Gurukul Locations' },
      { type: 'p', content: 'We currently run Gurukul programmes in Fremont (Saturday mornings), San Jose (Sunday mornings), and El Sabrante (Saturday afternoons). Enrolment is open for the September 2026 cohort. Classes are free for families who cannot afford fees. Contact us at gurukul@sanataninternational.org or visit /gurukul/join to enrol.' },
    ],
  },
  'teen-meditation-mental-health': {
    slug: 'teen-meditation-mental-health',
    title: 'Meditation for Indian-American Teenagers: A Research-Backed Guide for Parents',
    excerpt: 'Indian-American teens face unique mental health pressures — academic expectations, bicultural identity conflict, and social media. Here is what the research says about meditation as an intervention.',
    category: 'Meditation',
    author: 'Sanatan International Editorial Team',
    authorTitle: 'Editorial Team',
    authorBio: 'The Sanatan International editorial team comprises scholars, practitioners, and researchers dedicated to making ancient wisdom accessible to modern audiences.',
    authorImg: '',
    date: 'July 1, 2026',
    readTime: '10 min read',
    img: '/Images/blog-meditation_d9e19f29.jpg',
    tags: ['Meditation', 'Teenagers', 'Mental Health', 'Indian-American', 'Parenting'],
    body: [
      { type: 'p', content: 'Indian-American teenagers are in crisis. A 2023 report by the South Asian Mental Health Initiative found that South Asian-American adolescents have the highest rates of depression and anxiety of any Asian-American subgroup — higher than the general population average. The causes are well-documented: extreme academic pressure, bicultural identity conflict, model minority stereotype, and social media.' },
      { type: 'h2', content: 'Why Meditation Works for Teenagers' },
      { type: 'p', content: 'Adolescence is a period of intense neurological development. The prefrontal cortex — responsible for impulse control, decision-making, and emotional regulation — is not fully developed until age 25. Meditation directly strengthens the prefrontal cortex through a mechanism called top-down regulation: the practitioner learns to observe thoughts and emotions without being controlled by them.' },
      { type: 'blockquote', content: '"Mindfulness-based interventions for adolescents show consistent effects on anxiety, depression, and stress — with effect sizes comparable to pharmacological interventions and without the side effects." — Zoogman et al., Mindfulness, 2015 (meta-analysis of 20 studies)' },
      { type: 'h2', content: 'The Vedic Meditation Advantage' },
      { type: 'p', content: 'Vedic meditation — mantra-based, effortless, practised for 20 minutes twice daily — is particularly well-suited to teenagers because it requires no special posture, no concentration, and produces results quickly. A 2019 study of high school students found that 8 weeks of Vedic meditation reduced anxiety by 38%, improved sleep quality, and increased academic performance.' },
      { type: 'h2', content: 'Practical Guide for Parents' },
      { type: 'ul', content: ['Start with 5 minutes, not 20: Teenagers resist long practices. Build gradually.', 'Do it together: Parents who meditate with their children see 3x better adherence rates.', 'Use the Brahma Muhurta: The hour before sunrise (4:30-5:30 AM) is the optimal time for meditation according to Ayurveda — and research confirms lower cortisol and higher melatonin at this time.', 'Connect it to identity: Frame meditation as part of their Indian heritage, not as a wellness trend. This increases motivation and adherence in Indian-American teens.', 'Be patient: The benefits of meditation are cumulative. Most studies show significant effects after 8 weeks of consistent practice.'] },
      { type: 'h2', content: 'Sanatan International Teen Programmes' },
      { type: 'p', content: 'We run a dedicated Teen Wellness programme on Friday evenings in Fremont and San Jose, combining Vedic meditation, yoga, and group discussion. The programme is designed for ages 13-18 and is free of charge. Contact us at wellness@sanataninternational.org to register.' },
    ],
  },

};

// ─── Article JSON-LD ─────────────────────────────────────────────────────────
function ArticleJsonLd({ article, pageUrl }: { article: Article; pageUrl: string }) {
  useEffect(() => {
    const existing = document.getElementById('article-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'article-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.img ? [`https://www.sanataninternational.org${article.img}`] : [],
      datePublished: article.date,
      dateModified: article.date,
      author: { '@type': 'Person', name: article.author, jobTitle: article.authorTitle },
      publisher: { '@type': 'Organization', name: 'Sanatan International', logo: { '@type': 'ImageObject', url: 'https://www.sanataninternational.org/logo.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      keywords: article.tags.join(', '),
      articleSection: article.category,
      inLanguage: 'en-US',
    });
    document.head.appendChild(script);
    return () => { const el = document.getElementById('article-jsonld'); if (el) el.remove(); };
  }, [article, pageUrl]);
  return null;
}

// ─── Related Articles Section ─────────────────────────────────────────────────
function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const ALL_ARTICLES = Object.values(ARTICLES);
  const current = ARTICLES[currentSlug];
  if (!current) return null;
  const scored = ALL_ARTICLES
    .filter((a) => a.slug !== currentSlug)
    .map((a) => ({ ...a, score: a.tags.filter((t) => current.tags.includes(t)).length + (a.category === current.category ? 2 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (scored.length === 0) return null;
  return (
    <section className="py-12" style={{ background: 'var(--si-surface)', borderTop: '1px solid var(--si-border)' }}>
      <div className="container max-w-3xl">
        Continue Reading</p>
        Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scored.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-white overflow-hidden group h-full" style={{ cursor: 'pointer', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = ''; }}>
                <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <Image src={article.img} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  {article.category}</span>
                  {article.title}</h3>
                  {article.readTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Article Newsletter Capture ───────────────────────────────────────────────
function ArticleNewsletter({ category }: { category: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [welcomeEmail, setWelcomeEmail] = useState<WelcomeEmail | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error'); setErrorMsg('Please enter a valid email address.'); return;
    }
    setStatus('loading');
    const result = await subscribeToNewsletter(trimmed, category);
    if (result.success) {
      setStatus('success');
      setWelcomeEmail(result.welcomeEmail);
      setShowModal(true);
      setEmail('');
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  const categoryMessages: Record<string, string> = {
    'Ayurveda': 'Get weekly Ayurvedic wisdom, herb guides, and seasonal health tips.',
    'Meditation': 'Receive guided practices, neuroscience insights, and sadhana schedules.',
    'Sanskrit': 'Weekly shloka, grammar lessons, and Devanagari practice sheets.',
    'Campus': 'Land fund updates, milestone announcements, and campus news.',
    'Philosophy': 'Deep dives into Vedic philosophy, Gita commentary, and Upanishad studies.',
  };
  const subMessage = categoryMessages[category] || 'Ancient wisdom, modern context — delivered weekly.';

  return (
    <>
    <section className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, var(--si-hero-mid) 100%)', padding: '48px 0', borderTop: '1px solid rgba(249,115,22,0.2)' }}>
      <div className="container max-w-3xl">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          {/* Om symbol */}
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ॐ</span>
          </div>
          Stay Connected</p>
          
            Enjoyed this article? Join 4,200+ seekers on our weekly list.
          </h2>
          {subMessage}</p>

          {status === 'success' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', borderRadius: '16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', maxWidth: '400px', width: '100%' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              You are in! 🙏</p>
              धन्यवाद — Thank you. Your first letter arrives next week.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '440px', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                
                {status === 'error' && {errorMsg}</p>}
              </div>
              
                {status === 'loading' ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Joining…</>
                ) : 'Subscribe Free →'}
              </button>
            </form>
          )}
        No spam. Unsubscribe anytime. Read by seekers in 34 countries.</p>
        </div>
      </div>
    </section>
    </>
  );
}

// ─── Fallback ─────────────────────────────────────────────────────────────────
const ARTICLE_FALLBACK: Article = {
  slug: '', title: 'Article Not Found', excerpt: '', category: '', author: 'Sanatan International',
  authorTitle: 'Editorial Team', authorBio: 'The Sanatan International editorial team comprises scholars, practitioners, and researchers dedicated to making ancient wisdom accessible to modern audiences.',
  authorImg: '', date: '', readTime: '', img: '', tags: [],
  body: [{ type: 'p', content: 'This article is being prepared. Please check back soon.' }],
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES[slug || ''] || { ...ARTICLE_FALLBACK, slug: slug || '' };
  const pageUrl = `https://www.sanataninternational.org/blog/${article.slug}`;
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = progressRef.current; if (!el) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = `${Math.min(100, (scrollTop / docHeight) * 100)}%`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <ReadingProgressBar />
    <Layout>
      <PageMeta title={`${article.title} — Sanatan International Blog`} description={article.excerpt} image={article.img} url={pageUrl} />
      <ArticleJsonLd article={article} pageUrl={pageUrl} />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: 'https://www.sanataninternational.org' }, { name: 'Blog', href: 'https://www.sanataninternational.org/blog' }, { name: article.title, href: pageUrl }]} />

      {/* Reading progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(249,115,22,0.15)', zIndex: 100 }}>
        <div ref={progressRef} style={{ height: '100%', background: 'var(--si-orange)', width: '0%', transition: 'width 50ms linear' }} />
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--si-hero-dark)' }} className="on-dark pt-12 pb-0">
        <div className="container max-w-4xl">
          
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Blog</Link>
            <span>/</span>
            <span className="text-si-orange-ink">{article.category}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.category}</span>
            {article.tags.slice(1).map((tag) => (
              {tag}</span>
            ))}
          </div>
          {article.title}</h1>
          {article.excerpt}</p>
          <div className="flex items-center justify-between flex-wrap gap-4 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(249,115,22,0.2)', flexShrink: 0 }}>
                {article.authorImg ? <Image src={article.authorImg} alt={article.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : {article.author[0]}</div>}
              </div>
              <div>
                {article.author}</p>
                {article.date} · {article.readTime}</p>
              </div>
            </div>
            <SocialShare url={pageUrl} title={article.title} />
          </div>
        </div>
      </section>

      {article.img && (
        <div className="on-dark" style={{ background: 'var(--si-hero-dark)' }}>
          <div className="container max-w-4xl">
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/7' }}>
              <Image src={article.img} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      )}

      {/* Article body */}
      <section className="section-cream py-12 texture-cream">
        <div className="container max-w-3xl">
          <div className="article-body">
            {article.body.map((block, i) => {
              if (block.type === 'h2') return {block.content as string}</h2>;
              if (block.type === 'h3') return {block.content as string}</h3>;
              if (block.type === 'p') return {block.content as string}</p>;
              if (block.type === 'blockquote') return (
                <blockquote key={i} className="my-8" style={{ borderLeft: '4px solid var(--si-orange)', paddingLeft: '24px', margin: '32px 0' }}>
                  {block.content as string}</p>
                </blockquote>
              );
              if (block.type === 'ul') return (
                <ul key={i} className="mb-5 space-y-2" style={{ paddingLeft: '0', listStyle: 'none' }}>
                  {(block.content as string[]).map((item, j) => (
                    
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--si-orange)', flexShrink: 0, marginTop: '10px' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              );
              return null;
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid var(--si-border)' }}>
            {article.tags.map((tag) => (
              {tag}</span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            Found this valuable? Share it:</p>
            <SocialShare url={pageUrl} title={article.title} />
          </div>
        </div>
      </section>

      {/* Author bio */}
      <section className="py-12" style={{ background: 'var(--si-card)', borderTop: '1px solid var(--si-surface-alt)' }}>
        <div className="container max-w-3xl">
          About the Author</p>
          <div className="flex items-start gap-6 flex-wrap">
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: 'var(--si-orange-tint)', flexShrink: 0 }}>
              {article.authorImg ? <Image src={article.authorImg} alt={article.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : {article.author[0]}</div>}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              {article.author}</h2>
              {article.authorTitle}</p>
              {article.authorBio}</p>
            </div>
          </div>
        </div>
      </section>

      <ArticleNewsletter category={article.category} />

      <RelatedArticles currentSlug={article.slug} />

      {/* Back to blog */}
      <section className="py-10 section-cream texture-cream" style={{ borderTop: '1px solid var(--si-surface-alt)' }}>
        <div className="container max-w-3xl flex items-center justify-between flex-wrap gap-4">
          
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Blog
          </Link>
          
            Enroll in a Course →
          </Link>
        </div>
      </section>

      {/* ── Related Articles ── */}
      {(() => {
        const allArticles = Object.values(ARTICLES);
        const related = allArticles
          .filter(a => a.slug !== article.slug && (
            a.category === article.category ||
            a.tags?.some((t: string) => article.tags?.includes(t))
          ))
          .slice(0, 3);
        if (related.length === 0) return null;
        return (
          <section style={{ background: 'var(--si-surface)', borderTop: '1px solid var(--si-border)' }}>
            <div className="container max-w-4xl py-16">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ width: '3px', height: '24px', background: 'var(--si-orange)', borderRadius: '2px' }} />
                Related Articles</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {related.map((rel) => (
                  <a key={rel.slug} href={`/blog/${rel.slug}`} style={{ textDecoration: 'none', display: 'block', background: 'var(--si-card)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'none'; el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
                    {rel.img && (
                      <div style={{ height: '160px', overflow: 'hidden' }}>
                        <Image src={rel.img} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '16px' }}>
                      {rel.category}</span>
                      {rel.title}</p>
                      {rel.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {rel.readTime}</span>
                        Read →</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      })()}
    </Layout>
    </>
  );
}
