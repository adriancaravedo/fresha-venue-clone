import { useState } from 'react'
import Carousel from './ui/Carousel.jsx'

/**
 * The SEO block that closes the page: a 28/36 heading, two radio-style tabs
 * ("in" / "around" the city) and a scrollable rail of category links.
 */
export default function SeoLinks({ groups }) {
  const [active, setActive] = useState(0)
  const group = groups[active]

  // 30 links per group, laid out three-per-column on the rail
  const columns = []
  for (let i = 0; i < group.links.length; i += 3) columns.push(group.links.slice(i, i + 3))

  return (
    <section className="mx-auto max-w-page py-10">
      <h2 className="mb-6 px-[var(--page-gutter)] text-head-s font-semibold text-fg">
        Treat yourself anytime, anywhere
      </h2>

      <div
        role="tablist"
        className="mb-6 flex gap-2 overflow-x-auto px-[var(--page-gutter)]"
      >
        {groups.map((g, i) => (
          <button
            key={g.sectionName}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`h-9 shrink-0 rounded-pill px-4 text-body-s font-medium transition-colors ${
              i === active
                ? 'bg-surface-primary text-fg-onPrimary'
                : 'text-fg shadow-ringSoft hover:bg-surface-hover'
            }`}
          >
            {g.sectionName}
          </button>
        ))}
      </div>

      <Carousel label={group.sectionName} header={<span className="sr-only-text" />}>
        {columns.map((col, i) => (
          <ul key={i} className="flex w-[260px] shrink-0 flex-col gap-3">
            {col.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  className="block truncate text-body-m text-fg underline-offset-2 hover:underline"
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </Carousel>
    </section>
  )
}
