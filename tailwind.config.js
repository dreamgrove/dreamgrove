// @ts-check

export const content = [
  './node_modules/pliny/**/*.js',
  './app/**/*.{js,ts,jsx,tsx}',
  './pages/**/*.{js,ts,tsx}',
  './components/**/*.{js,ts,tsx}',
  './layouts/**/*.{js,ts,tsx}',
  './data/**/*.mdx',
  './plugins/**/*.js',
]
export const darkMode = 'class'
export const theme = {
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
      sans: ['thiccboi', 'magnificent'],
      thiccboi: ['thiccboi', 'sans-serif'],
      magnificent: ['magnificent', 'sans-serif'],
      'familiar-pro': ['familiar-pro', 'sans-serif'],
    },
    colors: {
      primary: {
        500: '#d57f43', // Replace with your custom color
        600: '#d57f43', // Optional: dark variant
        light: '#d57f43', // Optional: light variant
      },
      main: '#d57f43',
      secondary: '#1a9c82',
    },
    typography: ({ theme }) => ({
      DEFAULT: {
        css: {
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
            wordWrap: 'break-word',
          },
          h1: {
            fontSize: '2rem',
            marginBottom: '0px',
            marginTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            '@screen sm': {
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
}
