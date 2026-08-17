// Raises the accent colours held in data objects.
//
// Category, tag and pillar colours are stored as hex in data arrays and then
// used as `color:` on labels. The earlier tokenisation deliberately skipped
// these — they are not inside style objects — so they kept the original values
// and still fail contrast as text.
//
// Each is replaced with the same accessible value its token counterpart now
// uses, so a saffron category label matches saffron body copy. These colours are
// also used at 8–15% alpha for tinted backgrounds, where the deeper value is
// visually indistinguishable.
import fs from 'node:fs';
import path from 'node:path';

const MAP = {
  '#F97316': '#C2410C', // saffron
  '#16A34A': '#15803D', // green
  '#3B82F6': '#2563EB', // blue
  '#D97706': '#B45309', // amber
  '#E11D48': '#BE123C', // rose
  '#10B981': '#047857', // emerald
  '#EF4444': '#C81E1E', // red
  '#9333EA': '#7E22CE', // violet-deep
  '#0369A1': '#075985', // sky
  '#4ADE80': '#15803D', // light green used as text
  '#FBBF24': '#B45309', // yellow used as text
  '#EAB308': '#A16207',
  '#F59E0B': '#B45309',
};

// Only the value side of a colour-ish key — never inside a URL, gradient or
// SVG attribute.
const KEY = /\b(color|bg|border|text|accent|dot|ring|fg)(\s*:\s*)'(#[0-9A-Fa-f]{6})'/g;

const ROOTS = ['client/src/pages', 'client/src/components'];
const files = [];
for (const root of ROOTS) {
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== 'ui') walk(path.join(dir, e.name)); }
      else if (e.name.endsWith('.tsx')) files.push(path.join(dir, e.name));
    }
  })(root);
}

let total = 0;
let changed = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf-8');
  let n = 0;
  const out = src.replace(KEY, (m, key, sep, hex) => {
    const to = MAP['#' + hex.slice(1).toUpperCase()];
    if (!to) return m;
    n++;
    return `${key}${sep}'${to}'`;
  });
  if (n) {
    fs.writeFileSync(f, out, 'utf-8');
    console.log(`  ${path.relative('client/src', f).padEnd(32)} ${n}`);
    total += n;
    changed++;
  }
}
console.log(`\nfiles changed: ${changed}   colours raised: ${total}`);
