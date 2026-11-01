'use client'

import type { ReactNode } from 'react'
import Dialog from '@/components/admin/ui/Dialog'
import { Kbd } from '@/components/admin/ui/Badges'

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[2px] bg-dg-panel px-1.5 py-0.5 font-mono text-[.8rem] text-dg-highlight">
      {children}
    </code>
  )
}

const SYNTAX: [string, ReactNode][] = [
  [
    'Spell tooltip',
    <>
      <Code>!8921|Moonfire!</Code> or <Code>!Moonfire!</Code>. Press <Kbd>Ctrl</Kbd>+
      <Kbd>Space</Kbd> to search spells while typing.
    </>,
  ],
  [
    'Coloured text',
    <>
      <Code>:red[text]</Code> or <Code>:#ff7d0a[text]</Code>
    </>,
  ],
  [
    'Conditional line',
    <>
      Start a line or list item with <Code>[*Incarnation]</Code> to show it only while that toggle
      is ticked. Combine with <Code>&amp;&amp;</Code>, negate with <Code>~</Code>.
    </>,
  ],
  [
    'Callouts',
    <>
      <Code>&gt; [!TIP]</Code> on the first line of a quote. Also NOTE, IMPORTANT, WARNING, CAUTION.
    </>,
  ],
  [
    'Components',
    <>
      Use <strong className="text-white">Component</strong> in the toolbar (<Kbd>Ctrl</Kbd>+
      <Kbd>/</Kbd>). Put the cursor inside an existing component’s opening tag and press{' '}
      <strong className="text-white">Edit</strong> (<Kbd>Ctrl</Kbd>+<Kbd>E</Kbd>) to change it in a
      form.
    </>,
  ],
  [
    'HTML & JSX',
    <>
      Any HTML works, written as JSX: <Code>className</Code> instead of <Code>class</Code>, and{' '}
      <Code>{'style={{ color: "red" }}'}</Code>.
    </>,
  ],
]

const SHORTCUTS: [string, string][] = [
  ['Ctrl+B', 'Bold'],
  ['Ctrl+I', 'Italic'],
  ['Ctrl+K', 'Link'],
  ['Ctrl+/', 'Insert component'],
  ['Ctrl+E', 'Edit component at cursor'],
  ['Ctrl+Space', 'Spell search'],
  ['Ctrl+S', 'Save changes'],
  ['Ctrl+F', 'Find & replace'],
]

export default function HelpDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title="Writing help" onClose={onClose} width="max-w-2xl">
      <dl className="m-0 grid grid-cols-1 gap-x-5 gap-y-4 text-[.88rem] leading-relaxed sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        {SYNTAX.map(([term, desc]) => (
          <div key={term} className="contents">
            <dt className="font-semibold text-white/85">{term}</dt>
            <dd className="m-0 -mt-3 text-white/60 sm:mt-0">{desc}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mt-7 mb-3 text-[.72rem] font-semibold tracking-[0.2em] text-white/40 uppercase">
        Shortcuts
      </h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-[.85rem] sm:grid-cols-2">
        {SHORTCUTS.map(([keys, label]) => (
          <div key={keys} className="flex items-center justify-between gap-3 text-white/60">
            <span>{label}</span>
            <span className="flex gap-1">
              {keys.split('+').map((part) => (
                <Kbd key={part}>{part}</Kbd>
              ))}
            </span>
          </div>
        ))}
      </div>
    </Dialog>
  )
}
