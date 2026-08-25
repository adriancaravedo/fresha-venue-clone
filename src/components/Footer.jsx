import {
  FreshaLogo,
  AppleIcon,
  GoogleIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  GlobeIcon,
} from '../lib/icons.jsx'

const COLUMNS = [
  {
    title: 'About Fresha',
    links: ['Careers', 'Help and support', 'Blog', 'Sitemap'],
  },
  {
    title: 'For business',
    links: ['For partners', 'Pricing', 'Support', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of service', 'Terms of use'],
  },
]

const SOCIALS = [
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'Linkedin', Icon: LinkedinIcon },
  { label: 'Instagram', Icon: InstagramIcon },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-page">
      <div className="mx-auto max-w-page px-[var(--page-gutter)] py-12">
        <div className="grid grid-cols-1 gap-10 tablet:grid-cols-2 laptop:grid-cols-5">
          <div className="laptop:col-span-2">
            <FreshaLogo height={24} />
            <h3 className="mb-4 mt-6 text-body-m font-semibold text-fg">Get the app</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'App Store', Icon: AppleIcon },
                { label: 'Google Play', Icon: GoogleIcon },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-12 items-center gap-2 rounded-pill px-5 text-body-s font-medium shadow-ringSoft hover:bg-surface-hover"
                >
                  <Icon size={20} />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h3 className="mb-4 text-body-m font-semibold text-fg">{c.title}</h3>
              <ul className="flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-body-m text-fg-muted hover:text-fg hover:underline">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-body-m font-semibold text-fg">Find us on social</h3>
            <ul className="flex items-center gap-3">
              {SOCIALS.map(({ label, Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-fg hover:bg-surface-hover"
                  >
                    <Icon size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 text-body-s text-fg-muted">
            <button type="button" className="flex items-center gap-2 hover:text-fg">
              <GlobeIcon size={20} className="text-fg-accent" />
              English (US)
            </button>
            <span>USD</span>
            <span>© {new Date().getFullYear()} Fresha</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
