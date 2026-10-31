'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { EditorView } from '@codemirror/view'
import type { TagMatch } from './mdxBlocks'
import {
  insertLink,
  insertRule,
  setHeading,
  toggleInline,
  toggleLinePrefix,
} from './editorCommands'
import { Icon, type IconName } from './ui'

const TEXT_COLORS = [
  { name: 'red', swatch: '#e05555' },
  { name: 'orange', swatch: '#e0883f' },
  { name: 'yellow', swatch: '#e2c044' },
  { name: 'green', swatch: '#5fb760' },
  { name: 'blue', swatch: '#5b9bd5' },
  { name: 'purple', swatch: '#a77fdc' },
]

const HEADINGS = ['Body', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4']

function Divider() {
  return <span className="mx-1 h-5 w-px flex-shrink-0 bg-[#3a3a3a]" aria-hidden />
}

function ToolButton({
  icon,
  label,
  shortcut,
  onClick,
  active,
  children,
}: {
  icon?: IconName
  label: string
  shortcut?: string
  onClick: () => void
  active?: boolean
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      // Keeps the editor selection while clicking
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 flex-shrink-0 items-center gap-1.5 rounded-xs px-2 text-[.84rem] font-semibold transition-colors ${
        active
          ? 'bg-[#d57f43]/20 text-[#ffb86c]'
          : 'text-white/60 hover:bg-[#2a2a2a] hover:text-white'
      }`}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
    </button>
  )
}

function Menu({
  trigger,
  label,
  children,
  align = 'left',
}: {
  trigger: ReactNode
  label: string
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={label}
        className="flex h-8 items-center gap-1 rounded-xs px-2 text-[.84rem] font-semibold text-white/70 transition-colors hover:bg-[#2a2a2a] hover:text-white"
      >
        {trigger}
        <Icon name="chevron" size={13} />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-30 mt-1 min-w-[11rem] rounded-xs border border-[#3a3a3a] bg-[#2a2a2a] p-1 shadow-xl ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

function MenuItem({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xs px-2.5 py-1.5 text-left text-[.86rem] text-white/80 hover:bg-[#3a3a3a] hover:text-white"
    >
      {children}
    </button>
  )
}

export default function EditorToolbar({
  view,
  heading,
  activeTag,
  wordWrap,
  mode,
  onModeChange,
  onLink,
  onInsertBlock,
  onEditTag,
  onSpell,
  onToggleWrap,
  onHelp,
}: {
  view: EditorView | null
  heading: number
  activeTag: TagMatch | null
  wordWrap: boolean
  mode: 'mdx' | 'rich'
  onModeChange: (mode: 'mdx' | 'rich') => void
  onLink: () => void
  onInsertBlock: () => void
  onEditTag: () => void
  onSpell: () => void
  onToggleWrap: () => void
  onHelp: () => void
}) {
  const run = (fn: (v: EditorView) => void) => () => view && fn(view)

  return (
    // Wrap instead of scrolling because an overflow container clips the dropdown menus
    <div className="relative z-20 flex flex-wrap items-center gap-0.5 border-b border-[#3a3a3a] bg-[#1f1f1f] px-2 py-1.5">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onInsertBlock}
        title="Insert component (Ctrl+/)"
        className="flex h-8 flex-shrink-0 items-center gap-1 rounded-xs bg-[#d57f43]/15 pr-3 pl-2 text-[.84rem] leading-none font-semibold text-[#ffb86c] transition-colors hover:bg-[#d57f43]/25"
      >
        <Icon name="plus" size={14} />
        {/* thiccboi's caps sit ~0.5px above the line box's centre */}
        <span className="pt-px">Component</span>
      </button>
      <Divider />
      <Menu
        label="Text style"
        trigger={
          <span className="w-[4.6rem] text-left">{HEADINGS[heading] ?? `Heading ${heading}`}</span>
        }
      >
        {(close) =>
          HEADINGS.map((h, level) => (
            <MenuItem
              key={h}
              onClick={() => {
                if (view) setHeading(view, level)
                close()
              }}
            >
              <span
                className={
                  level === 0
                    ? ''
                    : [
                        '',
                        'text-[1.15rem] font-bold',
                        'text-[1.05rem] font-bold',
                        'font-bold',
                        'font-semibold',
                      ][level]
                }
              >
                {h}
              </span>
            </MenuItem>
          ))
        }
      </Menu>
      <Divider />
      <ToolButton
        icon="bold"
        label="Bold"
        shortcut="Ctrl+B"
        onClick={run((v) => toggleInline(v, '**'))}
      />
      <ToolButton
        icon="italic"
        label="Italic"
        shortcut="Ctrl+I"
        onClick={run((v) => toggleInline(v, '*'))}
      />
      <ToolButton icon="strike" label="Strikethrough" onClick={run((v) => toggleInline(v, '~~'))} />
      <ToolButton
        icon="code"
        label="Inline code"
        onClick={run((v) => toggleInline(v, '`', '`', 'code'))}
      />
      <Divider />
      <ToolButton
        icon="link"
        label="Link"
        shortcut="Ctrl+K"
        onClick={mode === 'rich' ? onLink : run(insertLink)}
      />
      <ToolButton icon="spell" label="Spell tooltip" shortcut="Ctrl+Space" onClick={onSpell} />
      <Menu label="Text colour" trigger={<Icon name="color" size={17} />}>
        {(close) => (
          <>
            {TEXT_COLORS.map((c) => (
              <MenuItem
                key={c.name}
                onClick={() => {
                  if (view) toggleInline(view, `:${c.name}[`, ']')
                  close()
                }}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: c.swatch }} />
                <span className="capitalize">{c.name}</span>
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => {
                if (view) toggleInline(view, ':#ff7d0a[', ']')
                close()
              }}
            >
              <span className="h-3 w-3 rounded-full border border-dashed border-white/40" />
              Custom hex…
            </MenuItem>
          </>
        )}
      </Menu>
      <Divider />
      <ToolButton
        icon="list"
        label="Bulleted list"
        onClick={run((v) => toggleLinePrefix(v, '- '))}
      />
      <ToolButton
        icon="olist"
        label="Numbered list"
        onClick={run((v) => toggleLinePrefix(v, '1. '))}
      />
      <ToolButton icon="quote" label="Quote" onClick={run((v) => toggleLinePrefix(v, '> '))} />
      <ToolButton icon="rule" label="Divider line" onClick={run(insertRule)} />

      <span className="min-w-2 flex-1" />

      {activeTag && mode === 'mdx' && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onEditTag}
          title="Edit this component in a form (Ctrl+E)"
          className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-xs border border-[#d57f43]/50 px-2.5 text-[.82rem] font-semibold text-[#ffb86c] transition-colors hover:bg-[#d57f43]/15"
        >
          <Icon name="edit" size={14} />
          Edit {activeTag.block.label.toLowerCase()}
        </button>
      )}
      {mode === 'mdx' && (
        <ToolButton
          icon="wrap"
          label={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
          active={wordWrap}
          onClick={onToggleWrap}
        />
      )}
      <ToolButton icon="help" label="Writing help" onClick={onHelp} />
      <Divider />
      <div
        className="inline-flex flex-shrink-0 rounded-xs border border-[#3a3a3a] bg-[#1a1a1a] p-0.5"
        role="group"
        aria-label="Editor mode"
      >
        {(['mdx', 'rich'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onModeChange(m)}
            aria-pressed={mode === m}
            title={m === 'mdx' ? 'Edit the MDX source' : 'Edit as rich text'}
            className={`h-7 rounded-xs px-2.5 text-[.8rem] font-semibold transition-colors ${
              mode === m ? 'bg-[#3a3a3a] text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {m === 'mdx' ? 'MDX' : 'Rich text'}
          </button>
        ))}
      </div>
    </div>
  )
}
