'use client'

import { useMemo } from 'react'
import { Kbd } from '@/components/admin/ui/Badges'

/** Words of prose in an MDX body: tags, spell ids and markup left out */
function countWords(text: string) {
  const prose = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/!(\d+\|)?([^!\n]+)!/g, '$2')
    .replace(/[#>*_`~[\]()|-]/g, ' ')
  return (prose.match(/[A-Za-z0-9À-￿']+/g) ?? []).length
}

export default function StatusBar({
  line,
  col,
  text,
}: {
  line: number
  col: number
  text: string
}) {
  const words = useMemo(() => countWords(text), [text])
  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t border-dg-line bg-dg-panel-deep px-3 py-1 text-[.74rem] text-white/40 tabular-nums">
      <span className="flex gap-3 whitespace-nowrap">
        <span>
          Ln {line}, Col {col}
        </span>
        <span>{words.toLocaleString('en-US')} words</span>
      </span>
      <span className="hidden truncate sm:inline">
        <Kbd>Ctrl</Kbd>+<Kbd>/</Kbd> component · <Kbd>Ctrl</Kbd>+<Kbd>Space</Kbd> spell
      </span>
    </div>
  )
}
