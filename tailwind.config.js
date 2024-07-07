// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontSize: {
        base: '1rem',
        sm: '0.9rem',
        lg: '1.1rem',
      },
      fontFamily: {
        sans: ['thiccboi', ...fontFamily.sans],
        thiccboi: ['thiccboi', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#d57f43', // Replace with your custom color
          600: '#d57f43', // Optional: dark variant
          light: '#d57f43', // Optional: light variant
        },
        gray: colors.gray,
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              textUnderlineOffset: '4px',
              fontWeight: '500',
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
            h1: {
              marginBottom: '0px',
              marginTop: '50px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              '@screen sm': {
                marginLeft: '-2.6rem',
              },
            },
            h2: {
              marginTop: '25px',
              marginBottom: '10px',
              position: 'relative',
            },
            'h2::after': {
              content: '""',
              display: 'block',
              width: '50px',
              height: '3px',
              backgroundColor: '#d57f43',
              marginTop: '0px',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
