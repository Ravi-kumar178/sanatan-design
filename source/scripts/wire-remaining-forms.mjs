// Converts the last simulated submissions into real delivery.
//
// Several of these already wrote to localStorage, which keeps a copy on the
// visitor's own machine and reaches nobody. localStorage is retained where it
// backs an on-site list, but every one of them now also sends the submission.
import fs from 'node:fs';

const JOBS = [
  {
    file: 'client/src/pages/ComingSoon.tsx',
    find: `      localStorage.setItem(key, JSON.stringify(existing));
      setLoading(false);`,
    replace: `      localStorage.setItem(key, JSON.stringify(existing));
      void submitForm({
        formName: \`Waitlist — \${title}\`,
        inbox: 'general',
        data: { name, email, waitlist: title },
      });
      setLoading(false);`,
  },
  {
    file: 'client/src/pages/GurukuDigital.tsx',
    find: `    setState('loading');
    setTimeout(() => setState('success'), 1200);`,
    replace: `    setState('loading');
    void submitForm({
      formName: 'Digital Gurukul newsletter',
      inbox: 'gurukul',
      data: { email },
    }).then((r: { ok: boolean }) => setState(r.ok ? 'success' : 'error'));`,
  },
  {
    file: 'client/src/pages/MetaGurukul.tsx',
    find: `    await new Promise((r) => setTimeout(r, 1400));
    if (Math.random() > 0.05) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');`,
    replace: `    const result = await submitForm({
      formName: 'Meta Gurukul waitlist',
      inbox: 'gurukul',
      data: { email },
    });
    if (result.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(result.error);`,
  },
];

let done = 0;
for (const job of JOBS) {
  let s = fs.readFileSync(job.file, 'utf-8');
  if (!s.includes(job.find)) {
    console.log(`MISS ${job.file}`);
    continue;
  }
  s = s.replace(job.find, job.replace);
  if (!/from ['"]@\/lib\/formDelivery['"]/.test(s)) {
    const lines = s.split('\n');
    let last = -1;
    for (let i = 0; i < lines.length; i++) if (/^import\s/.test(lines[i])) last = i;
    lines.splice(last + 1, 0, "import { submitForm } from '@/lib/formDelivery';");
    s = lines.join('\n');
  }
  fs.writeFileSync(job.file, s, 'utf-8');
  console.log(`ok   ${job.file}`);
  done++;
}
console.log(`\nwired: ${done}/${JOBS.length}`);
