// Follow-up to fix-cta-contrast.mjs.
//
// That pass required a literal `background: 'var(--si-orange)'` alongside a
// literal `color: 'white'`. Selected-state toggles instead write
//   background: active ? 'var(--si-orange)' : 'var(--si-card)'
//   color:      active ? 'white' : 'var(--si-text-muted)'
// so they kept the 2.80:1 combination.
//
// Only the *background* value is rewritten. The same tag often uses
// --si-orange for its border, which should stay the bright brand colour.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];

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

/** End of a CSS property value: the next comma not nested in (), [], {} or a template literal. */
function valueEnd(s, from) {
  let paren = 0, brace = 0, bracket = 0, tick = false;
  for (let i = from; i < s.length; i++) {
    const c = s[i];
    if (c === '`') tick = !tick;
    else if (tick) continue;
    else if (c === '(') paren++;
    else if (c === ')') paren--;
    else if (c === '[') bracket++;
    else if (c === ']') bracket--;
    else if (c === '{') brace++;
    else if (c === '}') { if (brace === 0) return i; brace--; }
    else if (c === ',' && !paren && !brace && !bracket) return i;
  }
  return s.length;
}

const files = [];
for (const root of ROOTS) {
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== 'ui') walk(path.join(dir, e.name)); }
      else if (e.name.endsWith('.tsx')) files.push(path.join(dir, e.name));
    }
  })(root);
}

let fixedTags = 0, changedFiles = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const spans = tagSpans(src);
  let out = '';
  let cursor = 0;
  let fixed = 0;

  for (const [start, end] of spans) {
    let tag = src.slice(start, end);
    out += src.slice(cursor, start);
    cursor = end;

    // The tag must put white text somewhere, otherwise the saffron isn't
    // carrying white and there's nothing to fix.
    if (!/color:\s*[^,;}]*'white'/.test(tag)) { out += tag; continue; }

    let touched = false;
    let result = '';
    let idx = 0;
    const propRe = /background(?:Color)?:\s*/g;
    let pm;
    while ((pm = propRe.exec(tag))) {
      const vStart = pm.index + pm[0].length;
      const vEnd = valueEnd(tag, vStart);
      const value = tag.slice(vStart, vEnd);
      if (value.includes("'var(--si-orange)'")) {
        result += tag.slice(idx, vStart);
        result += value.replaceAll("'var(--si-orange)'", "'var(--si-cta)'");
        idx = vEnd;
        touched = true;
        propRe.lastIndex = vEnd;
      }
    }
    result += tag.slice(idx);
    tag = result;

    if (touched) {
      tag = tag
        .replace(/(\.style\.background(?:Color)?\s*=\s*)'var\(--si-orange\)'/g, "$1'var(--si-cta)'")
        .replace(/(\.style\.background(?:Color)?\s*=\s*)'var\(--si-orange-dark\)'/g, "$1'var(--si-cta-hover)'");
      fixed++;
    }
    out += tag;
  }
  out += src.slice(cursor);

  if (fixed > 0) { fs.writeFileSync(file, out, 'utf-8'); fixedTags += fixed; changedFiles++; }
}

console.log(`files changed: ${changedFiles}`);
console.log(`toggle tags fixed: ${fixedTags}`);
