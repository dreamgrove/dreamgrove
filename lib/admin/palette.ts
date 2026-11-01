// Colours and fonts for the admin editor's CodeMirror extensions, which style
// the editor from JS. React components use the matching Tailwind tokens from
// css/tailwind.css instead (ACCENT is `main`).

export const ACCENT = '#d57f43'

/** The toolbar's `:name[…]` text colours; also used for callouts and toggle links */
export const TEXT_COLORS = {
  red: '#e05555',
  orange: '#e0883f',
  yellow: '#e2c044',
  green: '#5fb760',
  blue: '#5b9bd5',
  purple: '#a77fdc',
} as const

export const MONO_FONT = 'Consolas, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace'
