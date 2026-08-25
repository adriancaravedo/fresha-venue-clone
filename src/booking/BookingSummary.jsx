import Button from '../components/ui/Button.jsx'
import { Stars } from '../components/ui/Stars.jsx'
import { formatLongDate, formatSlotRange } from './availability.js'
import { ArrowRightIcon, CalendarIcon, ClockIcon } from '../lib/icons.jsx'

const money = (n, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

/**
 * Desktop summary column — 360px wide, 24px radius, 32px padding, with the
 * venue header pinned to the top of the card as you scroll the step.
 */
export default function BookingSummary({ data, booking, onContinue, continueLabel = 'Continue' }) {
  const { venue, address } = data
  const { services, employee, employeeId, date, time, total, duration, canContinue } = booking

  return (
    <aside className="hidden rounded-[24px] bg-surface-base laptop:sticky laptop:top-[88px] laptop:mt-3.5 laptop:block laptop:h-[calc(100dvh-136px)]">
      <div className="flex h-full flex-col px-8 pb-8">
        <div className="sticky top-0 bg-surface-base pt-8">
          <div className="flex items-start gap-3">
            <img
              src={venue.coverImage}
              alt=""
              className="h-[62px] w-[62px] shrink-0 rounded-[7px] object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-body-m font-semibold text-fg">{venue.name}</p>
              <div className="flex items-center gap-1">
                <span className="sr-only-text">{`${venue.rating} rating with ${venue.reviewsCount} votes`}</span>
                <span className="text-body-s font-semibold text-fg">{venue.rating}</span>
                <Stars value={venue.ratingValue} size={14} />
                <span className="text-body-s text-fg-muted">({venue.reviewsCount})</span>
              </div>
              <p className="truncate text-body-s text-fg-muted">{address.shortFormatted}</p>
            </div>
          </div>
        </div>

        {date && time != null && (
          <>
            <hr className="my-5" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CalendarIcon size={20} className="shrink-0 text-fg" />
                <p className="text-body-m text-fg">{formatLongDate(date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={20} className="shrink-0 text-fg" />
                <p className="text-body-m text-fg">{formatSlotRange(time, duration)}</p>
              </div>
            </div>
          </>
        )}

        <hr className="my-5" />

        <div className="min-h-0 flex-1 overflow-y-auto">
          {services.length === 0 ? (
            <p className="text-body-m text-fg-muted">No services selected yet.</p>
          ) : (
            <ul className="flex flex-col gap-5">
              {services.map((s) => (
                <li key={s.variantId} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-body-m text-fg">{s.name}</p>
                    <p className="text-body-s text-fg-muted">
                      {s.caption}
                      {employeeId && (
                        <>
                          {' with '}
                          <span className="text-fg-accent">
                            {employee ? employee.name : 'any professional'}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-body-m text-fg">{s.price}</span>
                </li>
              ))}
            </ul>
          )}

          <hr className="my-5" />

          <div className="flex items-center justify-between">
            <span className="text-body-m font-semibold text-fg">Total</span>
            <span className="text-body-m font-semibold text-fg">
              {money(total, venue.currency)}
            </span>
          </div>
        </div>

        <div className="pt-8">
          <Button
            size="l"
            variant="primary"
            full
            className="font-semibold"
            disabled={!canContinue}
            onClick={onContinue}
          >
            {continueLabel}
            <ArrowRightIcon size={20} />
          </Button>
        </div>
      </div>
    </aside>
  )
}
