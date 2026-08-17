// Replaces the remaining simulated form submissions with real delivery.
//
// Each of these handlers set a success state after a setTimeout and discarded
// the data. They now call submitForm(), which POSTs to VITE_FORM_ENDPOINT when
// configured and otherwise opens a prefilled email — and reports failure
// honestly instead of always claiming success.
import fs from 'node:fs';

const JOBS = [
  {
    file: 'client/src/pages/GurukuJoin.tsx',
    inbox: 'gurukul',
    formName: 'Gurukul enrolment enquiry',
    find: /setTimeout\(\(\) => setState\('success'\), 1400\);/,
    replace: `void submitForm({
      formName: 'Gurukul enrolment enquiry',
      inbox: 'gurukul',
      data,
    }).then((r) => setState(r.ok ? 'success' : 'error'));`,
  },
  {
    file: 'client/src/pages/GurukuDigital.tsx',
    inbox: 'gurukul',
    formName: 'Digital Gurukul signup',
    find: /setTimeout\(\(\) => setState\('success'\), 1500\);/,
    replace: `void submitForm({
      formName: 'Digital Gurukul signup',
      inbox: 'gurukul',
      data: { email },
    }).then((r) => setState(r.ok ? 'success' : 'error'));`,
  },
];

let changed = 0;
for (const job of JOBS) {
  let s = fs.readFileSync(job.file, 'utf-8');
  if (!job.find.test(s)) {
    console.log(`MISS ${job.file}`);
    continue;
  }
  s = s.replace(job.find, job.replace);
  if (!s.includes("from '@/lib/formDelivery'")) {
    s = s.replace(/^(import [^\n]*\n)/, `$1import { submitForm } from '@/lib/formDelivery';\n`);
  }
  fs.writeFileSync(job.file, s, 'utf-8');
  console.log(`ok   ${job.file}`);
  changed++;
}
console.log(`\nwired: ${changed}/${JOBS.length}`);
