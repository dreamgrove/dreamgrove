import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { languages } from '@codemirror/language-data'
import { tags as t } from '@lezer/highlight'
import { darculaInit } from '@uiw/codemirror-theme-darcula'
import { MONO_FONT } from '@/lib/admin/palette'
import markdownExtension from './markdownExtension'

// Look and language of the MDX source editor. Module scope, so the editor's
// extension list stays referentially stable across renders.

const highlightStyle = HighlightStyle.define([
  { tag: t.heading, fontWeight: 'bold', color: '#ffb86c' },
  { tag: t.link, textDecoration: 'underline' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.bool, fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.comment, fontStyle: 'italic' },
  // Node types defined by markdownExtension
  { tag: t.processingInstruction, color: '#FFFFFF', fontWeight: 'bold' }, // CustomInlineMark
  { tag: t.bool, color: '#d79a59' }, // CustomInlineElement
  { tag: t.operator, color: '#C5E6A6' }, // CustomInlineOperator
  { tag: t.special(t.content), color: '#ffb86c', fontWeight: 'bold' }, // ExclamationMark
  { tag: t.emphasis, color: '#cc8800' }, // ExclamationMarkPrimary
  { tag: t.strong, color: '#ffb86c', fontWeight: 'bold' }, // ExclamationMarkSecondary
  { tag: t.separator, color: '#AAAAAA' }, // ExclamationMarkSeparator
])

const baseTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    height: '100%',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-content': {
    fontFamily: MONO_FONT,
    padding: '14px 0 40vh',
    color: '#FFF5E4',
    lineHeight: '1.6',
  },
  '.cm-line': {
    padding: '0 16px 0 10px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  '.cm-gutters': {
    backgroundColor: '#1f1f1f',
    color: 'rgba(255,255,255,0.22)',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255,255,255,0.035)',
    color: 'rgba(255,255,255,0.6)',
  },
  '.cm-scroller': {
    scrollbarWidth: 'thin',
    scrollbarColor: '#4a4a4a transparent',
  },
  '.cm-spell-token': {
    color: '#ffb86c',
    fontWeight: 'normal',
    fontSize: '0.85em',
    border: '1px solid rgba(255,184,108,0.5)',
    borderRadius: '3px',
    padding: '0 3px',
    cursor: 'default',
    textDecoration: 'none',
  },
})

/** Syntax highlighting, base styles and the MDX language (markdown + JSX) */
export const mdxLanguage = [
  syntaxHighlighting(highlightStyle),
  baseTheme,
  markdown({
    base: markdownLanguage,
    codeLanguages: languages,
    addKeymap: true,
    extensions: [markdownExtension],
    htmlTagLanguage: javascript({ jsx: true }),
  }),
]

/** Passed as CodeMirror's `theme` prop */
export const editorTheme = darculaInit({
  settings: {
    background: '#1f1f1f',
    gutterBackground: '#1f1f1f',
    caret: '#ffb86c',
    selection: 'rgba(213,127,67,0.28)',
    selectionMatch: 'rgba(213,127,67,0.14)',
    lineHighlight: 'rgba(255,255,255,0.035)',
  },
  styles: [
    { tag: t.tagName, color: '#B0DAF1' },
    { tag: t.attributeName, color: '#C5E6A6' },
    { tag: t.attributeValue, color: '#ffb86c' },
    { tag: t.operator, color: '#989898' },
  ],
})
