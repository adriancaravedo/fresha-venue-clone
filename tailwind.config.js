/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // RoobertPRO is Fresha's licensed face; Plus Jakarta Sans is the closest free match.
        sans: ['RoobertPRO', '"Plus Jakarta Sans"', 'AktivGroteskVF', 'system-ui', 'sans-serif'],
      },
      colors: {
        fg: {
          DEFAULT: '#0d0d0d',
          neutral: '#0d0d0d',
          muted: '#767676',
          disabled: '#b3b3b3',
          onPrimary: '#ffffff',
          accent: '#6950f3',
        },
        surface: {
          page: '#ffffff',
          base: '#ffffff',
          shade100: '#f5f5f5',
          shade200: '#f2f2f2',
          shade300: '#e5e5e5',
          avatar: '#f0f0ff',
          primary: '#0d0d0d',
          hover: 'rgba(19,19,19,0.06)',
          active: 'rgba(19,19,19,0.10)',
        },
        star: '#ffc00a',
        line: '#e5e5e5',
      },
      borderRadius: {
        card: '16px',
        tile: '8px',
        pill: '999px',
      },
      boxShadow: {
        // measured from fresha.com
        card: '0 4px 12px 0 rgba(19,19,19,0.08), 0 2px 6px 2px rgba(19,19,19,0.02)',
        float: '0 2px 8px 0 rgba(19,19,19,0.08), 0 4px 20px 0 rgba(19,19,19,0.12)',
        search: '0 2px 4px 0 rgba(20,20,20,0.12)',
        ring: 'inset 0 0 0 1px #e5e5e5',
        ringSoft: 'inset 0 0 0 1px rgba(19,19,19,0.1)',
        badge: '0 0 0 1px #e5e5e5, 0 0 0 2px #ffffff',
      },
      fontSize: {
        // [size, { lineHeight }] — Fresha's type scale
        'body-xs': ['12px', '16px'],
        'body-s': ['14px', '20px'],
        'body-m': ['16px', '22px'],
        'body-l': ['18px', '26px'],
        'head-xs': ['24px', '32px'],
        'head-s': ['28px', '36px'],
        'head-m': ['32px', '40px'],
        'head-l': ['48px', '52px'],
      },
      maxWidth: { page: '1440px' },
      screens: { tablet: '768px', laptop: '1024px', desktop: '1280px' },
    },
  },
  plugins: [],
}
