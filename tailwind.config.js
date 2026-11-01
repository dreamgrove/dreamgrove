// Tailwind 4 reads the rest of the theme from css/tailwind.css (@theme). Only the
// typography plugin's prose overrides still need a JS config.
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif',
            fontSize: '1.05rem',
            letterSpacing: 'normal',
            fontOpticalSizing: 'auto',
            hr: {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            a: {
              color: theme('colors.primary.500'),
              textUnderlineOffset: '4px',
              fontWeight: '500',
              textDecorationThickness: '2px',
              '&:hover': {
                color: theme('colors.primary.500'),
              },
            },
            /* Wowhead inline links should inherit flow */
            'a.inline': {
              textDecoration: 'none',
            },
            'h1,h2': {
              fontFamily: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif',
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontFamily: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif',
              fontWeight: '600',
            },
            'td, th': {
              fontVariantNumeric: 'tabular-nums',
            },
            code: {
              color: theme('colors.indigo.500'),
              wordWrap: 'break-word',
            },
            h1: {
              fontSize: '2rem',
              marginBottom: '0px',
              marginTop: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              '@media (min-width: theme("screens.sm"))': {
                marginLeft: '-2.2rem',
              },
            },
            'div > h1:first-child': {
              marginTop: '0px',
            },
            '.header-group': {
              marginBottom: '2rem',
            },
            h2: {
              marginTop: '15px',
              fontSize: '1.4rem',
              marginBottom: '15px',
              position: 'relative',
            },
            /* Consistent list spacing */
            'ul > li': {
              paddingLeft: '0.25em',
            },
            'ul > li::marker': {
              color: theme('colors.primary.500'),
            },
            'ol > li::marker': {
              color: theme('colors.primary.500'),
            },
            /* Consistent paragraph spacing inside list items */
            'li > p': {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
            /* Blockquote styling */
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              borderLeftWidth: '3px',
              fontStyle: 'normal',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
}
