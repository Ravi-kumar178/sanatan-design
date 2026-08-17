// Marks elements whose inline background is one of the dark surfaces, so the
// saffron-text token resolves to the bright brand colour inside them.
//
// No single saffron clears 4.5:1 on both white and near-black — the two
// requirements are opposed — so the variant has to depend on the ground. The
// class-based approach is used because it is the ground that decides, and the
// ground is a property of the container, not of each label.
//
// Sections already carrying .section-dark / .section-hero / .texture-dark are
// covered by the existing rule and are skipped.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];

const DARK_BG = /background:\s*'(?:var\(--si-(?:ink|ink-deep|hero-dark|hero-mid)\)|linear-gradient\([^']*var\(--si-(?:ink|hero-dark)\)[^']*)'/;

const files = [];
for (const root of ROOTS) {
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== 'ui') walk(path.join(dir, e.name)); }
      else if (e.name.endsWith('.tsx')) files.push(path.join(dir, e.name));
    }
  })(root);
}

/** Spans of every JSX opening tag, brace-aware. */
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

let marked = 0, changed = 0;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const spans = tagSpans(src);
  let out = '', cursor = 0, n = 0;

  for (const [start, end] of spans) {
    let tag = src.slice(start, end);
    out += src.slice(cursor, start);
    cursor = end;

    if (DARK_BG.test(tag) && !/on-dark|section-dark|section-hero|texture-dark/.test(tag)) {
      if (/className="/.test(tag)) {
        tag = tag.replace(/className="/, 'className="on-dark ');
      } else if (/className=\{/.test(tag)) {
        // dynamic className — prepend via template concat
        tag = tag.replace(/className=\{/, 'className={"on-dark " + ');
      } else {
        tag = tag.replace(/^(<[A-Za-z][A-Za-z0-9.]*)/, '$1 className="on-dark"');
      }
      n++;
    }
    out += tag;
  }
  out += src.slice(cursor);

  if (n) {
    fs.writeFileSync(file, out, 'utf-8');
    console.log(`  ${path.relative('client/src', file).padEnd(32)} ${n}`);
    marked += n; changed++;
  }
}
console.log(`\nfiles changed: ${changed}   dark sections marked: ${marked}`);
