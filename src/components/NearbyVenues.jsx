import Carousel from './ui/Carousel.jsx'
import { VerifiedIcon, StarIcon } from '../lib/icons.jsx'

/** 322×285 venue cards on a 28px-gap rail, image 3:2 with a 16px radius. */
function VenueCard({ venue }) {
  return (
    <a
      href={venue.href}
      className="group block w-[322px] shrink-0"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="relative overflow-hidden rounded-card" style={{ aspectRatio: '322 / 214' }}>
        <img
          src={venue.image}
          alt={venue.alt || venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {venue.deals && (
          <span className="absolute left-3 top-3 rounded-pill bg-[#f0f0ff] px-3 py-1 text-body-s font-medium text-fg-accent">
            Deals
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-1 truncate text-body-m font-medium text-fg">
          <span className="truncate">{venue.name}</span>
          {venue.verified && (
            <VerifiedIcon size={16} className="shrink-0 text-fg-accent" aria-label="Verified" />
          )}
        </p>
        {venue.rating && (
          <span className="flex shrink-0 items-center gap-1">
            <span className="sr-only-text">{`${venue.rating} rating`}</span>
            <StarIcon size={16} className="text-star" />
            <span className="text-body-s font-semibold text-fg">{venue.rating}</span>
          </span>
        )}
      </div>

      <p className="truncate text-body-s text-fg-muted">{venue.location}</p>
      <p className="truncate text-body-s text-fg-muted">{venue.meta}</p>
    </a>
  )
}

export default function NearbyVenues({ venues }) {
  return (
    <section className="mx-auto max-w-page">
      <Carousel
        label="Venues nearby"
        header={<h2 className="text-head-xs font-semibold text-fg">Venues nearby</h2>}
      >
        {venues.map((v) => (
          <VenueCard key={v.href} venue={v} />
        ))}
      </Carousel>
    </section>
  )
}
