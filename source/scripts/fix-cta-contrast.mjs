// Solid saffron CTAs carry white text at 2.80:1, below WCAG AA. This swaps the
// *background* of those specific elements to --si-cta (5.18:1 with white),
// leaving --si-orange as the brand colour for fills, icons and borders.
//
// Works per JSX opening tag rather than per style object, because the hover
// handlers live as sibling props: if only the style object were changed,
// onMouseLeave would reset the button to the inaccessible colour.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];

/** Spans of every JSX opening tag, brace-aware so nested `{...}` props are included. */
function tagSpans(src) {
  const spans = [];
  const re = /<[A-Za-z][A-Za-z0-9.]*/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0;
    let i = m.index;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    if (i < src.length) {
      spans.push([m.index, i + 1]);
      re.lastIndex = i;
    }
  }
  return spans;
}

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

let tagsFixed = 0;
let filesChanged = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const spans = tagSpans(src);
  let out = '';
  let cursor = 0;
  let fixed = 0;

  for (const [start, end] of spans) {
    const tag = src.slice(start, end);
    const solidSaffron = /background(Color)?:\s*'var\(--si-orange\)'/.test(tag);
    const whiteText = /color:\s*'white'/.test(tag);

    out += src.slice(cursor, start);
    if (solidSaffron && whiteText) {
      out += tag
        .replace(/(background(?:Color)?:\s*)'var\(--si-orange\)'/g, "$1'var(--si-cta)'")
        .replace(/(\.style\.background(?:Color)?\s*=\s*)'var\(--si-orange\)'/g, "$1'var(--si-cta)'")
        .replace(/(\.style\.background(?:Color)?\s*=\s*)'var\(--si-orange-dark\)'/g, "$1'var(--si-cta-hover)'");
      fixed++;
    } else {
      out += tag;
    }
    cursor = end;
  }
  out += src.slice(cursor);

  if (fixed > 0) {
    fs.writeFileSync(file, out, 'utf-8');
    tagsFixed += fixed;
    filesChanged++;
  }
}

console.log(`files changed: ${filesChanged}`);
console.log(`CTA tags fixed: ${tagsFixed}`);
