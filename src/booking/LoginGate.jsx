import { useEffect, useState } from 'react'
import Button from '../components/ui/Button.jsx'
import { AppleIcon, CloseIcon, GoogleIcon } from '../lib/icons.jsx'

/**
 * The auth wall Fresha raises between "Time" and "Confirm" — 480px, 32px
 * radius, 48px side padding, measured off the live flow.
 *
 * Nothing here talks to a server: submitting any address just advances the
 * clone's flow. There is no account, no code, and no credential handling.
 */
export default function LoginGate({ onClose, onContinue }) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const valid = /.+@.+\..+/.test(email)

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="login-gate-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-[480px] rounded-[32px] bg-surface-base shadow-float">
        <div className="flex items-start justify-end px-12 pb-4 pt-8">
          <button
            type="button"
            aria-label="Exit"
            onClick={onClose}
            className="-mr-8 flex h-12 w-12 items-center justify-center rounded-pill hover:bg-surface-hover"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        <form
          className="px-12 pb-8"
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) onContinue(email)
          }}
        >
          <p id="login-gate-title" className="text-head-s font-semibold text-fg">
            Log in or sign up to book
          </p>
          <p className="mt-2 text-body-s text-fg-muted">
            We’ll need to verify it’s you to continue
          </p>

          <label className="mt-8 block">
            <span className="mb-2 block text-body-s font-medium text-fg">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-12 w-full rounded-tile border border-line bg-surface-base px-4 text-body-m text-fg outline-none focus:border-fg"
            />
          </label>
          <p className="mt-2 text-body-s text-fg-muted">We’ll send you a verification code</p>

          <Button
            as="button"
            type="submit"
            size="l"
            variant="primary"
            full
            className="mt-6 font-semibold"
            disabled={!valid}
          >
            Continue
          </Button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-body-s text-fg-muted">OR</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-3">
            <Button size="l" full type="button" onClick={() => onContinue(null)}>
              <GoogleIcon size={20} />
              Continue with Google
            </Button>
            <Button size="l" full type="button" onClick={() => onContinue(null)}>
              <AppleIcon size={20} />
              Continue with Apple
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
