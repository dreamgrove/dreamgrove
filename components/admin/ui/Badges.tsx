import type { ReactNode } from 'react'

/** Small uppercase tag, e.g. "Draft" next to a page title */
export function Badge({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`flex-shrink-0 rounded-xs border px-1.5 py-px text-[.68rem] font-semibold tracking-wider uppercase ${
        accent ? 'border-[#d57f43]/50 text-[#ffb86c]' : 'border-white/20 text-white/60'
      }`}
    >
      {children}
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-[2px] border border-[#3a3a3a] bg-[#262626] px-1 font-sans text-[.7rem] text-white/50">
      {children}
    </kbd>
  )
}
