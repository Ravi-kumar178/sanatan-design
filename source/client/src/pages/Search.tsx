// Sanatan International — Site-wide Search
// Searches across: Blog articles, Books, Programs, Events
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import { Link } from 'wouter';
import { SEARCH_INDEX as GENERATED_INDEX } from '@/lib/searchIndex';
import Image from "@/components/Image";

// ── Search index (static data aggregated from all content) ───────────────────
// Index is generated from App.tsx routes + scripts/data/search-content.json,
// so this page and the Cmd-K palette can never drift apart.
const SEARCH_INDEX = GENERATED_INDEX;

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  page: { label: 'Page', color: 'var(--si-text-strong)', bg: 'var(--si-surface-alt)' },
  article: { label: 'Article', color: 'var(--si-orange-deep)', bg: 'var(--si-orange-tint)' },
  book: { label: 'Book', color: 'var(--si-violet)', bg: 'var(--si-violet-tint)' },
  program: { label: 'Program', color: 'var(--si-info)', bg: 'var(--si-info-tint)' },
  event: { label: 'Event', color: 'var(--si-success-deep)', bg: 'var(--si-success-tint)' },
};

const TYPE_ICONS: Record<string, string> = {
  page: '📄',
  article: '📰',
  book: '📖',
  program: '🎓',
  event: '📅',
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} style={{ background: 'var(--si-orange-light)', color: 'var(--si-amber-deep)', borderRadius: '2px', padding: '0 1px' }}>{part}</mark>
      : part
  );
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'page' | 'article' | 'book' | 'program' | 'event'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Check URL params for initial query
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setQuery(q);
  }, []);

  const results = SEARCH_INDEX.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const counts = {
    all: SEARCH_INDEX.filter(i => !query.trim() || i.title.toLowerCase().includes(query.toLowerCase()) || i.excerpt.toLowerCase().includes(query.toLowerCase()) || i.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))).length,
    page: SEARCH_INDEX.filter(i => i.type === 'page' && (!query.trim() || i.title.toLowerCase().includes(query.toLowerCase()) || i.excerpt.toLowerCase().includes(query.toLowerCase()))).length,
    article: SEARCH_INDEX.filter(i => i.type === 'article' && (!query.trim() || i.title.toLowerCase().includes(query.toLowerCase()) || i.excerpt.toLowerCase().includes(query.toLowerCase()))).length,
    book: SEARCH_INDEX.filter(i => i.type === 'book' && (!query.trim() || i.title.toLowerCase().includes(query.toLowerCase()) || i.excerpt.toLowerCase().includes(query.toLowerCase()))).length,
    program: SEARCH_INDEX.filter(i => i.type === 'program' && (!query.trim() || i.title.toLowerCase().includes(query.toLowerCase()) || i.excerpt.toLowerCase().includes(query.toLowerCase()))).length,
    event: SEARCH_INDEX.filter(i => i.type === 'event' && (!query.trim() || i.title.toLowerCase().includes(query.toLowerCase()) || i.excerpt.toLowerCase().includes(query.toLowerCase()))).length,
  };

  const SUGGESTIONS = ['Ashwagandha', 'Yoga', 'Sanskrit', 'Gurukul', 'Meditation', 'Shilajit', 'Dharma', 'Campus'];

  return (
    <Layout>
      <PageMeta title="Search — Sanatan International" description="Search across all articles, books, programs, and events at Sanatan International." url="/search" type="website" />

      {/* Hero search bar */}
      <section className="on-dark" style={{ background: 'linear-gradient(135deg, var(--si-hero-dark) 0%, var(--si-hero-mid) 100%)', paddingTop: '100px', paddingBottom: '48px' }}>
        <div className="container max-w-3xl">
          Site-wide Search</p>
          
            Find anything on<br />Sanatan International</span>
          </h1>
          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', padding: '4px' }}>×</button>
            )}
          </div>
          {/* Suggestions */}
          {!query && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              Try:</span>
              {SUGGESTIONS.map(s => (
                
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filter tabs + results */}
      <section style={{ background: 'var(--si-surface)', minHeight: '50vh' }}>
        {/* Filter bar */}
        <div style={{ background: 'var(--si-card)', borderBottom: '1px solid var(--si-border)', position: 'sticky', top: '72px', zIndex: 40 }}>
          <div className="container max-w-5xl">
            <div style={{ display: 'flex', overflowX: 'auto' }}>
              {(['all', 'page', 'article', 'book', 'program', 'event'] as const).map(f => (
                
                  {f !== 'all' && <span>{TYPE_ICONS[f]}</span>}
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                  {counts[f]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container max-w-5xl py-10">
          {/* Result count */}
          {query && (
            
              {results.length === 0 ? `No results for "${query}"` : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
            </p>
          )}

          {/* Results list */}
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.map(item => {
                const typeStyle = TYPE_LABELS[item.type];
                return (
                  <Link key={item.id} href={item.url} style={{ textDecoration: 'none', display: 'block', background: 'var(--si-card)', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid var(--si-surface-alt)', transition: 'transform 180ms ease, box-shadow 180ms ease' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 8px rgba(0,0,0,0.05)'; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      {item.type === 'article' && (item as any).img ? (
                        <div style={{ width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={(item as any).img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: typeStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                          {TYPE_ICONS[item.type]}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          {typeStyle.label}</span>
                          {item.category}</span>
                        </div>
                        
                          {highlight(item.title, query)}
                        </p>
                        
                          {highlight(item.excerpt, query)}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {item.tags.slice(0, 4).map(t => (
                            
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '4px' }}><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</p>
              No results found</p>
              Try a different search term or browse by category below.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {SUGGESTIONS.map(s => (
                  {s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Browse all sections */}
          {!query && (
            <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                { href: '/blog', icon: '📰', title: 'All Articles', desc: '11 research-based articles', color: 'var(--si-orange-tint)', border: '#FED7AA', text: 'var(--si-orange-ink)' },
                { href: '/books', icon: '📖', title: 'Digital Library', desc: '16 books, audio, and video courses', color: '#F5F3FF', border: '#DDD6FE', text: 'var(--si-violet)' },
                { href: '/gurukul/programs', icon: '🎓', title: 'Programs', desc: '5 Gurukul programs for all ages', color: 'var(--si-info-tint)', border: '#BFDBFE', text: '#1D4ED8' },
                { href: '/events', icon: '📅', title: 'Events', desc: 'Upcoming satsangs and gatherings', color: 'var(--si-success-tint)', border: '#BBF7D0', text: '#166534' },
              ].map(s => (
                <Link key={s.href} href={s.href} style={{ textDecoration: 'none', display: 'block', background: s.color, border: `1px solid ${s.border}`, borderRadius: '14px', padding: '20px', transition: 'transform 180ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{s.icon}</div>
                  {s.title}</p>
                  {s.desc}</p>
                  Browse all →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
