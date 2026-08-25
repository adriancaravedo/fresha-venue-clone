import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '../../lib/icons.jsx'

/**
 * Paged horizontal rail with the round Previous / Next controls Fresha puts
 * in the section header. Arrows disable at the ends, exactly like the site.
 */
export default function Carousel({ children, label, header }) {
  const ref = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const page = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  const arrow = (dir, disabled, Icon, text) => (
    <button
      type="button"
      aria-label={text}
      disabled={disabled}
      onClick={() => page(dir)}
      className="flex h-12 w-12 items-center justify-center rounded-pill border border-line bg-surface-base text-fg transition-opacity hover:bg-surface-hover disabled:cursor-default disabled:opacity-40"
    >
      <Icon size={20} />
    </button>
  )

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4 px-[var(--page-gutter)]">
        <div className="min-w-0 flex-1">{header}</div>
        <div className="hidden shrink-0 items-center gap-2 tablet:flex">
          {arrow(-1, atStart, ArrowLeftIcon, 'Previous')}
          {arrow(1, atEnd, ArrowRightIcon, 'Next')}
        </div>
      </div>

      <div
        ref={ref}
        onScroll={sync}
        aria-label={label}
        className="rail scroll-p-[var(--page-gutter)] gap-7 px-[var(--page-gutter)] pb-2"
      >
        {children}
      </div>
    </div>
  )
}
