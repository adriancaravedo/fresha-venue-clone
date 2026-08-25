import { useState } from 'react'
import Avatar from './ui/Avatar.jsx'
import Button from './ui/Button.jsx'
import { Stars } from './ui/Stars.jsx'

const PREVIEW_CHARS = 98 // where Fresha truncates and drops in "Read more"

function ReviewCard({ review }) {
  const [open, setOpen] = useState(false)
  const long = review.text && review.text.length > PREVIEW_CHARS
  const shown = !long || open ? review.text : `${review.text.slice(0, PREVIEW_CHARS)}...`

  return (
    <li>
      <div className="flex items-center gap-2">
        <Avatar
          src={review.avatar}
          alt={review.author}
          initials={review.initials}
          size={64}
          className="[&>span]:text-[22px] [&>span]:font-semibold [&>span]:text-fg-accent"
        />
        <div className="min-w-0">
          <p className="truncate text-body-m font-medium text-fg">{review.author}</p>
          <p className="truncate text-[13px] leading-4 text-fg-muted">{review.date}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="sr-only-text">{`${review.rating} rating`}</p>
        <Stars value={review.rating} size={16} />
      </div>

      <p className="mt-2 text-body-m text-fg">
        {shown}{' '}
        {long && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-fg-accent hover:underline"
          >
            {open ? 'Read less' : 'Read more'}
          </button>
        )}
      </p>
    </li>
  )
}

/** Rating summary + a two-column review grid (48px column / 40px row gaps). */
export default function Reviews({ reviews, venue }) {
  return (
    <section id="reviews-section" className="scroll-mt-[124px]">
      <h2 className="mb-6 text-head-xs font-semibold text-fg">Reviews</h2>

      <div className="mb-8 pt-10">
        <p className="sr-only-text">{`${venue.rating} rating with ${reviews.total} votes`}</p>
        <div className="flex items-center gap-2">
          <span className="text-body-m font-semibold text-fg">{venue.rating}</span>
          <Stars value={venue.ratingValue} size={16} />
          <span className="text-body-m font-medium text-fg-accent">({reviews.total})</span>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-x-12 gap-y-10 tablet:grid-cols-2">
        {reviews.items.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </ul>

      <div className="mt-6">
        <Button size="l" className="font-semibold">
          {`See all ${reviews.total} reviews`}
        </Button>
      </div>
    </section>
  )
}
