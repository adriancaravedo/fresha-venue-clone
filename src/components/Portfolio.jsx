import { useState } from 'react'
import { GalleryModal } from './Gallery.jsx'

/**
 * Portfolio mosaic: a 4-column, 12px-gap grid where the first tile spans
 * 2×2 (436px) and the rest are 212px squares. The "99+" chip sits beside
 * the heading; the final tile carries the "+114" overlay.
 */
export default function Portfolio({ portfolio, venueName }) {
  const [lightbox, setLightbox] = useState(null)
  const items = portfolio.items.slice(0, 9)

  return (
    <section id="portfolio-section" className="scroll-mt-[124px]">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-head-xs font-semibold text-fg">Portfolio</h2>
        <span className="flex h-5 items-center rounded-pill bg-surface-base px-1.5 text-body-xs font-medium text-fg-muted shadow-badge">
          {portfolio.total > 99 ? '99+' : portfolio.total}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
        {items.map((item, i) => {
          const isHero = i === 0
          const isLast = i === items.length - 1
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden rounded-tile ${
                isHero ? 'col-span-2 row-span-2' : ''
              }`}
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {isLast && portfolio.remaining > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[22px] font-semibold text-white">
                  +{portfolio.remaining}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {lightbox !== null && (
        <GalleryModal
          images={portfolio.items}
          startIndex={lightbox}
          venueName={venueName}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
