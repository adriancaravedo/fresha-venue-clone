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
