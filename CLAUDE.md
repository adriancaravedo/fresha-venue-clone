# Working in this repo

A pixel-accurate rebuild of one Fresha venue page (Tipsy Salonbar Naples),
built as a **reference implementation you can re-skin with real data**.

Read `SPEC.md` before changing any layout. Every measurement in it came off the
live page; it is the arbiter when something looks "close enough".

## Layout of the code

```
src/
  data/venue.json      one venue — every screen renders from this file
  lib/icons.jsx        icon set traced from fresha.com (32×32 viewBox)
  lib/router.js        two-route History shim + ?offerItems= parsing
  components/
    ui/                Button, Stars, Avatar, Carousel, Collapse
    TopBar StickyNav Breadcrumbs VenueHeader Gallery Services Team
    Reviews Portfolio About OpeningTimes BookingSidebar
    NearbyVenues SeoLinks Footer
  booking/
    BookingFlow.jsx    shell: header, stepper, 792/32/360 split
    useBooking.js      basket, professional, date, slot, notes
    availability.js    slot generation, date strip, time formatting
    BookingSummary.jsx / BookingBottomBar.jsx / LoginGate.jsx
    steps/             StepServices, StepProfessional, StepTime, StepConfirm
  App.jsx              routes between the venue page and the booking flow
```

## Routing

`lib/router.js` is a ~30-line History API shim, not a router dependency. Any
path ending in `/booking` renders the flow; everything else renders the venue
page. Service selection travels in the URL exactly as the original encodes it:

```
/booking?offerItems=sv:15794617,sv:13658267
```

`sv:` prefixes a **variant** id (`service.variantId`), not the service id —
that's what Fresha puts in the query string. Deployments need a SPA fallback so
`/booking` reaches `index.html`; `vercel.json` already has the rewrite.

Design tokens live in `tailwind.config.js` (`fg`, `surface`, `star`, `line`,
`shadow-card|float|search|ring|ringSoft|badge`, the `body-*`/`head-*` type
scale). Reach for a token before writing an arbitrary value.

## Re-pointing the page at your own venue

Everything the page renders comes from `src/data/venue.json`. To swap in a real
business, produce the same shape — no component changes needed:

| Key | Shape |
|---|---|
| `venue` | `{ name, description, rating, ratingValue, reviewsCount, reviewsCountValue, serviceCount, featured, verified, currency, hasGiftCards, shareLabel, ratingSummary }` |
| `address` | `{ shortFormatted, simpleFormatted, directionsUrl, mapsUrl, lat, lng, mapImage }` |
| `breadcrumbs` | `[{ name, url }]` |
| `workingTime` | `{ status: { name, state, stateDetails }, days: [{ dayName, isClosed, isToday, values: [{ value }] }] }` |
| `gallery` | `{ large, small, secondary, mobile, full }`, each `[{ url, alt, width, height }]` |
| `serviceCategories` | `[{ id, name, items: [{ id, variantId, name, caption, description, price, priceValue, priceType, durationMinutes, variants, rating, reviews }] }]` |
| `team` | `[{ id, name, jobTitle, avatar, rating }]` |
| `reviews` | `{ total, breakdown, items: [{ id, rating, text, date, author, initials, avatar }] }` |
| `portfolio` | `{ total, remaining, items: [{ id, url, alt }] }` |
| `features` | `[{ id, label, icon }]` — `icon` may be `null` |
| `nearby` | `[{ href, image, alt, name, verified, location, meta, rating, deals }]` |
| `relatedLandingPages` | `[{ sectionName, links: [{ name, url }] }]` |

`priceType: "FROM"` renders as `from $X`. `caption` is the pre-formatted
duration string (`"1 hr, 15 min"`) — the components never compute it.
`variantId` must be unique and stable: it keys the basket and the booking URL.
`durationMinutes` drives slot maths; without it the code falls back to parsing
`caption`. `team[].rating` may be `null` — the rating chip is then omitted.

To point at a live API instead, replace the `import data from './data/venue.json'`
in `App.jsx` with a fetch and keep the same shape.

## Re-branding

1. `tailwind.config.js` — swap `fg.accent`, `surface.primary`, `star`, and the
   `#f0f0ff` avatar plate.
2. `src/lib/icons.jsx` — replace `FreshaLogo`; the rest of the set is generic.
3. `index.html` — the Google Fonts link and `<title>`.
4. `src/components/Footer.jsx` and `TopBar.jsx` — marketplace chrome and links.

Nothing else is Fresha-specific.

## Availability

`booking/availability.js` derives open slots from `workingTime` plus an FNV-1a
hash of `(date, employee, minute)`, so a given date always yields the same
result — including the roughly one-in-eight day that comes back fully booked,
which is a state the live flow renders. Swap `slotsFor` and `nextAvailable` for
real API calls and nothing else has to change.

Two things the dataset cannot express, both noted in the README:

- **Which staff can perform which service.** Fresha filters the professional
  list per basket; the clone lists the whole team.
- **The Confirm step's real layout**, which is behind Fresha's login wall. See
  `SPEC.md § Booking flow` — `StepConfirm` is reconstructed, not measured.

## House rules

- Tailwind arbitrary values are fine for measured pixel values (`h-[52px]`),
  but colours, shadows and type must come from the theme.
- Never animate a disclosure with `grid-template-rows: 0fr` — use
  `components/ui/Collapse.jsx`, which measures its content. The `0fr` trick
  fails here whenever the item's automatic minimum size wins.
- `.rail` (in `index.css`) is the shared snapping horizontal scroller. Rails
  inside a gutter need `scroll-p-[var(--page-gutter)]` or mandatory snap eats
  the left padding on load.
- Scroll-driven UI (`StickyNav`, the sidebar collapse) listens on `window`.
  Programmatic `window.scrollTo` in headless browser panes does **not** emit
  scroll events — dispatch one manually when testing.
- The login dialog is presentational. It never posts anywhere, stores nothing,
  and must not grow real credential handling.

## Verifying

```bash
npm run dev     # http://localhost:5190
npm run build
```

Compare against `SPEC.md` by measuring the DOM, not by eyeballing screenshots:
section offsets should land within a couple of pixels of the numbers there.
