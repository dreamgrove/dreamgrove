'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import type { EditorView } from '@codemirror/view'
import type { TagMatch } from '@/lib/admin/editor/blocks/tags'
import {
  insertLink,
  insertRule,
  setHeading,
  toggleInline,
  toggleLinePrefix,
} from '@/lib/admin/editor/commands'
import { TEXT_COLORS } from '@/lib/admin/palette'
import Icon, { type IconName } from '@/components/Icon'
import SegmentedControl from '@/components/admin/ui/SegmentedControl'

export type EditorMode = 'mdx' | 'rich'

const MODES = [
  { value: 'mdx', label: 'MDX', title: 'Edit the MDX source' },
  { value: 'rich', label: 'Rich text', title: 'Edit as rich text' },
] as const

const HEADINGS = ['Body', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4']

function Divider() {
  return <span className="mx-1 h-5 w-px flex-shrink-0 bg-dg-line" aria-hidden />
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
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 flex-shrink-0 items-center gap-1.5 rounded-xs px-2 text-[.84rem] font-semibold transition-colors ${
        active ? 'bg-main/20 text-dg-highlight' : 'text-white/60 hover:bg-dg-panel hover:text-white'
      }`}
    >
      {icon && <Icon box name={icon} size={17} />}
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
  const close = useCallback(() => setOpen(false), [])
  useOutsideClick(ref, close, open)

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={label}
        className="flex h-8 items-center gap-1 rounded-xs px-2 text-[.84rem] font-semibold text-white/70 transition-colors hover:bg-dg-panel hover:text-white"
      >
        {trigger}
        <Icon box name="chevron" size={13} />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-30 mt-1 min-w-[11rem] rounded-xs border border-dg-line bg-dg-panel p-1 shadow-xl ${
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
      className="flex w-full items-center gap-2 rounded-xs px-2.5 py-1.5 text-left text-[.86rem] text-white/80 hover:bg-dg-line hover:text-white"
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
  onImage,
  onEditTag,
  onSpell,
  onToggleWrap,
  onHelp,
}: {
  view: EditorView | null
  heading: number
  activeTag: TagMatch | null
  wordWrap: boolean
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  onLink: () => void
  onInsertBlock: () => void
  onImage: () => void
  onEditTag: () => void
  onSpell: () => void
  onToggleWrap: () => void
  onHelp: () => void
}) {
  const run = (fn: (v: EditorView) => void) => () => view && fn(view)

  return (
    // Wrap instead of scrolling because an overflow container clips the dropdown menus
    <div className="relative z-20 flex flex-wrap items-center gap-0.5 border-b border-dg-line bg-dg-panel-deep px-2 py-1.5">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onInsertBlock}
        title="Insert component (Ctrl+/)"
        className="flex h-8 flex-shrink-0 items-center gap-1 rounded-xs bg-main/15 pr-3 pl-2 text-[.84rem] leading-none font-semibold text-dg-highlight transition-colors hover:bg-main/25"
      >
        <Icon box name="plus" size={14} />
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
      <ToolButton icon="image" label="Image" onClick={onImage} />
      <ToolButton icon="spell" label="Spell tooltip" shortcut="Ctrl+Space" onClick={onSpell} />
      <Menu label="Text colour" trigger={<Icon box name="color" size={17} />}>
        {(close) => (
          <>
            {Object.entries(TEXT_COLORS).map(([name, swatch]) => (
              <MenuItem
                key={name}
                onClick={() => {
                  if (view) toggleInline(view, `:${name}[`, ']')
                  close()
                }}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: swatch }} />
                <span className="capitalize">{name}</span>
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
          className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-xs border border-main/50 px-2.5 text-[.82rem] font-semibold text-dg-highlight transition-colors hover:bg-main/15"
        >
          <Icon box name="edit" size={14} />
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
      <SegmentedControl
        label="Editor mode"
        options={MODES}
        value={mode}
        onChange={onModeChange}
        keepFocus
      />
    </div>
  )
}
