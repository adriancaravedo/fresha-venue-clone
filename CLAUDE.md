# Working in this repo

A pixel-accurate rebuild of one Fresha venue page (Tipsy Salonbar Naples),
built as a **reference implementation you can re-skin with real data**.

Read `SPEC.md` before changing any layout. Every measurement in it came off the
live page; it is the arbiter when something looks "close enough".

## Layout of the code

```
src/
  data/venue.json      one venue — the entire page renders from this file
  lib/icons.jsx        icon set traced from fresha.com (32×32 viewBox)
  components/
    ui/                Button, Stars, Avatar, Carousel, Collapse
    TopBar StickyNav Breadcrumbs VenueHeader Gallery Services Team
    Reviews Portfolio About OpeningTimes BookingSidebar BookingDrawer
    NearbyVenues SeoLinks Footer
  App.jsx              page shell: gutters, the 884/40/452 split, modals
```

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
| `serviceCategories` | `[{ id, name, items: [{ id, name, caption, description, price, priceValue, priceType, variants, rating, reviews }] }]` |
| `team` | `[{ id, name, jobTitle, avatar, rating }]` |
| `reviews` | `{ total, breakdown, items: [{ id, rating, text, date, author, initials, avatar }] }` |
| `portfolio` | `{ total, remaining, items: [{ id, url, alt }] }` |
| `features` | `[{ id, label, icon }]` — `icon` may be `null` |
| `nearby` | `[{ href, image, alt, name, verified, location, meta, rating, deals }]` |
| `relatedLandingPages` | `[{ sectionName, links: [{ name, url }] }]` |

`priceType: "FROM"` renders as `from $X`. `caption` is the pre-formatted
duration string (`"1 hr, 15 min"`) — the components never compute it.

To point at a live API instead, replace the `import data from './data/venue.json'`
in `App.jsx` with a fetch and keep the same shape.

## Re-branding

1. `tailwind.config.js` — swap `fg.accent`, `surface.primary`, `star`, and the
   `#f0f0ff` avatar plate.
2. `src/lib/icons.jsx` — replace `FreshaLogo`; the rest of the set is generic.
3. `index.html` — the Google Fonts link and `<title>`.
4. `src/components/Footer.jsx` and `TopBar.jsx` — marketplace chrome and links.

Nothing else is Fresha-specific.

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

## Verifying

```bash
npm run dev     # http://localhost:5190
npm run build
```

Compare against `SPEC.md` by measuring the DOM, not by eyeballing screenshots:
section offsets should land within a couple of pixels of the numbers there.
