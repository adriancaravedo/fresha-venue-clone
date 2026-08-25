import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button.jsx'
import { CloseIcon } from '../lib/icons.jsx'

const VISIBLE = 4 // Fresha previews four services per category

function ListIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M11 8a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1M6 6.5A1.5 1.5 0 1 1 6 9.5a1.5 1.5 0 0 1 0-3m0 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
    </svg>
  )
}

function ServiceRow({ service, onBook }) {
  return (
    <li className="rounded-card px-6 py-5 shadow-ring transition-shadow hover:shadow-[inset_0_0_0_1px_#0d0d0d]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-body-m font-medium text-fg">{service.name}</h3>
          <h4 className="text-body-s text-fg-muted">{service.caption}</h4>
          <p className="mt-3 text-body-s font-semibold text-fg">
            {service.priceType === 'FROM' ? `from ${service.price}` : service.price}
          </p>
        </div>
        <Button onClick={() => onBook(service)} className="shrink-0">
          Book
        </Button>
      </div>
    </li>
  )
}

/**
 * Services block: a snapping category rail (36px pills, 8px gaps, black =
 * selected) over a 12px-gapped stack of 114px service cards, capped at four
 * with a "See all" outline button underneath.
 */
export default function Services({ categories, serviceCount, onBook }) {
  const [activeId, setActiveId] = useState(categories[0].id)
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const railRef = useRef(null)

  const active = categories.find((c) => c.id === activeId) ?? categories[0]
  // "See all" opens the complete menu — every category, every service — the
  // way the original's See all navigates to the full booking menu.
  const groups = expanded
    ? categories.filter((c) => c.id !== 'recommended')
    : [{ ...active, items: active.items.slice(0, VISIBLE) }]

  // reset the preview cap whenever the category changes
  useEffect(() => setExpanded(false), [activeId])

  const select = (id) => {
    setActiveId(id)
    setExpanded(false)
    setMenuOpen(false)
    const el = railRef.current?.querySelector(`[data-cat="${id}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }

  return (
    <section id="services-section" className="scroll-mt-[124px]">
      <h2 className="mb-6 text-head-xs font-semibold text-fg">Services</h2>

      <div className="relative mb-6 flex items-center">
        <ul ref={railRef} role="tablist" className="rail h-[37px] items-center gap-2 pr-12">
          {categories.map((c) => {
            const isActive = c.id === activeId
            return (
              <li key={c.id} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <button
                  type="button"
                  role="tab"
                  data-cat={c.id}
                  aria-selected={isActive}
                  title={c.name}
                  onClick={() => select(c.id)}
                  className={`flex h-9 items-center rounded-pill px-4 text-body-s font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-primary text-fg-onPrimary'
                      : 'text-fg shadow-ringSoft hover:bg-surface-hover'
                  }`}
                >
                  <span className="block max-w-[200px] truncate">{c.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* right-edge fade + overflow menu, exactly as on the original rail */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-page to-transparent" />
        <button
          type="button"
          aria-label="All categories"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-pill bg-surface-base shadow-float"
        >
          <ListIcon />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-50 max-h-[420px] w-[320px] overflow-y-auto rounded-card bg-surface-base p-2 shadow-float">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-body-s font-semibold text-fg-muted">Categories</span>
              <button type="button" aria-label="Close" onClick={() => setMenuOpen(false)}>
                <CloseIcon size={20} />
              </button>
            </div>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => select(c.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-tile px-3 py-2.5 text-left text-body-m hover:bg-surface-hover ${
                      c.id === activeId ? 'font-semibold' : ''
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="shrink-0 text-body-s text-fg-muted">{c.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {groups.map((group) => (
        <div key={group.id} className={expanded ? 'mb-8' : ''}>
          {expanded && (
            <h3 className="mb-4 text-body-l font-semibold text-fg">{group.name}</h3>
          )}
          <ul className="flex flex-col gap-3">
            {group.items.map((s) => (
              <ServiceRow key={s.id} service={s} onBook={onBook} />
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-6">
        <Button size="l" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Show less' : 'See all'}
        </Button>
      </div>

      <p className="sr-only-text">{`${serviceCount} services available`}</p>
    </section>
  )
}
