'use client'

import { useEffect, useLayoutEffect, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { IconType } from 'react-icons'
import {
  FaArrowLeft,
  FaBold,
  FaChevronDown,
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaMagic,
  FaPen,
  FaPlus,
  FaQuoteRight,
  FaRegQuestionCircle,
  FaSearch,
  FaStrikethrough,
  FaSyncAlt,
  FaTimes,
  FaUpload,
} from 'react-icons/fa'
import { MdHorizontalRule, MdOutlineFormatColorText, MdWrapText } from 'react-icons/md'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { FiPlusCircle } from 'react-icons/fi'

// Shared look for the editor chrome

export const ACCENT = '#d57f43'

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

/**
 * Dropdown list for an input inside a Dialog.
 */
export function Popover({
  anchor,
  children,
  role = 'listbox',
}: {
  anchor: RefObject<HTMLElement | null>
  children: ReactNode
  role?: string
}) {
  const [pos, setPos] = useState<{
    left: number
    width: number
    top?: number
    bottom?: number
    maxHeight: number
  } | null>(null)

  useLayoutEffect(() => {
    const place = () => {
      const el = anchor.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const gap = 4
      const margin = 8
      const below = window.innerHeight - r.bottom - gap - margin
      const above = r.top - gap - margin
      const up = below < 200 && above > below
      setPos({
        left: r.left,
        width: r.width,
        ...(up ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
        maxHeight: Math.min(256, up ? above : below),
      })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [anchor])

  if (!pos) return null
  return createPortal(
    <ul
      role={role}
      style={pos}
      className="fixed z-[60] m-0 list-none overflow-auto overscroll-contain rounded-md border border-[#383838] bg-[#2a2a2a] p-1 shadow-xl"
    >
      {children}
    </ul>,
    document.body
  )
}

export function Dialog({
  title,
  subtitle,
  eyebrow,
  onClose,
  children,
  footer,
  width = 'max-w-xl',
  height = '',
  bodyClassName = 'px-[22px] pt-5 pb-6',
  dismissable = true,
}: {
  title: ReactNode
  subtitle?: ReactNode
  /** Small breadcrumb line above the title */
  eyebrow?: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
  /** Fixed height class, so the dialog doesn't jump around as its content changes */
  height?: string
  bodyClassName?: string
  dismissable?: boolean
}) {
  useEffect(() => {
    if (!dismissable) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, dismissable])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 sm:items-center"
      onMouseDown={(e) => dismissable && e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`flex max-h-[calc(100dvh-5rem)] w-full ${width} ${height} flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#232323] text-[#f5f5f5] shadow-[0_20px_60px_rgba(0,0,0,.5)]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#383838] px-[22px] pt-4 pb-[18px]">
          <div className="flex min-w-0 flex-col gap-1">
            {eyebrow && (
              <div className="flex items-center gap-1.5 text-[.75rem] text-[#8a8a8a]">
                {eyebrow}
              </div>
            )}
            <h2 className="m-0 text-[1.25rem] font-bold text-white">{title}</h2>
            {subtitle && <p className="m-0 text-[.875rem] text-[#a3a3a3]">{subtitle}</p>}
          </div>
          {dismissable && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-0.5 -mr-2 rounded-md p-2 text-[#8a8a8a] transition-colors hover:bg-[#2e2e2e] hover:text-white"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#383838] px-[22px] py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

const ICONS = {
  back: FaArrowLeft,
  close: FaTimes,
  plus: FaPlus,
  plusCircle: FiPlusCircle,
  bold: FaBold,
  italic: FaItalic,
  strike: FaStrikethrough,
  code: FaCode,
  link: FaLink,
  list: FaListUl,
  olist: FaListOl,
  quote: FaQuoteRight,
  rule: MdHorizontalRule,
  color: MdOutlineFormatColorText,
  spell: FaMagic,
  wrap: MdWrapText,
  help: FaRegQuestionCircle,
  chevron: FaChevronDown,
  edit: FaPen,
  refresh: FaSyncAlt,
  external: FaExternalLinkAlt,
  details: BsLayoutSidebarInsetReverse,
  search: FaSearch,
  upload: FaUpload,
  github: FaGithub,
} satisfies Record<string, IconType>

export type IconName = keyof typeof ICONS

// Material and Bootstrap glyphs carry their own padding; Font Awesome ones fill
// the box edge to edge, so they're drawn smaller to look the same size
const PADDED: ReadonlySet<IconName> = new Set(['rule', 'color', 'wrap', 'details', 'plusCircle'])
const FA_SCALE = 0.75

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const Glyph = ICONS[name]
  return (
    <span
      aria-hidden
      className="inline-flex flex-shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Glyph size={PADDED.has(name) ? size : Math.round(size * FA_SCALE)} />
    </span>
  )
}
