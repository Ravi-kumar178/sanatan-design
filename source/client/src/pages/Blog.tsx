// Blog listing page — Sanatan International
// Design: saffron, cream, charcoal editorial style with Trending sidebar
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import SocialShare from '@/components/SocialShare';
import RelatedPages from '@/components/RelatedPages';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import Image from "@/components/Image";

const ARTICLES = [
  {
    id: 1, slug: 'ashwagandha-modern-science', featured: true,
    title: 'Ashwagandha: What 5,000 Years of Ayurveda and Modern Science Agree On',
    excerpt: 'From the Charaka Samhita to peer-reviewed clinical trials — the evidence for Withania somnifera as an adaptogen, cortisol regulator, and cognitive enhancer is now overwhelming.',
    category: 'Ayurveda', author: 'Dr. Vikram Nair, MD (Ayurveda)', date: 'July 28, 2026', readTime: '8 min read',
    img: '/Images/blog-ayurveda_7d8c50b7.jpg', tags: ['Ayurveda', 'Herbs', 'Research'], views: 4820,
  },
  {
    id: 2, slug: 'vedic-meditation-neuroscience', featured: false,
    title: 'The Neuroscience of Vedic Meditation: What Happens in the Brain After 40 Days',
    excerpt: 'Ancient texts prescribed 40-day sadhana cycles for a reason. New fMRI studies show measurable changes in the default mode network, prefrontal cortex thickness, and amygdala reactivity.',
    category: 'Meditation', author: 'Swami Dharmananda', date: 'July 21, 2026', readTime: '11 min read',
    img: '/Images/blog-meditation_d9e19f29.jpg', tags: ['Meditation', 'Neuroscience', 'Sadhana'], views: 3941,
  },
  {
    id: 3, slug: 'why-sanskrit-matters', featured: false,
    title: 'Why Sanskrit Is the Most Precisely Engineered Language Ever Created',
    excerpt: "Panini's Ashtadhyayi contains 3,959 rules that generate the entire Sanskrit grammar from first principles. Computer scientists have called it the first formal grammar in human history.",
    category: 'Sanskrit', author: 'Pandit Ramesh Shastri', date: 'July 14, 2026', readTime: '9 min read',
    img: '/Images/blog-sanskrit_e88fce30.jpg', tags: ['Sanskrit', 'Language', 'Education'], views: 3102,
  },
  {
    id: 4, slug: 'el-sabrante-campus-update', featured: false,
    title: 'El Sabrante Campus Update: Land Acquisition Phase and What Comes Next',
    excerpt: 'We have raised $347,500 toward our $2M land acquisition goal. Here is the site plan, the zoning timeline, the first three structures, and why this 33-acre site is the right home.',
    category: 'Campus', author: 'Sanatan International Team', date: 'July 7, 2026', readTime: '6 min read',
    img: '/Images/campus-drone_f20a22ae.jpg', tags: ['Campus', 'Land Fund', 'Update'], views: 2788,
  },
  {
    id: 5, slug: 'tridosha-modern-life', featured: false,
    title: 'Vata, Pitta, Kapha: How to Use the Tridosha Framework in Modern Life',
    excerpt: 'The three doshas are not personality types or horoscopes. They are a functional model of biological intelligence — a map of how energy moves through the body and mind.',
    category: 'Ayurveda', author: 'Dr. Ananya Krishnamurthy', date: 'June 30, 2026', readTime: '10 min read',
    img: '/Images/blog-ayurveda_7d8c50b7.jpg', tags: ['Ayurveda', 'Doshas', 'Wellness'], views: 2341,
  },
  {
    id: 6, slug: 'bhagavad-gita-leadership', featured: false,
    title: 'The Bhagavad Gita as a Leadership Manual: Three Principles for 2026',
    excerpt: "Krishna's counsel to Arjuna is a treatise on decision-making under uncertainty, leading without ego, and acting with full commitment while releasing attachment to outcome.",
    category: 'Philosophy', author: 'Swami Dharmananda', date: 'June 23, 2026', readTime: '7 min read',
    img: '/Images/blog-meditation_d9e19f29.jpg', tags: ['Philosophy', 'Leadership', 'Bhagavad Gita'], views: 1987,
  },
  {
    id: 7, slug: 'tridosha-ayurveda-bay-area', featured: false,
    title: 'Ayurveda and the Three Doshas: A Complete Guide for Bay Area Families',
    excerpt: 'Vata, Pitta, and Kapha are not a personality quiz — they are a precise functional model of biological intelligence. Here is how Indian-American families in California are using the Tridosha framework to transform their health.',
    category: 'Ayurveda', author: 'Dr. Ananya Krishnamurthy', date: 'August 1, 2026', readTime: '10 min read',
    img: '/Images/blog-ayurveda_7d8c50b7.jpg', tags: ['Ayurveda', 'Doshas', 'Bay Area', 'Wellness', 'California'], views: 2910,
  },
  {
    id: 8, slug: 'pranayama-science-guide', featured: false,
    title: 'Pranayama: The Breath Science That Neurology Is Finally Catching Up To',
    excerpt: 'Nadi Shodhana, Kapalabhati, Bhramari — ancient breathing techniques now validated by peer-reviewed research. A comprehensive guide for Indian-American families in the US.',
    category: 'Wellness', author: 'Dr. Priya Sharma, PhD', date: 'July 28, 2026', readTime: '12 min read',
    img: '/Images/wellbeing-meditation_66e9e78d.jpg', tags: ['Pranayama', 'Breathing', 'Neuroscience', 'Wellness', 'Yoga'], views: 3450,
  },
  {
    id: 9, slug: 'sanskrit-cognitive-benefits', featured: true,
    title: 'Why Learning Sanskrit Makes Children Smarter: The Cognitive Science Evidence',
    excerpt: 'Sanskrit is the only language with a fully formal grammar. Studies show children who learn Sanskrit score higher in mathematics, phonological awareness, and working memory.',
    category: 'Education', author: 'Prof. Anand Krishnamurthy', date: 'July 22, 2026', readTime: '9 min read',
    img: '/Images/blog-sanskrit_e88fce30.jpg', tags: ['Sanskrit', 'Education', 'Cognitive Science', 'Children', 'Bay Area'], views: 4120,
  },
  {
    id: 10, slug: 'turmeric-curcumin-research', featured: true,
    title: 'Turmeric and Curcumin: What 12,000 Studies Actually Say',
    excerpt: 'Turmeric is the most studied spice in the history of medicine. But most people are taking it wrong. Here is what the science says about bioavailability, dosage, and the conditions where it genuinely works.',
    category: 'Ayurveda', author: 'Dr. Vikram Nair, MD (Ayurveda)', date: 'July 15, 2026', readTime: '11 min read',
    img: '/Images/ayurveda-lab_79f87079.jpg', tags: ['Turmeric', 'Curcumin', 'Ayurveda', 'Research', 'Anti-inflammatory'], views: 5680,
  },
  {
    id: 11, slug: 'gurukul-education-california', featured: true,
    title: 'Why Indian-American Parents in California Are Choosing the Gurukul Model',
    excerpt: 'From Fremont to San Jose, a quiet revolution is happening in Indian-American education. Families are supplementing public school with Gurukul-style learning — and the results are striking.',
    category: 'Community', author: 'Sanatan International Research Team', date: 'July 8, 2026', readTime: '8 min read',
    img: '/Images/digital-gurukul-class_2bc742df.jpg', tags: ['Gurukul', 'Education', 'California', 'Bay Area', 'Indian-American'], views: 6230,
  },
  {
    id: 12, slug: 'teen-meditation-mental-health', featured: false,
    title: 'Meditation for Indian-American Teenagers: A Research-Backed Guide for Parents',
    excerpt: 'Indian-American teens face unique mental health pressures. Here is what the research says about Vedic meditation as an intervention for anxiety, identity conflict, and academic stress.',
    category: 'Meditation', author: 'Sanatan International Editorial Team', date: 'July 1, 2026', readTime: '10 min read',
    img: '/Images/blog-meditation_d9e19f29.jpg', tags: ['Meditation', 'Teenagers', 'Mental Health', 'Indian-American', 'Parenting'], views: 4890,
  },
];

const CATEGORIES = ['All', 'Ayurveda', 'Meditation', 'Sanskrit', 'Campus', 'Philosophy', 'Wellness', 'Education', 'Community'];

// Top 2 most-read article IDs
const MOST_READ_IDS = new Set(
  [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 2).map((a) => a.id)
);

// ─── Trending Sidebar ─────────────────────────────────────────────────────────
function TrendingSidebar({ currentSearch, onTagClick }: { currentSearch: string; onTagClick: (tag: string) => void }) {
  const trending = [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 5);
  const allTags = Array.from(new Set(ARTICLES.flatMap((a) => a.tags))).slice(0, 12);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Trending */}
      <div style={{ background: 'var(--si-card)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          Trending Now</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trending.map((article, i) => (
            <Link key={article.id} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span className="font-display font-black" style={{ color: i === 0 ? 'var(--si-orange-ink)' : 'var(--si-text-muted)', fontSize: '1.4rem', lineHeight: 1, minWidth: '24px' }}>{i + 1}</span>
              <div>
                
                  {article.title}
                </p>
                {article.views.toLocaleString()} views · {article.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div style={{ background: 'var(--si-card)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Popular Topics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter mini */}
      <div className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, var(--si-hero-mid) 100%)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '1.8rem' }}>ॐ</span>
        Weekly Wisdom</p>
        Ancient insights, modern context. Join 4,200+ seekers.</p>
        
          Subscribe Free →
        </Link>
      </div>
    </aside>
  );
}

export default function Blog() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  // Rotate featured article weekly — cycles through all featured-flagged articles by ISO week
  const getISOWeek = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  };
  const featuredPool = ARTICLES.filter((a) => a.featured);
  const weeklyFeatured = featuredPool.length > 0
    ? featuredPool[getISOWeek() % featuredPool.length]
    : ARTICLES[0];
  // When searching/filtering, fall back to first matching featured or first result
  const featured = (searchQuery || activeCategory !== 'All')
    ? (filtered.find((a) => a.featured) || filtered[0])
    : (filtered.includes(weeklyFeatured) ? weeklyFeatured : filtered[0]);
  const rest = filtered.filter((a) => a !== featured);
  const visibleRest = rest.slice(0, visibleCount - 1);
  const hasMore = rest.length > visibleRest.length;

  const pageUrl = 'https://www.sanataninternational.org/blog';

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveCategory('All');
    setVisibleCount(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <PageMeta
        title="Official Blog — Sanatan International"
        description="Insights on Ayurveda, Sanskrit, Vedic meditation, campus updates, and ancient wisdom for modern living. Written by credentialed scholars and practitioners."
        image="/Images/og-blog_c5a8e7f2.jpg"
        url={pageUrl}
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: 'https://www.sanataninternational.org' }, { name: 'Newsroom', href: 'https://www.sanataninternational.org/blog' }, { name: 'Blog', href: pageUrl }]} />

      {/* Hero */}
      <section className="on-dark py-16" style={{ background: 'var(--si-hero-dark)' }}>
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            Newsroom · The Official Blog</p>
            The Official Blog</h1>
            
              Ayurveda research, Sanskrit scholarship, Vedic philosophy, campus updates, and practical ancient wisdom — written by credentialed teachers and researchers, not content farms.
            </p>
            {/* Enhanced search */}
            <div style={{ position: 'relative', maxWidth: '480px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            {searchQuery && (
              
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="on-dark" style={{ background: 'var(--si-hero-dark)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: '80px', zIndex: 40 }}>
        <div className="container">
          <div className="flex gap-1 overflow-x-auto pb-0" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="section-cream py-16 texture-cream">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Main column */}
            <div className="lg:col-span-3">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  No articles found</p>
                  Try a different search term or category.</p>
                  Clear filters</button>
                </div>
              ) : (
                <>
                  {/* Featured article */}
                  {featured && (
                    <div className="mb-10 reveal">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 card-white overflow-hidden">
                        <div className="overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '260px' }}>
                          <Image src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        </div>
                        <div className="p-7 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-3">
                            {featured.category}</span>
                            Featured</span>
                            {MOST_READ_IDS.has(featured.id) && (
                              
                                🔥 Most Read
                              </span>
                            )}
                            👁 {featured.views.toLocaleString()} views</span>
                          </div>
                          {featured.title}</h2>
                          {featured.excerpt}</p>
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                              {featured.author}</p>
                              {featured.date} · {featured.readTime}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <SocialShare url={`${pageUrl}/${featured.slug}`} title={featured.title} compact />
                              
                                Read →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Article grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visibleRest.map((article, i) => (
                      <div key={article.id} className={`reveal delay-${(i % 2 + 1) * 100} card-white overflow-hidden group`}>
                        <div className="overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                          <Image src={article.img} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          {article.category}</span>
                          {MOST_READ_IDS.has(article.id) && (
                            
                              🔥 Most Read
                            </span>
                          )}
                          <Link href={`/blog/${article.slug}`} style={{ position: 'absolute', inset: 0 }} aria-label={`Read ${article.title}`} />
                        </div>
                        <div className="p-5">
                          {article.title}</h3>
                          {article.excerpt}</p>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              {article.author.split(',')[0]}</p>
                              {article.date} · {article.readTime}</p>
                            </div>
                            {article.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            
                              Read Article <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </Link>
                            <SocialShare url={`${pageUrl}/${article.slug}`} title={article.title} compact />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                      
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                        Load More Articles ({rest.length - visibleRest.length} remaining)
                      </button>
                    </div>
                  )}
                  {!hasMore && rest.length > 0 && (
                    
                      You have read all {filtered.length} articles in this category. ✓
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TrendingSidebar currentSearch={searchQuery} onTagClick={handleTagClick} />
            </div>
          </div>
        </div>
      </div>

      <RelatedPages current="/blog" />
    </Layout>
  );
}
