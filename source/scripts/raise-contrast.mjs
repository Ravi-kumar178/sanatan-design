// Raises the palette to WCAG AA.
//
// Every failing colour on the site traced back to about ten token values, which
// is only true because colours were tokenised first — otherwise this would have
// been 1,795 individual edits.
//
// Values were chosen as the lightest option that still clears 4.5:1 against the
// lightest surface each is used on, so the design shifts as little as possible.
import fs from 'node:fs';

const FILE = 'client/src/index.css';

const LIGHT = {
  '--si-text-muted': '#646C7A', // was #6B7280 — 4.39:1
  '--si-text-light': '#68707D', // was #9CA3AF — 2.31:1
  '--si-success': '#15803D',    // was #16A34A — 2.99:1
  '--si-info': '#2563EB',       // was #3B82F6 — 3.34:1
  '--si-amber': '#B45309',      // was #D97706 — 2.89:1
  '--si-rose': '#BE123C',       // was #E11D48 — 4.27:1
  '--si-emerald': '#047857',    // was #10B981 — 2.30:1
  '--si-danger': '#C81E1E',     // was #EF4444 — 3.42:1
};

let s = fs.readFileSync(FILE, 'utf-8');

function patchBlock(src, selector, edits, extra) {
  const start = src.indexOf(selector);
  if (start === -1) throw new Error(`block not found: ${selector}`);
  const end = src.indexOf('\n}', start);
  let block = src.slice(start, end);
  for (const [k, v] of Object.entries(edits)) {
    const re = new RegExp(`(${k.replace(/[-]/g, '\\-')}:\\s*)#[0-9A-Fa-f]{6}`);
    if (!re.test(block)) console.warn(`  (no ${k} in ${selector})`);
    block = block.replace(re, `$1${v}`);
  }
  if (extra) block += extra;
  return src.slice(0, start) + block + src.slice(end);
}

s = patchBlock(s, ':root {', LIGHT, `
  /* Saffron used as TEXT. #F97316 is 2.39:1 on white, unreadable for copy, so
     text uses this deeper saffron while fills, icons and borders keep the brand
     colour. Redefined back to bright inside dark chrome below, where the
     original already passes. */
  --si-orange-ink: #C2410C;
`);

s = patchBlock(s, '.dark {', {}, `
  --si-orange-ink: #F0A265;
`);

// Dark chrome is dark in both themes, so saffron text on it should stay bright.
s += `
/* Saffron text sits on dark chrome in these contexts, where the bright brand
   colour already clears AA — so the darker ink variant is reverted locally
   rather than at every call site. */
nav[data-mainav],
footer,
.section-dark,
.section-hero,
.texture-dark {
  --si-orange-ink: #F97316;
}
`;

fs.writeFileSync(FILE, s, 'utf-8');
console.log('raised ' + Object.keys(LIGHT).length + ' tokens + added --si-orange-ink');
