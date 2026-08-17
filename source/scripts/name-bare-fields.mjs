// Adds aria-label to fields that have no visible label at all — newsletter
// inputs, search boxes, the admin password box. These reach a screen reader as
// an unnamed "edit text" otherwise.
//
// Runs after associate-form-labels.mjs, so anything already wired to a <label>
// has an id and is skipped: an aria-label there would override the visible text
// and break WCAG 2.5.3 (label in name).
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

/** A useful name beats echoing the placeholder — "your@email.com" is not a label. */
function nameFor(tag, attrs) {
  const type = (attrs.match(/\btype="([^"]+)"/) || [])[1] || '';
  const placeholder = (attrs.match(/\bplaceholder="([^"]*)"/) || [])[1] || '';

  if (type === 'email') return 'Email address';
  if (type === 'password') return 'Password';
  if (type === 'tel') return 'Phone number';
  if (type === 'number') return placeholder || 'Amount';
  if (type === 'search' || /search/i.test(placeholder)) return 'Search';
  if (tag === 'textarea') return placeholder || 'Message';
  if (tag === 'select') return 'Select an option';
  if (placeholder) {
    // Trim trailing ellipsis/asterisk noise from placeholder copy.
    return placeholder.replace(/[…*]+$/, '').replace(/\s+$/, '') || 'Text field';
  }
  return null;
}

const FIELD = /<(input|select|textarea)\b([^>]*?)(\/?)>/g;

let added = 0;
let changedFiles = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  let count = 0;

  const out = src.replace(FIELD, (match, tag, attrs, selfClose) => {
    if (/\bid=/.test(attrs)) return match;          // associated with a <label>
    if (/\baria-label/.test(attrs)) return match;   // already named
    if (/\btype="(hidden|submit|button|reset)"/.test(attrs)) return match;
    const name = nameFor(tag, attrs);
    if (!name) return match;
    count++;
    return `<${tag} aria-label="${name.replace(/"/g, '&quot;')}"${attrs}${selfClose}>`;
  });

  if (count > 0) {
    fs.writeFileSync(file, out, 'utf-8');
    added += count;
    changedFiles++;
    console.log(`  ${path.relative('client/src', file).padEnd(34)} ${count}`);
  }
}

console.log(`\nfiles changed: ${changedFiles}`);
console.log(`aria-labels added: ${added}`);
