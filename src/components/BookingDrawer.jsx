import { useEffect } from 'react'
import Button from './ui/Button.jsx'
import { CloseIcon } from '../lib/icons.jsx'

const money = (n, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

const duration = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return [h ? `${h} hr` : null, m ? `${m} min` : null].filter(Boolean).join(', ')
}

/**
 * Selection drawer behind every Book button. It mirrors what Fresha's
 * booking entry point collects (services, duration, total) — the checkout
 * itself lives on a separate flow and is out of scope for this clone.
 */
export default function BookingDrawer({ open, items, venue, onRemove, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const total = items.reduce((sum, s) => sum + (s.priceValue ?? 0), 0)
  const minutes = items.reduce((sum, s) => sum + Math.round((s.maxInSeconds ?? 0) / 60), 0)

  return (
    <div className="fixed inset-0 z-[350]" role="dialog" aria-modal="true" aria-label="Your booking">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-surface-base">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-body-l font-semibold text-fg">Your booking</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-pill hover:bg-surface-hover"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <p className="mb-4 text-body-s text-fg-muted">{venue.name}</p>
          {items.length === 0 ? (
            <p className="text-body-m text-fg-muted">No services selected yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((s, i) => (
                <li
                  key={`${s.id}-${i}`}
                  className="flex items-start justify-between gap-3 rounded-card p-4 shadow-ring"
                >
                  <div className="min-w-0">
                    <p className="truncate text-body-m font-medium text-fg">{s.name}</p>
                    <p className="text-body-s text-fg-muted">{s.caption}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-body-s font-semibold">{s.price}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="text-body-s text-fg-accent hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-6 py-4">
          <div className="mb-3 flex items-center justify-between text-body-m">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{money(total, venue.currency)}</span>
          </div>
          {minutes > 0 && (
            <p className="mb-3 text-body-s text-fg-muted">{duration(minutes)} estimated</p>
          )}
          <Button size="l" variant="primary" full className="font-semibold" disabled={!items.length}>
            Continue
          </Button>
          <p className="mt-3 text-center text-body-xs text-fg-muted">
            Checkout is not part of this clone.
          </p>
        </div>
      </div>
    </div>
  )
}
