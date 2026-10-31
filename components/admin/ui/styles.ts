// Tailwind class strings shared by the admin editor's chrome

const FIELD =
  'w-full rounded-md border border-[#3d3d3d] bg-[#1c1c1c] px-3 text-[.875rem] text-[#f5f5f5] placeholder-[#7a7a7a] focus:border-[#d57f43] focus:ring-0 focus:outline-none'
export const INPUT = `${FIELD} h-[38px] py-0`
export const TEXTAREA = `${FIELD} block resize-y py-2.5 leading-relaxed`
export const LABEL = 'mb-1.5 block text-[.8125rem] font-semibold text-[#d4d4d4]'
export const HELP = 'text-[.75rem] leading-snug text-[#8a8a8a]'
export const BTN_GHOST =
  'inline-flex items-center gap-2 rounded-xs px-3 py-2 text-[.88rem] font-semibold text-white/60 transition-colors hover:bg-[#2a2a2a] hover:text-white disabled:opacity-40'
export const BTN_OUTLINE =
  'inline-flex items-center gap-2 rounded-md border border-[#525252] px-3.5 py-[7px] text-[.875rem] font-medium text-[#e5e5e5] transition-colors hover:bg-[#2e2e2e] disabled:opacity-40'
export const BTN_PRIMARY =
  'inline-flex items-center gap-2 rounded-md bg-[#d57f43] px-4 py-[7px] text-[.875rem] font-medium text-white transition-colors hover:bg-[#c06f37] disabled:opacity-50'
export const CHECKBOX =
  'h-4 w-4 rounded-[4px] border-[#525252] bg-[#1c1c1c] text-[#d57f43] focus:ring-0 focus:ring-offset-0'
/** Square icon-only link/button with a border, e.g. "Open live page" */
export const BTN_ICON =
  'flex h-9 w-9 items-center justify-center rounded-xs border border-[#3a3a3a] text-white/60 transition-colors hover:text-white'
