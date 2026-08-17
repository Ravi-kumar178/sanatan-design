# Sanatan International — Frontend Handover

Everything needed to deploy the site today and to continue building it: the
production build, the full source with git history, all assets, and the build
tooling.

```
site/     deployable static site — upload as-is, nothing to install
source/   full project + git history (node_modules and dist excluded)
```

---

## 1. Deploy now — `site/`

336 files, 42 MB. No server, no database, no build step.

**Netlify / Cloudflare Pages** — point the host at `site/`. `_redirects` is included.
**Azure Static Web Apps** — `staticwebapp.config.json` is included.
**Vercel** — add `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
**nginx / Apache / S3+CloudFront** — configure a fallback so unmatched paths serve
`index.html`, otherwise `/gurukul/programs` 404s on a hard refresh.

Local check: `cd site && npx serve .`

### Verified before packaging

| Check | Result |
| --- | --- |
| Routes serving over HTTP | 18 / 18 |
| Image references vs files present | 149 referenced, **0 missing** |
| Broken images, light + dark theme | **0** |
| Unnamed controls / unlabelled fields / heading jumps / missing alt | **0** each, across 39 routes |
| AI or vendor scaffolding, hardcoded credentials, `%VITE_*%` placeholders, sandbox URLs | **0** each |
| Entry bundle | 65 KB gzipped |

Measured with Chrome's own accessibility tree and a contrast probe, not by eye.

---

## 2. Read this before touching `source/`

**The source is not currently buildable.** A bulk refactor I ran deleted JSX
opening tags across 41 files. There was no version control or backup at that
moment, so the original could not simply be restored.

`git log --all` in `source/` shows three branches:

| Branch | What it holds |
| --- | --- |
| `master` | the tree as it stands, damage included — the honest baseline |
| `recovery/last-good-build` | the exact build in `site/`, from just before the damage |
| `recovery/partial-source` | 1,482 of 2,431 deleted tags rebuilt; **7 files fully restored**, 34 still broken |

### How the recovery works, if you want to continue it

The build was made with `jsxLocPlugin`, which stamps every element with
`data-loc="file:line"`. The bundle preserves that alongside the element's tag and
props, so an element like

```js
e.jsx("h2",{"data-loc":"...About.tsx:70",className:"font-display font-bold text-lg mb-2",
      style:{color:"var(--si-text)"},children:t.title})
```

rebuilds exactly as

```jsx
<h2 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--si-text)' }}>{p.title}</h2>
```

4,483 elements were extracted; **85% have entirely literal props** and are
reproducible byte-for-byte. The tooling is in `source/scripts/`:

```
recover-extract.mjs    pull elements + source locations out of the bundle
recover-assess.mjs     classify each prop as literal or expression
recover-gaps.mjs       report which tags are missing, per file
recover-rebuild5.mjs   place tags back, with drift-corrected anchoring
```

Run against `recovery/last-good-build`'s `dist/`.

**Why it stops at 7 files.** Multi-line opening tags were deleted whole, so line
numbers below each deletion shift — `Donate.tsx` lost 114 lines. Placement needs
drift correction re-synced against surviving tags, which works where a file has
enough surviving anchors and fails where deletions cluster. 236 rebuilt tags also
carry a prop that compiled to a minified expression (`onClick`, dynamic `style`);
those are preserved with mangled identifiers and listed in
`scripts/data/recovery-review.txt`.

**If a copy of this project exists anywhere** — an older zip, a colleague's
machine, an earlier handover — use it. Restoring from it and re-applying the work
via the scripts below is far quicker than finishing the reconstruction.

### What is completely intact

Everything outside the page components, and it is a lot:

- `client/src/index.css` — the full design-token system: 40+ tokens, dark theme,
  focus-visible, reduced-motion, skeleton and transition styles
- `client/src/lib/` — `formDelivery`, `donation`, `calendar` (.ics), `analytics`,
  `searchIndex`, `imageManifest`, `scriptureCovers`, `pressKit`, `generateReportPdf`
- `client/src/hooks/`, `client/src/contexts/` — theme and language providers
- `client/src/components/` — 13 of 18 compile cleanly, including `Image`,
  `Layout`, `ThemeToggle`, `CommandPalette`, `RouteSkeleton`, `Analytics`
- all 47 shadcn `ui/` primitives
- **all 286 image assets**, including 43 covers generated for this project
- 21 build and maintenance scripts

---

## 3. Build commands

```bash
pnpm install
pnpm build          # generates search index + SEO files, then builds to dist/
pnpm check          # typecheck  (currently fails — see section 2)
pnpm images         # re-optimise images + regenerate the manifest
pnpm search:index   # regenerate the search index from App.tsx routes
pnpm seo            # regenerate sitemap.xml, robots.txt, llms.txt
```

`build`, `search:index` and `seo` derive their output from the route table in
`App.tsx`, so the sitemap and search index cannot drift out of sync with the app.

---

## 4. Configuration

The site runs with none of these set. Setting them turns stubs into live features:

| Variable | Effect |
| --- | --- |
| `VITE_FORM_ENDPOINT` | All 15 forms POST to a form service (Formspree, Web3Forms, Basin…). Without it they open a prefilled email — which reaches a human, but needs the visitor to press send. |
| `VITE_DONATE_URL` | Donate hands off to a hosted donation page (Donorbox, Every.org, Givebutter…) with amount and frequency prefilled. Without it, the form records a pledge and says payment instructions will follow. |
| `VITE_ANALYTICS_ENDPOINT` + `VITE_ANALYTICS_WEBSITE_ID` | Enables Umami. Loads only after the visitor accepts the cookie banner, and tracks route changes so sessions aren't all counted as bounces. |

These are compiled in, so changing them means rebuilding from source.

---

## 5. What still needs a backend

Nothing in the build pretends to work. Two things are genuinely server-side:

1. **Payments.** A static site cannot take card details. Route giving through a
   hosted donation page via `VITE_DONATE_URL`, or build a checkout against Stripe.
2. **Form storage and admin.** Submissions currently reach a human by email. A
   real endpoint gives you a dashboard, notifications and a database.

There is also an internal submissions viewer at
`client/src/pages/AdminSubmissions.tsx` which is **deliberately not routed**. It
previously sat behind a password compiled into the public bundle — readable by
anyone, so it protected nothing. Re-enable the route only behind a server-side
session.

---

## 6. Known issues to pick up

| | |
| --- | --- |
| Source does not compile | 34 files — section 2 |
| Inline styles | ~2,000 `style={{…}}` objects remain; colours are tokenised, layout is not |
| Unused UI primitives | 47 of 53 shadcn components unused — harmless, but misleading |
| Hindi translation | `LanguageContext` exists but most copy uses inline ternaries, so the toggle changes little |
| Press release archive | One dated entry still says "Five ethically designed applications". Left alone deliberately — it is a published historical record, not live copy |
