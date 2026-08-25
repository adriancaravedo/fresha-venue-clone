# Fresha venue page — design spec

Every number here was measured on the live page at a **1440 × 900** viewport:

> https://www.fresha.com/a/tipsy-salonbar-naples-naples-4229-tamiami-trail-north-q3z134gp

Read it as the source of truth. If a component drifts, this file wins.

---

## 1. Page frame

| Token | Value |
|---|---|
| Max page width | `1440px`, centred |
| Gutter | `32px` desktop · `16px` mobile (`--page-gutter`) |
| Marketplace bar | `72px` tall, `12px` block padding, **not** sticky |
| Section rail | `52px` tall, `position: fixed`, slides `top: -52px → 0` once the hero leaves the viewport, `z-index: 100`, `border-bottom: 1px #e5e5e5` |
| Content split | main `884px` · gap `40px` · sidebar `452px` |
| Column top offset | `64px` below the hero, both columns |
| Gap between main sections | `64px` |

`32 + 884 + 40 + 452 + 32 = 1440`.

## 2. Type scale

Fresha ships **RoobertPRO**. It is licensed, so this repo falls back to
**Plus Jakarta Sans** — the closest free geometric grotesque. Swap the first
family in `tailwind.config.js → fontFamily.sans` if you license Roobert.

| Role | Size / line-height | Weight | Used by |
|---|---|---|---|
| `head-l` | 48 / 52 | 700 | venue `h1` (28 / 34 on phones) |
| sidebar name | 40 / 44 | 700 | booking card heading |
| `head-s` | 28 / 36 | 600 | "Treat yourself anytime, anywhere" |
| `head-xs` | 24 / 32 | 600 | every section `h2`, sidebar rating |
| `body-m` | 16 / 22 | 400 / 500 / 600 | body copy, service name (500) |
| `body-s` | 14 / 20 | 400 / 500 / 600 | captions, pills, prices |
| review date | 13 / 16 | 400 | review card timestamp |
| `body-xs` | 12 / 16 | 400 | portfolio count chip |

## 3. Colour

| Token | Hex | Where |
|---|---|---|
| `fg` / `fg-neutral` | `#0d0d0d` | all primary text, primary button fill |
| `fg-muted` | `#767676` | captions, secondary meta |
| `fg-accent` | `#6950f3` | links, verified seal, "See all", review count |
| star | `#ffc00a` | rating stars |
| line / `shade300` | `#e5e5e5` | hairlines, card rings |
| `shade200` | `#f2f2f2` | image placeholder |
| avatar plate | `#f0f0ff` | avatar backing, Featured chip |
| Featured chip ring | `#dbddff` | inset 1px |
| closed status | `#b7570b` | "Closed" |
| open status | `#0a7c42` | "Open" |

## 4. Elevation & radii

```css
--shadow-card:   0 4px 12px 0 rgba(19,19,19,.08), 0 2px 6px 2px rgba(19,19,19,.02);
--shadow-float:  0 2px 8px 0 rgba(19,19,19,.08), 0 4px 20px 0 rgba(19,19,19,.12);
--shadow-search: 0 2px 4px 0 rgba(20,20,20,.12);
--ring:          inset 0 0 0 1px #e5e5e5;   /* service cards */
--ring-soft:     inset 0 0 0 1px rgba(19,19,19,.1);  /* outline buttons, pills */
--badge:         0 0 0 1px #e5e5e5, 0 0 0 2px #fff;  /* team rating chip */
```

Radii: `16px` cards · `8px` tiles · `999px` pills · `4px` inline links.

## 5. Buttons

| Size | Height | Side padding | Label |
|---|---|---|---|
| `m` | 36 | 15 | 14 / 20, 500 |
| `l` | 48 | 19 | 16 / 22, 500–600 |

Variants: `primary` (`#0d0d0d` on white text) · `outline` (white + `--ring-soft`)
· `elevated` (white + `--shadow-float`, used by "See all images").
Icon buttons are `48 × 48` circles with `--ring-soft`.

## 6. Section geometry

**Hero gallery** — `1376 × 515` grid, `24px` gutter.
Left tile `909 × 515`; right column two tiles `443 × 246`.
Image variants: left = `galleryDesktopLargeImages[0]`, right =
`galleryDesktopSmallImages[1..2]`, lightbox = `galleryModalDesktopLargeImages`
(watermarked, same as production).
"See all images" floats `24px` from the bottom-right corner.

**Services** — `h2` + `24px`; category rail `37px` + `24px`; service cards
`884 × 114`, `20px 24px` padding, `12px` between cards, `--ring` border.
Card interior: name `16/22 · 500`, caption `14/20` muted, then a `12px` gap,
then price `14/20 · 600`. Book button is vertically centred on the right.
Pills: `36px` tall, `16px` side padding, `8px` gaps; selected is solid black.
A `36px` elevated overflow button sits at the rail's right edge under a
left-facing white gradient. Section closes with a `48px` "See all", `24px` above.

**Team** — heading row with an accent "See all" link, `24px` below.
Grid of four `221px` columns (cards are `120 × 180`), `40px` row gap.
Avatar `120px` circle on `#f0f0ff` with a 1px inset; rating chip is a white
`30px` pill centred on the avatar's bottom edge, hanging `8px` past it, holding
one star + score. Name `16/22 · 500`, role `14/20` muted, `2px` apart.
Section closes with a `48px` "See all".

**Reviews** — rating line, `32px`, then a two-column grid: cards `418px` wide,
`48px` column gap, `40px` row gap. Avatar `64px` + `8px` gap; name `16/22 · 500`;
date `13/16` muted; stars `16px`; body `16/22`, truncated at ~98 characters with
an accent "Read more". Section closes with "See all N reviews".

**Portfolio** — heading + a `99+` chip. Four `212px` columns, `12px` gaps; the
first tile spans 2 × 2 (`436px`). Nine tiles; the last carries a `+N` overlay
on `rgba(0,0,0,.45)`.

**About** — description, then a two-column block (opening times · additional
information), then a full-width Mapbox static map at `884 × 472` and the
address line with a "Get directions" link.

**Booking sidebar** — `452px`, `sticky top: 88px`, `16px` radius,
`--shadow-card`, three `32px`-padded sections split by full-bleed `hr`s.
Section 1 holds the venue name / rating / Featured chip — which **collapse away
once the page scrolls** — over a full-width `48px` "Book now".
Section 2 is the opening-hours disclosure plus the address.
Section 3 is the gift-card row.

**Venues nearby** — `322px` cards on a `28px`-gap rail, image `3:2` at `16px`
radius, name + single-star rating on one line, then location and category lines.
Round `48px` Previous / Next controls in the section header.

## 7. Behaviour

- Section rail slides in past the hero and scroll-spies the six sections.
- Category pills swap the service list; "See all" opens the full menu grouped
  by category.
- Book adds to a selection drawer with a running total.
- Gallery opens a lightbox: arrows, `←`/`→`/`Esc`, counter, thumbnail strip.
- Opening hours and the sidebar header animate on measured height, **not** on
  `grid-template-rows: 0fr` — that trick silently refuses to collapse when the
  item's automatic minimum size wins.
- Phones: gallery becomes a snap rail with a counter and floating
  share / favourite buttons; the sidebar is replaced by a fixed bottom bar.

---

# Booking flow

Measured on the live flow at **1280 × 800**:

> `/a/<slug>/booking?offerItems=sv:<variantId>&cartId=<uuid>`

The four steps — Services, Professional, Time, Confirm — are one full page, not
a modal: the venue profile is replaced entirely.

## 1. Shell

| Token | Value |
|---|---|
| Canvas | `#f5f5f5` — cards are white on top of it |
| Header | `72px`, `position: sticky; top: 0`, `0 32px` padding, flex `gap: 48px` |
| Header controls | back left / close right, `48 × 48` circles |
| Header title | mobile only; hidden from `tablet` up |
| Content | `max-width: 1184px` (inside the gutter), centred, `padding-bottom: 96px` |
| Columns | `grid-template-columns: 792px 360px`, `gap: 32px` |
| Below `laptop` | one column + a fixed bottom bar |

**Stepper** (desktop only), above the columns at `y: 74`:
`Services › Professional › Time › Confirm`, `14/20 · 500`, chevrons between,
`gap: 8px`. Current and completed steps are `#0d0d0d`; upcoming are `#acacac`.

**h1** `40/44 · 700` at `y: 108` (`32/36` on phones).

## 2. Select services

Category rail identical to the venue page (36px pills, 8px gaps, black =
selected, elevated overflow button under a right-edge fade), then a `19/24 · 600`
category heading and the service list.

Service card — `792 × auto`, `20px 24px` padding, `16px` radius, `--ring`:
name `16/22 · 500`, duration `14/20` muted, description `14/20` muted, price
`14/20 · 600`. A `36px` circular toggle sits bottom-right: hairline ring with a
`+` when unselected, solid `#6950f3` with a white ✓ when selected — and the card
itself gains `inset 0 0 0 2px #6950f3`. Cards are `12px` apart.

Below the list, a **Try something else** block with two tiles: *Group
appointments* and *Gift cards*.

## 3. Select professional

`12px`-gapped cards, `792 × ~122`, `20px 24px` padding, `--ring`.

- **Any professional** leads: tinted `#f0f0ff` circle with a shuffle glyph,
  "Any professional" / "Maximum availability", card height `120`.
- Each member: `80px` avatar on `#f0f0ff` with a white `30px` rating chip
  centred on its bottom edge and hanging `8px` past it, then name `16/22 · 500`,
  role `14/20` muted, and a "View profile" link. Members without a rating (Ninah)
  simply have no chip.
- A `36px` **Select** pill sits right, carrying its own soft elevation:
  `0 1px 6px rgba(13,22,25,.04), 0 6px 8px rgba(13,22,25,.06)`.

Continue stays disabled until a professional is chosen.

## 4. Select date and time

- Professional pill (avatar + name + chevron) left; a `52 × 36` calendar button right.
- `Select a date` `19/24 · 600`, with `‹ ›` `36px` ghost circles at the right.
- Date rail: `64 × 94` tiles, `16px` radius, `16px` gaps, `12px 0` padding.
  Unselected is white with `1px #e5e5e5`; selected is `#6950f3` with white text.
  Weekday `14/20 · 500`, day `24/32 · 600`, month `13/16`. 185 days are rendered.
- `Pick a time` `19/24 · 600`, then full-width slots at 15-minute steps:
  `792 × 65`, `20px 24px` padding, `16px` radius, `--ring`, label `16/22 · 500`.
  Selected: background `#f5f5f5` with `inset 0 0 0 2px #5c4ace`.
- Fully-booked date → centred empty state: *Fully booked on this date*,
  *Available from ‹date›*, and two buttons — *Go to next available date* and
  *Join waitlist*.
- Footer line: *Can't find a suitable time? Join waitlist*.

## 5. The auth wall — and what could not be measured

Pressing Continue on the Time step raises a login dialog: `480px` wide, `32px`
radius, `--shadow-float`, `32px 48px 16px` header over `0 48px 32px` body.
Title *Log in or sign up to book* `28/36 · 600`, subtitle `14/20` muted, an
email field, a full-width primary Continue, an `OR` rule, then outline
*Continue with Google* / *Continue with Apple*. Close is a `48px` circle.

**The Confirm step sits behind that wall and was therefore never observed.**
No account was created and no credentials were entered to reach it. The clone's
`StepConfirm` is *reconstructed*: it recaps exactly the fields the summary
column already carries (appointment, professional, services, total) and adds the
payment, notes and cancellation blocks in the same card language as the measured
steps. Treat its layout as a reasonable stand-in, not as measured truth.

## 6. Summary column

`360px` wide, `24px` radius, white, `32px` padding, with the venue header pinned
(`position: sticky`) to the top of the card.

Venue logo `62px` at `7px` radius · name `16/22 · 600` · rating `14/20`
(`5.0` semibold then a muted count) · address `14/20` muted. A rule, then the
date and time rows (`20px` icons, `8px` gap, `16/22`), another rule, then one
row per service — name `16/22`, a `14/20` muted sub-line whose professional name
is an accent link, price right — and the Total. Continue is `296 × 48`, pinned
to the bottom of the card.

## 7. Mobile

The summary becomes a fixed bottom bar: total `19/24 · 600` over
`N items · duration` `14/20` muted with a cart glyph, Continue on the right.
Tapping the left half opens the basket sheet.
