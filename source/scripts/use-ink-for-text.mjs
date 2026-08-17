// Points saffron *text* at --si-orange-ink, and lifts translucent white text on
// dark grounds to a readable alpha.
//
// Only `color:` positions are touched — `background`, `border`, `fill` and
// `stroke` keep --si-orange, so the brand colour is unchanged wherever it is a
// shape rather than a word.
//
// --si-orange-ink resolves to the deep saffron on light surfaces and back to the
// bright brand colour inside dark chrome (see the scoped rule in index.css), so
// a single token is correct in both contexts.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];

// Measured worst-case ratios on the dark grounds these appear on.
const ALPHA = {
  'rgba(255,255,255,0.3)': 'rgba(255,255,255,0.62)',
  'rgba(255, 255, 255, 0.3)': 'rgba(255, 255, 255, 0.62)',
  'rgba(255,255,255,0.35)': 'rgba(255,255,255,0.66)',
  'rgba(255, 255, 255, 0.35)': 'rgba(255, 255, 255, 0.66)',
  'rgba(255,255,255,0.4)': 'rgba(255,255,255,0.7)',
  'rgba(255, 255, 255, 0.4)': 'rgba(255, 255, 255, 0.7)',
  'rgba(255,255,255,0.25)': 'rgba(255,255,255,0.6)',
  'rgba(255, 255, 255, 0.25)': 'rgba(255, 255, 255, 0.6)',
};

const files = [];
for (const root of ROOTS) {
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== 'ui') walk(path.join(dir, e.name)); }
      else if (e.name.endsWith('.tsx')) files.push(path.join(dir, e.name));
    }
  })(root);
}

let inked = 0;
let alphaed = 0;
let changed = 0;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf-8');
  let out = src;

  // saffron in a colour position → ink variant (covers plain and ternary values)
  out = out.replace(/(\bcolor:\s*)([^,;}\n]*?)'var\(--si-orange\)'/g, (m, lhs, mid) => {
    inked++;
    return `${lhs}${mid}'var(--si-orange-ink)'`;
  });
  // imperative hover handlers set colour too
  out = out.replace(/(\.style\.color\s*=\s*)'var\(--si-orange\)'/g, (m, lhs) => {
    inked++;
    return `${lhs}'var(--si-orange-ink)'`;
  });

  // translucent white text on dark grounds
  out = out.replace(/(\bcolor:\s*)([^,;}\n]*?)'(rgba\(255,\s?255,\s?255,\s?0\.(?:25|3|35|4)\))'/g, (m, lhs, mid, rgba) => {
    const to = ALPHA[rgba];
    if (!to) return m;
    alphaed++;
    return `${lhs}${mid}'${to}'`;
  });
  out = out.replace(/(\.style\.color\s*=\s*)'(rgba\(255,\s?255,\s?255,\s?0\.(?:25|3|35|4)\))'/g, (m, lhs, rgba) => {
    const to = ALPHA[rgba];
    if (!to) return m;
    alphaed++;
    return `${lhs}'${to}'`;
  });

  if (out !== src) { fs.writeFileSync(f, out, 'utf-8'); changed++; }
}

console.log(`files changed:            ${changed}`);
console.log(`saffron text → ink:       ${inked}`);
console.log(`white alpha raised:       ${alphaed}`);
