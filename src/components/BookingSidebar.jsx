import { useEffect, useState } from 'react'
import Button from './ui/Button.jsx'
import { Stars } from './ui/Stars.jsx'
import OpeningTimes from './OpeningTimes.jsx'
import Collapse from './ui/Collapse.jsx'
import { ClockIcon, PinIcon, ChevronDownIcon } from '../lib/icons.jsx'

/**
 * Sticky booking card — 452px wide, 16px radius, `shadow-card`, top:88px.
 * Mirrors the original's two states: the venue header (40/44 name, 24/32
 * rating, Featured chip) is visible at rest and collapses away once you
 * scroll into the page, leaving just the Book now button.
 */
export default function BookingSidebar({ venue, address, workingTime, onBook, onRatingClick }) {
  const [collapsed, setCollapsed] = useState(false)
  const [hoursOpen, setHoursOpen] = useState(false)
  const status = workingTime.status

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <aside className="sticky top-[88px] mb-6 mt-16 hidden w-[452px] shrink-0 rounded-card bg-surface-base shadow-card laptop:block">
      <div className="p-8">
        <Collapse open={!collapsed}>
          <div>
            <p className="text-[40px] font-bold leading-[44px] text-fg">{venue.name}</p>

            <button
              type="button"
              onClick={onRatingClick}
              className="mt-4 flex items-center gap-2 text-left"
            >
              <span className="sr-only-text">{`${venue.rating} rating with ${venue.reviewsCount} votes`}</span>
              <span className="text-head-xs font-semibold text-fg">{venue.rating}</span>
              <Stars value={venue.ratingValue} size={16} />
              <span className="ml-1 text-head-xs font-medium text-fg-muted">
                ({venue.reviewsCount})
              </span>
            </button>

            {venue.featured && (
              <div className="mt-4 inline-flex h-8 items-center rounded-pill bg-[#f0f0ff] px-4 text-body-s font-medium text-fg-accent shadow-[inset_0_0_0_1px_#dbddff]">
                Featured
              </div>
            )}

            <div className="h-8" />
          </div>
        </Collapse>

        <Button size="l" variant="primary" full className="font-semibold" onClick={onBook}>
          Book now
        </Button>
      </div>

      <hr />

      <div className="p-8">
        <button
          type="button"
          aria-expanded={hoursOpen}
          onClick={() => setHoursOpen((v) => !v)}
          className="flex w-full items-center gap-3 text-left"
        >
          <ClockIcon size={24} className="shrink-0 text-fg" />
          <p className="flex-1 text-body-m">
            <span className={status.state === 'CLOSED' ? 'text-[#b7570b]' : 'text-[#0a7c42]'}>
              {status.name}
            </span>{' '}
            <span>{status.stateDetails}</span>
          </p>
          <ChevronDownIcon
            size={20}
            className={`shrink-0 transition-transform duration-200 ${hoursOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <Collapse open={hoursOpen}>
          <div className="pl-9 pt-4">
            <OpeningTimes days={workingTime.days} compact />
          </div>
        </Collapse>

        <div className="mt-6 flex items-start gap-3">
          <PinIcon size={24} className="shrink-0 text-fg" />
          <p className="text-body-m text-fg">
            {address.shortFormatted}{' '}
            <a
              href={address.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-fg-accent hover:underline"
            >
              Get directions
            </a>
          </p>
        </div>
      </div>

      {venue.hasGiftCards && (
        <>
          <hr />
          <div className="flex items-center justify-between gap-4 p-8">
            <div className="min-w-0">
              <h3 className="text-body-m font-medium text-fg">Buy a gift card</h3>
              <h4 className="text-body-s text-fg-muted">
                Treat yourself or a friend to future visits.
              </h4>
            </div>
            <Button className="shrink-0">Buy</Button>
          </div>
        </>
      )}
    </aside>
  )
}

/** Mobile counterpart: a fixed bottom bar with the same primary action. */
export function MobileBookingBar({ venue, onBook }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-surface-base px-[var(--page-gutter)] py-3 laptop:hidden">
      <div className="mx-auto flex max-w-page items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-m font-medium text-fg">{venue.name}</p>
          <div className="flex items-center gap-1">
            <span className="text-body-s font-semibold">{venue.rating}</span>
            <Stars value={venue.ratingValue} size={14} />
            <span className="text-body-s text-fg-muted">({venue.reviewsCount})</span>
          </div>
        </div>
        <Button size="l" variant="primary" className="shrink-0 font-semibold" onClick={onBook}>
          Book now
        </Button>
      </div>
    </div>
  )
}
