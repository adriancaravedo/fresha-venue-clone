import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'photos-section', label: 'Photos' },
  { id: 'services-section', label: 'Services' },
  { id: 'team-section', label: 'Team' },
  { id: 'reviews-section', label: 'Reviews' },
  { id: 'portfolio-section', label: 'Portfolio' },
  { id: 'about-section', label: 'About' },
]

/**
 * Fixed 52px section rail. It lives at top:-52px and slides to top:0 once the
 * hero gallery leaves the viewport — same trick the original uses, so it
 * covers the (non-sticky) marketplace bar instead of stacking under it.
 * The active tab is driven by scroll position, and clicking one scrolls
 * smoothly (html has scroll-padding-top to clear the rail).
 */
export default function StickyNav() {
  const [shown, setShown] = useState(false)
  const [active, setActive] = useState(SECTIONS[0].id)
  const railRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('photos-section')
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 600
      setShown(heroBottom < 60)

      // active = last section whose top has crossed the rail
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= 130) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // keep the active tab in view on narrow screens
  useEffect(() => {
    const el = railRef.current?.querySelector(`[data-tab="${active}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [active])

  return (
    <div
      className="fixed left-0 z-[100] w-full border-b border-line bg-surface-page transition-[top] duration-300 ease-out"
      style={{ top: shown ? 0 : -52 }}
    >
      <div className="mx-auto max-w-page pl-[var(--page-gutter)]">
        <div className="px-[var(--page-gutter)]">
          <ul ref={railRef} className="rail h-[52px] items-center gap-6" role="tablist">
            {SECTIONS.map((s) => {
              const isActive = active === s.id
              return (
                <li key={s.id} role="presentation" className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    data-tab={s.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`relative flex h-[52px] items-center whitespace-nowrap text-body-s font-medium transition-colors ${
                      isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    {s.label}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-1 rounded-t-[2px] bg-fg" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
