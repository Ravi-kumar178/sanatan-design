# Sanatan International — Design Ideas

## Three Stylistic Approaches

### Approach A: Sacred Geometry Minimalism
**Theme Name:** Dharmic Light
**Brief:** Clean ivory/cream backgrounds with deep saffron and gold accents; sacred geometry motifs (mandalas, yantras) used as decorative elements. Feels like a beautifully printed Vedic manuscript brought to screen.
**Probability:** 0.04

### Approach B: Stone Temple Modernism ← CHOSEN
**Theme Name:** Ashram Stone
**Brief:** Warm stone-beige and deep charcoal backgrounds with saffron fire accents; feels like walking into a beautifully restored ancient temple with modern lighting. Asymmetric editorial layouts, dramatic typography contrasts.
**Probability:** 0.07

### Approach C: Celestial Night
**Theme Name:** Starfield Dharma
**Brief:** Deep indigo/midnight backgrounds with gold and copper accents; star-field textures, cosmic spiritual imagery. Meditative and mysterious.
**Probability:** 0.03

---

## Chosen Approach: Ashram Stone (Stone Temple Modernism)

### Design Movement
Editorial Sacred Modernism — the intersection of high-end editorial design (think Monocle magazine meets Aesop brand) and ancient Indian temple aesthetics. Clean, intentional, deeply rooted.

### Core Principles
1. **Warmth over coldness** — every surface has a warm undertone; no pure whites or cold grays
2. **Contrast through scale** — dramatic size differences in typography create hierarchy without clutter
3. **Restraint with purpose** — every element earns its place; generous whitespace is sacred
4. **Motion as breath** — animations are slow, deliberate, like a deep inhale — never frantic

### Color Philosophy
- **Background:** Warm stone `oklch(0.97 0.015 75)` — like aged parchment or sandstone
- **Deep surface:** Rich charcoal `oklch(0.14 0.012 60)` — like temple stone at night
- **Primary accent:** Saffron fire `oklch(0.72 0.18 55)` — the sacred flame
- **Gold accent:** Antique gold `oklch(0.78 0.14 80)` — temple gold leaf
- **Text primary:** Deep umber `oklch(0.22 0.018 65)` — ink on parchment
- **Text muted:** Warm taupe `oklch(0.55 0.02 65)`

### Layout Paradigm
Asymmetric editorial grid — sections alternate between full-bleed dark and warm-light backgrounds. Hero uses a dramatic split layout. Content sections use offset grids (not centered). Large typographic numbers and Sanskrit text as visual anchors.

### Signature Elements
1. **Om/Lotus SVG motifs** — subtle watermark-style decorative elements in section backgrounds
2. **Saffron flame line** — a thin saffron horizontal rule used as a section divider
3. **Sanskrit shlokas** — displayed in large, faded Devanagari script as background texture

### Interaction Philosophy
Slow, intentional hover states — elements breathe rather than snap. Scroll-triggered reveals use gentle fade+rise. Navigation feels like turning pages of an ancient text.

### Animation
- Entrance: `opacity: 0 → 1` + `translateY(24px → 0)` over 700ms with `cubic-bezier(0.23, 1, 0.32, 1)`
- Stagger: 80ms between sibling elements
- Hover: 200ms ease-out scale(1.02) on cards
- Hero text: word-by-word reveal with 60ms stagger
- Counter animations: number count-up on scroll entry
- Parallax: subtle 0.3x scroll rate on hero background
- No bounce, no spring — only smooth ease-out

### Typography System
- **Display:** Cinzel (all-caps, ancient Roman/Vedic feel) — for headings and brand name
- **Serif body:** Cormorant Garamond (elegant, literary) — for subheadings and pull quotes
- **Body:** DM Sans (clean, modern, readable) — for body text and UI
- **Sanskrit:** Noto Sans Devanagari — for Sanskrit shlokas
- Scale: 12px / 14px / 16px / 20px / 28px / 40px / 56px / 80px / 120px

### Brand Essence
*Ancient wisdom, modern clarity — for seekers building a better world.*
Personality: **Grounded. Luminous. Purposeful.**

### Brand Voice
Headlines sound like quiet authority — not shouting, not whispering. CTAs are invitations, not commands.
- Example: "The knowledge that shaped civilizations, now available to all."
- Example: "Join the land that will hold a thousand years of learning."
- Banned: "Welcome to our website", "Get started today", "Click here"

### Wordmark & Logo
Existing logo used. Paired with "SANATAN" in Cinzel bold + "INTERNATIONAL" in Cinzel small-caps tracking-widest below.

### Signature Brand Color
Saffron fire — `oklch(0.72 0.18 55)` — unmistakably this brand's.

---

## Style Decisions
- Use warm stone background (not pure white) for all light sections
- Sanskrit shlokas displayed in Devanagari with Noto Sans Devanagari font
- Section transitions use diagonal clip-path cuts for dynamism
- All cards have warm border `oklch(0.88 0.02 75)` not cold gray
- Hero uses full-bleed image with warm gradient overlay
- Footer is deep charcoal with saffron accent links
- Internal pages use asymmetric editorial grid: alternating dark/light sections with offset left/right compositions
- Brand palette is saffron fire + antique gold + charcoal ONLY; no product-specific colors on app pages
- Every long light section has at least one Ashram Stone marker: saffron flame rule, oversized Devanagari shloka, antique-gold numeral, or charcoal contrast panel
- Oversized background numerals (01, 02...) used as watermarks on alternating editorial sections
- Large Devanagari shlokas displayed at 4xl-5xl as primary visual anchors on shloka cards
