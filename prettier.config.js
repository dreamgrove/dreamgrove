module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind 4 keeps the theme in CSS, so the class sorter needs the stylesheet
  tailwindStylesheet: './css/tailwind.css',
}
