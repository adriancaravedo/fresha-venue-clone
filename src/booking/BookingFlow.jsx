import { useState } from 'react'
import { STEPS, useBooking } from './useBooking.js'
import BookingSummary from './BookingSummary.jsx'
import BookingBottomBar from './BookingBottomBar.jsx'
import LoginGate from './LoginGate.jsx'
import StepServices from './steps/StepServices.jsx'
import StepProfessional from './steps/StepProfessional.jsx'
import StepTime from './steps/StepTime.jsx'
import StepConfirm from './steps/StepConfirm.jsx'
import { formatLongDate, formatSlotRange } from './availability.js'
import { ArrowLeftIcon, ChevronRightIcon, CloseIcon, CheckIcon } from '../lib/icons.jsx'

/** Services › Professional › Time › Confirm — desktop only, like the original. */
function Stepper({ step, onJump }) {
  return (
    <nav aria-label="Booking steps" className="hidden items-center gap-2 laptop:flex">
      {STEPS.map((s, i) => (
        <span key={s.key} className="flex items-center gap-2">
          {i > 0 && <ChevronRightIcon size={16} className="text-[#acacac]" />}
          <button
            type="button"
            disabled={i > step}
            onClick={() => onJump(i)}
            aria-current={i === step ? 'step' : undefined}
            className={`text-body-s font-medium transition-colors disabled:cursor-default ${
              i <= step ? 'text-fg hover:underline' : 'text-[#acacac]'
            }`}
          >
            {s.label}
          </button>
        </span>
      ))}
    </nav>
  )
}

function Booked({ data, booking, onDone }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-pill bg-fg-accent text-white">
        <CheckIcon size={32} />
      </span>
      <h2 className="text-head-s font-semibold text-fg">Appointment requested</h2>
      <p className="mt-2 max-w-[420px] text-body-m text-fg-muted">
        {booking.date && booking.time != null
          ? `${formatLongDate(booking.date)} · ${formatSlotRange(booking.time, booking.duration)} at ${data.venue.name}.`
          : `We’ve saved your selection at ${data.venue.name}.`}
      </p>
      <p className="mt-4 max-w-[420px] text-body-s text-fg-muted">
        This clone stops here — no booking was created and nothing was sent.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-8 flex h-12 items-center rounded-pill bg-surface-primary px-5 text-body-m font-semibold text-fg-onPrimary"
      >
        Back to {data.venue.name}
      </button>
    </div>
  )
}

/**
 * Full-page booking flow. Page sits on #f5f5f5 with white cards; content is
 * capped at 1184px and split 792 / 32 / 360 from `laptop` up, collapsing to a
 * single column with a fixed bottom bar below that.
 */
export default function BookingFlow({ data, initialServiceIds, onExit, today = new Date() }) {
  const booking = useBooking({ data, initialServiceIds })
  const [gateOpen, setGateOpen] = useState(false)
  const [booked, setBooked] = useState(false)
  const { step, setStep, canContinue } = booking

  const current = STEPS[step]

  const goBack = () => (step === 0 ? onExit() : setStep(step - 1))

  const goNext = () => {
    if (!canContinue) return
    // the live flow demands an account between Time and Confirm
    if (step === 2) return setGateOpen(true)
    if (step === 3) return setBooked(true)
    setStep(step + 1)
  }

  return (
    <div className="min-h-dvh bg-surface-shade100">
      <header className="sticky top-0 z-50 flex h-[72px] items-center gap-12 bg-surface-shade100 px-[var(--page-gutter)]">
        <button
          type="button"
          aria-label="Go back"
          onClick={goBack}
          className="flex h-12 w-12 items-center justify-center rounded-pill text-fg hover:bg-surface-hover laptop:shadow-ringSoft laptop:hover:bg-surface-base"
        >
          <ArrowLeftIcon size={24} />
        </button>

        <p className="min-w-0 flex-1 truncate text-body-m font-medium text-fg tablet:hidden">
          {booked ? 'Booking' : current.title}
        </p>
        <span className="hidden flex-1 tablet:block" />

        <button
          type="button"
          aria-label="Close modal"
          onClick={onExit}
          className="flex h-12 w-12 items-center justify-center rounded-pill text-fg hover:bg-surface-hover laptop:shadow-ringSoft laptop:hover:bg-surface-base"
        >
          <CloseIcon size={24} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[calc(1184px+2*var(--page-gutter))] px-[var(--page-gutter)] pb-24">
        {booked ? (
          <Booked data={data} booking={booking} onDone={onExit} />
        ) : (
          <>
            <div className="pt-0.5">
              <Stepper step={step} onJump={setStep} />
            </div>

            <div className="grid gap-8 laptop:grid-cols-[792px_360px] laptop:items-start">
              <div className="min-w-0">
                <h1 className="mb-8 mt-3.5 text-[32px] font-bold leading-9 text-fg tablet:text-[40px] tablet:leading-[44px]">
                  {current.title}
                </h1>

                {step === 0 && <StepServices data={data} booking={booking} />}
                {step === 1 && <StepProfessional data={data} booking={booking} />}
                {step === 2 && <StepTime data={data} booking={booking} today={today} />}
                {step === 3 && <StepConfirm data={data} booking={booking} />}
              </div>

              <BookingSummary
                data={data}
                booking={booking}
                onContinue={goNext}
                continueLabel={step === 3 ? 'Confirm' : 'Continue'}
              />
            </div>
          </>
        )}
      </div>

      {!booked && (
        <BookingBottomBar
          data={data}
          booking={booking}
          onContinue={goNext}
          continueLabel={step === 3 ? 'Confirm' : 'Continue'}
        />
      )}

      {gateOpen && (
        <LoginGate
          onClose={() => setGateOpen(false)}
          onContinue={() => {
            setGateOpen(false)
            setStep(3)
          }}
        />
      )}
    </div>
  )
}
