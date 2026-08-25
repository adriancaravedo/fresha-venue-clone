/**
 * Slot generation.
 *
 * The real site asks its API which 15-minute slots are still open. This clone
 * derives them from the venue's opening hours and a deterministic hash, so the
 * same date always yields the same availability — including the occasional
 * fully-booked day, which is a state the live flow renders (see SPEC.md).
 */

const SLOT_MINUTES = 15
const DAY_MS = 86_400_000

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** FNV-1a — small, stable, and enough to scatter availability convincingly. */
function hash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) / 0xffffffff
}

export const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** "9:00 AM - 7:30 PM" → { open: 540, close: 1170 } in minutes past midnight. */
function parseRange(value) {
  const parts = value.replace(/ /g, ' ').split('-').map((s) => s.trim())
  const toMinutes = (t) => {
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!m) return null
    let h = Number(m[1]) % 12
    if (/pm/i.test(m[3])) h += 12
    return h * 60 + Number(m[2])
  }
  const open = toMinutes(parts[0])
  const close = toMinutes(parts[1])
  return open == null || close == null ? null : { open, close }
}

export function formatTime(minutes) {
  const h24 = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const suffix = h24 < 12 ? 'AM' : 'PM'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`
}

export const formatLongDate = (iso) => {
  const d = parseISO(iso)
  return `${DAY_NAMES[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`
}

export const formatShortDate = (iso) => {
  const d = parseISO(iso)
  return `${DAY_NAMES[d.getDay()].slice(0, 3)}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** The horizontal date rail — 185 days from `from`, matching the original. */
export function buildDateStrip(from, count = 185) {
  const start = parseISO(isoDate(from))
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getTime() + i * DAY_MS)
    return {
      iso: isoDate(d),
      weekday: DAY_NAMES[d.getDay()].slice(0, 3),
      day: d.getDate(),
      month: MONTHS[d.getMonth()],
    }
  })
}

/**
 * Open slots for one date. `durationMinutes` is the whole basket, so a long
 * booking correctly loses the tail end of the day.
 */
export function slotsFor(iso, workingTime, durationMinutes, employeeId = 'any') {
  const date = parseISO(iso)
  const day = workingTime.days.find((d) => d.dayName === DAY_NAMES[date.getDay()])
  if (!day || day.isClosed) return []

  const range = parseRange(day.values[0].value)
  if (!range) return []

  // roughly one day in eight is fully booked
  if (hash(`${iso}|${employeeId}|full`) < 0.12) return []

  const slots = []
  const lastStart = range.close - Math.max(durationMinutes, SLOT_MINUTES)
  for (let t = range.open; t <= lastStart; t += SLOT_MINUTES) {
    if (hash(`${iso}|${employeeId}|${t}`) < 0.28) continue // already taken
    slots.push({ minutes: t, label: formatTime(t) })
  }
  return slots
}

/** First date on or after `iso` with at least one open slot. */
export function nextAvailable(iso, workingTime, durationMinutes, employeeId, limit = 120) {
  let d = parseISO(iso)
  for (let i = 1; i <= limit; i++) {
    d = new Date(d.getTime() + DAY_MS)
    const next = isoDate(d)
    if (slotsFor(next, workingTime, durationMinutes, employeeId).length) return next
  }
  return null
}

/** "9:00-9:30 AM (30 min duration)" — the summary card's time line. */
export function formatSlotRange(startMinutes, durationMinutes) {
  const end = startMinutes + durationMinutes
  const startLabel = formatTime(startMinutes)
  const endLabel = formatTime(end)
  const [startTime, startSuffix] = startLabel.split(' ')
  const [endTime, endSuffix] = endLabel.split(' ')
  const range =
    startSuffix === endSuffix
      ? `${startTime}-${endTime} ${endSuffix}`
      : `${startLabel} - ${endLabel}`
  return `${range} (${formatDuration(durationMinutes)} duration)`
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h ? `${h} hr` : null, m ? `${m} min` : null].filter(Boolean).join(', ') || '0 min'
}

/** "1 hr, 15 min" / "30 min" → minutes. The dataset ships captions, not numbers. */
export function captionToMinutes(caption) {
  if (!caption) return 0
  const h = caption.match(/(\d+)\s*hr/)
  const m = caption.match(/(\d+)\s*min/)
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0)
}
