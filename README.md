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

## The booking flow

`Book` on any service opens the four-step flow at `/booking?offerItems=sv:<id>`,
the same URL shape the original uses:

1. **Services** — category rail, add/remove with a running basket
2. **Professional** — "Any professional" or a specific team member
3. **Time** — 185-day date rail, 15-minute slots, fully-booked empty state
   with *Go to next available date*
4. **Confirm** — appointment recap, payment, notes, cancellation policy

Slots are generated from the venue's opening hours by
`src/booking/availability.js`, deterministically, so the same date always looks
the same. Nothing is ever sent anywhere: confirming just shows a summary.

## Fidelity

Section offsets, card sizes, gutters, shadows and the type scale were measured
on the live page at 1440 × 900 and match within a couple of pixels — see
`SPEC.md` for every number.

The booking flow was measured the same way at 1280 × 800 — with one exception
called out below.

Departures, all forced:

- **Typeface.** Fresha uses RoobertPRO, which is licensed. This repo uses
  Plus Jakarta Sans and keeps `RoobertPRO` first in the stack, so licensing it
  is a one-line change. Text advances differ by a few pixels because of this.
- **Review bodies.** Fresha's payload only carries the truncated review text;
  the rest is fetched when you press "Read more". The clone shows the same
  truncation, so "Read more" reveals only what the payload holds.
- **The Confirm step.** Fresha puts it behind a login wall. No account was
  created to get past it, so that one screen is reconstructed from the flow's
  own data rather than measured — the other three are measured. The login
  dialog itself *is* measured, and in the clone it is purely presentational:
  it posts nothing and stores nothing.
- **Staff filtering.** The live flow only offers professionals who can perform
  the chosen services. That mapping isn't in the page payload, so the clone
  lists the whole team.

Content, images and the Fresha wordmark belong to Fresha and the listed
business. This is a study build — see `CLAUDE.md` for how to point it at your
own data and branding.

## Docs

- `SPEC.md` — every measured token, dimension and behaviour.
- `CLAUDE.md` — code map, the `venue.json` contract, re-branding steps, gotchas.
