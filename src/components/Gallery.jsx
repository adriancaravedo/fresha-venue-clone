import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button.jsx'
import {
  ImagesIcon,
  CloseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShareIcon,
  HeartIcon,
} from '../lib/icons.jsx'

const MobileAction = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex h-10 w-10 items-center justify-center rounded-pill bg-surface-base/90 text-fg shadow-float backdrop-blur"
  >
    {children}
  </button>
)

/**
 * Hero gallery.
 *  desktop — 909 / 443 two-column grid, 24px gutter, 16px radius; the right
 *            column stacks two half-height tiles. "See all images" floats
 *            24px in from the bottom-right corner.
 *  mobile  — full-bleed swipe rail with a counter chip.
 */
export default function Gallery({ gallery, venueName, onOpen, onShare }) {
  const [index, setIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const railRef = useRef(null)

  const onRailScroll = () => {
    const el = railRef.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const mobile = gallery.mobile
  const a = gallery.large[0]
  const [, b, c] = gallery.small

  return (
    <section id="photos-section" className="scroll-mt-[124px]">
      {/* mobile / tablet */}
      <div className="relative laptop:hidden">
        <div
          ref={railRef}
          onScroll={onRailScroll}
          className="rail -mx-[var(--page-gutter)] aspect-[3/2] w-[calc(100%+var(--page-gutter)*2)]"
        >
          {mobile.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => onOpen(i)}
              className="h-full w-full shrink-0 snap-start"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={img.url}
                alt={img.alt || venueName}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-4 right-4 rounded-pill bg-black/60 px-2.5 py-1 text-body-s font-medium text-white">
          {index + 1} / {mobile.length}
        </span>

        <div className="absolute right-4 top-4 flex items-center gap-2">
          <MobileAction label="Share" onClick={onShare}>
            <ShareIcon size={20} />
          </MobileAction>
          <MobileAction label="Add to favourites" onClick={() => setSaved((v) => !v)}>
            <HeartIcon size={20} filled={saved} className={saved ? 'text-[#e0245e]' : ''} />
          </MobileAction>
        </div>
      </div>

      {/* desktop */}
      <div
        className="relative hidden gap-6 laptop:grid laptop:grid-cols-[909fr_443fr]"
        style={{ aspectRatio: '1376 / 515' }}
      >
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group relative min-h-0 overflow-hidden rounded-card"
        >
          <img
            src={a.url}
            alt={a.alt || venueName}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </button>

        <div className="grid min-h-0 grid-rows-2 gap-6">
          {[b, c].map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => onOpen(i + 1)}
              className="group relative min-h-0 overflow-hidden rounded-card"
            >
              <img
                src={img.url}
                alt={img.alt || venueName}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6">
          <Button
            variant="elevated"
            onClick={onOpen}
            className="pointer-events-auto"
            aria-label={`See all ${gallery.full.length} images`}
          >
            See all images
          </Button>
        </div>
      </div>
    </section>
  )
}

/** Full-screen lightbox: arrows, ESC, counter, click-out to close. */
export function GalleryModal({ images, startIndex = 0, venueName, onClose }) {
  const [i, setI] = useState(startIndex)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((n) => (n + 1) % images.length)
      if (e.key === 'ArrowLeft') setI((n) => (n - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [images.length, onClose])

  const img = images[i]

  return (
    <div
      className="fixed inset-0 z-[400] flex flex-col bg-surface-page"
      role="dialog"
      aria-modal="true"
      aria-label={`${venueName} photos`}
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between px-[var(--page-gutter)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-12 w-12 items-center justify-center rounded-pill shadow-ringSoft hover:bg-surface-hover"
        >
          <CloseIcon size={24} />
        </button>
        <span className="text-body-s font-medium text-fg-muted">
          {i + 1} / {images.length}
        </span>
        <span className="w-12" />
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-[var(--page-gutter)] pb-8">
        <img
          src={img.url}
          alt={img.alt || venueName}
          className="max-h-full max-w-full rounded-card object-contain"
        />
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => setI((n) => (n - 1 + images.length) % images.length)}
          className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-pill bg-surface-base shadow-float"
        >
          <ArrowLeftIcon size={24} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => setI((n) => (n + 1) % images.length)}
          className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-pill bg-surface-base shadow-float"
        >
          <ArrowRightIcon size={24} />
        </button>
      </div>

      <div className="shrink-0 border-t border-line px-[var(--page-gutter)] py-4">
        <div className="rail gap-3">
          {images.map((t, n) => (
            <button
              key={t.url}
              type="button"
              onClick={() => setI(n)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-tile transition-opacity ${
                n === i ? 'opacity-100 shadow-ring' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img src={t.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { ImagesIcon }
