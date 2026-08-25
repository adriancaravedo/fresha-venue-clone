/** 14px/20 muted trail, 20px gaps, hairline rule below (16px pad + 12px margin). */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 border-b border-line pb-4">
      <ol className="rail items-center gap-5">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.url} className="flex shrink-0 items-center gap-5">
              {last ? (
                <span className="whitespace-nowrap text-body-s text-fg">{item.name}</span>
              ) : (
                <a
                  href={item.url}
                  className="whitespace-nowrap text-body-s text-fg-muted underline-offset-2 hover:underline"
                >
                  {item.name}
                </a>
              )}
              {!last && (
                <span aria-hidden="true" className="text-body-s text-fg-muted">
                  ·
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
