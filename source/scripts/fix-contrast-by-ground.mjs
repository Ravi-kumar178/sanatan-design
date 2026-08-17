// Final contrast pass, driven by what the browser actually measured.
//
// No single saffron can clear 4.5:1 on both white and near-black — the two
// requirements are mathematically opposed. So the correct variant depends on the
// ground each piece of text sits on, and that is only knowable at runtime.
//
// scripts/../scratchpad/contrast-locs.mjs renders every route and records the
// source line of each failing element together with whether its computed
// background is dark. This applies the matching fix per line:
//
//   dark ground  -> --si-orange (bright brand saffron, 6.3:1 there)
//   light ground -> --si-orange-ink (deep saffron, 4.7:1 there)
//
// Only colour positions are touched; fills and borders are left alone.
import fs from 'node:fs';

const SCRATCH = process.argv[2];
const read = (f) => {
  try {
    return fs.readFileSync(`${SCRATCH}/${f}`, 'utf-8').split('\n').map((s) => s.trim()).filter(Boolean);
  } catch { return []; }
};

/** "client\src\pages\Home.tsx:141" -> { file, line } */
function parseLoc(loc) {
  const m = loc.match(/^(.*):(\d+)$/);
  if (!m) return null;
  return { file: m[1].split('\\').join('/'), line: parseInt(m[2], 10) };
}

const jobs = [
  { locs: read('locs-dark.txt'), from: 'var(--si-orange-ink)', to: 'var(--si-orange)', label: 'dark ground  → bright saffron' },
  { locs: read('locs-light.txt'), from: 'var(--si-orange)', to: 'var(--si-orange-ink)', label: 'light ground → deep saffron' },
];

const edits = new Map(); // file -> [{line, from, to}]
for (const job of jobs) {
  for (const loc of job.locs) {
    const p = parseLoc(loc);
    if (!p || !fs.existsSync(p.file)) continue;
    if (!edits.has(p.file)) edits.set(p.file, []);
    edits.get(p.file).push({ line: p.line, from: job.from, to: job.to, label: job.label });
  }
}

let applied = 0;
let files = 0;
for (const [file, list] of edits) {
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  let n = 0;
  for (const e of list) {
    // The element may span a few lines from its data-loc anchor.
    for (let i = e.line - 1; i < Math.min(lines.length, e.line + 6); i++) {
      const before = lines[i];
      // colour positions only
      const after = before.replace(
        new RegExp(`(\\bcolor:\\s*[^,;}\\n]*?)'${e.from.replace(/[()\\-]/g, '\\$&')}'`, 'g'),
        `$1'${e.to}'`,
      );
      if (after !== before) { lines[i] = after; n++; break; }
    }
  }
  if (n) {
    fs.writeFileSync(file, lines.join('\n'), 'utf-8');
    console.log(`  ${file.replace('client/src/', '').padEnd(32)} ${n}`);
    applied += n;
    files++;
  }
}
console.log(`\nfiles changed: ${files}   colour positions corrected: ${applied}`);
