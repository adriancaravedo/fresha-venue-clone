import OpeningTimes from './OpeningTimes.jsx'
import { VerifiedIcon, CheckCircleIcon, CardIcon } from '../lib/icons.jsx'

/** Fresha renders these three trust rows from local icons, then the
 *  venue's own feature flags with their CDN glyphs. */
const BUILT_IN = [
  { id: 'verified', label: 'Verified business by Fresha', Icon: VerifiedIcon },
  { id: 'instant', label: 'Instant confirmation', Icon: CheckCircleIcon },
  { id: 'payapp', label: 'Pay by app', Icon: CardIcon },
]

export default function About({ venue, address, workingTime, features }) {
  return (
    <section id="about-section" className="scroll-mt-[124px]">
      <h2 className="mb-6 text-head-xs font-semibold text-fg">About</h2>

      <p className="text-body-m text-fg">{venue.description}</p>

      <div className="mt-10 grid grid-cols-1 gap-10 tablet:grid-cols-2">
        <div>
          <h3 className="mb-4 text-body-m font-semibold text-fg">Opening times</h3>
          <OpeningTimes days={workingTime.days} />
        </div>

        <div>
          <h3 className="mb-4 text-body-m font-semibold text-fg">Additional information</h3>
          <ul className="flex flex-col gap-3">
            {BUILT_IN.map(({ id, label, Icon }) => (
              <li key={id} className="flex items-center gap-3">
                <Icon size={24} className="text-fg" />
                <p className="text-body-m text-fg">{label}</p>
              </li>
            ))}
            {features.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                {f.icon ? (
                  <img src={f.icon} alt="" className="h-6 w-6" loading="lazy" />
                ) : (
                  <span className="h-6 w-6" aria-hidden="true" />
                )}
                <p className="text-body-m text-fg">{f.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={address.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-10 block overflow-hidden rounded-card"
      >
        <img
          src={address.mapImage}
          alt={address.shortFormatted}
          loading="lazy"
          className="w-full object-cover"
          style={{ aspectRatio: '884 / 472' }}
        />
      </a>

      <p className="mt-4 text-body-m text-fg">
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
    </section>
  )
}
