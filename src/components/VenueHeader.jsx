import { useState } from 'react'
import { Stars } from './ui/Stars.jsx'
import { IconButton } from './ui/Button.jsx'
import { VerifiedIcon, ShareIcon, HeartIcon } from '../lib/icons.jsx'

const Dot = () => (
  <span aria-hidden="true" className="hidden px-2 text-fg-muted tablet:inline">
    •
  </span>
)

/**
 * h1 (48/52 bold on desktop) with the verified seal flowing inline after the
 * last word, then the meta line: rating · open state · neighbourhood ·
 * directions. The meta stacks on phones, matching the original's mobile head.
 */
export default function VenueHeader({ venue, address, workingTime, onRatingClick, onShare }) {
  const [saved, setSaved] = useState(false)
  const status = workingTime.status

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold leading-[34px] text-fg tablet:text-head-l">
          {venue.name}
          {venue.verified && (
            <VerifiedIcon
              size={32}
              className="ml-0.5 inline-block h-6 w-6 translate-y-[-2px] align-middle text-fg-accent tablet:h-8 tablet:w-8"
              aria-label="Verified business"
            />
          )}
        </h1>

        <div className="mt-[10px] flex flex-col items-start text-body-m text-fg tablet:flex-row tablet:flex-wrap tablet:items-center">
          <button
            type="button"
            onClick={onRatingClick}
            className="flex items-center gap-1 hover:underline"
          >
            <span className="sr-only-text">{`${venue.rating} rating with ${venue.reviewsCount} votes`}</span>
            <span className="font-semibold">{venue.rating}</span>
            <Stars value={venue.ratingValue} size={16} />
            <span>({venue.reviewsCount})</span>
          </button>

          <Dot />

          <p>
            <span className={status.state === 'CLOSED' ? 'text-[#b7570b]' : 'text-[#0a7c42]'}>
              {status.name}
            </span>{' '}
            <span>{status.stateDetails}</span>
          </p>

          <Dot />

          <p>
            <span className="text-fg-muted">{address.simpleFormatted}</span>
            <a
              href={address.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-3 font-medium text-fg-accent hover:underline"
            >
              Get directions
            </a>
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-4 tablet:flex">
        <IconButton label="Share" onClick={onShare}>
          <ShareIcon size={24} />
        </IconButton>
        <IconButton
          label={saved ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
        >
          <HeartIcon size={24} filled={saved} className={saved ? 'text-[#e0245e]' : ''} />
        </IconButton>
      </div>
    </div>
  )
}
