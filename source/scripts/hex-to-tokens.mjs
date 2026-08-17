// Replaces hardcoded hex colours with design-system CSS variables, but ONLY
// inside `style={{ ... }}` spans.
//
// Why the narrow scope: SVG presentation attributes (fill="#F97316",
// stroke={hovered ? '#F97316' : '#D1D5DB'}) do NOT resolve var(), so a global
// hex replace would silently break every icon. Brace-matching the style span is
// the only reliable way to know a hex lands in a CSS context.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['client/src/pages', 'client/src/components'];
const SKIP_DIRS = new Set(['ui']);

// External brand colours stay literal — they are not ours to re-theme.
const KEEP = new Set(['#25D366', '#1877F2', '#0A66C2']);

const MAP = {
  '#F97316': 'si-orange',        '#EA6C0A': 'si-orange-dark',
  '#FED7AA': 'si-orange-light',  '#FFF7ED': 'si-orange-tint',
  '#C2410C': 'si-orange-deep',   '#D4A017': 'si-gold',
  '#0F1923': 'si-hero-dark',     '#1A2535': 'si-hero-mid',
  '#FDF8F0': 'si-cream',         '#F5EFE0': 'si-warm',
  '#F9F5F0': 'si-surface',       '#F3F4F6': 'si-surface-alt',
  '#F9FAFB': 'si-surface-subtle',
  '#1A1A1A': 'si-text',          '#111827': 'si-text-black',
  '#374151': 'si-text-strong',   '#4B5563': 'si-text-mid',
  '#6B7280': 'si-text-muted',    '#9CA3AF': 'si-text-light',
  '#E5E7EB': 'si-border',        '#D1D5DB': 'si-border-strong',
  '#16A34A': 'si-success',       '#166534': 'si-success-deep',
  '#4ADE80': 'si-success-light', '#F0FDF4': 'si-success-tint',
  '#10B981': 'si-emerald',
  '#EF4444': 'si-danger',        '#DC2626': 'si-danger-deep',
  '#FEF2F2': 'si-danger-tint',
  '#E11D48': 'si-rose',          '#FFF1F2': 'si-rose-tint',
  '#3B82F6': 'si-info',          '#EFF6FF': 'si-info-tint',
  '#7C3AED': 'si-violet',        '#9333EA': 'si-violet-deep',
  '#F5F3FF': 'si-violet-tint',   '#FDF4FF': 'si-fuchsia-tint',
  '#D97706': 'si-amber',         '#92400E': 'si-amber-deep',
  '#FFFBEB': 'si-amber-tint',
};

/** Returns [start, end) spans of every `style={{ ... }}` value in the source. */
function styleSpans(src) {
  const spans = [];
  const marker = 'style={{';
  let i = 0;
  while ((i = src.indexOf(marker, i)) !== -1) {
    const open = i + marker.length - 2; // position of the first '{' of the object
    let depth = 0;
    let j = open;
    for (; j < src.length; j++) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    if (j < src.length) spans.push([open, j + 1]);
    i = j > i ? j : i + marker.length;
  }
  return spans;
}

const files = [];
for (const root of ROOTS) {
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name));
      } else if (e.name.endsWith('.tsx')) {
        files.push(path.join(dir, e.name));
      }
    }
  })(root);
}

let totalReplaced = 0;
let filesChanged = 0;
const unmapped = new Map();

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const spans = styleSpans(src);
  if (!spans.length) continue;

  let out = '';
  let cursor = 0;
  let replaced = 0;

  const tokenise = (hex) => {
    const key = '#' + hex.slice(1).toUpperCase();
    if (KEEP.has(key)) return hex;
    const token = MAP[key];
    if (!token) {
      unmapped.set(key, (unmapped.get(key) || 0) + 1);
      return hex;
    }
    replaced++;
    return `var(--${token})`;
  };

  for (const [start, end] of spans) {
    out += src.slice(cursor, start);
    out += src.slice(start, end).replace(/#[0-9A-Fa-f]{6}\b/g, tokenise);
    cursor = end;
  }
  out += src.slice(cursor);

  // Imperative assignments (hover handlers etc.) — `el.style.color = '#F97316'`
  // is a CSS context too, so var() resolves there.
  out = out.replace(
    /(\.style\.[a-zA-Z]+\s*=\s*)(['"])(#[0-9A-Fa-f]{6})\2/g,
    (_m, lhs, q, hex) => `${lhs}${q}${tokenise(hex)}${q}`,
  );

  if (replaced > 0) {
    fs.writeFileSync(file, out, 'utf-8');
    totalReplaced += replaced;
    filesChanged++;
  }
}

console.log(`files changed:   ${filesChanged}`);
console.log(`hexes tokenised: ${totalReplaced}`);
if (unmapped.size) {
  console.log(`\nunmapped hexes left inside style objects (long tail, kept as-is):`);
  [...unmapped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([h, n]) => console.log(`  ${h}  x${n}`));
}
