import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#111111',
        page: '#FAFAF8',
        muted: '#888888',
        accent: '#1a1a1a',
        border: '#E5E5E0',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#111111',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            maxWidth: 'none',
            'h2, h3': {
              fontFamily: 'var(--font-cormorant)',
              fontWeight: '400',
              color: '#111111',
            },
            blockquote: {
              borderLeftColor: '#111111',
              borderLeftWidth: '2px',
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: '1.3rem',
              color: '#333',
            },
            a: {
              color: '#111111',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config