// Sanatan International — Financial Reports Page
// Full transparency: quarterly income/expense reports, fund balances, audit notes
// Features: expandable accordion, document preview modal, jsPDF download
import { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import PageMeta from '@/components/PageMeta';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import RelatedPages from '@/components/RelatedPages';
import { generateReportPdf } from '@/lib/generateReportPdf';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Report {
  period: string;
  status: string;
  date: string;
  income: number;
  expenses: number;
  landFund: number;
  scholarships: number;
  operations: number;
  highlights: string[];
  note: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const REPORTS: Report[] = [
  {
    period: 'Q2 2025 (Apr–Jun)',
    status: 'Published',
    date: 'July 15, 2025',
    income: 87_450,
    expenses: 52_310,
    landFund: 347_500,
    scholarships: 12_800,
    operations: 22_150,
    highlights: [
      'Land due-diligence legal fees: $18,200',
      'Gurukul programme delivery (3 cohorts): $14,100',
      'SeniorSeva app development milestone: $12,000',
      'Community outreach events (Oakland, San Jose): $8,010',
    ],
    note: 'Reviewed by Governance Board on July 10, 2025.',
  },
  {
    period: 'Q1 2025 (Jan–Mar)',
    status: 'Published',
    date: 'April 12, 2025',
    income: 74_200,
    expenses: 48_900,
    landFund: 260_050,
    scholarships: 9_600,
    operations: 39_300,
    highlights: [
      'Major donor gift for Land Fund: $25,000',
      'Gurukul Level 1 & 2 programme costs: $12,400',
      'Digital Welfare Suite development: $16,500',
      'Volunteer programme coordination: $6,000',
    ],
    note: 'Reviewed by Governance Board on April 8, 2025.',
  },
  {
    period: 'Q4 2024 (Oct–Dec)',
    status: 'Published',
    date: 'January 18, 2025',
    income: 96_800,
    expenses: 61_200,
    landFund: 185_850,
    scholarships: 7_200,
    operations: 53_650,
    highlights: [
      'Year-end fundraising campaign: $42,000 raised',
      'Ayurveda research pilot programme: $18,000',
      'Campus site visits and environmental study: $9,500',
      'Staff salaries and contractor fees: $26,700',
    ],
    note: 'Independently reviewed by CPA firm Sharma & Associates.',
  },
  {
    period: 'Q3 2024 (Jul–Sep)',
    status: 'Published',
    date: 'October 10, 2024',
    income: 52_100,
    expenses: 39_800,
    landFund: 89_050,
    scholarships: 5_400,
    operations: 33_650,
    highlights: [
      'Community events and workshops: $11,200',
      'Website and digital infrastructure: $8,600',
      'Gurukul curriculum development: $7,000',
      'Legal entity formation costs: $13,000',
    ],
    note: 'Reviewed by Governance Board on October 5, 2024.',
  },
  {
    period: 'Q2 2024 (Apr–Jun)',
    status: 'Published',
    date: 'July 8, 2024',
    income: 38_500,
    expenses: 28_200,
    landFund: 37_000,
    scholarships: 3_200,
    operations: 24_800,
    highlights: [
      'Founding donor contributions: $28,000',
      'Initial programme setup costs: $15,000',
      'Community outreach and awareness: $8,200',
      'Administrative and legal setup: $5,000',
    ],
    note: 'First published financial report. Reviewed by founding board.',
  },
];

const fmt = (n: number) => '$' + n.toLocaleString();
const pct = (a: number, b: number) => Math.round((a / b) * 100) + '%';

// ─── Download Button ──────────────────────────────────────────────────────────
function DownloadButton({ report }: { report: Report }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setState('loading');
    try {
      await generateReportPdf(report);
      setState('done');
      setTimeout(() => setState('idle'), 2500);
    } catch {
      setState('idle');
    }
  }, [report]);

  const isLoading = state === 'loading';
  const isDone = state === 'done';

  return (
    
      {isLoading ? (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Generating PDF…</>
      ) : isDone ? (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Downloaded!</>
      ) : (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>"Download PDF"</>
      )}
    </button>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ report, onClose, onDownload }: { report: Report; onClose: () => void; onDownload: () => void }) {
  const surplus = report.income - report.expenses;
  const totalFunds = report.landFund + report.scholarships + report.operations;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(26,26,26,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 200ms ease',
      }}
    >
      <div
        style={{
          background: 'var(--si-card)', borderRadius: '20px',
          width: '100%', maxWidth: '680px',
          maxHeight: '90vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          animation: 'slideUp 250ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Modal header — saffron band */}
        <div style={{ background: 'var(--si-orange)', padding: '20px 24px', flexShrink: 0 }}>
          <div className="flex items-start justify-between">
            <div>
              
                Sanatan International — Financial Report
              </p>
              {report.period}</h2>
              
                Published {report.date} · {report.status}
              </p>
            </div>
            
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Modal body — scrollable */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total Income', value: fmt(report.income), color: 'var(--si-success)', bg: 'var(--si-success-tint)' },
              { label: 'Total Expenses', value: fmt(report.expenses), color: 'var(--si-danger)', bg: 'var(--si-danger-tint)' },
              { label: surplus >= 0 ? 'Net Surplus' : 'Net Deficit', value: (surplus >= 0 ? '+' : '') + fmt(surplus), color: surplus >= 0 ? 'var(--si-success)' : 'var(--si-danger)', bg: surplus >= 0 ? 'var(--si-success-tint)' : 'var(--si-danger-tint)' },
            ].map((item) => (
              <div key={item.label} style={{ background: item.bg, borderRadius: '12px', padding: '12px 14px' }}>
                {item.label}</p>
                {item.value}</p>
              </div>
            ))}
          </div>

          {/* Fund allocation */}
          <div className="mb-6">
            Fund Allocation</p>
            <div className="space-y-2.5">
              {[
                { label: 'Land Acquisition Fund', value: report.landFund, color: 'var(--si-orange-ink)' },
                { label: 'Student Scholarships', value: report.scholarships, color: 'var(--si-info)' },
                { label: 'General Operations', value: report.operations, color: 'var(--si-text-muted)' },
              ].map((fund) => (
                <div key={fund.label} className="flex items-center gap-3">
                  {fund.label}</p>
                  <div style={{ flex: 1, background: 'var(--si-surface-alt)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: pct(fund.value, totalFunds), background: fund.color, height: '100%', borderRadius: '9999px' }} />
                  </div>
                  {fmt(fund.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key expenditures */}
          <div className="mb-6">
            Key Expenditures</p>
            <ul className="space-y-2">
              {report.highlights.map((h) => (
                
                  ›</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Governance note */}
          <div style={{ background: 'var(--si-surface)', borderRadius: '12px', padding: '14px 16px', borderLeft: '3px solid var(--si-orange)' }}>
            Governance Note</p>
            {report.note}</p>
          </div>

          {/* Transparency promise */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--si-surface-alt)' }}>
            
              All financial data is reviewed by the Governance Board. Annual independent CPA review beginning FY 2025.
              Full records available on request at{' '}
              <a className="text-si-orange-ink" href="mailto:info@sanataninternational.org">info@sanataninternational.org</a>.
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--si-surface-alt)', background: '#FAFAFA', flexShrink: 0 }}>
          <div className="flex items-center justify-between gap-3">
            
              Download the full branded PDF for printing or record-keeping.
            </p>
            <div className="flex gap-2 flex-shrink-0">
              
                Close
              </button>
              <DownloadButton report={report} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FinancialReports() {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(REPORTS[0].period);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  return (
    <Layout>
      <PageMeta
        title="Financial Reports"
        description="Full financial transparency from Sanatan International. Quarterly income, expenses, fund balances, and governance notes — all publicly available."
        url="/financial-reports"
        type="website"
      />
      <BreadcrumbJsonLd crumbs={[{ name: 'Home', href: '/' }, { name: 'The Hub', href: '/hub' }, { name: 'Financial Reports', href: '/financial-reports' }]} />

      {/* Preview Modal */}
      {previewReport && (
        <PreviewModal
          report={previewReport}
          onClose={() => setPreviewReport(null)}
          onDownload={() => {}}
        />
      )}

      {/* Hero */}
      <section className="section-dark pt-32 pb-20 texture-dark">
        <div className="container max-w-3xl">
          <p className="label-chip mb-3">The Hub</p>
          
            Financial<br />
            <span className="text-si-orange-ink">Transparency</span>
          </h1>
          
            Every rupee and every dollar is documented publicly. We publish quarterly reports covering all income, expenditure, and fund balances — reviewed by our Governance Board and, annually, by an independent CPA.
          </p>
          "सत्यमेव जयते" — Truth alone triumphs.</p>
        </div>
      </section>

      {/* Summary stats */}
      <section style={{ background: 'var(--si-surface)', borderBottom: '1px solid var(--si-border)' }}>
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Land Fund Balance', value: fmt(347_500), sub: 'of $2M goal' },
              { label: 'Total Raised (2024–25)', value: fmt(349_050), sub: 'across all campaigns' },
              { label: 'Scholarship Fund', value: fmt(38_200), sub: 'disbursed to students' },
              { label: 'Reports Published', value: '5', sub: 'all publicly available' },
            ].map((s) => (
              <div key={s.label} className="card-white p-5 text-center">
                {s.value}</p>
                {s.label}</p>
                {s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports accordion */}
      <section style={{ background: 'var(--si-card)' }}>
        <div className="container py-16 max-w-4xl">
          Quarterly Reports</h2>
          
            Click to expand a report. Use <strong>Preview</strong> to read on-screen, or <strong>{t('common.download')}</strong> to save a branded copy.
          </p>

          <div className="space-y-3">
            {REPORTS.map((r) => {
              const isOpen = expanded === r.period;
              const surplus = r.income - r.expenses;
              const totalFunds = r.landFund + r.scholarships + r.operations;
              return (
                <div key={r.period} style={{ border: `1.5px solid ${isOpen ? 'var(--si-orange)' : 'var(--si-border)'}`, borderRadius: '16px', overflow: 'hidden', transition: 'border-color 200ms ease' }}>
                  {/* Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : r.period)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    style={{ background: isOpen ? 'var(--si-orange-tint)' : 'var(--si-card)', border: 'none', cursor: 'pointer', transition: 'background 200ms ease' }}
                  >
                    <div className="flex items-center gap-4">
                      
                        {r.status}
                      </span>
                      <div>
                        {r.period}</p>
                        Published {r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        Net</p>
                        <p className="font-display font-bold text-sm" style={{ color: surplus >= 0 ? 'var(--si-success)' : 'var(--si-danger)' }}>
                          {surplus >= 0 ? '+' : ''}{fmt(surplus)}
                        </p>
                      </div>
                      
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  <div style={{ maxHeight: isOpen ? '900px' : '0', overflow: 'hidden', transition: 'max-height 400ms cubic-bezier(0.23,1,0.32,1)' }}>
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--si-surface-alt)' }}>
                      {/* Income / Expense cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 mb-5">
                        {[
                          { label: 'Total Income', value: r.income, color: 'var(--si-success)', bg: 'var(--si-success-tint)' },
                          { label: 'Total Expenses', value: r.expenses, color: 'var(--si-danger)', bg: 'var(--si-danger-tint)' },
                          { label: 'Net Surplus', value: surplus, color: surplus >= 0 ? 'var(--si-success)' : 'var(--si-danger)', bg: surplus >= 0 ? 'var(--si-success-tint)' : 'var(--si-danger-tint)' },
                        ].map((item) => (
                          <div key={item.label} style={{ background: item.bg, borderRadius: '12px', padding: '14px 16px' }}>
                            {item.label}</p>
                            {fmt(item.value)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Fund allocation */}
                      <div className="mb-5">
                        Fund Allocation</p>
                        <div className="space-y-2">
                          {[
                            { label: 'Land Acquisition Fund', value: r.landFund, color: 'var(--si-orange-ink)' },
                            { label: 'Student Scholarships', value: r.scholarships, color: 'var(--si-info)' },
                            { label: 'General Operations', value: r.operations, color: 'var(--si-text-muted)' },
                          ].map((fund) => (
                            <div key={fund.label} className="flex items-center gap-3">
                              {fund.label}</p>
                              <div style={{ flex: 1, background: 'var(--si-surface-alt)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                                <div style={{ width: pct(fund.value, totalFunds), background: fund.color, height: '100%', borderRadius: '9999px' }} />
                              </div>
                              {fmt(fund.value)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        Key Expenditures</p>
                        <ul className="space-y-1.5">
                          {r.highlights.map((h) => (
                            
                              ›</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>

                      
                        📋 {r.note}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--si-surface-alt)' }}>
                        {/* Preview button */}
                        
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        {/* Download PDF button */}
                        <DownloadButton report={r} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transparency promise */}
          <div className="mt-10 card-white p-6">
            Our Transparency Promise</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '✓ Quarterly reports published within 15 days of period end',
                '✓ Every donation acknowledged by email within 24 hours',
                '✓ Governance board reviews all expenditures over $5,000',
                '✓ Annual independent CPA review beginning FY 2025',
                '✓ No donation data sold or shared with third parties',
                '✓ All board meeting minutes available on request',
              ].map((item) => (
                {item}</p>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--si-surface-alt)' }}>
              
                Request a specific report or ask a financial question →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedPages current="/financial-reports" picks={['/donate', '/hub', '/contact']} />
    </Layout>
  );
}
