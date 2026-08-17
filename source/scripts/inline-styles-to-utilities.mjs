// Converts inline style objects that only set colour and/or the body font into
// Tailwind utilities.
//
// These are the most repeated shapes on the site — `{{ color: 'var(--si-text)' }}`
// alone appears 120 times. They map exactly onto the token utilities exposed in
// index.css, so the conversion is lossless.
//
// Deliberately conservative:
//   • only style objects consisting solely of a recognised colour and/or
//     fontFamily: 'Inter, sans-serif'
//   • skipped when the element's existing className already sets a text colour
//     or font, since class order does not decide CSS precedence and the result
//     could silently flip
//   • skipped when className is a dynamic expression
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];

/** Token → utility. Only tokens exposed under @theme are listed. */
const COLOR_UTIL = {
  'var(--si-text)': 'text-si-text',
  'var(--si-text-black)': 'text-si-text-black',
  'var(--si-text-strong)': 'text-si-text-strong',
  'var(--si-text-mid)': 'text-si-text-mid',
  'var(--si-text-muted)': 'text-si-text-muted',
  'var(--si-text-light)': 'text-si-text-light',
  'var(--si-orange)': 'text-si-orange',
  'var(--si-orange-ink)': 'text-si-orange-ink',
  'var(--si-orange-deep)': 'text-si-orange-deep',
  'var(--si-success)': 'text-si-success',
  'var(--si-danger)': 'text-si-danger',
  'var(--si-info)': 'text-si-info',
  'var(--si-emerald)': 'text-si-emerald',
  'var(--si-violet)': 'text-si-violet',
  'var(--si-rose)': 'text-si-rose',
  'var(--si-amber)': 'text-si-amber',
  white: 'text-white',
};

const FONT_UTIL = 'font-body';

/** Existing utilities that would collide with what we are about to add. */
const CONFLICT = /\b(text-(?:white|black|si-[a-z-]+|gray-\d+|\[)|font-(?:body|display|devanagari|sans|serif|mono))\b/;

function tagSpans(src) {
  const spans = [];
  const re = /<[A-Za-z][A-Za-z0-9.]*/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0, i = m.index;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    if (i < src.length) { spans.push([m.index, i + 1]); re.lastIndex = i; }
  }
  return spans;
}

/** Returns the utility list for a style object, or null if not convertible. */
function utilitiesFor(styleObj) {
  const inner = styleObj.replace(/^\{\{/, '').replace(/\}\}$/, '').trim();
  if (!inner) return null;
  const parts = inner.split(',').map((p) => p.trim()).filter(Boolean);
  const utils = [];
  for (const p of parts) {
    const colour = p.match(/^color:\s*'([^']+)'$/);
    if (colour) {
      const u = COLOR_UTIL[colour[1]];
      if (!u) return null;
      utils.push(u);
      continue;
    }
    if (/^fontFamily:\s*'Inter, sans-serif'$/.test(p)) { utils.push(FONT_UTIL); continue; }
    return null; // anything else and we leave the object alone
  }
  return utils.length ? [...new Set(utils)] : null;
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

let converted = 0, skippedConflict = 0, skippedDynamic = 0, changedFiles = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const spans = tagSpans(src);
  let out = '', cursor = 0, n = 0;

  for (const [start, end] of spans) {
    let tag = src.slice(start, end);
    out += src.slice(cursor, start);
    cursor = end;

    const sm = tag.match(/\sstyle=(\{\{[\s\S]*?\}\})/);
    if (sm) {
      const utils = utilitiesFor(sm[1].replace(/\s+/g, ' ').trim());
      if (utils) {
        const cm = tag.match(/className="([^"]*)"/);
        if (/className=\{/.test(tag)) {
          skippedDynamic++;
        } else if (cm && CONFLICT.test(cm[1])) {
          skippedConflict++;
        } else {
          tag = tag.replace(/\sstyle=\{\{[\s\S]*?\}\}/, '');
          if (cm) tag = tag.replace(/className="([^"]*)"/, (m0, cls) => `className="${cls} ${utils.join(' ')}".replace(/\\s+/g,' ')`.replace('".replace(/\\s+/g,\' \')', '"'));
          else tag = tag.replace(/^(<[A-Za-z][A-Za-z0-9.]*)/, `$1 className="${utils.join(' ')}"`);
          n++;
        }
      }
    }
    out += tag;
  }
  out += src.slice(cursor);

  if (n) {
    fs.writeFileSync(file, out, 'utf-8');
    console.log(`  ${path.relative('client/src', file).padEnd(32)} ${n}`);
    converted += n;
    changedFiles++;
  }
}

console.log(`\nfiles changed:          ${changedFiles}`);
console.log(`inline styles removed:  ${converted}`);
console.log(`skipped (class clash):  ${skippedConflict}`);
console.log(`skipped (dynamic class):${skippedDynamic}`);
