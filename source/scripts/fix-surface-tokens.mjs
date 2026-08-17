// Second-pass fixups so the palette survives a dark theme.
//
// 1. The value-based hex→token pass mapped #1A1A1A to --si-text everywhere, but
//    ~26 of those sites use it as a dark *surface* (navbar, footer, dark
//    sections). Those must stay dark when the theme flips, so they move to
//    --si-ink / --si-ink-deep.
// 2. `background: 'white'` is a card surface and must flip with the theme, so it
//    becomes --si-card. `color: 'white'` is left alone: it sits on saffron and
//    dark backgrounds that stay coloured in both themes.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];
const SURFACE_PROP = /(background|backgroundColor|border[A-Za-z]*)\s*:?[^,;{}]{0,60}$/;

const files = [];
for (const root of ROOTS) {
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name !== 'ui') walk(path.join(dir, e.name));
      } else if (e.name.endsWith('.tsx')) files.push(path.join(dir, e.name));
    }
  })(root);
}

let inkFixed = 0;
let whiteFixed = 0;
let changed = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  let out = src;

  // 1. text tokens standing in for dark surfaces
  out = out.replace(/var\(--si-text(-black)?\)/g, (match, black, offset) => {
    const before = out.slice(Math.max(0, offset - 60), offset);
    if (!SURFACE_PROP.test(before)) return match;
    inkFixed++;
    return black ? 'var(--si-ink-deep)' : 'var(--si-ink)';
  });

  // 2. white card surfaces follow the theme
  out = out.replace(
    /(background|backgroundColor)(\s*:\s*)(['"])white\3/g,
    (_m, prop, sep, q) => {
      whiteFixed++;
      return `${prop}${sep}${q}var(--si-card)${q}`;
    },
  );

  if (out !== src) {
    fs.writeFileSync(file, out, 'utf-8');
    changed++;
  }
}

console.log(`files changed:            ${changed}`);
console.log(`text→ink surface fixes:   ${inkFixed}`);
console.log(`white→--si-card surfaces: ${whiteFixed}`);
