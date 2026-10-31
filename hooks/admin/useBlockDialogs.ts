import { useRef, useState, type RefObject } from 'react'
import type { EditorView } from '@codemirror/view'
import { BLOCKS_BY_ID, type BlockDef } from '@/lib/admin/editor/blocks/registry'
import {
  buildBlock,
  emptyForm,
  formFromTag,
  serializeOpeningTag,
  type FormState,
} from '@/lib/admin/editor/blocks/form'
import { findClose, tagAtPos, type TagMatch } from '@/lib/admin/editor/blocks/tags'
import { insertBlock, replaceRange } from '@/lib/admin/editor/commands'

export interface OpenBlockForm {
  block: BlockDef
  initial: FormState
  mode: 'insert' | 'edit'
  selection: string
  /** Opening tag */
  target?: TagMatch
  /** Range replaced whole by the built component on submit */
  replace?: { from: number; to: number }
}

/** The component palette and the insert/edit form for a block, acting on the editor */
export function useBlockDialogs(viewRef: RefObject<EditorView | null>) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [form, setForm] = useState<OpenBlockForm | null>(null)
  // Selected text when the palette opened
  const selectionRef = useRef('')

  const captureSelection = () => {
    const view = viewRef.current
    const sel = view?.state.selection.main
    selectionRef.current = view && sel ? view.state.sliceDoc(sel.from, sel.to) : ''
  }

  const openPalette = () => {
    captureSelection()
    setPaletteOpen(true)
  }

  const pick = (block: BlockDef) => {
    setPaletteOpen(false)
    setForm({ block, initial: emptyForm(block), mode: 'insert', selection: selectionRef.current })
  }

  /** Opens the insert form for one block directly, skipping the palette (toolbar shortcuts) */
  const insert = (blockId: string) => {
    const block = BLOCKS_BY_ID.get(blockId)
    if (!block) return
    captureSelection()
    pick(block)
  }

  /** Opens the form for the component whose opening tag holds `pos`; false if none */
  const editTagAt = (pos: number): boolean => {
    const view = viewRef.current
    const tag = view && tagAtPos(view.state, pos)
    if (!view || !tag) return false
    const bodyField = tag.block.fields.find((f) => f.body)
    if (!bodyField) {
      setForm({
        block: tag.block,
        initial: formFromTag(tag),
        mode: 'edit',
        selection: '',
        target: tag,
      })
      return true
    }
    // A block with an optional body (Talents) is rewritten whole, tags and content
    const doc = view.state.doc.toString()
    const close = tag.selfClosing ? undefined : findClose(doc, tag.tag, tag.to)
    const initial = formFromTag(tag)
    initial.values[bodyField.key] = close ? doc.slice(tag.to, close.from).trim() : ''
    setForm({
      block: tag.block,
      initial,
      mode: 'edit',
      selection: '',
      replace: { from: tag.from, to: close?.to ?? tag.to },
    })
    return true
  }

  const editTagAtCursor = () => {
    const view = viewRef.current
    return !!view && editTagAt(view.state.selection.main.head)
  }

  /** Opens a snippet block's form (image, table, callout) replacing `from`–`to` */
  const editSnippet = (
    blockId: string,
    values: Record<string, unknown>,
    from: number,
    to: number
  ) => {
    const block = BLOCKS_BY_ID.get(blockId)
    if (!block) return
    setForm({
      block,
      initial: { values, passthrough: [], locked: [] },
      mode: 'edit',
      selection: '',
      replace: { from, to },
    })
  }

  const submit = (state: FormState) => {
    const view = viewRef.current
    if (!view || !form) return
    const { block, target, selection, replace } = form
    if (replace) {
      replaceRange(view, replace.from, replace.to, buildBlock(block, state, ''))
    } else if (target) {
      replaceRange(
        view,
        target.from,
        target.to,
        serializeOpeningTag(block, target.tag, state, target.selfClosing)
      )
    } else {
      const usesSelection = block.wraps || block.id === 'callout' || block.id === 'conditional'
      if (!usesSelection) view.dispatch({ selection: { anchor: view.state.selection.main.to } })
      insertBlock(view, buildBlock(block, state, usesSelection ? selection : ''))
    }
    setForm(null)
  }

  const closeForm = () => {
    setForm(null)
    viewRef.current?.focus()
  }

  const backToPalette = () => {
    setForm(null)
    setPaletteOpen(true)
  }

  return {
    paletteOpen,
    closePalette: () => setPaletteOpen(false),
    openPalette,
    pick,
    insert,
    form,
    editTagAt,
    editTagAtCursor,
    editSnippet,
    submit,
    closeForm,
    backToPalette,
  }
}
