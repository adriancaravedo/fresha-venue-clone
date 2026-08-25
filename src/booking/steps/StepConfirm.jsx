import Avatar from '../../components/ui/Avatar.jsx'
import { formatLongDate, formatSlotRange } from '../availability.js'
import {
  CalendarIcon,
  ClockIcon,
  PinIcon,
  CardIcon,
  NoteIcon,
  ShuffleIcon,
} from '../../lib/icons.jsx'

const money = (n, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

const Card = ({ children, className = '' }) => (
  <section className={`rounded-card bg-surface-base px-6 py-5 shadow-ring ${className}`}>
    {children}
  </section>
)

/**
 * Review screen.
 *
 * NOTE: unlike the other three steps, this one is *not* measured — Fresha puts
 * it behind a login wall, so its exact layout could not be observed. It is
 * assembled from the flow's own data (the summary column already carries every
 * field it recaps) and follows the same card language as the earlier steps.
 * See SPEC.md § Booking flow.
 */
export default function StepConfirm({ data, booking }) {
  const { venue, address } = data
  const { services, employee, employeeId, date, time, duration, total, notes, setNotes } = booking

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <h2 className="mb-4 text-[19px] font-semibold leading-6 text-fg">Appointment</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CalendarIcon size={20} className="shrink-0 text-fg" />
            <p className="text-body-m text-fg">{date ? formatLongDate(date) : '—'}</p>
          </div>
          <div className="flex items-center gap-3">
            <ClockIcon size={20} className="shrink-0 text-fg" />
            <p className="text-body-m text-fg">
              {time != null ? formatSlotRange(time, duration) : '—'}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <PinIcon size={20} className="shrink-0 text-fg" />
            <p className="text-body-m text-fg">
              {venue.name}
              <span className="block text-body-s text-fg-muted">{address.shortFormatted}</span>
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-[19px] font-semibold leading-6 text-fg">Professional</h2>
        <div className="flex items-center gap-3">
          {employee ? (
            <Avatar
              src={employee.avatar}
              alt=""
              initials={employee.name.slice(0, 2)}
              size={48}
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-surface-avatar text-fg-accent">
              <ShuffleIcon size={22} />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-body-m font-medium text-fg">
              {employee ? employee.name : 'Any professional'}
            </p>
            <p className="text-body-s text-fg-muted">
              {employee?.jobTitle ?? (employeeId ? 'Maximum availability' : '')}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-[19px] font-semibold leading-6 text-fg">Services</h2>
        <ul className="flex flex-col gap-4">
          {services.map((s) => (
            <li key={s.variantId} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-body-m text-fg">{s.name}</p>
                <p className="text-body-s text-fg-muted">{s.caption}</p>
              </div>
              <span className="shrink-0 text-body-m text-fg">{s.price}</span>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <div className="flex items-center justify-between text-body-m font-semibold text-fg">
          <span>Total</span>
          <span>{money(total, venue.currency)}</span>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-[19px] font-semibold leading-6 text-fg">Payment</h2>
        <div className="flex items-start gap-3">
          <CardIcon size={20} className="mt-0.5 shrink-0 text-fg" />
          <p className="text-body-m text-fg">
            Pay at venue
            <span className="block text-body-s text-fg-muted">
              You’ll settle up after your appointment.
            </span>
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-[19px] font-semibold leading-6 text-fg">
          <NoteIcon size={20} />
          Booking notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Include comments or requests about your booking"
          className="w-full resize-y rounded-tile border border-line bg-surface-base p-4 text-body-m text-fg outline-none focus:border-fg"
        />
      </Card>

      <Card>
        <h2 className="mb-2 text-[19px] font-semibold leading-6 text-fg">Cancellation policy</h2>
        <p className="text-body-m text-fg-muted">
          Cancel for free anytime in advance, otherwise you may be charged a fee for late
          cancellation.
        </p>
      </Card>
    </div>
  )
}
