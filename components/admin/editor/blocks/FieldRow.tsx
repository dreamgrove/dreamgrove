'use client'

import type { ReactNode } from 'react'
import type { Field, TalentColor } from '@/lib/admin/editor/blocks/registry'
import type { ImageUploads } from '@/lib/admin/imageUploads'
import type { Spell } from '@/lib/admin/spells'
import Icon from '@/components/Icon'
import { HELP, INPUT, LABEL, TEXTAREA } from '@/components/admin/ui/styles'
import ChipInput from './ChipInput'
import ImageInput from './ImageInput'
import { SpellInput, SpellList } from './SpellInputs'
import TableInput from './TableInput'
import TalentColors from './TalentColors'

/** One form field: its label, the control for its kind, and its help text */

export default function FieldRow({
  field,
  value,
  locked,
  currentSpec,
  images,
  onChange,
  onSpellPick,
}: {
  field: Field
  value: unknown
  locked: boolean
  currentSpec: string | null
  images: ImageUploads
  onChange: (v: unknown) => void
  onSpellPick: (spell: Spell) => void
}) {
  const id = `bf-${field.key}`
  const mono = field.mono ? 'font-mono text-[.8125rem] text-[#FFF5E4]' : ''
  let control: ReactNode

  if (locked) {
    control = (
      <p className="m-0 rounded-md border border-dashed border-[#525252] px-3 py-2.5 text-[.82rem] leading-snug text-[#a3a3a3]">
        The form can't read this expression. Edit it in the source.
      </p>
    )
  } else {
    switch (field.kind) {
      case 'textarea':
        control = (
          <textarea
            id={id}
            rows={field.rows ?? (field.mono ? 3 : 2)}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            spellCheck={!field.mono}
            className={`${TEXTAREA} ${mono} ${field.mono ? 'break-all' : ''}`}
          />
        )
        break
      case 'number':
        control = (
          <input
            id={id}
            type="number"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={INPUT}
          />
        )
        break
      case 'select':
        control = (
          <select
            id={id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT} pr-8`}
          >
            {value && !field.options?.some((o) => o.value === value) ? (
              <option value={String(value)}>{String(value)}</option>
            ) : null}
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
        break
      case 'spell':
        control = (
          <SpellInput
            id={id}
            value={String(value ?? '')}
            currentSpec={currentSpec}
            onChange={(v) => onChange(v)}
            onPick={onSpellPick}
          />
        )
        break
      case 'spells':
        control = (
          <SpellList
            id={id}
            value={(value as string[]) ?? []}
            currentSpec={currentSpec}
            onChange={onChange}
          />
        )
        break
      case 'strings':
        control = (
          <ChipInput
            id={id}
            value={(value as string[]) ?? []}
            onChange={onChange}
            suggest={field.suggest}
          />
        )
        break
      case 'talentColors':
        control = <TalentColors value={(value as TalentColor[]) ?? []} onChange={onChange} />
        break
      case 'table':
        control = <TableInput value={(value as string[][]) ?? []} onChange={onChange} />
        break
      case 'image':
        control = (
          <ImageInput
            id={id}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            images={images}
            onChange={onChange}
          />
        )
        break
      default:
        control = (
          <input
            id={id}
            type="text"
            value={String(value ?? '')}
            onChange={(e) =>
              onChange(field.normalize ? field.normalize(e.target.value) : e.target.value)
            }
            placeholder={field.placeholder}
            spellCheck={!field.mono}
            className={`${INPUT} ${mono}`}
          />
        )
    }
  }

  return (
    <div className={field.wide ? 'sm:col-span-2' : ''}>
      {field.label && (
        <label htmlFor={id} className={LABEL}>
          {field.label}
          {field.required && <span className="ml-0.5 text-[#d57f43]">*</span>}
        </label>
      )}
      {control}
      {(field.help || field.link) && (
        <p className={`mt-2 mb-0 ${HELP}`}>
          {field.help}
          {field.link && (
            <a
              href={field.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 font-semibold text-[#ffb86c] hover:underline ${field.help ? 'ml-1.5' : ''}`}
            >
              {field.link.label}
              <Icon box name="external" size={11} />
            </a>
          )}
        </p>
      )}
    </div>
  )
}
