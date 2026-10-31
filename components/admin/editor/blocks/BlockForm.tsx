'use client'

import { Fragment, useState } from 'react'
import type { BlockDef, Field } from '@/lib/admin/editor/blocks/registry'
import { validate, type FormState } from '@/lib/admin/editor/blocks/form'
import type { ImageUploads } from '@/lib/admin/imageUploads'
import Dialog from '@/components/admin/ui/Dialog'
import Icon from '@/components/Icon'
import { BTN_OUTLINE, BTN_PRIMARY, CHECKBOX, HELP } from '@/components/admin/ui/styles'
import FieldRow from './FieldRow'

/** Splits fields into titled sections */
function layout(fields: Field[]) {
  const sections: { title?: string; groups: Field[][] }[] = []
  for (const f of fields) {
    let sec = sections[sections.length - 1]
    if (!sec || (f.section && f.section !== sec.title)) {
      sec = { title: f.section, groups: [] }
      sections.push(sec)
    }
    const last = sec.groups[sec.groups.length - 1]
    if (f.kind === 'bool' && last?.[0].kind === 'bool') last.push(f)
    else sec.groups.push([f])
  }
  return sections
}

export default function BlockForm({
  block,
  initial,
  mode,
  currentSpec,
  images,
  onSubmit,
  onBack,
  onClose,
}: {
  block: BlockDef
  initial: FormState
  mode: 'insert' | 'edit'
  currentSpec: string | null
  images: ImageUploads
  onSubmit: (state: FormState) => void
  onBack?: () => void
  onClose: () => void
}) {
  const [state, setState] = useState<FormState>(initial)
  const [submitted, setSubmitted] = useState(false)
  const error = validate(block, state)

  const set = (key: string, value: unknown) =>
    setState((s) => ({ ...s, values: { ...s.values, [key]: value } }))

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSubmitted(true)
    if (!error) onSubmit(state)
  }

  return (
    <Dialog
      eyebrow={
        <>
          {onBack ? (
            <button type="button" onClick={onBack} className="hover:text-white">
              Insert component
            </button>
          ) : (
            <span>{mode === 'edit' ? 'Edit component' : 'Insert component'}</span>
          )}
          <span>/</span>
          <span>{block.category}</span>
        </>
      }
      title={block.label}
      subtitle={block.description}
      onClose={onClose}
      width="max-w-[720px]"
      footer={
        <>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-1 py-[7px] text-[.875rem] font-medium text-[#bdbdbd] transition-colors hover:text-white"
            >
              <Icon box name="back" size={13} />
              All components
            </button>
          )}
          <span className="flex-1 text-[.8125rem] text-red-400">{submitted && error}</span>
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Cancel
          </button>
          <button type="button" onClick={() => submit()} className={BTN_PRIMARY}>
            {mode === 'edit' ? 'Update component' : 'Insert component'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-[26px]">
        {layout(block.fields).map((section, si) => (
          <Fragment key={si}>
            {si > 0 && <div className="h-px bg-[#383838]" />}
            <section className="grid grid-cols-1 gap-x-3 gap-y-3.5 sm:grid-cols-2">
              {section.title && (
                <h3 className="m-0 text-[.9375rem] font-semibold text-white sm:col-span-2">
                  {section.title}
                </h3>
              )}
              {section.groups.map((group) =>
                group[0].kind === 'bool' ? (
                  <div
                    key={group[0].key}
                    className="flex flex-col overflow-hidden rounded-md border border-[#383838] sm:col-span-2"
                  >
                    {group.map((f, i) => (
                      <label
                        key={f.key}
                        className={`flex cursor-pointer items-center gap-3 bg-[#2a2a2a] px-3.5 py-[11px] transition-colors hover:bg-[#303030] ${
                          i ? 'border-t border-[#383838]' : ''
                        }`}
                      >
                        <input
                          id={`bf-${f.key}`}
                          type="checkbox"
                          checked={!!state.values[f.key]}
                          disabled={state.locked.includes(f.key)}
                          onChange={(e) => set(f.key, e.target.checked)}
                          className={CHECKBOX}
                        />
                        <span className="flex flex-col gap-px">
                          <span className="text-[.875rem] font-semibold text-white">{f.label}</span>
                          {f.help && <span className={HELP}>{f.help}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <FieldRow
                    key={group[0].key}
                    field={group[0]}
                    value={state.values[group[0].key]}
                    locked={state.locked.includes(group[0].key)}
                    currentSpec={currentSpec}
                    images={images}
                    onChange={(v) => set(group[0].key, v)}
                    onSpellPick={(spell) => {
                      // Prefill the display name for toggles/links when it's still empty
                      if ('name' in state.values && !state.values.name) set('name', spell.name)
                    }}
                  />
                )
              )}
            </section>
          </Fragment>
        ))}
        {state.passthrough.length > 0 && (
          <p className="m-0 text-[.8rem] text-[#8a8a8a]">
            Kept as written:{' '}
            <span className="font-mono text-[#bdbdbd]">
              {state.passthrough.map((a) => a.name || a.raw).join(', ')}
            </span>
          </p>
        )}
        {/* Enter in a single-line input submits */}
        <button type="submit" hidden />
      </form>
    </Dialog>
  )
}
