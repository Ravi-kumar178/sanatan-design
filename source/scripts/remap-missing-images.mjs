// Points the last broken image references at existing, topically-correct
// photography the organisation already owns.
//
// These 14 filenames were referenced but never existed. Rather than inventing
// artwork, each is remapped to the closest real asset already in the library —
// the ashwagandha article gets the ashwagandha herb photo, the Sanskrit article
// gets the Sanskrit photo, and so on.
import fs from 'node:fs';
import path from 'node:path';

const MAP = {
  // Blog thumbnails and heroes → matching subject photography
  'blog-ayurveda-doshas_ac45f020.jpg': 'blog-ayurveda_7d8c50b7.jpg',
  'blog-turmeric-research_203dcba5.jpg': 'ayurveda-lab_79f87079.jpg',
  'blog-pranayama-science_5256b006.jpg': 'wellbeing-meditation_66e9e78d.jpg',
  'blog-sanskrit-brain_82227e9f.jpg': 'blog-sanskrit_e88fce30.jpg',
  'blog-meditation-teens_618d451b.jpg': 'blog-meditation_d9e19f29.jpg',
  'blog-gurukul-california_d0e6288e.jpg': 'digital-gurukul-class_2bc742df.jpg',
  'blog-hero-ashwagandha_fd1daf7b.jpg': 'herb-ashwagandha_41c08bf7.jpg',
  'blog-hero-diaspora_8d8d1eeb.jpg': 'impact-family_fd27a18c.jpg',
  'blog-hero-yoga-science_aaefcdb4.jpg': 'course-yoga_06b2172a.jpg',
  'blog-hero-vedic-math_cb2988c9.jpg': 'course-vedic_a01ee9d6.jpg',
  'blog-hero-digital-wellness_8760d5eb.jpg': 'meta-gurukul-app_6104d2a1.jpg',
  // Scaffold-era filenames → the real brand assets
  '01_logo_mark_b1afd559.png': 'logo_01779464.png',
  '27_donate_mandala_e6414f0e.png': 'icon-lotus_855e6a37.png',
  '28_donation_tiers_c27a0367.png': 'icon-giving-hands_3d326c73.png',
};

const DIR = 'client/public/Images';
for (const target of Object.values(MAP)) {
  if (!fs.existsSync(path.join(DIR, target))) {
    console.error(`ABORT: replacement asset missing — ${target}`);
    process.exit(1);
  }
}

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(e.name)) files.push(p);
  }
})('client/src');

let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf-8');
  let out = src;
  for (const [from, to] of Object.entries(MAP)) out = out.split(from).join(to);
  if (out !== src) {
    const n = Object.keys(MAP).reduce((a, k) => a + (src.split(k).length - 1), 0);
    fs.writeFileSync(f, out, 'utf-8');
    console.log(`  ${path.relative('client/src', f).padEnd(30)} ${n}`);
    total += n;
  }
}
console.log(`\nreferences remapped: ${total}`);
