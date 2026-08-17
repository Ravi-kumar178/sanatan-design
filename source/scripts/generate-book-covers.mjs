// Generates typographic covers for books whose artwork does not exist.
//
// 16 covers were referenced but absent, leaving the Books page full of
// placeholders. A designed typographic cover is a legitimate publishing
// convention — not a stand-in — so these are real artwork built from the
// brand palette rather than grey boxes.
//
// Categories are colour-coded: digital books saffron, audio indigo, video deep
// green, so the shelf reads as a set while each cover stays distinct.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'client/public/Images';
const W = 800;
const H = 1200;

const PALETTES = {
  digital: { bg: '#1A1005', ink: '#FDF8F0', rule: '#F97316', wash: '#7A2E05' },
  audio: { bg: '#0B1220', ink: '#F0F4FF', rule: '#7C9CF9', wash: '#1E2C52' },
  video: { bg: '#08150F', ink: '#EFF7F1', rule: '#4ADE80', wash: '#0F3325' },
};

const BOOKS = [
  ['book-cover-vedanta-modern_0a3dd695.jpg', 'Vedanta in the Modern Age', 'Digital Book', 'digital'],
  ['book-cover-gurukul-method_3e046834.jpg', 'The Gurukul Method', 'Digital Book', 'digital'],
  ['book-cover-ayurveda-decoded_96a23996.jpg', 'Ayurveda Decoded', 'Digital Book', 'digital'],
  ['book-cover-ayurveda-decoded_7c2e1f9a.jpg', 'Ayurveda Decoded', 'Digital Book', 'digital'],
  ['book-cover-diaspora-roots_90883a84.jpg', 'Roots Across Oceans', 'Digital Book', 'digital'],
  ['book-cover-vedic-math_33af1145.jpg', 'Vedic Mathematics', 'Digital Book', 'digital'],
  ['book-cover-sanskrit-beginners_e7dbdb98.jpg', 'Sanskrit for Beginners', 'Digital Book', 'digital'],
  ['book-cover-shilajit-guide_543d503f.jpg', 'Shilajit', 'Digital Book', 'digital'],
  ['book-cover-pranayama-guide_b3dcc147.jpg', 'Pranayama', 'Digital Book', 'digital'],
  ['book-cover-dharma-daily_7af5aa83.jpg', 'Dharma in Daily Life', 'Digital Book', 'digital'],
  ['book-cover-living-yoga_71cb1a67.jpg', 'The Living Yoga', 'Audio Book', 'audio'],
  ['book-cover-meditation-audio_ab0e9a03.jpg', 'Guided Meditations', 'Audio Book', 'audio'],
  ['book-cover-vedic-chanting_1fe457b2.jpg', 'Vedic Chanting', 'Audio Book', 'audio'],
  ['book-cover-gita-audio_37a4e9ad.jpg', 'Bhagavad Gita', 'Audio Book', 'audio'],
  ['book-cover-gita-audio_9f4e2b1c.jpg', 'Bhagavad Gita', 'Audio Book', 'audio'],
  ['book-cover-audio-vedic_5e8b3c2d.jpg', 'Vedic Wisdom', 'Audio Book', 'audio'],
  ['book-cover-dharma-video_f76a134d.jpg', 'Dharma in the Digital Age', 'Video Course', 'video'],
  ['book-cover-parenting-video_84659b40.jpg', 'Raising Dharmic Children', 'Video Course', 'video'],
  ['book-cover-yoga-video_2d7f4e8a.jpg', 'Yoga: Practice & Philosophy', 'Video Course', 'video'],
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy wrap so long titles break sensibly instead of overflowing. */
function wrap(title, max) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function cover(title, kind, pal) {
  const p = PALETTES[pal];
  const lines = wrap(title, 15);
  const size = lines.length > 3 ? 62 : lines.length > 2 ? 74 : 88;
  const startY = 470 - ((lines.length - 1) * size * 0.58);
  const tspans = lines
    .map((l, i) => `<tspan x="80" y="${Math.round(startY + i * size * 1.16)}">${esc(l)}</tspan>`)
    .join('');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.wash}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="0" width="14" height="${H}" fill="${p.rule}" opacity="0.9"/>

  <!-- lotus mark -->
  <g transform="translate(80,150)" fill="none" stroke="${p.rule}" stroke-width="2.4" opacity="0.75">
    <ellipse cx="34" cy="34" rx="9" ry="26"/>
    <ellipse cx="34" cy="34" rx="9" ry="26" transform="rotate(40 34 34)"/>
    <ellipse cx="34" cy="34" rx="9" ry="26" transform="rotate(-40 34 34)"/>
    <ellipse cx="34" cy="34" rx="9" ry="26" transform="rotate(75 34 34)"/>
    <ellipse cx="34" cy="34" rx="9" ry="26" transform="rotate(-75 34 34)"/>
  </g>

  <text x="80" y="290" font-family="Georgia, 'Times New Roman', serif" font-size="21"
        letter-spacing="6" fill="${p.rule}" opacity="0.95">${esc(kind.toUpperCase())}</text>

  <text font-family="Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="700"
        fill="${p.ink}" letter-spacing="-1">${tspans}</text>

  <rect x="80" y="${Math.round(startY + lines.length * size * 1.16 + 30)}" width="118" height="3" fill="${p.rule}"/>

  <text x="80" y="${H - 120}" font-family="Georgia, serif" font-size="26" fill="${p.ink}" opacity="0.62">Sanatan International</text>
  <text x="80" y="${H - 84}" font-family="Georgia, serif" font-size="19" letter-spacing="3" fill="${p.ink}" opacity="0.38">CENTRE FOR HUMAN FLOURISHING</text>
</svg>`);
}

let made = 0;
let skipped = 0;
for (const [file, title, kind, pal] of BOOKS) {
  const out = path.join(DIR, file);
  if (fs.existsSync(out)) { skipped++; continue; }
  const buf = await sharp(cover(title, kind, pal)).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  fs.writeFileSync(out, buf);
  await sharp(cover(title, kind, pal)).webp({ quality: 82 }).toFile(out.replace(/\.jpg$/, '.webp'));
  made++;
  console.log(`  ${file}  ${Math.round(buf.length / 1024)} KB  — ${title}`);
}
console.log(`\ncreated: ${made}   already present: ${skipped}`);
