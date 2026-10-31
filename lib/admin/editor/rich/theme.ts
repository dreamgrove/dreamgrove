import { EditorView } from '@codemirror/view'
import { MONO_FONT } from '@/lib/admin/palette'
import { CALLOUTS } from './colors'
import { BOX_BORDER, BOX_FILL } from './boxes'

// --- Theme ---------------------------------------------------------------------

const SANS = "'familiar-pro', ui-sans-serif, system-ui, sans-serif"
const DISPLAY = "'thiccboi', 'familiar-pro', ui-sans-serif, system-ui, sans-serif"
const MONO = MONO_FONT

export const richTheme = EditorView.theme({
  '&.cm-editor .cm-content': {
    fontFamily: SANS,
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#e9e4dc',
    padding: '18px 0 40vh',
  },
  '&.cm-editor .cm-line': { padding: '0 28px' },
  '&.cm-editor .cm-activeLine': { backgroundColor: 'transparent' },

  // Headings
  '& .cm-line.cm-rt-h1, & .cm-line.cm-rt-h2, & .cm-line.cm-rt-h3, & .cm-line.cm-rt-h4, & .cm-line.cm-rt-h5, & .cm-line.cm-rt-h6':
    { fontFamily: DISPLAY, color: '#ffffff', fontWeight: '700', lineHeight: '1.35' },
  '& .cm-line.cm-rt-h1': { fontSize: '1.85em', paddingTop: '.5em' },
  '& .cm-line.cm-rt-h2': { fontSize: '1.5em', paddingTop: '.45em' },
  '& .cm-line.cm-rt-h3': { fontSize: '1.25em', paddingTop: '.35em' },
  '& .cm-line.cm-rt-h4': { fontSize: '1.1em', paddingTop: '.25em' },
  '& .cm-line.cm-rt-h5, & .cm-line.cm-rt-h6': { fontSize: '1em', color: 'rgba(255,255,255,.8)' },
  '& .cm-line.cm-rt-setext': { fontSize: '.7em', color: 'rgba(255,255,255,.25)' },
  // The base highlighter colours heading text orange; keep it white here
  '& .cm-line[class*="cm-rt-h"] span:not(.cm-spell-token):not(.cm-rt-link):not([style])': {
    color: '#ffffff',
  },

  '& .cm-rt-strong:not([style]), & .cm-rt-strong span:not(.cm-spell-token):not(.cm-rt-link):not([style])':
    {
      fontWeight: '700',
      color: '#ffffff',
    },
  '& .cm-rt-em:not([style]), & .cm-rt-em span:not(.cm-spell-token):not(.cm-rt-link):not([style])': {
    fontStyle: 'italic',
    color: '#e9e4dc',
  },
  // Same box as the condition pills it often sits beside
  '.cm-spell-token': { display: 'inline-block', lineHeight: '1.33', verticalAlign: '1px' },
  // A spell token opened for editing: plain source, sized like the token
  '& .cm-spell-editing, & .cm-spell-editing span': {
    fontFamily: MONO,
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#ffb86c',
  },
  '.cm-rt-underline': { textDecoration: 'underline', textUnderlineOffset: '3px' },
  '.cm-rt-strike': { textDecoration: 'line-through' },
  '.cm-rt-sup': { verticalAlign: 'super', fontSize: '.75em' },
  '.cm-rt-sub': { verticalAlign: 'sub', fontSize: '.75em' },
  '.cm-rt-small': { fontSize: '.85em' },
  '.cm-rt-highlight': { backgroundColor: 'rgba(226,192,68,.25)' },
  '.cm-rt-colored, .cm-rt-colored *': { color: 'inherit' },
  // `[…]` of a colour directive reads as a link label to the MDX highlighter
  '& .cm-rt-colored span:not(.cm-rt-link):not(.cm-rt-underline)': { textDecoration: 'none' },
  '.cm-rt-code, .cm-rt-kbd': {
    fontFamily: MONO,
    fontSize: '.86em',
    backgroundColor: '#2c2c2c',
    border: '1px solid #3a3a3a',
    borderRadius: '3px',
    padding: '1px 4px',
  },
  '.cm-rt-link': {
    color: '#ffb86c',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255,184,108,.45)',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
  },
  '.cm-rt-link *': { color: 'inherit', textDecoration: 'none' },

  // Lists and quotes
  '.cm-rt-bullet': {
    display: 'inline-block',
    width: '1.1em',
    color: '#ffb86c',
    fontWeight: '700',
  },
  '.cm-rt-olmark': { color: '#ffb86c', fontWeight: '600' },
  '& .cm-line.cm-rt-quote': { color: 'rgba(233,228,220,.75)' },
  ...Object.fromEntries(
    Object.entries(CALLOUTS).map(([k, c]) => [
      `& .cm-line.cm-rt-callout-${k}`,
      { '--rt-callout': c },
    ])
  ),
  '.cm-rt-callout-head': {
    padding: '4px 0 0 16px',
    borderLeft: '3px solid var(--rt-callout)',
    backgroundColor: 'color-mix(in srgb, var(--rt-callout) 9%, transparent)',
    color: 'var(--rt-callout)',
    fontWeight: '700',
    fontSize: '.8em',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    lineHeight: '22px',
    cursor: 'pointer',
  },
  // `> [!TIP]` while its source is revealed: compact, like the header it replaces
  '& .cm-line.cm-rt-callout-src, & .cm-line.cm-rt-callout-src span': {
    fontFamily: MONO,
    fontSize: '12px',
    color: 'var(--rt-callout, rgba(255,255,255,.6))',
    textDecoration: 'none',
  },
  '.cm-rt-callout-label': {
    color: 'var(--rt-callout)',
    fontWeight: '700',
    fontSize: '.8em',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },

  // Line backgrounds (code, boxes) would hide CodeMirror's selection layer,
  // which sits behind the content, leaving only the theme's native highlight
  // on the text itself. Draw the (translucent) selection above instead.
  '& .cm-scroller > .cm-selectionLayer': { zIndex: '2 !important', pointerEvents: 'none' },
  // Out-specifies the theme's `.cm-content ::selection` rule
  '& .cm-content .cm-line ::selection, & .cm-content .cm-line::selection': {
    background: 'transparent !important',
  },

  // Code and tables stay as source
  '& .cm-line.cm-rt-codeblock': { fontFamily: MONO, fontSize: '13px' },
  '& .cm-line.cm-rt-fence': { color: 'rgba(255,255,255,.3)' },
  '& .cm-line.cm-rt-table': { fontFamily: MONO, fontSize: '13px', color: 'rgba(233,228,220,.85)' },

  // Small inline pills
  '.cm-rt-tag, .cm-rt-br': {
    display: 'inline-block',
    fontFamily: MONO,
    fontSize: '11px',
    lineHeight: '17px',
    padding: '0 6px',
    margin: '0 2px',
    borderRadius: '3px',
    verticalAlign: '1px',
    cursor: 'pointer',
    color: 'rgba(255,255,255,.4)',
    border: '1px solid #3a3a3a',
  },
  // Split condition: a filled `if`, then names with operator words between
  '.cm-rt-cond': {
    '--rt-c': 'var(--rt-color, #C5E6A6)',
    display: 'inline-flex',
    alignItems: 'stretch',
    maxWidth: '100%',
    margin: '0 2px',
    border: '1px solid color-mix(in srgb, var(--rt-c) 55%, transparent)',
    borderRadius: '3px',
    overflow: 'hidden',
    fontFamily: SANS,
    fontSize: '12px',
    lineHeight: '17px',
    verticalAlign: '1px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  '.cm-rt-cond-if': {
    padding: '0 5px',
    backgroundColor: 'var(--rt-c)',
    color: '#141414',
    fontWeight: '700',
  },
  '.cm-rt-cond-name': {
    padding: '0 6px',
    color: 'var(--rt-c)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.cm-rt-cond-op': {
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    fontSize: '9.5px',
    fontWeight: '700',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'color-mix(in srgb, var(--rt-c) 70%, #8a8a8a)',
    backgroundColor: 'color-mix(in srgb, var(--rt-c) 8%, transparent)',
    borderLeft: '1px solid color-mix(in srgb, var(--rt-c) 30%, transparent)',
    borderRight: '1px solid color-mix(in srgb, var(--rt-c) 30%, transparent)',
  },
  '.cm-rt-cond-if + .cm-rt-cond-op': { borderLeft: 'none' },
  // Inside a card's header row the chip sits on the row's centre line
  '.cm-rt-card-head > .cm-rt-cond, .cm-rt-wrap-head > .cm-rt-cond, .cm-rt-card-summary > .cm-rt-cond':
    {
      flexShrink: '0',
      alignSelf: 'center',
      margin: '0',
      verticalAlign: 'baseline',
    },
  '.cm-rt-swatch': {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    backgroundColor: 'var(--rt-color)',
    verticalAlign: '-1px',
    margin: '0 4px',
    cursor: 'pointer',
  },
  '.cm-rt-tagline': { lineHeight: '20px', cursor: 'pointer' },
  '.cm-rt-tagline .cm-rt-tag': { margin: 0 },
  '.cm-rt-hr': { height: '1px', backgroundColor: '#3a3a3a' },

  // Component cards
  '.cm-rt-card, .cm-rt-wrap-head': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 6px 6px 14px',
    backgroundColor: '#262626',
    border: '1px solid #3a3a3a',
    borderRadius: '4px',
    fontFamily: SANS,
    fontSize: '13.5px',
    lineHeight: '1.4',
    cursor: 'pointer',
    transition: 'border-color .12s',
  },
  '.cm-rt-card:hover, .cm-rt-wrap-head:hover': { borderColor: '#565656' },
  // Field card: the header row over the block's own contents
  '.cm-rt-card.cm-rt-block': { display: 'block', padding: '0' },
  '.cm-rt-card-head': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 6px 6px 14px',
  },
  '.cm-rt-card-body': {
    borderTop: '1px solid #333',
    padding: '9px 14px 10px',
  },
  // One row: short values take their own width, the wide one gets the rest
  '.cm-rt-fields': { display: 'flex', gap: '24px' },
  '.cm-rt-field': { display: 'flex', flexDirection: 'column', minWidth: '0', flex: '0 0 auto' },
  '.cm-rt-field-wide': { flex: '1 1 0' },
  '.cm-rt-field-label': { fontSize: '11.5px', color: 'rgba(255,255,255,.45)' },
  '.cm-rt-field-value': {
    color: 'rgba(255,255,255,.85)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '.cm-rt-field-mono': { fontFamily: MONO, fontSize: '12.5px' },
  // A share code on its own would run the full card width; cap it (the full
  // value stays in the tooltip)
  '.cm-rt-field:only-child > .cm-rt-field-mono': { maxWidth: '40ch' },
  '.cm-rt-steps': { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' },
  '.cm-rt-step': {
    border: '1px solid #444',
    borderRadius: '3px',
    padding: '0 6px',
    lineHeight: '20px',
    color: 'rgba(255,255,255,.85)',
  },
  '.cm-rt-step-count': { marginLeft: '4px', fontSize: '11.5px', color: 'rgba(255,255,255,.45)' },
  '.cm-rt-step-arrow': { color: 'rgba(255,255,255,.3)' },
  '.cm-rt-wrap-head': {
    paddingLeft: '8px',
    backgroundColor: '#2a2621',
    borderRadius: '4px 4px 0 0',
  },
  '.cm-rt-wrap-head.cm-rt-folded': { borderRadius: '4px' },
  '.cm-rt-wrap-head.cm-rt-block': { display: 'block', padding: '0' },
  '.cm-rt-body-label': {
    borderTop: '1px dashed #3a3a3a',
    padding: '5px 14px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,.4)',
  },
  // Hero talent sections: the tree's colour on the header, edges and badge
  '.cm-rt-wrap-head.cm-rt-tinted': {
    borderColor: `color-mix(in srgb, var(--rt-hue) 55%, ${BOX_BORDER})`,
    backgroundColor: 'color-mix(in srgb, var(--rt-hue) 16%, #232323)',
  },
  '.cm-rt-wrap-head.cm-rt-tinted:hover': { borderColor: 'var(--rt-hue)' },
  '.cm-rt-wrap-foot.cm-rt-tinted': {
    borderColor: `color-mix(in srgb, var(--rt-hue) 55%, ${BOX_BORDER})`,
    backgroundColor: 'color-mix(in srgb, var(--rt-hue) 6%, transparent)',
  },
  // The tree colours are dark; lift them so the badge text stays readable
  '.cm-rt-tinted .cm-rt-badge': {
    color: 'color-mix(in srgb, var(--rt-hue) 55%, #fff)',
    backgroundColor: 'color-mix(in srgb, var(--rt-hue) 35%, transparent)',
  },
  // The 28px hit area leaves ~8px of air around the icon; pull the badge in
  // so the chevron sits evenly between the border and the badge
  '.cm-rt-wrap-head > .cm-rt-btn:first-child': { marginRight: '-4px' },
  '.cm-rt-wrap-head > .cm-rt-btn:first-child svg': { transition: 'transform .12s' },
  '.cm-rt-folded > .cm-rt-btn:first-child svg': { transform: 'rotate(-90deg)' },
  '.cm-rt-badge': {
    flexShrink: '0',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: 'var(--rt-hue, #ffb86c)',
    backgroundColor: 'color-mix(in srgb, var(--rt-hue, #d57f43) 15%, transparent)',
    borderRadius: '3px',
    // Caps-only text: a tight line box with a touch more padding on top
    // keeps the letters optically centred
    lineHeight: '1',
    padding: '5px 8px 4px',
  },
  '.cm-rt-card-summary': {
    minWidth: '0',
    flex: '1',
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    color: 'rgba(255,255,255,.85)',
  },
  '.cm-rt-card-title': {
    flexShrink: '0',
    maxWidth: '60%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  // Sits beside the title and takes whatever room is left
  '.cm-rt-card-desc': {
    minWidth: '0',
    fontSize: '12.5px',
    color: 'rgba(255,255,255,.55)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Tables
  '.cm-rt-table-wrap': {
    position: 'relative',
    overflowX: 'auto',
    border: '1px solid #3a3a3a',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  '.cm-rt-table-wrap:hover': { borderColor: '#565656' },
  '.cm-rt-table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  '.cm-rt-table th, .cm-rt-table td': {
    padding: '6px 12px',
    textAlign: 'left',
    verticalAlign: 'top',
    borderBottom: '1px solid #333',
  },
  '.cm-rt-table th': { backgroundColor: '#262626', color: '#fff', fontWeight: '700' },
  '.cm-rt-cell': { cursor: 'text', outline: 'none' },
  '.cm-rt-cell:hover': { backgroundColor: 'rgba(255,255,255,.03)' },
  '.cm-rt-cell.cm-rt-cell-active': {
    boxShadow: 'inset 0 0 0 1px #5b9bd5',
    backgroundColor: 'rgba(91,155,213,.08)',
  },
  '.cm-rt-cell .cm-spell-token, .cm-rt-cell .cm-rt-cond': { userSelect: 'all' },
  '.cm-rt-cell-active .cm-rt-link': { cursor: 'pointer' },
  '.cm-rt-cell.cm-rt-cell-editing': {
    fontFamily: MONO,
    fontSize: '13px',
    fontWeight: '400',
    whiteSpace: 'pre-wrap',
    boxShadow: 'inset 0 0 0 1px #5b9bd5',
    backgroundColor: 'rgba(91,155,213,.08)',
  },
  '.cm-rt-table tr:last-child td': { borderBottom: 'none' },
  '.cm-rt-table-actions': {
    position: 'absolute',
    top: '3px',
    right: '3px',
    opacity: '0',
    backgroundColor: '#262626',
    borderRadius: '3px',
    transition: 'opacity .12s',
  },
  '.cm-rt-table-wrap:hover .cm-rt-table-actions': { opacity: '1' },
  '.cm-rt-card-actions': { display: 'flex', gap: '2px', flexShrink: '0' },
  '.cm-rt-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '3px',
    color: 'rgba(255,255,255,.5)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  '.cm-rt-btn:hover': { color: '#fff', backgroundColor: '#3a3a3a' },
  '.cm-rt-card-thumb': { width: '48px', height: '27px', objectFit: 'cover', borderRadius: '2px' },
  '.cm-rt-wrap-foot': {
    height: '10px',
    border: `1px solid ${BOX_BORDER}`,
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    backgroundColor: BOX_FILL,
    cursor: 'pointer',
  },
  '.cm-rt-image-thumb': {
    width: '56px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '2px',
    backgroundColor: '#1a1a1a',
  },
  '.cm-rt-image .cm-rt-card-summary': { display: 'flex', flexDirection: 'column' },
  '.cm-rt-image-src': { fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,.4)' },
  '.cm-rt-chip': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '0 6px 0 2px',
    margin: '0 1px',
    border: '1px solid rgba(213,127,67,.4)',
    borderRadius: '3px',
    fontSize: '.85em',
    lineHeight: '1.5',
    verticalAlign: '1px',
    color: 'rgba(255,255,255,.85)',
    cursor: 'pointer',
  },
  '.cm-rt-chip .cm-rt-btn': { width: '20px', height: '20px', margin: '0 -4px 0 -2px' },
  // Segmented chip (toggles, Wowhead links): tinted type segment, name, muted id
  '.cm-rt-chip.cm-rt-seg': {
    alignItems: 'stretch',
    gap: '0',
    padding: '0',
    overflow: 'hidden',
    border: '1px solid #4a4a4a',
    backgroundColor: '#2a2a2a',
    // The chip opens its form, but reads as a label rather than a control
    cursor: 'default',
  },
  '.cm-rt-seg-type': {
    display: 'flex',
    alignItems: 'center',
    padding: '0 6px',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: 'var(--rt-hue, #ffb86c)',
    backgroundColor: 'color-mix(in srgb, var(--rt-hue, #d57f43) 16%, transparent)',
  },
  '.cm-rt-seg-name': { padding: '0 7px', color: '#fff', fontWeight: '600' },
  '.cm-rt-seg-detail': {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '7px',
    fontFamily: MONO,
    fontSize: '11.5px',
    color: 'rgba(255,255,255,.45)',
  },
  '.cm-rt-seg .cm-rt-btn': { height: 'auto', margin: '0 2px 0 -4px' },
  '.cm-rt-seg-icon': { padding: '0 6px' },
  '.cm-rt-seg-icon svg': { display: 'block' },
  '.cm-rt-gapcursor': {
    position: 'absolute',
    height: '2px',
    backgroundColor: '#e9e4dc',
    pointerEvents: 'none',
    animation: 'cm-rt-gap-blink 1.2s steps(1) infinite',
  },
  '.cm-scroller.cm-rt-gap .cm-cursorLayer': { display: 'none' },
  '@keyframes cm-rt-gap-blink': { '50%': { opacity: '0' } },
  '.cm-rt-links': {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    overflow: 'visible',
    pointerEvents: 'none',
  },
  '.cm-rt-image-inline': { height: '1.4em', verticalAlign: 'middle' },
})
