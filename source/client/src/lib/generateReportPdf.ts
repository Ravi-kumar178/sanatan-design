// generateReportPdf.ts
// Generates a professionally branded PDF for Sanatan International quarterly reports.
// Uses jsPDF + jspdf-autotable. No backend required — runs entirely in the browser.
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Brand constants ──────────────────────────────────────────────────────────
const SAFFRON   = [249, 115, 22]  as [number, number, number]; // #F97316
const CHARCOAL  = [26, 26, 26]    as [number, number, number]; // #1A1A1A
const STONE     = [249, 245, 240] as [number, number, number]; // #F9F5F0
const MUTED     = [107, 114, 128] as [number, number, number]; // #6B7280
const GREEN     = [22, 163, 74]   as [number, number, number]; // #16A34A
const RED       = [239, 68, 68]   as [number, number, number]; // #EF4444
const WHITE     = [255, 255, 255] as [number, number, number];
const BORDER    = [229, 231, 235] as [number, number, number]; // #E5E7EB

const fmt = (n: number) => '$' + n.toLocaleString();

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

export async function generateReportPdf(r: Report): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210mm
  const H = doc.internal.pageSize.getHeight();  // 297mm
  const surplus = r.income - r.expenses;
  const surplusColor = surplus >= 0 ? GREEN : RED;

  // ── Try to load logo as base64 ─────────────────────────────────────────────
  let logoDataUrl: string | null = null;
  try {
    const res = await fetch('/Images/logo_01779464.png');
    if (res.ok) {
      const blob = await res.blob();
      logoDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
  } catch { /* logo unavailable, skip */ }

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 1
  // ════════════════════════════════════════════════════════════════════════════

  // ── Saffron header band ────────────────────────────────────────────────────
  doc.setFillColor(...SAFFRON);
  doc.rect(0, 0, W, 28, 'F');

  // ── Logo in header ─────────────────────────────────────────────────────────
  if (logoDataUrl) {
    try { doc.addImage(logoDataUrl, 'PNG', 12, 6, 16, 16); } catch { /* skip */ }
  }

  // ── Organisation name in header ────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  doc.text('SANATAN INTERNATIONAL', logoDataUrl ? 32 : 14, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 230, 200);
  doc.text('Centre for Human Flourishing  ·  www.sanataninternational.org', logoDataUrl ? 32 : 14, 19);

  // ── "FINANCIAL REPORT" label top-right ─────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  doc.text('FINANCIAL REPORT', W - 14, 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Published: ${r.date}`, W - 14, 19, { align: 'right' });

  // ── Stone divider line under header ────────────────────────────────────────
  doc.setDrawColor(...SAFFRON);
  doc.setLineWidth(0.5);
  doc.line(0, 28, W, 28);

  // ── Report title block ─────────────────────────────────────────────────────
  let y = 38;
  doc.setFillColor(...STONE);
  doc.roundedRect(12, y - 4, W - 24, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...CHARCOAL);
  doc.text(r.period, 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Status: ${r.status}  ·  Governance Board Review: ${r.note}`, 18, y + 12);

  y += 30;

  // ── Section: Financial Summary ─────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...SAFFRON);
  doc.text('FINANCIAL SUMMARY', 14, y);
  doc.setDrawColor(...SAFFRON);
  doc.setLineWidth(0.4);
  doc.line(14, y + 1.5, W - 14, y + 1.5);
  y += 6;

  // Three summary boxes
  const boxW = (W - 28 - 8) / 3;
  const boxes = [
    { label: 'TOTAL INCOME', value: fmt(r.income), color: GREEN },
    { label: 'TOTAL EXPENSES', value: fmt(r.expenses), color: RED },
    { label: surplus >= 0 ? 'NET SURPLUS' : 'NET DEFICIT', value: (surplus >= 0 ? '+' : '') + fmt(surplus), color: surplusColor },
  ];
  boxes.forEach((b, i) => {
    const bx = 14 + i * (boxW + 4);
    doc.setFillColor(...STONE);
    doc.roundedRect(bx, y, boxW, 18, 2, 2, 'F');
    doc.setDrawColor(...b.color);
    doc.setLineWidth(1.2);
    doc.line(bx, y, bx, y + 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...b.color);
    doc.text(b.label, bx + 4, y + 6);
    doc.setFontSize(13);
    doc.setTextColor(...CHARCOAL);
    doc.text(b.value, bx + 4, y + 14);
  });
  y += 24;

  // ── Section: Fund Allocation ───────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...SAFFRON);
  doc.text('FUND ALLOCATION', 14, y);
  doc.setDrawColor(...SAFFRON);
  doc.setLineWidth(0.4);
  doc.line(14, y + 1.5, W - 14, y + 1.5);
  y += 6;

  const totalFunds = r.landFund + r.scholarships + r.operations;
  const funds = [
    { label: 'Land Acquisition Fund', value: r.landFund, color: SAFFRON },
    { label: 'Student Scholarships', value: r.scholarships, color: [59, 130, 246] as [number,number,number] },
    { label: 'General Operations', value: r.operations, color: MUTED },
  ];
  funds.forEach((fund) => {
    const pct = totalFunds > 0 ? fund.value / totalFunds : 0;
    const barMaxW = W - 28 - 50 - 30;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...CHARCOAL);
    doc.text(fund.label, 14, y + 3.5);

    // Bar track
    doc.setFillColor(...BORDER);
    doc.roundedRect(75, y, barMaxW, 5, 1, 1, 'F');
    // Bar fill
    doc.setFillColor(...fund.color);
    doc.roundedRect(75, y, Math.max(barMaxW * pct, 2), 5, 1, 1, 'F');

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...CHARCOAL);
    doc.text(fmt(fund.value), W - 14, y + 4, { align: 'right' });

    y += 9;
  });
  y += 4;

  // ── Section: Key Expenditures ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...SAFFRON);
  doc.text('KEY EXPENDITURES', 14, y);
  doc.setDrawColor(...SAFFRON);
  doc.setLineWidth(0.4);
  doc.line(14, y + 1.5, W - 14, y + 1.5);
  y += 6;

  r.highlights.forEach((h) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...CHARCOAL);
    doc.setFillColor(...SAFFRON);
    doc.circle(16, y + 1.5, 0.8, 'F');
    doc.text(h, 20, y + 3);
    y += 7;
  });
  y += 4;

  // ── Section: Transparency Table ────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...SAFFRON);
  doc.text('DETAILED BREAKDOWN', 14, y);
  doc.setDrawColor(...SAFFRON);
  doc.setLineWidth(0.4);
  doc.line(14, y + 1.5, W - 14, y + 1.5);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [['Category', 'Amount', '% of Total']],
    body: [
      ['Total Income', fmt(r.income), '100%'],
      ['Total Expenses', fmt(r.expenses), Math.round((r.expenses / r.income) * 100) + '%'],
      ['Net Surplus / (Deficit)', (surplus >= 0 ? '+' : '') + fmt(surplus), Math.abs(Math.round((surplus / r.income) * 100)) + '%'],
      ['', '', ''],
      ['Land Acquisition Fund', fmt(r.landFund), Math.round((r.landFund / totalFunds) * 100) + '% of funds'],
      ['Student Scholarships', fmt(r.scholarships), Math.round((r.scholarships / totalFunds) * 100) + '% of funds'],
      ['General Operations', fmt(r.operations), Math.round((r.operations / totalFunds) * 100) + '% of funds'],
    ],
    headStyles: {
      fillColor: SAFFRON,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: CHARCOAL },
    alternateRowStyles: { fillColor: STONE },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 45, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
    },
  });

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footerY = H - 14;
  doc.setFillColor(...STONE);
  doc.rect(0, footerY - 6, W, 20, 'F');
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(0, footerY - 6, W, footerY - 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('Sanatan International — Centre for Human Flourishing', 14, footerY);
  doc.text('www.sanataninternational.org  ·  info@sanataninternational.org', 14, footerY + 4);
  doc.text(`Page 1 of 1  ·  Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, W - 14, footerY, { align: 'right' });
  doc.text('All financial data reviewed by the Governance Board. Annual CPA review from FY 2025.', W - 14, footerY + 4, { align: 'right' });

  // ── Saffron bottom accent ──────────────────────────────────────────────────
  doc.setFillColor(...SAFFRON);
  doc.rect(0, H - 2, W, 2, 'F');

  // ── Save ───────────────────────────────────────────────────────────────────
  const filename = `Sanatan-International-Financial-Report-${r.period.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  doc.save(filename);
}
