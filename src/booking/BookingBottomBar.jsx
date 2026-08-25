import { useState } from 'react'
import Button from '../components/ui/Button.jsx'
import { formatDuration } from './availability.js'
import { ArrowRightIcon, CartIcon, ChevronDownIcon, CloseIcon } from '../lib/icons.jsx'

const money = (n, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

/**
 * Phone / tablet counterpart to the summary column: a fixed bar showing the
 * running total, with the basket itself in a sheet behind the left tap target.
 */
export default function BookingBottomBar({ data, booking, onContinue, continueLabel = 'Continue' }) {
  const [open, setOpen] = useState(false)
  const { services, total, duration, canContinue } = booking
  const { venue } = data

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-surface-base laptop:hidden">
        <div className="mx-auto flex max-w-[1184px] items-center gap-4 px-[var(--page-gutter)] py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={!services.length}
            className="flex min-w-0 flex-1 flex-col items-start rounded-tile p-2 text-left disabled:cursor-default"
          >
            <span className="text-[19px] font-semibold leading-6 text-fg">
              {money(total, venue.currency)}
            </span>
            <span className="flex items-center gap-1 text-body-s text-fg-muted">
              <CartIcon size={16} className="shrink-0" />
              {services.length
                ? `${services.length} ${services.length === 1 ? 'item' : 'items'} · ${formatDuration(duration)}`
                : 'No services selected'}
              {services.length > 0 && <ChevronDownIcon size={16} className="rotate-180" />}
            </span>
          </button>

          <Button
            size="l"
            variant="primary"
            className="shrink-0 font-semibold"
            disabled={!canContinue}
            onClick={onContinue}
          >
            {continueLabel}
            <ArrowRightIcon size={20} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[200] laptop:hidden" role="dialog" aria-modal="true" aria-label="Your basket">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[24px] bg-surface-base p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-body-l font-semibold text-fg">Your basket</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-pill hover:bg-surface-hover"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {services.map((s) => (
                <li key={s.variantId} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-body-m text-fg">{s.name}</p>
                    <p className="text-body-s text-fg-muted">{s.caption}</p>
                  </div>
                  <span className="shrink-0 text-body-m text-fg">{s.price}</span>
                </li>
              ))}
            </ul>
            <hr className="my-5" />
            <div className="flex items-center justify-between text-body-m font-semibold">
              <span>Total</span>
              <span>{money(total, venue.currency)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
