# Fresha venue page — clone

A faithful rebuild of a Fresha venue profile, reconstructed from the live page:

> https://www.fresha.com/a/tipsy-salonbar-naples-naples-4229-tamiami-trail-north-q3z134gp

React + Vite + Tailwind, no runtime dependencies beyond React.

```bash
npm install
npm run dev      # http://localhost:5190
```

## What's here

The full venue profile, section for section: marketplace bar with segmented
search, breadcrumbs, venue header, hero gallery, service catalogue (22
categories / 141 services), team, reviews, portfolio mosaic, about with opening
hours and map, sticky booking card, nearby venues, SEO link rail and footer.

Interactive: sliding section rail with scroll-spy, category tabs, full-menu
expansion, service selection drawer with totals, gallery lightbox (arrows,
keyboard, thumbnails), opening-hours disclosure, review "Read more", share via
the Web Share API, and mobile / tablet / desktop layouts.

## Fidelity

Section offsets, card sizes, gutters, shadows and the type scale were measured
on the live page at 1440 × 900 and match within a couple of pixels — see
`SPEC.md` for every number.

Two deliberate departures, both forced:

- **Typeface.** Fresha uses RoobertPRO, which is licensed. This repo uses
  Plus Jakarta Sans and keeps `RoobertPRO` first in the stack, so licensing it
  is a one-line change. Text advances differ by a few pixels because of this.
- **Review bodies.** Fresha's payload only carries the truncated review text;
  the rest is fetched when you press "Read more". The clone shows the same
  truncation, so "Read more" reveals only what the payload holds.

Content, images and the Fresha wordmark belong to Fresha and the listed
business. This is a study build — see `CLAUDE.md` for how to point it at your
own data and branding.

## Docs

- `SPEC.md` — every measured token, dimension and behaviour.
- `CLAUDE.md` — code map, the `venue.json` contract, re-branding steps, gotchas.
