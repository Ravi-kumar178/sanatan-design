// Second pass: convert style declarations individually rather than all-or-nothing.
//
// The first pass skipped an element entirely if its className already carried
// any font utility — which blocked colour conversions on every heading, since
// `font-display` is unrelated to colour. This one moves each declaration only
// when that specific property is unclaimed, and leaves the rest inline.
//
// The font case matters: an inline `fontFamily` beats a `font-display` class, so
// removing it would silently switch the typeface. That declaration is kept
// inline whenever a font utility is already present.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];

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

const HAS_COLOR_CLASS = /\btext-(?:white|black|si-[a-z-]+|gray-\d+|red-\d+|green-\d+|blue-\d+)\b/;
const HAS_FONT_CLASS = /\bfont-(?:body|display|devanagari|sans|serif|mono)\b/;

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

/** Splits an object body on top-level commas only. */
function splitDecls(inner) {
  const parts = [];
  let depth = 0, tick = false, quote = null, cur = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (quote) { cur += c; if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"') { quote = c; cur += c; continue; }
    if (c === '`') { tick = !tick; cur += c; continue; }
    if (!tick && (c === '(' || c === '[' || c === '{')) depth++;
    if (!tick && (c === ')' || c === ']' || c === '}')) depth--;
    if (!tick && c === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
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

let moved = 0, emptied = 0, changedFiles = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const spans = tagSpans(src);
  let out = '', cursor = 0, n = 0;

  for (const [start, end] of spans) {
    let tag = src.slice(start, end);
    out += src.slice(cursor, start);
    cursor = end;

    const sm = tag.match(/\sstyle=(\{\{[\s\S]*?\}\})/);
    if (!sm || /className=\{/.test(tag)) { out += tag; continue; }

    const cm = tag.match(/className="([^"]*)"/);
    const existing = cm ? cm[1] : '';
    const inner = sm[1].replace(/^\{\{/, '').replace(/\}\}$/, '').trim();
    if (!inner) { out += tag; continue; }

    const decls = splitDecls(inner);
    const keep = [];
    const add = [];

    for (const d of decls) {
      const colour = d.match(/^color:\s*'([^']+)'$/);
      if (colour && COLOR_UTIL[colour[1]] && !HAS_COLOR_CLASS.test(existing) && !add.some((u) => u.startsWith('text-'))) {
        add.push(COLOR_UTIL[colour[1]]);
        continue;
      }
      if (/^fontFamily:\s*'Inter, sans-serif'$/.test(d) && !HAS_FONT_CLASS.test(existing)) {
        add.push('font-body');
        continue;
      }
      keep.push(d);
    }

    if (!add.length) { out += tag; continue; }

    if (keep.length) {
      tag = tag.replace(/\sstyle=\{\{[\s\S]*?\}\}/, ` style={{ ${keep.join(', ')} }}`);
    } else {
      tag = tag.replace(/\sstyle=\{\{[\s\S]*?\}\}/, '');
      emptied++;
    }

    const classes = (existing + ' ' + add.join(' ')).trim().replace(/\s+/g, ' ');
    if (cm) tag = tag.replace(/className="[^"]*"/, `className="${classes}"`);
    else tag = tag.replace(/^(<[A-Za-z][A-Za-z0-9.]*)/, `$1 className="${classes}"`);

    moved += add.length;
    n++;
  }
  out += src.slice(cursor);

  if (n) { fs.writeFileSync(file, out, 'utf-8'); changedFiles++; }
}

console.log(`files changed:              ${changedFiles}`);
console.log(`declarations moved to CSS:  ${moved}`);
console.log(`style attributes removed:   ${emptied}`);
