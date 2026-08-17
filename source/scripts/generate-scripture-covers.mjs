// Designs a cover for each of the 24 classical texts in the Digital Library.
//
// These render as text-only cards, so the library reads as a spreadsheet rather
// than a shelf. Each text is a named work with its own identity, and the
// Devanagari title is the most characteristic thing about it — so that is the
// hero element, not decoration.
//
// Treatment is deliberately different from the book covers: centred, framed and
// symmetrical, echoing a manuscript folio, with a yantra drawn behind the type.
// Category colour carries the section (Vedic saffron, Upanishads violet,
// Itihasa green).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'client/public/Images';
const W = 800;
const H = 1200;

const GROUND = {
  '#F97316': { bg: '#160C03', deep: '#3E1A05', ink: '#FFF6EC' },
  '#7C3AED': { bg: '#0F0A1C', deep: '#241645', ink: '#F4F0FF' },
  '#16A34A': { bg: '#061410', deep: '#0C2E20', ink: '#EDFBF3' },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line.trim()); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

/** Concentric yantra — circles, petal ring and interlocking triangles. */
function yantra(cx, cy, r, colour) {
  const petals = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const x = cx + Math.cos(a) * r * 0.72;
    const y = cy + Math.sin(a) * r * 0.72;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r * 0.17).toFixed(1)}" ry="${(r * 0.07).toFixed(1)}" transform="rotate(${i * 30} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join('');
  const tri = (rot) => {
    const pts = [0, 120, 240].map((d) => {
      const a = ((d + rot) * Math.PI) / 180;
      return `${(cx + Math.cos(a) * r * 0.52).toFixed(1)},${(cy + Math.sin(a) * r * 0.52).toFixed(1)}`;
    });
    return `<polygon points="${pts.join(' ')}"/>`;
  };
  return `<g fill="none" stroke="${colour}" stroke-width="1.1" opacity="0.16">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
    <circle cx="${cx}" cy="${cy}" r="${(r * 0.86).toFixed(1)}"/>
    <circle cx="${cx}" cy="${cy}" r="${(r * 0.55).toFixed(1)}"/>
    ${petals}${tri(-90)}${tri(90)}
  </g>`;
}

function cover(book, cat) {
  const g = GROUND[cat.color] || GROUND['#F97316'];
  const romanLines = wrap(book.title, 18);
  const romanSize = romanLines.length > 1 ? 40 : 46;
  const sanskrit = book.sanskrit || '';
  const devSize = sanskrit.length > 12 ? 62 : sanskrit.length > 8 ? 76 : 92;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stop-color="${g.bg}"/>
      <stop offset="100%" stop-color="${g.deep}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${yantra(W / 2, 560, 300, cat.color)}

  <!-- folio frame -->
  <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="${cat.color}" stroke-width="1.6" opacity="0.4"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" fill="none" stroke="${cat.color}" stroke-width="0.8" opacity="0.22"/>

  <!-- corner ticks -->
  <g fill="none" stroke="${cat.color}" stroke-width="2.4" stroke-linecap="square" opacity="0.85">
    <path d="M46 108 L46 46 L108 46"/><path d="M${W - 108} 46 L${W - 46} 46 L${W - 46} 108"/>
    <path d="M46 ${H - 108} L46 ${H - 46} L108 ${H - 46}"/><path d="M${W - 108} ${H - 46} L${W - 46} ${H - 46} L${W - 46} ${H - 108}"/>
  </g>

  <text x="${W / 2}" y="188" text-anchor="middle" font-family="Georgia, serif" font-size="19"
        letter-spacing="7" fill="${cat.color}" opacity="0.92">${esc(cat.label.toUpperCase())}</text>
  <line x1="${W / 2 - 46}" y1="212" x2="${W / 2 + 46}" y2="212" stroke="${cat.color}" stroke-width="2" opacity="0.7"/>

  <text x="${W / 2}" y="560" text-anchor="middle"
        font-family="Nirmala UI, Mangal, 'Noto Sans Devanagari', serif"
        font-size="${devSize}" fill="${g.ink}">${esc(sanskrit)}</text>

  ${romanLines
    .map((l, i) => `<text x="${W / 2}" y="${700 + i * (romanSize + 12)}" text-anchor="middle" font-family="Georgia, serif" font-size="${romanSize}" font-weight="700" fill="${g.ink}" opacity="0.95">${esc(l)}</text>`)
    .join('')}

  <text x="${W / 2}" y="${700 + romanLines.length * (romanSize + 12) + 34}" text-anchor="middle"
        font-family="Georgia, serif" font-size="21" fill="${g.ink}" opacity="0.5">${esc(book.source || '')}</text>

  <text x="${W / 2}" y="${H - 128}" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${g.ink}" opacity="0.6">Sanatan International</text>
  <text x="${W / 2}" y="${H - 96}" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="4" fill="${cat.color}" opacity="0.75">DIGITAL LIBRARY</text>
</svg>`);
}

const cats = JSON.parse(fs.readFileSync('scripts/data/ebooks.json', 'utf-8'));
const manifest = {};
let made = 0;

for (const cat of cats) {
  for (const book of cat.books) {
    const slug = book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const file = `scripture-${slug}.jpg`;
    const svg = cover(book, cat);
    const buf = await sharp(svg).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    fs.writeFileSync(path.join(DIR, file), buf);
    await sharp(svg).webp({ quality: 80 }).toFile(path.join(DIR, file.replace(/\.jpg$/, '.webp')));
    manifest[book.id] = `/Images/${file}`;
    made++;
    console.log(`  ${book.id}  ${file.padEnd(44)} ${String(Math.round(buf.length / 1024)).padStart(3)} KB  ${book.sanskrit}`);
  }
}

fs.writeFileSync('scripts/data/scripture-covers.json', JSON.stringify(manifest, null, 1));
console.log(`\ncovers created: ${made}`);
