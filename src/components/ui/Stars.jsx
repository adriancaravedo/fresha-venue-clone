import { StarIcon } from '../../lib/icons.jsx'

/**
 * Star row. Fresha draws 5 stars and clips a filled copy over the grey base,
 * so a 4.9 reads as four solid stars plus a 90% sliver.
 */
export function Stars({ value = 5, size = 16, gap = 2, className = '' }) {
  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap }}
      role="img"
      aria-label={`${value} rating`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(Math.max(value - i, 0), 1)
        return (
          <span key={i} className="relative block" style={{ width: size, height: size }}>
            <StarIcon size={size} className="absolute inset-0 text-surface-shade300" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon size={size} className="text-star" />
            </span>
          </span>
        )
      })}
    </div>
  )
}

/**
 * The "5.0 ★★★★★ (1,306)" cluster.
 * The hero and the booking card put the number first; the Reviews heading
 * leads with the stars — hence `starsFirst`.
 */
export function RatingLine({
  value,
  formatted,
  count,
  starsFirst = false,
  starSize = 16,
  textClass = 'text-body-m font-semibold',
  onCountClick,
  className = '',
}) {
  const number = <span className={`${textClass} text-fg`}>{formatted}</span>
  const stars = <Stars value={value} size={starSize} />

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <p className="sr-only-text">{`${formatted} rating with ${count} votes`}</p>
      {starsFirst ? (
        <>
          {stars}
          {number}
        </>
      ) : (
        <>
          {number}
          {stars}
        </>
      )}
      {count != null && (
        <button
          type="button"
          onClick={onCountClick}
          className={`${textClass.replace('font-semibold', 'font-normal')} text-fg underline-offset-2 hover:underline`}
        >
          ({count})
        </button>
      )}
    </div>
  )
}
