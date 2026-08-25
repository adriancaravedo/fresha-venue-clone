import { useRef, useState } from 'react'
import { CheckIcon, CloseIcon, PlusIcon, GiftIcon, UserIcon } from '../../lib/icons.jsx'

function ListIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M11 8a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1M6 6.5A1.5 1.5 0 1 1 6 9.5a1.5 1.5 0 0 1 0-3m0 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
    </svg>
  )
}

/** Service row: name / duration / description / price, with a round toggle. */
function ServiceRow({ service, selected, onToggle }) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onToggle(service)}
        className={`flex w-full items-end justify-between gap-4 rounded-card bg-surface-base px-6 py-5 text-left transition-shadow ${
          selected
            ? 'shadow-[inset_0_0_0_2px_theme(colors.fg.accent)]'
            : 'shadow-ring hover:shadow-[inset_0_0_0_1px_#0d0d0d]'
        }`}
      >
        <div className="min-w-0">
          <h3 className="text-body-m font-medium text-fg">{service.name}</h3>
          <p className="text-body-s text-fg-muted">{service.caption}</p>
          {service.description && (
            <p className="mt-1 text-body-s text-fg-muted">{service.description}</p>
          )}
          <p className="mt-3 text-body-s font-semibold text-fg">
            {service.priceType === 'FROM' ? `from ${service.price}` : service.price}
          </p>
        </div>

        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-pill transition-colors ${
            selected ? 'bg-fg-accent text-white' : 'text-fg shadow-ringSoft'
          }`}
        >
          {selected ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
        </span>
      </button>
    </li>
  )
}

const UPSELL = [
  { id: 'group', title: 'Group appointments', sub: 'Book for yourself and others', Icon: UserIcon },
  { id: 'gift', title: 'Gift cards', sub: 'Treat yourself or a friend to future visits', Icon: GiftIcon },
]

export default function StepServices({ data, booking }) {
  const { serviceIds, toggleService } = booking
  const [activeId, setActiveId] = useState(data.serviceCategories[0].id)
  const [menuOpen, setMenuOpen] = useState(false)
  const railRef = useRef(null)

  const active = data.serviceCategories.find((c) => c.id === activeId) ?? data.serviceCategories[0]

  const select = (id) => {
    setActiveId(id)
    setMenuOpen(false)
    railRef.current?.querySelector(`[data-cat="${id}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }

  return (
    <div>
      <div className="relative mb-6 flex items-center">
        <ul ref={railRef} role="tablist" className="rail h-[37px] items-center gap-2 pr-12">
          {data.serviceCategories.map((c) => {
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
                      : 'bg-surface-base text-fg shadow-ringSoft hover:bg-surface-hover'
                  }`}
                >
                  <span className="block max-w-[200px] truncate">{c.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f5f5f5] to-transparent" />
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
              {data.serviceCategories.map((c) => (
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

      <h2 className="mb-4 text-[19px] font-semibold leading-6 text-fg">{active.name}</h2>

      <ul className="flex flex-col gap-3">
        {active.items.map((s) => (
          <ServiceRow
            key={`${active.id}-${s.variantId}`}
            service={s}
            selected={serviceIds.includes(s.variantId)}
            onToggle={toggleService}
          />
        ))}
      </ul>

      <h2 className="mb-4 mt-10 text-[19px] font-semibold leading-6 text-fg">Try something else</h2>
      <ul className="flex flex-col gap-3">
        {UPSELL.map(({ id, title, sub, Icon }) => (
          <li key={id}>
            <button
              type="button"
              className="flex w-full items-center gap-4 rounded-card bg-surface-base px-6 py-5 text-left shadow-ring transition-shadow hover:shadow-[inset_0_0_0_1px_#0d0d0d]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-surface-avatar text-fg-accent">
                <Icon size={24} />
              </span>
              <span className="min-w-0">
                <span className="block text-body-m font-medium text-fg">{title}</span>
                <span className="block text-body-s text-fg-muted">{sub}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
