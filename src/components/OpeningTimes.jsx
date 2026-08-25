/** Day / hours rows with a dot marker; today's row is emphasised. */
export default function OpeningTimes({ days, compact = false }) {
  return (
    <ul className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}>
      {days.map((d) => (
        <li key={d.dayName} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`h-2 w-2 shrink-0 rounded-pill ${
                d.isClosed ? 'bg-surface-shade300' : 'bg-[#0a7c42]'
              }`}
            />
            <p className={`text-body-m ${d.isToday ? 'font-semibold text-fg' : 'text-fg'}`}>
              {d.dayName}
            </p>
          </div>
          <p className={`text-body-m ${d.isToday ? 'font-semibold text-fg' : 'text-fg-muted'}`}>
            {d.isClosed ? 'Closed' : d.values.map((v) => v.value).join(', ')}
          </p>
        </li>
      ))}
    </ul>
  )
}
