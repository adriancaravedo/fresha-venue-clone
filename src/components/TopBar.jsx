import { useState } from 'react'
import { FreshaLogo, SearchIcon, MenuIcon, CloseIcon } from '../lib/icons.jsx'

const FIELDS = [
  { key: 'treatment', placeholder: 'All treatments' },
  { key: 'location', placeholder: 'Current location' },
  { key: 'time', placeholder: 'Any time', readOnly: true },
]

const MENU_LINKS = [
  'Download the app',
  'Help and support',
  'English (US)',
  'USD',
  'List your business',
  'Log in',
  'Sign up',
]

/**
 * The marketplace bar: 72px tall (12px block padding), logo left,
 * segmented search pill centred, Menu right. Not sticky — StickyNav
 * slides over it once the hero scrolls past.
 */
export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [values, setValues] = useState({ treatment: '', location: '', time: '' })

  return (
    <div className="relative z-[100] bg-surface-page">
      <nav className="mx-auto grid h-[72px] max-w-page grid-cols-[1fr_auto_1fr] items-center px-[var(--page-gutter)] py-3">
        <div className="flex items-center">
          <a href="/" aria-label="Fresha home">
            <FreshaLogo height={22} />
          </a>
        </div>

        {/* Segmented search — 723×50, 100px radius, 1px hairline + soft drop */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden h-[50px] w-[723px] items-center rounded-[100px] border border-line bg-surface-base shadow-search laptop:flex"
        >
          {FIELDS.map((f, i) => (
            <label key={f.key} className="relative block h-12 flex-1">
              {i > 0 && (
                <span className="absolute inset-y-[9px] left-0 w-px bg-line" aria-hidden="true" />
              )}
              <input
                type="text"
                value={values[f.key]}
                readOnly={f.readOnly}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                autoComplete="off"
                spellCheck="false"
                aria-label={f.placeholder}
                className="h-full w-full rounded-[100px] bg-transparent px-4 text-body-s font-medium text-fg outline-none placeholder:text-fg placeholder:opacity-100"
              />
            </label>
          ))}
          <button
            type="submit"
            aria-label="Search"
            className="mr-[7px] flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-surface-primary text-fg-onPrimary transition-colors hover:bg-[#262626]"
          >
            <SearchIcon size={20} />
          </button>
        </form>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-12 items-center gap-2 rounded-pill px-4 text-body-m font-medium transition-colors hover:bg-surface-hover"
          >
            Menu
            <MenuIcon size={24} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-label="Menu">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-surface-base">
            <div className="flex h-[72px] items-center justify-between px-6">
              <FreshaLogo height={22} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-pill hover:bg-surface-hover"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            <ul className="flex flex-col px-3 py-2">
              {MENU_LINKS.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="block rounded-tile px-3 py-3.5 text-body-m font-medium hover:bg-surface-hover"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
