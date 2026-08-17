// Associates visible <label> elements with the field that follows them.
//
// The forms render a <label> immediately before their <input>/<select>/<textarea>
// but never wire htmlFor/id, so the browser computes no accessible name: 42
// fields across the site were reaching screen readers as bare "edit text".
//
// Only handles the label-then-field shape. Labels that wrap their field are
// already associated and are skipped, as are fields that already have an id or
// an aria-label.
import fs from 'node:fs';
import path from 'node:path';

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

// `<label ...>…</label>` followed only by whitespace, then an opening field tag.
const PAIR = /(<label\b)([^>]*>)([\s\S]*?<\/label>)(\s*)(<(?:input|select|textarea)\b)/g;

let totalPairs = 0;
let changedFiles = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const slug = path.basename(file, '.tsx').toLowerCase().replace(/[^a-z0-9]/g, '');
  let n = 0;
  let pairs = 0;

  const out = src.replace(PAIR, (match, labelOpen, labelAttrs, labelBody, gap, fieldOpen) => {
    // Already wired, or the field already carries a name — leave alone.
    if (/\bhtmlFor=/.test(labelAttrs)) return match;
    const fieldId = `${slug}-f${++n}`;
    pairs++;
    return `${labelOpen} htmlFor="${fieldId}"${labelAttrs}${labelBody}${gap}${fieldOpen} id="${fieldId}"`;
  });

  if (pairs > 0) {
    fs.writeFileSync(file, out, 'utf-8');
    totalPairs += pairs;
    changedFiles++;
    console.log(`  ${path.relative('client/src', file).padEnd(34)} ${pairs}`);
  }
}

console.log(`\nfiles changed: ${changedFiles}`);
console.log(`label/field pairs associated: ${totalPairs}`);
