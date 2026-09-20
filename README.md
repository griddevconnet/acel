# ACEL — African Chamber of ESG Leadership

Production-grade marketing site for the African Chamber of ESG Leadership, built with **React 18 + Vite**, **Tailwind CSS**, and **Framer Motion**. Content is sourced directly from `ACEL_Website_Content.docx` and `ACEL_Organisational_Profile_2026.docx`.

## Stack

- **React 18** + **Vite** — fast dev server, ES modules, no bundler ceremony
- **Tailwind CSS** — utility-first styling with a custom design-token theme (`tailwind.config.js`)
- **Framer Motion** — orchestrated hero entrance, scroll reveals, animated counters, tab transitions
- Fonts: **Fraunces** (display serif) + **IBM Plex Sans** (body/UI), loaded via Google Fonts

## Getting started

```bash
npm install
npm run dev       # starts a local dev server, usually http://localhost:5173
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

Requires Node 18+.

## Project structure

```
src/
  components/       one component per section (Nav, Hero, WhoWeAre, WhyNow,
                     Differentiators, WhatWeDo, Membership, Certification,
                     Sectors, Governance, JoinCTA, Footer)
  components/Seal.jsx     the recurring "seal" logomark, static + animated
  components/Reveal.jsx   shared scroll-reveal + stagger-group primitives
  data/content.js   all real copy, structured as plain JS — edit this file
                     to change any text on the site without touching a
                     single component
  index.css         Tailwind layers, focus states, reduced-motion handling
  App.jsx           router: shared Nav + Footer around the page routes
  pages/            one file per route, each composing the section components
  components/ScrollToTop.jsx   resets scroll on navigation, honours #hash links
tailwind.config.js  color tokens, font families, breakpoints
```

## Pages

| Route            | Page file                | Sections                          |
|------------------|--------------------------|-----------------------------------|
| `/`              | `pages/Home.jsx`         | Hero, JoinCTA                     |
| `/about`         | `pages/About.jsx`        | WhoWeAre, Values, WhyNow, Differentiators |
| `/what-we-do`    | `pages/WhatWeDo.jsx`     | WhatWeDo, Sectors                 |
| `/membership`    | `pages/Membership.jsx`   | Membership                        |
| `/membership/apply` | `pages/MembershipApply.jsx` | Application form (organisation / individual) |
| `/membership/directory` | `pages/MembershipDirectory.jsx` | Searchable member directory (sample data) |
| `/certification` | `pages/Certification.jsx`| Certification                     |
| `/certification/register` | `pages/CertificationRegister.jsx` | Registration form |
| `/certification/verify` | `pages/CertificationVerify.jsx` | Certificate lookup (sample data) |
| `/governance`    | `pages/Governance.jsx`   | Governance, GovernanceDetail, Founders |

Also routed: `/contact`, `/privacy`, `/terms`, and a 404 page for unknown URLs.

Navigation uses `react-router-dom`. `vercel.json` rewrites every path to
`index.html`, so deep links and refreshes work in production.

## Forms

There is no backend yet. Every form (`/contact`, `/certification/register`,
`/membership/apply`) submits through one file, `src/lib/submitForm.js`, which
POSTs JSON to `VITE_FORM_ENDPOINT` (see `.env.example`). Point it at a form
service such as Formspree and submissions arrive by email for manual review.
Set the same variable in Vercel. When a real API exists, change
`submitForm.js` only.

- With no endpoint set, forms simulate success in local development, or when
  `VITE_FORM_DEMO=true`. In production with no endpoint they show an error
  instead of silently discarding data.
- Certification fees shown on the register and application forms come from
  `membership.dues` in `src/data/content.js` and are placeholders until
  confirmed.
- `src/data/legal.js` holds a **draft** privacy policy and terms. They need
  legal review, and the `[bracketed]` gaps filled, before launch.

## Payments

Certification registration (`/certification/register`) has a Paystack
payment step, since certification fees are fixed per level ($100 / $250 /
$500 — see `membership.dues`). It's frontend-only for now:

- `src/lib/paystack.js` opens Paystack's Inline popup for the level's fee.
  Set `VITE_PAYSTACK_PUBLIC_KEY` (a `pk_test_...` or `pk_live_...` key) to
  use it for real. With no key set, it **simulates** a successful payment
  after a short delay, and the form shows a "demo mode" notice, so the flow
  can be demoed before a Paystack account exists.
- **Before going live**, add server-side verification: a client-side
  Paystack callback can be forged, so a backend must call Paystack's Verify
  Transaction endpoint (`GET /transaction/verify/:reference`) with the
  secret key before treating a registration as paid. `payWithPaystack`'s
  result (`{ reference }`) is exactly what that endpoint needs — wire the
  call in where the comment in `paystack.js` says to.
- Membership application (`/membership/apply`) deliberately has **no**
  payment step: its application fee is a band ($100–$300 for organisations,
  $20–$50 for individuals), not a fixed figure, and the source content
  describes payment happening after the Secretariat approves the
  application and confirms the amount — not at the time of applying. Add a
  payment step there once the Chamber sets a fixed fee schedule, or decides
  to charge a deposit at application time instead.

## Sample-data pages

`/membership/directory` and `/certification/verify` work against static
placeholder data in `src/data/directory.js`, clearly labelled as illustrative
on both pages, since there is no member or certification database yet.
Replace `sampleMembers` and `sampleCertificates` with a real data source (an
API call, a spreadsheet export, a database query) once the Chamber is
issuing real memberships and certificates — the page components themselves
shouldn't need to change, only where the data comes from.

## Brand

The logo is `public/acel-logo.jpeg`. The color tokens below were originally
sampled from an earlier version of the mark; the logo has since been updated
and the palette was deliberately kept as-is rather than re-sampled, so the
hex values are no longer a literal read of the current file:

| Token (Tailwind)  | Hex       | Note                       |
|--------------------|-----------|----------------------------|
| `ink`              | `#00142D` | deep navy                  |
| `gold`             | `#C37C0C` | accent gold                |
| `emerald`          | `#047622` | primary green              |
| `paper`            | `#FFFFFF` | background                 |

`bright`/`deep`/`soft`/`faint` variants of each are derived tints/shades —
see `tailwind.config.js`. Every component references the token names, not
raw hex, so a deliberate re-theme only requires updating these four values
in one file.

`src/components/Seal.jsx` uses the supplied logo image everywhere the
recurring mark appears, so future logo revisions only require replacing
the asset and updating its path.

## Design notes

- **Type:** Fraunces (display) paired with IBM Plex Sans (body) — a serif
  with real character for an institutional, standards-setting body,
  set against a clean, technical sans for body copy and UI chrome.
- **Motion:** one orchestrated entrance on the hero (the mark draws in —
  rings, then the trend line, then the dot and axis — then copy and CTAs
  stagger); scroll-triggered reveals on section headers; staggered
  card/list reveals within a section; animated key-figure counters; a
  spring-driven tab pill in Membership. Motion is restrained everywhere
  else, and `prefers-reduced-motion` is respected globally.
- **Editing content:** everything user-facing lives in `src/data/content.js`.
  Update copy, add/remove sector tags, membership tiers, certification
  levels, or footer links there — components render whatever is in the
  array.

## Accessibility

- Semantic headings (`h1`–`h4`), `sr-only` labels for stat figures
- Visible focus rings on all interactive elements
- `prefers-reduced-motion` disables/shortens all animation
- Color contrast checked against WCAG AA for text on both paper and ink backgrounds

## Deployment

The build output in `/dist` after `npm run build` is static and can be
deployed to any static host (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc.) with no server required.
