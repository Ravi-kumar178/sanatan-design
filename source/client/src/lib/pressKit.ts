// ─── Press Kit Generator ──────────────────────────────────────────────────────
// Builds a branded ZIP client-side using JSZip containing:
//   1. Sanatan International logo (PNG)
//   2. Four founder portrait images (JPG)
//   3. A formatted plain-text fact sheet (TXT)
//   4. A README with usage guidelines (TXT)

import JSZip from 'jszip';

// Asset URLs — all served from the local /Images folder
const LOGO_URL = '/Images/live-site-logo_9a0f956f.png';
const FOUNDER_PORTRAITS = [
  { name: 'Pankaj_K_Tyagi_Founder_Technology_Director', url: '/Images/founder-pankaj_ad07290f.jpg' },
  { name: 'Dr_Vineeta_Kapoor_Community_Director',       url: '/Images/founder-vineeta_ac914354.jpg' },
  { name: 'Pandit_Sumit_Sharma_Ji_Spiritual_Director',  url: '/Images/founder-pandit_533a2a4e.jpg' },
  { name: 'Nitan_Sondhi_Co_Founder',                   url: '/Images/founder-nitan_0e7da35f.jpg' },
];

const FACT_SHEET = `SANATAN INTERNATIONAL — PRESS FACT SHEET
Centre for Human Flourishing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABOUT
Sanatan International is a nonprofit Centre for Human Flourishing. We are
building a permanent 33-acre campus in El Sabrante, California, to house
Gurukul-based education, Ayurveda research, ethical technology, and community
welfare programmes. Founded in 2022, the organisation serves students and
families across the United States, India, Canada, and the global diaspora.

TAGLINE
"Ancient human sciences. Modern execution. Public benefit."

MISSION
To preserve, teach, and apply the most advanced and time-tested human sciences
— Vedic education, Ayurveda, and ethical technology — for the benefit of all
humanity, not just a privileged few.

VISION
A permanent, self-sustaining Gurukul campus in El Sabrante, California, that
serves as a global centre for Sanatan learning, research, and community welfare.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOUNDING TEAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PANKAJ K. TYAGI — Founder & Technology Director
Founder of Inerica Systems, a Silicon Valley-based technology automation
company. Pankaj brings decades of enterprise software expertise to the mission
of building ethical, human-centric digital infrastructure for Vedic education.
His belief that technology must serve the human spirit — not exploit it — is
the philosophical foundation of the Digital Welfare Suite and Meta Gurukul.

DR. VINEETA KAPOOR — Community Director
Obstetrician and Gynaecologist, MBBS + MS (Obstetrics & Gynaecology).
Consultant at Eden Hospital, New Delhi. 15+ years of clinical experience.
97% patient recommendation rate (65 ratings). Dr. Kapoor leads community
outreach across India and champions the integration of Ayurvedic principles
into modern preventive healthcare.

PANDIT SUMIT SHARMA JI — Spiritual Director
A practising Sanatan Guru with over 20 years of dedicated study and teaching
of Vedic philosophy, Sanskrit, and ritual tradition. Trained in the classical
Gurukul lineage, he has guided thousands of students and families across India
and the global diaspora. His guidance forms the spiritual backbone of every
programme and curriculum at Sanatan International.

NITAN SONDHI — Co-Founder
Bay Area entrepreneur and community builder. Nitan has been instrumental in
establishing Sanatan International's ground-level presence in Northern
California — building local networks, coordinating volunteer efforts, and
bridging the organisation's global mission with its local community impact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY PROGRAMMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DIGITAL GURUKUL
   Live 20-minute daily classes on Zoom taught by credentialed Acharyas.
   Monthly cohort drops for ages 9-16 in three streams: Sanskrit, Yoga,
   Vedic Science. Weekly free public satsang. Parent dashboard included.

2. AYURVEDA RESEARCH
   Evidence-based documentation of classical Ayurvedic protocols.
   Six active research areas including Tridosha diagnostics, herbal
   pharmacology, and preventive health frameworks.

3. ETHICAL TECHNOLOGY (DIGITAL WELFARE SUITE)
   Human-centric apps designed without addictive dark patterns:
   Dharma Companion, Vedic Calendar, Sanskrit Learning, Wellness Tracker.

4. COMMUNITY WELFARE
   Volunteer networks across El Sabrante, Oakland, and San Jose.
   Elder protection, community circles, and outreach programmes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAND ACQUISITION CAMPAIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goal:        $2,000,000 USD
Raised:      $347,500 USD (17% funded)
Donors:      1,243+
Location:    El Sabrante, California, USA
Campus Size: 33 acres
Purpose:     Permanent Gurukul campus for education, research, and community

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT & MEDIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Website:     https://www.sanataninternational.org
Press:       press@sanataninternational.org
General:     info@sanataninternational.org
Donations:   donate@sanataninternational.org
Gurukul:     gurukul@sanataninternational.org

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOCIAL MEDIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Instagram:   @sanataninternational
Facebook:    /sanataninternational
X/Twitter:   @sanatanintl
YouTube:     /sanataninternational
LinkedIn:    /company/sanataninternational

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOILERPLATE (for media use)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sanatan International is a nonprofit Centre for Human Flourishing building a
permanent 33-acre Gurukul campus in El Sabrante, California. The organisation
offers Vedic education, Ayurveda research, ethical technology, and community
welfare programmes to students and families across the United States, India,
and the global diaspora. Founded in 2022, Sanatan International is funded
entirely by community donations and governed by a transparent board.
For more information, visit www.sanataninternational.org.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
© ${new Date().getFullYear()} Sanatan International. All rights reserved.
`;

const README = `SANATAN INTERNATIONAL — PRESS KIT USAGE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTENTS OF THIS PRESS KIT
  • logo/           — Official Sanatan International logo (PNG, transparent bg)
  • founders/       — High-resolution founder portrait photographs (JPG)
  • Fact_Sheet.txt  — Organisation overview, team bios, key facts, and contacts
  • README.txt      — This file

USAGE GUIDELINES
  1. Logo: Use the logo on white or light backgrounds. Do not alter colours,
     proportions, or add effects. Minimum display size: 48px height.
  2. Portraits: Use only for editorial coverage of Sanatan International.
     Do not crop, filter, or alter the portraits without written permission.
  3. Fact Sheet: Quotes and statistics may be used in media coverage with
     attribution to Sanatan International.
  4. All assets are provided for press and editorial use only. Commercial
     use requires written permission from press@sanataninternational.org.

PERMISSIONS & CREDITS
  For interview requests, high-resolution assets, or additional information:
  press@sanataninternational.org

  Website: https://www.sanataninternational.org

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

async function fetchAsBlob(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

export async function downloadPressKit(
  onProgress?: (step: string, pct: number) => void
): Promise<void> {
  const zip = new JSZip();
  const total = 2 + FOUNDER_PORTRAITS.length; // logo + founders
  let done = 0;

  onProgress?.('Preparing press kit…', 0);

  // 1. Add text files
  zip.file('Fact_Sheet.txt', FACT_SHEET);
  zip.file('README.txt', README);

  // 2. Fetch and add logo
  onProgress?.('Adding logo…', 5);
  const logoBlob = await fetchAsBlob(LOGO_URL);
  if (logoBlob) {
    zip.folder('logo')!.file('Sanatan_International_Logo.png', logoBlob);
  }
  done++;
  onProgress?.('Adding logo…', Math.round((done / total) * 80) + 5);

  // 3. Fetch and add founder portraits
  const founderFolder = zip.folder('founders')!;
  for (const f of FOUNDER_PORTRAITS) {
    onProgress?.(`Adding ${f.name.replace(/_/g, ' ')}…`, Math.round((done / total) * 80) + 5);
    const blob = await fetchAsBlob(f.url);
    if (blob) {
      founderFolder.file(`${f.name}.jpg`, blob);
    }
    done++;
  }

  onProgress?.('Compressing ZIP…', 90);

  // 4. Generate and trigger download
  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sanatan_International_Press_Kit_${new Date().getFullYear()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  onProgress?.('Done!', 100);
}
