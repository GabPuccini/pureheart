# PureHeart Case Study

A four page prototype website for a fictional local community charity. Built as a portfolio case study for Rambo Web Studio.

---

## The brief

PureHeart is a local charity organisation. They run five multi purpose halls available for hire and three live fundraising campaigns. They have no website. The site must include:

**Essential features (all four)**
- EF1: Main page describing the organisation, linking to other pages
- EF2: A page with hall information and availability
- EF3: A page with campaign information
- EF4: A page with contact information

**Desirable features (any two of four)**
- DF1: Upgrade EF2 to facilitate hall booking
- DF2: Upgrade EF3 to facilitate donation payment
- DF3: A query submission page
- DF4: An admin login leading to a blank admin page

Allowed tech: HTML / CSS / JS, C#, or Webflow.

---

## Decisions

**Desirables selected: DF1 + DF2.** These are the two with the highest real value for a charity and the most impressive demos. DF3 is essentially a contact form upgrade. DF4 (login to a blank page) is, by the brief's own definition, an empty room behind a door.

**Stack: static HTML / CSS / JS.** Fastest to ship, deploys to GitHub Pages, scores best on Lighthouse, gives full control over schema and AEO structure, and is what a small agency client would actually run in production. No framework overhead for a four page brochure site.

**Design direction: warm community, editorial.** Most charity sites lean on stock smiling faces and generic blue or orange palettes. PureHeart goes the other way: warm cream paper, deep forest green primary, terracotta coral as the single sharp accent for CTAs. Editorial type led layouts, organic SVG decoration, no stock photography. The case study angle: a charity site that takes itself seriously as a brand.

---

## Visual system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F7F1E6` | Warm cream paper background |
| `--bg_alt` | `#EEE7D7` | Section breaks and surfaces |
| `--ink` | `#1F2A23` | Body text, headings |
| `--brand` | `#2D5F4C` | Deep forest green primary |
| `--accent` | `#E07A4F` | Terracotta coral, CTAs only |
| `--border` | `#E4D9C3` | Soft warm border |

**Typography:** two fonts, well under Web Design 101's three font ceiling.
- **Fraunces** (variable serif) for display. Optical sizing, SOFT and WONK axes used to add warmth at large sizes.
- **Mulish** (humanist sans) for body. Friendly, highly legible at 16 to 18 px.

Body line height is 1.6 (above the 1.5 minimum). Body type starts at fluid 16 to 18 px (above the 14 px minimum). All CTA buttons are 48 px tall minimum to satisfy Fitts' Law on touch.

---

## What got built

```
pureheart/
├── index.html         EF1 home with hero, what we do, halls preview,
│                      campaigns preview, numbers strip, FAQs
├── halls.html         EF2 + DF1: five hall cards with capacity filter,
│                      full booking enquiry form with validation
├── campaigns.html     EF3 + DF2: three campaigns with animated progress,
│                      donation form with amount presets, Gift Aid
├── contact.html       EF4: address, phone, email, hours, illustrated map
├── css/styles.css     Full design system, mobile first, ~600 lines
├── js/script.js       Mobile nav, scroll reveal, progress animation,
│                      form validation, query string prefilling
├── robots.txt
├── sitemap.xml
└── favicon.svg
```

---

## AEO and SEO checklist applied

From the Answer Engine Optimization Playbook, every page ships with:

**Content layer**
- Clear, conversational headings that mirror real questions
- FAQ section on home, halls, and campaigns pages
- Specific facts and numbers (capacity, price, raised totals) for citability
- Local context (Salford, M5 4QA) for geographic answer engines

**Technical layer**
- Schema.org JSON-LD on every page: `NGO`, `WebSite`, `BreadcrumbList`, `FAQPage`, `ItemList`, `Place`, `DonateAction`, `OpeningHoursSpecification`
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- One H1 per page, logical heading hierarchy
- Canonical tags
- Open Graph and Twitter card meta
- `robots.txt` + `sitemap.xml`
- Skip link to main content
- ARIA on interactive components (`aria-current`, `aria-expanded`, `aria-controls`, `role="progressbar"`)

**Authority signals**
- Charity number in every footer
- Named team members on contact page
- Specific impact numbers (84 families supported last winter)
- Honest, plain language throughout

**Performance**
- Static HTML, no framework, no client side hydration
- Two Google Fonts loaded with preconnect
- No external image hosts. All illustration is inline SVG, which means zero image requests and crisp at any resolution.
- CSS uses custom properties, fluid clamp() typography, no layout shift

---

## Accessibility

- Keyboard navigable. Focus rings on every interactive element via `:focus-visible`.
- Skip link to main content on every page.
- `prefers-reduced-motion` respected. Reveal animations and smooth scroll are disabled for users who request it.
- All form fields have visible labels, validation errors are announced via `aria-live`.
- Colour contrast checked: ink on cream passes AAA, coral CTA on cream passes AA large.
- Mobile nav drawer locks body scroll when open and traps focus appropriately.

---

## Honest prototype scope

Two things that look real but are demo only:

**DF1, hall booking.** The form is fully designed, validated, and produces a confirmation. In production it would check live availability against a booking calendar and write to a database. For this prototype, submissions log to the browser console. The form copy is explicit about that, so no user is misled.

**DF2, donations.** The form collects donor details, amount, frequency, and Gift Aid consent. It does **not** include card fields. In production this would hand off to a secure payment provider (Stripe or JustGiving) which is exactly how every real UK charity processes donations. Pretending to take card details in a prototype would be misleading and unsafe. The disclosure note on the form explains the production flow.

This is the honest answer. A prototype that pretends to be more than it is fails its job. A prototype that shows the production architecture clearly is the one that wins client trust.

---

## How to view it

Open `index.html` in any modern browser. No build step, no server required.

To deploy:
1. Push the `pureheart` folder to a GitHub repository
2. Enable GitHub Pages on the main branch
3. Point a domain at the Pages URL if desired

The site is fully static, so it will run on any hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or a regular Apache directory).

---

## What I would do next, given more time

1. Real photography of the actual halls (the SVG illustrations work for a prototype but a real site needs human faces and real rooms)
2. Booking backend with a calendar showing live availability per hall
3. Stripe integration for live donations with Apple Pay and Google Pay
4. A `/news` section to satisfy the AEO Playbook's freshness signal. Answer engines reward sites that publish recent, dated content
5. Programmatic SEO pages for each hall plus event type ("Workshop space for art classes in Salford", "Wedding venue in Salford for 80 guests") to capture long tail search demand
6. Newsletter capture in the footer with double opt in
7. A trustee bio page for authority and trust signals

---

## Standards this build was held to

- Web Design 101 (Webflow): Gestalt principles, complementary CTA colour, 1.5+ em line height, max three fonts, Fitts' Law on touch targets, content first design process
- AEO Playbook (Webflow): schema across the content, technical, and authority dimensions
- 100% Lighthouse SEO target
- Mobile first, all breakpoints tested at 380, 600, 720, 900, 1200 px
- No em dashes, en dashes or hyphens in any visible English content

Built by Rambo, Rambo Web Studio.
