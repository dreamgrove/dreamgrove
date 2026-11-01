'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import { autocompletion } from '@codemirror/autocomplete'
import { insertLink, toggleInline } from '@/lib/admin/editor/commands'
import { errorLineField, showErrorLine } from '@/lib/admin/editor/errorLines'
import { editorTheme, mdxLanguage } from '@/lib/admin/editor/mdxTheme'
import { richModeExtension } from '@/lib/admin/editor/rich/extension'
import type { LinkAnchor, RichHandlers } from '@/lib/admin/editor/rich/types'
import { sectionGuideExtension } from '@/lib/admin/editor/sectionGuides'
import { spellTokenExtension } from '@/lib/admin/editor/spellTokens'
import type { ImageUploads } from '@/lib/admin/imageUploads'
import { useBlockDialogs } from '@/hooks/admin/useBlockDialogs'
import { useCursorInfo } from '@/hooks/admin/useCursorInfo'
import { useInlineSpellSearch } from '@/hooks/admin/useInlineSpellSearch'
import { useLatest } from '@/hooks/admin/useLatest'
import { usePersistedState } from '@/hooks/usePersistedState'
import BlockForm from './blocks/BlockForm'
import BlockPalette from './blocks/BlockPalette'
import EditorToolbar, { type EditorMode } from './EditorToolbar'
import HelpDialog from './HelpDialog'
import LinkPopover from './LinkPopover'
import SpellPicker from './SpellPicker'
import StatusBar from './StatusBar'

type LinkTarget = { from: number; to: number; at?: LinkAnchor }

/** The link under the selection, else the selection itself */
function linkAtSelection(view: EditorView): LinkTarget {
  const { from, to } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  for (const m of line.text.matchAll(/!?\[[^\]]*\]\([^)]*\)/g)) {
    const a = line.from + (m.index ?? 0)
    const b = a + m[0].length
    if (!m[0].startsWith('!') && from >= a && to <= b) return { from: a, to: b }
  }
  return { from, to }
}

/**
 * CodeMirror + its dialogs and popovers (components, links, spells, help).
 */
export default function EditorPane({
  value,
  onChange,
  filePath,
  currentSpec,
  images,
  errorLine,
  onSave,
  onViewChange,
}: {
  value: string
  onChange: (value: string) => void
  filePath: string
  currentSpec: string | null
  images: ImageUploads
  /** 1-based line the preview failed at */
  errorLine: number | null
  onSave: () => void
  onViewChange: (view: EditorView | null) => void
}) {
  const viewRef = useRef<EditorView | null>(null)
  const [view, setView] = useState<EditorView | null>(null)
  const [mode, setMode] = usePersistedState<EditorMode>('editor-mode', 'mdx')
  const [wordWrap, setWordWrap] = usePersistedState('editor-word-wrap', true)
  const [showHelp, setShowHelp] = useState(false)
  const [link, setLink] = useState<LinkTarget | null>(null)
  const closeLink = useCallback(() => setLink(null), [])

  const blocks = useBlockDialogs(viewRef)
  const spells = useInlineSpellSearch(viewRef, currentSpec)
  const { cursor, extension: cursorExtension } = useCursorInfo()

  useEffect(() => () => onViewChange(null), [onViewChange])

  useEffect(() => {
    if (view) showErrorLine(view, errorLine)
  }, [view, errorLine])

  const openLink = () => {
    if (viewRef.current) setLink(linkAtSelection(viewRef.current))
  }

  const changeMode = (next: EditorMode) => {
    setMode(next)
    setLink(null)
  }

  const actions = useLatest({ openLink, onSave, mode, blocks })
  const richHandlers = useLatest<RichHandlers>({
    editTag: (pos) => void blocks.editTagAt(pos),
    openLink: (from, to, at) => setLink({ from, to, at }),
    editSnippet: blocks.editSnippet,
    imageUrl: (src) => images.previewUrl(src) ?? src,
  })

  const shortcuts = useMemo(
    () =>
      Prec.highest(
        keymap.of([
          { key: 'Mod-b', run: (v) => (toggleInline(v, '**'), true) },
          { key: 'Mod-i', run: (v) => (toggleInline(v, '*'), true) },
          {
            key: 'Mod-k',
            run: (v) => (
              actions.current.mode === 'rich' ? actions.current.openLink() : insertLink(v),
              true
            ),
          },
          { key: 'Mod-/', run: () => (actions.current.blocks.openPalette(), true) },
          { key: 'Mod-e', run: () => actions.current.blocks.editTagAtCursor() },
          { key: 'Mod-s', run: () => (actions.current.onSave(), true) },
        ])
      ),
    [actions]
  )

  const extensions = useMemo(
    () => [
      ...mdxLanguage,
      errorLineField,
      ...spellTokenExtension,
      // Rich mode draws sections as boxes instead
      ...(mode === 'mdx' ? sectionGuideExtension : []),
      ...(wordWrap || mode === 'rich' ? [EditorView.lineWrapping] : []),
      ...(mode === 'rich' ? [richModeExtension(richHandlers)] : []),
      autocompletion({ defaultKeymap: false }),
      spells.extension,
      shortcuts,
      cursorExtension,
    ],
    [mode, wordWrap, richHandlers, spells.extension, shortcuts, cursorExtension]
  )

  const basicSetup = useMemo(
    () => ({
      lineNumbers: mode === 'mdx',
      highlightActiveLine: mode === 'mdx',
      highlightActiveLineGutter: mode === 'mdx',
      foldGutter: mode === 'mdx',
      autocompletion: false,
      completionKeymap: false,
      closeBrackets: true,
      searchKeymap: true,
    }),
    [mode]
  )

  return (
    <>
      <EditorToolbar
        view={view}
        heading={cursor.heading}
        activeTag={cursor.tag}
        wordWrap={wordWrap}
        mode={mode}
        onModeChange={changeMode}
        onLink={openLink}
        onInsertBlock={blocks.openPalette}
        onImage={() => blocks.insert('image')}
        onEditTag={blocks.editTagAtCursor}
        onSpell={spells.start}
        onToggleWrap={() => setWordWrap((w) => !w)}
        onHelp={() => setShowHelp(true)}
      />
      <div className="relative min-h-0 flex-1">
        <CodeMirror
          value={value}
          onChange={onChange}
          height="100%"
          className="h-full"
          theme={editorTheme}
          extensions={extensions}
          placeholder="Start writing. Use the Component button to add custom elements."
          basicSetup={basicSetup}
          onCreateEditor={(created) => {
            viewRef.current = created
            setView(created)
            onViewChange(created)
          }}
        />
        {link && view && (
          <LinkPopover
            key={`${link.from}-${link.to}`}
            view={view}
            from={link.from}
            to={link.to}
            at={link.at}
            onClose={closeLink}
          />
        )}
        <SpellPicker {...spells.picker} currentSpec={currentSpec} />
      </div>
      <StatusBar line={cursor.line} col={cursor.col} text={value} />

      {blocks.paletteOpen && (
        <BlockPalette filePath={filePath} onClose={blocks.closePalette} onPick={blocks.pick} />
      )}
      {blocks.form && (
        <BlockForm
          block={blocks.form.block}
          initial={blocks.form.initial}
          mode={blocks.form.mode}
          currentSpec={currentSpec}
          images={images}
          onClose={blocks.closeForm}
          onBack={blocks.form.mode === 'insert' ? blocks.backToPalette : undefined}
          onSubmit={blocks.submit}
        />
      )}
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
    </>
  )
}
