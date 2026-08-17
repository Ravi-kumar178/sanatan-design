// One-off image optimizer for client/public/Images.
// Resizes/recompresses in place and emits a .webp sibling for each raster image.
// Originals are backed up separately before this runs.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2] || 'client/public/Images';
const ICON_MAX = 256;   // icons and logos render at 16-80px; 256 covers 3x retina
const PNG_MAX = 1200;
const JPEG_MAX = 1600;

/** Files only ever rendered at icon scale, regardless of their source resolution. */
const ICON_PATTERN = /^(icon-|live-site-logo|logo_|01_logo)/;

sharp.cache(false);

const rows = [];
let beforeTotal = 0;
let afterTotal = 0;
let webpTotal = 0;

const files = fs.readdirSync(DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const name of files) {
  const src = path.join(DIR, name);
  const ext = path.extname(name).toLowerCase();
  const isPng = ext === '.png';
  const isIcon = ICON_PATTERN.test(name);
  const before = fs.statSync(src).size;
  beforeTotal += before;

  const max = isIcon ? ICON_MAX : isPng ? PNG_MAX : JPEG_MAX;

  try {
    const meta = await sharp(src).metadata();
    const pipeline = sharp(src)
      .rotate() // honour EXIF orientation
      .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });

    const optimized = isPng
      ? await pipeline.clone().png({ compressionLevel: 9, palette: true, quality: 82 }).toBuffer()
      : await pipeline.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer();

    const webp = await pipeline.clone().webp({ quality: 80, effort: 5 }).toBuffer();

    // Only replace if we actually made it smaller.
    const after = optimized.length < before ? optimized.length : before;
    if (optimized.length < before) fs.writeFileSync(src, optimized);

    const webpPath = src.replace(/\.(png|jpe?g)$/i, '.webp');
    fs.writeFileSync(webpPath, webp);

    afterTotal += after;
    webpTotal += webp.length;
    rows.push({
      name,
      dims: `${meta.width}x${meta.height}`,
      before: Math.round(before / 1024),
      after: Math.round(after / 1024),
      webp: Math.round(webp.length / 1024),
    });
  } catch (err) {
    console.error(`FAILED ${name}: ${err.message}`);
    afterTotal += before;
  }
}

rows.sort((a, b) => b.before - a.before);
console.log('file'.padEnd(46), 'orig-dims'.padStart(12), 'before'.padStart(9), 'after'.padStart(9), 'webp'.padStart(9));
for (const r of rows.slice(0, 15)) {
  console.log(
    r.name.padEnd(46),
    r.dims.padStart(12),
    (r.before + 'KB').padStart(9),
    (r.after + 'KB').padStart(9),
    (r.webp + 'KB').padStart(9),
  );
}
const mb = (b) => (b / 1024 / 1024).toFixed(1) + ' MB';
console.log('---');
console.log(`processed:   ${rows.length} images`);
console.log(`before:      ${mb(beforeTotal)}`);
console.log(`after:       ${mb(afterTotal)}  (${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller)`);
console.log(`webp set:    ${mb(webpTotal)}  (${Math.round((1 - webpTotal / beforeTotal) * 100)}% smaller than original)`);
