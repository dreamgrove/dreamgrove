'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { EditorView } from '@codemirror/view'
import { replaceRange } from '@/lib/admin/editor/commands'
import type { LinkAnchor } from '@/lib/admin/editor/rich/types'
import Icon from '@/components/Icon'
import { BTN_GHOST, BTN_ICON, BTN_PRIMARY, INPUT, LABEL } from '@/components/admin/ui/styles'

const LINK_RE = /^\[([\s\S]*)\]\(\s*(\S*?)(\s+"[^"]*")?\s*\)$/

/**
 * Inline editor for a markdown link in rich mode. `from`–`to` is either an
 * existing `[text](url)` or plain selected text.
 */
export default function LinkPopover({
  view,
  from,
  to,
  at,
  onClose,
}: {
  view: EditorView
  from: number
  to: number
  /** Where the rendered link was for links without text of their own (e.g. tables) */
  at?: LinkAnchor
  onClose: () => void
}) {
  const raw = view.state.sliceDoc(from, to)
  const parsed = LINK_RE.exec(raw)
  const isLink = !!parsed
  const [text, setText] = useState(parsed ? parsed[1] : raw)
  const [url, setUrl] = useState(parsed ? parsed[2] : '')
  const title = parsed?.[3] ?? ''
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    const place = () => {
      const scrolled = at ? view.scrollDOM.scrollTop - at.scrollTop : 0
      const c = at ? { left: at.left, bottom: at.bottom - scrolled } : view.coordsAtPos(from)
      if (!c) return onClose()
      const width = 340
      setPos({
        left: Math.max(8, Math.min(c.left, window.innerWidth - width - 8)),
        top: Math.min(c.bottom + 6, window.innerHeight - 200),
      })
    }
    place()
    const scroller = view.scrollDOM
    scroller.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      scroller.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [view, from, at, onClose])

  useEffect(() => {
    if (!isLink) urlRef.current?.focus()
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [isLink, onClose])

  const save = () => {
    const label = text.trim() || url.trim()
    if (!url.trim()) return
    replaceRange(view, from, to, `[${label}](${url.trim()}${title})`)
    onClose()
  }

  const unlink = () => {
    replaceRange(view, from, to, text)
    onClose()
  }

  if (!pos) return null
  return createPortal(
    <div
      ref={boxRef}
      role="dialog"
      aria-label={isLink ? 'Edit link' : 'Add link'}
      style={{ left: pos.left, top: pos.top, width: 340 }}
      className="fixed z-[60] rounded-xs border border-[#3a3a3a] bg-[#2a2a2a] p-3 shadow-xl"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
          view.focus()
        } else if (e.key === 'Enter') {
          e.preventDefault()
          save()
        }
      }}
    >
      <label className="block">
        <span className={LABEL}>Text</span>
        <input className={INPUT} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label className="mt-3 block">
        <span className={LABEL}>URL</span>
        <input
          ref={urlRef}
          className={`${INPUT} font-mono text-[.85rem]`}
          value={url}
          placeholder="https://… or /blog/…"
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <div className="mt-3 flex items-center gap-2">
        {isLink && (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open link"
              aria-label="Open link"
              className={BTN_ICON}
            >
              <Icon box name="external" size={14} />
            </a>
            <button type="button" onClick={unlink} className={`${BTN_GHOST} h-9`}>
              Remove link
            </button>
          </>
        )}
        <span className="flex-1" />
        <button
          type="button"
          onClick={save}
          disabled={!url.trim()}
          className={`${BTN_PRIMARY} h-9`}
        >
          {isLink ? 'Update' : 'Add link'}
        </button>
      </div>
    </div>,
    document.body
  )
}
