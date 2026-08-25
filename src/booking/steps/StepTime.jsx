import { useEffect, useMemo, useRef } from 'react'
import Button from '../../components/ui/Button.jsx'
import Avatar from '../../components/ui/Avatar.jsx'
import {
  buildDateStrip,
  formatShortDate,
  isoDate,
  nextAvailable,
  slotsFor,
} from '../availability.js'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShuffleIcon,
} from '../../lib/icons.jsx'

/** 64 × 94 date tile — purple when picked, hairline ring otherwise. */
function DateTile({ item, selected, onSelect }) {
  return (
    <li className="shrink-0 pr-4" style={{ scrollSnapAlign: 'start' }}>
      <button
        type="button"
        data-date={item.iso}
        aria-pressed={selected}
        onClick={() => onSelect(item.iso)}
        className={`flex h-[94px] w-16 flex-col items-center justify-center rounded-card py-3 transition-colors ${
          selected
            ? 'bg-fg-accent text-white'
            : 'border border-line bg-surface-base hover:bg-surface-hover'
        }`}
      >
        <span
          className={`text-body-s font-medium ${selected ? 'text-white' : 'text-fg-muted'}`}
        >
          {item.weekday}
        </span>
        <span
          className={`text-head-xs font-semibold ${selected ? 'text-white' : 'text-fg'}`}
        >
          {item.day}
        </span>
        <span className={`text-[13px] leading-4 ${selected ? 'text-white' : 'text-fg-muted'}`}>
          {item.month}
        </span>
      </button>
    </li>
  )
}

function EmptyState({ nextIso, onJump }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <CalendarIcon size={48} className="mb-6 text-fg-accent" />
      <p className="text-body-l font-semibold text-fg">Fully booked on this date</p>
      {nextIso && (
        <p className="mt-1 text-body-m text-fg-muted">Available from {formatShortDate(nextIso)}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {nextIso && <Button onClick={() => onJump(nextIso)}>Go to next available date</Button>}
        <Button>Join waitlist</Button>
      </div>
    </div>
  )
}

/**
 * Date rail + time grid. Slots come from `availability.js`, which derives them
 * from the venue's opening hours — the live site asks its API instead.
 */
export default function StepTime({ data, booking, today }) {
  const { employee, employeeId, date, chooseDate, time, setTime, slots, duration } = booking
  const railRef = useRef(null)

  const strip = useMemo(() => buildDateStrip(today), [today])

  // land on the first bookable day rather than an empty grid
  useEffect(() => {
    if (date) return
    const start = isoDate(today)
    const employee = employeeId ?? 'any'
    // `booking.slots` is still empty here (no date picked yet), so ask directly
    const startIsOpen = slotsFor(start, data.workingTime, duration, employee).length > 0
    chooseDate(
      startIsOpen ? start : nextAvailable(start, data.workingTime, duration, employee) ?? start,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!date) return
    railRef.current?.querySelector(`[data-date="${date}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [date])

  const page = (dir) => {
    const el = railRef.current
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const nextIso = date ? nextAvailable(date, data.workingTime, duration, employeeId ?? 'any') : null

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-pill bg-surface-base px-4 text-body-s font-medium text-fg shadow-ringSoft"
        >
          {employee ? (
            <Avatar src={employee.avatar} alt="" initials={employee.name.slice(0, 2)} size={20} />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-surface-avatar text-fg-accent">
              <ShuffleIcon size={14} />
            </span>
          )}
          {employee ? employee.name : 'Any professional'}
          <ChevronDownIcon size={16} />
        </button>

        <button
          type="button"
          aria-label="Select date from a date picker"
          className="flex h-9 w-[52px] items-center justify-center rounded-pill bg-surface-base shadow-ringSoft hover:bg-surface-hover"
        >
          <CalendarIcon size={20} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-[19px] font-semibold leading-6 text-fg">Select a date</h2>
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Go to earlier date"
            onClick={() => page(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-pill hover:bg-surface-hover"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button
            type="button"
            aria-label="Go to later date"
            onClick={() => page(1)}
            className="flex h-9 w-9 items-center justify-center rounded-pill hover:bg-surface-hover"
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>

      <ul ref={railRef} className="rail mb-8 pt-1">
        {strip.map((item) => (
          <DateTile
            key={item.iso}
            item={item}
            selected={item.iso === date}
            onSelect={chooseDate}
          />
        ))}
      </ul>

      {slots.length === 0 ? (
        <EmptyState nextIso={nextIso} onJump={chooseDate} />
      ) : (
        <>
          <h2 className="mb-3 text-[19px] font-semibold leading-6 text-fg">Pick a time</h2>
          <div role="radiogroup" aria-label="Available times" className="flex flex-col gap-3">
            {slots.map((slot) => {
              const selected = time === slot.minutes
              return (
                <button
                  key={slot.minutes}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTime(slot.minutes)}
                  className={`rounded-card px-6 py-5 text-left transition-colors ${
                    selected
                      ? 'bg-surface-shade100 shadow-[inset_0_0_0_2px_#5c4ace]'
                      : 'bg-surface-base shadow-ring hover:shadow-[inset_0_0_0_1px_#0d0d0d]'
                  }`}
                >
                  <p className="text-body-m font-medium text-fg">{slot.label}</p>
                </button>
              )
            })}
          </div>

          <p className="mt-6 text-body-m text-fg-muted">
            Can’t find a suitable time?{' '}
            <button type="button" className="font-medium text-fg-accent hover:underline">
              Join waitlist
            </button>
          </p>
        </>
      )}
    </div>
  )
}
