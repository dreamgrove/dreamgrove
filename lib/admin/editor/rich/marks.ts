// Tables shared by the rich-mode build passes

export const INLINE_COMPONENTS = new Set(['checkbox', 'wowhead'])

export const MARK_CLASS: Record<string, string> = {
  b: 'cm-rt-strong',
  strong: 'cm-rt-strong',
  summary: 'cm-rt-strong',
  i: 'cm-rt-em',
  em: 'cm-rt-em',
  u: 'cm-rt-underline',
  ins: 'cm-rt-underline',
  s: 'cm-rt-strike',
  del: 'cm-rt-strike',
  strike: 'cm-rt-strike',
  sup: 'cm-rt-sup',
  sub: 'cm-rt-sub',
  kbd: 'cm-rt-kbd',
  code: 'cm-rt-code',
  mark: 'cm-rt-highlight',
  small: 'cm-rt-small',
  a: 'cm-rt-link',
}

export const CALLOUT_RE = /^(\s*>\s?)(\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\])/i
