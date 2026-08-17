# Press Release Workflow

Follow these steps every time you publish a new press release on the Media & Press page.

---

## Step 1 — Prepare the image

Choose or create a **1200×630px** image that visually represents the press release topic. Good sources:
- A photo from the event or announcement
- A screenshot of the product or app being announced
- One of the existing campus renders from `client/public/Images/`

Save the image locally (e.g., `my-press-release-image.jpg`).

---

## Step 2 — Upload the image

Run the upload command from the project root:

```bash
# copy the file into client/public/Images/, e.g.
cp path/to/my-press-release-image.jpg
```

This returns a storage path like:
```
/Images/my-press-release-image_a1b2c3d4.jpg
```

Copy this path — you will use it in Step 3.

---

## Step 3 — Add the release to Press.tsx

Open `client/src/pages/Press.tsx` and find the `RELEASES` array near the top of the file.

Add a new entry at the **top** of the array (newest first):

```tsx
const RELEASES = [
  {
    slug: 'your-unique-slug-here',          // URL-safe, hyphenated, unique
    date: 'August 1, 2025',                 // Full date, e.g. "August 1, 2025"
    type: 'Press Release',                  // One of: Press Release | Announcement | Campus Update | Community | Product Launch
    title: 'Your Press Release Title Here',
    summary: 'One or two sentences summarising the announcement. Keep it factual and concise.',
    img: '/Images/my-press-release-image_a1b2c3d4.jpg',  // ← paste the path from Step 2
  },
  // ... existing entries below
];
```

### Type options and their colour coding

| Type | Colour | Use for |
|------|--------|---------|
| `Press Release` | Orange | Official announcements for media |
| `Announcement` | Blue | Internal milestones, new programs |
| `Campus Update` | Green | Land, construction, campus news |
| `Community` | Red | Volunteer drives, events, outreach |
| `Product Launch` | Purple | New apps, digital tools, features |

---

## Step 4 — Save and verify

1. Save `Press.tsx`
2. The dev server will hot-reload automatically
3. Visit `/press` in the browser and confirm the new card appears at the top of the timeline with the correct image, type badge, and date

---

## Step 5 — Update the stats bar (optional)

If this is a significant milestone, update the `PRESS_STATS` array in `Press.tsx`:

```tsx
const PRESS_STATS = [
  { n: '6', l: 'Press Releases' },   // ← increment this
  { n: '8', l: 'Media Outlets' },
  { n: '2025', l: 'Year Founded' },
  { n: '3', l: 'Bay Area Regions' },
];
```

---

## Image naming convention

Use descriptive names before uploading so the storage path is readable:

```
press-campus-groundbreaking-2026.jpg   ✅
IMG_20260101_123456.jpg                ❌
```

Rename the file before running `pnpm images`.

---

## Quick reference — existing images already in storage

These images are already uploaded and can be reused for relevant releases:

| Path | Good for |
|------|----------|
| `/Images/Gemini_Generated_Image_lu0mc9lu0mc9lu0m_d52a8569.png` | Campus / land news |
| `/Images/digital-gurukul-class_2bc742df.jpg` | Education announcements |
| `/Images/wellbeing-meditation_66e9e78d.jpg` | Wellness / app launches |
| `/Images/volunteer-community_33a9555e.jpg` | Community / volunteer news |
| `/Images/foundation-technology_ef4a72b7.jpg` | Technology / digital tools |
| `/Images/event-satsang_86ddb9ec.jpg` | Events / gatherings |
| `/Images/ayurveda-lab_79f87079.jpg` | Āyurveda research news |
